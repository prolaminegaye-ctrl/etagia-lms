'use client'

import { useEffect, useState } from 'react'
import PageHero from '@/components/PageHero'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

type Cle = { cle: string; n: number }
type Compte = {
  id: string
  full_name: string | null
  role: string
  marketplace_access: boolean
  last_active: string | null
  created_at: string
}
type Audience = {
  periode: { jours: number }
  resume: {
    pagesVues: number
    visiteurs: number
    visiteursConnectes: number
    visiteursAnonymes: number
    comptes: number
    comptesActifs24h: number
  }
  courbe: Array<{ jour: string; vues: number; visiteurs: number }>
  pages: Cle[]
  pays: Cle[]
  origines: Cle[]
  comptes: Compte[]
  journal: Array<{ event: string; email: string | null; created_at: string; ip: string | null }>
}

const PERIODES = [7, 30, 90] as const

function dateCourte(v: string) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(new Date(v))
}
function dateHeure(v: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(v))
}
function drapeau(code: string) {
  if (code.length !== 2) return code
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)))
}

const carte: React.CSSProperties = {
  background: 'var(--surface, #fff)', border: '1px solid var(--line, #ECEEF5)',
  borderRadius: '14px', padding: '1.15rem 1.25rem',
}

/**
 * Audience et comptes — écran du propriétaire.
 *
 * Montre qui visite le site (y compris sans compte) et qui l'utilise.
 * Les visiteurs sont comptés par session anonyme : aucune personne n'est
 * identifiée, et les adresses IP sont tronquées avant d'être écrites.
 */
