'use client'
import { useState } from 'react'
import PageHero from '@/components/PageHero'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n)

type Etape = 'prospect' | 'contacte' | 'demo' | 'negociation' | 'gagne' | 'perdu'

interface Lead {
  nom: string; entreprise: string; email: string; pays: string
  valeur: number; etape: Etape; source: string; date: string
}

const COLONNES: { key: Etape; label: string; color: string; bg: string }[] = [
  { key: 'prospect',    label: 'Prospects',    color: 'var(--ink-mut)',    bg: '#F5F5F4' },
  { key: 'contacte',   label: 'Contactés',    color: 'var(--gold-700)',   bg: 'var(--gold-50)' },
  { key: 'demo',       label: 'Démo planif.', color: 'var(--turq-700)',   bg: 'var(--turq-50)' },
  { key: 'negociation',label: 'Négociation',  color: 'var(--violet)',     bg: 'var(--violet-50)' },
  { key: 'gagne',      label: 'Gagnés 🏆',    color: 'var(--turq-700)',   bg: 'var(--turq-50)' },
  { key: 'perdu',      label: 'Perdus',       color: 'var(--orange-700)', bg: 'var(--orange-50)' },
]

const LEADS_INIT: Lead[] = [
  { nom: 'Fatou Diallo',    entreprise: 'EduCorp CI',     email: 'f.diallo@educorp.ci',   pays: '🇨🇮', valeur: 500000,  etape: 'prospect',    source: 'LinkedIn', date: '10/06' },
  { nom: 'Moussa Camara',   entreprise: 'TechStart BF',   email: 'm.camara@ts.bf',        pays: '🇧🇫', valeur: 200000,  etape: 'prospect',    source: 'Inbound',  date: '09/06' },
  { nom: 'Aïcha Sow',       entreprise: 'Ministère SN',   email: 'a.sow@edu.gouv.sn',    pays: '🇸🇳', valeur: 1500000, etape: 'contacte',    source: 'Réseau',   date: '08/06' },
  { nom: 'Kwame Asante',    entreprise: 'Univ. Légon',    email: 'k.asante@ug.edu.gh',   pays: '🇬🇭', valeur: 750000,  etape: 'contacte',    source: 'Conférence',date: '07/06'},
  { nom: 'Sara Ben Salah',  entreprise: 'RH Consulting',  email: 'sara@rhconsult.tn',    pays: '🇹🇳', valeur: 300000,  etape: 'demo',        source: 'SEO',      date: '06/06' },
  { nom: 'Ibrahim Touré',   entreprise: 'Orange ML',      email: 'i.toure@orange.ml',    pays: '🇲🇱', valeur: 2000000, etape: 'negociation', source: 'Partenaire',date: '05/06'},
  { nom: 'Rokia Diarra',    entreprise: 'BDM Banque',     email: 'r.diarra@bdm.ml',      pays: '🇲🇱', valeur: 900000,  etape: 'negociation', source: 'Inbound',  date: '04/06' },
  { nom: 'Awa Thiam',       entreprise: 'InnovateSN',     email: 'a.thiam@innovatesn.sn',pays: '🇸🇳', valeur: 590000,  etape: 'gagne',       source: 'LinkedIn', date: '01/06' },
  { nom: 'Pascal Konan',    entreprise: 'CI Formation',   email: 'p.konan@cif.ci',       pays: '🇨🇮', valeur: 180000,  etape: 'perdu',       source: 'SEO',      date: '28/05' },
]

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(LEADS_INIT)
  const [drag, setDrag]   = useState<Lead | null>(null)

  const pipeline = Object.fromEntries(COLONNES.map(c => [c.key, leads.filter(l => l.etape === c.key)])) as Record<Etape, Lead[]>
  const totalPipeline = leads.filter(l => !['gagne','perdu'].includes(l.etape)).reduce((a, l) => a + l.valeur, 0)
  const totalGagne    = leads.filter(l => l.etape === 'gagne').reduce((a, l) => a + l.valeur, 0)

  function drop(etape: Etape) {
    if (!drag) return
    setLeads(prev => prev.map(l => l.email === drag.email ? { ...l, etape } : l))
    setDrag(null)
  }

  return (
    <div>
      <PageHero
        eyebrow="Administration · CRM"
        title="Pipeline Prospects"
        subtitle="Kanban commercial — glissez-déposez les leads d'une étape à l'autre pour suivre votre pipeline."
        stats={[
          { value: String(leads.length),                                     label: 'Total leads' },
          { value: fmt(totalPipeline),                                       label: 'Pipeline actif' },
          { value: fmt(totalGagne),                                          label: 'Revenus gagnés' },
          { value: `${Math.round((leads.filter(l=>l.etape==='gagne').length/leads.length)*100)}%`, label: 'Taux de conversion' },
        ]}
      />

      {/* Kanban */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px' }}>
        {COLONNES.map(col => (
          <div
            key={col.key}
            onDragOver={e => e.preventDefault()}
            onDrop={() => drop(col.key)}
            style={{ minWidth: '210px', flex: 1 }}
          >
            {/* En-tête colonne */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: col.color, textTransform: 'uppercase', letterSpacing: '.06em' }}>{col.label}</span>
              <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px', background: col.bg, color: col.color }}>{pipeline[col.key].length}</span>
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '80px', padding: '8px', background: col.bg, borderRadius: '12px' }}>
              {pipeline[col.key].map(lead => (
                <div
                  key={lead.email}
                  draggable
                  onDragStart={() => setDrag(lead)}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px',
                    padding: '11px 12px', cursor: 'grab', boxShadow: '0 1px 4px rgba(0,0,0,.06)',
                    transition: 'box-shadow .15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink)' }}>{lead.nom}</div>
                    <span style={{ fontSize: '10px' }}>{lead.pays}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-mut)', marginBottom: '7px' }}>{lead.entreprise}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--orange-700)' }}>{fmt(lead.valeur)}</span>
                    <span style={{ fontSize: '9px', color: 'var(--ink-mut)', background: '#F5F5F4', padding: '2px 7px', borderRadius: '99px' }}>{lead.source}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--ink-mut)', marginTop: '5px' }}>📅 {lead.date}</div>
                </div>
              ))}
              {pipeline[col.key].length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '11px', color: 'var(--ink-mut)' }}>Déposer ici</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
