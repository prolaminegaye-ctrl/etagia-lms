'use client'

const months = ['Jan','Fév','Mar','Avr','Mai','Jun']
const data = [45, 78, 92, 110, 134, 127]
const max = Math.max(...data)

export default function AnalyticsPage() {
  return (
    <div>
      <h1 style={{ fontSize:'26px', fontWeight:'700', marginBottom:'2rem' }}>Analytics plateforme</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { label:'Nouveaux utilisateurs (mai)', value:'+127', color:'var(--accent)' },
          { label:'Sessions actives aujourd\'hui', value:'348', color:'var(--teal)' },
          { label:'Taux de rétention', value:'84%', color:'var(--gold)' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--gradient-card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'1.5rem', boxShadow:'var(--shadow-card)' }}>
            <div style={{ fontSize:'32px', fontWeight:'800', color:s.color, fontFamily:'var(--font-display)', marginBottom:'6px' }}>{s.value}</div>
            <div style={{ fontSize:'13px', color:'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'var(--gradient-card)', border:'1px solid var(--border)', borderRadius:'16px', padding:'1.5rem', boxShadow:'var(--shadow-card)' }}>
        <h2 style={{ fontSize:'16px', fontWeight:'600', marginBottom:'1.5rem' }}>Inscriptions mensuelles</h2>
        <div style={{ display:'flex', alignItems:'flex-end', gap:'12px', height:'160px' }}>
          {data.map((v,i) => (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
              <div style={{ fontSize:'12px', fontWeight:'600', color:'var(--accent)' }}>{v}</div>
              <div style={{ width:'100%', background:'linear-gradient(180deg, var(--accent) 0%, rgba(91,141,239,0.3) 100%)', borderRadius:'6px 6px 0 0', height:`${(v/max)*120}px`, boxShadow:'0 0 12px rgba(91,141,239,0.3)' }} />
              <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{months[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
