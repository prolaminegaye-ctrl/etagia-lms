'use client'

const stats = [
  { label: 'Cours publiés', value: '3', icon: '◈', color: 'var(--accent)' },
  { label: 'Apprenants', value: '127', icon: '◎', color: 'var(--teal)' },
  { label: 'Taux complétion', value: '74%', icon: '▦', color: 'var(--gold)' },
  { label: 'Score moyen', value: '81/100', icon: '✦', color: '#A78BFA' },
]

const mesCours = [
  { title: 'Data Science avec Python', apprenants: 54, completion: 72, status: 'Publié' },
  { title: 'Marketing Digital Afrique', apprenants: 43, completion: 58, status: 'Publié' },
  { title: 'Leadership & Management', apprenants: 30, completion: 45, status: 'Brouillon' },
]

export default function FormateurPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Espace Formateur</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Gérez vos cours et suivez vos apprenants</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.color + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: s.color, marginBottom: '12px' }}>{s.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { href: '/formateur/creer', icon: '＋', label: 'Créer un cours', desc: 'Éditeur de cours complet', color: 'var(--accent)' },
          { href: '/formateur/import', icon: '↑', label: 'Importer SCORM / H5P', desc: 'Upload et conversion automatique', color: 'var(--teal)' },
          { href: '/formateur/apprenants', icon: '◎', label: 'Voir les apprenants', desc: 'Progression et résultats', color: 'var(--gold)' },
        ].map(a => (
          <a key={a.href} href={a.href} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', textDecoration: 'none', display: 'block', transition: 'border-color .15s' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{a.icon}</div>
            <div style={{ fontWeight: '600', fontSize: '14px', color: a.color, marginBottom: '4px' }}>{a.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{a.desc}</div>
          </a>
        ))}
      </div>

      {/* Mes cours */}
      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Mes cours</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {mesCours.map(c => (
          <div key={c.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>{c.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.apprenants} apprenants · {c.completion}% complétion moyenne</div>
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px',
              background: c.status === 'Publié' ? 'var(--teal-muted)' : 'var(--gold-muted)',
              color: c.status === 'Publié' ? 'var(--teal)' : 'var(--gold)'
            }}>{c.status}</span>
            <a href="/formateur/cours" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: '500' }}>Gérer →</a>
          </div>
        ))}
      </div>
    </div>
  )
}
