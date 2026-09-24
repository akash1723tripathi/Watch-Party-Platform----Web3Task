import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { prisma } from '../config/database.js';
import { isValidRoomCode } from '../utils/room-code.js';
import { buildCreateRoomInput } from '../test/factories.js';

describe('Room Routes (Integration)', () => {
  beforeEach(async () => {
    await prisma.room.deleteMany();
  });

  afterAll(async () => {
    await prisma.room.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/v1/rooms', () => {
    it('create returns 201 and a valid code', async () => {
      const payload = buildCreateRoomInput({ userId: 'user-host-1', username: 'HostOne' });
      const res = await request(app).post('/api/v1/rooms').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        data: {
          code: expect.any(String),
          hostId: 'user-host-1',
        },
      });
      expect(isValidRoomCode(res.body.data.code)).toBe(true);

      const dbRoom = await prisma.room.findUnique({
        where: { code: res.body.data.code },
      });
      expect(dbRoom).not.toBeNull();
      expect(dbRoom?.hostId).toBe('user-host-1');
    });

    it('two creates return different codes', async () => {
      const res1 = await request(app)
        .post('/api/v1/rooms')
        .send(buildCreateRoomInput({ userId: 'user-1' }));
      const res2 = await request(app)
        .post('/api/v1/rooms')
        .send(buildCreateRoomInput({ userId: 'user-2' }));

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.data.code).not.toBe(res2.body.data.code);
    });

    it('invalid username or missing userId returns 400', async () => {
      // Missing userId
      const res1 = await request(app)
        .post('/api/v1/rooms')
        .send({ username: 'ValidUser' });
      expect(res1.status).toBe(400);
      expect(res1.body.success).toBe(false);
      expect(res1.body.error.code).toBe('VALIDATION_ERROR');

      // Empty userId
      const res2 = await request(app)
        .post('/api/v1/rooms')
        .send({ userId: '   ', username: 'ValidUser' });
      expect(res2.status).toBe(400);
      expect(res2.body.success).toBe(false);

      // Username too short (< 2 chars)
      const res3 = await request(app)
        .post('/api/v1/rooms')
        .send({ userId: 'user-1', username: 'A' });
      expect(res3.status).toBe(400);
      expect(res3.body.success).toBe(false);

      // Username too long (> 24 chars)
      const res4 = await request(app)
        .post('/api/v1/rooms')
        .send({ userId: 'user-1', username: 'A'.repeat(25) });
      expect(res4.status).toBe(400);
      expect(res4.body.success).toBe(false);
    });

    it('the create limiter returns 429 after the limit', async () => {
      process.env.TEST_CREATE_ROOM_RATE_LIMIT = '2';
      const clientIp = 'rate-limited-test-client-unique';

      try {
        const res1 = await request(app)
          .post('/api/v1/rooms')
          .set('x-test-client-ip', clientIp)
          .send(buildCreateRoomInput());
        expect(res1.status).toBe(201);

        const res2 = await request(app)
          .post('/api/v1/rooms')
          .set('x-test-client-ip', clientIp)
          .send(buildCreateRoomInput());
        expect(res2.status).toBe(201);

        const res3 = await request(app)
          .post('/api/v1/rooms')
          .set('x-test-client-ip', clientIp)
          .send(buildCreateRoomInput());
        expect(res3.status).toBe(429);
        expect(res3.body).toEqual({
          success: false,
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many rooms created, please try again later',
          },
        });
      } finally {
        delete process.env.TEST_CREATE_ROOM_RATE_LIMIT;
      }
    });
  });

  describe('GET /api/v1/rooms/:code', () => {
    it('get returns 200 for an existing room', async () => {
      const createRes = await request(app)
        .post('/api/v1/rooms')
        .send(buildCreateRoomInput({ userId: 'host-123', username: 'HostUser' }));
      const { code } = createRes.body.data;

      const getRes = await request(app).get(`/api/v1/rooms/${code}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body).toEqual({
        success: true,
        data: {
          code,
          hostId: 'host-123',
        },
      });
    });

    it('get is case-insensitive', async () => {
      const createRes = await request(app)
        .post('/api/v1/rooms')
        .send(buildCreateRoomInput({ userId: 'host-abc', username: 'HostUser' }));
      const { code } = createRes.body.data;

      const getRes = await request(app).get(`/api/v1/rooms/${code.toLowerCase()}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.data.code).toBe(code.toUpperCase());
      expect(getRes.body.data.hostId).toBe('host-abc');
    });

    it('unknown code returns the 404 envelope', async () => {
      const res = await request(app).get('/api/v1/rooms/ZZZZZZ');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        error: {
          code: 'ROOM_NOT_FOUND',
          message: 'Room with code ZZZZZZ not found',
        },
      });
    });

    it('malformed code returns 400', async () => {
      // Too short
      const resShort = await request(app).get('/api/v1/rooms/ABC');
      expect(resShort.status).toBe(400);
      expect(resShort.body.success).toBe(false);
      expect(resShort.body.error.code).toBe('VALIDATION_ERROR');

      // Disallowed characters (e.g. 0, O, 1, I or symbols)
      const resInvalidChar = await request(app).get('/api/v1/rooms/ABCDE0');
      expect(resInvalidChar.status).toBe(400);
      expect(resInvalidChar.body.success).toBe(false);
      expect(resInvalidChar.body.error.code).toBe('VALIDATION_ERROR');

      // Too long
      const resLong = await request(app).get('/api/v1/rooms/ABCDEFGH');
      expect(resLong.status).toBe(400);
      expect(resLong.body.success).toBe(false);
      expect(resLong.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
