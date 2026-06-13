'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  orange: '#E8651A', gold: '#D4A017', teal: '#00BFA5', purple: '#7C3AED',
  dark: '#1C1917', mid: '#57534E', muted: '#A8A29E',
  bg: '#FAFAF8', white: '#FFFFFF', border: 'rgba(28,25,23,0.08)',
}
const card: React.CSSProperties = {
  background: C.white, borderRadius: '20px',
  border: `1px solid ${C.border}`, boxShadow: '0 2px 20px rgba(28,25,23,0.05)',
}

// ─── Reusable components ──────────────────────────────────────────────────────
function Tag({ children, color = C.orange }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', background:`${color}15`, color, borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:'700', letterSpacing:'0.3px' }}>
      {children}
    </span>
  )
}
function Pill({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 14px', background:C.white, borderRadius:'20px', border:`1px solid ${C.border}`, boxShadow:'0 1px 6px rgba(28,25,23,0.06)', fontSize:'13px', fontWeight:'600', color:C.mid, whiteSpace:'nowrap' as const }}>
      <span>{icon}</span>{text}
    </div>
  )
}

// ─── Features data ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon:'🤖', title:'IA intégrée', desc:'Génération de cours, quiz adaptatifs, tuteur personnalisé et recommandations intelligentes alimentés par Claude AI.', color:C.purple, tag:'IA Générative' },
  { icon:'🎥', title:'Classes en direct', desc:'Sessions BigBlueButton intégrées : tableau blanc, sondages, enregistrement automatique et sous-titres en temps réel.', color:C.teal, tag:'BigBlueButton' },
  { icon:'📊', title:'Analytics avancés', desc:'Tableaux de bord détaillés, taux de complétion, progression par apprenant et exports CSV pour chaque organisation.', color:C.orange, tag:'Data & BI' },
  { icon:'🏷', title:'White Label', desc:'Logo, couleurs, domaine, emails et certificats personnalisés. Chaque organisation garde son identité visuelle.', color:C.gold, tag:'Multi-tenant' },
  { icon:'📜', title:'Certificats digitaux', desc:'Génération automatique de certificats vérifiables en ligne avec signature, QR code et export PDF.', color:C.orange, tag:'Blockchain-ready' },
  { icon:'🧠', title:'Parcours adaptatifs', desc:'L\'IA ajuste le contenu en temps réel selon le niveau et la progression de chaque apprenant.', color:C.purple, tag:'Adaptatif' },
  { icon:'📱', title:'Mobile-first', desc:'Interface optimisée pour les smartphones avec mode hors-ligne, faible consommation de données et sync automatique.', color:C.teal, tag:'Mobile' },
  { icon:'🔌', title:'LTI & Intégrations', desc:'Compatible SCORM 1.2/2004, xAPI, LTI 1.3, Stripe pour les paiements et API REST ouverte.', color:C.gold, tag:'Standards' },
]

const WHY = [
  { icon:'🌍', title:'Pensé pour l\'Afrique', desc:'Interface disponible en français, anglais, arabe et langues locales. Adapté aux infrastructures et usages africains.' },
  { icon:'📡', title:'Faible consommation data', desc:'Contenu optimisé : images compressées, vidéos adaptatives, mode hors-ligne et synchronisation différée.' },
  { icon:'📱', title:'Mobile learning natif', desc:'85% des apprenants africains accèdent à internet via smartphone. Notre UX est mobile-first, pas mobile-adapted.' },
  { icon:'⚡', title:'Déploiement en minutes', desc:'Votre LMS est opérationnel en moins de 10 minutes. Pas de serveur à gérer, pas de code à écrire.' },
  { icon:'🔒', title:'Données souveraines', desc:'Hébergement en Europe ou Afrique au choix. Conformité RGPD, sécurité SSL, sauvegardes automatiques.' },
  { icon:'💰', title:'Prix juste & transparent', desc:'Tarification en USD, EUR ou XOF. Pas de frais cachés. Support inclus. Remboursement 30 jours.' },
]

