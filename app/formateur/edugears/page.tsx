'use client'
import { useState } from 'react'

const AI_TOOLS = [
  { id: 'course-modules', icon: '🧩', label: 'Modules de cours IA',     desc: "Génère automatiquement un plan de cours structuré avec modules et objectifs pédagogiques.", color: '#E8651A', category: 'Création' },
  { id: 'quiz',           icon: '❓', label: 'Quiz & Évaluations',       desc: 'Crée des questionnaires adaptatifs avec QCM, questions ouvertes et feedback automatique.',    color: '#00BFA5', category: 'Évaluation' },
  { id: 'slides',         icon: '🖼', label: 'Diapositives IA',          desc: "Produit des présentations visuelles prêtes à l'emploi à partir d'un sujet ou d'un texte.",  color: '#5B8DEF', category: 'Création' },
  { id: 'grading',        icon: '📊', label: 'Notation automatique',     desc: 'Corrige et note les travaux des apprenants avec retours personnalisés et rubrique IA.',       color: '#FFB300', category: 'Évaluation' },
  { id: 'tutor',          icon: '🎓', label: 'Tuteur conversationnel',   desc: "Assistant pédagogique qui répond aux questions des apprenants en temps réel, 24h/24.",       color: '#FFB300', category: 'Accompagnement' },
  { id: 'study-guide',    icon: '📖', label: 'Fiche de révision',        desc: 'Synthétise un contenu en fiches de révision concises, organisées par thèmes clés.',           color: '#00BFA5', category: 'Révision' },
  { id: 'worksheet',      icon: '✏️', label: 'Exercices pratiques',      desc: "Génère des exercices progressifs adaptés au niveau et aux lacunes de l'apprenant.",          color: '#E8651A', category: 'Pratique' },
  { id: 'lesson-planner', icon: '📅', label: 'Plan de cours',            desc: 'Planifie une séquence pédagogique complète avec timing, ressources et jalons.',              color: '#5B8DEF', category: 'Création' },
  { id: 'assistant',      icon: '🤖', label: 'Assistant pédagogique',    desc: "Aide à rédiger des consignes, scénarios, objectifs SMART et grilles d'évaluation.",         color: '#FFB300', category: 'Assistance' },
  { id: 'curriculum',     icon: '🗺', label: 'Curriculum intelligent',   desc: 'Conçoit un programme de formation complet aligné sur des référentiels de compétences.',      color: '#FFB300', category: 'Stratégie' },
]

const CATEGORIES = ['Tous', 'Création', 'Évaluation', 'Accompagnement', 'Révision', 'Pratique', 'Assistance', 'Stratégie']
const EDUGEARS_LAUNCH_URL = 'https://lti-api.edugears.ai/lti/launch'
const EDUGEARS_LOGIN_URL  = 'https://lti-api.edugears.ai/lti/login'

