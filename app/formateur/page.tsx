'use client'
import { useRouter } from 'next/navigation'

const stats = [
  { label: 'Cours publiés', value: '3', color: '#E8651A', grad: 'linear-gradient(135deg,#E8651A,#D4A017)' },
  { label: 'Apprenants', value: '127', color: '#00BFA5', grad: 'linear-gradient(135deg,#00BFA5,#7C3AED)' },
  { label: 'Taux complétion', value: '74%', color: '#FFB300', grad: 'linear-gradient(135deg,#D4A017,#E8651A)' },
  { label: 'Score moyen', value: '81/100', color: '#7C3AED', grad: 'linear-gradient(135deg,#7C3AED,#00BFA5)' },
]

const actions = [
  { href: '/formateur/creer', icon: '✦', label: "Créer un cours avec l'IA", desc: 'Génère structure + contenu HTML + PDF en 30s', color: '#E8651A', badge: 'IA' },
  { href: '/formateur/import', icon: '↑', label: 'Importer SCORM / H5P', desc: 'Upload et conversion automatique', color: '#00BFA5', badge: null },
  { href: '/formateur/apprenants', icon: '◎', label: 'Voir les apprenants', desc: 'Progression et résultats détaillés', color: '#FFB300', badge: null },
]

const mesCours = [
  { title: 'Data Science avec Python', apprenants: 54, completion: 72, status: 'Publié', color: '#E8651A' },
  { title: 'Marketing Digital Afrique', apprenants: 43, completion: 58, status: 'Publié', color: '#00BFA5' },
  { title: 'Leadership & Management', apprenants: 30, completion: 45, status: 'Brouillon', color: '#FFB300' },
]

export default function FormateurPage() {
  const router = useRouter()
  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: '2rem', padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg,#12100E 0%,#1C1714 100%)', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(232,101,26,0.10)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '25%', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(0,191,165,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'rgba(232,101,26,0.18)', border: '1px solid rgba(232,101,26,0.30)', borderRadius: '8px', padding: '3px 10px', fontSize: '10px', fontWeight: '700', color: '#FF7043', marginBottom: '10px', letterSpacing: '1px' }}>ESPACE FORMATEUR</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#F5F0E8', fontFamily: 'Syne,sans-serif', marginBottom: '6px' }}>Bonjour, Formateur 👨‍🏫</h1>
          <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '14px' }}>Gérez vos cours, suivez vos apprenants et créez du contenu avec l&apos;IA</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#FFFFFF', border: '1.5px solid rgba(28,25,23,0.07)', borderRadius: '18px', padding: '1.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,25,23,0.05)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.grad }} />
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, fontFamily: 'Syne,sans-serif', marginTop: '10px', marginBottom: '4px', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#57534E' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1C1917', fontFamily: 'Syne,sans-serif' }}>Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {actions.map(a => (
          <button key={a.href} onClick={() => router.push(a.href)}
            style={{ background: '#FFFFFF', border: '1.5px solid rgba(28,25,23,0.07)', borderRadius: '18px', padding: '1.5rem', textAlign: 'left', cursor: 'pointer', transition: 'all .2s', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,25,23,0.05)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = a.color + '44'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${a.color}18` }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,25,23,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(28,25,23,0.05)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${a.color},${a.color}88)` }} />
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: a.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: a.color, marginBottom: '14px', marginTop: '6px' }}>{a.icon}</div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1C1917', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {a.label}
              {a.badge && <span style={{ fontSize: '9px', background: a.color + '18', color: a.color, borderRadius: '5px', padding: '2px 6px', fontWeight: '800' }}>{a.badge}</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#A8A29E', lineHeight: 1.5 }}>{a.desc}</div>
            <div style={{ marginTop: '14px', fontSize: '12px', fontWeight: '700', color: a.color }}>Accéder →</div>
          </button>
        ))}
      </div>

      {/* Mes cours */}
      <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1C1917', fontFamily: 'Syne,sans-serif' }}>Mes cours</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {mesCours.map(c => (
          <div key={c.title} style={{ background: '#FFFFFF', border: '1.5px solid rgba(28,25,23,0.07)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 1px 6px rgba(28,25,23,0.04)', transition: 'all .15s' }}>
            <div style={{ width: '4px', height: '44px', borderRadius: '2px', background: `linear-gradient(180deg,${c.color},${c.color}66)`, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#1C1917', marginBottom: '3px' }}>{c.title}</div>
              <div style={{ fontSize: '12px', color: '#A8A29E' }}>{c.apprenants} apprenants · {c.completion}% complétion</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: c.status === 'Publié' ? 'rgba(0,191,165,0.12)' : 'rgba(255,179,0,0.12)', color: c.status === 'Publié' ? '#00BFA5' : '#CC8800' }}>{c.status}</span>
            <button onClick={() => router.push('/formateur/cours')} style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '9px', padding: '8px 18px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 3px 12px rgba(232,101,26,0.25)' }}>Gérer →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