const TESTIMONIALS = [
  {
    name:'Dr. Aminata Diallo', role:'Directrice pédagogique', org:'Université Cheikh Anta Diop', initials:'AD', color:C.orange,
    text:'ETAGIA LMS a révolutionné notre approche de la formation continue. Nos 2 400 étudiants bénéficient maintenant d\'un accès à des cours de qualité internationale, depuis leur téléphone.',
    kpi:'↑ 340% d\'engagement',
  },
  {
    name:'Moussa Konaté', role:'DRH', org:'Groupe Orange Afrique', initials:'MK', color:C.teal,
    text:'En mode White Label, nos 12 000 collaborateurs accèdent à une plateforme entièrement personnalisée aux couleurs d\'Orange. L\'IA de génération de cours nous a fait gagner 6 mois de travail.',
    kpi:'−60% de coûts formation',
  },
  {
    name:'Fatou Sarr', role:'CEO', org:'Academy Pro Dakar', initials:'FS', color:C.purple,
    text:'Nous avons lancé notre académie digitale en 48h avec ETAGIA. Aujourd\'hui, 800 apprenants suivent nos formations en ligne et génèrent un CA mensuel récurrent.',
    kpi:'800 apprenants actifs',
  },
]

const PRICING = [
  {
    name:'Starter', price:'29', currency:'€', period:'/mois', desc:'Pour débuter votre académie', color:C.teal,
    features:['Jusqu\'à 100 apprenants','5 cours en ligne','1 formateur','Certificats de base','Support email','Sous-domaine ETAGIA'],
    cta:'Démarrer gratuitement', popular:false,
  },
  {
    name:'Pro', price:'99', currency:'€', period:'/mois', desc:'Pour les académies en croissance', color:C.orange,
    features:['Jusqu\'à 1 000 apprenants','Cours illimités','10 formateurs','White Label complet','IA Tutor + génération','BigBlueButton live','Analytics avancés','Domaine personnalisé','Support prioritaire'],
    cta:'Essai 30 jours gratuit', popular:true,
  },
  {
    name:'Enterprise', price:'Sur devis', currency:'', period:'', desc:'Pour les grandes organisations', color:C.purple,
    features:['Apprenants illimités','Formateurs illimités','Multi-tenant avancé','SLA garanti 99.9%','API complète + webhooks','Intégration SSO/LDAP','Formation équipe incluse','Gestionnaire de compte dédié','Hébergement sur site possible'],
    cta:'Contacter l\'équipe', popular:false,
  },
]

const FAQS = [
  { q:'Est-ce que je peux essayer avant de payer ?', a:'Oui ! Vous bénéficiez de 30 jours d\'essai gratuit sur le plan Pro, sans carte bancaire requise. Si vous n\'êtes pas satisfait, nous vous remboursons intégralement.' },
  { q:'Comment fonctionne le White Label ?', a:'Depuis votre panneau admin, vous configurez votre logo, vos couleurs, votre domaine et vos emails en quelques clics. Chaque organisation client voit une plateforme entièrement à ses couleurs.' },
  { q:'Mes données sont-elles sécurisées ?', a:'Oui. Toutes les données sont chiffrées (TLS 1.3), hébergées en Europe (conforme RGPD) et sauvegardées quotidiennement. Vous pouvez exporter vos données à tout moment.' },
  { q:'Puis-je importer mes contenus existants ?', a:'Absolument. ETAGIA LMS est compatible SCORM 1.2, SCORM 2004 et xAPI. Importez vos cours depuis Moodle, Canvas, Blackboard ou tout autre LMS en quelques minutes.' },
  { q:'Y a-t-il une app mobile ?', a:'L\'interface web est 100% responsive et optimisée mobile. Une app iOS/Android native est en cours de développement (Q3 2026). En attendant, vous pouvez l\'ajouter à l\'écran d\'accueil (PWA).' },
  { q:'Quel support est inclus ?', a:'Plan Starter : email (réponse sous 48h). Plan Pro : chat + email (réponse sous 4h). Plan Enterprise : Slack dédié + gestionnaire de compte + formation incluse.' },
]

