const systems = [
  ['AI OS','AI assistant, coding, files, agents and automation.','01'],
  ['CYBER WORLD','Missions, profiles, challenges and a living digital city.','02'],
  ['METAVERSE','3D spaces, avatars, multiplayer rooms and events.','03'],
  ['ZYVORA CLOUD','Files, hosting, deployments and server control.','04'],
  ['GAMES HUB','Games, achievements, leaderboards and launcher.','05'],
  ['DEVELOPER','Projects, APIs, SDKs, GitHub and deployments.','06'],
  ['STORE','Themes, avatars, digital items and experiences.','07'],
  ['ZYVORA CORE','One identity, permissions, XP, data and security.','08'],
];

export default function Home() {
  return <main>
    <header className="nav"><div className="brand"><span>ZX</span> ZYVORA <b>ULTRA X</b></div><nav><a>Explore</a><a>AI OS</a><a>Cloud</a><a>Games</a><a>Metaverse</a></nav><button>ENTER CORE</button></header>
    <section className="hero"><div className="orb"/><p className="eyebrow">NEXT-GENERATION DIGITAL ECOSYSTEM</p><h1>ZYVORA<br/><em>ULTRA X</em></h1><p className="lead">AI OS × Cyber World × Metaverse × Cloud — one connected ZYVORA universe.</p><div className="actions"><button className="primary">LAUNCH ULTRA X</button><button className="ghost">EXPLORE SYSTEMS</button></div><div className="status"><i/> CORE ONLINE <span>•</span> WEB FOUNDATION READY <span>•</span> BUILD 0.1</div></section>
    <section className="systems"><div className="section-head"><div><p className="eyebrow">THE ECOSYSTEM</p><h2>ONE CORE.<br/>EIGHT WORLDS.</h2></div><p>Every department shares the same identity, account, data layer and design language.</p></div><div className="grid">{systems.map(([name,desc,num])=><article key={name}><small>{num}</small><h3>{name}</h3><p>{desc}</p><span>OPEN MODULE →</span></article>)}</div></section>
    <section className="roadmap"><p className="eyebrow">BUILD ROADMAP</p><h2>FROM CORE TO UNIVERSE.</h2><div className="steps"><b>01 FOUNDATION</b><b>02 CORE</b><b>03 AI OS</b><b>04 CLOUD</b><b>05 GAMES</b><b>06 CYBER WORLD</b><b>07 METAVERSE</b></div></section>
    <footer>© 2026 ZYVORA ULTRA X <span>PLAY • EXPLORE • LEARN • CREATE</span></footer>
  </main>;
}
