'use client'
import { useState, useRef, useEffect } from 'react'

interface Message { role: 'user' | 'assistant'; content: string; mentionedIds?: string[] }
interface Product { id: string; title: string; cover: string; price: number; type: string }

const SUGGESTIONS = [
  '🎯 Quels cours pour débuter en management ?',
  '📊 Meilleure ressource pour apprendre Excel ?',
  '💡 Que recommandes-tu pour un formateur ?',
  '🔍 Comparer les cours en marketing',
  '💰 Produits moins de 10 000 FCFA ?',
]

const fmt = (c: number) => `${(c/100).toLocaleString('fr')} FCFA`

export default function MarketChatbot({ products, userProfile, onProductClick }: {
  products: Product[]
  userProfile?: any
  onProductClick?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: '👋 Bonjour ! Je suis **Eya**, votre assistante marketplace ETAGIA.\n\nJe peux vous aider à trouver les ressources parfaites pour votre développement — livres, cours, logiciels et plus encore. Dites-moi ce dont vous avez besoin !'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSugg, setShowSugg] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setShowSugg(false)
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/market-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8),
          products,
          userProfile
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Désolé, erreur de communication.', mentionedIds: data.mentionedIds || [] }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erreur de connexion. Réessayez dans un instant.' }])
    } finally { setLoading(false) }
  }

  const renderMsg = (content: string) => {
    return content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/\[([a-z]\d+)\]/g, '')
  }

  const getMentioned = (ids?: string[]) => {
    if (!ids?.length) return []
    return ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[]
  }

  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 500,
        width: '58px', height: '58px', borderRadius: '50%',
        background: open ? 'var(--bg-secondary)' : 'linear-gradient(135deg, #E8651A 0%, #4A7FF5 100%)',
        border: '2px solid var(--border)', cursor: 'pointer',
        fontSize: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        transition: 'all .25s', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {open ? '✕' : '🤖'}
      </button>

      {/* Unread dot */}
      {!open && messages.length > 1 && (
        <div style={{ position:'fixed', bottom:'3.7rem', right:'1.7rem', zIndex:501, width:'14px', height:'14px', borderRadius:'50%', background:'#EF4444', border:'2px solid var(--bg-primary)' }} />
      )}

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '6rem', right: '2rem', zIndex: 500,
          width: '380px', maxHeight: '540px', display: 'flex', flexDirection: 'column',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '20px', boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          overflow: 'hidden', animation: 'chatOpen .25s ease',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, rgba(232,101,26,0.08), rgba(74,127,245,0.08))', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8651A,#4A7FF5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px', fontFamily: 'var(--font-display)' }}>Eya — Assistante ETAGIA</div>
              <div style={{ fontSize: '11px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                En ligne · Répond en quelques secondes
              </div>
            </div>
            <button onClick={() => setMessages([messages[0]]) } title="Effacer" style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'14px' }}>🗑️</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => {
              const mentioned = getMentioned(m.mentionedIds)
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '6px' }}>
                  <div style={{
                    maxWidth: '88%', padding: '10px 13px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                    border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                    fontSize: '13px', lineHeight: 1.5, color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                  }} dangerouslySetInnerHTML={{ __html: renderMsg(m.content) }} />
                  {/* Product chips */}
                  {mentioned.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '88%' }}>
                      {mentioned.map(p => (
                        <button key={p.id} onClick={() => onProductClick?.(p.id)} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          background: 'rgba(74,127,245,0.08)', border: '1px solid rgba(74,127,245,0.25)',
                          borderRadius: '10px', padding: '8px 10px', cursor: 'pointer', textAlign: 'left',
                          transition: 'all .15s', width: '100%',
                        }}>
                          <span style={{ fontSize: '18px' }}>{p.cover}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{p.title}</div>
                            <div style={{ fontSize: '11px', color: '#4A7FF5' }}>{fmt(p.price)} — Voir le produit →</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <div style={{ padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: `bounce .8s ${i*0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {showSugg && messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Suggestions :</div>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s.replace(/^[\S\s]{2}\s/, ''))} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'all .15s' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
              placeholder="Posez votre question..."
              disabled={loading}
              style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-body)' }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ background: input.trim() && !loading ? 'var(--accent)' : 'var(--bg-secondary)', border: 'none', borderRadius: '10px', width: '38px', height: '38px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatOpen { from { opacity:0; transform:scale(.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0) } 40% { transform:translateY(-6px) } }
      `}</style>
    </>
  )
}
