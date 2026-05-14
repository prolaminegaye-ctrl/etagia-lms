'use client'
import { useState } from 'react'

const steps = ['Sujet & objectifs', 'Structure générée', 'Contenu HTML', 'Aperçu & Export']

export default function IACoursPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ title: '', level: 'débutant', duration: '2h', objectives: '', audience: '' })
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<any>(null)
  const [htmlContent, setHtmlContent] = useState('')

  const generate = async () => {
    if (!form.title) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Crée un plan de cours complet pour: "${form.title}"
Niveau: ${form.level} | Durée: ${form.duration}
Objectifs: ${form.objectives}
Public: ${form.audience}

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{"modules":[{"titre":"...","duree":"...","objectif":"...","contenu":["point1","point2","point3"],"quiz":{"question":"...","reponses":["A","B","C","D"],"bonne":0}}],"introduction":"...","conclusion":"..."}`
          }]
        })
      })

      let text = ''
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          try { text += JSON.parse(data).delta?.text || '' } catch {}
        }
      }
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setGenerated(parsed)
      setStep(1)

      // Generate HTML
      const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>${form.title}</title>
<style>
  body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a2e;background:#f8f9ff}
  h1{color:#5B8DEF;border-bottom:3px solid #5B8DEF;padding-bottom:10px}
  h2{color:#1B2438;margin-top:30px}
  .module{background:#fff;border-left:4px solid #5B8DEF;padding:20px;margin:20px 0;border-radius:0 12px 12px 0;box-shadow:0 2px 8px rgba(0,0,0,0.08)}
  .tag{background:#E8EEFF;color:#5B8DEF;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700}
  .quiz{background:#E8FFF5;border:1px solid #22D4A8;border-radius:12px;padding:16px;margin-top:16px}
  .quiz h4{color:#0FA878;margin-bottom:8px}
  li{margin:6px 0;line-height:1.6}
  .intro,.conclusion{background:#F0F4FF;border-radius:12px;padding:20px;margin:20px 0;font-style:italic}
</style></head><body>
<h1>📚 ${form.title}</h1>
<p class="tag">Niveau: ${form.level}</p> <p class="tag">Durée: ${form.duration}</p>
<div class="intro"><strong>Introduction:</strong> ${parsed.introduction || ''}</div>
${(parsed.modules || []).map((m: any, i: number) => `
<div class="module">
  <h2>Module ${i+1}: ${m.titre}</h2>
  <p><strong>⏱ Durée:</strong> ${m.duree} | <strong>🎯 Objectif:</strong> ${m.objectif}</p>
  <ul>${(m.contenu || []).map((c: string) => `<li>${c}</li>`).join('')}</ul>
  ${m.quiz ? `<div class="quiz"><h4>📝 Quiz: ${m.quiz.question}</h4><ol>${(m.quiz.reponses || []).map((r: string, j: number) => `<li style="${j===m.quiz.bonne?'font-weight:700;color:#0FA878':''}">${r}${j===m.quiz.bonne?' ✓':''}</li>`).join('')}</ol></div>` : ''}
</div>`).join('')}
<div class="conclusion"><strong>Conclusion:</strong> ${parsed.conclusion || ''}</div>
</body></html>`
      setHtmlContent(html)
    } catch (e) {
      alert('Erreur génération. Vérifiez la clé ANTHROPIC_API_KEY dans Vercel.')
    }
    setLoading(false)
  }

  const downloadHTML = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${form.title.replace(/\s+/g,'-')}.html`
    a.click()
  }

  const downloadPDF = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(htmlContent)
    win.document.close()
    win.print()
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>✦ Créer un cours avec l&apos;IA</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Générez un cours complet structuré en quelques secondes</p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '10px', borderRadius: '10px', textAlign: 'center', fontSize: '12px', fontWeight: '600', background: i === step ? 'var(--accent-muted)' : 'var(--bg-card)', color: i === step ? 'var(--accent)' : 'var(--text-muted)', border: `1px solid ${i === step ? 'var(--border-active)' : 'var(--border)'}` }}>
            <div style={{ fontSize: '16px', marginBottom: '2px' }}>{i+1}</div>
            {s}
          </div>
        ))}
      </div>

      {/* Step 0 - Form */}
      {step === 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Titre du cours *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="ex: Introduction au Machine Learning" />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Niveau</label>
              <select value={form.level} onChange={e => setForm({...form, level: e.target.value})}
                style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', width: '100%' }}>
                {['débutant','intermédiaire','avancé'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Durée estimée</label>
              <input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="ex: 3h, 2 jours..." />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Public cible</label>
              <input value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} placeholder="ex: Entrepreneurs africains, débutants..." />
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Objectifs pédagogiques</label>
            <textarea value={form.objectives} onChange={e => setForm({...form, objectives: e.target.value})}
              placeholder="Que doit savoir faire l'apprenant à la fin ?" rows={3}
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', width: '100%', resize: 'vertical' }} />
          </div>
          <button onClick={generate} disabled={loading || !form.title} className="btn-primary"
            style={{ opacity: loading || !form.title ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {loading ? '⏳ Génération en cours...' : '✦ Générer le cours avec l\'IA'}
          </button>
        </div>
      )}

      {/* Step 1 - Structure */}
      {step === 1 && generated && (
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-active)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>{generated.introduction}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(generated.modules || []).map((m: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent)', borderRadius: '0 12px 12px 0', padding: '14px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>Module {i+1}: {m.titre}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>⏱ {m.duree} · 🎯 {m.objectif}</div>
                  <ul style={{ paddingLeft: '16px' }}>
                    {(m.contenu || []).map((c: string, j: number) => (
                      <li key={j} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '3px' }}>{c}</li>
                    ))}
                  </ul>
                  {m.quiz && <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--teal)', fontWeight: '600' }}>📝 Quiz: {m.quiz.question}</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} className="btn-primary">Voir le contenu HTML →</button>
            <button onClick={() => setStep(0)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 20px', color: 'var(--text-secondary)', fontSize: '14px' }}>← Modifier</button>
          </div>
        </div>
      )}

      {/* Step 2 - HTML */}
      {step === 2 && (
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'monospace' }}>HTML généré — modifiable</div>
            <textarea value={htmlContent} onChange={e => setHtmlContent(e.target.value)} rows={16}
              style={{ background: '#0A0E1A', color: '#A8D8A8', border: 'none', borderRadius: '10px', padding: '14px', width: '100%', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.6', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(3)} className="btn-primary">Aperçu & Export →</button>
            <button onClick={() => setStep(1)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 20px', color: 'var(--text-secondary)', fontSize: '14px' }}>← Structure</button>
          </div>
        </div>
      )}

      {/* Step 3 - Preview & Export */}
      {step === 3 && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
            <button onClick={downloadHTML} className="btn-primary">⬇ Télécharger HTML</button>
            <button onClick={downloadPDF} style={{ background: 'var(--teal-muted)', border: '1px solid var(--teal)', borderRadius: '10px', padding: '10px 20px', color: 'var(--teal)', fontSize: '14px', fontWeight: '700' }}>🖨 Exporter PDF</button>
            <button onClick={() => setStep(2)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 20px', color: 'var(--text-secondary)', fontSize: '14px' }}>← Modifier HTML</button>
          </div>
          <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <iframe srcDoc={htmlContent} style={{ width: '100%', height: '600px', border: 'none' }} title="apercu" />
          </div>
        </div>
      )}
    </div>
  )
}
