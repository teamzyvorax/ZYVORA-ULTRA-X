'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './cyber.css';

type Mission={id:string;title:string;zone:string;difficulty:string;xp:number};
export default function CyberPage(){
 const [missions,setMissions]=useState<Mission[]>([]); const [active,setActive]=useState<string|null>(null); const router=useRouter();
 useEffect(()=>{fetch('/api/v1/cyber/missions').then(async r=>{if(r.status===401)return router.replace('/login');setMissions((await r.json()).missions??[])}).catch(()=>router.replace('/login'))},[router]);
 return <main className="cyber-page"><header><div className="brand"><span>ZX</span><strong>ZYVORA</strong><small>ULTRA X</small></div><a href="/dashboard">CORE ↗</a></header><section className="city"><div className="city-copy"><p className="eyebrow">ZYVORA CYBER WORLD</p><h1>ENTER<br/><em>THE CITY.</em></h1><p>A living digital world built around missions, zones, identity, XP and future multiplayer systems.</p><div className="city-stats"><b>04 <small>MISSIONS</small></b><b>04 <small>ZONES</small></b><b>∞ <small>EXPANSION</small></b></div></div><div className="grid-city">{Array.from({length:24}).map((_,i)=><i key={i} style={{height:`${35+(i%6)*18}px`}}/>)}</div></section><section className="missions"><div className="mission-head"><div><p className="eyebrow">ACTIVE OPERATIONS</p><h2>Choose your mission.</h2></div><span>XP + REWARDS</span></div><div className="mission-grid">{missions.map((m,i)=><button className={active===m.id?'mission selected':'mission'} key={m.id} onClick={()=>setActive(m.id)}><small>0{i+1} · {m.difficulty}</small><h3>{m.title}</h3><p>{m.zone}</p><b>+{m.xp} XP</b><em>{active===m.id?'MISSION SELECTED':'SELECT →'}</em></button>)}</div></section></main>;
}
