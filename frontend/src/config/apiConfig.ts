/**
 * Centralised API configuration.
 *
 * In development set VITE_API_URL in frontend/.env
 * e.g.  VITE_API_URL=http://localhost:5000
 *
 * Falls back to localhost:5000 so the project works with no .env file.
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000';

/** Convenience alias used for Socket.IO connections */
export const WS_URL: string = API_BASE_URL;
