'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import './metaverse.css';

type FeedItem = { id: number; kind: string; text: string };

export default function MetaversePage() {
  const [avatar, setAvatar] = useState('NOVA');
  const [status, setStatus] = useState('CONNECTING');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_REALTIME_URL;
    if (!endpoint) {
      setStatus('PREVIEW MODE');
      setFeed([{ id: 1, kind: 'system', text: 'Realtime endpoint not configured. The world preview is available.' }]);
      return;
    }
    const socket = new WebSocket(endpoint);
    socketRef.current = socket;
    socket.onopen = () => { setConnected(true); setStatus('LIVE'); };
    socket.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        const text = data.type === 'chat'
          ? `${data.username}: ${data.text}`
          : data.type === 'presence'
            ? `${data.username} ${data.action} the lobby`
            : data.type === 'ready'
              ? `Connected to ${data.room} as ${data.username}`
              : data.message ?? 'Realtime event';
        setFeed(items => [...items.slice(-19), { id: Date.now() + Math.random(), kind: data.type ?? 'system', text }]);
      } catch { /* Ignore malformed server frames. */ }
    };
    socket.onerror = () => setStatus('CONNECTION ISSUE');
    socket.onclose = () => { setConnected(false); setStatus('OFFLINE'); };
    return () => { socket.close(); socketRef.current = null; };
  }, []);

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || socketRef.current?.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({ type: 'chat', text }));
    setMessage('');
  }

  return <main className="metaverse-page">
    <header className="mv-top">
      <Link className="mv-brand" href="/dashboard"><span>ZX</span> ZYVORA <b>METAVERSE</b></Link>
      <div className="mv-top-right"><span className={connected ? 'live-dot' : 'idle-dot'} /> {status}<Link href="/dashboard">CORE ↗</Link></div>
    </header>
    <section className="mv-hero">
      <div className="mv-copy"><p className="eyebrow">ZYVORA DIGITAL UNIVERSE / SECTOR 01</p><h1>ENTER THE<br/><em>NEXUS.</em></h1><p>Explore the first ZYVORA world space. Choose your identity, discover the city and connect with the lobby.</p>
        <div className="avatar-picker"><small>SELECT YOUR AVATAR</small>{['NOVA','VEX','KAI'].map(name => <button key={name} className={avatar === name ? 'selected' : ''} onClick={() => setAvatar(name)}>{name}</button>)}</div>
        <div className="mv-meta"><span>WORLD: NEXUS-01</span><span>AVATAR: {avatar}</span><span>ROOM: PUBLIC LOBBY</span></div>
      </div>
      <div className="world-scene" aria-label="Stylized 3D cyber city preview">
        <div className="stars" /><div className="planet"><span>ZX</span></div>
        <div className="city city-back"><i/><i/><i/><i/><i/></div>
        <div className="city city-front"><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="platform"><span>NEXUS / 01</span></div>
        <div className="scene-label">3D WORLD PREVIEW <b>●</b></div>
      </div>
    </section>
    <section className="mv-lower">
      <article className="world-card"><p className="eyebrow">WORLD DIRECTORY</p><h2>Explore locations</h2>
        <div className="location-row"><span>01</span><div><b>Neon District</b><small>Central hub · Social plaza</small></div><em>OPEN</em></div>
        <div className="location-row"><span>02</span><div><b>Skyline Gate</b><small>Portal · Travel zone</small></div><em>SOON</em></div>
        <div className="location-row"><span>03</span><div><b>Core Sanctum</b><small>Events · Challenges</small></div><em>SOON</em></div>
      </article>
      <article className="lobby-card"><div className="lobby-head"><div><p className="eyebrow">REALTIME CHANNEL</p><h2>Nexus Lobby</h2></div><span>{connected ? 'CONNECTED' : 'PREVIEW'}</span></div>
        <div className="lobby-feed">{feed.map(item => <p key={item.id} className={item.kind}><small>{item.kind.toUpperCase()}</small>{item.text}</p>)}</div>
        <form onSubmit={sendMessage}><input value={message} onChange={event => setMessage(event.target.value)} placeholder={connected ? 'Send a lobby message…' : 'Configure realtime service to chat'} disabled={!connected}/><button disabled={!connected || !message.trim()}>SEND</button></form>
      </article>
    </section>
  </main>;
}
