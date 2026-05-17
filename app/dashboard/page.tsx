'use client'
import { useRouter } from 'next/navigation'

const kpis = [
  { label: 'Cours en cours', value: '4', color: '#FF5722', grad: 'linear-gradient(135deg,#FF5722,#FFB300)', delta: '+1 ce mois', icon: '📚' },
  { label: 'Progression', value: '68%', color: '#00BFA5', grad: 'linear-gradient(135deg,#00BFA5,#7C3AED)', delta: '+5% semaine', icon: '📈' },
  { label: 'Score moyen', value: '82/100', color: '#FFB300', grad: 'linear-gradient(135deg,#FFB300,#FF5722)', delta: 'Top 15%', icon: '🏆' },
  { label: 'Heures semaine', value: '12h', color: '#7C3AED', grad: 'linear-gradient(135deg,#7C3AED,#00BFA5)', delta: 'Obj: 15h', icon: '⏱' },
]

const courses = [
  { title: 'Data Science avec Python', progress: 72, cat: 'Tech', color: '#FF5722', done: 17, total: 24 },
  { title: 'Marketing Digital Afrique', progress: 45, cat: 'Business', color: '#00BFA5', done: 8, total: 18 },
  { title: 'Leadership & Management', progress: 30, cat: 'Soft Skills', color: '#FFB300', done: 4, total: 12 },
]

const reco = [
  { title: 'IA Générative pour pros', tag: 'Nouveau', color: '#7C3AED', emoji: '🤖' },
  { title: 'Comptabilité SME Afrique', tag: 'Populaire', color: '#00BFA5', emoji: '💼' },
  { title: 'Pitch & Fundraising', tag: 'Tendance', color: '#FF5722', emoji: '🚀' },
]

export default function DashboardPage() {
  const router = useRouter()
  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: '2rem', padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg,#FF5722 0%,#FFB300 100%)', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(255,87,34,0.30)' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-50px', left: '20%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(0,0,0,0.08)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.75)', marginBottom: '6px', letterSpacing: '0.5px' }}>DIMANCHE 17 MAI 2026</div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px', fontFamily: 'Syne,sans-serif', lineHeight: 1.1 }}>Bonjour, Lamine 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.80)', fontSize: '14px' }}>Vous êtes sur une belle lancée. Continuez !</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '18px', padding: '16px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.70)', marginBottom: '4px', fontWeight: '600' }}>Objectif hebdo</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'Syne,sans-serif' }}>15h/sem</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '4px', fontWeight: '600' }}>✓ 12h cette semaine</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: '#FFFFFF', border: '1.5px solid rgba(28,25,23,0.07)', borderRadius: '18px', padding: '1.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,25,23,0.05)', transition: 'transform .2s,box-shadow .2s' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.grad, borderRadius: '18px 18px 0 0' }} />
            <div style={{ fontSize: '22px', marginBottom: '8px', marginTop: '4px' }}>{k.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: k.color, fontFamily: 'Syne,sans-serif', marginBottom: '3px', lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: '#57534E', marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontSize: '11px', color: '#00BFA5', fontWeight: '700' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Courses */}
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '1rem', color: '#1C1917', fontFamily: 'Syne,sans-serif' }}>Continuer l&apos;apprentissage</h2>
          {courses.map(c => (
            <div key={c.title} onClick={() => router.push('/cours')}
              style={{ background: '#FFFFFF', border: '1.5px solid rgba(28,25,23,0.07)', borderRadius: '16px', padding: '1.1rem 1.25rem', cursor: 'pointer', marginBottom: '0.75rem', transition: 'all .15s', boxShadow: '0 2px 8px rgba(28,25,23,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.color + '55'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${c.color}18` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,25,23,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(28,25,23,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#1C1917', marginBottom: '4px' }}>{c.title}</div>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: c.color + '15', color: c.color }}>{c.cat}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: c.color, fontFamily: 'Syne,sans-serif' }}>{c.progress}%</div>
                  <div style={{ fontSize: '11px', color: '#A8A29E' }}>{c.done}/{c.total} leçons</div>
                </div>
              </div>
              <div style={{ height: '6px', background: '#F5F3F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${c.progress}%`, background: `linear-gradient(90deg,${c.color},${c.color}CC)`, borderRadius: '3px', transition: 'width .5s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '1rem', color: '#1C1917', fontFamily: 'Syne,sans-serif' }}>Recommandé</h2>
          {reco.map(r => (
            <div key={r.title} onClick={() => router.push('/cours')}
              style={{ background: '#FFFFFF', border: '1.5px solid rgba(28,25,23,0.07)', borderRadius: '14px', padding: '13px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.6rem', transition: 'all .15s', boxShadow: '0 1px 6px rgba(28,25,23,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FFF5F2'; (e.currentTarget as HTMLElement).style.borderColor = '#FF572222' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,25,23,0.07)' }}>
              <span style={{ fontSize: '22px' }}>{r.emoji}</span>
              <span style={{ flex: 1, fontWeight: '500', fontSize: '13px', color: '#1C1917' }}>{r.title}</span>
              <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: r.color + '15', color: r.color }}>{r.tag}</span>
            </div>
          ))}

          {/* AI Tutor CTA */}
          <div onClick={() => router.push('/tutor')}
            style={{ marginTop: '1rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: 'linear-gradient(135deg,#12100E 0%,#1C1714 100%)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all .2s', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✦</div>
            <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '6px', background: 'linear-gradient(135deg,#FF5722,#FFB300)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Syne,sans-serif' }}>AI Tutor ETAGIA</div>
            <div style={{ fontSize: '12px', color: 'rgba(245,240,232,0.55)', marginBottom: '16px', lineHeight: 1.5 }}>Posez vos questions, obtenez des explications personnalisées en temps réel</div>
            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#FF5722,#FFB300)', borderRadius: '10px', padding: '9px 22px', color: '#fff', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 16px rgba(255,87,34,0.35)' }}>Ouvrir le Tutor →</div>
          </div>
        </div>
      </div>
    </div>
  )
}
