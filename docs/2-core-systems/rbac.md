# RBAC

| Action | Host | Moderator | Participant |
|---|---|---|---|
| play / pause / seek / change video | yes | yes | request only |
| approve or reject requests | yes | yes | no |
| assign roles | yes | no | no |
| remove participants | yes | no | no |
| transfer host | yes | no | no |
| chat_message | everyone | everyone | everyone |

## Enforcement Rules
All checks are server-side. Deny by default.
Chat is unmoderated, max 500 chars, rate limit 5 msgs per 5 s, sanitized, last 50 kept in memory. Chat is built last.
