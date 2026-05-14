'use client'

const orgs = [
  { name: 'SJT Formation', slug: 'sjt', users: 87, courses: 12, plan: 'Pro', status: 'Actif', country: '🇸🇳' },
  { name: 'ETAGIA', slug: 'etagia', users: 34, courses: 28, plan: 'Enterprise', status: 'Actif', country: '🌍' },
  { name: 'CampusForma', slug: 'campusforma', users: 52, courses: 8, plan: 'Starter', status: 'Actif', country: '🇨🇮' },
  { name: 'AfricaTech Hub', slug: 'africatech', users: 23, courses: 5, plan: 'Pro', status: 'Suspendu', country: '🇬🇭' },
]

const planColors: Record<string,string> = { Enterprise: 'var(--gold)', Pro: 'var(--accent)', Starter: 'var(--teal)' }

export default function OrgsPage() {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
        <div>
          <h1 style={{ fontSize:'26px', fontWeight:'700', marginBottom:'4px' }}>Organisations</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'14px' }}>{orgs.length} organisations · {orgs.filter(o=>o.status==='Actif').length} actives</p>
        </div>
        <button style={{ background:'var(--gradient-accent)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'#fff', fontWeight:'600', fontSize:'14px', fontFamily:'var(--font-display)' }}>
          + Nouvelle organisation
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem' }}>
        {orgs.map(org => (
          <div key={org.slug} className="card-hover" style={{
            background:'var(--gradient-card)', border:'1px solid var(--border)',
            borderRadius:'16px', padding:'1.5rem', boxShadow:'var(--shadow-card)', transition:'all .2s'
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ fontSize:'28px' }}>{org.country}</div>
                <div>
                  <div style={{ fontWeight:'700', fontSize:'16px' }}>{org.name}</div>
                  <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>/{org.slug}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:'6px' }}>
                <span style={{ fontSize:'11px', fontWeight:'700', padding:'3px 10px', borderRadius:'20px', background: planColors[org.plan] + '20', color: planColors[org.plan] }}>{org.plan}</span>
                <span style={{ fontSize:'11px', fontWeight:'600', padding:'3px 10px', borderRadius:'20px', background:org.status==='Actif'?'var(--teal-muted)':'rgba(255,255,255,0.05)', color:org.status==='Actif'?'var(--teal)':'var(--text-muted)' }}>{org.status}</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1rem' }}>
              {[
                { label:'Utilisateurs', value: org.users, color:'var(--accent)' },
                { label:'Cours', value: org.courses, color:'var(--teal)' },
              ].map(s => (
                <div key={s.label} style={{ background:'rgba(0,0,0,0.2)', borderRadius:'10px', padding:'10px' }}>
                  <div style={{ fontSize:'20px', fontWeight:'700', color:s.color, fontFamily:'var(--font-display)' }}>{s.value}</div>
                  <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              <button style={{ flex:1, background:'var(--accent-muted)', border:'none', borderRadius:'8px', padding:'8px', color:'var(--accent)', fontSize:'12px', fontWeight:'600' }}>Gérer</button>
              <button style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', borderRadius:'8px', padding:'8px', color:'var(--text-secondary)', fontSize:'12px' }}>Paramètres</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
