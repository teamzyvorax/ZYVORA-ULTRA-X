'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './games.css';

type Game = { id: string; slug: string; title: string; description: string; category: string };

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const router = useRouter();
  useEffect(() => {
    fetch('/api/v1/games').then(async r => {
      if (r.status === 401) return router.replace('/login');
      const data = await r.json(); setGames(data.games ?? []);
    }).catch(() => router.replace('/login'));
  }, [router]);
  return <main className="games-page"><header><div className="brand"><span>ZX</span><strong>ZYVORA</strong><small>ULTRA X</small></div><a href="/dashboard">CORE ↗</a></header><section className="games-hero"><p className="eyebrow">ZYVORA GAMES HUB</p><h1>PLAY THE<br/><em>UNIVERSE.</em></h1><p>Pixel missions, strategy, survival and competitive worlds — connected to your ZYVORA Core.</p></section><section className="games-grid">{games.map((game, i) => <article key={game.id}><small>0{i + 1} · {game.category.toUpperCase()}</small><h2>{game.title}</h2><p>{game.description}</p><button onClick={() => alert(`${game.title} launcher will connect here in the next build.`)}>LAUNCH →</button></article>)}</section></main>;
}
