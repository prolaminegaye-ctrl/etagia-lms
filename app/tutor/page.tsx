'use client'
import { useState, useRef, useEffect } from 'react'

interface Msg { role: 'user'|'assistant'; content: string }

const suggestions = [
  "Explique-moi la régression linéaire simplement",
  "Comment créer une startup en Afrique de l'Ouest ?",
  "Quelle différence entre marketing B2B et B2C ?",
  "Comment optimiser un budget formation CPF ?",
]

export default function TutorPage() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const send = async (text?: string) => {
    const content = text || input
    if (!content.trim() || loading) return
    setInput(''); setError('')
    const clean = msgs.filter(m => m.content.trim())
    const userMsg: Msg = { role: 'user', content }
    setMsgs([...clean, userMsg, { role: 'assistant', content: '' }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...clean, userMsg] })
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Erreur serveur')
        setMsgs(p => p.slice(0, -1))
        setLoading(false); return
      }

      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        for (const ln of dec.decode(value).split('\n').filter(l => l.startsWith('data: '))) {
          const d = ln.slice(6); if (d === '[DONE]') break
          try {
            const delta = JSON.parse(d)?.delta?.text || ''
            if (delta) setMsgs(p => { const u = [...p]; u[u.length-1] = { role:'assistant', content: u[u.length-1].content + delta }; return u })
          } catch {}
        }
      }
    } catch (e: any) {
      setError(e.message); setMsgs(p => p.slice(0, -1))
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg,rgba(123,92,245,0.12),rgba(224,64,160,0.06))', border: '1px solid rgba(123,92,245,0.25)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#F0EEFF' }}>✦ AI Tutor</h1>
            <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(123,92,245,0.25)', color: '#A78BF8', letterSpacing: '0.5px' }}>IA · ETAGIA</span>
          </div>
          <p style={{ color: '#8B7BAE', fontSize: '13px', marginTop: '3px' }}>Propulsé par Claude · Explications adaptées à votre niveau</p>
        </div>
        <a href="/api/check-env" target="_blank" style={{ fontSize: '11px', color: '#4A3D6A', background: 'rgba(123,92,245,0.06)', border: '1px solid rgba(123,92,245,0.12)', borderRadius: '8px', padding: '5px 10px' }}>Diagnostic clé API</a>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: 'rgba(240,90,90,0.1)', border: '1px solid rgba(240,90,90,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '1rem', fontSize: '13px', color: '#F08080' }}>
          ⚠️ {error}
          {error.includes('ANTHROPIC_API_KEY') && (
            <a href="https://vercel.com/lamine-s-projects1/etagia-lms/settings/environment-variables" target="_blank" style={{ display: 'block', marginTop: '6px', color: '#A78BF8', fontWeight: '600' }}>→ Configurer dans Vercel Settings</a>
          )}
        </div>
      )}

      {/* Chat */}
      <div style={{ flex: 1, background: 'linear-gradient(145deg,#1A1530,#130F23)', border: '1px solid rgba(123,92,245,0.12)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {msgs.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem', background: 'linear-gradient(135deg,#7B5CF5,#E040A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#F0EEFF' }}>Bonjour, je suis votre AI Tutor</h3>
              <p style={{ color: '#8B7BAE', fontSize: '14px', marginBottom: '2rem' }}>Posez n&apos;importe quelle question — j&apos;adapte mes réponses à votre niveau.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => send(s)} style={{ background: 'rgba(123,92,245,0.08)', border: '1px solid rgba(123,92,245,0.2)', borderRadius: '20px', padding: '8px 14px', fontSize: '13px', color: '#8B7BAE', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(123,92,245,0.15)'; (e.currentTarget as HTMLElement).style.color = '#A78BF8' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(123,92,245,0.08)'; (e.currentTarget as HTMLElement).style.color = '#8B7BAE' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '1rem' }}>
              {m.role === 'assistant' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7B5CF5,#E040A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff', marginRight: '10px', flexShrink: 0, marginTop: '4px' }}>✦</div>
              )}
              <div style={{
                maxWidth: '75%', padding: '10px 14px',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.role === 'user' ? 'linear-gradient(135deg,#7B5CF5,#E040A0)' : 'rgba(123,92,245,0.08)',
                border: m.role === 'assistant' ? '1px solid rgba(123,92,245,0.15)' : 'none',
                color: '#F0EEFF', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap'
              }}>
                {m.content || (loading && i === msgs.length-1 ? <span style={{ opacity: 0.5 }}>●●●</span> : null)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(123,92,245,0.1)', display: 'flex', gap: '8px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder="Posez votre question..." disabled={loading}
            style={{ flex: 1 }} />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{ background: 'linear-gradient(135deg,#7B5CF5,#E040A0)', border: 'none', borderRadius: '10px', padding: '10px 18px', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: loading || !input.trim() ? 0.6 : 1, boxShadow: '0 4px 12px rgba(123,92,245,0.4)' }}>
            Envoyer
          </button>
        </div>
      </div>

      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <span style={{ fontSize: '11px', color: '#4A3D6A' }}>⚠ Système IA · Réponses générées par intelligence artificielle · Vérifiez les informations importantes</span>
      </div>
    </div>
  )
}
