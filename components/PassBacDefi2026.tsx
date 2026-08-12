'use client'

/**
 * ETAGIA Académie — Mon Pass'BAC → Onglet "Bac 2026"
 * Espace d'entraînement gamifié à partir des VRAIES épreuves et corrigés officiels
 * de la session 2026 du Baccalauréat Général (Office du Baccalauréat — UCAD).
 *
 * Pédagogie : rappel actif en conditions réelles (chrono officiel), auto-correction
 * guidée, progression visible (XP, niveau, streak, badges par série) pour transformer
 * la révision sur annales en un parcours motivant plutôt qu'un simple dépôt de PDF.
 */

import { useState, useEffect, useMemo, useRef, type CSSProperties } from 'react'
import {
  BAC_2026_GEN, DOCUMENTS_COMPLEMENTAIRES, SOURCE_OFFICIELLE, SERIES_FILTRES,
  type GroupeBac, type SerieFiltre,
} from '@/lib/bac2026-officiel'

/* ── Persistance locale de la progression ─────────────────────────────────── */
const STORAGE_KEY = 'etagia_bac2026_progress'
interface ProgressEntry { completedAt: string; note?: number; xp: number }
interface ProgressState { entries: Record<string, ProgressEntry>; streak: number; lastActiveDate: string | null }
const EMPTY_STATE: ProgressState = { entries: {}, streak: 0, lastActiveDate: null }

function loadState(): ProgressState {
  if (typeof window === 'undefined') return EMPTY_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...EMPTY_STATE, ...JSON.parse(raw) } : EMPTY_STATE
  } catch { return EMPTY_STATE }
}
function saveState(s: ProgressState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  window.dispatchEvent(new Event('bac2026-progress-update'))
}
function todayISO() { return new Date().toISOString().slice(0, 10) }
function isYesterday(dateISO: string) {
  const d = new Date(dateISO); const y = new Date(); y.setDate(y.getDate() - 1)
  return d.toDateString() === y.toDateString()
}

/* ── Niveaux de progression ────────────────────────────────────────────────── */
const LEVELS = [
  { min: 0, label: 'Candidat Débutant', icon: '🌱' },
  { min: 120, label: 'Candidat Sérieux', icon: '📘' },
  { min: 320, label: 'Candidat Confirmé', icon: '🔥' },
  { min: 640, label: 'Candidat Élite', icon: '⭐' },
  { min: 1100, label: 'Futur Bachelier', icon: '🎓' },
]
function getLevel(xp: number) {
  let idx = 0
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i
  const current = LEVELS[idx]
  const next = LEVELS[idx + 1]
  return { ...current, next, xpToNext: next ? next.min - xp : 0, idx }
}

/* ── Icônes par matière ────────────────────────────────────────────────────── */
function matiereIcon(m: string) {
  const s = m.toLowerCase()
  if (s.includes('philo')) return '🧠'
  if (s.includes('français')) return '📚'
  if (s.includes('math')) return '📐'
  if (s.includes('physique')) return '⚗️'
  if (s.includes('svt')) return '🧬'
  if (s.includes('histoire') || s.includes('géo')) return '🌍'
  if (s.includes('anglais')) return '🇬🇧'
  if (s.includes('espagnol')) return '🇪🇸'
  if (s.includes('allemand')) return '🇩🇪'
  if (s.includes('arabe')) return '🇸🇦'
  if (s.includes('portugais')) return '🇵🇹'
  if (s.includes('italien')) return '🇮🇹'
  if (s.includes('russe')) return '🇷🇺'
  if (s.includes('économie')) return '📊'
  if (s.includes('civilisation')) return '🏛️'
  if (s.includes('islam')) return '☪️'
  if (s.includes('grec') || s.includes('latin') || s.includes('ancienne')) return '📜'
  if (s.includes('technolog') || s.includes('pyrotech')) return '⚙️'
  return '📄'
}

