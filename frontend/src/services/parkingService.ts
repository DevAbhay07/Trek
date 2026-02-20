import { 
  ParkingLot, 
  ParkingSlot, 
  SlotStatus, 
  SlotFilter 
} from '@/types';
import { apiClient } from './apiClient';

export interface ParkingService {
  getParkingLots(): Promise<ParkingLot[]>;
  getParkingLot(id: string): Promise<ParkingLot>;
  getSlots(lotId?: string, filters?: SlotFilter): Promise<ParkingSlot[]>;
  getSlot(id: string): Promise<ParkingSlot>;
  getSlotStatus(id: string): Promise<SlotStatus>;
  updateSlotStatus(id: string, status: SlotStatus): Promise<ParkingSlot>;
  searchNearbyLots(lat: number, lng: number, radius: number): Promise<ParkingLot[]>;
  getAvailableSlots(lotId: string, vehicleType: string): Promise<ParkingSlot[]>;
}

class ParkingServiceImpl implements ParkingService {
  async getParkingLots(): Promise<ParkingLot[]> {
    const lots = await apiClient.get<ParkingLot[]>('/parking/lots');
    return lots;
  }

  async getParkingLot(id: string): Promise<ParkingLot> {
    const lot = await apiClient.get<ParkingLot>(`/parking/lots/${id}`);
    return lot;
  }

  async getSlots(lotId?: string, filters?: SlotFilter): Promise<ParkingSlot[]> {
    const params = new URLSearchParams();
    
    if (lotId) params.append('lotId', lotId);
    if (filters?.vehicleType) params.append('vehicleType', filters.vehicleType);
    if (filters?.section) params.append('section', filters.section);
    if (filters?.floorLevel !== undefined) params.append('floorLevel', filters.floorLevel.toString());
    if (filters?.isAccessible !== undefined) params.append('isAccessible', filters.isAccessible.toString());
    if (filters?.maxDistance) params.append('maxDistance', filters.maxDistance.toString());
    if (filters?.minHourlyRate) params.append('minHourlyRate', filters.minHourlyRate.toString());
    if (filters?.maxHourlyRate) params.append('maxHourlyRate', filters.maxHourlyRate.toString());

    const slots = await apiClient.get<ParkingSlot[]>(`/parking/slots?${params.toString()}`);
    return slots;
  }

  async getSlot(id: string): Promise<ParkingSlot> {
    const slot = await apiClient.get<ParkingSlot>(`/parking/slots/${id}`);
    return slot;
  }

  async getSlotStatus(id: string): Promise<SlotStatus> {
    const response = await apiClient.get<{ status: SlotStatus }>(`/parking/slots/${id}/status`);
    return response.status;
  }

  async updateSlotStatus(id: string, status: SlotStatus): Promise<ParkingSlot> {
    const slot = await apiClient.put<ParkingSlot>(`/parking/slots/${id}/status`, { status });
    return slot;
  }

  async searchNearbyLots(lat: number, lng: number, radius: number): Promise<ParkingLot[]> {
    const lots = await apiClient.get<ParkingLot[]>(
      `/parking/lots/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    return lots;
  }

  async getAvailableSlots(lotId: string, vehicleType: string): Promise<ParkingSlot[]> {
    const slots = await apiClient.get<ParkingSlot[]>(
      `/parking/lots/${lotId}/available-slots?vehicleType=${vehicleType}`
    );
    return slots;
  }

  async getRealTimeOccupancy(lotId: string): Promise<Record<string, SlotStatus>> {
    const occupancy = await apiClient.get<Record<string, SlotStatus>>(
      `/parking/lots/${lotId}/occupancy`
    );
    return occupancy;
  }

  async getOccupancyHistory(lotId: string, startDate: string, endDate: string): Promise<any[]> {
    const history = await apiClient.get<any[]>(
      `/parking/lots/${lotId}/occupancy/history?start=${startDate}&end=${endDate}`
    );
    return history;
  }

  async reserveSlot(slotId: string, duration: number): Promise<{ reservationId: string }> {
    const reservation = await apiClient.post<{ reservationId: string }>(
      `/parking/slots/${slotId}/reserve`,
      { duration }
    );
    return reservation;
  }

  async cancelReservation(reservationId: string): Promise<void> {
    await apiClient.delete(`/parking/reservations/${reservationId}`);
  }

  async extendReservation(reservationId: string, additionalDuration: number): Promise<void> {
    await apiClient.put(`/parking/reservations/${reservationId}/extend`, {
      additionalDuration,
    });
  }
}

export const parkingService = new ParkingServiceImpl();