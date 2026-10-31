'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const form = new FormData(e.currentTarget);
      const endpoint = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password'), username: form.get('username') || undefined }) });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message || 'Unable to continue'); return; }
      setMessage(data.message || 'Success');
      setTimeout(() => router.push('/dashboard'), 350);
    } catch { setMessage('Network error. Please try again.'); }
    finally { setBusy(false); }
  }

  return (
    <main className="auth-page"><div className="auth-card">
      <div className="brand"><span>ZX</span><strong>ZYVORA</strong><small>ULTRA X</small></div>
      <p className="eyebrow">ZYVORA CORE ACCESS</p><h1>{mode === 'login' ? 'Enter the Core.' : 'Create your Core.'}</h1>
      <p className="auth-copy">One account for AI OS, Cloud, Games, Cyber World and Metaverse.</p>
      <form onSubmit={submit}>
        {mode === 'signup' && <input name="username" placeholder="Username" minLength={3} maxLength={24} required />}
        <input name="email" type="email" placeholder="Email" required /><input name="password" type="password" placeholder="Password" minLength={8} required />
        <button className="primary" type="submit" disabled={busy}>{busy ? 'CONNECTING…' : mode === 'login' ? 'ENTER CORE →' : 'CREATE ACCOUNT →'}</button>
      </form>
      {message && <div className="auth-message">{message}</div>}
      <button className="switch" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }}>{mode === 'login' ? 'New to ZYVORA? Create account' : 'Already have an account? Sign in'}</button>
    </div></main>
  );
}
