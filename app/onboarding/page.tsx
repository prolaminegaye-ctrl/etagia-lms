'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Step {
  id: number
  question: string
  subtitle: string
  key: string
  type: 'single' | 'multi' | 'text'
  options?: { value: string; label: string; icon: string; desc?: string }[]
  placeholder?: string
}

const STEPS: Step[] = [
  {
    id: 1,
    question: 'Comment avez-vous découvert ETAGIA ?',
    subtitle: 'Aidez-nous à comprendre d\'où vient votre intérêt pour la plateforme.',
    key: 'source',
    type: 'single',
    options: [
      { value: 'reseaux', label: 'Réseaux sociaux',   icon: '📱', desc: 'LinkedIn, Instagram, Facebook…' },
      { value: 'bouche',  label: 'Bouche-à-oreille',  icon: '🗣️', desc: 'Un ami ou collègue m\'en a parlé' },
      { value: 'recherche',label: 'Moteur de recherche',icon: '🔍', desc: 'Google, Bing, etc.' },
      { value: 'evenement',label: 'Événement / Salon', icon: '🎪', desc: 'Conférence, webinar, meetup' },
      { value: 'presse',  label: 'Article de presse',  icon: '📰', desc: 'Blog, média, newsletter' },
      { value: 'partenaire',label: 'Partenaire / École',icon: '🤝', desc: 'Via une institution ou organisation' },
    ],
  },
  {
    id: 2,
    question: 'Qu\'est-ce qui vous attire sur ETAGIA ?',
    subtitle: 'Sélectionnez tout ce qui correspond à vos attentes. Cela nous aidera à personnaliser votre expérience.',
    key: 'interests',
    type: 'multi',
    options: [
      { value: 'formation',   label: 'Formations certifiantes', icon: '🎓', desc: 'Obtenir des diplômes reconnus' },
      { value: 'competences', label: 'Développer mes compétences', icon: '📈', desc: 'Monter en expertise' },
      { value: 'passbac',     label: 'Préparer le BAC',          icon: '📚', desc: 'Révisions et examens blancs' },
      { value: 'creer',       label: 'Créer des formations',     icon: '✏️', desc: 'Partager mon savoir' },
      { value: 'equipe',      label: 'Former mon équipe',        icon: '👥', desc: 'Solutions B2B et entreprise' },
      { value: 'coaching',    label: 'Coaching personnalisé',    icon: '🎯', desc: 'Accompagnement individuel' },
      { value: 'afrique',     label: 'Formations pour l\'Afrique',icon: '🌍', desc: 'Contenus adaptés au contexte africain' },
      { value: 'ia',          label: 'Intelligence Artificielle', icon: '🤖', desc: 'IA appliquée et automatisation' },
    ],
  },
  {
    id: 3,
    question: 'Dans quel secteur évoluez-vous ?',
    subtitle: 'Votre domaine d\'activité nous permet de vous proposer des parcours sur-mesure.',
    key: 'secteur',
    type: 'single',
    options: [
      { value: 'tech',          label: 'Tech & Numérique',    icon: '💻' },
      { value: 'sante',         label: 'Santé & Médical',     icon: '🏥' },
      { value: 'finance',       label: 'Finance & Comptabilité', icon: '📊' },
      { value: 'education',     label: 'Éducation & Formation', icon: '🎓' },
      { value: 'btp',           label: 'BTP & Architecture',  icon: '🏗️' },
      { value: 'agriculture',   label: 'Agriculture & Agroalimentaire', icon: '🌾' },
      { value: 'commerce',      label: 'Commerce & Retail',   icon: '🛒' },
      { value: 'juridique',     label: 'Droit & Juridique',   icon: '⚖️' },
      { value: 'communication', label: 'Communication & Marketing', icon: '📣' },
      { value: 'autre',         label: 'Autre secteur',       icon: '✨' },
    ],
  },
]

