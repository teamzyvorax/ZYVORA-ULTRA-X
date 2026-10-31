import Fastify from 'fastify';

const app = Fastify({ logger: true });

const modules = [
  { id: 'ai-os', name: 'AI OS', status: 'online' },
  { id: 'cyber-world', name: 'Cyber World', status: 'online' },
  { id: 'metaverse', name: 'Metaverse', status: 'building' },
  { id: 'cloud', name: 'ZYVORA Cloud', status: 'online' },
  { id: 'games', name: 'Games Hub', status: 'online' },
  { id: 'developer', name: 'Developer', status: 'building' },
  { id: 'store', name: 'Store', status: 'planned' },
  { id: 'core', name: 'ZYVORA Core', status: 'online' }
];

app.get('/health', async () => ({ ok: true, service: 'zyvora-ultra-x-api', version: '0.2.0' }));
app.get('/api/v1/modules', async () => ({ modules }));
app.get('/api/v1/dashboard', async () => ({
  user: { name: 'Guest', level: 1, xp: 0 },
  stats: { projects: 0, files: 0, games: 0, missions: 0 },
  modules
}));

app.listen({ host: '0.0.0.0', port: Number(process.env.PORT ?? 4000) }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
