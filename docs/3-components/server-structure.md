# Server Architecture & Structure

## Domain
The backend server provides HTTP REST API endpoints and real-time WebSocket capabilities for the Watch Party application. It manages room persistence via Prisma/PostgreSQL, handles real-time synchronization, enforces server-authoritative state and RBAC policies.

## Source Code
Source code is located in `server/src/`:
- `config/`: Configuration modules (`env.ts`, `logger.ts`, `database.ts`).
- `controllers/`: HTTP request controllers.
- `middleware/`: Express middleware (`error-handler.ts`, `not-found.ts`, `validate.middleware.ts`, `rate-limiter.middleware.ts`).
- `routes/`: Express route definitions (`index.ts`, `health.routes.ts`).
- `services/`: Business logic services.
- `rooms/`: Domain state classes (`Room`, `Participant`).
- `sockets/`: Socket.IO initialisation, channel helpers, and event handlers (`index.ts`, `broadcast.ts`, `handlers/`).
- `validators/`: Zod validation schemas (`common.validator.ts`).
- `types/`: Shared TypeScript type definitions.
- `utils/`: Utility classes and functions (`api-error.ts`, `room-code.ts`).
- `test/`: Test setup and helpers (`setup.ts`).
- `app.ts`: Express application configuration adhering to strict middleware ordering.
- `index.ts`: HTTP and Socket.IO server startup with graceful shutdown handling.

## Overview
- **Strict Layering**: Routes -> Validation (Zod) -> Controllers -> Services -> Data Access.
- **Error Handling**: Standardized envelopes (`{ success, data }` or `{ success: false, error }`) managed by `ApiError` and a global error handler middleware.
- **Realtime**: Socket.IO server configured with guest authentication handshake and room channel abstractions.
- **ESM**: Native ES Modules configured with explicit `.js` import path extensions.

## Gotchas
- **Import Extensions**: All local file imports must explicitly include `.js` extension (e.g., `import { env } from './config/env.js'`).
- **Prisma Singleton**: Always import `prisma` from `config/database.js` to avoid multiple active database connections.
- **Environment Validation**: `config/env.js` parses `process.env` at launch; missing required variables will cause process startup failure.
