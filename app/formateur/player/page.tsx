'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import JSZip from 'jszip'

// ── Types ────────────────────────────────────────────────────────────────────
type Block = {
  id: string; type: string; title: string; content: string
  url?: string; fileData?: string; fileName?: string
  videoSource?: string; youtubeUrl?: string
}
type Module = { id: string; title: string; objectif: string; duration: string; blocks: Block[] }
type Course  = { id: string; title: string; level: string; category: string; duration: string; data: { info: any; modules: Module[] } }

// ── SCORM shim ───────────────────────────────────────────────────────────────
const SCORM_SHIM = `<script>(function(){var d={};window.API={LMSInitialize:function(){return'true'},LMSFinish:function(){return'true'},LMSGetValue:function(k){return d[k]||''},LMSSetValue:function(k,v){d[k]=v;window.parent.postMessage({type:'scorm',key:k,value:v},'*');return'true'},LMSCommit:function(){return'true'},LMSGetLastError:function(){return'0'},LMSGetErrorString:function(){return''},LMSGetDiagnostic:function(){return''}};window.API_1484_11={Initialize:function(){return'true'},Terminate:function(){return'true'},GetValue:function(k){return d[k]||''},SetValue:function(k,v){d[k]=v;window.parent.postMessage({type:'scorm',key:k,value:v},'*');return'true'},Commit:function(){return'true'},GetLastError:function(){return'0'},GetErrorString:function(){return''},GetDiagnostic:function(){return''}};})();</script>`