// ─── Main component ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div style={{ fontFamily:'\'Plus Jakarta Sans\',sans-serif', color:C.dark, background:C.bg, overflowX:'hidden' }}>

      {/* ═══ NAV ═══════════════════════════════════════════════════════════ */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100,
        background: scrolled ? 'rgba(250,250,248,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
        transition:'all .3s', padding:'0 2rem' }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto', height:'68px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:`linear-gradient(135deg,${C.orange},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'800', color:'#fff', fontFamily:'Syne,sans-serif' }}>E</div>
            <span style={{ fontSize:'20px', fontWeight:'800', color:C.dark, fontFamily:'Syne,sans-serif' }}>ETAGIA LMS</span>
          </div>
          <div style={{ display:'flex', gap:'32px', alignItems:'center' }}>
            {['Fonctionnalités','Pourquoi ETAGIA','Tarifs','FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s/g,'-').replace(/[éêè]/g,'e').replace('î','i').replace('â','a')}`}
                style={{ fontSize:'14px', fontWeight:'500', color:C.mid, textDecoration:'none', transition:'color .15s' }}
                onMouseEnter={e=>(e.currentTarget.style.color=C.orange)}
                onMouseLeave={e=>(e.currentTarget.style.color=C.mid)}>
                {l}
              </a>
            ))}
            <Link href="/dashboard" style={{ background:`linear-gradient(135deg,${C.orange},${C.gold})`, color:'#fff', borderRadius:'10px', padding:'9px 20px', fontSize:'13px', fontWeight:'700', textDecoration:'none', boxShadow:`0 4px 16px ${C.orange}40` }}>
              Commencer →
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'120px 2rem 80px', position:'relative', overflow:'hidden', textAlign:'center' }}>
        {/* Gradient orbs */}
        <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'900px', height:'600px', borderRadius:'50%', background:`radial-gradient(ellipse,${C.orange}14 0%,transparent 65%)`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'5%', right:'-5%', width:'500px', height:'500px', borderRadius:'50%', background:`radial-gradient(ellipse,${C.teal}10 0%,transparent 65%)`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'20%', left:'-5%', width:'400px', height:'400px', borderRadius:'50%', background:`radial-gradient(ellipse,${C.purple}08 0%,transparent 65%)`, pointerEvents:'none' }} />

        <div style={{ position:'relative', maxWidth:'820px' }}>
          <Tag color={C.orange}>🌍 La plateforme LMS pensée pour l&apos;Afrique</Tag>
          <h1 style={{ fontSize:'clamp(40px,6vw,72px)', fontWeight:'900', lineHeight:'1.08', margin:'20px 0 20px', fontFamily:'Syne,sans-serif', letterSpacing:'-1.5px' }}>
            Lancez votre{' '}
            <span style={{ background:`linear-gradient(135deg,${C.orange} 0%,${C.gold} 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              académie digitale
            </span>{' '}
            en quelques minutes
          </h1>
          <p style={{ fontSize:'clamp(16px,2.2vw,20px)', color:C.mid, lineHeight:'1.7', marginBottom:'36px', maxWidth:'600px', margin:'0 auto 36px' }}>
            ETAGIA LMS est la plateforme de formation intelligente qui propulse les organisations africaines dans l&apos;ère du digital — IA intégrée, White Label, mobile-first.
          </p>
          <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', marginBottom:'48px' }}>
            <Link href="/dashboard" style={{ background:`linear-gradient(135deg,${C.orange},${C.gold})`, color:'#fff', borderRadius:'14px', padding:'16px 32px', fontSize:'16px', fontWeight:'800', textDecoration:'none', boxShadow:`0 8px 32px ${C.orange}40`, display:'flex', alignItems:'center', gap:'8px' }}>
              🚀 Lancer votre académie digitale
            </Link>
            <a href="#demo" style={{ background:C.white, border:`1.5px solid ${C.border}`, color:C.dark, borderRadius:'14px', padding:'16px 28px', fontSize:'15px', fontWeight:'700', textDecoration:'none', display:'flex', alignItems:'center', gap:'8px', boxShadow:'0 2px 12px rgba(28,25,23,0.06)' }}>
              ▶ Voir la démo
            </a>
          </div>
          {/* Trust badges */}
          <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
            <Pill icon="✅" text="Sans carte bancaire" />
            <Pill icon="⚡" text="Opérationnel en 10 min" />
            <Pill icon="🔒" text="Données sécurisées RGPD" />
            <Pill icon="🌍" text="3 000+ organisations" />
          </div>
        </div>

        {/* Dashboard mockup */}
        <div style={{ position:'relative', maxWidth:'900px', width:'100%', marginTop:'60px' }}>
          <div style={{ background:`linear-gradient(135deg,${C.dark} 0%,#2C1E14 100%)`, borderRadius:'20px', padding:'4px', boxShadow:`0 40px 80px rgba(0,0,0,0.25),0 0 0 1px rgba(255,255,255,0.06)` }}>
            {/* Browser chrome */}
            <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:'16px 16px 0 0', padding:'12px 16px', display:'flex', alignItems:'center', gap:'8px' }}>
              {['#EF4444','#F59E0B','#22C55E'].map(c => <div key={c} style={{ width:'10px', height:'10px', borderRadius:'50%', background:c }} />)}
              <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:'6px', padding:'4px 12px', marginLeft:'8px', fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>etagia-lms.vercel.app/dashboard</div>
            </div>
            {/* Mockup content */}
            <div style={{ background:`${C.bg}`, borderRadius:'0 0 14px 14px', padding:'20px', minHeight:'280px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'10px' }}>
              {[
                { label:'Cours en cours', value:'4', icon:'📚', color:C.orange },
                { label:'Progression', value:'68%', icon:'📈', color:C.teal },
                { label:'Score moyen', value:'82/100', icon:'🏆', color:C.gold },
                { label:'Heures / sem', value:'12h', icon:'⏱', color:C.purple },
              ].map(k => (
                <div key={k.label} style={{ background:C.white, borderRadius:'12px', padding:'14px', border:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${k.color},${k.color}88)` }} />
                  <div style={{ fontSize:'20px', marginBottom:'6px' }}>{k.icon}</div>
                  <div style={{ fontSize:'20px', fontWeight:'800', color:k.color, fontFamily:'Syne,sans-serif' }}>{k.value}</div>
                  <div style={{ fontSize:'11px', color:C.muted }}>{k.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ══════════════════════════════════════════════════════ */}
      <section id="fonctionnalites" style={{ padding:'100px 2rem', background:C.white }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <Tag color={C.purple}>⚡ Fonctionnalités</Tag>
            <h2 style={{ fontSize:'clamp(32px,4vw,50px)', fontWeight:'900', margin:'16px 0 14px', fontFamily:'Syne,sans-serif', letterSpacing:'-1px' }}>
              Tout ce dont vous avez besoin,<br/>rien de ce dont vous n&apos;avez pas besoin
            </h2>
            <p style={{ fontSize:'17px', color:C.mid, maxWidth:'540px', margin:'0 auto' }}>
              Une plateforme complète, pensée pour l&apos;efficacité des formateurs et l&apos;engagement des apprenants.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ ...card, padding:'24px', transition:'all .2s', cursor:'default' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.boxShadow=`0 12px 40px ${f.color}18`}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='0 2px 20px rgba(28,25,23,0.05)'}}>
                <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:`${f.color}14`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', marginBottom:'14px' }}>{f.icon}</div>
                <div style={{ fontSize:'15px', fontWeight:'800', color:C.dark, marginBottom:'6px' }}>{f.title}</div>
                <div style={{ fontSize:'13px', color:C.mid, lineHeight:'1.6', marginBottom:'12px' }}>{f.desc}</div>
                <span style={{ fontSize:'10px', fontWeight:'800', background:`${f.color}14`, color:f.color, borderRadius:'6px', padding:'3px 9px' }}>{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY ETAGIA ════════════════════════════════════════════════════ */}
      <section id="pourquoi-etagia" style={{ padding:'100px 2rem', background:`linear-gradient(180deg,${C.bg} 0%,#FFF4EE 100%)` }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center' }}>
          <div>
            <Tag color={C.orange}>🌍 Pourquoi ETAGIA ?</Tag>
            <h2 style={{ fontSize:'clamp(28px,3.5vw,44px)', fontWeight:'900', margin:'16px 0 20px', fontFamily:'Syne,sans-serif', lineHeight:'1.15', letterSpacing:'-0.8px' }}>
              Conçu pour les réalités<br/>
              <span style={{ background:`linear-gradient(135deg,${C.orange},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>du marché africain</span>
            </h2>
            <p style={{ fontSize:'16px', color:C.mid, lineHeight:'1.7', marginBottom:'28px' }}>
              Les LMS occidentaux ont été conçus pour d&apos;autres contextes. ETAGIA LMS a été pensé dès le premier jour pour les contraintes, les usages et les ambitions des organisations africaines.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              {WHY.map(w => (
                <div key={w.title} style={{ display:'flex', gap:'14px', alignItems:'flex-start' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:`${C.orange}14`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{w.icon}</div>
                  <div>
                    <div style={{ fontWeight:'700', fontSize:'14px', color:C.dark, marginBottom:'3px' }}>{w.title}</div>
                    <div style={{ fontSize:'13px', color:C.mid, lineHeight:'1.6' }}>{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            {[
              { value:'3 000+', label:'Organisations', icon:'🏛', color:C.orange },
              { value:'180 000+', label:'Apprenants actifs', icon:'👥', color:C.teal },
              { value:'12 pays', label:'En Afrique francophone', icon:'🌍', color:C.purple },
              { value:'98.9%', label:'Satisfaction clients', icon:'⭐', color:C.gold },
            ].map(s => (
              <div key={s.label} style={{ ...card, padding:'24px', textAlign:'center' }}>
                <div style={{ fontSize:'28px', marginBottom:'8px' }}>{s.icon}</div>
                <div style={{ fontSize:'32px', fontWeight:'900', color:s.color, fontFamily:'Syne,sans-serif', marginBottom:'4px' }}>{s.value}</div>
                <div style={{ fontSize:'13px', color:C.mid, fontWeight:'600' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHITE LABEL ═══════════════════════════════════════════════════ */}
      <section id="white-label" style={{ padding:'100px 2rem', background:C.dark }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <Tag color={C.gold}>🏷 White Label / Marque Blanche</Tag>
            <h2 style={{ fontSize:'clamp(30px,4vw,48px)', fontWeight:'900', margin:'16px 0 14px', fontFamily:'Syne,sans-serif', color:'#fff', letterSpacing:'-1px' }}>
              Votre plateforme,<br/>
              <span style={{ background:`linear-gradient(135deg,${C.orange},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>votre identité</span>
            </h2>
            <p style={{ fontSize:'17px', color:'rgba(245,240,232,0.65)', maxWidth:'580px', margin:'0 auto' }}>
              Chaque organisation peut personnaliser intégralement la plateforme. Vos apprenants verront votre marque, pas la nôtre.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginBottom:'40px' }}>
            {[
              { icon:'🎨', title:'Logo & Couleurs', desc:'Importez votre charte graphique en quelques clics. Couleurs, typographies, icônes — tout est personnalisable.' },
              { icon:'🌐', title:'Domaine personnalisé', desc:'Votre plateforme sur academie.votre-marque.com avec SSL automatique et configuration DNS guidée.' },
              { icon:'📧', title:'Emails à votre marque', desc:'Templates d\'emails entièrement personnalisés : bienvenue, rappels, certificats — à votre image.' },
              { icon:'🏆', title:'Certificats sur mesure', desc:'Délivrez des certificats portant votre logo, vos couleurs et la signature de votre directeur pédagogique.' },
              { icon:'🔐', title:'Page de connexion', desc:'Bannière, slogan et design de votre page login aux couleurs de votre organisation.' },
              { icon:'👥', title:'Multi-tenant natif', desc:'Gérez plusieurs marques blanches depuis une seule interface admin. Parfait pour les réseaux d\'écoles.' },
            ].map(f => (
              <div key={f.title} style={{ background:'rgba(255,255,255,0.05)', borderRadius:'16px', padding:'20px', border:'1px solid rgba(255,255,255,0.08)', display:'flex', gap:'14px', alignItems:'flex-start' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:`rgba(232,101,26,0.20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight:'700', fontSize:'14px', color:'rgba(245,240,232,0.92)', marginBottom:'5px' }}>{f.title}</div>
                  <div style={{ fontSize:'13px', color:'rgba(245,240,232,0.50)', lineHeight:'1.6' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {/* White Label examples */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
            {[
              { name:'UniConnect', type:'Université', primary:'#4F46E5', bg:'#EEF2FF', emoji:'🎓' },
              { name:'CorpLearn', type:'Entreprise', primary:'#059669', bg:'#ECFDF5', emoji:'💼' },
              { name:'Académie Pro', type:'Centre de formation', primary:'var(--orange)', bg:'#FEF2F2', emoji:'🚀' },
            ].map(ex => (
              <div key={ex.name} style={{ background:ex.bg, borderRadius:'16px', overflow:'hidden', border:`1px solid ${ex.primary}25` }}>
                <div style={{ background:ex.primary, padding:'12px 16px', display:'flex', alignItems:'center', gap:'8px' }}>
                  <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>{ex.emoji}</div>
                  <span style={{ fontWeight:'800', fontSize:'14px', color:'#fff' }}>{ex.name}</span>
                </div>
                <div style={{ padding:'14px' }}>
                  <div style={{ fontSize:'10px', fontWeight:'700', color:ex.primary, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>{ex.type}</div>
                  <div style={{ height:'6px', background:`${ex.primary}20`, borderRadius:'3px', marginBottom:'6px', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:'72%', background:ex.primary, borderRadius:'3px' }} />
                  </div>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <div style={{ flex:1, height:'30px', background:`${ex.primary}15`, borderRadius:'6px' }} />
                    <div style={{ width:'60px', height:'30px', background:ex.primary, borderRadius:'6px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'40px' }}>
            <Link href="/admin/white-label" style={{ background:`linear-gradient(135deg,${C.orange},${C.gold})`, color:'#fff', borderRadius:'14px', padding:'15px 32px', fontSize:'15px', fontWeight:'800', textDecoration:'none', boxShadow:`0 8px 32px ${C.orange}50`, display:'inline-block' }}>
              Configurer votre White Label →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ══════════════════════════════════════════════════ */}
      <section style={{ padding:'100px 2rem', background:C.white }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <Tag color={C.teal}>⭐ Témoignages</Tag>
            <h2 style={{ fontSize:'clamp(28px,3.5vw,44px)', fontWeight:'900', margin:'16px 0', fontFamily:'Syne,sans-serif', letterSpacing:'-0.8px' }}>
              Ils ont transformé<br/>leur formation avec ETAGIA
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ ...card, padding:'28px', display:'flex', flexDirection:'column', gap:'16px' }}>
                <div style={{ fontSize:'32px', lineHeight:1 }}>&ldquo;</div>
                <p style={{ fontSize:'14px', color:C.mid, lineHeight:'1.8', flex:1, margin:0 }}>{t.text}</p>
                <div style={{ background:`${t.color}10`, borderRadius:'10px', padding:'10px 14px', fontSize:'13px', fontWeight:'800', color:t.color }}>{t.kpi}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', borderTop:`1px solid ${C.border}`, paddingTop:'16px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:`linear-gradient(135deg,${t.color},${t.color}99)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'800', color:'#fff', flexShrink:0 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontWeight:'700', fontSize:'13px', color:C.dark }}>{t.name}</div>
                    <div style={{ fontSize:'11px', color:C.muted }}>{t.role} · {t.org}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══════════════════════════════════════════════════════ */}
      <section id="tarifs" style={{ padding:'100px 2rem', background:`linear-gradient(180deg,${C.bg} 0%,#FFF4EE 100%)` }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <Tag color={C.orange}>💰 Tarifs</Tag>
            <h2 style={{ fontSize:'clamp(28px,3.5vw,44px)', fontWeight:'900', margin:'16px 0 14px', fontFamily:'Syne,sans-serif', letterSpacing:'-0.8px' }}>
              Prix simples et transparents
            </h2>
            <p style={{ fontSize:'16px', color:C.mid }}>Pas de frais cachés · Engagement mensuel · Remboursement 30 jours</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px', alignItems:'start' }}>
            {PRICING.map(plan => (
              <div key={plan.name} style={{ ...card, padding:'28px', position:'relative', border: plan.popular ? `2px solid ${C.orange}` : `1px solid ${C.border}`, transform: plan.popular ? 'scale(1.03)' : 'none' }}>
                {plan.popular && (
                  <div style={{ position:'absolute', top:'-14px', left:'50%', transform:'translateX(-50%)', background:`linear-gradient(135deg,${C.orange},${C.gold})`, color:'#fff', borderRadius:'20px', padding:'5px 16px', fontSize:'12px', fontWeight:'800', whiteSpace:'nowrap' }}>
                    ⭐ Le plus populaire
                  </div>
                )}
                <div style={{ marginBottom:'20px' }}>
                  <div style={{ fontSize:'16px', fontWeight:'800', color:C.dark, marginBottom:'4px' }}>{plan.name}</div>
                  <div style={{ fontSize:'12px', color:C.muted, marginBottom:'16px' }}>{plan.desc}</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'2px' }}>
                    {plan.currency && <span style={{ fontSize:'20px', fontWeight:'700', color:plan.color }}>{plan.currency}</span>}
                    <span style={{ fontSize:'42px', fontWeight:'900', color:plan.color, fontFamily:'Syne,sans-serif', lineHeight:1 }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize:'14px', color:C.muted }}>{plan.period}</span>}
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'24px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display:'flex', gap:'8px', alignItems:'flex-start', fontSize:'13px', color:C.mid }}>
                      <span style={{ color:plan.color, fontWeight:'800', flexShrink:0, marginTop:'1px' }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/dashboard" style={{ display:'block', textAlign:'center', background: plan.popular ? `linear-gradient(135deg,${C.orange},${C.gold})` : 'transparent', border: plan.popular ? 'none' : `1.5px solid ${C.border}`, color: plan.popular ? '#fff' : C.dark, borderRadius:'12px', padding:'13px', fontSize:'14px', fontWeight:'800', textDecoration:'none', boxShadow: plan.popular ? `0 6px 24px ${C.orange}40` : 'none' }}>
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══════════════════════════════════════════════════════════ */}
      <section id="faq" style={{ padding:'100px 2rem', background:C.white }}>
        <div style={{ maxWidth:'720px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'56px' }}>
            <Tag color={C.purple}>❓ FAQ</Tag>
            <h2 style={{ fontSize:'clamp(28px,3.5vw,42px)', fontWeight:'900', margin:'16px 0', fontFamily:'Syne,sans-serif', letterSpacing:'-0.8px' }}>
              Questions fréquentes
            </h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ ...card, overflow:'hidden' }}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', textAlign:'left' as const }}>
                  <span style={{ fontWeight:'700', fontSize:'14px', color:C.dark, flex:1 }}>{faq.q}</span>
                  <span style={{ fontSize:'18px', color:C.orange, transition:'transform .2s', transform: faqOpen===i ? 'rotate(45deg)' : 'none', flexShrink:0, marginLeft:'12px' }}>+</span>
                </button>
                {faqOpen === i && (
                  <div style={{ padding:'0 22px 18px', fontSize:'14px', color:C.mid, lineHeight:'1.7', borderTop:`1px solid ${C.border}`, paddingTop:'14px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ════════════════════════════════════════════════════ */}
      <section id="demo" style={{ padding:'80px 2rem', background:`linear-gradient(135deg,${C.dark} 0%,#2C1E14 100%)`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-30%', left:'50%', transform:'translateX(-50%)', width:'800px', height:'600px', borderRadius:'50%', background:`radial-gradient(ellipse,${C.orange}18 0%,transparent 60%)`, pointerEvents:'none' }} />
        <div style={{ maxWidth:'720px', margin:'0 auto', textAlign:'center', position:'relative' }}>
          <span style={{ fontSize:'48px', display:'block', marginBottom:'16px' }}>🚀</span>
          <h2 style={{ fontSize:'clamp(30px,4vw,48px)', fontWeight:'900', color:'#fff', margin:'0 0 16px', fontFamily:'Syne,sans-serif', letterSpacing:'-1px' }}>
            Déployez votre LMS<br/>
            <span style={{ background:`linear-gradient(135deg,${C.orange},${C.gold})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              en quelques minutes
            </span>
          </h2>
          <p style={{ fontSize:'17px', color:'rgba(245,240,232,0.65)', marginBottom:'36px', lineHeight:'1.6' }}>
            Rejoignez 3 000+ organisations qui forment leurs équipes et apprenants avec ETAGIA LMS.
          </p>
          <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/dashboard" style={{ background:`linear-gradient(135deg,${C.orange},${C.gold})`, color:'#fff', borderRadius:'14px', padding:'16px 32px', fontSize:'15px', fontWeight:'800', textDecoration:'none', boxShadow:`0 8px 32px ${C.orange}50` }}>
              Créer votre plateforme gratuitement →
            </Link>
            <a href="mailto:demo@etagia.com" style={{ background:'rgba(255,255,255,0.10)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(245,240,232,0.85)', borderRadius:'14px', padding:'16px 28px', fontSize:'15px', fontWeight:'700', textDecoration:'none' }}>
              📞 Demander une démo
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ════════════════════════════════════════════════════════ */}
      <footer style={{ background:C.dark, borderTop:'1px solid rgba(255,255,255,0.06)', padding:'48px 2rem 32px' }}>
        <div style={{ maxWidth:'1160px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'40px', marginBottom:'40px' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:`linear-gradient(135deg,${C.orange},${C.gold})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:'800', color:'#fff', fontFamily:'Syne,sans-serif' }}>E</div>
                <span style={{ fontSize:'18px', fontWeight:'800', color:'#fff', fontFamily:'Syne,sans-serif' }}>ETAGIA LMS</span>
              </div>
              <p style={{ fontSize:'13px', color:'rgba(245,240,232,0.40)', lineHeight:'1.7', maxWidth:'260px' }}>
                La plateforme LMS intelligente pensée pour l&apos;Afrique francophone et au-delà.
              </p>
            </div>
            {[
              { title:'Produit', links:['Fonctionnalités','Tarifs','White Label','Roadmap','Changelog'] },
              { title:'Ressources', links:['Documentation','API','Guides','Webinaires','Blog'] },
              { title:'Entreprise', links:['À propos','Contact','Partenaires','Presse','Confidentialité'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize:'11px', fontWeight:'800', color:'rgba(245,240,232,0.30)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:'12px' }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ marginBottom:'8px' }}>
                    <a href="#" style={{ fontSize:'13px', color:'rgba(245,240,232,0.50)', textDecoration:'none', transition:'color .15s' }}
                      onMouseEnter={e=>(e.currentTarget.style.color=C.orange)}
                      onMouseLeave={e=>(e.currentTarget.style.color='rgba(245,240,232,0.50)')}>
                      {l}
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
            <div style={{ fontSize:'12px', color:'rgba(245,240,232,0.30)' }}>© 2026 ETAGIA LMS — Propulsé par l&apos;IA · Made in Africa 🌍</div>
            <div style={{ display:'flex', gap:'16px' }}>
              {['Confidentialité','CGU','Cookies'].map(l => (
                <a key={l} href="#" style={{ fontSize:'12px', color:'rgba(245,240,232,0.30)', textDecoration:'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
