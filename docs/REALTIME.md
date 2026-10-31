# ZYVORA Realtime Service

The realtime service is a separate long-running Node.js process. It is intentionally not embedded in Next.js route handlers: the browser WebSocket upgrade needs a persistent HTTP server. Next.js documents custom servers as an escape hatch and notes that they can affect framework optimizations; keeping realtime separate avoids changing the web server entry point.

## Local setup

1. Install workspace dependencies with `pnpm install`.
2. Set `DATABASE_URL` for the shared session database.
3. Set `REALTIME_PORT=4100`.
4. Set `REALTIME_ALLOWED_ORIGINS=http://localhost:3000`.
5. Start it with `pnpm --filter @zyvora/realtime dev`.
6. Set `NEXT_PUBLIC_REALTIME_URL=ws://localhost:4100/ws` in the web app environment.

The service authenticates the `zyvora_session` cookie during the WebSocket handshake, checks the Origin allowlist, limits payloads, and exposes `/health`. The first release provides a single in-memory Nexus lobby for presence and chat.

## Production notes

- Use `wss://` behind TLS.
- Set an exact comma-separated Origin allowlist; do not use wildcard origins.
- Use a shared Valkey/Redis pub-sub adapter before running multiple realtime instances.
- Add rate limiting, moderation, message persistence and abuse reporting before public launch.
- Keep the realtime process on a long-running Node host; do not deploy it as a short-lived serverless function.

## Notifications

The web API exposes authenticated `GET /api/v1/notifications` and `PATCH /api/v1/notifications`. PATCH accepts `{ "id": "uuid" }` to mark one item read or `{ "all": true }` to mark all current user's notifications read. Apply the SQL migration in `packages/database/drizzle/0001_notifications.sql` before using the endpoint.
