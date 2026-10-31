'use client';
import './dashboard.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = { username: string; level: number; xp: number };
const modules = [['AI OS','AI assistant, coding, files and agents.','AI'],['ZYVORA CLOUD','Projects, files, hosting and deployments.','CL'],['GAMES HUB','Launch games, XP, achievements and ranks.','GM'],['CYBER WORLD','Missions, challenges and digital locations.','CW'],['METAVERSE','3D worlds, avatars and multiplayer.','MV'],['DEVELOPER','APIs, SDKs, GitHub and webhooks.','DV']];
export default function Dashboard(){
 const [user,setUser]=useState<User|null>(null); const [toast,setToast]=useState(''); const router=useRouter();
 useEffect(()=>{fetch('/api/v1/auth/me').then(async r=>{if(!r.ok){router.replace('/login');return;}setUser((await r.json()).user);}).catch(()=>router.replace('/login'));},[router]);
 if(!user)return <main className="auth-page"><p className="eyebrow">SYNCING ZYVORA CORE…</p></main>;
 const launch=(name:string)=>{setToast(`${name} module selected`);setTimeout(()=>setToast(''),1800)};
 return <main className="dashboard-page"><aside className="side"><div className="brand"><span>ZX</span><strong>ZYVORA</strong><small>ULTRA X</small></div><nav>{['Overview','AI OS','Cloud','Games','Cyber World','Metaverse','Developer','Settings'].map((x,i)=><button className={i===0?'active':''} key={x}>{x}</button>)}</nav><div className="core"><i/> CORE ONLINE</div></aside><section className="dash-main"><header className="dash-top"><div><p className="eyebrow">ZYVORA CORE / CONTROL CENTER</p><h1>Welcome, <em>{user.username}</em></h1></div><button className="avatar">ZX</button></header><section className="hero-panel"><div><span className="pill">CORE · LEVEL {user.level}</span><h2>Your digital universe<br/>starts here.</h2><p>One identity. One core. Every ZYVORA system connected.</p><button onClick={()=>launch('AI OS')} className="primary">OPEN AI OS →</button></div><div className="ring"><b>01</b><span>CORE</span></div></section><section className="stats"><div><small>LEVEL</small><strong>{user.level}</strong></div><div><small>XP</small><strong>{user.xp}</strong></div><div><small>STATUS</small><strong>ONLINE</strong></div><div><small>ACCOUNT</small><strong>CORE</strong></div></section><div className="section-title"><div><p className="eyebrow">SYSTEMS</p><h2>Launch a module</h2></div><span>6 ACTIVE SURFACES</span></div><div className="module-grid">{modules.map(([name,desc,code])=><button className="module" key={name} onClick={()=>launch(name)}><span>{code}</span><h3>{name}</h3><p>{desc}</p><b>OPEN →</b></button>)}</div></section>{toast&&<div className="toast">{toast}</div>}</main>;
}
