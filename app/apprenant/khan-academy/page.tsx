'use client'

/**
 * ETAGIA LMS — Khan Academy Apprenant
 * Modules de formation en ligne, 100% en français
 * Avec suivi de progression localStorage → KPI dashboard
 */

import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  KA_MODULES,
  KA_DOMAINS,
  getDomainWithCount,
  searchModules,
  LEVEL_COLORS,
  KIND_ICONS,
  type KAModule,
  type KALevel,
  type KAKind,
} from '@/lib/khan-academy-catalog'

/* ─── Progression localStorage ──────────────────────────────────────────── */
const STORAGE_KEY = 'etagia_ka_progress'

interface KAProgress {
  openedAt: string    // ISO date
  domain: string
  kind: string
  durationMin: number
}

function loadProgress(): Record<string, KAProgress> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') } catch { return {} }
}

function saveProgress(moduleId: string, module: KAModule) {
  if (typeof window === 'undefined') return
  const prog = loadProgress()
  if (!prog[moduleId]) {
    prog[moduleId] = {
      openedAt:   new Date().toISOString(),
      domain:     module.domain,
      kind:       module.kind,
      durationMin: parseInt(module.duration ?? '0') || 0,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prog))
    window.dispatchEvent(new Event('ka-progress-update'))
  }
}

