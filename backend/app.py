import os
import sys
import time
import logging
import threading
import random
import numpy as np
import cv2
import cvzone
from flask import Flask, Response, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from ultralytics import YOLO
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Suppress OpenCV / FFmpeg log noise (Python-level)
os.environ['OPENCV_LOG_LEVEL'] = 'OFF'
os.environ['OPENCV_VIDEOIO_PRIORITY_BACKEND'] = '0'

# Disable Flask console noise
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

# Allow the Netlify frontend (and localhost for dev) to call the API
_frontend_url = os.getenv('FRONTEND_URL', '*')
CORS(app, origins=[_frontend_url, 'http://localhost:3007', 'http://localhost:3006', 'http://localhost:3008', 'http://127.0.0.1:3007'])
socketio = SocketIO(app, cors_allowed_origins='*', async_mode='threading')

# --- Configuration (env-driven) ---
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path  = os.path.join(base_dir, os.getenv('MODEL_PATH',   'final_model.pt'))
video_path_1 = os.path.join(base_dir, os.getenv('VIDEO_PATH_1', 'Parking_Lot_CCTV_1.mp4'))
video_path_2 = os.path.join(base_dir, os.getenv('VIDEO_PATH_2', 'Parking_Lot_CCTV_2.1.mp4'))

classNames = ['occupied_slot', 'free_slot']

# --- In-memory stats (protected by a lock, updated by background sampler) ---
_stats_lock = threading.Lock()
_slot_stats = {
    "totalSlots":    396,
    "occupiedSlots": 271,
    "freeSlots":     125,
    "occupancyRate": 68.4,
}
_system_metrics = {
    "dailyRevenue":    22400,
    "activeVehicles":  143,
    "violations":      3,
}

