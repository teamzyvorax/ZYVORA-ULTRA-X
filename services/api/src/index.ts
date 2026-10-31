import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.get('/health', async () => ({ ok: true, service: 'zyvora-core-api', version: '0.1.0' }));
app.get('/api/v1/modules', async () => ({ modules: ['ai-os','cyber-world','metaverse','cloud','games','developer','store','core'] }));

const port = Number(process.env.PORT ?? 4000);
await app.listen({ host: '0.0.0.0', port });
