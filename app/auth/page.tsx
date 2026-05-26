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
  { value: 'apprenant', label: 'Apprenant',   icon: '🎓', desc: 'Je veux me former' },
  { value: 'formateur', label: 'Formateur',   icon: '🧑‍🏫', desc: 'Je crée des contenus' },
  { value: 'consultant',label: 'Consultant',  icon: '💼', desc: 'Accompagnement pro' },
  { value: 'autre',     label: 'Autre',       icon: '✨', desc: 'Découvrir ETAGIA' },
]

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab]         = useState<Tab>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  // Register form state
  const [nom, setNom]         = useState('')
  const [prenom, setPrenom]   = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [statut, setStatut]   = useState<Statut>('apprenant')

  // Login form state
  const [loginEmail, setLoginEmail]       = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const { data, error: err } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: { nom, prenom, statut, full_name: `${prenom} ${nom}` }
      }
    })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      await getSupabase().from('profiles').upsert({
        id: data.user.id,
        nom, prenom, statut, email,
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
      else if (role === 'admin')    router.push('/admin')
      else if (role === 'formateur') router.push('/formateur')
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
      fontFamily:'"Plus Jakarta Sans", system-ui, sans-serif', padding:'24px',
    }}>
      {/* Background decoration */}
      <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:'-10%', left:'-10%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }} />
      </div>

      {/* Logo */}
      <div style={{ position:'relative', zIndex:1, marginBottom:'32px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'12px', background:'rgba(255,255,255,0.06)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'12px 24px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'linear-gradient(135deg,#6366F1,#A855F7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', fontWeight:'900', color:'#fff' }}>E</div>
          <div>
            <div style={{ color:'#fff', fontWeight:'800', fontSize:'18px', letterSpacing:'-0.5px' }}>ETAGIA</div>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'11px', fontWeight:'500', letterSpacing:'1.5px' }}>ACADÉMIE</div>
          </div>
        </div>
      </div>

      {/* Card */}
      <div style={{
        position:'relative', zIndex:1, width:'100%', maxWidth:'480px',
        background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.1)', borderRadius:'24px',
        overflow:'hidden', boxShadow:'0 32px 64px rgba(0,0,0,0.4)',
      }}>
        {/* Tabs */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', padding:'6px', gap:'4px', background:'rgba(0,0,0,0.3)' }}>
          {(['login','register'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }}
              style={{
                padding:'12px', border:'none', borderRadius:'14px', cursor:'pointer', fontWeight:'700', fontSize:'14px',
                background: tab === t ? 'linear-gradient(135deg,#6366F1,#A855F7)' : 'transparent',
                color: tab === t ? '#fff' : 'rgba(255,255,255,0.5)',
                transition:'all 0.25s',
              }}>
              {t === 'login' ? '🔑 Connexion' : '✨ Inscription'}
            </button>
          ))}
        </div>

        <div style={{ padding:'32px' }}>
          {/* Heading */}
          <div style={{ marginBottom:'28px', textAlign:'center' }}>
            <h1 style={{ color:'#fff', fontSize:'22px', fontWeight:'800', margin:'0 0 6px', letterSpacing:'-0.5px' }}>
              {tab === 'login' ? 'Bon retour 👋' : 'Rejoignez l\'académie ✨'}
            </h1>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'13px', margin:0 }}>
              {tab === 'login' ? 'Entrez vos identifiants pour accéder à votre espace' : 'Créez votre compte gratuit en quelques secondes'}
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', color:'#FCA5A5', fontSize:'13px', display:'flex', alignItems:'center', gap:'8px' }}>
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', color:'#6EE7B7', fontSize:'13px', display:'flex', alignItems:'center', gap:'8px' }}>
              <span>✅</span> {success}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <InputField label="Adresse email" type="email" value={loginEmail} onChange={setLoginEmail} placeholder="vous@exemple.com" icon="📧" />
              <InputField label="Mot de passe" type="password" value={loginPassword} onChange={setLoginPassword} placeholder="••••••••" icon="🔒" />
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? <Spinner /> : '🔑 Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <InputField label="Prénom" type="text" value={prenom} onChange={setPrenom} placeholder="Prénom" icon="👤" />
                <InputField label="Nom" type="text" value={nom} onChange={setNom} placeholder="Nom" icon="👤" />
              </div>
              <InputField label="Adresse email" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" icon="📧" />
              <InputField label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="8 caractères minimum" icon="🔒" />
              {/* Statut selector */}
              <div>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'12px', fontWeight:'600', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.8px' }}>Votre profil</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                  {STATUTS.map(s => (
                    <button key={s.value} type="button" onClick={() => setStatut(s.value)}
                      style={{
                        padding:'12px 10px', borderRadius:'14px', cursor:'pointer', textAlign:'left',
                        border: statut === s.value ? '2px solid #A855F7' : '2px solid rgba(255,255,255,0.08)',
                        background: statut === s.value ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                        transition:'all 0.2s',
                      }}>
                      <div style={{ fontSize:'20px', marginBottom:'4px' }}>{s.icon}</div>
                      <div style={{ color:'#fff', fontWeight:'700', fontSize:'12px' }}>{s.label}</div>
                      <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px' }}>{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? <Spinner /> : '✨ Créer mon compte'}
              </button>
            </form>
          )}

          <p style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:'11px', marginTop:'20px', lineHeight:'1.6' }}>
            En continuant, vous acceptez nos{' '}
            <span style={{ color:'rgba(168,85,247,0.8)', cursor:'pointer' }}>Conditions d\'utilisation</span>
            {' '}et notre{' '}
            <span style={{ color:'rgba(168,85,247,0.8)', cursor:'pointer' }}>Politique de confidentialité</span>.
          </p>
        </div>
      </div>

      <p style={{ position:'relative', zIndex:1, color:'rgba(255,255,255,0.25)', fontSize:'12px', marginTop:'24px' }}>
        © 2026 ETAGIA Académie — La formation qui vous propulse
      </p>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding:'14px', border:'none', borderRadius:'14px', cursor:'pointer',
  background:'linear-gradient(135deg,#6366F1,#A855F7)',
  color:'#fff', fontWeight:'800', fontSize:'15px',
  boxShadow:'0 4px 20px rgba(99,102,241,0.4)',
  transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'
}

function InputField({ label, type, value, onChange, placeholder, icon }: {
  label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string; icon: string
}) {
  return (
    <div>
      <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px', fontWeight:'600', marginBottom:'7px', letterSpacing:'0.5px' }}>{label}</div>
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'15px', pointerEvents:'none' }}>{icon}</span>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} required
          style={{
            width:'100%', padding:'12px 14px 12px 40px', boxSizing:'border-box',
            background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(255,255,255,0.1)',
            borderRadius:'12px', color:'#fff', fontSize:'14px', outline:'none',
            transition:'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#A855F7'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ width:'18px', height:'18px', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