/* ── Conseils méthodo ciblés par famille de matière (le volet "tutoriel") ───── */
function getMethodTips(matiere: string): string[] {
  const s = matiere.toLowerCase()
  if (s.includes('philo')) return [
    'Choisis ton sujet (dissertation OU explication de texte) en 5 minutes maximum.',
    'Fais ton brouillon : problématise la question avant d\'écrire l\'introduction.',
    'Structure obligatoire : introduction (accroche + problématique + annonce du plan), 2 ou 3 parties argumentées avec exemples, conclusion qui répond à la question.',
    'Garde 15 minutes en fin d\'épreuve pour te relire.',
  ]
  if (s.includes('français')) return [
    'Lis le texte deux fois avant de répondre aux questions.',
    'Pour les questions : cite le texte entre guillemets et nomme précisément les procédés (figures de style, registre, énonciation).',
    'Pour la production écrite : choisis UN seul sujet et respecte son type (dissertation, commentaire ou essai).',
    'Vérifie l\'orthographe et la présentation — un correcteur valorise une copie propre et bien découpée en paragraphes.',
  ]
  if (s.includes('histoire') || s.includes('géo')) return [
    'Repère immédiatement les bornes chronologiques et les notions-clés du sujet.',
    'Mobilise des dates précises et des repères spatiaux exacts — c\'est ce qui distingue une bonne copie.',
    'Structure en parties avec des sous-parties visibles (sauts de ligne, connecteurs logiques).',
    'N\'oublie pas les croquis/schémas si la partie géographie le demande.',
  ]
  if (s.includes('math')) return [
    'Lis tout le sujet avant de commencer — repère les exercices que tu maîtrises le mieux.',
    'Rédige au propre directement mais laisse de la place pour corriger si besoin.',
    'Justifie chaque étape de calcul : une réponse juste sans justification rapporte peu de points.',
    'Vérifie tes résultats par un ordre de grandeur ou une méthode alternative si le temps le permet.',
  ]
  if (s.includes('physique') || s.includes('svt')) return [
    'Identifie les formules et unités nécessaires avant de te lancer dans les calculs.',
    'Fais des schémas propres et légendés quand c\'est pertinent.',
    'Précise toujours les unités dans tes résultats numériques.',
    'Relis les consignes : beaucoup de points se perdent sur des questions mal interprétées.',
  ]
  if (['anglais', 'espagnol', 'allemand', 'arabe', 'portugais', 'italien', 'russe'].some(l => s.includes(l))) return [
    'Lis le texte en entier une première fois sans t\'arrêter sur les mots inconnus.',
    'Repère le champ lexical dominant pour deviner le sens des mots que tu ne connais pas.',
    'Réponds dans la langue demandée, avec des phrases complètes et correctement conjuguées.',
    'Pour l\'expression écrite, respecte le nombre de mots demandé et relis-toi pour les accords.',
  ]
  return [
    'Lis l\'intégralité du sujet avant de commencer à composer.',
    'Gère ton temps : répartis-le entre les différentes parties selon leur barème.',
    'Rédige clairement et vérifie la présentation de ta copie.',
    'Garde 10 minutes en fin d\'épreuve pour te relire.',
  ]
}

