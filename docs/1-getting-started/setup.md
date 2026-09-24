# Setup & Getting Started

## Prerequisites
- **Node.js**: v22+
- **npm**: v10+
- **Docker & Docker Compose**: For local PostgreSQL and test database instances

## Environment Setup
The project uses decoupled environment configurations for server and client with runnable defaults.

1. **Server environment configuration**:
   Copy `server/.env.example` to `server/.env`:
   ```powershell
   Copy-Item server/.env.example server/.env
   ```
   Variables configured:
   - `PORT`: HTTP & WebSocket port (`3001`)
   - `NODE_ENV`: `development` | `production` | `test`
   - `DATABASE_URL`: Dev database connection (`postgresql://postgres:postgres@localhost:5432/watchparty?schema=public`)
   - `TEST_DATABASE_URL`: Test database connection (`postgresql://postgres:postgres@localhost:5432/watchparty_test?schema=public`, used only by Vitest test runner)
   - `JWT_SECRET`: Secret key for JWT verification (`change-me-dev-only`)
   - `CORS_ORIGIN`: Frontend origin (`http://localhost:5173`)
   - `CLIENT_URL`: Frontend URL (`http://localhost:5173`)

2. **Client environment configuration**:
   Copy `client/.env.example` to `client/.env`:
   ```powershell
   Copy-Item client/.env.example client/.env
   ```
   Variables configured:
   - `VITE_API_URL`: Backend REST API URL (`http://localhost:3001/api/v1`)
   - `VITE_SOCKET_URL`: Backend Socket.IO URL (`http://localhost:3001`)

## Local Database (Docker Compose)
Start the PostgreSQL container:
```powershell
docker compose up -d
```
The Docker setup includes `./docker/initdb/01-create-test-db.sql` which initializes both `watchparty` (development) and `watchparty_test` (test) databases.

Deploy Prisma migrations to development DB:
```powershell
cd server
npm run prisma:generate
npm run prisma:migrate
```

## Running the Applications

### Server
```powershell
cd server
npm install
npm run dev
```

### Client
```powershell
cd client
npm install
npm run dev
```

## Available Scripts

### Server (`server/package.json`)
- `npm run dev`: Starts development server with hot-reload via `tsx`.
- `npm run build`: Compiles TypeScript to `dist/`.
- `npm run start`: Runs compiled JavaScript in `dist/index.js`.
- `npm run lint`: Runs ESLint on backend code.
- `npm run typecheck`: Runs `tsc --noEmit`.
- `npm run test`: Runs unit and integration tests against `TEST_DATABASE_URL` with Vitest.
- `npm run prisma:generate`: Generates Prisma Client.
- `npm run prisma:migrate`: Runs Prisma database migrations.

### Client (`client/package.json`)
- `npm run dev`: Starts Vite dev server.
- `npm run build`: Typechecks and builds production assets.
- `npm run lint`: Runs ESLint on frontend code.
- `npm run typecheck`: Runs `tsc --noEmit`.
- `npm run preview`: Previews built production client.

## Windows Troubleshooting
- **PowerShell Script Execution**: Use `;` instead of `&&` when chaining commands.
- **Port Conflicts**: Ensure port `3001` (server) and `5173` (client) are free.
- **Docker Compose**: If `docker compose` is not recognized, ensure Docker Desktop is running.
