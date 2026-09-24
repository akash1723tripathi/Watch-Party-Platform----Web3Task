import { apiClient } from './axios-instance';
import type { ApiResponse, CreateRoomPayload, RoomData } from '../types/room';

export const createRoom = async (identity: CreateRoomPayload): Promise<RoomData> => {
  const response = await apiClient.post<ApiResponse<RoomData>>('/rooms', identity);
  return response.data.data;
};

export const getRoom = async (code: string): Promise<RoomData> => {
  const response = await apiClient.get<ApiResponse<RoomData>>(`/rooms/${code.trim().toUpperCase()}`);
  return response.data.data;
};
