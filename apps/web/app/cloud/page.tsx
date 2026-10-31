'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './cloud.css';

type FileItem = { id: string; name: string; mimeType: string; size: number; createdAt: string };

export default function CloudPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const router = useRouter();
  useEffect(() => { fetch('/api/v1/cloud/files').then(async r => { if (r.status === 401) return router.replace('/login'); setFiles((await r.json()).files ?? []); }).catch(() => router.replace('/login')); }, [router]);
  return <main className="cloud-page"><header><div className="brand"><span>ZX</span><strong>ZYVORA</strong><small>ULTRA X</small></div><a href="/dashboard">CORE ↗</a></header><section className="cloud-hero"><p className="eyebrow">ZYVORA CLOUD</p><h1>YOUR DATA.<br/><em>YOUR CORE.</em></h1><p>One workspace for files, projects, hosting and deployments. Storage providers stay behind a secure abstraction so the platform can move from local development to VPS or object storage.</p></section><section className="cloud-panel"><div className="panel-head"><div><span className="eyebrow">FILES</span><h2>Cloud Workspace</h2></div><span>{files.length} FILES</span></div>{files.length === 0 ? <div className="empty">No files yet. Upload/storage integration is the next Cloud layer.</div> : <div className="file-list">{files.map(f=><div key={f.id}><b>{f.name}</b><span>{f.mimeType} · {Math.round(f.size / 1024)} KB</span></div>)}</div>}</section></main>;
}
