import dotenv from 'dotenv';

dotenv.config();

const rawDevDb = process.env.DATABASE_URL;
const rawTestDb = process.env.TEST_DATABASE_URL;

if (!rawTestDb) {
  throw new Error('TEST_DATABASE_URL is missing. DB tests require TEST_DATABASE_URL to be set.');
}

if (rawDevDb && rawTestDb === rawDevDb) {
  throw new Error(
    'TEST_DATABASE_URL cannot equal DATABASE_URL. Tests must NEVER touch the development database.',
  );
}

process.env.PORT = '3001';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = rawTestDb;
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.CLIENT_URL = 'http://localhost:5173';
