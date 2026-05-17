'use client'
import { useRouter } from 'next/navigation'

const stats = [
  { label: 'Cours publiés', value: '3', color: '#6B4EFF', grad: 'linear-gradient(135deg,#6B4EFF,#8B70FF)' },
  { label: 'Apprenants', value: '127', color: '#00B89C', grad: 'linear-gradient(135deg,#00B89C,#6B4EFF)' },
  { label: 'Taux complétion', value: '74%', color: '#E6A817', grad: 'linear-gradient(135deg,#E6A817,#D63384)' },
  { label: 'Score moyen', value: '81/100', color: '#D63384', grad: 'linear-gradient(135deg,#D63384,#6B4EFF)' },
]

const actions = [
  { href: '/formateur/creer', icon: '✦', label: "Créer un cours avec l'IA", desc: 'Génère structure + contenu HTML + PDF en 30s', color: '#6B4EFF', badge: 'IA' },
  { href: '/formateur/import', icon: '↑', label: 'Importer SCORM / H5P', desc: 'Upload et conversion automatique', color: '#00B89C', badge: null },
  { href: '/formateur/apprenants', icon: '◎', label: 'Voir les apprenants', desc: 'Progression et résultats détaillés', color: '#E6A817', badge: null },
]

const mesCours = [
  { title: 'Data Science avec Python', apprenants: 54, completion: 72, status: 'Publié', color: '#6B4EFF' },
  { title: 'Marketing Digital Afrique', apprenants: 43, completion: 58, status: 'Publié', color: '#00B89C' },
  { title: 'Leadership & Management', apprenants: 30, completion: 45, status: 'Brouillon', color: '#E6A817' },
]

export default function FormateurPage() {
  const router = useRouter()

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', padding: '1.75rem', borderRadius: '20px', background: 'linear-gradient(135deg,#EBE7FF 0%,#F9F0FF 100%)', border: '1px solid rgba(107,78,255,0.15)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px', background: 'linear-gradient(135deg,#1A1550 0%,#6B4EFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Espace Formateur
        </h1>
        <p style={{ color: '#9B8EC0', fontSize: '14px' }}>Gérez vos cours, suivez vos apprenants et créez du contenu avec l&apos;IA</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid rgba(107,78,255,0.10)', borderRadius: '16px', padding: '1.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,78,255,0.06)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.grad }} />
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, fontFamily: 'Syne,sans-serif', marginBottom: '4px', marginTop: '8px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#6B5EA8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1A1550' }}>Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {actions.map(a => (
          <button key={a.href} onClick={() => router.push(a.href)} style={{
            background: '#FFFFFF', border: '1px solid rgba(107,78,255,0.10)',
            borderRadius: '18px', padding: '1.5rem', textAlign: 'left',
            cursor: 'pointer', transition: 'all .2s', position: 'relative',
            overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,78,255,0.06)'
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,78,255,0.30)'; (e.currentTarget as HTMLElement).style.background = '#F4F2FF'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,78,255,0.10)'; (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(135deg,${a.color},${a.color}88)` }} />
            <div style={{ fontSize: '28px', marginBottom: '12px', marginTop: '6px', color: a.color }}>{a.icon}</div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1A1550', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {a.label}
              {a.badge && <span style={{ fontSize: '9px', background: 'rgba(107,78,255,0.12)', color: '#6B4EFF', borderRadius: '4px', padding: '2px 6px', fontWeight: '800' }}>{a.badge}</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#9B8EC0' }}>{a.desc}</div>
            <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: '700', color: a.color }}>Accéder →</div>
          </button>
        ))}
      </div>

      {/* Courses */}
      <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1A1550' }}>Mes cours</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mesCours.map(c => (
          <div key={c.title} style={{ background: '#FFFFFF', border: '1px solid rgba(107,78,255,0.10)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(107,78,255,0.05)' }}>
            <div style={{ width: '4px', height: '40px', borderRadius: '2px', background: c.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#1A1550', marginBottom: '3px' }}>{c.title}</div>
              <div style={{ fontSize: '12px', color: '#9B8EC0' }}>{c.apprenants} apprenants · {c.completion}% complétion</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', background: c.status === 'Publié' ? 'rgba(0,184,156,0.12)' : 'rgba(230,168,23,0.12)', color: c.status === 'Publié' ? '#00B89C' : '#C48A00' }}>{c.status}</span>
            <button onClick={() => router.push('/formateur/cours')} style={{ background: 'linear-gradient(135deg,#6B4EFF,#D63384)', border: 'none', borderRadius: '8px', padding: '7px 16px', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Gérer →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
