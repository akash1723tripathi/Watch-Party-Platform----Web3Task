# Client Architecture & Structure

## Domain
The client application is a single-page React frontend built with Vite, TypeScript, and Tailwind CSS. It provides user interfaces for joining and hosting watch parties, controls for video playback synchronization, and real-time chat/requests.

## Source Code
Source code is located in `client/src/`:
- `app/`: Main application components and routing (`App.tsx`, `router.tsx`).
- `pages/`: Page views (`HomePage.tsx`, `RoomPage.tsx`, `LoginPage.tsx`).
- `api/`: Axios HTTP client configuration (`axios-instance.ts`).
- `socket/`: Socket.IO client singleton setup (`socket-client.ts`).
- `lib/`: Application utilities and guest user state (`current-user.ts`).
- `styles/`: Global dark theme tokens and Tailwind CSS (`tokens.css`).
- `hooks/`: Custom React hooks (`.gitkeep`).
- `components/ui/`: Reusable UI components (`.gitkeep`).
- `types/`: Frontend TypeScript definitions (`.gitkeep`).

## Overview
- **Routing**: `react-router-dom` declarative browser router supporting `/`, `/room/:roomId`, and `/login`.
- **Identity Abstraction**: Guest user identity managed via local storage and encapsulated behind `getCurrentUser()`.
- **Theme System**: CSS variable design tokens mapped directly into Tailwind theme extensions (`background`, `surface`, `border`, `text`, `muted`, `accent`, `danger`).
- **Socket Client**: Disconnected-by-default Socket.IO client singleton that supplies authentication payload dynamically via callback.

## Gotchas
- **Environment Variables**: Client environment variables must be prefixed with `VITE_` and accessed via `import.meta.env`.
- **Manual Socket Connection**: `socket-client.ts` sets `autoConnect: false`; connection must be initiated explicitly when joining a room.
- **Guest Identity**: Until authentication is introduced in Stage 4, `getCurrentUser()` generates and persists a random guest identity in `localStorage`.
