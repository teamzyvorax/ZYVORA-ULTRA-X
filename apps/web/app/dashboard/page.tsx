'use client';

import './dashboard.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = { username: string; level: number; xp: number };
type Notification = { id: string; title: string; body: string; href: string | null; isRead: boolean; createdAt: string };

const modules = [
  ['AI OS','AI assistant, coding, files and agents.','AI','/ai'],
  ['ZYVORA CLOUD','Projects, files, hosting and deployments.','CL','/cloud'],
  ['GAMES HUB','Launch games, XP, achievements and ranks.','GM','/games'],
  ['CYBER WORLD','Missions, challenges and digital locations.','CW','/cyber'],
  ['METAVERSE','Worlds, avatars and multiplayer lobby.','MV','/metaverse'],
  ['DEVELOPER','APIs, SDKs, GitHub and webhooks.','DV','/developer']
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [noticeError, setNoticeError] = useState('');
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch('/api/v1/auth/me');
        if (!response.ok) { router.replace('/login'); return; }
        const data = await response.json();
        if (!active) return;
        setUser(data.user);
        const noticeResponse = await fetch('/api/v1/notifications');
        if (noticeResponse.ok) {
          const noticeData = await noticeResponse.json();
          if (active) {
            setItems(noticeData.notifications ?? []);
            setUnread(noticeData.unread ?? 0);
          }
        } else if (active) setNoticeError('Notifications are temporarily unavailable.');
      } catch {
        if (active) router.replace('/login');
      } finally {
        if (active) setLoadingNotices(false);
      }
    }
    load();
    return () => { active = false; };
  }, [router]);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch('/api/v1/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Sign out failed');
      router.replace('/login');
      router.refresh();
    } catch {
      setNoticeError('Could not sign out. Please try again.');
      setLoggingOut(false);
    }
  }

  async function markRead(id: string) {
    const response = await fetch('/api/v1/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) return;
    setItems(current => current.map(item => item.id === id ? { ...item, isRead: true } : item));
    setUnread(value => Math.max(0, value - 1));
  }

  async function markAllRead() {
    const response = await fetch('/api/v1/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true })
    });
    if (!response.ok) { setNoticeError('Could not update notifications. Try again.'); return; }
    setItems(current => current.map(item => ({ ...item, isRead: true })));
    setUnread(0);
    setNoticeError('');
  }

  if (!user) return <main className="auth-page"><p className="eyebrow">SYNCING ZYVORA CORE…</p></main>;

  return (
    <main className="dashboard-page">
      <aside className="side">
        <div className="brand"><span>ZX</span><strong>ZYVORA</strong><small>ULTRA X</small></div>
        <nav>{['Overview','AI OS','Cloud','Games','Cyber World','Metaverse','Developer','Settings'].map((x,i) =>
          <button className={i===0?'active':''} key={x} onClick={() => i > 0 && router.push(['/','/ai','/cloud','/games','/cyber','/metaverse','/developer','/settings'][i])}>{x}</button>
        )}</nav>
        <div className="core"><i/> CORE ONLINE</div>
      </aside>
      <section className="dash-main">
        <header className="dash-top">
          <div><p className="eyebrow">ZYVORA CORE / CONTROL CENTER</p><h1>Welcome, <em>{user.username}</em></h1></div>
          <div className="dash-account-actions"><button className="avatar" aria-label="User profile">ZX</button><button className="logout-button" onClick={logout} disabled={loggingOut}>{loggingOut ? 'SIGNING OUT…' : 'SIGN OUT ↗'}</button></div>
        </header>
        <section className="hero-panel">
          <div><span className="pill">CORE · LEVEL {user.level}</span><h2>Your digital universe<br/>starts here.</h2><p>One identity. One core. Every ZYVORA system connected.</p><button onClick={() => router.push('/ai')} className="primary">OPEN AI OS →</button></div>
          <div className="ring"><b>01</b><span>CORE</span></div>
        </section>
        <section className="stats">
          <div><small>LEVEL</small><strong>{user.level}</strong></div>
          <div><small>XP</small><strong>{user.xp}</strong></div>
          <div><small>STATUS</small><strong>ONLINE</strong></div>
          <div><small>UNREAD</small><strong>{unread}</strong></div>
        </section>
        <section className="notifications-panel">
          <div className="notification-heading">
            <div><p className="eyebrow">CORE ACTIVITY</p><h2>Notifications <span>{unread}</span></h2></div>
            <button onClick={markAllRead} disabled={unread === 0}>MARK ALL READ</button>
          </div>
          {noticeError && <p className="notice-error">{noticeError}</p>}
          {loadingNotices ? <p className="notice-empty">Loading activity…</p> :
            items.length === 0 ? <p className="notice-empty">You're all caught up. New system activity will appear here.</p> :
            <div className="notification-list">{items.map(item =>
              <article className={item.isRead ? 'notification read' : 'notification'} key={item.id}>
                <i className="notification-dot"/>
                <div className="notification-copy"><strong>{item.title}</strong><p>{item.body}</p><small>{new Date(item.createdAt).toLocaleString()}</small></div>
                <div className="notification-actions">
                  {!item.isRead && <button onClick={() => markRead(item.id)}>MARK READ</button>}
                  {item.href && <button onClick={async () => { if (!item.isRead) await markRead(item.id); router.push(item.href!); }}>OPEN →</button>}
                </div>
              </article>
            )}</div>
          }
        </section>
        <div className="section-title"><div><p className="eyebrow">SYSTEMS</p><h2>Launch a module</h2></div><span>6 ACTIVE SURFACES</span></div>
        <div className="module-grid">{modules.map(([name,desc,code,path]) =>
          <button className="module" key={name} onClick={() => router.push(path)}><span>{code}</span><h3>{name}</h3><p>{desc}</p><b>OPEN →</b></button>
        )}</div>
      </section>
    </main>
  );
}
