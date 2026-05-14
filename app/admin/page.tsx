'use client'

const kpis = [
  { label: 'Utilisateurs total', value: '1 248', icon: '◎', color: '#5B8DEF', delta: '+12 ce mois' },
  { label: 'Cours publiés', value: '47', icon: '◈', color: '#22D4A8', delta: '+3 cette semaine' },
  { label: 'Organisations', value: '8', icon: '▦', color: '#F0B429', delta: '2 actives' },
  { label: 'Taux complétion', value: '71%', icon: '✦', color: '#8B5CF6', delta: '+4% ce mois' },
]

const recentUsers = [
  { name: 'Fatou Diallo', email: 'fatou@sjt.sn', role: 'Apprenant', status: 'Actif', org: 'SJT' },
  { name: 'Moussa Traoré', email: 'moussa@etagia.com', role: 'Formateur', status: 'Actif', org: 'ETAGIA' },
  { name: 'Aïda Koné', email: 'aida@sjt.sn', role: 'Apprenant', status: 'Inactif', org: 'SJT' },
  { name: 'Ibrahim Diop', email: 'ibrahim@etagia.com', role: 'Admin', status: 'Actif', org: 'ETAGIA' },
]

const card: React.CSSProperties = {
  background: '#1B2438',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '1.25rem',
  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
}

export default function AdminPage() {
  return (
    <div style={{ color: '#E8EEFF' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: '#E8EEFF', fontFamily: 'Syne,sans-serif' }}>Panel Admin</h1>
          <p style={{ color: '#7A90B0', fontSize: '14px' }}>Vue globale de la plateforme ETAGIA LMS</p>
        </div>
        <span style={{ background: 'rgba(240,180,41,0.15)', color: '#F0B429', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '20px', border: '1px solid rgba(240,180,41,0.3)' }}>
          ⚙️ Super Admin
        </span>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={card}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: k.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: k.color, marginBottom: '14px' }}>{k.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: k.color, fontFamily: 'Syne,sans-serif', marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '13px', color: '#7A90B0', marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontSize: '11px', color: '#22D4A8', fontWeight: '600' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
        {/* Table */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#E8EEFF', fontFamily: 'Syne,sans-serif' }}>Utilisateurs récents</h2>
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.25)' }}>
                  {['NOM', 'RÔLE', 'ORGANISATION', 'STATUT'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#3D5070', letterSpacing: '1px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={u.email} style={{ borderBottom: i < recentUsers.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '500', fontSize: '13px', color: '#E8EEFF' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: '#3D5070' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7A90B0' }}>{u.role}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7A90B0' }}>{u.org}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: u.status === 'Actif' ? 'rgba(34,212,168,0.15)' : 'rgba(255,255,255,0.05)', color: u.status === 'Actif' ? '#22D4A8' : '#3D5070' }}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#E8EEFF', fontFamily: 'Syne,sans-serif' }}>Actions rapides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { href: '/admin/users', label: 'Gérer les utilisateurs', icon: '◎', color: '#5B8DEF' },
              { href: '/admin/cours', label: 'Gérer les cours', icon: '◈', color: '#22D4A8' },
              { href: '/admin/orgs', label: 'Gérer les organisations', icon: '▦', color: '#F0B429' },
              { href: '/admin/analytics', label: 'Voir les analytics', icon: '〜', color: '#8B5CF6' },
              { href: '/admin/export', label: 'Export CSV', icon: '📊', color: '#F0B429' },
            ].map(a => (
              <a key={a.href} href={a.href} style={{ ...card, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', transition: 'border-color .15s' }}>
                <span style={{ fontSize: '20px', color: a.color }}>{a.icon}</span>
                <span style={{ fontWeight: '500', fontSize: '14px', color: '#E8EEFF' }}>{a.label}</span>
                <span style={{ marginLeft: 'auto', color: '#3D5070' }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
