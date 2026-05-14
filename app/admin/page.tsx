'use client'

const kpis = [
  { label: 'Utilisateurs total', value: '1 248', icon: '◎', color: '#4A7FF5', delta: '+12 ce mois' },
  { label: 'Cours publiés', value: '47', icon: '◈', color: '#0FA878', delta: '+3 cette semaine' },
  { label: 'Organisations', value: '8', icon: '▦', color: '#C49A2A', delta: '2 actives' },
  { label: 'Taux complétion', value: '71%', icon: '✦', color: '#7C3AED', delta: '+4% ce mois' },
]

const recentUsers = [
  { name: 'Fatou Diallo', email: 'fatou@example.com', role: 'Apprenant', status: 'Actif', org: 'SJT' },
  { name: 'Moussa Traoré', email: 'moussa@example.com', role: 'Formateur', status: 'Actif', org: 'ETAGIA' },
  { name: 'Aïda Koné', email: 'aida@example.com', role: 'Apprenant', status: 'Inactif', org: 'SJT' },
  { name: 'Ibrahim Diop', email: 'ibrahim@example.com', role: 'Admin', status: 'Actif', org: 'ETAGIA' },
]

export default function AdminPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Panel Admin</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Vue globale de la plateforme ETAGIA LMS</p>
        </div>
        <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', border: '1px solid #FCD34D' }}>
          ⚙️ Super Admin
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: k.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: k.color, marginBottom: '12px' }}>{k.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '2px', color: 'var(--text-primary)' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{k.label}</div>
            <div style={{ fontSize: '11px', color: k.color, fontWeight: '600' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Utilisateurs récents</h2>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  {['Nom', 'Rôle', 'Organisation', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={u.email} style={{ borderBottom: i < recentUsers.length-1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '500', fontSize: '13px' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.role}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.org}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px',
                        background: u.status === 'Actif' ? 'var(--teal-muted)' : 'var(--bg-secondary)',
                        color: u.status === 'Actif' ? 'var(--teal)' : 'var(--text-muted)'
                      }}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Actions rapides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { href: '/admin/users', label: 'Gérer les utilisateurs', icon: '◎', color: '#4A7FF5' },
              { href: '/admin/cours', label: 'Gérer les cours', icon: '◈', color: '#0FA878' },
              { href: '/admin/orgs', label: 'Gérer les organisations', icon: '▦', color: '#C49A2A' },
              { href: '/admin/analytics', label: 'Voir les analytics', icon: '✦', color: '#7C3AED' },
            ].map(a => (
              <a key={a.href} href={a.href} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow)', transition: 'border-color .15s' }}>
                <span style={{ fontSize: '22px', color: a.color }}>{a.icon}</span>
                <span style={{ fontWeight: '500', fontSize: '14px', color: 'var(--text-primary)' }}>{a.label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
