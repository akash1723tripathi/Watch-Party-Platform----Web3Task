import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalSetup(): Promise<void> {
  dotenv.config();

  const testDbUrl = process.env.TEST_DATABASE_URL;
  const devDbUrl = process.env.DATABASE_URL;

  if (!testDbUrl) {
    throw new Error('TEST_DATABASE_URL is missing. DB tests require TEST_DATABASE_URL to be set.');
  }

  if (devDbUrl && testDbUrl === devDbUrl) {
    throw new Error(
      'TEST_DATABASE_URL cannot equal DATABASE_URL. Tests must NEVER touch the development database.',
    );
  }

  const serverRootDir = path.resolve(__dirname, '../../');

  try {
    execSync('npx prisma migrate deploy', {
      cwd: serverRootDir,
      env: {
        ...process.env,
        DATABASE_URL: testDbUrl,
      },
      stdio: 'pipe',
    });
  } catch (error) {
    console.error('Failed to run prisma migrate deploy on test database:', error);
    throw error;
  }
}
