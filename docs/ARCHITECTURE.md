# ZYVORA ULTRA X Architecture

## Core
ZYVORA CORE is the shared identity, permissions, profile, XP, notifications and API boundary for every client.

## Clients
- Web: Next.js
- Android: Kotlin/Compose (next milestone)
- Desktop: Tauri (next milestone)

## Services
- API: authentication and platform APIs
- AI: model/agent orchestration
- Cloud: files, hosting and deployments
- Games: catalog, achievements and leaderboards
- Realtime: WebSocket presence/events

## Data
PostgreSQL is the source of truth. Valkey is used for cache, sessions, queues and realtime coordination.

## Build order
1. Foundation + web UI
2. Core identity/data
3. AI OS
4. Cloud
5. Games
6. Cyber World
7. Metaverse
8. Developer Center + Store
9. Security, observability and production hardening
