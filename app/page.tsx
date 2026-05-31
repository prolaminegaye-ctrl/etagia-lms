'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ROLES = [
  { id: 'formateur',  label: 'Formateur',  icon: '🎓', desc: 'Je crée et anime des formations' },
  { id: 'apprenant',  label: 'Apprenant',  icon: '📚', desc: 'Je viens me former et apprendre' },
  { id: 'consultant', label: 'Consultant', icon: '💼', desc: "J'accompagne des organisations" },
  { id: 'manager',    label: 'Manager RH', icon: '🏢', desc: 'Je gère la montée en compétences' },
]

const stats = [
  { value: '12K+', label: 'Apprenants' },
  { value: '200+', label: 'Formations' },
  { value: '95%', label: 'Satisfaction' },
  { value: '15+', label: 'Pays' },
]

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const profile = { email, name: name || email.split('@')[0], role: role || 'apprenant' }
    localStorage.setItem('etagia_user_profile', JSON.stringify(profile))
    setTimeout(() => {
      if (role === 'formateur') router.push('/formateur')
      else if (role === 'admin') router.push('/admin')
      else router.push('/dashboard')
    }, 600)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFB' }}>

      {/* Left — Branding panel */}
      <div style={{
        width: '50%', minHeight: '100vh',
        background: 'linear-gradient(160deg, #0D47A1 0%, #1565C0 55%, #1976D2 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(244,89,31,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(244,89,31,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>🎓</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ETAGIA</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>EdTech · Afrique</div>
            </div>
          </div>

          {/* Hero text */}
          <h1 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Votre avenir<br />
            <span style={{ color: '#FF8A50' }}>commence ici.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: '15px', lineHeight: 1.7, maxWidth: '400px' }}>
            La première plateforme d'apprentissage professionnel conçue pour l'Afrique francophone. Formations certifiantes, live classes et IA pédagogique.
          </p>
        </div>

        {/* Stats */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {stats.map(({ value, label }) => (
              <div key={label} style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.60)' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['🇸🇳 Sénégal', '🇨🇮 Côte d\'Ivoire', '🇨🇲 Cameroun', '🇲🇦 Maroc'].map(c => (
              <span key={c} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.60)', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.10)' }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '14px', padding: '4px', marginBottom: '2rem' }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontSize: '14px', fontWeight: '600', transition: 'all .15s',
                ...(mode === m
                  ? { background: '#fff', color: '#1565C0', boxShadow: '0 2px 8px rgba(15,23,42,0.08)' }
                  : { background: 'transparent', color: '#94A3B8' }),
              }}>
                {m === 'login' ? 'Se connecter' : 'Créer un compte'}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A', marginBottom: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {mode === 'login' ? 'Bon retour 👋' : 'Commencez gratuitement'}
          </h2>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '1.75rem' }}>
            {mode === 'login' ? 'Connectez-vous à votre espace ETAGIA' : 'Rejoignez 12 000+ apprenants africains'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '6px' }}>Nom complet</label>
                <input type="text" placeholder="Lamine Gaye" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '6px' }}>Adresse e-mail</label>
              <input type="email" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div style={{ marginBottom: mode === 'register' ? '1rem' : '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>Mot de passe</label>
                {mode === 'login' && <span style={{ fontSize: '12px', color: '#1565C0', cursor: 'pointer' }}>Mot de passe oublié ?</span>}
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {mode === 'register' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', display: 'block', marginBottom: '8px' }}>Je suis...</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {ROLES.map(({ id, label, icon, desc }) => (
                    <div key={id} onClick={() => setRole(id)} style={{
                      padding: '12px', borderRadius: '12px', cursor: 'pointer',
                      border: `2px solid ${role === id ? '#1565C0' : '#E2E8F0'}`,
                      background: role === id ? '#EFF6FF' : '#fff',
                      transition: 'all .15s',
                    }}>
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>{label}</div>
                      <div style={{ fontSize: '10px', color: '#94A3B8', lineHeight: 1.4 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #1565C0, #1976D2)',
              color: '#fff', fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 20px rgba(21,101,192,0.25)', transition: 'all .2s',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {loading ? '⏳ Connexion...' : mode === 'login' ? 'Se connecter →' : 'Créer mon compte →'}
            </button>
          </form>

          {/* Social proof */}
          <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '14px', background: '#F8FAFB', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {['🇸🇳','🇨🇮','🇨🇲','🇲🇦','🇬🇳'].map(f => <span key={f} style={{ fontSize: '16px' }}>{f}</span>)}
            </div>
            <p style={{ fontSize: '12px', color: '#475569' }}>
              <strong style={{ color: '#0F172A' }}>+12 000 professionnels africains</strong> font déjà confiance à ETAGIA pour développer leurs compétences.
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', marginTop: '1.25rem' }}>
            En vous connectant, vous acceptez nos{' '}
            <span style={{ color: '#1565C0', cursor: 'pointer' }}>Conditions d'utilisation</span>{' '}et notre{' '}
            <span style={{ color: '#1565C0', cursor: 'pointer' }}>Politique de confidentialité</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
