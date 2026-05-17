'use client'

const kpis = [
  { label: 'Utilisateurs total', value: '1 248', icon: '◎', color: '#FF5722', grad: 'linear-gradient(135deg,#FF5722,#FFB300)', delta: '+12 ce mois' },
  { label: 'Cours publiés', value: '47', icon: '◈', color: '#00BFA5', grad: 'linear-gradient(135deg,#00BFA5,#7C3AED)', delta: '+3 cette semaine' },
  { label: 'Organisations', value: '8', icon: '▦', color: '#FFB300', grad: 'linear-gradient(135deg,#FFB300,#FF5722)', delta: '2 actives' },
  { label: 'Taux complétion', value: '71%', icon: '✦', color: '#7C3AED', grad: 'linear-gradient(135deg,#7C3AED,#00BFA5)', delta: '+4% ce mois' },
]

const recentUsers = [
  { name: 'Fatou Diallo', email: 'fatou@sjt.sn', role: 'Apprenant', status: 'Actif', org: 'SJT' },
  { name: 'Moussa Traoré', email: 'moussa@etagia.com', role: 'Formateur', status: 'Actif', org: 'ETAGIA' },
  { name: 'Aïda Koné', email: 'aida@sjt.sn', role: 'Apprenant', status: 'Inactif', org: 'SJT' },
  { name: 'Ibrahim Diop', email: 'ibrahim@etagia.com', role: 'Admin', status: 'Actif', org: 'ETAGIA' },
]

export default function AdminPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1C1917', fontFamily: 'Syne,sans-serif', marginBottom: '4px' }}>Panel Admin</h1>
          <p style={{ color: '#A8A29E', fontSize: '14px' }}>Vue globale de la plateforme ETAGIA LMS</p>
        </div>
        <span style={{ background: 'linear-gradient(135deg,#FF5722,#FFB300)', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '7px 16px', borderRadius: '20px', boxShadow: '0 4px 14px rgba(255,87,34,0.30)' }}>
          ⚙️ Super Admin
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: '#FFFFFF', border: '1.5px solid rgba(28,25,23,0.07)', borderRadius: '18px', padding: '1.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,25,23,0.05)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.grad }} />
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: k.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: k.color, marginBottom: '14px', marginTop: '4px' }}>{k.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: k.color, fontFamily: 'Syne,sans-serif', marginBottom: '4px', lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: '13px', color: '#57534E', marginBottom: '5px' }}>{k.label}</div>
            <div style={{ fontSize: '11px', color: '#00BFA5', fontWeight: '700' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1C1917', fontFamily: 'Syne,sans-serif' }}>Utilisateurs récents</h2>
          <div style={{ background: '#FFFFFF', border: '1.5px solid rgba(28,25,23,0.07)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,25,23,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid rgba(28,25,23,0.07)', background: '#FAF9F7' }}>
                  {['NOM', 'RÔLE', 'ORG', 'STATUT'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', color: '#A8A29E', letterSpacing: '1.2px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={u.email} style={{ borderBottom: i < recentUsers.length-1 ? '1px solid rgba(28,25,23,0.05)' : 'none', transition: 'background .1s' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#1C1917' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: '#A8A29E' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#57534E' }}>{u.role}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#57534E' }}>{u.org}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: u.status === 'Actif' ? 'rgba(0,191,165,0.12)' : 'rgba(28,25,23,0.06)', color: u.status === 'Actif' ? '#00BFA5' : '#A8A29E' }}>{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '1rem', color: '#1C1917', fontFamily: 'Syne,sans-serif' }}>Actions rapides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[
              { href: '/admin/users', label: 'Gérer les utilisateurs', icon: '◎', color: '#FF5722' },
              { href: '/admin/cours', label: 'Gérer les cours', icon: '◈', color: '#00BFA5' },
              { href: '/admin/orgs', label: 'Gérer les organisations', icon: '▦', color: '#FFB300' },
              { href: '/admin/analytics', label: 'Analytics', icon: '〜', color: '#7C3AED' },
              { href: '/admin/export', label: 'Export CSV', icon: '📊', color: '#FF5722' },
            ].map(a => (
              <a key={a.href} href={a.href}
                style={{ background: '#FFFFFF', border: '1.5px solid rgba(28,25,23,0.07)', borderRadius: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', transition: 'all .15s', boxShadow: '0 1px 6px rgba(28,25,23,0.04)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = a.color + '44'; (e.currentTarget as HTMLElement).style.background = '#FFF5F2' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(28,25,23,0.07)'; (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: a.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: a.color }}>{a.icon}</div>
                <span style={{ fontWeight: '500', fontSize: '13px', color: '#1C1917' }}>{a.label}</span>
                <span style={{ marginLeft: 'auto', color: '#A8A29E', fontSize: '13px' }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
