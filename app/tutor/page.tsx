'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

type Msg = { role: 'user' | 'ai'; text: string }

const suggestions = [
  'Explique-moi la méthode SONCAS',
  "C'est quoi un indicateur de performance clé ?",
  'Crée un quiz sur la gestion des stocks',
  'Résume le module Techniques de Vente',
]

export default function TutorPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'ai', text: "Bonjour ! Je suis ton tuteur IA ETAGIA 🎓 Je suis là pour t'aider à apprendre, comprendre tes cours et créer du contenu pédagogique. Comment puis-je t'aider aujourd'hui ?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  function send() {
    if (!input.trim()) return
    const q = input.trim()
    setInput('')
    setMsgs(m => [...m, { role: 'user', text: q }])
    setLoading(true)
    setTimeout(() => {
      setMsgs(m => [...m, { role: 'ai', text: `Super question sur "${q}" ! En tant que tuteur IA ETAGIA, je vais t'expliquer ce concept en lien avec le contexte africain francophone. Cette fonctionnalité sera connectée à Claude AI pour des réponses complètes et personnalisées.` }])
      setLoading(false)
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F6F7FB' }}>
      <Sidebar role="apprenant" />
      <main style={{ marginLeft: '248px', flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>

        {/* Header orange gradient */}
        <div style={{
          padding: '1.5rem 2rem',
          background: 'linear-gradient(135deg, #F4591F 0%, #FF8C42 50%, #FFB347 100%)',
          display: 'flex', alignItems: 'center', gap: '1rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>✦</div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.75)', letterSpacing: '2px', textTransform: 'uppercase' }}>Intelligence artificielle</div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.3px' }}>AI Tutor ETAGIA</h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['🧠 Contextuel', '🌍 Afrique', '📚 Pédagogique'].map(t => (
              <span key={t} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '4px 10px', borderRadius: '99px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.3)' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        {msgs.length <= 1 && (
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #D9DBE9', background: '#F6F7FB' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#939BB4', marginBottom: '10px' }}>SUGGESTIONS</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)} style={{ padding: '8px 14px', background: '#fff', border: '2px solid #D9DBE9', borderRadius: '99px', fontSize: '12px', fontWeight: '600', color: '#2E3856', cursor: 'pointer', transition: 'all .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#4255FF'; (e.currentTarget as HTMLButtonElement).style.color = '#4255FF' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#D9DBE9'; (e.currentTarget as HTMLButtonElement).style.color = '#2E3856' }}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '10px', alignItems: 'flex-end' }}>
              {m.role === 'ai' && (
                <div style={{ width: 32, height: 32, borderRadius: '10px', background: 'linear-gradient(135deg, #4255FF, #6B52D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>✦</div>
              )}
              <div style={{
                maxWidth: '70%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? '#4255FF' : '#fff',
                color: m.role === 'user' ? '#fff' : '#2E3856',
                fontSize: '14px', lineHeight: 1.6, fontWeight: '500',
                boxShadow: '0 2px 8px rgba(46,56,86,0.08)',
                border: m.role === 'ai' ? '1px solid #D9DBE9' : 'none',
              }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ width: 32, height: 32, borderRadius: '10px', background: 'linear-gradient(135deg, #4255FF, #6B52D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✦</div>
              <div style={{ padding: '12px 16px', background: '#fff', borderRadius: '18px 18px 18px 4px', border: '1px solid #D9DBE9', display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#4255FF', opacity: 0.4, animation: `pulse 1s ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #D9DBE9', background: '#fff' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Pose ta question à l'AI Tutor..."
              style={{ flex: 1, padding: '13px 18px', borderRadius: '99px', border: '2px solid #D9DBE9', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#2E3856', background: '#F6F7FB' }}
              onFocus={e => e.target.style.borderColor = '#4255FF'}
              onBlur={e => e.target.style.borderColor = '#D9DBE9'}
            />
            <button onClick={send} disabled={!input.trim() || loading} style={{
              width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: input.trim() ? '#4255FF' : '#ECEEF5',
              color: input.trim() ? '#fff' : '#939BB4', fontSize: '18px',
              transition: 'all .15s', flexShrink: 0,
              boxShadow: input.trim() ? '0 4px 16px rgba(66,85,255,0.3)' : 'none',
            }}>→</button>
          </div>
        </div>
      </main>
    </div>
  )
}