function getYTEmbed(url: string): string | null {
  const pl = url.match(/[?&]list=([A-Za-z0-9_-]+)/)?.[1]
  if (pl) return `https://www.youtube-nocookie.com/embed/videoseries?list=${pl}&rel=0&cc_load_policy=1`
  const id = url.match(/(?:v=|/embed/|youtu.be/|/shorts/)([A-Za-z0-9_-]{11})/)?.[1]
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&cc_load_policy=1&modestbranding=1` : null
}

// ── Quiz component ────────────────────────────────────────────────────────────
function QuizBlock({ block, onComplete }: { block: Block; onComplete: (opts?: { points?: number; badge?: { id: string; label: string } }) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [validated, setValidated] = useState(false)
  let q: any = {}
  try { q = JSON.parse(block.content) } catch {}
  const opts: string[] = q.options || q.reponses || []
  const correct: string = q.reponse || (typeof q.bonne === 'number' ? opts[q.bonne] : '') || opts[0] || ''
  const isRight = selected === correct

  return (
    <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid rgba(28,25,23,0.08)', padding: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '24px', flexShrink: 0 }}>❓</span>
        <div style={{ fontSize: '17px', fontWeight: '700', color: '#1C1917', lineHeight: 1.4 }}>{q.question || block.title}</div>
      </div>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '1.25rem' }}>
        {opts.map((opt, i) => {
          let bg = 'rgba(28,25,23,0.04)', border = '1px solid rgba(28,25,23,0.1)', color = '#1C1917'
          if (validated) {
            if (opt === correct) { bg = 'rgba(16,185,129,0.1)'; border = '1.5px solid #10B981'; color = '#059669' }
            else if (opt === selected) { bg = 'rgba(239,68,68,0.08)'; border = '1.5px solid #EF4444'; color = 'var(--orange)' }
          } else if (opt === selected) { bg = 'rgba(232,101,26,0.1)'; border = '1.5px solid #E8651A'; color = '#E8651A' }
          return (
            <div key={i} onClick={() => !validated && setSelected(opt)}
              style={{ padding: '12px 16px', borderRadius: '10px', background: bg, border, color, cursor: validated ? 'default' : 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid currentColor`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>
                {validated && opt === correct ? '✓' : validated && opt === selected && !isRight ? '✕' : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </div>
          )
        })}
      </div>
      {validated && (
        <div style={{ background: isRight ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)', border: `1px solid ${isRight ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '1rem', fontSize: '14px', color: isRight ? '#059669' : 'var(--orange)' }}>
          {isRight ? '🎉 Bonne réponse !' : `❌ Réponse correcte : ${correct}`}
          {q.explication && <div style={{ marginTop: '6px', color: '#57534E', fontSize: '13px' }}>{q.explication}</div>}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        {!validated
          ? <button disabled={!selected} onClick={() => setValidated(true)}
              style={{ background: selected ? 'linear-gradient(135deg,#E8651A,#D4A017)' : 'rgba(28,25,23,0.08)', border: 'none', borderRadius: '9px', padding: '9px 20px', color: selected ? '#fff' : '#A8A29E', fontWeight: '700', fontSize: '13px', cursor: selected ? 'pointer' : 'not-allowed' }}>
              Valider ma réponse
            </button>
          : <button onClick={() => onComplete({ points: isRight ? 10 : 0 })}
              style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '9px', padding: '9px 20px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              Continuer →
            </button>
        }
      </div>
    </div>
  )
}

// ── SCORM/ZIP block ───────────────────────────────────────────────────────────
function ScormBlock({ block }: { block: Block }) {
  const [srcdoc, setSrcdoc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!block.fileData) return
    setLoading(true)
    ;(async () => {
      try {
        const res = await fetch(block.fileData!)
        const arrayBuffer = await res.arrayBuffer()
        const zip = await JSZip.loadAsync(arrayBuffer)
        const names = Object.keys(zip.files).filter(n => !zip.files[n].dir)
        const MIME: Record<string,string> = { html:'text/html',htm:'text/html',css:'text/css',js:'application/javascript',json:'application/json',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',svg:'image/svg+xml',webp:'image/webp',mp4:'video/mp4',mp3:'audio/mpeg',woff:'font/woff',woff2:'font/woff2',ttf:'font/ttf',xml:'application/xml' }
        const TEXT = new Set(['html','htm','css','js','json','xml','txt','svg'])
        const map: Record<string,string> = {}
        for (const name of names) {
          const ext = (name.split('.').pop() || '').toLowerCase()
          const mime = MIME[ext] || 'application/octet-stream'
          const content = TEXT.has(ext) ? await zip.files[name].async('string') : await zip.files[name].async('arraybuffer')
          map[name] = URL.createObjectURL(new Blob([content], { type: mime }))
          const base = name.split('/').pop()!
          if (!map[base]) map[base] = map[name]
        }
        const htmlFiles = names.filter(n => /.(html|htm)$/i.test(n))
        const priority = ['index.html','index_lms.html','index_lms_html5.html','story.html','launch.html']
        let launch = priority.map(p => htmlFiles.find(n => n.toLowerCase().endsWith(p))).find(Boolean) || htmlFiles[0]
        const manifestKey = names.find(n => n.toLowerCase().endsWith('imsmanifest.xml'))
        if (manifestKey) {
          const xml = await zip.files[manifestKey].async('string')
          const m = xml.match(/href="([^"]+.html?)"/i)
          if (m) { const found = names.find(n => n.endsWith(m[1]) || n === m[1]); if (found) launch = found }
        }
        if (!launch) { setError('Fichier de lancement introuvable'); setLoading(false); return }
        let html = await zip.files[launch].async('string')
        html = html.replace(/<head([^>]*)>/i, `<head$1>\n${SCORM_SHIM}`)
        for (const [name, url] of Object.entries(map)) {
          const safe = name.replace(/[.*+?^${}()|[]\\]/g, '\\$&')
          const base = name.split('/').pop()!.replace(/[.*+?^${}()|[]\\]/g, '\\$&')
          html = html.replace(new RegExp(`(src|href)=["']${safe}["']`,'gi'), `$1="${url}"`).replace(new RegExp(`(src|href)=["']${base}["']`,'gi'), `$1="${url}"`)
        }
        setSrcdoc(html)
      } catch (e: any) { setError(e.message) }
      setLoading(false)
    })()
  }, [block.fileData])

  if (!block.fileData) return (
    <div style={{ background: 'rgba(232,101,26,0.06)', border: '1.5px dashed rgba(232,101,26,0.3)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
      <div style={{ fontWeight: '700', color: '#1C1917', marginBottom: '4px' }}>{block.title}</div>
      <div style={{ color: '#A8A29E', fontSize: '13px' }}>Fichier SCORM non disponible en prévisualisation</div>
    </div>
  )
  if (loading) return <div style={{ background: '#FAF9F7', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#A8A29E' }}>⏳ Extraction SCORM…</div>
  if (error) return <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: '12px', padding: '1.5rem', color: '#EF4444' }}>⚠️ {error}</div>
  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(28,25,23,0.1)', height: '560px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, background: 'rgba(232,101,26,0.9)', color: '#fff', borderRadius: '6px', padding: '3px 10px', fontSize: '10px', fontWeight: '800' }}>📦 SCORM · API Active</div>
      <iframe srcDoc={srcdoc!} style={{ width: '100%', height: '100%', border: 'none' }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads" title={block.title} />
    </div>
  )
}

