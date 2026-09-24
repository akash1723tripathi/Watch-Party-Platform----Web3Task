import http from 'node:http';
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/database.js';
import { initSockets } from './sockets/index.js';

const server = http.createServer(app);
const io = initSockets(server);

server.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, `Server running on port ${env.PORT}`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, `Received ${signal}, initiating graceful shutdown...`);

  server.close(() => {
    logger.info('HTTP server closed');
  });

  io.close(() => {
    logger.info('Socket.IO server closed');
  });

  try {
    await prisma.$disconnect();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error({ error }, 'Error disconnecting database');
  }

  process.exit(0);
};

process.on('SIGINT', () => void gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));

export { server, io };
