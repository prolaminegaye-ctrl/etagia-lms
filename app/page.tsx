'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.rev').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased;}
        body{font-family:var(--sans);background:var(--canvas);color:var(--ink);line-height:1.6;overflow-x:hidden;}
        ::selection{background:var(--gold-100);color:var(--gold-900);}
        a{text-decoration:none;color:inherit;}
        .lp-wrap{max-width:1180px;margin:0 auto;padding:0 32px;}
        h1,h2,h3{font-family:var(--serif);font-weight:600;letter-spacing:-0.02em;line-height:1.05;}
        .gt{background:var(--grad-signature);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
        .gt-ia{background:var(--grad-ia);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
        .eyebrow{font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--orange-700);display:inline-flex;align-items:center;gap:9px;}
        .eyebrow::before{content:"";width:20px;height:2px;border-radius:2px;background:var(--orange);}
        .eyebrow-c{justify-content:center;}
        .lp-btn{display:inline-flex;align-items:center;gap:9px;border:none;cursor:pointer;font-family:var(--sans);font-weight:700;border-radius:999px;padding:14px 26px;font-size:15px;transition:transform .16s ease, box-shadow .16s ease;}
        .lp-btn:hover{transform:translateY(-2px);}
        .btn-primary{background:var(--grad-signature);color:#fff;box-shadow:0 18px 44px rgba(221,94,58,.30);}
        .btn-primary:hover{box-shadow:0 22px 50px rgba(221,94,58,.40);}
        .btn-ghost{background:var(--surface);color:var(--ink);border:1.5px solid var(--line);box-shadow:var(--sh-1);}
        .btn-ghost:hover{border-color:var(--gold-300);}
        .btn-light{background:rgba(255,255,255,.16);color:#fff;backdrop-filter:blur(6px);border:1.5px solid rgba(255,255,255,.3);}
        /* NAV */
        .lp-nav{position:sticky;top:0;z-index:50;background:rgba(250,246,238,.82);backdrop-filter:blur(14px);border-bottom:1px solid var(--line-soft);}
        .nav-in{display:flex;align-items:center;justify-content:space-between;height:72px;}
        .brand{display:flex;align-items:center;gap:12px;}
        .brand .wm{font-family:var(--serif);font-size:21px;font-weight:700;letter-spacing:-.02em;line-height:1;}
        .brand .sb{font-size:9px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-soft);margin-top:3px;}
        .nav-links{display:flex;align-items:center;gap:30px;}
        .nav-links a{font-size:14.5px;font-weight:600;color:var(--ink-mut);transition:color .15s;}
        .nav-links a:hover{color:var(--ink);}
        .nav-cta{display:flex;align-items:center;gap:14px;}
        .nav-cta .login{font-size:14.5px;font-weight:700;color:var(--ink);}
        .lp-nav .lp-btn{padding:10px 20px;font-size:14px;}
        /* HERO */
        .hero{position:relative;overflow:hidden;padding:64px 0 30px;}
        .hero-glow{position:absolute;inset:0;z-index:0;pointer-events:none;}
        .hero-glow i{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55;}
        .hero-glow .a{top:-140px;left:-80px;width:460px;height:460px;background:radial-gradient(circle,rgba(249,199,90,.4),transparent 70%);}
        .hero-glow .b{top:-60px;right:-60px;width:420px;height:420px;background:radial-gradient(circle,rgba(240,137,74,.33),transparent 70%);}
        .hero-glow .c{bottom:-160px;left:30%;width:380px;height:380px;background:radial-gradient(circle,rgba(22,196,188,.2),transparent 70%);}
        .hero-grid{position:relative;z-index:1;display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center;}
        .hero-pill{display:inline-flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:7px 8px 7px 7px;box-shadow:var(--sh-1);font-size:13px;font-weight:600;color:var(--ink-mut);margin-bottom:26px;}
        .hero-pill .tag{background:var(--grad-energie);color:#fff;font-weight:800;font-size:11px;letter-spacing:.04em;padding:4px 11px;border-radius:999px;}
        .hero h1{font-size:clamp(36px,4.6vw,58px);line-height:1.05;letter-spacing:-0.025em;}
        .hero .sub{margin-top:24px;font-size:18px;color:var(--ink-mut);max-width:32ch;line-height:1.55;}
        .hero .cta-row{display:flex;gap:14px;margin-top:32px;flex-wrap:wrap;}
        .hero .trust{margin-top:34px;display:flex;align-items:center;gap:16px;}
        .trust .stack{display:flex;}
        .trust .av{width:38px;height:38px;border-radius:50%;border:2.5px solid var(--canvas);margin-left:-10px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;}
        .trust .av:first-child{margin-left:0;}
        .trust .tx{font-size:13.5px;color:var(--ink-mut);line-height:1.4;}
        .trust .tx b{color:var(--ink);}
        /* mock */
        .mock{position:relative;}
        .mock-card{background:var(--surface);border:1px solid var(--line);border-radius:30px;box-shadow:var(--sh-3);overflow:hidden;transform:rotate(1.2deg);}
        .mock-top{background:var(--grad-signature);padding:18px 20px;display:flex;align-items:center;justify-content:space-between;}
        .mock-top .mt-l{display:flex;align-items:center;gap:11px;}
        .mock-top .dot{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;}
        .mock-top .nm{color:#fff;font-family:var(--serif);font-size:16px;font-weight:600;line-height:1;}
        .mock-top .nm small{display:block;font-family:var(--sans);font-size:9px;font-weight:800;letter-spacing:.14em;opacity:.8;margin-top:3px;}
        .mock-top .pp{color:#fff;font-size:12px;font-weight:800;background:rgba(255,255,255,.2);padding:5px 11px;border-radius:999px;}
        .mock-body{padding:18px;}
        .mock-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
        .mc{border-radius:14px;padding:14px;color:#fff;}
        .mc .lab{font-size:11px;font-weight:700;opacity:.9;}
        .mc .big{font-family:var(--sans);font-size:24px;font-weight:900;letter-spacing:-.5px;margin-top:6px;line-height:1;}
        .mc .barb{height:6px;background:rgba(255,255,255,.3);border-radius:99px;margin-top:11px;overflow:hidden;}
        .mc .barb i{display:block;height:100%;background:#fff;border-radius:99px;}
        .mock-list{background:var(--surface-2);border-radius:14px;padding:14px;}
        .mock-li{display:flex;align-items:center;gap:11px;padding:8px 0;border-bottom:1px solid var(--line-soft);}
        .mock-li:last-child{border-bottom:none;}
        .mock-li .ic{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
        .mock-li .t{font-size:12.5px;font-weight:700;color:var(--ink);}
        .mock-li .pct{margin-left:auto;font-size:13px;font-weight:900;}
        .mock-badge{position:absolute;background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--sh-2);padding:12px 15px;display:flex;align-items:center;gap:11px;}
        .mock-badge .e{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;}
        .mock-badge .l1{font-size:13px;font-weight:800;color:var(--ink);line-height:1.1;}
        .mock-badge .l2{font-size:11px;color:var(--ink-soft);font-weight:600;}
        .mb-1{top:-22px;right:-14px;transform:rotate(-3deg);}
        .mb-2{bottom:30px;left:-30px;transform:rotate(2deg);}
        /* logos strip */
        .logos{padding:30px 0 10px;}
        .logos .lab{text-align:center;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:20px;}
        .logos .row{display:flex;justify-content:center;align-items:center;gap:46px;flex-wrap:wrap;opacity:.7;}
        .logos .row span{font-family:var(--serif);font-size:21px;font-weight:600;color:var(--ink-mut);}
        /* SECTIONS */
        section{position:relative;}
        .sec{padding:90px 0;}
        .sec-head{text-align:center;max-width:660px;margin:0 auto 54px;}
        .sec-head h2{font-size:clamp(30px,3.6vw,46px);margin:16px 0 14px;}
        .sec-head p{font-size:18px;color:var(--ink-mut);line-height:1.55;}
        /* VALUE CARDS */
        .val-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
        .val{border-radius:22px;padding:30px;color:#fff;position:relative;overflow:hidden;box-shadow:var(--sh-2);min-height:260px;display:flex;flex-direction:column;}
        .val .vc-ic{width:54px;height:54px;border-radius:15px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:25px;margin-bottom:auto;}
        .val h3{font-size:24px;color:#fff;margin-top:22px;}
        .val p{font-size:14.5px;color:rgba(255,255,255,.9);margin-top:10px;line-height:1.55;}
        .val .glow{position:absolute;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.16);filter:blur(40px);top:-60px;right:-50px;}
        .v-ia{background:var(--grad-ia);}
        .v-prog{background:var(--grad-signature);}
        .v-cert{background:var(--grad-energie);}
        /* FUNNEL */
        .funnel{background:var(--surface-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
        .funnel-wrap{display:grid;grid-template-columns:.85fr 1.15fr;gap:54px;align-items:center;}
        .funnel-steps{display:flex;flex-direction:column;gap:14px;align-items:center;}
        .fstep{width:100%;border-radius:16px;padding:18px 24px;color:#fff;display:flex;align-items:center;gap:16px;box-shadow:var(--sh-2);}
        .fstep .n{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;flex-shrink:0;}
        .fstep .ft{font-weight:800;font-size:16px;}
        .fstep .fd{font-size:12.5px;opacity:.88;font-weight:500;margin-top:1px;}
        .fstep.s1{width:100%;background:linear-gradient(120deg,#FBCF5E,#F4B01E);}
        .fstep.s2{width:90%;background:linear-gradient(120deg,#0FB6CC,#16C4BC);}
        .fstep.s3{width:80%;background:linear-gradient(120deg,#F4A52A,#EC7A1E);}
        .fstep.s4{width:70%;background:linear-gradient(120deg,#F0894A,#DD5E3A);}
        .fstep.s5{width:60%;background:linear-gradient(120deg,#7A45FF,#5A27D4);}
        .fstep .arr{margin-left:auto;font-size:18px;opacity:.85;}
        /* AI TUTOR */
        .aiband{padding:0;}
        .aiband-in{background:var(--grad-ia);border-radius:30px;padding:54px 56px;color:#fff;display:grid;grid-template-columns:1.2fr .8fr;gap:40px;align-items:center;position:relative;overflow:hidden;box-shadow:var(--sh-3);}
        .aiband-in .glow{position:absolute;width:340px;height:340px;border-radius:50%;background:rgba(255,255,255,.14);filter:blur(60px);top:-120px;right:-60px;}
        .aiband .ai-eye{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.85);}
        .aiband h2{color:#fff;font-size:clamp(28px,3.2vw,40px);margin-top:14px;}
        .aiband p{color:rgba(255,255,255,.92);font-size:16.5px;margin-top:14px;line-height:1.55;max-width:42ch;}
        .aiband .ai-cta{margin-top:26px;display:flex;gap:13px;flex-wrap:wrap;}
        .ai-chat{position:relative;z-index:1;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:18px;padding:18px;backdrop-filter:blur(6px);}
        .ai-msg{border-radius:13px;padding:11px 14px;font-size:13.5px;margin-bottom:10px;line-height:1.45;}
        .ai-msg.u{background:rgba(255,255,255,.92);color:var(--ink);margin-left:30px;}
        .ai-msg.b{background:rgba(255,255,255,.18);color:#fff;margin-right:14px;}
        /* FORMATIONS */
        .form-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        .fcard{background:var(--surface);border:1px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:var(--sh-1);transition:transform .18s ease, box-shadow .18s ease;}
        .fcard:hover{transform:translateY(-5px);box-shadow:var(--sh-2);}
        .fcard .cover{height:120px;position:relative;display:flex;align-items:flex-end;padding:16px;}
        .fcard .cover .emoji{position:absolute;top:14px;right:16px;font-size:26px;filter:drop-shadow(0 2px 5px rgba(0,0,0,.2));}
        .fcard .cover .cat{font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.18);padding:4px 11px;border-radius:999px;}
        .fcard .fb{padding:18px;}
        .fcard .fb h4{font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink);line-height:1.15;}
        .fcard .fb .meta{display:flex;align-items:center;gap:14px;margin-top:12px;font-size:12.5px;color:var(--ink-soft);font-weight:600;}
        .fcard .fb .meta .star{color:var(--gold);}
        /* TESTIMONIAL */
        .testi{background:var(--surface-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
        .testi-card{max-width:840px;margin:0 auto;text-align:center;}
        .testi-card .quote{font-family:var(--serif);font-size:clamp(24px,3vw,34px);line-height:1.3;color:var(--ink);font-style:italic;}
        .testi-card .who{margin-top:28px;display:flex;align-items:center;justify-content:center;gap:14px;}
        .testi-card .who .av{width:50px;height:50px;border-radius:50%;background:var(--grad-signature);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px;}
        .testi-card .who .nm{text-align:left;}
        .testi-card .who .nm b{display:block;font-weight:800;font-size:15px;}
        .testi-card .who .nm span{font-size:13px;color:var(--ink-soft);font-weight:600;}
        /* FINAL CTA */
        .final{padding:96px 0;}
        .final-in{position:relative;background:var(--grad-signature);border-radius:30px;padding:70px 40px;text-align:center;color:#fff;overflow:hidden;box-shadow:var(--sh-3);}
        .final-in .glow{position:absolute;width:420px;height:420px;border-radius:50%;background:rgba(255,255,255,.16);filter:blur(70px);}
        .final-in .g1{top:-160px;left:-80px;}
        .final-in .g2{bottom:-180px;right:-60px;}
        .final-in .rel{position:relative;z-index:1;}
        .final-in h2{font-size:clamp(32px,4vw,52px);color:#fff;max-width:16ch;margin:0 auto;line-height:1.05;}
        .final-in p{font-size:18px;color:rgba(255,255,255,.92);margin:18px auto 0;max-width:44ch;}
        .final-in .cta-row{display:flex;gap:14px;justify-content:center;margin-top:32px;flex-wrap:wrap;}
        .final-in .micro{margin-top:18px;font-size:13px;color:rgba(255,255,255,.85);font-weight:600;}
        /* FOOTER */
        .foot{padding:64px 0 40px;}
        .foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px;}
        .foot .brand{margin-bottom:16px;}
        .foot p{font-size:13.5px;color:var(--ink-mut);max-width:30ch;line-height:1.55;}
        .foot h5{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:16px;}
        .foot ul{list-style:none;display:flex;flex-direction:column;gap:11px;}
        .foot ul a{font-size:14px;color:var(--ink-mut);font-weight:600;}
        .foot ul a:hover{color:var(--ink);}
        .foot-bot{margin-top:48px;padding-top:24px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;font-size:13px;color:var(--ink-soft);font-weight:600;}
        /* REVEAL */
        .rev{opacity:0;transform:translateY(22px);}
        @media (prefers-reduced-motion:no-preference){.rev{transition:opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1);}}
        .rev.in{opacity:1;transform:none;}
        @media (max-width:940px){
          .nav-links{display:none;}
          .hero-grid{grid-template-columns:1fr;gap:50px;}
          .hero .sub{max-width:none;}
          .mock-card{transform:none;}
          .mb-2{left:-12px;}
          .val-grid,.form-grid{grid-template-columns:1fr;}
          .funnel-wrap{grid-template-columns:1fr;gap:36px;}
          .aiband-in{grid-template-columns:1fr;padding:38px 28px;}
          .foot-grid{grid-template-columns:1fr 1fr;gap:30px;}
        }
      `}</style>

      {/* SVG symbol — logo mark */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="lp-eg-sig" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F9C75A"/><stop offset=".5" stopColor="#F0894A"/><stop offset="1" stopColor="#DD5E3A"/>
          </linearGradient>
          <linearGradient id="lp-eg-spark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FBE08C"/><stop offset="1" stopColor="#F0A330"/>
          </linearGradient>
        </defs>
        <symbol id="lp-etagia-mark" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="18" fill="url(#lp-eg-sig)"/>
          <g fill="#fff">
            <rect x="16" y="20" width="7" height="28" rx="3.5"/>
            <rect x="16" y="20" width="25" height="7" rx="3.5"/>
            <rect x="16" y="30.5" width="19" height="7" rx="3.5"/>
            <rect x="16" y="41" width="25" height="7" rx="3.5"/>
          </g>
          <g fill="#fff" stroke="#fff">
            <circle cx="47" cy="16" r="4.2" stroke="none"/>
            <g strokeWidth="2.2" strokeLinecap="round">
              <line x1="47" y1="6" x2="47" y2="8.4"/><line x1="47" y1="23.6" x2="47" y2="26"/>
              <line x1="37.4" y1="16" x2="39.8" y2="16"/><line x1="54.2" y1="16" x2="56.6" y2="16"/>
              <line x1="40.2" y1="9.2" x2="41.9" y2="10.9"/><line x1="52.1" y1="21.1" x2="53.8" y2="22.8"/>
              <line x1="53.8" y1="9.2" x2="52.1" y2="10.9"/><line x1="41.9" y1="21.1" x2="40.2" y2="22.8"/>
            </g>
          </g>
        </symbol>
      </svg>

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-wrap nav-in">
          <Link className="brand" href="/">
            <svg width="40" height="40" style={{ filter: 'drop-shadow(0 6px 14px rgba(221,94,58,.30))' }}><use href="#lp-etagia-mark"/></svg>
            <div><div className="wm">EtagIA</div><div className="sb">Académie</div></div>
          </Link>
          <div className="nav-links">
            <a href="#valeur">Pourquoi EtagIA</a>
            <a href="#parcours">Parcours</a>
            <a href="#ia">AI Tutor</a>
            <a href="#formations">Formations</a>
          </div>
          <div className="nav-cta">
            <Link className="login" href="/auth">Se connecter</Link>
            <Link href="/auth" className="lp-btn btn-primary">Commencer gratuitement</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero" id="top">
        <div className="hero-glow"><i className="a"></i><i className="b"></i><i className="c"></i></div>
        <div className="lp-wrap hero-grid">
          <div className="hero-copy">
            <div className="hero-pill"><span className="tag">NOUVEAU</span><span>AI Tutor disponible 24/7 en français</span></div>
            <h1>Apprendre, <span className="gt">grandir</span>,<br/>réussir en Afrique.</h1>
            <p className="sub">La plateforme d&apos;apprentissage qui vous propulse — cours, classes en direct et tuteur IA, pensés pour l&apos;avenir de l&apos;éducation africaine.</p>
            <div className="cta-row">
              <Link href="/auth" className="lp-btn btn-primary">Commencer gratuitement →</Link>
              <Link href="/landing" className="lp-btn btn-ghost">▶ Voir la démo</Link>
            </div>
            <div className="trust">
              <div className="stack">
                <span className="av" style={{ background: 'var(--grad-ia)' }}>A</span>
                <span className="av" style={{ background: 'var(--grad-signature)' }}>M</span>
                <span className="av" style={{ background: 'var(--grad-energie)' }}>K</span>
                <span className="av" style={{ background: 'var(--violet)' }}>F</span>
              </div>
              <div className="tx"><b>Des apprenants motivés</b><br/>à travers l&apos;Afrique francophone.</div>
            </div>
          </div>

          {/* product mock */}
          <div className="mock">
            <div className="mock-card">
              <div className="mock-top">
                <div className="mt-l">
                  <span className="dot"><svg width="22" height="22"><use href="#lp-etagia-mark"/></svg></span>
                  <span className="nm">Bonjour, Lamine<small>TABLEAU DE BORD</small></span>
                </div>
                <span className="pp">+5% 🔥</span>
              </div>
              <div className="mock-body">
                <div className="mock-row">
                  <div className="mc" style={{ background: 'var(--grad-ia)' }}><div className="lab">Progression</div><div className="big">68%</div><div className="barb"><i style={{ width: '68%' }}></i></div></div>
                  <div className="mc" style={{ background: 'var(--grad-energie)' }}><div className="lab">Score moyen</div><div className="big">82/100</div><div className="barb"><i style={{ width: '82%' }}></i></div></div>
                </div>
                <div className="mock-list">
                  <div className="mock-li"><span className="ic" style={{ background: 'var(--turq-50)' }}>📘</span><span className="t">Data Science</span><span className="pct" style={{ color: 'var(--turq-700)' }}>72%</span></div>
                  <div className="mock-li"><span className="ic" style={{ background: 'var(--orange-50)' }}>📈</span><span className="t">Marketing Digital</span><span className="pct" style={{ color: 'var(--orange-700)' }}>45%</span></div>
                  <div className="mock-li"><span className="ic" style={{ background: 'var(--gold-50)' }}>🎓</span><span className="t">Leadership</span><span className="pct" style={{ color: 'var(--gold-700)' }}>30%</span></div>
                </div>
              </div>
            </div>
            <div className="mock-badge mb-1"><span className="e" style={{ background: 'var(--grad-energie)' }}>🏆</span><div><div className="l1">Certification</div><div className="l2">Niveau atteint</div></div></div>
            <div className="mock-badge mb-2"><span className="e" style={{ background: 'var(--grad-ia)' }}>✦</span><div><div className="l1">AI Tutor</div><div className="l2">Réponse en 2s</div></div></div>
          </div>
        </div>

        <div className="lp-wrap logos">
          <div className="lab">Une expérience pensée pour réussir</div>
          <div className="row"><span>Pass&apos;BAC</span><span>Marketplace</span><span>Classes Live</span><span>Parcours adaptatif</span><span>Certifications</span></div>
        </div>
      </header>

      {/* VALEUR */}
      <section className="sec" id="valeur">
        <div className="lp-wrap">
          <div className="sec-head rev">
            <div className="eyebrow eyebrow-c">Pourquoi EtagIA</div>
            <h2>Tout ce qu&apos;il faut pour <span className="gt">progresser vraiment.</span></h2>
            <p>Une plateforme complète qui transforme la motivation en résultats concrets.</p>
          </div>
          <div className="val-grid">
            <div className="val v-ia rev"><div className="glow"></div><div className="vc-ic">🤖</div><h3>Intelligence intégrée</h3><p>Un tuteur IA qui répond à vos questions, explique et s&apos;adapte à votre rythme, 24h/24, en français.</p></div>
            <div className="val v-prog rev"><div className="glow"></div><div className="vc-ic">📈</div><h3>Progression visible</h3><p>Parcours adaptatifs, suivi clair de votre avancement et objectifs qui vous gardent motivé jusqu&apos;au bout.</p></div>
            <div className="val v-cert rev"><div className="glow"></div><div className="vc-ic">🏆</div><h3>Réussite certifiée</h3><p>Des certifications reconnues qui valorisent vos compétences et ouvrent de vraies opportunités.</p></div>
          </div>
        </div>
      </section>

      {/* ENTONNOIR / PARCOURS */}
      <section className="sec funnel" id="parcours">
        <div className="lp-wrap funnel-wrap">
          <div className="rev">
            <div className="eyebrow">Votre parcours</div>
            <h2 style={{ fontSize: 'clamp(28px,3.4vw,42px)', margin: '16px 0 14px' }}>De la curiosité<br/>à la <span className="gt">réussite.</span></h2>
            <p style={{ fontSize: '17px', color: 'var(--ink-mut)', lineHeight: 1.6, maxWidth: '38ch' }}>Un chemin clair, étape par étape. Chaque palier vous rapproche de votre objectif — sans jamais vous perdre en route.</p>
            <Link href="/auth" className="lp-btn btn-primary" style={{ marginTop: '28px', display: 'inline-flex' }}>Démarrer mon parcours →</Link>
          </div>
          <div className="funnel-steps rev">
            <div className="fstep s1"><span className="n">1</span><div><div className="ft">Découvrir</div><div className="fd">Explorez la marketplace, trouvez votre voie</div></div><span className="arr">↓</span></div>
            <div className="fstep s2"><span className="n">2</span><div><div className="ft">Apprendre</div><div className="fd">Cours interactifs &amp; classes en direct</div></div><span className="arr">↓</span></div>
            <div className="fstep s3"><span className="n">3</span><div><div className="ft">Pratiquer</div><div className="fd">Exercices, quiz et AI Tutor à vos côtés</div></div><span className="arr">↓</span></div>
            <div className="fstep s4"><span className="n">4</span><div><div className="ft">Valider</div><div className="fd">Évaluations et progression mesurée</div></div><span className="arr">↓</span></div>
            <div className="fstep s5"><span className="n">5</span><div><div className="ft">Réussir</div><div className="fd">Certification reconnue en main</div></div><span className="arr">🎓</span></div>
          </div>
        </div>
      </section>

      {/* AI TUTOR */}
      <section className="sec" id="ia">
        <div className="lp-wrap aiband">
          <div className="aiband-in rev">
            <div className="glow"></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="ai-eye">✦ AI Tutor</div>
              <h2>Un professeur particulier,<br/>dans votre poche.</h2>
              <p>Posez une question à toute heure. L&apos;AI Tutor explique, reformule et vous guide pas à pas — comme un mentor qui ne dort jamais.</p>
              <div className="ai-cta">
                <Link href="/auth" className="lp-btn btn-light">Essayer l&apos;AI Tutor</Link>
              </div>
            </div>
            <div className="ai-chat">
              <div className="ai-msg u">Explique-moi le théorème de Pythagore simplement 🙏</div>
              <div className="ai-msg b">Bien sûr&nbsp;! Dans un triangle rectangle, le carré de l&apos;hypoténuse égale la somme des carrés des deux autres côtés&nbsp;: <b>a² + b² = c²</b>. Veux-tu un exemple chiffré&nbsp;?</div>
              <div className="ai-msg u">Oui, avec un dessin !</div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMATIONS */}
      <section className="sec" id="formations">
        <div className="lp-wrap">
          <div className="sec-head rev">
            <div className="eyebrow eyebrow-c">Formations populaires</div>
            <h2>Apprenez ce qui <span className="gt">compte vraiment.</span></h2>
            <p>Des compétences concrètes, alignées sur les opportunités du continent.</p>
          </div>
          <div className="form-grid">
            <div className="fcard rev">
              <div className="cover" style={{ background: 'var(--grad-ia)' }}><span className="emoji">💻</span><span className="cat">Tech</span></div>
              <div className="fb"><h4>Data Science avec Python</h4><div className="meta"><span className="star">★ 4.9</span><span>24 leçons</span><span>Certifiant</span></div></div>
            </div>
            <div className="fcard rev">
              <div className="cover" style={{ background: 'var(--grad-signature)' }}><span className="emoji">📣</span><span className="cat">Business</span></div>
              <div className="fb"><h4>Marketing Digital Afrique</h4><div className="meta"><span className="star">★ 4.8</span><span>18 leçons</span><span>Certifiant</span></div></div>
            </div>
            <div className="fcard rev">
              <div className="cover" style={{ background: 'var(--grad-energie)' }}><span className="emoji">🎯</span><span className="cat">Soft Skills</span></div>
              <div className="fb"><h4>Leadership &amp; Management</h4><div className="meta"><span className="star">★ 4.9</span><span>12 leçons</span><span>Certifiant</span></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGE */}
      <section className="sec testi">
        <div className="lp-wrap testi-card rev">
          <div className="eyebrow eyebrow-c" style={{ marginBottom: '24px' }}>Ils ont réussi</div>
          <div className="quote">«&nbsp;EtagIA m&apos;a redonné <span className="gt">l&apos;envie d&apos;apprendre</span>. Les cours sont vivants, l&apos;IA répond à toute heure, et j&apos;ai décroché ma certification en trois mois.&nbsp;»</div>
          <div className="who">
            <div className="av">A</div>
            <div className="nm"><b>Aïssatou Diallo</b><span>Étudiante en Data Science · Dakar</span></div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final">
        <div className="lp-wrap">
          <div className="final-in rev">
            <div className="glow g1"></div><div className="glow g2"></div>
            <div className="rel">
              <h2>Votre avenir commence aujourd&apos;hui.</h2>
              <p>Rejoignez EtagIA et transformez votre ambition en réussite. C&apos;est gratuit pour démarrer.</p>
              <div className="cta-row">
                <Link href="/auth" className="lp-btn" style={{ background: 'var(--surface)', color: 'var(--orange-700)', border: 'none' }}>Créer mon compte gratuit →</Link>
                <Link href="/auth" className="lp-btn btn-light">Parler à un conseiller</Link>
              </div>
              <div className="micro">Aucune carte requise · Accès immédiat · Annulable à tout moment</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="lp-wrap">
          <div className="foot-grid">
            <div>
              <Link className="brand" href="/">
                <svg width="38" height="38"><use href="#lp-etagia-mark"/></svg>
                <div><div className="wm">EtagIA</div><div className="sb">Académie</div></div>
              </Link>
              <p>La formation qui vous propulse — l&apos;avenir de l&apos;éducation africaine.</p>
            </div>
            <div><h5>Plateforme</h5><ul><li><a href="/cours">Cours</a></li><li><a href="/live">Classes live</a></li><li><a href="/tutor">AI Tutor</a></li><li><a href="/apprenant/passbac">Pass&apos;BAC</a></li></ul></div>
            <div><h5>Ressources</h5><ul><li><a href="/market">Marketplace</a></li><li><a href="/dashboard">Certifications</a></li><li><a href="#">Blog</a></li><li><a href="#">Aide</a></li></ul></div>
            <div><h5>EtagIA</h5><ul><li><a href="#">À propos</a></li><li><a href="#">Formateurs</a></li><li><a href="#">Contact</a></li><li><a href="#">Carrières</a></li></ul></div>
          </div>
          <div className="foot-bot">
            <span>© 2026 EtagIA Académie. Tous droits réservés.</span>
            <span>Conçu pour l&apos;Afrique francophone 🌍</span>
          </div>
        </div>
      </footer>
    </>
  )
}
