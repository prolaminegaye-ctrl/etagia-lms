'use client'
import { useRouter } from 'next/navigation'

const card = { background: '#FFFFFF', border: '1px solid rgba(107,78,255,0.10)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(107,78,255,0.05)' } as React.CSSProperties

const kpis = [
  { label: 'Cours en cours', value: '4', color: '#9B7EFF', grad: 'linear-gradient(135deg,#7B5CF5,#E040A0)', delta: '+1 ce mois' },
  { label: 'Progression', value: '68%', color: '#22D4A8', grad: 'linear-gradient(135deg,#22D4A8,#7B5CF5)', delta: '+5% semaine' },
  { label: 'Score moyen', value: '82/100', color: '#F0B429', grad: 'linear-gradient(135deg,#F0B429,#E040A0)', delta: 'Top 15%' },
  { label: 'Heures semaine', value: '12h', color: '#F06292', grad: 'linear-gradient(135deg,#E040A0,#7B5CF5)', delta: 'Obj: 15h' },
]

const courses = [
  { title: 'Data Science avec Python', progress: 72, cat: 'Tech', color: '#9B7EFF', done: 17, total: 24 },
  { title: 'Marketing Digital Afrique', progress: 45, cat: 'Business', color: '#22D4A8', done: 8, total: 18 },
  { title: 'Leadership & Management', progress: 30, cat: 'Soft Skills', color: '#F06292', done: 4, total: 12 },
]

const reco = [
  { title: 'IA Générative pour pros', tag: 'Nouveau', color: '#9B7EFF', emoji: '🤖' },
  { title: 'Comptabilité SME Afrique', tag: 'Populaire', color: '#22D4A8', emoji: '💼' },
  { title: 'Pitch & Fundraising', tag: 'Tendance', color: '#F06292', emoji: '🚀' },
]

export default function DashboardPage() {
  const router = useRouter()
  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: '2rem', padding: '1.75rem', borderRadius: '20px', background: 'linear-gradient(135deg,#EBE7FF 0%,#F9F0FF 100%)', border: '1px solid rgba(107,78,255,0.15)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(107,78,255,0.12),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(214,51,132,0.08),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', background: 'linear-gradient(135deg,#1A1550 0%,#6B4EFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bonjour, Lamine 👋</h1>
            <p style={{ color: '#9B8EC0', fontSize: '14px' }}>Dimanche 17 mai 2026 · 7 jours de streak 🔥</p>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(107,78,255,0.20)', borderRadius: '14px', padding: '12px 18px', textAlign: 'center', boxShadow: '0 2px 12px rgba(107,78,255,0.08)' }}>
            <div style={{ fontSize: '11px', color: '#9B8EC0', marginBottom: '4px' }}>Objectif hebdo</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#6B4EFF', fontFamily: 'Syne,sans-serif' }}>15h/sem</div>
            <div style={{ fontSize: '11px', color: '#00B89C', marginTop: '2px' }}>12h ✓</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.grad }} />
            <div style={{ marginTop: '4px', fontSize: '28px', fontWeight: '800', color: k.color, fontFamily: 'Syne,sans-serif', marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: '#6B5EA8', marginBottom: '4px' }}>{k.label}</div>
            <div style={{ fontSize: '11px', color: '#00B89C', fontWeight: '600' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1A1550' }}>Continuer l&apos;apprentissage</h2>
          {courses.map(c => (
            <div key={c.title} onClick={() => router.push('/cours')} style={{ ...card, padding: '1.1rem 1.25rem', cursor: 'pointer', marginBottom: '0.75rem', transition: 'all .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,78,255,0.30)'; (e.currentTarget as HTMLElement).style.background = '#F4F2FF' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,78,255,0.10)'; (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#1A1550', marginBottom: '3px' }}>{c.title}</div>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px', background: '#EBE7FF', color: '#6B4EFF' }}>{c.cat}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: c.color, fontFamily: 'Syne,sans-serif' }}>{c.progress}%</div>
                  <div style={{ fontSize: '11px', color: '#9B8EC0' }}>{c.done}/{c.total} leçons</div>
                </div>
              </div>
              <div style={{ height: '5px', background: '#EBE7FF', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.progress}%`, background: `linear-gradient(90deg,${c.color},${c.color}88)`, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1A1550' }}>Recommandé pour toi</h2>
          {reco.map(r => (
            <div key={r.title} onClick={() => router.push('/cours')} style={{ ...card, padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem', transition: 'all .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,78,255,0.30)'; (e.currentTarget as HTMLElement).style.background = '#F4F2FF' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,78,255,0.10)'; (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}>
              <span style={{ fontSize: '20px' }}>{r.emoji}</span>
              <span style={{ flex: 1, fontWeight: '500', fontSize: '13px', color: '#1A1550' }}>{r.title}</span>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: r.color + '18', color: r.color }}>{r.tag}</span>
            </div>
          ))}

          <div onClick={() => router.push('/tutor')} style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', marginTop: '1rem', background: 'linear-gradient(135deg,#EBE7FF 0%,#F9F0FF 100%)', border: '1px solid rgba(107,78,255,0.20)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(107,78,255,0.08)', transition: 'all .2s' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✦</div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px', background: 'linear-gradient(135deg,#6B4EFF,#D63384)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Tutor ETAGIA</div>
            <div style={{ fontSize: '12px', color: '#9B8EC0', marginBottom: '14px' }}>Posez vos questions, obtenez des explications personnalisées</div>
            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#6B4EFF,#D63384)', borderRadius: '10px', padding: '8px 20px', color: '#fff', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 20px rgba(107,78,255,0.30)' }}>Ouvrir le Tutor →</div>
          </div>
        </div>
      </div>
    </div>
  )
}
