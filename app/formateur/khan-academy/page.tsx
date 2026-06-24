'use client'

/**
 * ETAGIA LMS — Khan Academy · Vue Formateur
 * Design système chaud ETAGIA : or / orange / turquoise / crème
 * Imports corrigés : KIND_META + LEVEL_META (nouveaux exports catalogue)
 */

import { useState, useMemo, useCallback } from 'react'
import {
  KA_MODULES,
  KA_DOMAINS,
  getDomainWithCount,
  searchModules,
  KIND_META,
  LEVEL_META,
  type KAModule,
  type KALevel,
  type KAKind,
} from '@/lib/khan-academy-catalog'

/* ── Design tokens ETAGIA ──────────────────────────────────────────────────── */
const T = {
  canvas:   '#FAF6EE',
  ink:      '#2A2118',
  inkMuted: '#6E6155',
  inkLight: '#AB9E8C',
  gold:     '#F4B01E',
  goldDark: '#C28705',
  orange:   '#FB6514',
  turq:     '#0FB6CC',
  border:   'rgba(42,33,24,.10)',
  card:     '#FFFFFF',
  fontBody: "'Hanken Grotesk', sans-serif",
  fontDisp: "'Newsreader', Georgia, serif",
}

/* ── Modal lecteur ─────────────────────────────────────────────────────────── */
function ModuleModal({ module, onClose }: { module: KAModule; onClose: () => void }) {
  const domain = KA_DOMAINS.find(d => d.id === module.domain)
  const lm = LEVEL_META[module.level]
  const km = KIND_META[module.kind]
  const kaSearchUrl = `https://fr.khanacademy.org/search?page_search_query=${encodeURIComponent(module.title)}`

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(42,33,24,.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.card,
          borderRadius: '20px',
          maxWidth: '680px', width: '100%',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(42,33,24,.22)',
          border: `1px solid ${T.border}`,
        }}
      >
        {/* Bandeau domaine */}
        <div style={{
          height: '6px',
          background: `linear-gradient(90deg, ${domain?.color ?? T.gold}, ${T.orange})`,
        }} />

        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', color: domain?.color ?? T.gold, fontFamily: T.fontBody, fontWeight: 600 }}>
                  {domain?.icon} {domain?.label}
                </span>
                <span style={{
                  fontSize: '11px', fontFamily: T.fontBody, fontWeight: 700,
                  color: lm.color, background: lm.bg,
                  padding: '2px 8px', borderRadius: '20px',
                  border: `1px solid ${lm.color}33`,
                }}>
                  {lm.label}
                </span>
                <span style={{
                  fontSize: '11px', fontFamily: T.fontBody,
                  color: T.inkMuted, background: '#F5EEDF',
                  padding: '2px 8px', borderRadius: '20px',
                }}>
                  {km.icon} {km.label}
                </span>
              </div>
              <h2 style={{ fontFamily: T.fontDisp, fontSize: '1.25rem', fontWeight: 700, color: T.ink, lineHeight: 1.3, margin: 0 }}>
                {module.title}
              </h2>
              <p style={{ fontFamily: T.fontBody, fontSize: '13.5px', color: T.inkMuted, marginTop: '6px', lineHeight: 1.5 }}>
                {module.description}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#F5EEDF', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', color: T.inkMuted, flexShrink: 0,
              }}
            >×</button>
          </div>
        </div>

        {/* Contenu vidéo ou preview */}
        {module.youtubeId ? (
          <div style={{ position: 'relative', paddingBottom: '52%', background: '#000' }}>
            <iframe
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              src={`https://www.youtube-nocookie.com/embed/${module.youtubeId}?hl=fr&cc_lang_pref=fr&cc_load_policy=1&rel=0`}
              title={module.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg,#FFF7E2,#FFF1E8)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{domain?.icon}</div>
            <p style={{ fontFamily: T.fontBody, fontSize: '14px', color: T.inkMuted, maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
              Ce parcours interactif s'ouvre sur Khan Academy Français.<br />
              Cliquez sur le bouton ci-dessous pour y accéder directement.
            </p>
            {module.duration && (
              <div style={{ marginTop: '12px', fontFamily: T.fontBody, fontSize: '13px', color: T.goldDark, fontWeight: 600 }}>
                ⏱ Durée estimée : {module.duration}
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {module.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: '11px', fontFamily: T.fontBody,
                background: '#F5EEDF', color: T.inkMuted,
                padding: '3px 8px', borderRadius: '20px',
                border: `1px solid ${T.border}`,
              }}>
                #{tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={module.kaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: T.fontBody, fontWeight: 700, fontSize: '13px',
                color: T.inkMuted,
                padding: '8px 16px',
                borderRadius: '10px',
                border: `1px solid ${T.border}`,
                textDecoration: 'none',
                background: '#F5EEDF',
              }}
            >
              Voir le cours ↗
            </a>
            <a
              href={kaSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: T.fontBody, fontWeight: 700, fontSize: '13px',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                background: `linear-gradient(125deg,${T.gold},${T.orange})`,
                boxShadow: '0 2px 8px rgba(251,101,20,.25)',
              }}
            >
              🎓 Assigner aux apprenants
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Carte module ──────────────────────────────────────────────────────────── */
function ModuleCard({ module, onClick }: { module: KAModule; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const domain = KA_DOMAINS.find(d => d.id === module.domain)
  const lm = LEVEL_META[module.level]
  const km = KIND_META[module.kind]

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        textAlign: 'left', width: '100%',
        background: T.card,
        border: `1px solid ${hovered ? (domain?.color ?? T.gold) + '55' : T.border}`,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? `0 8px 28px rgba(42,33,24,.10)` : '0 1px 4px rgba(42,33,24,.05)',
      }}
    >
      {/* Bande couleur domaine */}
      <div style={{ height: '4px', background: domain?.color ?? T.gold, flexShrink: 0 }} />

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Domain + kind */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontFamily: T.fontBody, color: domain?.color ?? T.gold, fontWeight: 600 }}>
            {domain?.icon} {domain?.label.split('&')[0].trim()}
          </span>
          <span style={{ fontSize: '11px', fontFamily: T.fontBody, color: T.inkMuted }}>
            {km.icon} {km.label}
          </span>
        </div>

        {/* Titre */}
        <h3 style={{
          fontFamily: T.fontDisp, fontSize: '14.5px', fontWeight: 700,
          color: hovered ? (domain?.color ?? T.gold) : T.ink,
          lineHeight: 1.4, margin: 0, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          transition: 'color .15s',
        }}>
          {module.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: T.fontBody, fontSize: '12.5px', color: T.inkMuted,
          lineHeight: 1.5, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {module.description}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{
            fontSize: '11px', fontFamily: T.fontBody, fontWeight: 700,
            color: lm.color, background: lm.bg,
            padding: '2px 8px', borderRadius: '20px',
            border: `1px solid ${lm.color}33`,
          }}>
            {lm.label}
          </span>
          {module.duration && (
            <span style={{ fontSize: '11px', fontFamily: T.fontBody, color: T.inkLight }}>
              ⏱ {module.duration}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

/* ── Page principale ───────────────────────────────────────────────────────── */
export default function FormateurKhanAcademyPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel]   = useState<KALevel | null>(null)
  const [selectedKind, setSelectedKind]     = useState<KAKind | null>(null)
  const [search, setSearch]                 = useState('')
  const [activeModule, setActiveModule]     = useState<KAModule | null>(null)

  const domainsWithCount = useMemo(() => getDomainWithCount(), [])

  const filtered = useMemo(() => {
    let modules = search.trim() ? searchModules(search) : KA_MODULES
    if (selectedDomain) modules = modules.filter(m => m.domain === selectedDomain)
    if (selectedLevel)  modules = modules.filter(m => m.level  === selectedLevel)
    if (selectedKind)   modules = modules.filter(m => m.kind   === selectedKind)
    return modules
  }, [search, selectedDomain, selectedLevel, selectedKind])

  const resetFilters = useCallback(() => {
    setSelectedDomain(null); setSelectedLevel(null)
    setSelectedKind(null); setSearch('')
  }, [])

  const hasFilters = Boolean(selectedDomain || selectedLevel || selectedKind || search.trim())

  const stats = useMemo(() => ({
    total:   KA_MODULES.length,
    videos:  KA_MODULES.filter(m => m.kind === 'video').length,
    cours:   KA_MODULES.filter(m => m.kind === 'course').length,
    domains: KA_DOMAINS.length,
  }), [])

  return (
    <div style={{ minHeight: '100vh', background: T.canvas, fontFamily: T.fontBody }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg,#FFF7E2 0%,#FFF1E8 60%,#FAF6EE 100%)',
        borderBottom: `1px solid ${T.border}`,
        padding: '2.5rem 2rem 2rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                  background: `linear-gradient(125deg,${T.gold},${T.orange})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', boxShadow: '0 4px 14px rgba(244,176,30,.30)',
                }}>🎓</div>
                <div>
                  <p style={{ fontFamily: T.fontBody, fontSize: '11px', color: T.inkLight, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                    ETAGIA × KHAN ACADEMY — FORMATEUR
                  </p>
                  <h1 style={{ fontFamily: T.fontDisp, fontSize: '1.5rem', fontWeight: 700, color: T.ink, margin: 0, lineHeight: 1.2 }}>
                    Bibliothèque pédagogique française
                  </h1>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: T.inkMuted, maxWidth: '520px', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: T.ink }}>{stats.total} modules de formation</strong> en français,
                vérifiés et sélectionnés sur Khan Academy. Assignez-les à vos apprenants, 100% gratuit.
              </p>
            </div>

            {/* KPIs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'Modules', value: stats.total, color: T.gold },
                { label: 'Vidéos', value: stats.videos, color: T.turq },
                { label: 'Parcours', value: stats.cours, color: T.orange },
                { label: 'Domaines', value: stats.domains, color: T.goldDark },
              ].map(s => (
                <div key={s.label} style={{
                  background: T.card, border: `1px solid ${T.border}`,
                  borderRadius: '14px', padding: '12px 18px', textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(42,33,24,.05)',
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: T.fontDisp }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: T.inkMuted }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filtres ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 2rem 0' }}>

        {/* Recherche */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ flex: 1, maxWidth: '440px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un module de formation…"
              style={{
                width: '100%', paddingLeft: '36px', paddingRight: '12px',
                paddingTop: '10px', paddingBottom: '10px',
                border: `1px solid ${T.border}`, borderRadius: '12px',
                fontFamily: T.fontBody, fontSize: '14px', color: T.ink,
                background: T.card, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {hasFilters && (
            <button onClick={resetFilters} style={{
              fontFamily: T.fontBody, fontSize: '13px', color: T.inkMuted,
              background: '#F5EEDF', border: `1px solid ${T.border}`,
              borderRadius: '10px', padding: '9px 14px', cursor: 'pointer',
            }}>
              ↺ Réinitialiser
            </button>
          )}
        </div>

        {/* Domaines */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <button
            onClick={() => setSelectedDomain(null)}
            style={{
              fontFamily: T.fontBody, fontSize: '12px', fontWeight: 600,
              padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
              border: `1px solid ${selectedDomain === null ? T.gold : T.border}`,
              background: selectedDomain === null ? '#FFF7E2' : T.card,
              color: selectedDomain === null ? T.goldDark : T.inkMuted,
            }}
          >
            Tous ({KA_MODULES.length})
          </button>
          {domainsWithCount.map(d => (
            <button key={d.id}
              onClick={() => setSelectedDomain(selectedDomain === d.id ? null : d.id)}
              style={{
                fontFamily: T.fontBody, fontSize: '12px', fontWeight: 600,
                padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                border: `1px solid ${selectedDomain === d.id ? d.color : T.border}`,
                background: selectedDomain === d.id ? d.colorLight : T.card,
                color: selectedDomain === d.id ? d.color : T.inkMuted,
              }}
            >
              {d.icon} {d.label.split('&')[0].split('—')[0].trim()} ({d.count})
            </button>
          ))}
        </div>

        {/* Niveaux + types */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: T.inkLight }}>Niveau :</span>
            {(Object.keys(LEVEL_META) as KALevel[]).map(l => {
              const lm = LEVEL_META[l]
              const active = selectedLevel === l
              return (
                <button key={l}
                  onClick={() => setSelectedLevel(active ? null : l)}
                  style={{
                    fontFamily: T.fontBody, fontSize: '12px', fontWeight: 600,
                    padding: '4px 12px', borderRadius: '20px', cursor: 'pointer',
                    border: `1px solid ${active ? lm.color + '55' : T.border}`,
                    background: active ? lm.bg : T.card,
                    color: active ? lm.color : T.inkMuted,
                  }}
                >
                  {lm.label}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: T.inkLight }}>Type :</span>
            {(['video', 'course'] as KAKind[]).map(k => {
              const km = KIND_META[k]
              const active = selectedKind === k
              return (
                <button key={k}
                  onClick={() => setSelectedKind(active ? null : k)}
                  style={{
                    fontFamily: T.fontBody, fontSize: '12px', fontWeight: 600,
                    padding: '4px 12px', borderRadius: '20px', cursor: 'pointer',
                    border: `1px solid ${active ? T.turq + '55' : T.border}`,
                    background: active ? '#E6FBFD' : T.card,
                    color: active ? '#0A8797' : T.inkMuted,
                  }}
                >
                  {km.icon} {km.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Compteur */}
        <p style={{ fontSize: '13px', color: T.inkMuted, marginBottom: '1.25rem' }}>
          <strong style={{ color: T.ink }}>{filtered.length}</strong> module{filtered.length > 1 ? 's' : ''} de formation
          {hasFilters && <span> (filtré{filtered.length > 1 ? 's' : ''})</span>}
        </p>

        {/* Grille */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: T.inkLight }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontFamily: T.fontBody, fontSize: '15px' }}>Aucun module trouvé pour votre recherche.</p>
            <button onClick={resetFilters} style={{
              marginTop: '12px', fontFamily: T.fontBody, fontSize: '13px', fontWeight: 600,
              color: T.goldDark, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
            }}>Réinitialiser les filtres</button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
            paddingBottom: '3rem',
          }}>
            {filtered.map(m => (
              <ModuleCard key={m.id} module={m} onClick={() => setActiveModule(m)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {activeModule && <ModuleModal module={activeModule} onClose={() => setActiveModule(null)} />}
    </div>
  )
}
