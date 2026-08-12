'use client'
import { useState } from 'react'

type ToolId = 'lesson-plan' | 'quiz' | 'worksheet' | 'rubric' | 'differentiation'

const TOOLS: { id: ToolId; icon: string; label: string; desc: string; color: string }[] = [
  { id: 'lesson-plan',    icon: '📅', label: 'Plan de séance',            desc: "Déroulé minuté prêt à l'emploi : accroche, développement, application, synthèse.", color: '#E8651A' },
  { id: 'quiz',           icon: '❓', label: 'Quiz / QCM express',        desc: 'Questions à choix multiples ancrées dans des situations locales, avec corrigé.',    color: '#00BFA5' },
  { id: 'worksheet',      icon: '✏️', label: 'Fiche d’exercices différenciée', desc: '3 paliers de difficulté + corrigé, pour une classe à niveaux hétérogènes.', color: '#5B8DEF' },
  { id: 'rubric',         icon: '📊', label: 'Grille d’évaluation',   desc: 'Critères, barème et niveaux de maîtrise formulés de façon observable.',           color: '#FFB300' },
  { id: 'differentiation',icon: '🧩', label: 'Différenciation pédagogique',desc: "Adapte un texte ou un exercice en 3 niveaux pour une même classe.",               color: '#8B5CF6' },
]

const NIVEAUX = ['Primaire (CP-CM2)', 'Collège (6e-3e)', 'Lycée (2nde-Term.)', 'Formation professionnelle', 'Université']
const PAYS = ['Sénégal', "Côte d'Ivoire", 'Cameroun', 'Bénin', 'Mali', 'Burkina Faso', 'Togo', 'RD Congo', 'Congo', 'Gabon', 'Niger', 'Guinée', 'Autre / non précisé']
const DUREES = ['30 min', '45 min', '1h', '1h30', '2h']
const NB_QUESTIONS = ['5', '8', '10', '15']

const S = {
  card:  { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-1)' } as React.CSSProperties,
  inp:   { background: 'var(--gold-50)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', padding: '10px 14px', width: '100%', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none', boxSizing: 'border-box' as const } as React.CSSProperties,
  btn:   { background: 'var(--grad-signature)', border: 'none', borderRadius: 'var(--r-sm)', padding: '11px 22px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: 'var(--sh-1)' } as React.CSSProperties,
  ghost: { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', padding: '10px 18px', color: 'var(--ink-mut)', fontSize: '13px', cursor: 'pointer', fontWeight: '600' as const } as React.CSSProperties,
  lbl:   { fontSize: '11px', color: 'var(--ink-soft)', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '0.7px' },
}

// ── Rendu texte structuré (# / ## / - / **gras**) sans dangerouslySetInnerHTML ──
function ResultView({ text }: { text: string }) {
  const lines = text.split('\n')
  const renderInline = (s: string) => {
    const parts = s.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((p, i) => p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>)
  }
  return (
    <div style={{ fontFamily: 'var(--sans)', color: 'var(--ink)', lineHeight: 1.7, fontSize: '14px' }}>
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h2 key={i} style={{ fontSize: '19px', fontWeight: 800, margin: '18px 0 8px', color: 'var(--ink)' }}>{renderInline(line.slice(2))}</h2>
        if (line.startsWith('## ')) return <h3 key={i} style={{ fontSize: '15px', fontWeight: 700, margin: '14px 0 6px', color: '#E8651A' }}>{renderInline(line.slice(3))}</h3>
        if (line.startsWith('- ')) return <div key={i} style={{ paddingLeft: '14px', marginBottom: '4px' }}>• {renderInline(line.slice(2))}</div>
        if (!line.trim()) return <div key={i} style={{ height: '6px' }} />
        return <p key={i} style={{ margin: '4px 0' }}>{renderInline(line)}</p>
      })}
    </div>
  )
}

