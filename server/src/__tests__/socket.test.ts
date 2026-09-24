import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import { io as ioClient, Socket as ClientSocket } from 'socket.io-client';
import app from '../app.js';
import { initSockets } from '../sockets/index.js';
import type { AddressInfo } from 'node:net';

describe('Socket.IO Scaffold', () => {
  let httpServer: http.Server;
  let port: number;

  beforeAll(() => {
    httpServer = http.createServer(app);
    initSockets(httpServer);
    httpServer.listen(0);
    const addr = httpServer.address() as AddressInfo;
    port = addr.port;
  });

  afterAll(() => {
    httpServer.close();
  });

  it('rejects a socket connection without valid identity', async () => {
    const clientSocket: ClientSocket = ioClient(`http://localhost:${port}`, {
      autoConnect: false,
      transports: ['websocket'],
    });

    const connectErrorPromise = new Promise<Error>((resolve) => {
      clientSocket.on('connect_error', (err) => {
        resolve(err);
      });
    });

    clientSocket.connect();

    const err = await connectErrorPromise;
    expect(err).toBeDefined();
    expect(err.message).toContain('Authentication failed');
    clientSocket.disconnect();
  });

  it('connects a socket with valid guest identity', async () => {
    const clientSocket: ClientSocket = ioClient(`http://localhost:${port}`, {
      autoConnect: false,
      transports: ['websocket'],
      auth: {
        userId: 'test-user-123',
        username: 'TestUser',
      },
    });

    const connectPromise = new Promise<void>((resolve) => {
      clientSocket.on('connect', () => {
        resolve();
      });
    });

    clientSocket.connect();

    await connectPromise;
    expect(clientSocket.connected).toBe(true);
    clientSocket.disconnect();
  });
});
