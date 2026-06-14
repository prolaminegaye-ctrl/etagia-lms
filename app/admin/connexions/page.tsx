'use client'
import { useState } from 'react'
import PageHero from '@/components/PageHero'

const sessions = [
  { nom: 'Aminata Mbaye',   email: 'a.mbaye@email.com',    role: 'Apprenant',  pays: '🇸🇳', ville: 'Dakar',   appareil: '📱', connecte: 'Il y a 3 min',  duree: '47 min', sessions: 28, statut: 'actif',    actif: true },
  { nom: 'Kofi Diabaté',    email: 'k.diabate@corp.ci',    role: 'Formateur',  pays: '🇨🇮', ville: 'Abidjan', appareil: '💻', connecte: 'Il y a 12 min', duree: '1h 22',  sessions: 41, statut: 'actif',    actif: true },
  { nom: 'Fatou Traoré',    email: 'f.traore@gmail.com',   role: 'Apprenant',  pays: '🇲🇱', ville: 'Bamako',  appareil: '📱', connecte: 'Auj. 09:14',    duree: '18 min', sessions: 14, statut: 'actif',    actif: false },
  { nom: 'Oumar Ba',        email: 'o.ba@organisation.sn', role: 'Manager',    pays: '🇸🇳', ville: 'Dakar',   appareil: '💻', connecte: 'Hier 17:38',     duree: '34 min', sessions: 7,  statut: 'inactif',  actif: false },
  { nom: 'Nadia Konaté',    email: 'n.konate@email.com',   role: 'Apprenant',  pays: '🇬🇳', ville: 'Conakry', appareil: '📱', connecte: 'Il y a 2j',      duree: '—',      sessions: 2,  statut: 'risque',   actif: false },
  { nom: 'Inconnu (VPN)',   email: 'admin@test.hack',      role: 'Suspect',    pays: '🌐', ville: '?',       appareil: '🖥', connecte: 'Auj. 02:17',     duree: 'Bloqué', sessions: 5,  statut: 'bloque',   actif: false },
]

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  actif:   { bg: 'var(--turq-50)',    color: 'var(--turq-700)',   label: '● Actif' },
  inactif: { bg: '#F5F5F4',          color: '#78716C',            label: '● Inactif' },
  risque:  { bg: 'var(--gold-50)',    color: 'var(--gold-700)',    label: '⚠ À risque' },
  bloque:  { bg: 'var(--orange-50)', color: 'var(--orange-700)',  label: '✕ Bloqué' },
}

const HEATMAP = [
  [0,0,0,0,0,1,1,2,3,4,4,3,2,2,3,4,3,2,1,1,0,0,0,0],
  [0,0,0,0,0,1,2,3,4,4,4,3,3,3,4,4,3,2,1,1,0,0,0,0],
  [0,0,0,0,0,1,1,2,3,4,3,2,2,3,3,3,2,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,3,4,4,4,3,3,3,4,4,3,2,2,1,0,0,0,0],
  [0,0,0,0,0,2,2,3,4,4,3,3,2,2,3,3,2,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,2,2,2,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
]
const JOURS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
const heatColor = (v: number) => ['#E7E5E4','#FED7AA','#FB923C','#F97316','#EA580C'][v]

export default function ConnexionsPage() {
  const [filtre, setFiltre] = useState('')

  const filtered = sessions.filter(s =>
    s.nom.toLowerCase().includes(filtre.toLowerCase()) ||
    s.email.toLowerCase().includes(filtre.toLowerCase())
  )

  return (
    <div>
      <PageHero
        eyebrow="Administration"
        title="Connexions & Activité"
        subtitle="Suivi en temps réel de toutes les sessions — qui s'est connecté, quand, depuis où."
        stats={[
          { value: '12',    label: 'Connectés maintenant' },
          { value: '347',   label: 'Sessions aujourd\'hui' },
          { value: '24 min', label: 'Durée moyenne' },
          { value: '2',     label: 'Tentatives suspectes' },
        ]}
      />

      {/* Heatmap */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)', marginBottom: '4px' }}>Heatmap hebdomadaire</div>
        <div style={{ fontSize: '12px', color: 'var(--ink-mut)', marginBottom: '12px' }}>Intensité des connexions — heure 0h → 23h</div>
        {HEATMAP.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '3px' }}>
            <span style={{ fontSize: '10px', color: 'var(--ink-mut)', width: '26px', flexShrink: 0 }}>{JOURS[i]}</span>
            {row.map((v, h) => (
              <div key={h} style={{ flex: 1, height: '13px', borderRadius: '2px', background: heatColor(v) }} />
            ))}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11px', color: 'var(--ink-mut)' }}>
          <span>Moins</span>
          {['#E7E5E4','#FED7AA','#FB923C','#F97316','#EA580C'].map(c => (
            <div key={c} style={{ width: '12px', height: '12px', borderRadius: '2px', background: c }} />
          ))}
          <span>Plus</span>
        </div>
      </div>

      {/* Tableau */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>
            Journal des connexions <span style={{ fontSize: '12px', color: 'var(--ink-mut)', fontWeight: '400' }}>({sessions.length} entrées)</span>
          </h3>
          <input
            value={filtre} onChange={e => setFiltre(e.target.value)}
            placeholder="🔍 Rechercher…"
            style={{ padding: '7px 13px', border: '1px solid var(--line)', borderRadius: '9px', fontSize: '13px', outline: 'none', background: 'var(--canvas)', color: 'var(--ink)' }}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Utilisateur','Rôle','Dernière connexion','Durée','Appareil','Localisation','Sessions/mois','Statut'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: 'var(--ink-mut)', textTransform: 'uppercase', letterSpacing: '.06em', background: '#FAFAF9', borderBottom: '1px solid var(--line)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const st = STATUS_STYLE[s.statut]
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #F5F5F4' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--orange-50)', color: 'var(--orange-700)', fontWeight: '800', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.nom[0]}</div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--ink)' }}>{s.nom}</div>
                          <div style={{ fontSize: '11px', color: 'var(--ink-mut)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--ink-mut)' }}>{s.role}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--ink)' }}>
                      {s.actif && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#16A34A', marginRight: 5 }} />}
                      {s.connecte}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--ink)' }}>{s.duree}</td>
                    <td style={{ padding: '12px 14px', fontSize: '14px' }}>{s.appareil}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px' }}>{s.pays} {s.ville}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>{s.sessions}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