# --- Load Model Once (shared across all threads) ---
print("\n--- Loading Shared YOLO Model ---")
try:
    model = YOLO(model_path)
    model.to('cpu')
    print("✅ Model Loaded into Memory.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    sys.exit()




# ---------------------------------------------------------------------------
# Background Stats Sampler
# ---------------------------------------------------------------------------

def _sample_one_frame(path: str):
    """Open a video, jump to a random frame, run inference, return (occupied, free)."""
    if not _is_valid_video(path):
        return None
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        return None

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total > 1:
        cap.set(cv2.CAP_PROP_POS_FRAMES, random.randint(0, total - 1))

    success, frame = cap.read()
    cap.release()
    if not success:
        return None

    frame = cv2.resize(frame, (640, 480))
    results = model(frame, stream=False, verbose=False, conf=0.4)

    occupied = free = 0
    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            if cls < len(classNames):
                if classNames[cls] == 'occupied_slot':
                    occupied += 1
                else:
                    free += 1
    return occupied, free


def background_stats_updater():
    """Daemon thread: sample a frame every 10 s and update in-memory counters."""
    while True:
        try:
            result = _sample_one_frame(video_path_1)
            if result:
                occupied, free = result
                total = occupied + free
                if total > 0:
                    rate = round((occupied / total) * 100, 1)
                    with _stats_lock:
                        _slot_stats['occupiedSlots'] = occupied
                        _slot_stats['freeSlots']     = free
                        _slot_stats['totalSlots']    = total
                        _slot_stats['occupancyRate'] = rate
                        _system_metrics['activeVehicles'] = occupied
                        _system_metrics['dailyRevenue']   = round(occupied * 150 * 0.8)
                        _system_metrics['violations']     = random.randint(0, 5)

                    # Push to all connected WebSocket clients
                    socketio.emit('slot_updates', dict(_slot_stats))
                    socketio.emit('stats-update', dict(_slot_stats))
        except Exception as exc:
            print(f"[Stats Sampler] Error: {exc}")

        time.sleep(10)


# ---------------------------------------------------------------------------
# MJPEG Stream Logic
# ---------------------------------------------------------------------------

def _make_placeholder_frame(message: str = 'Signal Lost') -> bytes:
    """Generate a dark 640x480 placeholder JPEG with a centred text label."""
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    img[:] = (20, 20, 30)  # dark navy background
    font = cv2.FONT_HERSHEY_SIMPLEX
    text_size = cv2.getTextSize(message, font, 1.0, 2)[0]
    x = (640 - text_size[0]) // 2
    y = (480 + text_size[1]) // 2
    cv2.putText(img, message, (x, y), font, 1.0, (80, 80, 80), 2, cv2.LINE_AA)
    cv2.putText(img, 'Park Prabandh AI', (x + 20, y + 40), font, 0.5, (50, 100, 200), 1, cv2.LINE_AA)
    _, buf = cv2.imencode('.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 80])
    return buf.tobytes()


def _is_valid_video(path: str) -> bool:
    """Return True only if the file is a real, openable video (not an LFS pointer)."""
    if not os.path.exists(path):
        return False
    if os.path.getsize(path) < 10_000:  # LFS pointer files are ~134 bytes
        return False
    cap = cv2.VideoCapture(path)
    ok = cap.isOpened() and int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) > 0
    cap.release()
    return ok


def stream_logic(path: str):
    """Yield MJPEG frames with YOLO overlays for the given video path."""
    # If the file is an LFS pointer or missing, stream a placeholder
    if not _is_valid_video(path):
        print(f"[Stream] '{os.path.basename(path)}' is not a valid video "
              "(LFS pointer or missing). Streaming placeholder.")
        placeholder = _make_placeholder_frame('Signal Lost – Video Unavailable')
        frame_bytes = (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n'
                       + placeholder + b'\r\n')
        while True:
            yield frame_bytes
            time.sleep(0.5)   # ~2 fps placeholder
        return

    cap = cv2.VideoCapture(path)

    while True:
        success, img = cap.read()

        # Loop the video when it ends
        if not success:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        # Resize for faster inference
        img = cv2.resize(img, (640, 480))

        results = model(img, stream=True, verbose=False, conf=0.4)

        for r in results:
            for box in r.boxes:
                cls   = int(box.cls[0])
                label = classNames[cls] if cls < len(classNames) else "Unknown"
                color = (0, 255, 0) if label == 'free_slot' else (0, 0, 255)

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                w, h = x2 - x1, y2 - y1
                cvzone.cornerRect(img, (x1, y1, w, h), t=2, rt=0,
                                  colorC=color, colorR=color)

        ret, buffer = cv2.imencode('.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 80])
        if not ret:
            continue

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')


# ---------------------------------------------------------------------------
# Start background stats sampler at module load (works for both gunicorn & direct)
# ---------------------------------------------------------------------------
_stats_thread = threading.Thread(target=background_stats_updater, daemon=True)
_stats_thread.start()

# ---------------------------------------------------------------------------
# REST Routes
# ---------------------------------------------------------------------------

@app.route('/health')
def health():
    """Simple liveness probe."""
    return jsonify({"status": "ok"})


@app.route('/slot_stats')
def slot_stats():
    """Return current slot occupancy counters."""
    with _stats_lock:
        return jsonify(dict(_slot_stats))


@app.route('/system_metrics')
def system_metrics():
    """Return revenue / vehicle / violation metrics."""
    with _stats_lock:
        return jsonify(dict(_system_metrics))


@app.route('/video_feed_1')
def video_feed_1():
    """AI-annotated MJPEG stream — Camera 1."""
    return Response(stream_logic(video_path_1),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/video_feed_2')
def video_feed_2():
    """AI-annotated MJPEG stream — Camera 2."""
    return Response(stream_logic(video_path_2),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# ---------------------------------------------------------------------------
# SocketIO Events
# ---------------------------------------------------------------------------

@socketio.on('connect')
def handle_connect():
    print("[SocketIO] Client connected")
    with _stats_lock:
        emit('slot_updates', dict(_slot_stats))


@socketio.on('subscribe')
def handle_subscribe(channel):
    print(f"[SocketIO] Client subscribed to: {channel}")


@socketio.on('disconnect')
def handle_disconnect():
    print("[SocketIO] Client disconnected")


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.getenv('PORT', 5000))

    print("\n🚀 Park Prabandh AI Server Active")
    print(f"🔗 Health:         http://localhost:{port}/health")
    print(f"🔗 Slot Stats:     http://localhost:{port}/slot_stats")
    print(f"🔗 Sys Metrics:    http://localhost:{port}/system_metrics")
    print(f"🔗 Feed 1:         http://localhost:{port}/video_feed_1")
    print(f"🔗 Feed 2:         http://localhost:{port}/video_feed_2")

    # socketio.run keeps WebSocket support alive
    socketio.run(app, host='0.0.0.0', port=port, debug=False)
