'use client'
import { useState } from 'react'

const AI_TOOLS = [
  { id: 'course-modules', icon: '🧩', label: 'Modules de cours IA', desc: 'Génère automatiquement un plan de cours structuré avec modules et objectifs pédagogiques.', color: '#FF5722', category: 'Création' },
  { id: 'quiz', icon: '❓', label: 'Quiz & Évaluations', desc: 'Crée des questionnaires adaptatifs avec QCM, questions ouvertes et feedback automatique.', color: '#00BFA5', category: 'Évaluation' },
  { id: 'slides', icon: '🖼', label: 'Diapositives IA', desc: 'Produit des présentations visuelles prêtes à l\'emploi à partir d\'un sujet ou d\'un texte.', color: '#5B8DEF', category: 'Création' },
  { id: 'grading', icon: '📊', label: 'Notation automatique', desc: 'Corrige et note les travaux des apprenants avec retours personnalisés et rubrique IA.', color: '#FFB300', category: 'Évaluation' },
  { id: 'tutor', icon: '🎓', label: 'Tuteur conversationnel', desc: 'Assistant pédagogique qui répond aux questions des apprenants en temps réel, 24h/24.', color: '#FFB300', category: 'Accompagnement' },
  { id: 'study-guide', icon: '📖', label: 'Fiche de révision', desc: 'Synthétise un contenu en fiches de révision concises, organisées par thèmes clés.', color: '#00BFA5', category: 'Révision' },
  { id: 'worksheet', icon: '✏️', label: 'Exercices pratiques', desc: 'Génère des exercices progressifs adaptés au niveau et aux lacunes de l\'apprenant.', color: '#FF5722', category: 'Pratique' },
  { id: 'lesson-planner', icon: '📅', label: 'Plan de cours', desc: 'Planifie une séquence pédagogique complète avec timing, ressources et jalons.', color: '#5B8DEF', category: 'Création' },
  { id: 'assistant', icon: '🤖', label: 'Assistant pédagogique', desc: 'Aide à rédiger des consignes, scénarios, objectifs SMART et grilles d\'évaluation.', color: '#FFB300', category: 'Assistance' },
  { id: 'curriculum', icon: '🗺', label: 'Curriculum intelligent', desc: 'Conçoit un programme de formation complet aligné sur des référentiels de compétences.', color: '#FFB300', category: 'Stratégie' },
]

const CATEGORIES = ['Tous', 'Création', 'Évaluation', 'Accompagnement', 'Révision', 'Pratique', 'Assistance', 'Stratégie']

export default function EduGearsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [filter, setFilter] = useState('Tous')
  const [launching, setLaunching] = useState(false)

  const filtered = AI_TOOLS.filter(t => filter === 'Tous' || t.category === filter)
  const currentTool = AI_TOOLS.find(t => t.id === activeTool)

  function launchTool(toolId: string) {
    setLaunching(true)
    setActiveTool(toolId)
    setTimeout(() => setLaunching(false), 800)
  }

  const ltiUrl = activeTool
    ? `https://lti-api.edugears.ai/lti/launch?tool=${activeTool}&user_name=Lamine+Gaye&user_email=prolaminegaye%40gmail.com&lang=fr&platform=etagia-lms`
    : ''

  return (
    <div>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg,rgba(28,25,23,0.07),rgba(34,212,168,0.06))', border: '1px solid rgba(28,25,23,0.09)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg,#FF5722,#00BFA5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg,#1C1917,#E8651A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>EduGears AI</h1>
          <p style={{ color: '#A8A29E', fontSize: '13px' }}>10 outils d'intelligence artificielle pédagogique · LTI 1.3 Advantage</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ background: 'rgba(34,212,168,0.12)', border: '1px solid rgba(34,212,168,0.3)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#00BFA5' }}>✓ Connecté</div>
          <div style={{ background: 'rgba(28,25,23,0.07)', border: '1px solid rgba(232,101,26,0.30)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#E8651A' }}>LTI 1.3</div>
        </div>
      </div>

      {activeTool ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <button onClick={() => setActiveTool(null)} style={{ background: 'rgba(28,25,23,0.08)', border: '1px solid rgba(232,101,26,0.30)', borderRadius: '10px', padding: '8px 16px', color: '#E8651A', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>← Retour</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>{currentTool?.icon}</span>
              <span style={{ fontWeight: '700', color: '#1C1917', fontSize: '16px' }}>{currentTool?.label}</span>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(28,25,23,0.08)', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
            {launching && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,10,26,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(28,25,23,0.09)', borderTopColor: '#FF5722', animation: 'spin 0.8s linear infinite' }} />
                <div style={{ color: '#E8651A', fontSize: '14px', fontWeight: '600' }}>Lancement de {currentTool?.label}…</div>
              </div>
            )}
            <iframe src={ltiUrl} style={{ width: '100%', height: '680px', border: 'none', display: 'block' }} allow="camera; microphone; fullscreen" title={currentTool?.label} />
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{ background: filter === cat ? 'linear-gradient(135deg,#FF5722,#5B8DEF)' : 'rgba(28,25,23,0.05)', border: filter === cat ? 'none' : '1px solid rgba(28,25,23,0.09)', borderRadius: '8px', padding: '7px 14px', color: filter === cat ? '#fff' : '#A8A29E', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{cat}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
            {filtered.map(tool => (
              <div key={tool.id} style={{ background: '#FFFFFF', border: '1px solid rgba(28,25,23,0.07)', borderRadius: '16px', padding: '1.25rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: tool.color, opacity: 0.7 }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: `${tool.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{tool.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#1C1917', marginBottom: '2px' }}>{tool.label}</div>
                    <div style={{ fontSize: '10px', color: tool.color, fontWeight: '600', background: `${tool.color}18`, borderRadius: '4px', padding: '2px 7px', display: 'inline-block' }}>{tool.category}</div>
                  </div>
                </div>
                <p style={{ fontSize: '12.5px', color: '#57534E', lineHeight: '1.6', marginBottom: '14px' }}>{tool.desc}</p>
                <button onClick={() => launchTool(tool.id)} style={{ width: '100%', background: `linear-gradient(135deg,${tool.color},${tool.color}99)`, border: 'none', borderRadius: '10px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Lancer l'outil →</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(123,92,245,0.05)', border: '1px solid rgba(28,25,23,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <div>
              <div style={{ fontSize: '12.5px', color: '#E8651A', fontWeight: '600', marginBottom: '2px' }}>Intégration LTI 1.3 Advantage</div>
              <div style={{ fontSize: '12px', color: '#57534E' }}>Les outils EduGears AI sont connectés via protocole LTI 1.3 sécurisé. Code de réclamation : <strong style={{ color: '#00BFA5' }}>EG-4UGR-MVU9</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
