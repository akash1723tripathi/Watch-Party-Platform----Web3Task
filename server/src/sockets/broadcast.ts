import type { Server } from 'socket.io';

export const roomChannel = (roomId: string): string => `room:${roomId}`;

export const emitToRoom = <T>(
  io: Server,
  roomId: string,
  event: string,
  payload: T,
): void => {
  io.to(roomChannel(roomId)).emit(event, payload);
};
