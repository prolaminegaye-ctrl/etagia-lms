'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import PageHero from '@/components/PageHero'

const badges = [
  { label: '🔥 Streak 7j',  bg: 'var(--orange-100)', color: 'var(--orange-700)' },
  { label: '🏆 Top 15%',    bg: 'var(--gold-50)', color: 'var(--gold-700)' },
  { label: '✅ 12 cours',   bg: 'var(--turq-50)', color: 'var(--turq-700)' },
  { label: '🎓 3 certifs',  bg: 'var(--turq-50)', color: 'var(--turq)' },
]

const skills = [
  { label: 'Vente & Commerce',     pct: 82, color: 'var(--turq)' },
  { label: 'Marketing Digital',    pct: 65, color: 'var(--violet)' },
  { label: 'Leadership',           pct: 58, color: 'var(--turq-700)' },
  { label: 'Gestion de projet',    pct: 47, color: 'var(--orange)' },
  { label: 'Data & Analyse',       pct: 38, color: 'var(--gold-700)' },
]

export default function ProfilPage() {
  const [tab, setTab] = useState<'profil'|'securite'>('profil')
  const [name, setName] = useState('Lamine Gaye')
  const [bio, setBio] = useState('Formateur professionnel spécialisé en développement commercial en Afrique francophone.')
  const [saved, setSaved] = useState(false)

  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)' }}>
      <Sidebar role="admin" />
      <main style={{ marginLeft: '248px', flex: 1, padding: '2rem', maxWidth: '900px' }}>
        <PageHero
          eyebrow="Compte"
          title="Mon profil"
          subtitle="Gérez vos informations, sécurité et suivez vos compétences acquises."
          stats={[{value:'12',label:'Cours terminés'},{value:'3',label:'Certifications'},{value:'82%',label:'Score moyen'},{value:'7j',label:'Streak actuel'}]}
        />

        {/* Profile card */}
        <div style={{ background: 'var(--surface)', border: '1px solid #D9DBE9', borderRadius: '24px', padding: '2rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 72, height: 72, borderRadius: '22px', background: 'linear-gradient(135deg, #4255FF, #F4591F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#fff', fontWeight: '900', flexShrink: 0 }}>L</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--ink)', marginBottom: '4px' }}>Lamine Gaye</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-mut)', marginBottom: '10px' }}>prolaminegaye@gmail.com · Admin 🇸🇳</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {badges.map(({ label, bg, color }) => (
                  <span key={label} style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: bg, color }}>{label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--canvas)', borderRadius: '12px', padding: '3px', marginBottom: '1.5rem', width: 'fit-content' }}>
            {(['profil', 'securite'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '7px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: '700', transition: 'all .15s',
                background: tab === t ? 'var(--grad-signature)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--ink-soft)',
              }}>{t === 'profil' ? 'Informations' : 'Sécurité'}</button>
            ))}
          </div>

          {tab === 'profil' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Nom complet</label>
                <input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Bio professionnelle</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} style={{ fontFamily: 'Inter, sans-serif', background: 'var(--surface)', border: '2px solid #D9DBE9', borderRadius: '12px', padding: '11px 14px', width: '100%', fontSize: '14px', resize: 'vertical', outline: 'none', color: 'var(--ink)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Pays</label>
                  <input defaultValue="Sénégal" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>Rôle</label>
                  <input defaultValue="Admin / Formateur" />
                </div>
              </div>
              <button onClick={handleSave} style={{ alignSelf: 'flex-start', padding: '11px 28px', background: saved ? 'var(--turq-50)' : 'var(--turq)', color: saved ? 'var(--turq-700)' : '#fff', border: 'none', borderRadius: '99px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all .2s', boxShadow: '0 4px 16px rgba(66,85,255,0.25)' }}>
                {saved ? '✅ Sauvegardé !' : 'Enregistrer les modifications'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer le mot de passe'].map(l => (
                <div key={l}>
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', display: 'block', marginBottom: '6px' }}>{l}</label>
                  <input type="password" placeholder="••••••••" />
                </div>
              ))}
              <button style={{ alignSelf: 'flex-start', padding: '11px 28px', background: 'var(--turq)', color: '#fff', border: 'none', borderRadius: '99px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(66,85,255,0.25)' }}>Mettre à jour le mot de passe</button>
            </div>
          )}
        </div>

        {/* Skills */}
        <div style={{ background: 'var(--surface)', border: '1px solid #D9DBE9', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(46,56,86,0.07)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--turq)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Compétences</div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--ink)', marginBottom: '1.25rem' }}>Niveaux acquis</h3>
          {skills.map(({ label, pct, color }) => (
            <div key={label} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color }}>{pct}%</span>
              </div>
              <div style={{ height: '7px', background: '#ECEEF5', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 0.8s' }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
