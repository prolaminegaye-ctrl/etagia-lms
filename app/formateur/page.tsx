'use client'
import { useRouter } from 'next/navigation'

const stats = [
  { label: 'Cours publiés', value: '3', color: '#5B8DEF', grad: 'linear-gradient(135deg,#5B8DEF,#22D4A8)' },
  { label: 'Apprenants', value: '127', color: '#22D4A8', grad: 'linear-gradient(135deg,#22D4A8,#5B8DEF)' },
  { label: 'Taux complétion', value: '74%', color: '#F0B429', grad: 'linear-gradient(135deg,#F0B429,#F97316)' },
  { label: 'Score moyen', value: '81/100', color: '#8B5CF6', grad: 'linear-gradient(135deg,#8B5CF6,#5B8DEF)' },
]

const actions = [
  { href: '/formateur/ia-cours', icon: '✦', label: "Créer un cours avec l'IA", desc: 'Génère structure + contenu HTML + PDF en 30s', grad: 'linear-gradient(135deg,#5B8DEF,#22D4A8)', badge: 'IA' },
  { href: '/formateur/import', icon: '↑', label: 'Importer SCORM / H5P', desc: 'Upload et conversion automatique', grad: 'linear-gradient(135deg,#8B5CF6,#5B8DEF)', badge: null },
  { href: '/formateur/apprenants', icon: '◎', label: 'Voir les apprenants', desc: 'Progression et résultats détaillés', grad: 'linear-gradient(135deg,#F0B429,#F97316)', badge: null },
]

const mesCours = [
  { title: 'Data Science avec Python', apprenants: 54, completion: 72, status: 'Publié', color: '#5B8DEF' },
  { title: 'Marketing Digital Afrique', apprenants: 43, completion: 58, status: 'Publié', color: '#22D4A8' },
  { title: 'Leadership & Management', apprenants: 30, completion: 45, status: 'Brouillon', color: '#F0B429' },
]

export default function FormateurPage() {
  const router = useRouter()

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', padding: '1.75rem', borderRadius: '20px', background: 'linear-gradient(135deg,rgba(91,141,239,0.12),rgba(34,212,168,0.06))', border: '1px solid rgba(91,141,239,0.25)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px', background: 'linear-gradient(135deg,#F0F4FF,#5B8DEF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Espace Formateur
        </h1>
        <p style={{ color: '#7A90B0', fontSize: '14px' }}>Gérez vos cours, suivez vos apprenants et créez du contenu avec l&apos;IA</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'linear-gradient(145deg,#111827,#0D1425)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.grad, borderRadius: '16px 16px 0 0' }} />
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, fontFamily: 'Syne,sans-serif', marginBottom: '4px', marginTop: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#7A90B0' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#F0F4FF' }}>Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {actions.map(a => (
          <button key={a.href} onClick={() => router.push(a.href)} style={{
            background: 'linear-gradient(145deg,#111827,#0D1425)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '1.5rem',
            textAlign: 'left', cursor: 'pointer', transition: 'all .2s', position: 'relative', overflow: 'hidden'
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(91,141,239,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: a.grad }} />
            <div style={{ fontSize: '32px', marginBottom: '12px', marginTop: '6px' }}>{a.icon}</div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#F0F4FF', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {a.label}
              {a.badge && <span style={{ fontSize: '9px', background: 'rgba(34,212,168,0.2)', color: '#22D4A8', borderRadius: '4px', padding: '2px 6px', fontWeight: '800' }}>{a.badge}</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#7A90B0' }}>{a.desc}</div>
            <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: '700', background: a.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Accéder →</div>
          </button>
        ))}
      </div>

      {/* Courses */}
      <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#F0F4FF' }}>Mes cours</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mesCours.map(c => (
          <div key={c.title} style={{ background: 'linear-gradient(145deg,#111827,#0D1425)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#F0F4FF', marginBottom: '3px' }}>{c.title}</div>
              <div style={{ fontSize: '12px', color: '#7A90B0' }}>{c.apprenants} apprenants · {c.completion}% complétion</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: c.status === 'Publié' ? 'rgba(34,212,168,0.15)' : 'rgba(240,180,41,0.15)', color: c.status === 'Publié' ? '#22D4A8' : '#F0B429' }}>{c.status}</span>
            <button onClick={() => router.push('/formateur/cours')} style={{ background: 'linear-gradient(135deg,#5B8DEF,#22D4A8)', border: 'none', borderRadius: '8px', padding: '7px 16px', color: '#fff', fontSize: '12px', fontWeight: '700' }}>Gérer →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
