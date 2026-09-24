import { generateRoomCode } from '../utils/room-code.js';

export interface RoomFactoryAttributes {
  code?: string;
  hostId?: string;
}

export interface CreateRoomInputFactoryAttributes {
  userId?: string;
  username?: string;
}

export const buildRoom = (overrides?: RoomFactoryAttributes) => ({
  code: overrides?.code ?? generateRoomCode(),
  hostId: overrides?.hostId ?? `user_${Math.random().toString(36).substring(2, 9)}`,
});

export const buildCreateRoomInput = (overrides?: CreateRoomInputFactoryAttributes) => ({
  userId: overrides?.userId ?? `user_${Math.random().toString(36).substring(2, 9)}`,
  username: overrides?.username ?? 'TestHost',
});
