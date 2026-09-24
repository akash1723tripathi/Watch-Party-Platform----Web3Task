# Sync Algorithm

- Server is authoritative.
- Clients estimate: `currentTime + (now - updatedAt)`.
- If drift > 1.5s, client seeks.
- Host heartbeats every 5s.
- **On restart**: Room is rebuilt lazily from DB on first join; playback resets to paused.
