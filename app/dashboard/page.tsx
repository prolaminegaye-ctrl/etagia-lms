'use client'
import { useRouter } from 'next/navigation'

const kpis = [
  { label: 'Cours en cours', value: '4', color: '#5B8DEF', grad: 'linear-gradient(135deg,#5B8DEF,#22D4A8)', delta: '+1 ce mois' },
  { label: 'Progression', value: '68%', color: '#22D4A8', grad: 'linear-gradient(135deg,#22D4A8,#5B8DEF)', delta: '+5% semaine' },
  { label: 'Score moyen', value: '82/100', color: '#F0B429', grad: 'linear-gradient(135deg,#F0B429,#F97316)', delta: 'Top 15%' },
  { label: 'Heures semaine', value: '12h', color: '#8B5CF6', grad: 'linear-gradient(135deg,#8B5CF6,#5B8DEF)', delta: 'Obj: 15h' },
]

const courses = [
  { title: 'Data Science avec Python', progress: 72, category: 'Tech', color: '#5B8DEF', lessons: 24, completed: 17 },
  { title: 'Marketing Digital Afrique', progress: 45, category: 'Business', color: '#22D4A8', lessons: 18, completed: 8 },
  { title: 'Leadership & Management', progress: 30, category: 'Soft Skills', color: '#F0B429', lessons: 12, completed: 4 },
]

const recommended = [
  { title: 'IA Générative pour pros', tag: 'Nouveau', color: '#5B8DEF', emoji: '🤖' },
  { title: 'Comptabilité SME Afrique', tag: 'Populaire', color: '#22D4A8', emoji: '💼' },
  { title: 'Pitch & Fundraising', tag: 'Tendance', color: '#F0B429', emoji: '🚀' },
]

export default function DashboardPage() {
  const router = useRouter()
  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: '2rem', padding: '1.75rem', borderRadius: '20px', background: 'linear-gradient(135deg,rgba(91,141,239,0.12),rgba(34,212,168,0.06))', border: '1px solid rgba(91,141,239,0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(91,141,239,0.12),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', background: 'linear-gradient(135deg,#F0F4FF 0%,#5B8DEF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bonjour, Lamine 👋</h1>
            <p style={{ color: '#7A90B0', fontSize: '14px' }}>Mercredi 14 mai 2026 · 7 jours de streak 🔥</p>
          </div>
          <div style={{ background: 'rgba(91,141,239,0.1)', border: '1px solid rgba(91,141,239,0.3)', borderRadius: '14px', padding: '12px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#7A90B0', marginBottom: '4px' }}>Objectif hebdo</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#5B8DEF', fontFamily: 'Syne,sans-serif' }}>15h/sem</div>
            <div style={{ fontSize: '11px', color: '#22D4A8', marginTop: '2px' }}>12h ✓</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: 'linear-gradient(145deg,#111827,#0D1425)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.grad }} />
            <div style={{ marginTop: '4px', fontSize: '28px', fontWeight: '800', color: k.color, fontFamily: 'Syne,sans-serif', marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: '#7A90B0', marginBottom: '4px' }}>{k.label}</div>
            <div style={{ fontSize: '11px', color: '#22D4A8', fontWeight: '600' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Courses */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#F0F4FF' }}>Continuer l&apos;apprentissage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.map(c => (
              <div key={c.title} onClick={() => router.push('/cours')} style={{ background: 'linear-gradient(145deg,#111827,#0D1425)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.1rem 1.25rem', cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,141,239,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#F0F4FF', marginBottom: '3px' }}>{c.title}</div>
                    <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#7A90B0' }}>{c.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: c.color, fontFamily: 'Syne,sans-serif' }}>{c.progress}%</div>
                    <div style={{ fontSize: '11px', color: '#3D5070' }}>{c.completed}/{c.lessons} leçons</div>
                  </div>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, background: `linear-gradient(90deg,${c.color},${c.color}88)`, borderRadius: '3px', boxShadow: `0 0 8px ${c.color}50` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#F0F4FF' }}>Recommandé pour toi</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {recommended.map(r => (
              <div key={r.title} onClick={() => router.push('/cours')} style={{ background: 'linear-gradient(145deg,#111827,#0D1425)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all .15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,141,239,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}>
                <span style={{ fontSize: '20px' }}>{r.emoji}</span>
                <span style={{ flex: 1, fontWeight: '500', fontSize: '13px', color: '#F0F4FF' }}>{r.title}</span>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px', background: r.color + '20', color: r.color }}>{r.tag}</span>
              </div>
            ))}
          </div>

          {/* AI Tutor CTA */}
          <div onClick={() => router.push('/tutor')} style={{ background: 'linear-gradient(135deg,rgba(91,141,239,0.12),rgba(34,212,168,0.08))', border: '1px solid rgba(91,141,239,0.25)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,141,239,0.5)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,141,239,0.25)'}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✦</div>
            <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px', background: 'linear-gradient(135deg,#5B8DEF,#22D4A8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Tutor ETAGIA</div>
            <div style={{ fontSize: '12px', color: '#7A90B0', marginBottom: '14px' }}>Posez vos questions, obtenez des explications personnalisées</div>
            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#5B8DEF,#22D4A8)', borderRadius: '10px', padding: '8px 20px', color: '#fff', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 16px rgba(91,141,239,0.35)' }}>Ouvrir le Tutor →</div>
          </div>
        </div>
      </div>
    </div>
  )
}
