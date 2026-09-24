export interface CreateRoomDto {
  userId: string;
  username: string;
}

export interface RoomResponse {
  code: string;
  hostId: string;
}
