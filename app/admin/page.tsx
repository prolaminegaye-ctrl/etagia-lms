'use client'

const kpis = [
  { label: 'Utilisateurs total', value: '1 248', icon: '◎', color: '#6B4EFF', grad: 'linear-gradient(135deg,#6B4EFF,#8B70FF)', delta: '+12 ce mois' },
  { label: 'Cours publiés', value: '47', icon: '◈', color: '#00B89C', grad: 'linear-gradient(135deg,#00B89C,#6B4EFF)', delta: '+3 cette semaine' },
  { label: 'Organisations', value: '8', icon: '▦', color: '#E6A817', grad: 'linear-gradient(135deg,#E6A817,#D63384)', delta: '2 actives' },
  { label: 'Taux complétion', value: '71%', icon: '✦', color: '#D63384', grad: 'linear-gradient(135deg,#D63384,#6B4EFF)', delta: '+4% ce mois' },
]

const recentUsers = [
  { name: 'Fatou Diallo', email: 'fatou@sjt.sn', role: 'Apprenant', status: 'Actif', org: 'SJT' },
  { name: 'Moussa Traoré', email: 'moussa@etagia.com', role: 'Formateur', status: 'Actif', org: 'ETAGIA' },
  { name: 'Aïda Koné', email: 'aida@sjt.sn', role: 'Apprenant', status: 'Inactif', org: 'SJT' },
  { name: 'Ibrahim Diop', email: 'ibrahim@etagia.com', role: 'Admin', status: 'Actif', org: 'ETAGIA' },
]

const card: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid rgba(107,78,255,0.10)',
  borderRadius: '16px',
  padding: '1.25rem',
  boxShadow: '0 2px 12px rgba(107,78,255,0.06)',
}

export default function AdminPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: '#1A1550', fontFamily: 'Syne,sans-serif' }}>Panel Admin</h1>
          <p style={{ color: '#9B8EC0', fontSize: '14px' }}>Vue globale de la plateforme ETAGIA LMS</p>
        </div>
        <span style={{ background: 'rgba(230,168,23,0.12)', color: '#C48A00', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '20px', border: '1px solid rgba(230,168,23,0.30)' }}>
          ⚙️ Super Admin
        </span>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={card}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
              <div style={{ height: '3px', background: k.grad, margin: '-1.25rem -1.25rem 1rem -1.25rem' }} />
            </div>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: k.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: k.color, marginBottom: '14px' }}>{k.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: k.color, fontFamily: 'Syne,sans-serif', marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '13px', color: '#6B5EA8', marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontSize: '11px', color: '#00B89C', fontWeight: '600' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
        {/* Table */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1A1550', fontFamily: 'Syne,sans-serif' }}>Utilisateurs récents</h2>
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(107,78,255,0.08)', background: '#F4F2FF' }}>
                  {['NOM', 'RÔLE', 'ORGANISATION', 'STATUT'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9B8EC0', letterSpacing: '1px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={u.email} style={{ borderBottom: i < recentUsers.length-1 ? '1px solid rgba(107,78,255,0.06)' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '500', fontSize: '13px', color: '#1A1550' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: '#9B8EC0' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B5EA8' }}>{u.role}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B5EA8' }}>{u.org}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: u.status === 'Actif' ? 'rgba(0,184,156,0.12)' : 'rgba(107,78,255,0.08)', color: u.status === 'Actif' ? '#00B89C' : '#9B8EC0' }}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1A1550', fontFamily: 'Syne,sans-serif' }}>Actions rapides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { href: '/admin/users', label: 'Gérer les utilisateurs', icon: '◎', color: '#6B4EFF' },
              { href: '/admin/cours', label: 'Gérer les cours', icon: '◈', color: '#00B89C' },
              { href: '/admin/orgs', label: 'Gérer les organisations', icon: '▦', color: '#E6A817' },
              { href: '/admin/analytics', label: 'Voir les analytics', icon: '〜', color: '#D63384' },
              { href: '/admin/export', label: 'Export CSV', icon: '📊', color: '#6B4EFF' },
            ].map(a => (
              <a key={a.href} href={a.href} style={{ ...card, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', transition: 'all .15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,78,255,0.30)'; (e.currentTarget as HTMLElement).style.background = '#F4F2FF' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,78,255,0.10)'; (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}>
                <span style={{ fontSize: '20px', color: a.color }}>{a.icon}</span>
                <span style={{ fontWeight: '500', fontSize: '14px', color: '#1A1550' }}>{a.label}</span>
                <span style={{ marginLeft: 'auto', color: '#9B8EC0' }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
