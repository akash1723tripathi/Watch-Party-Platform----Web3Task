import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { z } from 'zod';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const guestIdentitySchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  username: z.string().min(1, 'username is required'),
});

export type SocketUser = z.infer<typeof guestIdentitySchema>;

declare module 'socket.io' {
  interface SocketData {
    user?: SocketUser;
  }
}

export const initSockets = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  // Handshake middleware (RT-02)
  // TODO(stage-4): replace with JWT verification
  io.use((socket, next) => {
    const authPayload = socket.handshake.auth;
    const result = guestIdentitySchema.safeParse(authPayload);

    if (!result.success) {
      logger.warn({ authPayload, errors: result.error.errors }, 'Socket authentication failed');
      return next(new Error('Authentication failed: Invalid identity'));
    }

    socket.data.user = result.data;
    next();
  });

  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id, user: socket.data.user }, 'Socket client connected');

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id, user: socket.data.user }, 'Socket client disconnected');
    });
  });

  return io;
};
