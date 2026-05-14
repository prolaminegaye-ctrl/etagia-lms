'use client'
import { useState, useRef, useEffect } from 'react'

interface Message { role: 'user' | 'assistant'; content: string }

const suggestions = [
  "Explique-moi la régression linéaire simplement",
  "Comment créer une startup en Afrique de l'Ouest ?",
  "Quelle différence entre marketing B2B et B2C ?",
  "Qu'est-ce que le machine learning supervisé ?",
]

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text?: string) => {
    const content = text || input
    if (!content.trim() || loading) return
    setInput('')

    // Snapshot propre de l'historique — on exclut tout contenu vide
    const cleanHistory = messages.filter(m => m.content && m.content.trim() !== '')
    const userMsg: Message = { role: 'user', content }
    const historyToSend = [...cleanHistory, userMsg]

    setMessages([...cleanHistory, userMsg, { role: 'assistant', content: '' }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyToSend })
      })
      if (!res.body) throw new Error('No stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            const delta = parsed.delta?.text || ''
            if (delta) {
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: updated[updated.length - 1].content + delta
                }
                return updated
              })
            }
          } catch { /* ignore */ }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: "Désolé, une erreur s'est produite. Vérifiez la clé API Anthropic dans les variables d'environnement Vercel."
        }
        return updated
      })
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700' }}>AI Tutor</h1>
            <span style={{
              fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px',
              background: 'var(--teal-muted)', color: 'var(--teal)', letterSpacing: '0.5px'
            }}>IA · ETAGIA</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            Propulsé par Claude · Explications personnalisées selon votre niveau
          </p>
        </div>
      </div>

      <div style={{
        flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <div style={{ fontSize: '40px', marginBottom: '1rem' }}>✦</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Bonjour, je suis votre AI Tutor</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem' }}>
                Posez n&apos;importe quelle question sur vos cours, j&apos;adapte mes explications à votre niveau.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: '20px', padding: '8px 14px', fontSize: '13px',
                    color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)'
                  }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '1rem'
            }}>
              {m.role === 'assistant' && (
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', color: '#fff', marginRight: '10px', flexShrink: 0, marginTop: '4px'
                }}>✦</div>
              )}
              <div style={{
                maxWidth: '75%', padding: '10px 14px',
                borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap'
              }}>
                {m.content || (loading && i === messages.length - 1
                  ? <span style={{ opacity: 0.5 }}>●●●</span>
                  : null)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Posez votre question..."
            disabled={loading}
            style={{
              flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)',
              fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)'
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              background: 'var(--accent)', border: 'none', borderRadius: '10px',
              padding: '10px 18px', color: '#fff', fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-display)',
              opacity: loading || !input.trim() ? 0.6 : 1, transition: 'all .15s'
            }}>
            Envoyer
          </button>
        </div>
      </div>

      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          ⚠ Système IA · Les réponses sont générées par intelligence artificielle · Vérifiez les informations importantes
        </span>
      </div>
    </div>
  )
}
