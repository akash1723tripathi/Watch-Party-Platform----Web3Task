# Room Lifecycle

## What
The Room Lifecycle covers the creation and retrieval of synchronized watch party rooms. Rooms are identified by an uppercase 6-character alphanumeric code (excluding ambiguous characters `0, O, 1, I`) and track the host identity and creation timestamp.

## Why
- **Simplicity**: Short 6-character room codes (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`) are easily shared via chat, link, or email.
- **Single Source of Truth**: Room metadata is persisted in PostgreSQL to ensure room existence and host ownership survive server restarts.
- **Layered Architecture**: Adheres to strict unidirectional data flow (`route` -> `validator` -> `controller` -> `service` -> `Prisma`) preventing leaky abstractions.

## How

### Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Host as Host Client
    actor Joiner as Joiner Client
    participant API as Express Router & Validator
    participant Service as RoomService
    participant DB as PostgreSQL (Prisma)

    Note over Host,DB: Room Creation Flow
    Host->>API: POST /api/v1/rooms { userId, username }
    API->>API: Validate schema & apply rate limiter (20/15m)
    API->>Service: RoomService.createRoom({ userId, username })
    Service->>Service: Generate unique 6-char code (retry up to 5x on collision)
    Service->>DB: prisma.room.create({ data: { code, hostId: userId } })
    DB-->>Service: Room Record
    Service-->>API: { code, hostId }
    API-->>Host: 201 Created { success: true, data: { code, hostId } }

    Note over Joiner,DB: Room Join Validation Flow
    Joiner->>API: GET /api/v1/rooms/:code
    API->>API: Normalise code (trim + uppercase) & validate regex
    API->>Service: RoomService.getRoomByCode(code)
    Service->>DB: prisma.room.findUnique({ where: { code } })
    alt Room Found
        DB-->>Service: Room Record
        Service-->>API: { code, hostId }
        API-->>Joiner: 200 OK { success: true, data: { code, hostId } }
        Joiner->>Joiner: Navigate to /room/:code
    else Room Not Found
        DB-->>Service: null
        Service-->>API: throw ApiError.notFound
        API-->>Joiner: 404 Not Found { success: false, error: { code: "ROOM_NOT_FOUND" } }
    end
```

### Guest Identity & Stage 4 Auth
Currently, client requests pass a guest identity `{ userId, username }` generated on first visit and stored in `localStorage`. 

> [!IMPORTANT]
> **TODO(stage-4)**: In Stage 4 (Auth), the `hostId` and `userId` will come exclusively from verified JWT authentication tokens (`req.user.id`), never from client-supplied request bodies (adhering to **AUTH-06**).

### Single-Instance Note
The platform operates on a single-instance model (Railway/Render) without Redis adapters. Persistent room metadata (`id`, `code`, `hostId`) is stored in PostgreSQL. In-memory room state (participants, active video, sync position) will be rebuilt lazily upon the first client join event following a server restart.

## Cross References
- [Setup & Getting Started](../1-getting-started/setup.md)
- [Home Page Component](../3-components/home-page.md)
- [RBAC System](rbac.md)
