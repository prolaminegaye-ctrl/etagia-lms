'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  )
}

type Statut = 'apprenant' | 'formateur' | 'consultant' | 'autre'
type Tab = 'login' | 'register'

const STATUTS: { value: Statut; label: string; icon: string; desc: string }[] = [
  { value: 'apprenant',  label: 'Apprenant',  icon: '🎓', desc: 'Je veux me former' },
  { value: 'formateur',  label: 'Formateur',  icon: '🧑‍🏫', desc: 'Je crée des contenus' },
  { value: 'consultant', label: 'Consultant', icon: '💼', desc: 'Accompagnement pro' },
  { value: 'autre',      label: 'Autre',      icon: '✨', desc: 'Découvrir EtagIA' },
]

const LogoSVG = () => (
  <svg viewBox="0 0 64 64" width="44" height="44" role="img" aria-label="EtagIA">
    <defs>
      <linearGradient id="ls-sig" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0"   stopColor="#F9C75A"/>
        <stop offset=".5"  stopColor="#F0894A"/>
        <stop offset="1"   stopColor="#DD5E3A"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="18" fill="url(#ls-sig)"/>
    <g fill="#fff">
      <rect x="16" y="20" width="7"  height="28" rx="3.5"/>
      <rect x="16" y="20" width="25" height="7"  rx="3.5"/>
      <rect x="16" y="30.5" width="19" height="7" rx="3.5"/>
      <rect x="16" y="41" width="25" height="7"  rx="3.5"/>
    </g>
    <g fill="#fff" stroke="#fff">
      <circle cx="47" cy="16" r="4.2" stroke="none"/>
      <g strokeWidth="2.2" strokeLinecap="round">
        <line x1="47" y1="6"    x2="47" y2="8.4"/>
        <line x1="47" y1="23.6" x2="47" y2="26"/>
        <line x1="37.4" y1="16" x2="39.8" y2="16"/>
        <line x1="54.2" y1="16" x2="56.6" y2="16"/>
        <line x1="40.2" y1="9.2"  x2="41.9" y2="10.9"/>
        <line x1="52.1" y1="21.1" x2="53.8" y2="22.8"/>
        <line x1="53.8" y1="9.2"  x2="52.1" y2="10.9"/>
        <line x1="41.9" y1="21.1" x2="40.2" y2="22.8"/>
      </g>
    </g>
  </svg>
)

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab]         = useState<Tab>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const [nom, setNom]         = useState('')
  const [prenom, setPrenom]   = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [statut, setStatut]   = useState<Statut>('apprenant')

  const [loginEmail, setLoginEmail]       = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const { data, error: err } = await getSupabase().auth.signUp({
      email,
      password,
      options: { data: { nom, prenom, statut, full_name: `${prenom} ${nom}` } }
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      await getSupabase().from('profiles').upsert({
        id: data.user.id, nom, prenom, statut, email,
        created_at: new Date().toISOString()
      })
      setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.')
      setTimeout(() => router.push('/onboarding'), 1800)
    }
    setLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const { data, error: err } = await getSupabase().auth.signInWithPassword({
      email: loginEmail, password: loginPassword
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      const meta = data.user.user_metadata
      const role = meta?.statut || 'apprenant'
      const onb  = meta?.onboarding_done
      if (!onb) router.push('/onboarding')
      else if (role === 'admin')     router.push('/admin')
      else if (role === 'formateur') router.push('/formateur')
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--canvas)', fontFamily: 'var(--sans)', padding: '24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Décors lumineux discrets */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,176,30,.12) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,182,204,.10) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,101,20,.06) 0%, transparent 70%)' }} />
      </div>

      {/* Logo */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', padding: '12px 24px', boxShadow: 'var(--sh-2)' }}>
          <LogoSVG />
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '22px', letterSpacing: '-0.03em', color: 'var(--ink)' }}>EtagIA</div>
            <div style={{ fontFamily: 'var(--sans)', color: 'var(--ink-soft)', fontSize: '10px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>ACADÉMIE</div>
          </div>
        </div>
      </div>

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px',
        background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--sh-3)',
      }}>
        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '6px', gap: '4px', background: 'var(--surface-2)' }}>
          {(['login', 'register'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }}
              style={{
                padding: '12px', border: 'none', borderRadius: '14px', cursor: 'pointer',
                fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '14px',
                background: tab === t ? 'var(--grad-signature)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--ink-soft)',
                transition: 'all 0.25s',
                boxShadow: tab === t ? '0 3px 12px rgba(240,137,74,.35)' : 'none',
              }}>
              {t === 'login' ? '🔑 Connexion' : '✨ Inscription'}
            </button>
          ))}
        </div>

        <div style={{ padding: '32px' }}>
          {/* Heading */}
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--serif)', color: 'var(--ink)', fontSize: '22px', fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              {tab === 'login' ? 'Bon retour 👋' : "Rejoignez l'académie ✨"}
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: '13px', margin: 0 }}>
              {tab === 'login'
                ? 'Entrez vos identifiants pour accéder à votre espace'
                : 'Créez votre compte gratuit en quelques secondes'}
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div style={{ background: 'var(--orange-50)', border: '1px solid var(--orange-100)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: 'var(--orange-700)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'var(--turq-50)', border: '1px solid var(--turq-100)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: 'var(--turq-700)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✅</span> {success}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <InputField label="Adresse email"  type="email"    value={loginEmail}    onChange={setLoginEmail}    placeholder="vous@exemple.com" icon="📧" />
              <InputField label="Mot de passe"   type="password" value={loginPassword} onChange={setLoginPassword} placeholder="••••••••"         icon="🔒" />
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? <Spinner /> : '🔑 Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <InputField label="Prénom" type="text" value={prenom} onChange={setPrenom} placeholder="Prénom" icon="👤" />
                <InputField label="Nom"    type="text" value={nom}    onChange={setNom}    placeholder="Nom"    icon="👤" />
              </div>
              <InputField label="Adresse email" type="email"    value={email}    onChange={setEmail}    placeholder="vous@exemple.com"  icon="📧" />
              <InputField label="Mot de passe"  type="password" value={password} onChange={setPassword} placeholder="8 caractères min." icon="🔒" />
              {/* Statut selector */}
              <div>
                <div style={{ color: 'var(--ink-mut)', fontSize: '12px', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Votre profil</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {STATUTS.map(s => (
                    <button key={s.value} type="button" onClick={() => setStatut(s.value)}
                      style={{
                        padding: '12px 10px', borderRadius: '14px', cursor: 'pointer', textAlign: 'left',
                        border: statut === s.value ? '2px solid var(--gold)' : '2px solid var(--line)',
                        background: statut === s.value ? 'var(--gold-50)' : 'var(--surface-2)',
                        transition: 'all 0.2s',
                      }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
                      <div style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '12px' }}>{s.label}</div>
                      <div style={{ color: 'var(--ink-soft)', fontSize: '11px' }}>{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? <Spinner /> : '✨ Créer mon compte'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: '11px', marginTop: '20px', lineHeight: '1.6' }}>
            En continuant, vous acceptez nos{' '}
            <span style={{ color: 'var(--gold-700)', cursor: 'pointer' }}>Conditions d&apos;utilisation</span>
            {' '}et notre{' '}
            <span style={{ color: 'var(--gold-700)', cursor: 'pointer' }}>Politique de confidentialité</span>.
          </p>
        </div>
      </div>

      <p style={{ position: 'relative', zIndex: 1, color: 'var(--ink-soft)', fontSize: '12px', marginTop: '24px' }}>
        © 2026 EtagIA Académie — La formation qui vous propulse
      </p>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '14px', border: 'none', borderRadius: '14px', cursor: 'pointer',
  background: 'var(--grad-signature)',
  color: '#fff', fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '15px',
  boxShadow: '0 4px 20px rgba(240,137,74,.35)',
  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
}

function InputField({ label, type, value, onChange, placeholder, icon }: {
  label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string; icon: string
}) {
  return (
    <div>
      <div style={{ color: 'var(--ink-mut)', fontSize: '12px', fontWeight: 600, marginBottom: '7px', letterSpacing: '0.03em' }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none' }}>{icon}</span>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} required
          style={{
            width: '100%', padding: '12px 14px 12px 40px', boxSizing: 'border-box' as const,
            background: 'var(--surface-2)', border: '1.5px solid var(--line)',
            borderRadius: '12px', color: 'var(--ink)', fontSize: '14px', outline: 'none',
            fontFamily: 'var(--sans)', transition: 'border-color 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(244,176,30,.15)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--line)'; e.target.style.boxShadow = 'none' }}
        />
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ width: '18px', height: '18px', border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  )
}