function formatTime(totalSec: number) {
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0')
  const s = Math.floor(totalSec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/* ── Styles ────────────────────────────────────────────────────────────────── */
const ORANGE = '#E8651A'
const DARK = '#1E1B2E'
const BG_SOFT = '#F7F5FF'

const sectionStyle: CSSProperties = {
  background: 'var(--surface)', borderRadius: '14px', padding: '1.75rem',
  marginBottom: '1.5rem', border: '1px solid rgba(232,101,26,0.12)',
  boxShadow: '0 2px 12px rgba(30,27,46,0.04)',
}
function pillStyle(active: boolean, color = ORANGE): CSSProperties {
  return {
    padding: '0.42rem 1rem', borderRadius: '20px',
    border: `1px solid ${active ? color : 'rgba(30,27,46,0.12)'}`,
    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Syne', sans-serif",
    background: active ? color + '20' : 'transparent', color: active ? color : 'rgba(30,27,46,0.60)',
    transition: 'all 0.2s',
  }
}

export default function PassBacDefi2026() {
  const [state, setState] = useState<ProgressState>(EMPTY_STATE)
  const [mounted, setMounted] = useState(false)
  const [groupeFilter, setGroupeFilter] = useState<'toutes' | GroupeBac>('toutes')
  const [serieFilter, setSerieFilter] = useState<SerieFiltre>('Toutes')
  const [showTuto, setShowTuto] = useState(true)
  const [showDocs, setShowDocs] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [note, setNote] = useState(12)
  const [bienReussi, setBienReussi] = useState('')
  const [aRevoir, setARevoir] = useState('')
  const [justValidated, setJustValidated] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setState(loadState()); setMounted(true) }, [])

  useEffect(() => {
    if (!timerRunning) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { setTimerRunning(false); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  const activeEpreuve = useMemo(() => BAC_2026_GEN.find(e => e.id === activeId) ?? null, [activeId])

  const filteredList = useMemo(() => {
    return BAC_2026_GEN.filter(e => {
      if (groupeFilter !== 'toutes' && e.groupe !== groupeFilter) return false
      if (serieFilter !== 'Toutes' && e.serie !== serieFilter) return false
      return true
    })
  }, [groupeFilter, serieFilter])

  const totalDone = Object.keys(state.entries).length
  const xp = Object.values(state.entries).reduce((acc, e) => acc + e.xp, 0)
  const level = getLevel(xp)
  const progressPct = Math.round((totalDone / BAC_2026_GEN.length) * 100)

  const defiDuJour = useMemo(() => {
    const notDone = BAC_2026_GEN.filter(e => !state.entries[e.id])
    if (!notDone.length) return null
    const start = new Date(new Date().getFullYear(), 0, 0)
    const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000)
    return notDone[dayOfYear % notDone.length]
  }, [state.entries])

  const serieBadges = useMemo(() => {
    const bySerie: Record<string, string[]> = {}
    for (const e of BAC_2026_GEN) { (bySerie[e.serie] ??= []).push(e.id) }
    return Object.entries(bySerie)
      .map(([serie, ids]) => ({ serie, total: ids.length, done: ids.filter(id => !!state.entries[id]).length }))
      .filter(b => b.total >= 3)
  }, [state.entries])

  function openEpreuve(id: string) {
    setActiveId(id === activeId ? null : id)
    setStep(1); setTimerRunning(false); setJustValidated(false)
    const existing = state.entries[id]
    setNote(existing?.note ?? 12); setBienReussi(''); setARevoir('')
  }

  function startTimer() {
    if (!activeEpreuve) return
    setSecondsLeft(activeEpreuve.dureeMin * 60)
    setTimerRunning(true)
    setStep(2)
  }

  function finishComposition() {
    setTimerRunning(false)
    setStep(3)
  }

  function validerEntrainement() {
    if (!activeEpreuve) return
    setState(prev => {
      const already = prev.entries[activeEpreuve.id]
      const gained = already ? 0 : (activeEpreuve.corrigeUrl ? 40 : 25)
      let streak = prev.streak
      let lastActiveDate = prev.lastActiveDate
      if (!already) {
        const today = todayISO()
        if (lastActiveDate === today) { /* déjà compté aujourd'hui */ }
        else if (lastActiveDate && isYesterday(lastActiveDate)) { streak = streak + 1; lastActiveDate = today }
        else { streak = 1; lastActiveDate = today }
      }
      const next: ProgressState = {
        streak, lastActiveDate,
        entries: { ...prev.entries, [activeEpreuve.id]: { completedAt: new Date().toISOString(), note, xp: already ? already.xp : gained } },
      }
      saveState(next)
      return next
    })
    setJustValidated(true)
  }

  if (!mounted) return null

  return (
    <div>
      {/* ── Hero stats ─────────────────────────────────────────────────── */}
      <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #FFF7F0 0%, #FFEFE0 100%)', border: '1px solid rgba(232,101,26,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: '1rem' }}>
          <div>
            <h2 style={{ color: DARK, fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>🏆 Annales officielles — Bac Général 2026</h2>
            <p style={{ color: 'rgba(30,27,46,0.55)', fontSize: '0.85rem', margin: '0.35rem 0 0', maxWidth: '620px' }}>
              Les vraies épreuves et corrigés de la dernière session, publiés par l&apos;<strong>Office du Baccalauréat (UCAD)</strong>.
              Entraîne-toi en conditions réelles : chrono officiel, sujet du jour, auto-correction guidée.
            </p>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontSize: '1.6rem' }}>{level.icon}</div>
            <div style={{ color: ORANGE, fontWeight: 800, fontSize: '0.92rem' }}>{level.label}</div>
            <div style={{ color: 'rgba(30,27,46,0.45)', fontSize: '0.74rem' }}>{xp} XP{level.next ? ` · ${level.xpToNext} XP avant ${level.next.label}` : ' · Niveau maximum !'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: ORANGE }}>{totalDone}/{BAC_2026_GEN.length}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(30,27,46,0.5)' }}>Épreuves entraînées</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: ORANGE }}>🔥 {state.streak}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(30,27,46,0.5)' }}>Jours de suite</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: ORANGE }}>{serieBadges.filter(b => b.done === b.total).length}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(30,27,46,0.5)' }}>Badges de série 🏅</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: ORANGE }}>{progressPct}%</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(30,27,46,0.5)' }}>Progression totale</div>
          </div>
        </div>
        <div style={{ background: 'rgba(30,27,46,0.08)', borderRadius: '20px', height: '8px', marginTop: '1rem', overflow: 'hidden' }}>
          <div style={{ background: ORANGE, height: '100%', width: `${progressPct}%`, transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* ── Comment ça marche (tutoriel) ──────────────────────────────── */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowTuto(!showTuto)}>
          <h3 style={{ color: ORANGE, fontWeight: 800, fontSize: '1rem', margin: 0 }}>🧭 Comment fonctionne l&apos;entraînement ?</h3>
          <span style={{ color: 'rgba(30,27,46,0.4)', fontSize: '0.85rem' }}>{showTuto ? 'Réduire ▲' : 'Déplier ▼'}</span>
        </div>
        {showTuto && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            {[
              { n: '1', icon: '🎯', title: 'Prépare-toi', text: 'Choisis une épreuve. Lis les conseils méthodo ciblés pour la matière et prépare ton brouillon.' },
              { n: '2', icon: '⏱️', title: 'Compose en conditions réelles', text: 'Lance le chrono officiel, ouvre le sujet PDF et compose comme le jour du Bac.' },
              { n: '3', icon: '✅', title: 'Corrige-toi et progresse', text: 'Débloque le corrigé, auto-évalue ta copie sur 20, note tes points forts et gagne de l’XP.' },
            ].map(s => (
              <div key={s.n} style={{ background: BG_SOFT, borderRadius: '12px', padding: '1.1rem', border: '1px solid rgba(30,27,46,0.08)' }}>
                <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
                <div style={{ color: ORANGE, fontWeight: 700, fontSize: '0.85rem', margin: '0.4rem 0 0.25rem' }}>Étape {s.n} — {s.title}</div>
                <div style={{ color: 'rgba(30,27,46,0.6)', fontSize: '0.8rem', lineHeight: 1.6 }}>{s.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Défi du jour ───────────────────────────────────────────────── */}
      {defiDuJour && (
        <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #1E1B2E 0%, #3A3357 100%)', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '1rem' }}>
            <div>
              <div style={{ color: '#FFB74D', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>🎲 Défi du jour</div>
              <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800, margin: '0.3rem 0' }}>
                {matiereIcon(defiDuJour.matiere)} {defiDuJour.matiere} — Série {defiDuJour.serie} ({defiDuJour.groupe === '1er' ? '1er groupe' : '2nd groupe'})
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Durée : {Math.round(defiDuJour.dureeMin / 60 * 10) / 10}h · {defiDuJour.corrigeUrl ? 'Corrigé disponible' : 'Auto-évaluation'}</div>
            </div>
            <button onClick={() => openEpreuve(defiDuJour.id)} style={{ background: ORANGE, color: '#fff', border: 'none', borderRadius: '10px', padding: '0.7rem 1.3rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
              Relever le défi →
            </button>
          </div>
        </div>
      )}

      {/* ── Filtres ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '0.75rem' }}>
        {(['toutes', '1er', '2nd'] as const).map(g => (
          <button key={g} style={pillStyle(groupeFilter === g)} onClick={() => setGroupeFilter(g)}>
            {g === 'toutes' ? 'Tous les groupes' : g === '1er' ? '1er groupe · Session normale' : '2nd groupe · Session de remplacement'}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '1.5rem' }}>
        {SERIES_FILTRES.map(s => (
          <button key={s} style={pillStyle(serieFilter === s, '#7B3FA0')} onClick={() => setSerieFilter(s)}>{s}</button>
        ))}
      </div>

      {/* ── Grille des épreuves ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {filteredList.map(e => {
          const done = !!state.entries[e.id]
          const active = e.id === activeId
          return (
            <div key={e.id} onClick={() => openEpreuve(e.id)}
              style={{
                background: active ? '#FFF3EA' : '#fff', borderRadius: '12px', padding: '1rem 1.1rem', cursor: 'pointer',
                border: `1.5px solid ${active ? ORANGE : done ? 'rgba(22,160,133,0.4)' : 'rgba(30,27,46,0.10)'}`,
                transition: 'all 0.15s', position: 'relative' as const,
              }}>
              {done && <span style={{ position: 'absolute' as const, top: '0.6rem', right: '0.6rem', fontSize: '0.9rem' }}>✅</span>}
              <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{matiereIcon(e.matiere)}</div>
              <div style={{ color: DARK, fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.15rem' }}>{e.matiere}</div>
              <div style={{ color: 'rgba(30,27,46,0.45)', fontSize: '0.74rem' }}>
                Série {e.serie} · {e.groupe === '1er' ? '1er groupe' : '2nd groupe'} · ⏱ {Math.floor(e.dureeMin / 60)}h{e.dureeMin % 60 ? e.dureeMin % 60 : ''}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', fontWeight: 600, color: e.corrigeUrl ? '#16A085' : '#B08900' }}>
                {e.corrigeUrl ? '📗 Corrigé officiel disponible' : '📙 Corrigé non publié — auto-évaluation'}
              </div>
            </div>
          )
        })}
        {!filteredList.length && (
          <div style={{ color: 'rgba(30,27,46,0.4)', fontSize: '0.85rem', padding: '2rem 0' }}>Aucune épreuve pour ces filtres.</div>
        )}
      </div>

      {/* ── Panneau d'entraînement (3 étapes) ──────────────────────────── */}
      {activeEpreuve && (
        <div style={{ ...sectionStyle, border: `1.5px solid ${ORANGE}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap' as const, gap: '0.75rem' }}>
            <div>
              <h3 style={{ color: ORANGE, margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                {matiereIcon(activeEpreuve.matiere)} {activeEpreuve.matiere} — Série {activeEpreuve.serie}
              </h3>
              <div style={{ color: 'rgba(30,27,46,0.45)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                {activeEpreuve.groupe === '1er' ? '1er groupe · Session normale' : '2nd groupe · Session de remplacement'} · Durée officielle indicative : {Math.floor(activeEpreuve.dureeMin / 60)}h{activeEpreuve.dureeMin % 60 ? activeEpreuve.dureeMin % 60 : ''}
              </div>
            </div>
            <button onClick={() => setActiveId(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(30,27,46,0.4)', cursor: 'pointer', fontSize: '0.85rem' }}>✕ Fermer</button>
          </div>

          {/* Stepper visuel */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[[1, '🎯 Prépare-toi'], [2, '⏱️ Compose'], [3, '✅ Corrige-toi']].map(([n, label]) => (
              <div key={n as number} style={{
                flex: 1, textAlign: 'center' as const, padding: '0.5rem', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 700,
                background: step === n ? ORANGE : step > (n as number) ? 'rgba(22,160,133,0.15)' : 'rgba(30,27,46,0.06)',
                color: step === n ? '#fff' : step > (n as number) ? '#16A085' : 'rgba(30,27,46,0.4)',
              }}>{label as string}</div>
            ))}
          </div>

          {/* ÉTAPE 1 — Prépare-toi */}
          {step === 1 && (
            <div>
              <h4 style={{ color: DARK, fontSize: '0.92rem', fontWeight: 700, margin: '0 0 0.75rem' }}>📋 Checklist avant de composer</h4>
              <ul style={{ margin: '0 0 1.25rem', paddingLeft: '1.2rem', color: 'rgba(30,27,46,0.7)', fontSize: '0.85rem', lineHeight: 1.9 }}>
                <li>Feuilles de brouillon + stylo, dans un endroit calme</li>
                <li>Téléphone loin de toi, notifications coupées</li>
                <li>Chrono réglé sur la durée officielle : {Math.floor(activeEpreuve.dureeMin / 60)}h{activeEpreuve.dureeMin % 60 ? activeEpreuve.dureeMin % 60 : ''}</li>
                <li>Le sujet PDF réel, prêt à être ouvert</li>
              </ul>
              <h4 style={{ color: DARK, fontSize: '0.92rem', fontWeight: 700, margin: '0 0 0.75rem' }}>💡 Conseils méthodo — {activeEpreuve.matiere}</h4>
              <div style={{ background: BG_SOFT, borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                {getMethodTips(activeEpreuve.matiere).map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: i < 3 ? '0.6rem' : 0, fontSize: '0.84rem', color: 'rgba(30,27,46,0.75)', lineHeight: 1.6 }}>
                    <span>✔️</span><span>{t}</span>
                  </div>
                ))}
              </div>
              <button onClick={startTimer} style={{ background: ORANGE, color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem 1.4rem', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
                🚀 Je suis prêt·e — Lancer le chrono
              </button>
            </div>
          )}

          {/* ÉTAPE 2 — Compose */}
          {step === 2 && (
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: ORANGE, fontVariantNumeric: 'tabular-nums' as const, letterSpacing: '0.02em' }}>
                {formatTime(secondsLeft)}
              </div>
              <div style={{ color: 'rgba(30,27,46,0.5)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                {timerRunning ? 'Composition en cours — reste concentré·e !' : 'Chrono en pause'}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' as const }}>
                <a href={activeEpreuve.epreuveUrl} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#fff', color: ORANGE, border: `1.5px solid ${ORANGE}`, borderRadius: '10px', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', fontFamily: "'Syne', sans-serif" }}>
                  📄 Ouvrir le sujet officiel (PDF)
                </a>
                <button onClick={() => setTimerRunning(!timerRunning)}
                  style={{ background: 'rgba(30,27,46,0.06)', color: DARK, border: 'none', borderRadius: '10px', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
                  {timerRunning ? '⏸ Pause' : '▶ Reprendre'}
                </button>
                <button onClick={finishComposition}
                  style={{ background: '#16A085', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
                  ✅ J&apos;ai terminé ma composition
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — Corrige-toi */}
          {step === 3 && (
            <div>
              {activeEpreuve.corrigeUrl ? (
                <div style={{ background: 'rgba(22,160,133,0.08)', border: '1px solid rgba(22,160,133,0.3)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ color: '#16A085', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    📗 {activeEpreuve.corrigeType ?? 'Corrigé officiel'} disponible
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' as const }}>
                    <a href={activeEpreuve.corrigeUrl} target="_blank" rel="noopener noreferrer"
                      style={{ background: '#16A085', color: '#fff', borderRadius: '8px', padding: '0.55rem 1rem', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', fontFamily: "'Syne', sans-serif" }}>
                      Ouvrir le corrigé →
                    </a>
                    {activeEpreuve.corrigeUrl2 && (
                      <a href={activeEpreuve.corrigeUrl2} target="_blank" rel="noopener noreferrer"
                        style={{ background: 'transparent', color: '#16A085', border: '1px solid #16A085', borderRadius: '8px', padding: '0.55rem 1rem', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', fontFamily: "'Syne', sans-serif" }}>
                        2ᵉ document de correction →
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(176,137,0,0.08)', border: '1px solid rgba(176,137,0,0.3)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.25rem', color: '#8A6D00', fontSize: '0.84rem' }}>
                  📙 Le corrigé de cette épreuve n&apos;a pas encore été publié par l&apos;Office du Bac. Auto-évalue ta copie avec le programme officiel de la matière (onglet 📖 Cours &amp; Résumés).
                </div>
              )}

              <h4 style={{ color: DARK, fontSize: '0.92rem', fontWeight: 700, margin: '0 0 0.5rem' }}>🎯 Auto-évaluation</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'rgba(30,27,46,0.6)' }}>Ma note estimée : <strong style={{ color: ORANGE }}>{note}/20</strong></label>
                <input type="range" min={0} max={20} value={note} onChange={ev => setNote(Number(ev.target.value))} style={{ width: '100%', marginTop: '0.4rem', accentColor: ORANGE }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'rgba(30,27,46,0.55)', fontWeight: 600 }}>Ce que j&apos;ai bien réussi</label>
                  <textarea value={bienReussi} onChange={ev => setBienReussi(ev.target.value)} rows={3}
                    style={{ width: '100%', marginTop: '0.35rem', borderRadius: '8px', border: '1px solid rgba(30,27,46,0.15)', padding: '0.6rem', fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', resize: 'vertical' as const }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'rgba(30,27,46,0.55)', fontWeight: 600 }}>Ce qu&apos;il faut retravailler</label>
                  <textarea value={aRevoir} onChange={ev => setARevoir(ev.target.value)} rows={3}
                    style={{ width: '100%', marginTop: '0.35rem', borderRadius: '8px', border: '1px solid rgba(30,27,46,0.15)', padding: '0.6rem', fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', resize: 'vertical' as const }} />
                </div>
              </div>

              {!justValidated ? (
                <button onClick={validerEntrainement} style={{ background: ORANGE, color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem 1.4rem', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Syne', sans-serif" }}>
                  🏁 Valider mon entraînement {activeEpreuve.corrigeUrl ? '(+40 XP)' : '(+25 XP)'}
                </button>
              ) : (
                <div style={{ background: 'rgba(232,101,26,0.1)', borderRadius: '10px', padding: '1rem 1.25rem', color: ORANGE, fontWeight: 700, fontSize: '0.88rem' }}>
                  🎉 Bravo ! Épreuve enregistrée dans ta progression. Continue sur une autre matière pour garder ton streak 🔥
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Badges de série ────────────────────────────────────────────── */}
      {serieBadges.length > 0 && (
        <div style={sectionStyle}>
          <h3 style={{ color: ORANGE, fontWeight: 800, fontSize: '1rem', margin: '0 0 1rem' }}>🏅 Badges de série</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {serieBadges.map(b => {
              const complete = b.done === b.total
              return (
                <div key={b.serie} style={{
                  background: complete ? 'rgba(232,101,26,0.1)' : BG_SOFT, borderRadius: '10px', padding: '0.85rem 1rem',
                  border: `1px solid ${complete ? ORANGE : 'rgba(30,27,46,0.08)'}`, textAlign: 'center' as const,
                }}>
                  <div style={{ fontSize: '1.3rem' }}>{complete ? '🏅' : '⬜'}</div>
                  <div style={{ color: complete ? ORANGE : DARK, fontWeight: 700, fontSize: '0.82rem', marginTop: '0.25rem' }}>Série {b.serie}</div>
                  <div style={{ color: 'rgba(30,27,46,0.45)', fontSize: '0.72rem' }}>{b.done}/{b.total} épreuves</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Documents complémentaires ──────────────────────────────────── */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowDocs(!showDocs)}>
          <h3 style={{ color: DARK, fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>📎 Documents complémentaires (corrigés isolés)</h3>
          <span style={{ color: 'rgba(30,27,46,0.4)', fontSize: '0.8rem' }}>{showDocs ? '▲' : '▼'}</span>
        </div>
        {showDocs && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
            {DOCUMENTS_COMPLEMENTAIRES.map(d => (
              <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer" style={{ color: ORANGE, fontSize: '0.82rem', textDecoration: 'none' }}>
                📄 {d.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <p style={{ color: 'rgba(30,27,46,0.35)', fontSize: '0.74rem', textAlign: 'center' as const, marginTop: '0.5rem' }}>
        Sujets et corrigés publiés par l&apos;{SOURCE_OFFICIELLE.nom} — {' '}
        <a href={SOURCE_OFFICIELLE.urlEpreuves} target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>épreuves</a>
        {' · '}
        <a href={SOURCE_OFFICIELLE.urlCorriges} target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>corrigés</a>
      </p>
    </div>
  )
}
