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
  { id: 'google',    label: 'Google',           icon: '🔍' },
  { id: 'reseaux',   label: 'Réseaux sociaux',  icon: '📱' },
  { id: 'evenement', label: 'Événement',        icon: '📅' },
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
  const [step, setStep]       = useState<OnbStep>('auth')
  const [mode, setMode]       = useState<'login' | 'register'>('login')
  const [role, setRole]       = useState('')
  const [source, setSource]   = useState('')
  const [goal, setGoal]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)

  const totalSteps = 3
  const progress   = step === 'role' ? 1 : step === 'source' ? 2 : step === 'goal' ? 3 : 0

  function handleGuideFinish() {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('etagia_user_profile') : null
    const profile = saved ? JSON.parse(saved) : {}
    if (profile.role === 'formateur') router.push('/formateur')
    else router.push('/dashboard')
  }

  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('etagia_auth', JSON.stringify({ email, name, loggedIn: true }))
    }
    setTimeout(() => {
      setLoading(false)
      if (mode === 'register') setStep('role')
      else {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('etagia_user_profile') : null
        const profile = saved ? JSON.parse(saved) : {}
        if (profile.role === 'formateur') router.push('/formateur')
        else if (profile.role === 'admin') router.push('/admin')
        else router.push('/dashboard')
      }
    }, 900)
  }

  function handleRoleNext() {
    if (!role) return
    if (typeof window !== 'undefined') {
      const prev = JSON.parse(localStorage.getItem('etagia_user_profile') || '{}')
      localStorage.setItem('etagia_user_profile', JSON.stringify({ ...prev, role }))
    }
    setStep('source')
  }

  function handleSourceNext() {
    if (!source) return
    if (typeof window !== 'undefined') {
      const prev = JSON.parse(localStorage.getItem('etagia_user_profile') || '{}')
      localStorage.setItem('etagia_user_profile', JSON.stringify({ ...prev, source }))
    }
    setStep('goal')
  }

  function handleGoalNext() {
    if (!goal) return
    if (typeof window !== 'undefined') {
      const prev = JSON.parse(localStorage.getItem('etagia_user_profile') || '{}')
      localStorage.setItem('etagia_user_profile', JSON.stringify({ ...prev, goal, onboarding_done: true }))
    }
    setStep('guide')
  }

  // ── GUIDE ──────────────────────────────────────────────────────────────────
  if (step === 'guide') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: '800', color: '#fff' }}>E</div>
          <span style={{ fontSize: '20px', fontWeight: '700' }}>ETAGIA</span>
        </div>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>🎉 Bienvenue ! Voici ton guide de démarrage</span>
        <button onClick={handleGuideFinish} style={{ background: 'linear-gradient(135deg,#6366F1,#A855F7)', border: 'none', borderRadius: '10px', padding: '9px 22px', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
          Accéder à la plateforme →
        </button>
      </div>
      <iframe src="/guide.html" style={{ flex: 1, border: 'none', width: '100%', minHeight: 'calc(100vh - 70px)' }} title="Guide ETAGIA" />
    </div>
  )

  // ── MAIN AUTH + ONBOARDING LAYOUT ─────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    }}>
      {/* Animated background orbs */}
      <div style={{ position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '20%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: step === 'auth' ? '460px' : '540px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '10px 20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366F1,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '18px' }}>E</div>
            <div>
              <div style={{ color: '#fff', fontWeight: '800', fontSize: '18px', letterSpacing: '-0.5px' }}>ETAGIA</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', fontWeight: '600', letterSpacing: '2px' }}>ACADÉMIE</div>
            </div>
          </div>
        </div>

        {/* Onboarding progress bar */}
        {step !== 'auth' && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>
                {step === 'role' ? 'Qui êtes-vous ?' : step === 'source' ? 'Comment nous avez-vous trouvés ?' : 'Votre objectif principal'}
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(168,85,247,0.8)', fontWeight: '700' }}>Étape {progress}/3</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(progress / totalSteps) * 100}%`, background: 'linear-gradient(90deg,#6366F1,#A855F7)', borderRadius: '4px', transition: 'width .4s ease' }} />
            </div>
          </div>
        )}

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px',
          overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}>

          {/* ── AUTH STEP ── */}
          {step === 'auth' && (
            <>
              {/* Tab switcher */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '6px', gap: '4px', background: 'rgba(0,0,0,0.3)' }}>
                {(['login','register'] as const).map(m => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    padding: '12px', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '800', fontSize: '14px',
                    background: mode === m ? 'linear-gradient(135deg,#6366F1,#A855F7)' : 'transparent',
                    color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.25s',
                  }}>
                    {m === 'login' ? '🔑 Connexion' : '✨ Inscription'}
                  </button>
                ))}
              </div>

              <div style={{ padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '900', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                    {mode === 'login' ? 'Bon retour ! 👋' : 'Rejoignez l\'académie ✨'}
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>
                    {mode === 'login' ? 'Connectez-vous pour accéder à votre espace' : 'Créez votre compte gratuit en quelques secondes'}
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {mode === 'register' && (
                    <AuthInput label="Nom complet" type="text" value={name} onChange={setName} placeholder="Prénom Nom" icon="👤" />
                  )}
                  <AuthInput label="Adresse email" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" icon="📧" />
                  <AuthInput label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon="🔒" />

                  <button type="submit" disabled={loading} style={{
                    marginTop: '6px', padding: '14px', border: 'none', borderRadius: '14px', cursor: loading ? 'wait' : 'pointer',
                    background: 'linear-gradient(135deg,#6366F1,#A855F7)', color: '#fff', fontWeight: '900', fontSize: '15px',
                    boxShadow: '0 4px 24px rgba(99,102,241,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.2s',
                  }}>
                    {loading
                      ? <><LoadingDot /><LoadingDot delay="0.15s" /><LoadingDot delay="0.3s" /></>
                      : mode === 'login' ? '🔑 Se connecter' : '✨ Créer mon compte'}
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                    {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
                  </span>
                  <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    style={{ background: 'none', border: 'none', color: '#A855F7', fontWeight: '700', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
                    {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '12px', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>
                    Démo — cliquez directement sur &quot;Se connecter&quot;
                  </span>
                </div>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '16px', lineHeight: '1.6', marginBottom: 0 }}>
                  En continuant, vous acceptez nos{' '}
                  <span style={{ color: 'rgba(168,85,247,0.7)', cursor: 'pointer' }}>Conditions d&apos;utilisation</span>
                </p>
              </div>
            </>
          )}

          {/* ── ROLE STEP ── */}
          {step === 'role' && (
            <div style={{ padding: '36px 32px 32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎯</div>
                <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '900', margin: '0 0 6px' }}>Qui êtes-vous ?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>Nous personnaliserons votre expérience en fonction de votre profil</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                {ROLES.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)} style={{
                    padding: '18px 14px', borderRadius: '16px', border: `2px solid ${role === r.id ? '#A855F7' : 'rgba(255,255,255,0.08)'}`,
                    background: role === r.id ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}>
                    <div style={{ fontSize: '26px', marginBottom: '8px' }}>{r.icon}</div>
                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '13px', marginBottom: '3px' }}>{r.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', lineHeight: '1.4' }}>{r.desc}</div>
                  </button>
                ))}
              </div>
              <OnbBtn disabled={!role} onClick={handleRoleNext} label="Continuer →" />
            </div>
          )}

          {/* ── SOURCE STEP ── */}
          {step === 'source' && (
            <div style={{ padding: '36px 32px 32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔍</div>
                <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '900', margin: '0 0 6px' }}>Comment nous avez-vous trouvés ?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>Aidez-nous à mieux comprendre notre communauté</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                {SOURCES.map(s => (
                  <button key={s.id} onClick={() => setSource(s.id)} style={{
                    padding: '14px', borderRadius: '14px', border: `2px solid ${source === s.id ? '#6366F1' : 'rgba(255,255,255,0.08)'}`,
                    background: source === s.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s',
                  }}>
                    <span style={{ fontSize: '20px' }}>{s.icon}</span>
                    <span style={{ color: '#fff', fontWeight: '700', fontSize: '12px' }}>{s.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep('role')} style={{ padding: '12px 20px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>← Retour</button>
                <div style={{ flex: 1 }}><OnbBtn disabled={!source} onClick={handleSourceNext} label="Continuer →" /></div>
              </div>
            </div>
          )}

          {/* ── GOAL STEP ── */}
          {step === 'goal' && (
            <div style={{ padding: '36px 32px 32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🚀</div>
                <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '900', margin: '0 0 6px' }}>Votre objectif principal</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>Nous adapterons votre parcours en conséquence</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => setGoal(g.id)} style={{
                    padding: '16px', borderRadius: '14px', border: `2px solid ${goal === g.id ? '#A855F7' : 'rgba(255,255,255,0.08)'}`,
                    background: goal === g.id ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s', textAlign: 'left',
                  }}>
                    <span style={{ fontSize: '24px' }}>{g.icon}</span>
                    <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>{g.label}</span>
                    {goal === g.id && <span style={{ marginLeft: 'auto', color: '#A855F7', fontWeight: '800' }}>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep('source')} style={{ padding: '12px 20px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>← Retour</button>
                <div style={{ flex: 1 }}><OnbBtn disabled={!goal} onClick={handleGoalNext} label="🚀 Accéder à la plateforme" /></div>
              </div>
            </div>
          )}

        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '20px' }}>
          © 2026 ETAGIA Académie — EdTech · Afrique Francophone
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes blink { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>
    </div>
  )
}

function AuthInput({ label, type, value, onChange, placeholder, icon }: {
  label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string; icon: string
}) {
  return (
    <div>
      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: '700', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>{icon}</span>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{
            width: '100%', padding: '13px 14px 13px 42px', boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', color: '#fff', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#A855F7')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>
    </div>
  )
}

function OnbBtn({ disabled, onClick, label }: { disabled: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '14px', border: 'none', borderRadius: '14px', cursor: disabled ? 'default' : 'pointer',
      background: disabled ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg,#6366F1,#A855F7)',
      color: disabled ? 'rgba(255,255,255,0.3)' : '#fff', fontWeight: '800', fontSize: '15px',
      boxShadow: disabled ? 'none' : '0 4px 20px rgba(99,102,241,0.4)', transition: 'all 0.25s',
    }}>{label}</button>
  )
}

function LoadingDot({ delay = '0s' }: { delay?: string }) {
  return <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', display: 'inline-block', animation: `blink 1s ${delay} infinite` }} />
}
