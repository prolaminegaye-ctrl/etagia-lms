'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type OnbStep = 'auth' | 'role' | 'source' | 'goal' | 'guide'

const ROLES = [
  { id: 'formateur',   label: 'Formateur',   icon: '🎓', desc: 'Je crée et anime des formations' },
  { id: 'apprenant',  label: 'Apprenant',   icon: '📚', desc: 'Je viens me former et apprendre' },
  { id: 'consultant', label: 'Consultant',  icon: '💼', desc: "J'accompagne des organisations" },
  { id: 'manager',    label: 'Manager RH',  icon: '🏢', desc: 'Je gère la montée en compétences' },
]

const SOURCES = [
  { id: 'linkedin',  label: 'LinkedIn',         icon: '🔗' },
  { id: 'bouche',    label: 'Bouche à oreille', icon: '🗣️' },
  { id: 'google',    label: 'Recherche Google', icon: '🔍' },
  { id: 'reseaux',   label: 'Réseaux sociaux',  icon: '📱' },
  { id: 'evenement', label: 'Événement / Conf.',icon: '📅' },
  { id: 'autre',     label: 'Autre',            icon: '✨' },
]

const GOALS = [
  { id: 'creer',     label: 'Créer mes formations',       icon: '🛠️' },
  { id: 'apprendre', label: 'Me former / apprendre',      icon: '🌱' },
  { id: 'equipe',    label: 'Former mon équipe',          icon: '👥' },
  { id: 'certifier', label: 'Obtenir des certifications', icon: '🏅' },
]

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState<OnbStep>('auth')
  const [role, setRole] = useState('')
  const [source, setSource] = useState('')
  const [goal, setGoal] = useState('')
  const [animating, setAnimating] = useState(false)

  const goTo = (next: OnbStep) => {
    setAnimating(true)
    setTimeout(() => { setStep(next); setAnimating(false) }, 280)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      setLoading(true)
      await new Promise(r => setTimeout(r, 700))
      router.push('/dashboard')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    setLoading(false)
    goTo('role')
  }

  const handleRoleNext = () => { if (!role) return; goTo('source') }
  const handleSourceNext = () => { if (!source) return; goTo('goal') }
  const handleGoalNext = () => {
    if (!goal) return
    if (typeof window !== 'undefined') {
      localStorage.setItem('etagia_user_profile', JSON.stringify({ role, source, goal, onboardedAt: Date.now() }))
    }
    goTo('guide')
  }
  const handleGuideFinish = () => {
    router.push(role === 'formateur' ? '/formateur' : '/dashboard')
  }

  const progress = { auth: 0, role: 1, source: 2, goal: 3, guide: 4 }[step]
  const totalSteps = 3

  const cardStyle = (selected: boolean): React.CSSProperties => ({
    background: selected ? 'rgba(74,127,245,0.12)' : 'var(--bg-secondary)',
    border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: '14px',
    padding: '1rem 1.2rem',
    cursor: 'pointer',
    transition: 'all .18s',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  })

  const wrapStyle: React.CSSProperties = {
    opacity: animating ? 0 : 1,
    transform: animating ? 'translateY(10px)' : 'translateY(0)',
    transition: 'opacity .28s ease, transform .28s ease',
  }

  /* GUIDE STEP */
  if (step === 'guide') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: '800', color: '#fff' }}>E</div>
            <span style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>ETAGIA</span>
          </div>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>🎉 Bienvenue ! Voici ton guide de démarrage</span>
          <button onClick={handleGuideFinish} style={{ background: 'var(--accent)', border: 'none', borderRadius: '10px', padding: '9px 22px', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
            Accéder à la plateforme →
          </button>
        </div>
        <iframe src="/guide.html" style={{ flex: 1, border: 'none', width: '100%', minHeight: 'calc(100vh - 70px)' }} title="Guide utilisateur ETAGIA" />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(74,127,245,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(32,212,168,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: step === 'auth' ? '420px' : '520px', position: 'relative', zIndex: 1, ...wrapStyle }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#fff' }}>E</div>
            <span style={{ fontSize: '26px', fontWeight: '700', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>ETAGIA</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {step === 'auth'   ? (mode === 'login' ? 'Bon retour 👋' : 'Rejoins la plateforme') :
             step === 'role'   ? 'Qui êtes-vous ?' :
             step === 'source' ? 'Comment nous avez-vous connu ?' :
             step === 'goal'   ? 'Quel est votre objectif principal ?' : ''}
          </p>
        </div>

        {step !== 'auth' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Étape {progress} sur {totalSteps}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{Math.round((progress / totalSteps) * 100)}%</span>
            </div>
            <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(progress / totalSteps) * 100}%`, background: 'linear-gradient(90deg, var(--accent), var(--teal))', borderRadius: '99px', transition: 'width .4s ease' }} />
            </div>
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem' }}>

          {step === 'auth' && (
            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Nom complet</label>
                  <input type="text" placeholder="Prénom Nom" style={inputStyle} />
                </div>
              )}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="toi@exemple.com" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Mot de passe</label>
                <input type="password" placeholder="••••••••" style={inputStyle} />
              </div>
              <button type="submit" disabled={loading} style={btnPrimary(loading)}>
                {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>
              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
                  <span style={{ color: 'var(--accent)', fontWeight: '500' }}>{mode === 'login' ? "S'inscrire" : 'Se connecter'}</span>
                </button>
              </div>
            </form>
          )}

          {step === 'role' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>Cette information nous aide à personnaliser votre expérience sur la plateforme.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                {ROLES.map(r => (
                  <div key={r.id} onClick={() => setRole(r.id)} style={cardStyle(role === r.id)}>
                    <span style={{ fontSize: '24px' }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{r.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleRoleNext} disabled={!role} style={btnPrimary(!role)}>Continuer →</button>
            </div>
          )}

          {step === 'source' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>Aidez-nous à comprendre comment vous nous avez découvert.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                {SOURCES.map(s => (
                  <div key={s.id} onClick={() => setSource(s.id)} style={{ ...cardStyle(source === s.id), flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ fontSize: '22px' }}>{s.icon}</span>
                    <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => goTo('role')} style={btnSecondary}>← Retour</button>
                <button onClick={handleSourceNext} disabled={!source} style={{ ...btnPrimary(!source), flex: 1 }}>Continuer →</button>
              </div>
            </div>
          )}

          {step === 'goal' && (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>Votre objectif principal sur ETAGIA ?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                {GOALS.map(g => (
                  <div key={g.id} onClick={() => setGoal(g.id)} style={cardStyle(goal === g.id)}>
                    <span style={{ fontSize: '26px' }}>{g.icon}</span>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{g.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => goTo('source')} style={btnSecondary}>← Retour</button>
                <button onClick={handleGoalNext} disabled={!goal} style={{ ...btnPrimary(!goal), flex: 1 }}>Voir le guide →</button>
              </div>
            </div>
          )}

        </div>

        {step === 'auth' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px' }}>
              Démo — cliquez directement sur &quot;Se connecter&quot;
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
  borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)',
  fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box'
}

const btnPrimary = (disabled: boolean | undefined): React.CSSProperties => ({
  width: '100%', background: disabled ? 'var(--bg-secondary)' : 'var(--accent)',
  border: 'none', borderRadius: '10px', padding: '12px',
  color: disabled ? 'var(--text-muted)' : '#fff',
  fontWeight: '600', fontSize: '15px', cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'var(--font-display)', letterSpacing: '0.2px', transition: 'all .2s'
})

const btnSecondary: React.CSSProperties = {
  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
  borderRadius: '10px', padding: '12px 18px',
  color: 'var(--text-secondary)', fontWeight: '500', fontSize: '14px',
  cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all .2s'
}