/* ─── Modal lecteur / lancement ─────────────────────────────────────────── */
function ModuleModal({
  module,
  onClose,
}: {
  module: KAModule
  onClose: () => void
}) {
  const domain = KA_DOMAINS.find(d => d.id === module.domain)

  const handleOpen = useCallback(() => {
    saveProgress(module.id, module)
    window.open(module.kaUrl, '_blank', 'noopener,noreferrer')
  }, [module])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header coloré */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1BAA8E] to-blue-500" />

        <div className="p-6">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{domain?.icon}</span>
            <span className="text-xs text-slate-400 font-medium">{domain?.label}</span>
            <span className="text-slate-600">·</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${LEVEL_COLORS[module.level]}`}>
              {module.level}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              {KIND_ICONS[module.kind]} {module.kind === 'course' ? 'Parcours' : 'Vidéo'}
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-xl font-bold text-white mb-2 leading-tight">{module.title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">{module.description}</p>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-6">
            {module.tags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-white/5 text-slate-400 rounded-full border border-white/10">
                {tag}
              </span>
            ))}
          </div>

          {/* Zone contenu */}
          {module.youtubeId ? (
            /* Vidéo YouTube — embed direct */
            <div className="rounded-xl overflow-hidden mb-6 bg-black" style={{ paddingBottom: '56.25%', position: 'relative', height: 0 }}>
              <iframe
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                src={`https://www.youtube-nocookie.com/embed/${module.youtubeId}?hl=fr&cc_lang_pref=fr&cc_load_policy=1&rel=0&autoplay=1`}
                title={module.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onPlay={() => saveProgress(module.id, module)}
              />
            </div>
          ) : (
            /* Parcours KA — lancement externe (cookies bloqués dans iframe) */
            <div className="rounded-xl bg-gradient-to-br from-[#1BAA8E]/10 to-blue-900/10 border border-[#1BAA8E]/20 p-6 mb-6 text-center">
              <div className="text-4xl mb-3">🎓</div>
              <p className="text-sm text-slate-300 mb-1">Ce parcours interactif s&apos;ouvre sur Khan Academy</p>
              <p className="text-xs text-slate-500 mb-4">Contenu en français · {module.duration && `Durée estimée : ${module.duration}`}</p>
              <button
                onClick={handleOpen}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1BAA8E] hover:bg-[#17967d] text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-[#1BAA8E]/30 hover:-translate-y-0.5"
              >
                Commencer le parcours <span className="text-base">↗</span>
              </button>
              <p className="text-xs text-slate-600 mt-3">S&apos;ouvre dans un nouvel onglet · Progression sauvegardée</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {module.duration && <span>⏱ {module.duration}</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/10 rounded-lg transition-colors"
              >
                Fermer
              </button>
              {!module.youtubeId && (
                <button
                  onClick={handleOpen}
                  className="px-4 py-2 text-sm bg-[#1BAA8E] hover:bg-[#17967d] text-white rounded-lg transition-colors"
                >
                  Ouvrir sur KA ↗
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Carte module ───────────────────────────────────────────────────────── */
function ModuleCard({
  module,
  isOpened,
  onClick,
}: {
  module: KAModule
  isOpened: boolean
  onClick: () => void
}) {
  const domain = KA_DOMAINS.find(d => d.id === module.domain)

  return (
    <button
      onClick={onClick}
      className={`group text-left w-full border rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 relative ${
        isOpened
          ? 'bg-[#1BAA8E]/5 border-[#1BAA8E]/30 hover:border-[#1BAA8E]/50'
          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20'
      }`}
    >
      {/* Badge "Consulté" */}
      {isOpened && (
        <div className="absolute top-3 right-3 text-xs px-1.5 py-0.5 bg-[#1BAA8E]/20 text-[#1BAA8E] rounded-full border border-[#1BAA8E]/30">
          ✓ Vu
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">
          {domain?.icon} {domain?.label.split('&')[0].split('—')[0].trim()}
        </span>
        <span className="text-xs text-slate-500">
          {KIND_ICONS[module.kind]}
          {module.kind === 'course' ? ' Parcours' : ' Vidéo'}
        </span>
      </div>

      <h3 className={`font-semibold text-sm leading-snug mb-2 line-clamp-2 transition-colors ${
        isOpened ? 'text-[#1BAA8E]' : 'text-white group-hover:text-[#1BAA8E]'
      }`}>
        {module.title}
      </h3>

      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
        {module.description}
      </p>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${LEVEL_COLORS[module.level]}`}>
          {module.level}
        </span>
        {module.duration && (
          <span className="text-xs text-slate-500">⏱ {module.duration}</span>
        )}
      </div>
    </button>
  )
}

/* ─── Page principale ────────────────────────────────────────────────────── */
export default function KhanAcademyApprenantPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel]   = useState<KALevel | null>(null)
  const [selectedKind, setSelectedKind]     = useState<KAKind | null>(null)
  const [search, setSearch]                 = useState('')
  const [activeModule, setActiveModule]     = useState<KAModule | null>(null)
  const [viewMode, setViewMode]             = useState<'grid' | 'list'>('grid')
  const [progress, setProgress]             = useState<Record<string, KAProgress>>({})

  /* Charger progression */
  useEffect(() => {
    setProgress(loadProgress())
    const handler = () => setProgress(loadProgress())
    window.addEventListener('ka-progress-update', handler)
    return () => window.removeEventListener('ka-progress-update', handler)
  }, [])

  const domainsWithCount = useMemo(() => getDomainWithCount(), [])
  const openedCount      = Object.keys(progress).length

  const filtered = useMemo(() => {
    let modules = search.trim() ? searchModules(search) : KA_MODULES
    if (selectedDomain) modules = modules.filter(m => m.domain === selectedDomain)
    if (selectedLevel)  modules = modules.filter(m => m.level  === selectedLevel)
    if (selectedKind)   modules = modules.filter(m => m.kind   === selectedKind)
    return modules
  }, [search, selectedDomain, selectedLevel, selectedKind])

  const resetFilters = useCallback(() => {
    setSelectedDomain(null)
    setSelectedLevel(null)
    setSelectedKind(null)
    setSearch('')
  }, [])

  const hasActiveFilters = selectedDomain || selectedLevel || selectedKind || search.trim()

  const handleOpen = useCallback((m: KAModule) => {
    setActiveModule(m)
    /* Pour les vidéos YT, on marque immédiatement à l'ouverture de la modal */
    if (m.youtubeId) saveProgress(m.id, m)
  }, [])

  /* Stats */
  const stats = [
    { label: 'Modules',    value: KA_MODULES.length,   color: '#1BAA8E' },
    { label: 'Consultés',  value: openedCount,          color: '#6C29FF' },
    { label: 'Domaines',   value: KA_DOMAINS.length,    color: '#F0B429' },
    { label: 'Progression',value: `${Math.round(openedCount / KA_MODULES.length * 100)}%`, color: '#D63384' },
  ]

  return (
    <div className="min-h-screen bg-[#060d1a] text-white">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1BAA8E]/10 via-transparent to-violet-900/10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BAA8E] to-violet-500 flex items-center justify-center text-xl shadow-lg shadow-[#1BAA8E]/20">
                  🎓
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">ETAGIA × Khan Academy</p>
                  <h1 className="text-xl font-bold text-white">Formation en ligne — Français</h1>
                </div>
              </div>
              <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
                <strong className="text-white">{KA_MODULES.length} modules de formation</strong> en français sélectionnés parmi les meilleurs contenus Khan Academy —
                informatique, finance, entrepreneuriat, sciences.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 flex-wrap">
              {stats.map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center min-w-[70px]">
                  <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Barre de progression globale */}
          {openedCount > 0 && (
            <div className="mt-5 max-w-md">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">Progression globale</span>
                <span className="text-xs text-[#1BAA8E] font-semibold">{openedCount} / {KA_MODULES.length} modules</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1BAA8E] to-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${(openedCount / KA_MODULES.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Filtres ── */}
        <div className="flex flex-col gap-4 mb-8">

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-lg">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un module de formation..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1BAA8E]/50 transition-all"
              />
            </div>
            <div className="flex border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-2.5 text-sm transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>⊞</button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-2.5 text-sm transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>☰</button>
            </div>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="px-3 py-2.5 text-xs text-slate-400 hover:text-white border border-white/10 rounded-xl transition-colors">
                Réinitialiser
              </button>
            )}
          </div>

          {/* Domaines */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedDomain(null)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${!selectedDomain ? 'bg-[#1BAA8E]/20 border-[#1BAA8E]/40 text-[#1BAA8E]' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
            >
              Tous ({KA_MODULES.length})
            </button>
            {domainsWithCount.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(selectedDomain === d.id ? null : d.id)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${selectedDomain === d.id ? 'bg-[#1BAA8E]/20 border-[#1BAA8E]/40 text-[#1BAA8E]' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'}`}
              >
                {d.icon} {d.label.split('&')[0].split('—')[0].trim()} ({d.count})
              </button>
            ))}
          </div>

          {/* Niveau + Type */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 mr-1">Niveau :</span>
              {(['débutant', 'intermédiaire', 'avancé'] as KALevel[]).map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLevel(selectedLevel === l ? null : l)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all capitalize ${selectedLevel === l ? LEVEL_COLORS[l] : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 mr-1">Type :</span>
              {([{ value: 'video' as KAKind, label: '▶ Vidéo' }, { value: 'course' as KAKind, label: '📚 Parcours' }]).map(k => (
                <button
                  key={k.value}
                  onClick={() => setSelectedKind(selectedKind === k.value ? null : k.value)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${selectedKind === k.value ? 'bg-white/10 border-white/30 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Résultats ── */}
        <div className="mb-4">
          <p className="text-sm text-slate-400">
            {filtered.length} module{filtered.length > 1 ? 's' : ''}
            {hasActiveFilters && <span className="text-slate-500"> (filtré{filtered.length > 1 ? 's' : ''})</span>}
            {openedCount > 0 && <span className="ml-2 text-[#1BAA8E] font-medium">· {openedCount} consulté{openedCount > 1 ? 's' : ''}</span>}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>Aucun module trouvé.</p>
            <button onClick={resetFilters} className="mt-4 text-[#1BAA8E] hover:underline text-sm">Réinitialiser</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(m => (
              <ModuleCard
                key={m.id}
                module={m}
                isOpened={!!progress[m.id]}
                onClick={() => handleOpen(m)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(m => {
              const domain = KA_DOMAINS.find(d => d.id === m.domain)
              const isOpened = !!progress[m.id]
              return (
                <button
                  key={m.id}
                  onClick={() => handleOpen(m)}
                  className={`group w-full text-left flex items-center gap-4 border rounded-xl px-5 py-4 transition-all ${
                    isOpened
                      ? 'bg-[#1BAA8E]/5 border-[#1BAA8E]/30 hover:border-[#1BAA8E]/50'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                    {domain?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-sm font-medium truncate transition-colors ${isOpened ? 'text-[#1BAA8E]' : 'text-white group-hover:text-[#1BAA8E]'}`}>
                        {m.title}
                      </h3>
                      <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full border ${LEVEL_COLORS[m.level]}`}>{m.level}</span>
                      {isOpened && <span className="shrink-0 text-xs text-[#1BAA8E]">✓</span>}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{m.description}</p>
                  </div>
                  <div className="shrink-0 text-xs text-slate-500">
                    {m.duration && <span>⏱ {m.duration}</span>}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-slate-600">
            Contenus fournis par{' '}
            <a href="https://fr.khanacademy.org" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
              Khan Academy Français
            </a>{' '}
            · Plateforme éducative gratuite · Tous droits réservés Khan Academy
          </p>
        </div>
      </div>

      {/* ── Modal ── */}
      {activeModule && (
        <ModuleModal module={activeModule} onClose={() => setActiveModule(null)} />
      )}
    </div>
  )
}
