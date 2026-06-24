'use client'

/**
 * ETAGIA LMS — Bibliothèque de formation Khan Academy
 * Design système chaud : Or · Orange · Turquoise · Fond crème
 * Contenu 100% français — fr.khanacademy.org
 */

import { useState, useMemo, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  KA_MODULES, KA_DOMAINS, getDomainWithCount,
  type KAModule, type KADomain, type KALevel, type KAKind,
  LEVEL_META, KIND_META,
} from '@/lib/khan-academy-catalog'

/* ── Progression localStorage ─────────────────────────────────────────────── */
const STORAGE_KEY = 'etagia_ka_progress'
interface KAProgress { openedAt: string; domain: string; kind: string; durationMin: number }

function loadProgress(): Record<string, KAProgress> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') } catch { return {} }
}

function saveProgress(moduleId: string, module: KAModule) {
  if (typeof window === 'undefined') return
  const prog = loadProgress()
  if (!prog[moduleId]) {
    prog[moduleId] = {
      openedAt: new Date().toISOString(),
      domain: module.domain,
      kind: module.kind,
      durationMin: parseInt(module.duration ?? '0') || 0,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prog))
    window.dispatchEvent(new Event('ka-progress-update'))
  }
}

/* ── Couleurs domaines ────────────────────────────────────────────────────── */
function getDomainMeta(domainId: string) {
  return KA_DOMAINS.find(d => d.id === domainId) ?? {
    color: '#F4B01E', colorLight: '#FFF7E2', label: domainId, icon: '📖',
  }
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function KAPage() {
  const [progress, setProgress]   = useState<Record<string, KAProgress>>({})
  const [domain, setDomain]       = useState<string>('all')
  const [level, setLevel]         = useState<KALevel | 'all'>('all')
  const [kind, setKind]           = useState<KAKind | 'all'>('all')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<KAModule | null>(null)

  useEffect(() => {
    setProgress(loadProgress())
    const h = () => setProgress(loadProgress())
    window.addEventListener('ka-progress-update', h)
    return () => window.removeEventListener('ka-progress-update', h)
  }, [])

  const domains = getDomainWithCount()
  const viewed  = Object.keys(progress).length
  const total   = KA_MODULES.length
  const pct     = Math.round((viewed / total) * 100)

  const filtered = useMemo(() => {
    let mods = KA_MODULES
    if (domain !== 'all') mods = mods.filter(m => m.domain === domain)
    if (level  !== 'all') mods = mods.filter(m => m.level  === level)
    if (kind   !== 'all') mods = mods.filter(m => m.kind   === kind)
    if (search.trim()) {
      const q = search.toLowerCase()
      mods = mods.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return mods
  }, [domain, level, kind, search])

  function openModule(mod: KAModule) {
    setSelected(mod)
  }

  function launchExternal(mod: KAModule) {
    saveProgress(mod.id, mod)
    setProgress(loadProgress())
    window.open(mod.kaUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF6EE' }}>
      <Sidebar role="apprenant" />

      <main style={{ marginLeft: '220px', flex: 1, padding: '0', fontFamily: "'Hanken Grotesk', sans-serif" }}>

        {/* ── Hero ── */}
        <div style={{
          background: 'linear-gradient(135deg,#2A2118 0%,#3D2F1E 60%,#4A3728 100%)',
          padding: '2.5rem 2.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Décors */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(244,176,30,.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: '40%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(251,101,20,.06)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', maxWidth: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F4B01E' }}>Bibliothèque de formation</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#F4B01E', display: 'inline-block', opacity: 0.5 }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: '#AB9E8C', letterSpacing: '0.05em' }}>fr.khanacademy.org · 100% français</span>
            </div>

            <h1 style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 700,
              color: '#FAF6EE',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: 10,
            }}>
              Khan Academy — Formations gratuites
            </h1>
            <p style={{ color: '#AB9E8C', fontSize: 14, maxWidth: 540, lineHeight: 1.6 }}>
              {total} modules soigneusement sélectionnés · 6 domaines professionnels · Contenu validé en français
            </p>

            {/* KPI strip */}
            <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
              {[
                { value: total,    label: 'Modules',   color: '#F4B01E' },
                { value: viewed,   label: 'Consultés', color: '#0FB6CC' },
                { value: pct+'%', label: 'Progression', color: '#FB6514' },
                { value: 6,        label: 'Domaines',  color: '#C28705' },
              ].map(k => (
                <div key={k.label}>
                  <div style={{ fontSize: 'clamp(1.4rem,2vw,1.8rem)', fontWeight: 800, color: k.color, lineHeight: 1, fontFamily: "'Unbounded', sans-serif" }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: '#6E6155', marginTop: 3 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Barre de progression */}
            <div style={{ marginTop: 20, maxWidth: 400 }}>
              <div style={{ height: 5, background: 'rgba(255,255,255,.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#F4B01E,#FB6514)', borderRadius: 3, transition: 'width .5s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Corps ── */}
        <div style={{ padding: '0 2rem 3rem', maxWidth: 1200, margin: '0 auto' }}>

          {/* Domaines — cards horizontales scrollables */}
          <div style={{ marginTop: '-2.5rem', marginBottom: '2rem' }}>
            <div style={{
              display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4,
              scrollbarWidth: 'none',
            }}>
              <button
                onClick={() => setDomain('all')}
                style={{
                  flexShrink: 0,
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  background: domain === 'all' ? 'linear-gradient(125deg,#F6B829 0%,#F0894A 52%,#DD5E3A 100%)' : '#FFFFFF',
                  color: domain === 'all' ? '#FFFFFF' : '#6E6155',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  boxShadow: '0 4px 16px rgba(74,48,28,.12)',
                  transition: 'all .2s',
                }}
              >
                Tous ({total})
              </button>

              {domains.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  style={{
                    flexShrink: 0,
                    padding: '12px 18px',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    background: domain === d.id ? d.color : '#FFFFFF',
                    color: domain === d.id ? '#FFFFFF' : '#2A2118',
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontWeight: domain === d.id ? 700 : 500,
                    fontSize: 13,
                    boxShadow: '0 4px 16px rgba(74,48,28,.10)',
                    transition: 'all .2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>{d.icon}</span>
                  <span style={{ whiteSpace: 'nowrap' }}>{d.label}</span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    background: domain === d.id ? 'rgba(255,255,255,.25)' : d.colorLight,
                    color: domain === d.id ? '#FFFFFF' : d.color,
                    padding: '2px 7px',
                    borderRadius: 20,
                  }}>{d.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtres + recherche */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(42,33,24,.09)',
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 24,
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
            boxShadow: '0 2px 8px rgba(74,48,28,.06)',
          }}>
            {/* Recherche */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px', background: '#FAF6EE', border: '1px solid rgba(42,33,24,.12)', borderRadius: 10, padding: '8px 14px' }}>
              <span style={{ color: '#AB9E8C', fontSize: 15 }}>🔍</span>
              <input
                placeholder="Rechercher un module..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: 13, color: '#2A2118', fontFamily: "'Hanken Grotesk', sans-serif" }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#AB9E8C', fontSize: 12 }}>✕</button>
              )}
            </div>

            {/* Niveau */}
            <select
              value={level}
              onChange={e => setLevel(e.target.value as any)}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(42,33,24,.12)', background: '#FAF6EE', color: '#2A2118', fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">Tous niveaux</option>
              <option value="débutant">Débutant</option>
              <option value="intermédiaire">Intermédiaire</option>
              <option value="avancé">Avancé</option>
            </select>

            {/* Type */}
            <select
              value={kind}
              onChange={e => setKind(e.target.value as any)}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(42,33,24,.12)', background: '#FAF6EE', color: '#2A2118', fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">Tous types</option>
              <option value="video">▶ Vidéo</option>
              <option value="course">📚 Parcours</option>
              <option value="exercise">✏️ Exercice</option>
            </select>

            <div style={{ marginLeft: 'auto', fontSize: 12, color: '#AB9E8C', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Grille de modules */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#AB9E8C' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Aucun module trouvé</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Essayez d'autres filtres ou mots-clés</div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
              gap: 16,
            }}>
              {filtered.map(mod => (
                <ModuleCard
                  key={mod.id}
                  mod={mod}
                  done={!!progress[mod.id]}
                  onClick={() => openModule(mod)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Modal ── */}
      {selected && (
        <ModuleModal
          mod={selected}
          done={!!progress[selected.id]}
          onClose={() => setSelected(null)}
          onLaunch={() => { launchExternal(selected); setSelected(null) }}
        />
      )}
    </div>
  )
}

/* ── ModuleCard ───────────────────────────────────────────────────────────── */
function ModuleCard({ mod, done, onClick }: { mod: KAModule; done: boolean; onClick: () => void }) {
  const dm = getDomainMeta(mod.domain)
  const lm = LEVEL_META[mod.level]
  const km = KIND_META[mod.kind]

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        border: `1px solid ${done ? dm.color + '44' : 'rgba(42,33,24,.09)'}`,
        borderRadius: 14,
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all .2s',
        boxShadow: done ? `0 0 0 2px ${dm.color}22, 0 4px 16px rgba(74,48,28,.08)` : '0 2px 8px rgba(74,48,28,.06)',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px rgba(74,48,28,.14)` }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = done ? `0 0 0 2px ${dm.color}22, 0 4px 16px rgba(74,48,28,.08)` : '0 2px 8px rgba(74,48,28,.06)' }}
    >
      {/* Bande couleur domaine */}
      <div style={{ height: 5, background: dm.color, width: '100%' }} />

      <div style={{ padding: '16px 18px' }}>
        {/* En-tête row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {/* Type badge */}
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: dm.colorLight, color: dm.color, letterSpacing: '0.04em' }}>
              {km.icon} {km.label}
            </span>
            {/* Niveau badge */}
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: lm.bg, color: lm.color, letterSpacing: '0.04em' }}>
              {lm.label}
            </span>
          </div>

          {done && (
            <span style={{ fontSize: 11, fontWeight: 700, color: '#12A596', background: '#E6FBF8', padding: '3px 8px', borderRadius: 20, flexShrink: 0 }}>
              ✓ Vu
            </span>
          )}
        </div>

        {/* Titre */}
        <h3 style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 15,
          fontWeight: 700,
          color: '#2A2118',
          lineHeight: 1.35,
          marginBottom: 8,
          letterSpacing: '-0.01em',
        }}>
          {mod.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: 12.5, color: '#6E6155', lineHeight: 1.55, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {mod.description}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {mod.tags.slice(0, 2).map(t => (
              <span key={t} style={{ fontSize: 10, color: '#AB9E8C', background: '#FAF6EE', padding: '2px 7px', borderRadius: 20, border: '1px solid rgba(42,33,24,.08)' }}>
                {t}
              </span>
            ))}
          </div>
          {mod.duration && (
            <span style={{ fontSize: 11, color: '#AB9E8C', fontWeight: 600, flexShrink: 0 }}>
              ⏱ {mod.duration}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

/* ── ModuleModal ──────────────────────────────────────────────────────────── */
function ModuleModal({ mod, done, onClose, onLaunch }: {
  mod: KAModule; done: boolean; onClose: () => void; onLaunch: () => void
}) {
  const dm = getDomainMeta(mod.domain)
  const lm = LEVEL_META[mod.level]
  const km = KIND_META[mod.kind]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(42,33,24,.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          maxWidth: 580,
          width: '100%',
          boxShadow: '0 24px 80px rgba(42,33,24,.30)',
          overflow: 'hidden',
        }}
      >
        {/* Bande couleur */}
        <div style={{ height: 6, background: dm.color }} />

        {/* Embed YouTube si disponible */}
        {mod.youtubeId && (
          <div style={{ position: 'relative', paddingBottom: '52%', background: '#2A2118' }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${mod.youtubeId}?rel=0&modestbranding=1`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={mod.title}
            />
          </div>
        )}

        <div style={{ padding: '22px 24px 24px' }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20, background: dm.colorLight, color: dm.color, letterSpacing: '0.06em' }}>
              {dm.icon} {KA_DOMAINS.find(d => d.id === mod.domain)?.label ?? mod.domain}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: lm.bg, color: lm.color }}>
              {lm.label}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#FAF6EE', color: '#6E6155' }}>
              {km.icon} {km.label}
            </span>
            {mod.duration && (
              <span style={{ fontSize: 10, fontWeight: 600, color: '#AB9E8C' }}>⏱ {mod.duration}</span>
            )}
            {done && (
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#12A596', background: '#E6FBF8', padding: '3px 9px', borderRadius: 20 }}>✓ Déjà vu</span>
            )}
          </div>

          {/* Titre */}
          <h2 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 20,
            fontWeight: 700,
            color: '#2A2118',
            lineHeight: 1.25,
            marginBottom: 10,
            letterSpacing: '-0.02em',
          }}>
            {mod.title}
          </h2>

          {/* Description */}
          <p style={{ fontSize: 13.5, color: '#6E6155', lineHeight: 1.65, marginBottom: 16 }}>
            {mod.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {mod.tags.map(t => (
              <span key={t} style={{ fontSize: 11, color: '#6E6155', background: '#FAF6EE', border: '1px solid rgba(42,33,24,.10)', padding: '3px 9px', borderRadius: 20 }}>
                {t}
              </span>
            ))}
          </div>

          {/* Note si pas de vidéo YouTube */}
          {!mod.youtubeId && (
            <div style={{
              background: '#FFF7E2',
              border: '1px solid rgba(244,176,30,.30)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 16,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 12, color: '#6E6155', lineHeight: 1.5, margin: 0 }}>
                Ce module s'ouvre sur <strong>fr.khanacademy.org</strong> dans un nouvel onglet — contenu intégralement en français, gratuit et sans inscription obligatoire.
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onLaunch}
              style={{
                flex: 1,
                padding: '13px 20px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                background: `linear-gradient(125deg,${dm.color},${dm.color}CC)`,
                color: '#FFFFFF',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: `0 4px 16px ${dm.color}44`,
                transition: 'all .2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
            >
              {mod.youtubeId ? '▶ Regarder la vidéo' : '🚀 Accéder au module'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '13px 20px',
                borderRadius: 12,
                border: '1px solid rgba(42,33,24,.15)',
                cursor: 'pointer',
                background: '#FAF6EE',
                color: '#6E6155',
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
