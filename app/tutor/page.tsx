'use client'
import { useState, useRef, useEffect } from 'react'

interface Msg { role: 'user'|'assistant'; content: any }

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
  const [doc, setDoc] = useState<{name: string; base64: string; type: string}|null>(null)
  const [docLoading, setDocLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const loadDoc = async (file: File) => {
    setDocLoading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(',')[1]
      setDoc({ name: file.name, base64, type: file.type || 'application/pdf' })
      setDocLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const removeDoc = () => setDoc(null)

  const getTextContent = (msg: Msg): string => {
    if (typeof msg.content === 'string') return msg.content
    if (Array.isArray(msg.content)) {
      return msg.content.find((c: any) => c.type === 'text')?.text || ''
    }
    return ''
  }

  const send = async (text?: string) => {
    const content = text || input
    if (!content.trim() || loading) return
    setInput(''); setError('')

    const cleanHistory = msgs.filter(m => getTextContent(m).trim())

    // Build user message content
    let userContent: any
    if (doc) {
      userContent = [
        {
          type: 'document',
          source: { type: 'base64', media_type: doc.type, data: doc.base64 }
        },
        { type: 'text', text: content }
      ]
    } else {
      userContent = content
    }

    const userMsg: Msg = { role: 'user', content: userContent }
    const displayMsg: Msg = { role: 'user', content: doc ? `📎 ${doc.name}\n\n${content}` : content }

    setMsgs([...cleanHistory, displayMsg, { role: 'assistant', content: '' }])
    setLoading(true)

    // Build messages for API - convert display messages back to text for history
    const apiMessages = [
      ...cleanHistory.map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : getTextContent(m) })),
      userMsg
    ]

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        setError(err.error || 'Erreur serveur')
        setMsgs(p => p.slice(0, -1))
        setLoading(false); return
      }

      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        for (const ln of dec.decode(value).split('\n')) {
          if (!ln.startsWith('data: ')) continue
          const d = ln.slice(6).trim(); if (d === '[DONE]') break
          try {
            const delta = JSON.parse(d)?.delta?.text || ''
            if (delta) setMsgs(p => { const u=[...p]; u[u.length-1]={role:'assistant',content:u[u.length-1].content+delta}; return u })
          } catch {}
        }
      }
      // Clear doc after use
      if (doc) setDoc(null)
    } catch (e: any) {
      setError(e.message); setMsgs(p => p.slice(0, -1))
    }
    setLoading(false)
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 4rem)'}}>
      {/* Header */}
      <div style={{marginBottom:'1rem',padding:'1rem 1.5rem',background:'linear-gradient(135deg,rgba(28,25,23,0.07),rgba(224,64,160,0.06))',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <h1 style={{fontSize:'20px',fontWeight:'800',color:'#1C1917'}}>✦ AI Tutor</h1>
            <span style={{fontSize:'10px',fontWeight:'800',padding:'3px 8px',borderRadius:'6px',background:'rgba(28,25,23,0.10)',color:'#E8651A',letterSpacing:'0.5px'}}>IA · ETAGIA</span>
          </div>
          <p style={{color:'#A8A29E',fontSize:'12px',marginTop:'2px'}}>Propulsé par Claude · Analyse documents PDF · Explications personnalisées</p>
        </div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button onClick={()=>fileRef.current?.click()} disabled={docLoading} style={{background:'rgba(28,25,23,0.06)',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'8px',padding:'7px 14px',color:'#E8651A',fontSize:'12px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
            {docLoading?'⏳ Chargement...':'📎 Joindre un document'}
          </button>
          <input ref={fileRef} type="file" style={{display:'none'}} accept=".pdf,.txt,.md,.docx" onChange={e=>{if(e.target.files?.[0])loadDoc(e.target.files[0])}} />
        </div>
      </div>

      {/* Error */}
      {error&&(
        <div style={{marginBottom:'1rem',background:'rgba(240,90,90,0.08)',border:'1px solid rgba(240,90,90,0.25)',borderRadius:'12px',padding:'12px 16px',fontSize:'13px',color:'#F08080'}}>
          ⚠️ {error}
        </div>
      )}

      {/* Doc attached */}
      {doc&&(
        <div style={{marginBottom:'1rem',background:'rgba(28,25,23,0.05)',border:'1px solid rgba(28,25,23,0.10)',borderRadius:'12px',padding:'10px 14px',display:'flex',alignItems:'center',gap:'10px'}}>
          <span style={{fontSize:'20px'}}>📄</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:'600',fontSize:'13px',color:'#E8651A'}}>{doc.name}</div>
            <div style={{fontSize:'11px',color:'#A8A29E'}}>Document prêt à être analysé · posez votre question ci-dessous</div>
          </div>
          <button onClick={removeDoc} style={{background:'rgba(240,90,90,0.1)',border:'none',borderRadius:'6px',padding:'4px 8px',color:'#F05A5A',fontSize:'12px',cursor:'pointer'}}>✕ Retirer</button>
        </div>
      )}

      {/* Chat */}
      <div style={{flex:1,background:'#FFFFFF',border:'1px solid rgba(28,25,23,0.07)',borderRadius:'16px',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{flex:1,overflowY:'auto',padding:'1.5rem'}}>
          {msgs.length===0&&(
            <div style={{textAlign:'center',marginTop:'3rem'}}>
              <div style={{fontSize:'48px',marginBottom:'1rem'}}>✦</div>
              <h3 style={{fontSize:'18px',fontWeight:'700',marginBottom:'8px',color:'#1C1917'}}>Bonjour, je suis votre AI Tutor</h3>
              <p style={{color:'#A8A29E',fontSize:'14px',marginBottom:'0.5rem'}}>Posez vos questions ou <strong style={{color:'#E8651A'}}>📎 joignez un document PDF</strong> pour l&apos;analyser.</p>
              <p style={{color:'#57534E',fontSize:'12px',marginBottom:'2rem'}}>Cours, supports de formation, articles — j&apos;analyse et explique tout.</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px',justifyContent:'center'}}>
                {suggestions.map(s=>(
                  <button key={s} onClick={()=>send(s)} style={{background:'rgba(28,25,23,0.05)',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'20px',padding:'8px 14px',fontSize:'13px',color:'#A8A29E',cursor:'pointer',fontFamily:'inherit',transition:'all .15s'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(28,25,23,0.08)';(e.currentTarget as HTMLElement).style.color='#E8651A'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(28,25,23,0.05)';(e.currentTarget as HTMLElement).style.color='#A8A29E'}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',marginBottom:'1rem'}}>
              {m.role==='assistant'&&(
                <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#FF5722,#FFB300)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',color:'#fff',marginRight:'10px',flexShrink:0,marginTop:'4px'}}>✦</div>
              )}
              <div style={{maxWidth:'75%',padding:'10px 14px',borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px',background:m.role==='user'?'linear-gradient(135deg,#FF5722,#FFB300)':'rgba(28,25,23,0.05)',border:m.role==='assistant'?'1px solid rgba(28,25,23,0.08)':'none',color:'#1C1917',fontSize:'14px',lineHeight:'1.6',whiteSpace:'pre-wrap'}}>
                {m.content||(loading&&i===msgs.length-1?<span style={{opacity:0.5}}>●●●</span>:null)}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{padding:'1rem',borderTop:'1px solid rgba(28,25,23,0.06)',display:'flex',gap:'8px',flexDirection:'column'}}>
          {doc&&(
            <div style={{fontSize:'12px',color:'#E8651A',background:'rgba(123,92,245,0.06)',borderRadius:'8px',padding:'6px 10px',display:'flex',alignItems:'center',gap:'6px'}}>
              <span>📎</span><span style={{flex:1}}>{doc.name} sera analysé avec votre question</span>
              <button onClick={removeDoc} style={{background:'none',border:'none',color:'#F05A5A',cursor:'pointer',fontSize:'12px'}}>✕</button>
            </div>
          )}
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={()=>fileRef.current?.click()} style={{background:'rgba(28,25,23,0.05)',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'10px',padding:'10px 12px',color:'#E8651A',fontSize:'18px',cursor:'pointer',flexShrink:0}} title="Joindre un PDF">📎</button>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} placeholder={doc?`Question sur "${doc.name}"...`:"Posez votre question..."} disabled={loading}
              style={{flex:1,background:'rgba(123,92,245,0.06)',color:'#1C1917',border:'1px solid rgba(28,25,23,0.09)',borderRadius:'10px',padding:'10px 14px',fontSize:'14px',fontFamily:'inherit',outline:'none'}} />
            <button onClick={()=>send()} disabled={loading||!input.trim()} style={{background:'linear-gradient(135deg,#FF5722,#FFB300)',border:'none',borderRadius:'10px',padding:'10px 18px',color:'#fff',fontSize:'14px',fontWeight:'700',cursor:'pointer',opacity:loading||!input.trim()?0.6:1,boxShadow:'0 4px 12px rgba(123,92,245,0.4)',flexShrink:0}}>
              Envoyer
            </button>
          </div>
        </div>
      </div>

      <div style={{marginTop:'8px',textAlign:'center'}}>
        <span style={{fontSize:'11px',color:'#57534E'}}>⚠ IA · Réponses générées par Claude · Vérifiez les informations importantes</span>
      </div>
    </div>
  )
}