// ── Block renderer ────────────────────────────────────────────────────────────
function BlockRenderer({ block, onQuizComplete }: { block: Block; onQuizComplete: (opts?: { points?: number; badge?: { id: string; label: string } }) => void }) {
  const ytEmbed = block.type === 'video' && block.videoSource === 'youtube' && block.youtubeUrl ? getYTEmbed(block.youtubeUrl) : null

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Block label */}
      {block.type !== 'quiz' && block.type !== 'qcm_multi' && (
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1C1917', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{{ text:'📝', video:'🎬', scorm:'📦', h5p:'🎮', html:'💻', pdf:'📄', activity:'🎯' }[block.type] || '📌'}</span>
          {block.title}
        </h3>
      )}

      {/* Text */}
      {block.type === 'text' && block.content && (
        <div style={{ fontSize: '15px', lineHeight: '1.75', color: '#44403C', background: 'var(--surface)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(28,25,23,0.07)', whiteSpace: 'pre-wrap' }}>
          {block.content}
        </div>
      )}

      {/* Activity */}
      {block.type === 'activity' && (() => {
        let a: any = {}; try { a = JSON.parse(block.content) } catch {}
        const minutes = typeof a.contrainte_temps === 'object' && a.contrainte_temps?.minutes > 0 ? a.contrainte_temps.minutes : null
        return (
          <div style={{ background: 'linear-gradient(135deg,rgba(212,160,23,0.08),rgba(232,101,26,0.05))', border: '1.5px solid rgba(212,160,23,0.25)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>🎯</span>
              <div><div style={{ fontWeight: '800', fontSize: '16px', color: '#1C1917', marginBottom: '4px' }}>{a.titre || block.title}</div>
              {a.duree && <span style={{ fontSize: '11px', color: '#D4A017', fontWeight: '700', background: 'rgba(212,160,23,0.1)', padding: '2px 8px', borderRadius: '10px' }}>⏱ {a.duree}</span>}</div>
            </div>
            {a.description && <p style={{ fontSize: '14px', color: '#57534E', lineHeight: 1.6, marginBottom: '10px' }}>{a.description}</p>}
            {a.consigne && (
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(212,160,23,0.2)', marginBottom: minutes ? '14px' : 0 }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#D4A017', marginBottom: '4px', letterSpacing: '.5px' }}>CONSIGNE</div>
                <div style={{ fontSize: '14px', color: '#1C1917', fontStyle: 'italic' }}>{a.consigne}</div>
              </div>
            )}
            {minutes && <TimedChallenge minutes={minutes} onComplete={onQuizComplete} />}
          </div>
        )
      })()}

      {/* Video YouTube */}
      {block.type === 'video' && ytEmbed && (
        <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
          <iframe src={ytEmbed} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={block.title} />
        </div>
      )}
      {block.type === 'video' && block.videoSource === 'file' && (block.fileData || block.url) && (
        <video src={block.fileData || block.url} controls style={{ width: '100%', borderRadius: '12px', background: '#000' }} />
      )}
      {block.type === 'video' && !ytEmbed && !block.fileData && !block.url && (
        <div style={{ background: 'rgba(124,58,237,0.06)', border: '1.5px dashed rgba(124,58,237,0.25)', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#7C3AED' }}>🎬 Aucune source vidéo configurée</div>
      )}

      {/* SCORM */}
      {block.type === 'scorm' && <ScormBlock block={block} />}

      {/* H5P — same as SCORM */}
      {block.type === 'h5p' && <ScormBlock block={block} />}

      {/* HTML */}
      {block.type === 'html' && (block.fileData || block.url) && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(28,25,23,0.1)', height: '480px' }}>
          <iframe src={block.fileData || block.url} style={{ width: '100%', height: '100%', border: 'none' }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups" title={block.title} />
        </div>
      )}

      {/* PDF */}
      {block.type === 'pdf' && (block.fileData || block.url) && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(28,25,23,0.1)', height: '560px' }}>
          <iframe src={block.fileData || block.url} style={{ width: '100%', height: '100%', border: 'none' }} title={block.title} />
        </div>
      )}

      {/* Quiz */}
      {block.type === 'quiz' && <QuizBlock block={block} onComplete={onQuizComplete} />}

      {/* QCM multi-questions */}
      {block.type === 'qcm_multi' && <QcmMultiBlock block={block} onComplete={onQuizComplete} />}
    </div>
  )
}

