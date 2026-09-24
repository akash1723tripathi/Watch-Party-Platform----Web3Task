import { io, Socket } from 'socket.io-client';
import { getCurrentUser } from '../lib/current-user';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => {
    const user = getCurrentUser();
    cb({
      userId: user.userId,
      username: user.username || 'Guest',
    });
  },
});
