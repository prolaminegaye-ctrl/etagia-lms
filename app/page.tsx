'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  )
}

const OWNER_EMAIL = 'prolaminegaye@gmail.com'

const FEATURES = [
  { icon: '✦', label: 'IA Pédagogique', desc: 'Tuteur personnel adaptatif pour chaque apprenant' },
  { icon: '◉', label: 'Classes Live', desc: 'Sessions synchrones BigBlueButton intégrées' },
  { icon: '◈', label: 'Certifications', desc: 'Parcours certifiants reconnus pan-africains' },
]

const STATS = [
  { value: '+12 000', label: 'professionnels formés' },
  { value: '6', label: 'pays d\'Afrique' },
  { value: '98%', label: 'taux de satisfaction' },
]

const ROLES = [
  { id: 'apprenant',  label: 'Apprenant',   icon: '🎓', desc: 'Je veux apprendre' },
  { id: 'formateur',  label: 'Formateur',   icon: '🧑‍🏫', desc: 'Je crée des formations' },
  { id: 'consultant', label: 'Consultant',  icon: '💼', desc: 'Accompagnement pro' },
  { id: 'manager',    label: 'Manager RH',  icon: '🏢', desc: 'Gestion des talents' },
]

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode]         = useState<'login' | 'register'>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [role, setRole]         = useState('apprenant')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    setMounted(true)

    // ── Auto-login propriétaire ──────────────────────────────────
    const stored = localStorage.getItem('etagia_user_profile')
    if (stored) {
      try {
        const p = JSON.parse(stored)
        if (p.email === OWNER_EMAIL) { router.replace('/admin'); return }
      } catch (_) {}
    }

    // Vérifier session Supabase active
    ;(async () => {
      try {
        const sb = getSupabase()
        const { data } = await sb.auth.getSession()
        if (data.session?.user?.email === OWNER_EMAIL) {
          router.replace('/admin')
          return
        }
        if (data.session?.user) {
          const meta = data.session.user.user_metadata
          const r = meta?.statut || 'apprenant'
          if (r === 'admin' || r === 'formateur') router.replace('/formateur')
          else router.replace('/dashboard')
        }
      } catch (_) {}
    })()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')

    try {
      const sb = getSupabase()

      if (mode === 'login') {
        // ── Propriétaire : bypass direct ──────────────────────────
        if (email === OWNER_EMAIL) {
          localStorage.setItem('etagia_user_profile', JSON.stringify({
            email, name: 'Lamine', role: 'admin',
          }))
          router.replace('/admin')
          return
        }

        const { data, error: err } = await sb.auth.signInWithPassword({ email, password })
        if (err) { setError(err.message); setLoading(false); return }
        if (data.user) {
          const meta = data.user.user_metadata
          const r = meta?.statut || 'apprenant'
          localStorage.setItem('etagia_user_profile', JSON.stringify({
            email, name: meta?.prenom || email.split('@')[0], role: r,
          }))
          if (r === 'admin') router.replace('/admin')
          else if (r === 'formateur') router.replace('/formateur')
          else router.replace('/dashboard')
        }
      } else {
        const [prenom, ...rest] = name.trim().split(' ')
        const nom = rest.join(' ') || ''
        const { data, error: err } = await sb.auth.signUp({
          email, password,
          options: { data: { nom, prenom, statut: role, full_name: name } },
        })
        if (err) { setError(err.message); setLoading(false); return }
        if (data.user) {
          await sb.from('profiles').upsert({
            id: data.user.id, nom, prenom, statut: role, email,
            created_at: new Date().toISOString(),
          })
          router.replace('/onboarding')
        }
      }
    } catch (err: unknown) {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Archivo', system-ui, sans-serif",
      background: '#0F0C07',
    }}>

      {/* ── PANNEAU GAUCHE ─────────────────────────────────────── */}
      <div style={{
        width: '44%',
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1A0E06 0%, #0F0C07 40%, #1A0606 100%)',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid rgba(229,64,42,0.12)',
      }}>
        {/* Orbes décoratifs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,64,42,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', bottom: '10%', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,64,42,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        {/* Grille décorative */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}/>

        {/* Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3.5rem' }}>
            <div style={{
              width: 46, height: 46, borderRadius: '13px',
              background: 'linear-gradient(135deg, #E5402A, #FF6B4A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 4px 20px rgba(229,64,42,0.4)',
            }}>🎓</div>
            <span style={{
              fontSize: '22px', fontWeight: '800', color: '#FBF8EF',
              letterSpacing: '-0.5px',
            }}>ETAGIA</span>
            <span style={{
              fontSize: '11px', fontWeight: '600', color: '#E5402A',
              background: 'rgba(229,64,42,0.12)', padding: '3px 8px',
              borderRadius: '99px', border: '1px solid rgba(229,64,42,0.2)',
              letterSpacing: '0.5px',
            }}>ACADÉMIE</span>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '2.6rem', fontWeight: '700',
              color: '#FBF8EF', lineHeight: 1.15,
              letterSpacing: '-1px', marginBottom: '1rem',
            }}>
              La plateforme<br />
              <span style={{
                background: 'linear-gradient(90deg, #E5402A, #FF8C42)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>EdTech</span> de<br />
              référence en<br />
              Afrique
            </h1>
            <p style={{ color: 'rgba(251,248,239,0.5)', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px' }}>
              Formations adaptées, IA pédagogique et certifications reconnues pour les professionnels africains.
            </p>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '2.5rem' }}>
            {FEATURES.map(({ icon, label, desc }) => (
              <div key={label} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(229,64,42,0.12)',
                  border: '1px solid rgba(229,64,42,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#E5402A', fontSize: '16px',
                }}>{icon}</div>
                <div>
                  <div style={{ color: '#FBF8EF', fontWeight: '700', fontSize: '14px', marginBottom: '2px' }}>{label}</div>
                  <div style={{ color: 'rgba(251,248,239,0.45)', fontSize: '12px', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats + Drapeaux */}
        <div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px', background: 'rgba(229,64,42,0.08)',
            borderRadius: '14px', overflow: 'hidden',
            border: '1px solid rgba(229,64,42,0.12)',
            marginBottom: '1.5rem',
          }}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={{
                background: 'rgba(15,12,7,0.8)',
                padding: '16px 14px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#E5402A', marginBottom: '3px' }}>{value}</div>
                <div style={{ fontSize: '10px', color: 'rgba(251,248,239,0.4)', lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '18px', letterSpacing: '6px', opacity: 0.5, textAlign: 'center' }}>
            🇸🇳 🇨🇮 🇨🇲 🇲🇦 🇬🇳 🇧🇯
          </div>
        </div>
      </div>

      {/* ── PANNEAU DROIT ──────────────────────────────────────── */}
      <div style={{
        flex: 1,
        minHeight: '100vh',
        background: '#F1ECDD',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2.5rem',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Titre */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '2rem', fontWeight: '700',
              color: '#18160F', letterSpacing: '-0.5px',
              marginBottom: '6px', lineHeight: 1.2,
            }}>
              {mode === 'login' ? 'Bon retour 👋' : 'Rejoignez-nous'}
            </h2>
            <p style={{ color: '#6B6557', fontSize: '14px' }}>
              {mode === 'login'
                ? 'Connectez-vous à votre espace ETAGIA'
                : 'Créez votre compte en quelques secondes'}
            </p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', background: 'rgba(24,22,15,0.07)',
            borderRadius: '12px', padding: '4px',
            marginBottom: '1.75rem', gap: '4px',
          }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '10px', borderRadius: '9px',
                border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '700',
                transition: 'all .15s',
                ...(mode === m
                  ? { background: '#E5402A', color: '#FBF8EF', boxShadow: '0 2px 10px rgba(229,64,42,0.3)' }
                  : { background: 'transparent', color: '#968F7D' }),
              }}>
                {m === 'login' ? 'Se connecter' : 'Créer un compte'}
              </button>
            ))}
          </div>

          {/* Erreur */}
          {error && (
            <div style={{
              background: 'rgba(229,64,42,0.08)', border: '1px solid rgba(229,64,42,0.2)',
              borderRadius: '10px', padding: '10px 14px',
              color: '#C5331F', fontSize: '13px', marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {mode === 'register' && (
              <div>
                <label style={labelStyle}>Nom complet</label>
                <input
                  type="text" placeholder="Lamine Gaye"
                  value={name} onChange={e => setName(e.target.value)}
                  style={inputStyle} required
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Adresse e-mail</label>
              <input
                type="email" placeholder="vous@exemple.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={inputStyle} required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={labelStyle}>Mot de passe</label>
                {mode === 'login' && (
                  <span style={{ fontSize: '12px', color: '#E5402A', cursor: 'pointer', fontWeight: '600' }}>
                    Oublié ?
                  </span>
                )}
              </div>
              <input
                type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                style={inputStyle} required
              />
            </div>

            {mode === 'register' && (
              <div>
                <label style={{ ...labelStyle, marginBottom: '10px', display: 'block' }}>Je suis...</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {ROLES.map(({ id, label, icon, desc }) => (
                    <div key={id} onClick={() => setRole(id)} style={{
                      padding: '12px', borderRadius: '12px', cursor: 'pointer',
                      border: `1.5px solid ${role === id ? '#E5402A' : 'rgba(24,22,15,0.12)'}`,
                      background: role === id ? 'rgba(229,64,42,0.06)' : 'rgba(24,22,15,0.03)',
                      transition: 'all .15s',
                    }}>
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#18160F' }}>{label}</div>
                      <div style={{ fontSize: '10px', color: '#968F7D', marginTop: '2px' }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? '#B8B79C' : '#E5402A',
              color: '#FBF8EF', fontWeight: '800',
              fontSize: '15px', border: 'none', borderRadius: '99px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(229,64,42,0.35)',
              transition: 'all .2s', marginTop: '4px',
              letterSpacing: '0.1px',
            }}>
              {loading ? '⏳ Connexion en cours...'
                : mode === 'login' ? 'Se connecter →'
                : 'Créer mon compte →'}
            </button>

            {mode === 'login' && (
              <button type="button" onClick={() => setMode('register')} style={{
                width: '100%', padding: '12px',
                background: 'transparent', border: '1px solid rgba(24,22,15,0.12)',
                color: '#6B6557', fontWeight: '600',
                fontSize: '13px', borderRadius: '99px', cursor: 'pointer',
                transition: 'all .15s',
              }}>
                Pas encore de compte ? S&apos;inscrire gratuitement
              </button>
            )}
          </form>

          {/* Footer */}
          <p style={{
            marginTop: '2rem', fontSize: '11px',
            color: 'rgba(24,22,15,0.3)', textAlign: 'center', lineHeight: 1.6,
          }}>
            En continuant, vous acceptez les conditions d&apos;utilisation<br />et la politique de confidentialité d&apos;ETAGIA.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Styles partagés ─────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: '700',
  color: '#18160F', display: 'block', marginBottom: '6px',
  letterSpacing: '0.2px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  background: '#FBF8EF',
  border: '1px solid rgba(24,22,15,0.15)',
  borderRadius: '10px', fontSize: '14px',
  color: '#18160F', outline: 'none',
  transition: 'border-color .15s',
  fontFamily: "'Archivo', system-ui, sans-serif",
}
