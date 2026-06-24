'use client'

/**
 * ETAGIA LMS — Khan Academy Français
 * Modules de formation en ligne, 100% en français
 * Plugin standalone — aucune dépendance Kolibri
 */

import { useState, useMemo, useCallback } from 'react'
import {
  KA_MODULES,
  KA_DOMAINS,
  getDomainWithCount,
  searchModules,
  KIND_ICONS,
  type KAModule,
  type KALevel,
  type KAKind,
} from '@/lib/khan-academy-catalog'

/* Badges niveau — thème sombre (formateur) */
const LEVEL_COLORS: Record<KALevel, string> = {
  'débutant':      'bg-emerald-900/40 border-emerald-700/50 text-emerald-400',
  'intermédiaire': 'bg-amber-900/40   border-amber-700/50   text-amber-400',
  'avancé':        'bg-red-900/40     border-red-700/50     text-red-400',
}

/* ─── Modal lecteur ──────────────────────────────────────────────────────── */
function ModulePlayer({
  module,
  onClose,
}: {
  module: KAModule
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-white/10">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-slate-400">
                {KIND_ICONS[module.kind]}{' '}
                {module.kind === 'course' ? 'Parcours' : module.kind === 'video' ? 'Vidéo' : module.kind}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${LEVEL_COLORS[module.level]}`}>
                {module.level}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white">{module.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{module.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl leading-none shrink-0"
          >
            ×
          </button>
        </div>

        {/* Contenu */}
        {module.youtubeId ? (
          <div className="relative bg-black" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${module.youtubeId}?hl=fr&cc_lang_pref=fr&cc_load_policy=1&rel=0`}
              title={module.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="bg-[#0a0f1a]" style={{ height: '60vh' }}>
            <iframe
              className="w-full h-full"
              src={module.kaUrl}
              title={module.title}
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            {module.duration && (
              <span className="text-sm text-slate-400">⏱ {module.duration}</span>
            )}
            <div className="flex gap-1">
              {module.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-white/5 text-slate-400 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <a
            href={module.kaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm px-4 py-2 bg-[#1BAA8E] hover:bg-[#17967d] text-white rounded-lg transition-colors"
          >
            Ouvrir sur KA <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ─── Carte module ───────────────────────────────────────────────────────── */
function ModuleCard({
  module,
  onClick,
}: {
  module: KAModule
  onClick: () => void
}) {
  const domain = KA_DOMAINS.find(d => d.id === module.domain)

  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Domain badge + kind */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">
          {domain?.icon} {domain?.label.split('&')[0].split('—')[0].trim()}
        </span>
        <span className="text-xs text-slate-500">
          {KIND_ICONS[module.kind]}
          {module.kind === 'course' ? ' Parcours' : module.kind === 'video' ? ' Vidéo' : ' ' + module.kind}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:text-[#1BAA8E] transition-colors line-clamp-2">
        {module.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
        {module.description}
      </p>

      {/* Footer */}
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
export default function KhanAcademyPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel]   = useState<KALevel | null>(null)
  const [selectedKind, setSelectedKind]     = useState<KAKind | null>(null)
  const [search, setSearch]                 = useState('')
  const [activeModule, setActiveModule]     = useState<KAModule | null>(null)
  const [viewMode, setViewMode]             = useState<'grid' | 'list'>('grid')

  const domainsWithCount = useMemo(() => getDomainWithCount(), [])

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

  /* Stats */
  const stats = useMemo(() => ({
    total:   KA_MODULES.length,
    video:   KA_MODULES.filter(m => m.kind === 'video').length,
    course:  KA_MODULES.filter(m => m.kind === 'course').length,
    domains: KA_DOMAINS.length,
  }), [])

  return (
    <div className="min-h-screen bg-[#060d1a] text-white">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1BAA8E]/10 via-transparent to-blue-900/10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1BAA8E] to-blue-500 flex items-center justify-center text-xl">
                  🎓
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">ETAGIA × Khan Academy</p>
                  <h1 className="text-xl font-bold text-white">Formation en ligne — Français</h1>
                </div>
              </div>
              <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
                Accédez à <strong className="text-white">{stats.total} modules de formation</strong> en français,
                sélectionnés parmi les meilleurs contenus Khan Academy.
                Informatique, finance, entrepreneuriat, sciences — tout pour progresser professionnellement.
              </p>
            </div>

            {/* Stats pills */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: 'Modules', value: stats.total },
                { label: 'Vidéos', value: stats.video },
                { label: 'Parcours', value: stats.course },
                { label: 'Domaines', value: stats.domains },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                  <div className="text-2xl font-bold text-[#1BAA8E]">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Barre de filtres ── */}
        <div className="flex flex-col gap-4 mb-8">

          {/* Recherche + view toggle */}
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
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2.5 text-sm transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2.5 text-sm transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                ☰
              </button>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2.5 text-xs text-slate-400 hover:text-white border border-white/10 rounded-xl transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Domaines */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedDomain(null)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                !selectedDomain
                  ? 'bg-[#1BAA8E]/20 border-[#1BAA8E]/40 text-[#1BAA8E]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              Tous ({KA_MODULES.length})
            </button>
            {domainsWithCount.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(selectedDomain === d.id ? null : d.id)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                  selectedDomain === d.id
                    ? 'bg-[#1BAA8E]/20 border-[#1BAA8E]/40 text-[#1BAA8E]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
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
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all capitalize ${
                    selectedLevel === l
                      ? LEVEL_COLORS[l]
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 mr-1">Type :</span>
              {([
                { value: 'video' as KAKind, label: '▶ Vidéo' },
                { value: 'course' as KAKind, label: '📚 Parcours' },
              ]).map(k => (
                <button
                  key={k.value}
                  onClick={() => setSelectedKind(selectedKind === k.value ? null : k.value)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    selectedKind === k.value
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
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
            {filtered.length} module{filtered.length > 1 ? 's' : ''} de formation
            {hasActiveFilters && <span className="text-slate-500"> (filtré{filtered.length > 1 ? 's' : ''})</span>}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>Aucun module trouvé pour cette recherche.</p>
            <button onClick={resetFilters} className="mt-4 text-[#1BAA8E] hover:underline text-sm">
              Réinitialiser les filtres
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(m => (
              <ModuleCard key={m.id} module={m} onClick={() => setActiveModule(m)} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(m => {
              const domain = KA_DOMAINS.find(d => d.id === m.domain)
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m)}
                  className="group w-full text-left flex items-center gap-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-xl px-5 py-4 transition-all"
                >
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                    {domain?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-medium text-white group-hover:text-[#1BAA8E] transition-colors truncate">
                        {m.title}
                      </h3>
                      <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full border ${LEVEL_COLORS[m.level]}`}>
                        {m.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{m.description}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-3 text-xs text-slate-500">
                    {m.duration && <span>⏱ {m.duration}</span>}
                    <span className="text-[#1BAA8E] opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-slate-600">
            Contenus fournis par{' '}
            <a
              href="https://fr.khanacademy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
            >
              Khan Academy Français
            </a>{' '}
            — Plateforme éducative gratuite. Tous droits réservés à Khan Academy.
          </p>
        </div>
      </div>

      {/* ── Modal lecteur ── */}
      {activeModule && (
        <ModulePlayer module={activeModule} onClose={() => setActiveModule(null)} />
      )}
    </div>
  )
}
