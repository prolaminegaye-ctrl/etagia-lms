'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ROLES = [
  { id: 'formateur',  label: 'Formateur',  icon: '🎓', desc: 'Je crée et anime des formations' },
  { id: 'apprenant',  label: 'Apprenant',  icon: '📚', desc: 'Je viens me former et apprendre' },
  { id: 'consultant', label: 'Consultant', icon: '💼', desc: "J'accompagne des organisations" },
  { id: 'manager',    label: 'Manager RH', icon: '🏢', desc: 'Je gère la montée en compétences' },
]

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode]       = useState<'login'|'register'>('login')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [role, setRole]       = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    localStorage.setItem('etagia_user_profile', JSON.stringify({ email, name: name || email.split('@')[0], role: role || 'apprenant' }))
    setTimeout(() => {
      if (role === 'formateur') router.push('/formateur')
      else if (role === 'admin') router.push('/admin')
      else router.push('/dashboard')
    }, 600)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F7FB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, #4255FF, #F4591F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 16px rgba(66,85,255,0.3)' }}>🎓</div>
          <span style={{ fontSize: '26px', fontWeight: '900', color: '#2E3856', letterSpacing: '-0.8px' }}>ETAGIA</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#2E3856', marginBottom: '8px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          Comment souhaitez-vous<br />
          <span style={{ color: '#4255FF' }}>apprendre ?</span>
        </h1>
        <p style={{ color: '#586380', fontSize: '15px', maxWidth: '460px' }}>
          Maîtrisez de nouvelles compétences grâce aux formations adaptées, aux classes live et à l'IA pédagogique d'ETAGIA.
        </p>
      </div>

      {/* Auth card */}
      <div style={{ width: '100%', maxWidth: '460px', background: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 4px 24px rgba(46,56,86,0.10)', border: '1px solid #D9DBE9' }}>

        {/* Tab */}
        <div style={{ display: 'flex', background: '#F6F7FB', borderRadius: '14px', padding: '4px', marginBottom: '2rem', gap: '4px' }}>
          {(['login','register'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: '700', transition: 'all .15s',
              ...(mode === m
                ? { background: '#4255FF', color: '#fff', boxShadow: '0 2px 8px rgba(66,85,255,0.28)' }
                : { background: 'transparent', color: '#939BB4' }),
            }}>
              {m === 'login' ? 'Se connecter' : 'Créer un compte'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#2E3856', display: 'block', marginBottom: '6px' }}>Nom complet</label>
              <input type="text" placeholder="Lamine Gaye" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#2E3856', display: 'block', marginBottom: '6px' }}>Adresse e-mail</label>
            <input type="email" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div style={{ marginBottom: mode === 'register' ? '1.25rem' : '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#2E3856' }}>Mot de passe</label>
              {mode === 'login' && <span style={{ fontSize: '12px', color: '#4255FF', cursor: 'pointer', fontWeight: '600' }}>Oublié ?</span>}
            </div>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#2E3856', display: 'block', marginBottom: '8px' }}>Je suis...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {ROLES.map(({ id, label, icon, desc }) => (
                  <div key={id} onClick={() => setRole(id)} style={{
                    padding: '12px', borderRadius: '14px', cursor: 'pointer',
                    border: `2px solid ${role === id ? '#4255FF' : '#D9DBE9'}`,
                    background: role === id ? '#E8EAFF' : '#F6F7FB',
                    transition: 'all .15s',
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#2E3856' }}>{label}</div>
                    <div style={{ fontSize: '10px', color: '#939BB4', lineHeight: 1.4, marginTop: '2px' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: var(--radius-full, '99px'),
            background: loading ? '#939BB4' : '#4255FF',
            color: '#fff', fontWeight: '800', fontSize: '15px', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px rgba(66,85,255,0.28)',
            borderRadius: '99px', transition: 'all .2s', letterSpacing: '0.1px',
          }}>
            {loading ? '⏳ Connexion...' : mode === 'login' ? 'S\'inscrire gratuitement →' : 'Créer mon compte →'}
          </button>

          {mode === 'login' && (
            <button type="button" onClick={() => setMode('register')} style={{
              width: '100%', marginTop: '10px', padding: '12px',
              background: 'transparent', color: '#4255FF', fontWeight: '700',
              fontSize: '14px', border: 'none', cursor: 'pointer', borderRadius: '99px',
            }}>
              Je suis enseignant / formateur →
            </button>
          )}
        </form>
      </div>

      {/* Feature cards row — Quizlet style */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', width: '100%', maxWidth: '900px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { bg: '#C9F0F0', label: 'Apprendre', desc: 'Flashcards & quiz interactifs', emoji: '🧠' },
          { bg: '#FFD6FD', label: 'Programmes', desc: 'Parcours certifiants structurés', emoji: '📋' },
          { bg: '#E8EAFF', label: 'Classes Live', desc: 'Sessions synchrones avec BBB', emoji: '🎥' },
          { bg: '#FFBF80', label: 'IA Tuteur', desc: 'Accompagnement personnalisé', emoji: '✦' },
        ].map(({ bg, label, desc, emoji }) => (
          <div key={label} style={{
            flex: '1 1 180px', minWidth: '170px',
            borderRadius: '16px', overflow: 'hidden',
            background: '#fff', border: '1px solid #D9DBE9',
            boxShadow: '0 2px 8px rgba(46,56,86,0.07)',
            cursor: 'pointer', transition: 'transform .15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
          onClick={() => router.push('/dashboard')}
          >
            <div style={{ background: bg, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: '800', fontSize: '14px', color: '#2E3856' }}>{label}</span>
              <span style={{ fontSize: '22px' }}>{emoji}</span>
            </div>
            <div style={{ padding: '0.875rem 1rem' }}>
              <p style={{ fontSize: '12px', color: '#586380' }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '12px', color: '#939BB4', textAlign: 'center' }}>
        +12 000 professionnels africains · 🇸🇳 🇨🇮 🇨🇲 🇲🇦 🇬🇳 · Certifications reconnues
      </p>
    </div>
  )
}
