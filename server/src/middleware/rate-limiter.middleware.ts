import rateLimit from 'express-rate-limit';

export const GLOBAL_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const GLOBAL_RATE_LIMIT_MAX = 100;

export const CREATE_ROOM_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const CREATE_ROOM_RATE_LIMIT_MAX = 20;

export const globalRateLimiter = rateLimit({
  windowMs: GLOBAL_RATE_LIMIT_WINDOW_MS,
  limit: GLOBAL_RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests, please try again later',
    },
  },
});

export const createRoomRateLimiter = rateLimit({
  windowMs: CREATE_ROOM_RATE_LIMIT_WINDOW_MS,
  limit: () =>
    process.env.TEST_CREATE_ROOM_RATE_LIMIT
      ? Number(process.env.TEST_CREATE_ROOM_RATE_LIMIT)
      : CREATE_ROOM_RATE_LIMIT_MAX,
  keyGenerator: (req) => (req.headers['x-test-client-ip'] as string) || req.ip || 'unknown',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many rooms created, please try again later',
    },
  },
});