export default function AudiencePage() {
  const [jours, setJours] = useState<number>(30)
  const [data, setData] = useState<Audience | null>(null)
  const [chargement, setChargement] = useState(isSupabaseConfigured)
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let annule = false

    ;(async () => {
      const { data: s } = await getSupabase().auth.getSession()
      const jeton = s.session?.access_token
      if (annule) return
      setChargement(true)
      setErreur('')
      if (!jeton) { setChargement(false); return }

      const res = await fetch(`/api/admin/audience?jours=${jours}`, {
        headers: { Authorization: `Bearer ${jeton}` },
      })
      const corps = await res.json().catch(() => ({}))
      if (annule) return
      if (!res.ok) { setErreur(corps.error ?? 'Lecture impossible.'); setChargement(false); return }
      setData(corps)
      setChargement(false)
    })()

    return () => { annule = true }
  }, [jours])

  const maxVues = Math.max(1, ...(data?.courbe ?? []).map((p) => p.vues))

  return (
    <>
      <PageHero
        eyebrow="Administration"
        title="Audience et comptes"
        subtitle="Qui visite le site, qui l'utilise. Visiteurs comptés par session anonyme, adresses IP tronquées."
      />

      <div style={{ display: 'flex', gap: '8px', margin: '20px 0 18px', flexWrap: 'wrap' }}>
        {PERIODES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setJours(p)}
            style={{
              padding: '7px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              border: '1px solid var(--line, #ECEEF5)',
              background: jours === p ? 'var(--orange-700, #E8651A)' : 'transparent',
              color: jours === p ? '#fff' : 'var(--ink-mut, #5B6070)',
            }}
          >
            {p} jours
          </button>
        ))}
      </div>

      {erreur ? (
        <p style={{ padding: '12px 16px', borderRadius: '8px', background: '#FBEAE8', color: '#A8201A', fontSize: '14px', fontWeight: 600 }}>
          {erreur}
        </p>
      ) : null}

      {chargement ? (
        <p style={{ color: 'var(--ink-mut, #5B6070)', fontSize: '14px' }}>Chargement…</p>
      ) : !data ? null : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>

          {/* Chiffres clés */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem' }}>
            {[
              { l: 'Visiteurs', v: data.resume.visiteurs, s: `${data.resume.visiteursAnonymes} sans compte` },
              { l: 'Pages vues', v: data.resume.pagesVues, s: `sur ${data.periode.jours} jours` },
              { l: 'Visiteurs connectés', v: data.resume.visiteursConnectes, s: 'sessions identifiées' },
              { l: 'Comptes inscrits', v: data.resume.comptes, s: `${data.resume.comptesActifs24h} actifs sur 24 h` },
            ].map(({ l, v, s }) => (
              <div key={l} style={carte}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-mut, #5B6070)' }}>{l}</p>
                <p style={{ margin: '10px 0 2px', fontSize: '30px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{v.toLocaleString('fr-FR')}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-mut, #5B6070)' }}>{s}</p>
              </div>
            ))}
          </div>

          {/* Courbe */}
          <div style={carte}>
            <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 800 }}>Fréquentation</h2>
            {data.courbe.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--ink-mut, #5B6070)', margin: 0 }}>
                Aucune visite enregistrée sur la période. Les données apparaîtront dès les premières visites après la mise en ligne.
              </p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '150px', overflowX: 'auto' }}>
                {data.courbe.map((p) => (
                  <div key={p.jour} style={{ flex: '1 0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div
                      title={`${p.jour} — ${p.vues} pages vues, ${p.visiteurs} visiteurs`}
                      style={{
                        width: '100%', height: `${Math.round((p.vues / maxVues) * 110)}px`, minHeight: '3px',
                        background: 'var(--orange-700, #E8651A)', borderRadius: '4px 4px 0 0',
                      }}
                    />
                    <span style={{ fontSize: '10px', color: 'var(--ink-mut, #5B6070)', whiteSpace: 'nowrap' }}>{dateCourte(p.jour)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Répartitions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              { titre: 'Pages les plus vues', items: data.pages, vide: 'Aucune page vue.' },
              { titre: 'Pays', items: data.pays.map((p) => ({ ...p, cle: `${drapeau(p.cle)} ${p.cle}` })), vide: 'Pays non disponible hors production.' },
              { titre: 'Origines du trafic', items: data.origines, vide: 'Aucun site référent : accès directs.' },
            ].map(({ titre, items, vide }) => (
              <div key={titre} style={carte}>
                <h2 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>{titre}</h2>
                {items.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--ink-mut, #5B6070)', margin: 0 }}>{vide}</p>
                ) : (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '7px' }}>
                    {items.map((it) => (
                      <li key={it.cle} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.cle}</span>
                        <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{it.n}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Comptes */}
          <div style={{ ...carte, padding: 0, overflow: 'hidden' }}>
            <h2 style={{ margin: 0, padding: '1.15rem 1.25rem', fontSize: '15px', fontWeight: 800 }}>
              Tous les comptes ({data.comptes.length})
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Nom', 'Rôle', 'Marketplace', 'Inscrit le', 'Dernière activité'].map((h) => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '9px 14px', fontSize: '11px', fontWeight: 700,
                        letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-mut, #5B6070)',
                        borderBottom: '1px solid var(--line, #ECEEF5)', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.comptes.map((c) => (
                    <tr key={c.id}>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line-soft, #F4F5F8)' }}>
                        {c.full_name || <span style={{ color: 'var(--ink-mut, #5B6070)' }}>Sans nom</span>}
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line-soft, #F4F5F8)' }}>{c.role}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line-soft, #F4F5F8)' }}>
                        {c.marketplace_access || c.role === 'admin' ? 'Oui' : '—'}
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line-soft, #F4F5F8)', whiteSpace: 'nowrap' }}>
                        {dateHeure(c.created_at)}
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid var(--line-soft, #F4F5F8)', whiteSpace: 'nowrap' }}>
                        {c.last_active ? dateHeure(c.last_active) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Journal */}
          <div style={carte}>
            <h2 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>Journal d&apos;audit — 40 derniers événements</h2>
            {data.journal.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--ink-mut, #5B6070)', margin: 0 }}>Aucun événement enregistré.</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '6px' }}>
                {data.journal.map((e, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '12.5px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--ink-mut, #5B6070)', whiteSpace: 'nowrap' }}>
                      {dateHeure(e.created_at)}
                    </span>
                    <strong>{e.event}</strong>
                    <span style={{ color: 'var(--ink-mut, #5B6070)' }}>{e.email ?? 'anonyme'}</span>
                    {e.ip ? (
                      <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace, monospace', color: 'var(--ink-mut, #5B6070)' }}>{e.ip}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  )
}
