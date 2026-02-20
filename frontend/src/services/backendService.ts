/**
 * backendService.ts
 *
 * Thin Axios wrapper around the Flask AI backend endpoints.
 * Provides typed fetcher functions ready for use with TanStack React Query.
 *
 * Endpoints consumed:
 *   GET /health          → HealthResponse
 *   GET /slot_stats      → SlotStats
 *   GET /system_metrics  → SystemMetrics
 */
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

// ─── Axios instance pointing directly at the Flask backend ───────────────────
const backendApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: 'ok' | string;
}

export interface SlotStats {
  totalSlots: number;
  occupiedSlots: number;
  freeSlots: number;
  occupancyRate: number;
}

export interface SystemMetrics {
  dailyRevenue: number;
  activeVehicles: number;
  violations: number;
}

// ─── Fallback / default values (used when backend is unreachable) ─────────────

export const DEFAULT_SLOT_STATS: SlotStats = {
  totalSlots:    396,
  occupiedSlots: 271,
  freeSlots:     125,
  occupancyRate: 68.4,
};

export const DEFAULT_SYSTEM_METRICS: SystemMetrics = {
  dailyRevenue:   22400,
  activeVehicles: 143,
  violations:     3,
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/**
 * Ping the backend liveness probe.
 * React Query key: ['health']
 */
export async function fetchHealthCheck(): Promise<HealthResponse> {
  const { data } = await backendApi.get<HealthResponse>('/health');
  return data;
}

/**
 * Fetch live slot occupancy counters updated by the AI sampler.
 * React Query key: ['slotStats']
 */
export async function fetchSlotStats(): Promise<SlotStats> {
  const { data } = await backendApi.get<SlotStats>('/slot_stats');
  return data;
}

/**
 * Fetch dashboard-level revenue / vehicle / violation metrics.
 * React Query key: ['systemMetrics']
 */
export async function fetchSystemMetrics(): Promise<SystemMetrics> {
  const { data } = await backendApi.get<SystemMetrics>('/system_metrics');
  return data;
}
