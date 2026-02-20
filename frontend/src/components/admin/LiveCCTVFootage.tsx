import { useState } from 'react';
import { Maximize2, RefreshCcw, Video, Camera, Shield, Activity } from 'lucide-react';
import Button from '../../components/shared/Button';
import { API_BASE_URL } from '@/config/apiConfig';

const LiveCCTVFootage = () => {
  const [enlargedCameraId, setEnlargedCameraId] = useState<number>(1); 
  const [isRecording, setIsRecording] = useState(true);

  // We assign the streamUrl to whichever camera we want to be the "Active AI" camera
  const [cameras, setCameras] = useState([
    { id: 1, name: 'Main Entrance - North', location: 'Gate A', streamUrl: `${API_BASE_URL}/video_feed_1`, isAiActive: true },
    { id: 2, name: 'Exit Ramp - South',       location: 'Gate B', streamUrl: `${API_BASE_URL}/video_feed_2`, isAiActive: false  },
    { id: 3, name: 'Level 1 - Section C', location: 'Internal', streamUrl: 'https://images.unsplash.com/photo-1590674852885-ce045029e8c7?w=800', isAiActive: false },
    { id: 4, name: 'VIP Parking Area', location: 'Internal', streamUrl: 'https://images.unsplash.com/photo-1570126128862-da230999f1c9?w=800', isAiActive: false },
  ]);

  // Find the currently selected camera object
  const enlargedCamera = cameras.find(c => c.id === enlargedCameraId) || cameras[0];
  
  // Filter out the enlarged one for the sidebar
  const smallCameras = cameras.filter(c => c.id !== enlargedCameraId);

  const handleSwitch = (id: number) => {
    // This triggers the re-render. The main view will now use the streamUrl of this new ID.
    setEnlargedCameraId(id);
  };

  return (
    <div className="bg-gray-950 rounded-[2rem] shadow-2xl p-8 text-white border border-gray-800 transition-all duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black flex items-center tracking-tight">
            <span className="flex h-3 w-3 bg-red-600 rounded-full animate-pulse mr-4"></span>
            Live Security Surveillance
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <Shield size={14} className="text-blue-500"/> Multi-channel AI Active
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <Activity size={14} className="text-green-500"/> System Health: Optimal
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-900 px-5 py-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 transition text-sm font-bold flex items-center gap-2">
            <Camera size={16} /> Snapshot
          </button>
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`${isRecording ? 'bg-red-600/10 text-red-500 border border-red-600/50' : 'bg-gray-800 text-gray-400 border border-gray-700'} px-5 py-2.5 rounded-xl transition flex items-center text-sm font-black tracking-widest`}
          >
            {isRecording ? '● RECORDING' : '▶ RESUME'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* MAIN VIEW */}
        <div className="flex-1 group">
          <div className="relative rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-gray-800 aspect-video">
            {/* The Source dynamically changes based on state */}
            <img 
              src={enlargedCamera.streamUrl} 
              alt={enlargedCamera.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/1280x720/1a1a1a/666666?text=Signal+Lost';
              }}
            />
            
            {/* Overlays */}
            <div className="absolute top-6 left-6 z-10">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Channel {enlargedCamera.id}</span>
                <span className="text-sm font-bold text-white uppercase">{enlargedCamera.name}</span>
              </div>
            </div>

            <div className="absolute top-6 right-6 flex items-center gap-2">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg shadow-red-900/20">LIVE</span>
              <span className="bg-black/60 backdrop-blur-md text-gray-300 px-3 py-1 rounded-full text-[10px] font-mono border border-white/10">1080P // 30FPS</span>
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 flex justify-between items-end">
               <div className="flex gap-4 text-[10px] font-mono text-gray-400">
                  <span>LAT: 18.5204° N</span>
                  <span>LONG: 73.8567° E</span>
               </div>
               <div className="flex gap-2">
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-md transition border border-white/5"><Maximize2 size={16}/></button>
               </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:w-80 flex flex-col gap-5">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-1">Live CCTV Multi-Channel Feed</h3>
          
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {smallCameras.map((cam) => (
              <div 
                key={cam.id}
                onClick={() => handleSwitch(cam.id)}
                className="relative group cursor-pointer rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-600/50 transition-all duration-300 bg-gray-900 shadow-lg"
              >
                <div className="aspect-video relative">
                  {/* Small Preview Image */}
                  <img 
                    src={cam.streamUrl} 
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-500" 
                    alt="preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x225/000000/333333?text=Offline';
                    }}
                  />
                  
                  {/* Labels */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm p-3 border-t border-gray-800">
                     <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{cam.name}</p>
                  </div>
                </div>

                {/* Hover Overlay Button */}
                <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                   <div className="flex flex-col items-center gap-2">
                      <RefreshCcw size={20} className="text-white animate-spin-slow" />
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white text-blue-600 px-3 py-1 rounded-full shadow-xl">Switch Feed</span>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Log */}
          <div className="bg-black/40 border border-gray-800 rounded-3xl p-5 font-mono text-[10px] h-32 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping inline-block"></span></div>
              <p className="text-blue-500 font-black mb-2 tracking-widest uppercase">Detection Engine v4.2</p>
              <div className="space-y-1 text-gray-500 italic">
                <p>{`> Searching for objects on Cam ${enlargedCameraId}...`}</p>
                <p>{`> Analysis: ${enlargedCamera.id === 1 ? 'High-Confidence Slot Analysis' : 'Passive Monitoring'}`}</p>
                <p>{`> 00:23:14 Server Handshake Successful`}</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCCTVFootage;
