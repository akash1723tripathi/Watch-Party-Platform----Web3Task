# Watch Party Platform

A real-time YouTube watch party web application with rooms, WebSockets, and role-based access control (RBAC).

## Features So Far
- **Backend Room API (`server/`)**:
  - `POST /api/v1/rooms`: Creates a room with a collision-resistant 6-character room code and assigns host ownership (rate limited: 20 per 15 min).
  - `GET /api/v1/rooms/:code`: Case-insensitive room code lookup and validation.
  - Layered architecture (`routes` -> `validators` -> `controllers` -> `services` -> `Prisma`).
  - Isolated test infrastructure with dedicated test database (`watchparty_test`), automated Vitest migration deploys, and test factories.
- **Frontend App & HomePage (`client/`)**:
  - Dark theme UI with teal accents, responsive design tokens, and smooth micro-animations.
  - `AppShell` with desktop slim `NavRail` and mobile bottom bar navigation.
  - `UserPanel` with reactive display name editing and quick user ID copying.
  - `DisplayNameModal` with keyboard focus trapping and escape constraints.
  - `HomePage` with interactive Host and Join cards, validation, loading states, copy code/link buttons, and mailto invite generation.
  - Typed Axios client with normalized `ApiClientError` error handling.

## Architecture Overview
- **Backend (`server/`)**: Node 22 + Express + TypeScript, Socket.IO, Zod validation, Pino logging, Prisma ORM, PostgreSQL.
- **Frontend (`client/`)**: Vite + React + TypeScript, Tailwind CSS with design tokens, React Router, Axios, Lucide icons.
- **Database**: PostgreSQL with Prisma ORM (`rooms` table).
- **Deployment**: Single-instance architecture (in-memory room state lazily rebuilt from DB).

## Quick Start

### 1. Environment Configuration
Copy environment templates in both deployable folders:
```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

### 2. Database (Docker Compose)
Start local PostgreSQL service with dev and test databases:
```powershell
docker compose up -d
```

### 3. Server Setup
```powershell
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 4. Client Setup
```powershell
cd client
npm install
npm run dev
```

## Verification Scripts

### Server
- `npm run dev`: Start dev server with hot reload (`tsx watch src/index.ts`)
- `npm run typecheck`: Run TypeScript compiler check
- `npm run lint`: ESLint check
- `npm run test`: Vitest test runner (executes against isolated `watchparty_test` database)
- `npm run build`: Compile to JavaScript (`dist/`)

### Client
- `npm run dev`: Start Vite dev server (`http://localhost:5173`)
- `npm run typecheck`: TypeScript check
- `npm run lint`: ESLint check
- `npm run build`: Production build

## Documentation
Refer to the [`docs/`](docs/) directory for detailed system documentation:
- [Getting Started Guide](docs/1-getting-started/setup.md)
- [Room Lifecycle System](docs/2-core-systems/room-lifecycle.md)
- [Home Page Component](docs/3-components/home-page.md)
- [Nav Rail Component](docs/3-components/nav-rail.md)
- [System Architecture](docs/3-components/server-structure.md)