// ── Compte à rebours pour défis chronométrés ─────────────────────────────────
function Countdown({ minutes, onExpire }: { minutes: number; onExpire?: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running || secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft(s => {
      if (s <= 1) { onExpire?.(); return 0 }
      return s - 1
    }), 1000)
    return () => clearTimeout(t)
  }, [running, secondsLeft, onExpire])

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const pct = secondsLeft / (minutes * 60)
  const urgent = pct < 0.2 && secondsLeft > 0
  const expired = secondsLeft <= 0
  const color = expired ? '#EF4444' : urgent ? '#F59E0B' : '#06B6D4'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: `${color}0F`, border: `1.5px solid ${color}40`, borderRadius: '12px', padding: '10px 16px', marginBottom: '1rem' }}>
      <div style={{ fontSize: '24px', fontWeight: '900', color, fontVariantNumeric: 'tabular-nums', minWidth: '70px' }}>
        {expired ? '⏰' : `${mm}:${ss}`}
      </div>
      <div style={{ flex: 1, height: '6px', background: `${color}1A`, borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${Math.max(pct, 0) * 100}%`, height: '100%', background: color, transition: 'width 1s linear, background .3s' }} />
      </div>
      {!running && !expired && (
        <button onClick={() => setRunning(true)} style={{ background: `linear-gradient(135deg,${color},${color}CC)`, border: 'none', borderRadius: '8px', padding: '6px 14px', color: '#fff', fontWeight: '700', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
          ▶ Démarrer
        </button>
      )}
      {expired && <span style={{ fontSize: '12px', fontWeight: '700', color, flexShrink: 0 }}>Temps écoulé</span>}
    </div>
  )
}


// ── Défi chronométré : minuteur + bouton de complétion avec bonus ────────────
function TimedChallenge({ minutes, onComplete }: { minutes: number; onComplete: (opts?: { points?: number; badge?: { id: string; label: string } }) => void }) {
  const [expired, setExpired] = useState(false)
  const [done, setDone] = useState(false)

  if (done) return null

  return (
    <div>
      <Countdown minutes={minutes} onExpire={() => setExpired(true)} />
      <button
        onClick={() => {
          setDone(true)
          onComplete(
            expired
              ? { points: 15 }
              : { points: 25, badge: { id: 'contre_la_montre', label: '⚡ Contre la montre' } }
          )
        }}
        style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '9px', padding: '9px 20px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
        ✓ J'ai terminé le défi
      </button>
    </div>
  )
}


function QcmMultiBlock({ block, onComplete }: { block: Block; onComplete: (opts?: { points?: number; badge?: { id: string; label: string } }) => void }) {
  let questions: any[] = []
  try { questions = JSON.parse(block.content) } catch {}
  if (!Array.isArray(questions)) questions = []

  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [validated, setValidated] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  if (questions.length === 0) {
    return (
      <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid rgba(28,25,23,0.08)', padding: '1.5rem', textAlign: 'center', color: '#A8A29E' }}>
        🧩 Aucune question configurée pour ce QCM.
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => onComplete()} style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '9px', padding: '9px 20px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Continuer →</button>
        </div>
      </div>
    )
  }

  const q = questions[qi]
  const opts: string[] = q.options || []
  const correct: string = q.reponse || opts[0] || ''
  const isRight = selected === correct
  const isLast = qi === questions.length - 1

  const validate = () => {
    setValidated(true)
    if (isRight) setScore(s => s + 1)
  }

  const next = () => {
    if (isLast) { setFinished(true); return }
    setQi(i => i + 1); setSelected(null); setValidated(false)
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const good = pct >= 70
    return (
      <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid rgba(28,25,23,0.08)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '44px', marginBottom: '0.5rem' }}>{good ? '🎉' : '💪'}</div>
        <div style={{ fontSize: '20px', fontWeight: '900', color: '#1C1917', marginBottom: '4px' }}>{score} / {questions.length} bonnes réponses</div>
        <div style={{ fontSize: '13px', color: good ? '#059669' : '#A8A29E', marginBottom: '1.5rem' }}>
          {good ? 'Excellent — les notions sont acquises.' : 'Encore un peu d\'entraînement sur ce module serait utile.'}
        </div>
        <button onClick={() => onComplete({ points: score * 5, badge: pct === 100 ? { id: 'sans_faute', label: '🧠 Sans faute' } : undefined })} style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '9px', padding: '10px 24px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Continuer →</button>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid rgba(28,25,23,0.08)', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: '#06B6D4', background: 'rgba(6,182,212,0.1)', padding: '3px 9px', borderRadius: '20px' }}>Question {qi + 1} / {questions.length}</span>
        <div style={{ flex: 1, height: '4px', background: 'rgba(28,25,23,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${(qi / questions.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#06B6D4,#22D3EE)', transition: 'width .2s' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '24px', flexShrink: 0 }}>🧩</span>
        <div style={{ fontSize: '17px', fontWeight: '700', color: '#1C1917', lineHeight: 1.4 }}>{q.question}</div>
      </div>
      <div style={{ display: 'grid', gap: '10px', marginBottom: '1.25rem' }}>
        {opts.map((opt, i) => {
          let bg = 'rgba(28,25,23,0.04)', border = '1px solid rgba(28,25,23,0.1)', color = '#1C1917'
          if (validated) {
            if (opt === correct) { bg = 'rgba(16,185,129,0.1)'; border = '1.5px solid #10B981'; color = '#059669' }
            else if (opt === selected) { bg = 'rgba(239,68,68,0.08)'; border = '1.5px solid #EF4444'; color = 'var(--orange)' }
          } else if (opt === selected) { bg = 'rgba(6,182,212,0.1)'; border = '1.5px solid #06B6D4'; color = '#06B6D4' }
          return (
            <div key={i} onClick={() => !validated && setSelected(opt)}
              style={{ padding: '12px 16px', borderRadius: '10px', background: bg, border, color, cursor: validated ? 'default' : 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid currentColor`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>
                {validated && opt === correct ? '✓' : validated && opt === selected && !isRight ? '✕' : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </div>
          )
        })}
      </div>
      {validated && (
        <div style={{ background: isRight ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)', border: `1px solid ${isRight ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '1rem', fontSize: '14px', color: isRight ? '#059669' : 'var(--orange)' }}>
          {isRight ? '🎉 Bonne réponse !' : `❌ Réponse correcte : ${correct}`}
          {q.explication && <div style={{ marginTop: '6px', color: '#57534E', fontSize: '13px' }}>{q.explication}</div>}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        {!validated
          ? <button disabled={!selected} onClick={validate}
              style={{ background: selected ? 'linear-gradient(135deg,#06B6D4,#22D3EE)' : 'rgba(28,25,23,0.08)', border: 'none', borderRadius: '9px', padding: '9px 20px', color: selected ? '#fff' : '#A8A29E', fontWeight: '700', fontSize: '13px', cursor: selected ? 'pointer' : 'not-allowed' }}>
              Valider ma réponse
            </button>
          : <button onClick={next}
              style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '9px', padding: '9px 20px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
              {isLast ? 'Voir mon score →' : 'Question suivante →'}
            </button>
        }
      </div>
    </div>
  )
}


function PlayerInner() {
  const router  = useRouter()
  const params  = useSearchParams()
  const courseId = params.get('id')
  const [course, setCourse] = useState<Course | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [modIdx, setModIdx] = useState(0)
  const [blkIdx, setBlkIdx] = useState(0)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [points, setPoints] = useState(0)
  const [badges, setBadges] = useState<{ id: string; label: string }[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState(false)

  // Plein écran natif (Fullscreen API) : masque les barres du navigateur
  // pour une expérience immersive au lancement d'une formation.
  useEffect(() => {
    const sync = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try { await pageRef.current?.requestFullscreen() } catch {}
    } else {
      try { await document.exitFullscreen() } catch {}
    }
  }


  useEffect(() => {
    try {
      const list: Course[] = JSON.parse(localStorage.getItem('etagia_courses') || '[]')
      const found = courseId ? list.find(c => c.id === courseId) : list[0]
      if (found) setCourse(found)
      else setNotFound(true)
    } catch { setNotFound(true) }
  }, [courseId])

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF9F7' }}>
      <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '3rem', textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '56px', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ fontWeight: '900', color: '#1C1917', marginBottom: '8px' }}>Cours introuvable</h2>
        <p style={{ color: '#A8A29E', marginBottom: '1.5rem' }}>Ce cours n'existe pas ou a été supprimé.</p>
        <button onClick={() => router.push('/formateur/cours')} style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '10px', padding: '10px 24px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>← Mes cours</button>
      </div>
    </div>
  )

  if (!course) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF9F7' }}>
      <div style={{ fontSize: '13px', color: '#A8A29E' }}>Chargement…</div>
    </div>
  )

  if (finished) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF9F7', padding: '2rem' }}>
      <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '3rem', textAlign: 'center', maxWidth: '460px', width: '100%' }}>
        <div style={{ fontSize: '56px', marginBottom: '1rem' }}>🎓</div>
        <h2 style={{ fontWeight: '900', color: '#1C1917', marginBottom: '4px', fontSize: '22px' }}>Cours terminé !</h2>
        <p style={{ color: '#A8A29E', marginBottom: '1.5rem' }}>{course.title}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(232,101,26,0.08)', border: '1px solid rgba(232,101,26,0.2)', borderRadius: '20px', padding: '8px 20px', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '20px' }}>⭐</span>
          <span style={{ fontWeight: '900', fontSize: '18px', color: '#E8651A' }}>{points} points</span>
        </div>
        {badges.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#A8A29E', letterSpacing: '.5px', marginBottom: '10px' }}>BADGES DÉBLOQUÉS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {badges.map(b => (
                <span key={b.id} style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '700', color: '#B8860B' }}>{b.label}</span>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => router.push('/formateur/cours')} style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '10px', padding: '10px 24px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>← Mes cours</button>
      </div>
    </div>
  )

  // Un cours créé ici range ses modules sous `data`. Un cours acheté sur la
  // Marketplace les range à la racine : sans ce repli, il s'ouvrait vide.
  const racine = (course as unknown as { modules?: unknown }).modules
  const modules: Module[] = Array.isArray(course.data?.modules)
    ? course.data.modules
    : Array.isArray(racine)
      ? (racine as Module[])
      : []
  const curMod  = modules[modIdx]
  const blocks  = curMod?.blocks || []
  const curBlk  = blocks[blkIdx]

  // Progress
  const totalBlocks = modules.reduce((a, m) => a + (m.blocks?.length ?? 0), 0)
  const doneCount   = completed.size
  const progress    = totalBlocks > 0 ? Math.round((doneCount / totalBlocks) * 100) : 0

  const markDone = (id: string) => setCompleted(p => new Set([...p, id]))
  const unlockBadge = (b: { id: string; label: string }) => {
    setBadges(prev => {
      if (prev.some(x => x.id === b.id)) return prev
      setToast(`Badge débloqué — ${b.label}`)
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(null), 3500)
      return [...prev, b]
    })
  }
  const goNext = (opts?: { points?: number; badge?: { id: string; label: string } }) => {
    if (opts?.points) setPoints(p => p + opts.points!)
    if (opts?.badge) unlockBadge(opts.badge)
    if (curBlk) markDone(curBlk.id)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (blkIdx < blocks.length - 1) { setBlkIdx(b => b + 1); return }
    if (modIdx < modules.length - 1) {
      setModIdx(m => m + 1); setBlkIdx(0)
      unlockBadge({ id: `module_${modIdx}`, label: `🏁 Module ${modIdx + 1} terminé` })
    }
  }
  const goPrev = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (blkIdx > 0) { setBlkIdx(b => b - 1); return }
    if (modIdx > 0) { setModIdx(m => m - 1); setBlkIdx((modules[modIdx - 1]?.blocks?.length || 1) - 1) }
  }

  const isFirst = modIdx === 0 && blkIdx === 0
  const isLast  = modIdx === modules.length - 1 && blkIdx === blocks.length - 1

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', background: fullscreen ? '#000' : '#F5F4F2', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(28,25,23,0.08)', padding: '0 1.5rem', height: '56px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => router.push('/formateur/cours')} style={{ background: 'none', border: '1px solid rgba(28,25,23,0.1)', borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px', color: '#78716C', fontWeight: '600' }}>← Mes cours</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '800', fontSize: '15px', color: '#1C1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</div>
        </div>
        {/* Points */}
        {points > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: '20px', padding: '4px 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '13px' }}>⭐</span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#B8860B' }}>{points}</span>
          </div>
        )}
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ width: '120px', height: '6px', background: 'rgba(28,25,23,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#E8651A,#D4A017)', borderRadius: '3px', transition: 'width .4s' }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#E8651A', minWidth: '32px' }}>{progress}%</span>
        </div>
        <button onClick={() => setSidebarOpen(s => !s)} style={{ background: sidebarOpen ? 'rgba(232,101,26,0.1)' : 'rgba(28,25,23,0.05)', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '13px', color: '#E8651A' }}>☰</button>
        <button onClick={toggleFullscreen} title={fullscreen ? 'Quitter le plein écran' : 'Plein écran'} aria-label={fullscreen ? 'Quitter le plein écran' : 'Plein écran'} style={{ background: fullscreen ? 'rgba(232,101,26,0.1)' : 'rgba(28,25,23,0.05)', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '13px', color: '#E8651A' }}>{fullscreen ? '⤡' : '⤢'}</button>
      </div>

      {/* Badge toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: 'linear-gradient(135deg,#D4A017,#E8651A)', color: '#fff', borderRadius: '12px', padding: '10px 20px', fontWeight: '700', fontSize: '13px', boxShadow: '0 8px 24px rgba(212,160,23,0.35)', animation: 'toastIn .3s ease' }}>
          🏅 {toast}
        </div>
      )}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <div style={{ width: '260px', background: 'var(--surface)', borderRight: '1px solid rgba(28,25,23,0.08)', overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ padding: '1rem' }}>
              {modules.map((mod, mi) => (
                <div key={mod.id} style={{ marginBottom: '6px' }}>
                  <div onClick={() => { setModIdx(mi); setBlkIdx(0); topRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
                    style={{ padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', background: mi === modIdx ? 'rgba(232,101,26,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background .15s' }}
                    onMouseEnter={e => { if (mi !== modIdx) (e.currentTarget as HTMLElement).style.background = 'rgba(28,25,23,0.04)' }}
                    onMouseLeave={e => { if (mi !== modIdx) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                    <span style={{ fontSize: '11px', fontWeight: '900', color: mi === modIdx ? '#E8651A' : '#A8A29E', background: mi === modIdx ? 'rgba(232,101,26,0.15)' : 'rgba(28,25,23,0.06)', padding: '1px 7px', borderRadius: '5px' }}>M{mi + 1}</span>
                    <span style={{ fontSize: '12px', fontWeight: mi === modIdx ? '700' : '500', color: mi === modIdx ? '#1C1917' : '#78716C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{mod.title}</span>
                  </div>
                  {mi === modIdx && mod.blocks.map((b, bi) => (
                    <div key={b.id} onClick={() => { setBlkIdx(bi); topRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
                      style={{ padding: '5px 10px 5px 28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', background: bi === blkIdx ? 'rgba(232,101,26,0.06)' : 'transparent', margin: '1px 0', transition: 'background .15s' }}>
                      <span style={{ fontSize: '10px', color: completed.has(b.id) ? '#10B981' : bi === blkIdx ? '#E8651A' : '#C4B5A4' }}>{completed.has(b.id) ? '✓' : bi === blkIdx ? '▶' : '○'}</span>
                      <span style={{ fontSize: '11px', color: bi === blkIdx ? '#E8651A' : '#A8A29E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: bi === blkIdx ? '600' : '400' }}>{b.title || b.type}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }} ref={topRef}>

            {/* Module header */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid rgba(232,101,26,0.12)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#E8651A', letterSpacing: '.7px', marginBottom: '4px' }}>MODULE {modIdx + 1} / {modules.length}</div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1C1917', margin: '0 0 4px' }}>{curMod?.title}</h2>
              {curMod?.objectif && <p style={{ fontSize: '13px', color: '#78716C', margin: 0 }}>🎯 {curMod.objectif}</p>}
            </div>

            {/* Current block */}
            {curBlk && <BlockRenderer key={curBlk.id} block={curBlk} onQuizComplete={goNext} />}
            {!curBlk && <div style={{ color: '#A8A29E', textAlign: 'center', padding: '3rem 0' }}>Ce module ne contient pas encore de contenu.</div>}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(28,25,23,0.08)' }}>
              <button disabled={isFirst} onClick={goPrev}
                style={{ background: isFirst ? 'rgba(28,25,23,0.04)' : '#fff', border: '1px solid rgba(28,25,23,0.12)', borderRadius: '10px', padding: '10px 20px', color: isFirst ? '#C4B5A4' : '#1C1917', fontWeight: '700', fontSize: '13px', cursor: isFirst ? 'not-allowed' : 'pointer' }}>
                ← Précédent
              </button>
              <div style={{ fontSize: '12px', color: '#A8A29E' }}>
                Bloc {modIdx > 0 ? modules.slice(0, modIdx).reduce((a, m) => a + m.blocks.length, 0) + blkIdx + 1 : blkIdx + 1} / {totalBlocks}
              </div>
              {isLast
                ? <button onClick={() => { if (curBlk) markDone(curBlk.id); unlockBadge({ id: 'cours_termine', label: '🏆 Cours terminé' }); setFinished(true) }}
                    style={{ background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                    🎓 Terminer le cours
                  </button>
                : <button onClick={() => goNext()}
                    style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                    Suivant →
                  </button>
              }
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
    </div>
  )
}

export default function PlayerPage() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF9F7', color: '#A8A29E', fontSize: '14px' }}>Chargement…</div>}><PlayerInner /></Suspense>
}
