export interface RoomData {
  code: string;
  hostId: string;
}

export interface CreateRoomPayload {
  userId: string;
  username: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