export default function EduGearsPage() {
  const [filter, setFilter]       = useState('Tous')
  const [launching, setLaunching] = useState<string | null>(null)
  const [error, setError]         = useState<string | null>(null)

  const filtered = AI_TOOLS.filter(t => filter === 'Tous' || t.category === filter)

  /**
   * Lance un outil EduGears via LTI 1.3 — flux OIDC 3rd-party initié correct :
   *
   *  1. ETAGIA redirige vers EduGears login initiation URL
   *     → EduGears génère un state/nonce, les stocke dans SA session
   *  2. EduGears redirige vers notre /api/lti/auth avec state+nonce+redirect_uri
   *  3. Notre /api/lti/auth signe le JWT avec ces valeurs et auto-submit vers EduGears
   *  4. EduGears valide le state (trouvé dans sa session) → outil s'ouvre
   */
  function launchTool(toolId: string) {
    setLaunching(toolId)
    setError(null)

    try {
      // Étape 1 : initier le flux OIDC côté EduGears
      // EduGears va générer le state, le stocker dans sa session,
      // puis rediriger vers notre /api/lti/auth avec les bons paramètres
      const loginUrl = new URL(EDUGEARS_LOGIN_URL)
      loginUrl.searchParams.set('iss',               'https://etagia-lms.vercel.app')
      loginUrl.searchParams.set('client_id',          'etagia-edugears-client-001')
      loginUrl.searchParams.set('lti_deployment_id',  'etagia-deploy-001')
      loginUrl.searchParams.set('target_link_uri',    EDUGEARS_LAUNCH_URL)
      loginUrl.searchParams.set('login_hint',         'lamine-gaye-stable-001')
      loginUrl.searchParams.set('lti_message_hint',   toolId)

      // Ouvrir dans un nouvel onglet pour conserver la session EduGears
      window.open(loginUrl.toString(), '_blank')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      // Petit délai pour que le spinner soit visible
      setTimeout(() => setLaunching(null), 800)
    }
  }

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg,rgba(28,25,23,0.07),rgba(34,212,168,0.06))', border: '1px solid rgba(28,25,23,0.09)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg,#E8651A,#00BFA5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg,#F6F7FB,#E8651A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>EduGears AI</h1>
          <p style={{ color: '#A8A29E', fontSize: '13px' }}>10 outils d'intelligence artificielle pédagogique · LTI 1.3 Advantage</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ background: 'rgba(34,212,168,0.12)', border: '1px solid rgba(34,212,168,0.3)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#00BFA5' }}>✓ Connecté</div>
          <div style={{ background: 'rgba(28,25,23,0.07)', border: '1px solid rgba(232,101,26,0.30)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: '#E8651A' }}>LTI 1.3 ✓</div>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div style={{ marginBottom: '1.5rem', padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>⚠️</span>
          <span style={{ fontSize: '13px', color: '#f87171', flex: 1 }}>{error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>
      )}

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ background: filter === cat ? 'linear-gradient(135deg,#E8651A,#5B8DEF)' : 'rgba(28,25,23,0.05)', border: filter === cat ? 'none' : '1px solid rgba(28,25,23,0.09)', borderRadius: '8px', padding: '7px 14px', color: filter === cat ? '#fff' : '#A8A29E', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{cat}</button>
        ))}
      </div>

      {/* Grille */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
        {filtered.map(tool => {
          const isLoading = launching === tool.id
          return (
            <div key={tool.id} style={{ background: 'var(--surface)', border: '1px solid rgba(28,25,23,0.07)', borderRadius: '16px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: tool.color, opacity: 0.7 }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: `${tool.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{tool.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--canvas)', marginBottom: '2px' }}>{tool.label}</div>
                  <div style={{ fontSize: '10px', color: tool.color, fontWeight: '600', background: `${tool.color}18`, borderRadius: '4px', padding: '2px 7px', display: 'inline-block' }}>{tool.category}</div>
                </div>
              </div>
              <p style={{ fontSize: '12.5px', color: '#57534E', lineHeight: '1.6', marginBottom: '14px' }}>{tool.desc}</p>
              {/* ✅ LTI 1.3 correct — POST /api/lti/auth → id_token JWT RS256 → auto-submit EduGears */}
              <button
                onClick={() => launchTool(tool.id)}
                disabled={!!launching}
                style={{ width: '100%', background: isLoading ? `${tool.color}66` : `linear-gradient(135deg,${tool.color},${tool.color}99)`, border: 'none', borderRadius: '10px', padding: '10px', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: isLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {isLoading ? (
                  <><span style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} /> Connexion LTI…</>
                ) : "Lancer l'outil →"}
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(232,101,26,0.05)', border: '1px solid rgba(28,25,23,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <div>
          <div style={{ fontSize: '12.5px', color: '#E8651A', fontWeight: '600', marginBottom: '2px' }}>Intégration LTI 1.3 Advantage — JWT RS256</div>
          <div style={{ fontSize: '12px', color: '#57534E' }}>Chaque clic génère un <code style={{ background: 'rgba(232,101,26,0.1)', padding: '1px 4px', borderRadius: '3px', fontSize: '11px' }}>id_token</code> signé RS256 · client_id : <strong style={{ color: '#00BFA5' }}>etagia-edugears-client-001</strong> · deployment_id : <strong style={{ color: '#00BFA5' }}>etagia-deploy-001</strong></div>
        </div>
      </div>
    </div>
  )
}
