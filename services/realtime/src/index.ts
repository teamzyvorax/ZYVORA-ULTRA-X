import { createServer } from 'node:http';
import { parse } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';
import { getUserFromToken } from '@zyvora/auth';

const port = Number(process.env.REALTIME_PORT ?? 4100);
const allowedOrigins = new Set(
  (process.env.REALTIME_ALLOWED_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
);

type Client = { username: string; room: string };
const clients = new Map<WebSocket, Client>();
const server = createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok', service: 'zyvora-realtime' }));
    return;
  }
  response.writeHead(404);
  response.end('Not found');
});

const wss = new WebSocketServer({ noServer: true, maxPayload: 16 * 1024 });

function cookieToken(cookieHeader = '') {
  const entry = cookieHeader.split(';').map(part => part.trim())
    .find(part => part.startsWith('zyvora_session='));
  return entry ? decodeURIComponent(entry.slice('zyvora_session='.length)) : undefined;
}

function broadcast(room: string, payload: object) {
  const encoded = JSON.stringify(payload);
  for (const [socket, client] of clients) {
    if (client.room === room && socket.readyState === WebSocket.OPEN) socket.send(encoded);
  }
}

server.on('upgrade', async (request, socket, head) => {
  const origin = request.headers.origin;
  if (!origin || !allowedOrigins.has(origin)) {
    socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
    socket.destroy();
    return;
  }
  if (parse(request.url ?? '').pathname !== '/ws') {
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.destroy();
    return;
  }
  try {
    const user = await getUserFromToken(cookieToken(request.headers.cookie));
    if (!user) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request, user.username);
    });
  } catch {
    socket.write('HTTP/1.1 503 Service Unavailable\r\n\r\n');
    socket.destroy();
  }
});

wss.on('connection', (socket, _request, username: string) => {
  const room = 'nexus-lobby';
  clients.set(socket, { username, room });
  socket.send(JSON.stringify({ type: 'ready', room, username }));
  broadcast(room, { type: 'presence', username, action: 'joined' });

  socket.on('message', raw => {
    try {
      const message = JSON.parse(raw.toString()) as { type?: string; text?: string };
      if (message.type !== 'chat' || typeof message.text !== 'string') return;
      const cleanText = message.text.trim().slice(0, 500);
      if (!cleanText) return;
      broadcast(room, {
        type: 'chat',
        username,
        text: cleanText,
        sentAt: new Date().toISOString()
      });
    } catch {
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  socket.on('close', () => {
    clients.delete(socket);
    broadcast(room, { type: 'presence', username, action: 'left' });
  });
});

server.listen(port, '0.0.0.0', () => {
  process.stdout.write(`ZYVORA Realtime listening on :${port}\n`);
});