export default function OutilsIAPage() {
  const [active, setActive]   = useState<ToolId | null>(null)
  const [subject, setSubject] = useState('')
  const [level, setLevel]     = useState(NIVEAUX[0])
  const [country, setCountry] = useState(PAYS[0])
  const [classSize, setClassSize] = useState('')
  const [duration, setDuration]   = useState(DUREES[2])
  const [count, setCount]         = useState(NB_QUESTIONS[1])
  const [points, setPoints]       = useState('20')
  const [extra, setExtra]         = useState('')
  const [sourceText, setSourceText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [result, setResult]   = useState<string | null>(null)

  const tool = TOOLS.find(t => t.id === active)

  function openTool(id: ToolId) {
    setActive(id); setResult(null); setError(null)
  }

  async function generate() {
    if (!active) return
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/ai-teacher-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: active, subject, level, country, classSize, duration, count, points, extra, sourceText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erreur inconnue')
      setResult(data.result)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  function copyResult() {
    if (result) navigator.clipboard.writeText(result)
  }
  function downloadResult() {
    if (!result || !tool) return
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${tool.label.replace(/\s+/g, '-').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg,rgba(232,101,26,0.08),rgba(91,141,239,0.06))', border: '1px solid var(--line)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--grad-signature)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>🧰</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>Outils IA pour enseignants</h1>
          <p style={{ color: 'var(--ink-mut)', fontSize: '13px' }}>5 outils natifs ETAGIA, pensés pour la réalité des classes en Afrique francophone — effectifs élevés, ressources limitées, niveaux hétérogènes.</p>
        </div>
      </div>

      {/* Grille d'outils */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem', marginBottom: active ? '1.5rem' : 0 }}>
        {TOOLS.map(t => (
          <div key={t.id} onClick={() => openTool(t.id)} style={{
            ...S.card, padding: '1.1rem', cursor: 'pointer', position: 'relative', overflow: 'hidden',
            outline: active === t.id ? `2px solid ${t.color}` : 'none',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: t.color, opacity: 0.75 }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${t.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{t.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)', paddingTop: '6px' }}>{t.label}</div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-mut)', lineHeight: 1.55 }}>{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Panneau formulaire + résultat */}
      {tool && (
        <div style={{ ...S.card, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.1rem' }}>
            <span style={{ fontSize: '20px' }}>{tool.icon}</span>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>{tool.label}</h2>
            <button onClick={() => setActive(null)} style={{ ...S.ghost, marginLeft: 'auto', padding: '5px 10px' }}>✕ Fermer</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.9rem', marginBottom: '1rem' }}>
            {active !== 'differentiation' && (
              <div>
                <label style={S.lbl}>Sujet / matière</label>
                <input style={S.inp} value={subject} onChange={e => setSubject(e.target.value)} placeholder="ex : Les fractions, La photosynthèse..." />
              </div>
            )}
            <div>
              <label style={S.lbl}>Niveau</label>
              <select style={S.inp} value={level} onChange={e => setLevel(e.target.value)}>
                {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>Pays / programme</label>
              <select style={S.inp} value={country} onChange={e => setCountry(e.target.value)}>
                {PAYS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={S.lbl}>Effectif de la classe</label>
              <input style={S.inp} value={classSize} onChange={e => setClassSize(e.target.value)} placeholder="ex : 65 élèves" />
            </div>
            {active === 'lesson-plan' && (
              <div>
                <label style={S.lbl}>Durée de la séance</label>
                <select style={S.inp} value={duration} onChange={e => setDuration(e.target.value)}>
                  {DUREES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}
            {active === 'quiz' && (
              <div>
                <label style={S.lbl}>Nombre de questions</label>
                <select style={S.inp} value={count} onChange={e => setCount(e.target.value)}>
                  {NB_QUESTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            {active === 'rubric' && (
              <div>
                <label style={S.lbl}>Barème</label>
                <input style={S.inp} value={points} onChange={e => setPoints(e.target.value)} placeholder="ex : sur 20" />
              </div>
            )}
          </div>

          {active === 'differentiation' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={S.lbl}>Texte ou exercice source à adapter *</label>
              <textarea style={{ ...S.inp, minHeight: '110px', resize: 'vertical' as const }} value={sourceText} onChange={e => setSourceText(e.target.value)} placeholder="Collez ici le texte, l'énoncé ou l'exercice à décliner en 3 niveaux..." />
            </div>
          )}

          <div style={{ marginBottom: '1.1rem' }}>
            <label style={S.lbl}>Précisions supplémentaires (optionnel)</label>
            <textarea style={{ ...S.inp, minHeight: '60px', resize: 'vertical' as const }} value={extra} onChange={e => setExtra(e.target.value)} placeholder="Contraintes, objectifs particuliers, contexte..." />
          </div>

          <button onClick={generate} disabled={loading || (active === 'differentiation' && !sourceText.trim())} style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {loading ? <><span style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} /> Génération…</> : 'Générer →'}
          </button>

          {error && (
            <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', fontSize: '13px', color: '#dc2626' }}>⚠️ {error}</div>
          )}

          {result && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--line)', paddingTop: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                <button onClick={copyResult} style={S.ghost}>📋 Copier</button>
                <button onClick={downloadResult} style={S.ghost}>⬇ Télécharger .txt</button>
              </div>
              <ResultView text={result} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
