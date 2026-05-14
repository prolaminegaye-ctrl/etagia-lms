'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(74,127,245,0.14) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '10%', width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(32,212,168,0.07) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#fff'
            }}>E</div>
            <span style={{ fontSize: '26px', fontWeight: '700', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>ETAGIA</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {mode === 'login' ? 'Bon retour 👋' : 'Rejoins la plateforme'}
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Nom complet</label>
                <input type="text" placeholder="Prénom Nom" style={inputStyle} />
              </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Email</label>
              <input type="email" placeholder="toi@exemple.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Mot de passe</label>
              <input type="password" placeholder="••••••••" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', background: 'var(--accent)', border: 'none', borderRadius: '10px',
              padding: '12px', color: '#fff', fontWeight: '600', fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)',
              opacity: loading ? 0.8 : 1, letterSpacing: '0.2px', transition: 'all .2s'
            }}>
              {loading ? 'Connexion...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
              <span style={{ color: 'var(--accent)', fontWeight: '500' }}>{mode === 'login' ? "S'inscrire" : 'Se connecter'}</span>
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px' }}>
            Démo — cliquez directement sur &quot;Se connecter&quot;
          </span>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
  borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)',
  fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)'
}
