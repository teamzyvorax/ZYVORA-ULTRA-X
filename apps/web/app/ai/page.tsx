'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import './ai.css';

type Message = { role: 'user' | 'ai'; text: string };

export default function AiPage() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'ai', text: 'ZYVORA AI CORE online. What are we building today?' }]);
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function send(e: FormEvent) {
    e.preventDefault();
    const value = prompt.trim(); if (!value || busy) return;
    setMessages(m => [...m, { role: 'user', text: value }]); setPrompt(''); setBusy(true);
    try {
      const r = await fetch('/api/v1/ai/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt: value }) });
      if (r.status === 401) return router.replace('/login');
      const data = await r.json(); setMessages(m => [...m, { role: 'ai', text: data.reply ?? 'Core error.' }]);
    } catch { setMessages(m => [...m, { role: 'ai', text: 'Connection error. AI Core is unavailable.' }]); }
    finally { setBusy(false); }
  }
  return <main className="ai-page"><header><div className="brand"><span>ZX</span><strong>ZYVORA</strong><small>ULTRA X</small></div><a href="/dashboard">CORE ↗</a></header><section className="ai-shell"><div className="ai-intro"><p className="eyebrow">ZYVORA AI OS</p><h1>THINK.<br/><em>CREATE.</em></h1><p>Your unified AI workspace for coding, files, projects, automation and agents.</p><div className="ai-status"><i/> CORE ROUTER ONLINE <span>•</span> AGENT LAYER READY</div></div><div className="chat"><div className="chat-head"><b>AI CORE / CHAT</b><span>FOUNDATION MODE</span></div><div className="messages">{messages.map((m,i)=><div className={m.role} key={i}><small>{m.role === 'ai' ? 'ZX AI' : 'YOU'}</small><p>{m.text}</p></div>)}</div><form onSubmit={send}><input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ask ZYVORA AI…"/><button disabled={busy}>{busy ? '…' : 'SEND →'}</button></form></div></section></main>;
}