export default function OnboardingPage() {
  const router  = useRouter()
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const current = STEPS[step]
  const progress = ((step) / STEPS.length) * 100

  function selectSingle(val: string) {
    setAnswers(prev => ({ ...prev, [current.key]: val }))
  }
  function toggleMulti(val: string) {
    const current_arr = (answers[current.key] as string[] | undefined) || []
    const next = current_arr.includes(val) ? current_arr.filter(v => v !== val) : [...current_arr, val]
    setAnswers(prev => ({ ...prev, [current.key]: next }))
  }
  function isSelected(val: string) {
    const a = answers[current.key]
    if (Array.isArray(a)) return a.includes(val)
    return a === val
  }
  function canNext() {
    const a = answers[current.key]
    if (!a) return false
    if (Array.isArray(a)) return a.length > 0
    return Boolean(a)
  }
  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else finalize()
  }
  async function finalize() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.auth.updateUser({ data: { ...answers, onboarding_done: true } })
        await supabase.from('profiles').update({ ...answers, onboarding_done: true }).eq('id', user.id)
      }
    } catch {}
    setLoading(false)
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  if (done) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg,#0F0C29,#302B63,#24243E)', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
      <div style={{ textAlign:'center', animation:'fadeUp 0.6s ease' }}>
        <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }`}</style>
        <div style={{ fontSize:'72px', marginBottom:'20px' }}>🎉</div>
        <h2 style={{ color:'#fff', fontSize:'28px', fontWeight:'800', marginBottom:'12px' }}>Bienvenue sur ETAGIA !</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'15px' }}>Votre espace personnalisé est prêt. Redirection…</p>
        <div style={{ width:'48px', height:'48px', border:'3px solid rgba(255,255,255,0.15)', borderTopColor:'#A855F7', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'32px auto 0' }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center',
      background:'linear-gradient(135deg,#0F0C29 0%,#302B63 50%,#24243E 100%)',
      fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif', padding:'24px 16px' }}>

      {/* Background orbs */}
      <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'10%', right:'5%', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:'15%', left:'5%', width:'250px', height:'250px', borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,0.1) 0%,transparent 70%)' }} />
      </div>

      {/* Header */}
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'600px', marginBottom:'32px', paddingTop:'8px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'linear-gradient(135deg,#6366F1,#A855F7)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'900', fontSize:'16px' }}>E</div>
            <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'13px', fontWeight:'600' }}>Configuration de votre profil</span>
          </div>
          <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px' }}>{step + 1} / {STEPS.length}</span>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop:'16px', height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'4px', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${((step + 1) / STEPS.length) * 100}%`, background:'linear-gradient(90deg,#6366F1,#A855F7)', borderRadius:'4px', transition:'width 0.5s ease' }} />
        </div>
      </div>

      {/* Card */}
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'600px', background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'24px', padding:'36px 32px', boxShadow:'0 32px 64px rgba(0,0,0,0.4)' }}>
        {/* Step indicator dots */}
        <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginBottom:'28px' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              height:'6px', borderRadius:'6px', transition:'all 0.35s',
              width: i === step ? '28px' : '6px',
              background: i <= step ? 'linear-gradient(90deg,#6366F1,#A855F7)' : 'rgba(255,255,255,0.15)',
            }} />
          ))}
        </div>

        <div style={{ marginBottom:'28px' }}>
          <div style={{ color:'rgba(168,85,247,0.8)', fontSize:'11px', fontWeight:'700', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'10px' }}>
            Étape {step + 1}
          </div>
          <h2 style={{ color:'#fff', fontSize:'22px', fontWeight:'800', margin:'0 0 8px', lineHeight:'1.3', letterSpacing:'-0.3px' }}>
            {current.question}
          </h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', margin:0, lineHeight:'1.6' }}>
            {current.subtitle}
          </p>
        </div>

        {/* Options */}
        <div style={{ display:'grid', gridTemplateColumns: current.options && current.options.length > 4 ? '1fr 1fr' : '1fr 1fr', gap:'10px', marginBottom:'28px' }}>
          {current.options?.map(opt => {
            const sel = isSelected(opt.value)
            return (
              <button key={opt.value}
                onClick={() => current.type === 'multi' ? toggleMulti(opt.value) : selectSingle(opt.value)}
                style={{
                  padding:'16px 14px', borderRadius:'16px', cursor:'pointer', textAlign:'left',
                  border: sel ? '2px solid #A855F7' : '2px solid rgba(255,255,255,0.07)',
                  background: sel ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                  transition:'all 0.2s', position:'relative',
                }}>
                {sel && <div style={{ position:'absolute', top:'8px', right:'10px', width:'18px', height:'18px', borderRadius:'50%', background:'#A855F7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px' }}>✓</div>}
                <div style={{ fontSize:'22px', marginBottom:'6px' }}>{opt.icon}</div>
                <div style={{ color:'#fff', fontWeight:'700', fontSize:'13px', marginBottom:'2px' }}>{opt.label}</div>
                {opt.desc && <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'11px', lineHeight:'1.4' }}>{opt.desc}</div>}
              </button>
            )
          })}
        </div>

        {/* Multi select hint */}
        {current.type === 'multi' && (
          <div style={{ marginBottom:'16px', color:'rgba(168,85,247,0.6)', fontSize:'11px', fontWeight:'600', textAlign:'center' }}>
            ↑ Sélection multiple autorisée — choisissez tout ce qui vous correspond
          </div>
        )}

        {/* Navigation */}
        <div style={{ display:'flex', gap:'12px', justifyContent: step > 0 ? 'space-between' : 'flex-end' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              padding:'12px 24px', borderRadius:'12px', border:'1.5px solid rgba(255,255,255,0.12)',
              background:'transparent', color:'rgba(255,255,255,0.5)', fontWeight:'700', fontSize:'14px', cursor:'pointer',
            }}>
              ← Précédent
            </button>
          )}
          <button onClick={next} disabled={!canNext() || loading}
            style={{
              padding:'12px 28px', borderRadius:'12px', border:'none', cursor: canNext() ? 'pointer' : 'default',
              background: canNext() ? 'linear-gradient(135deg,#6366F1,#A855F7)' : 'rgba(255,255,255,0.07)',
              color: canNext() ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight:'800', fontSize:'14px',
              boxShadow: canNext() ? '0 4px 20px rgba(99,102,241,0.35)' : 'none', transition:'all 0.25s',
              display:'flex', alignItems:'center', gap:'8px',
            }}>
            {loading ? '⏳ Finalisation…' : step === STEPS.length - 1 ? '🚀 Accéder à la plateforme' : 'Continuer →'}
          </button>
        </div>
      </div>

      <p style={{ position:'relative', zIndex:1, color:'rgba(255,255,255,0.2)', fontSize:'11px', marginTop:'24px', textAlign:'center' }}>
        Vous pouvez modifier ces préférences à tout moment dans vos paramètres.
      </p>
    </div>
  )
}
