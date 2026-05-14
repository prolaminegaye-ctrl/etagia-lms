'use client'

const cours = [
  { title:'Data Science avec Python', author:'Moussa Traoré', enrolled:54, completion:72, status:'Publié', category:'Tech' },
  { title:'Marketing Digital Afrique', author:'Aminata Sow', enrolled:43, completion:58, status:'Publié', category:'Business' },
  { title:'Leadership & Management', author:'Cheikh Ndiaye', enrolled:30, completion:45, status:'Brouillon', category:'Soft Skills' },
  { title:'IA Générative pour pros', author:'Ibrahim Diop', enrolled:89, completion:34, status:'Publié', category:'Tech' },
]

export default function AdminCoursPage() {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
        <div>
          <h1 style={{ fontSize:'26px', fontWeight:'700', marginBottom:'4px' }}>Gestion des cours</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'14px' }}>{cours.length} cours · {cours.filter(c=>c.status==='Publié').length} publiés</p>
        </div>
        <button style={{ background:'var(--gradient-accent)', border:'none', borderRadius:'10px', padding:'10px 20px', color:'#fff', fontWeight:'600', fontSize:'14px', fontFamily:'var(--font-display)' }}>
          + Ajouter un cours
        </button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        {cours.map(c => (
          <div key={c.title} className="card-hover" style={{ background:'var(--gradient-card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'1.1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem', boxShadow:'var(--shadow-card)', transition:'all .2s' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:'600', fontSize:'14px', marginBottom:'3px' }}>{c.title}</div>
              <div style={{ fontSize:'12px', color:'var(--text-secondary)' }}>Par {c.author} · {c.category}</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'16px', fontWeight:'700', color:'var(--accent)' }}>{c.enrolled}</div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>inscrits</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'16px', fontWeight:'700', color:'var(--teal)' }}>{c.completion}%</div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>complétion</div>
            </div>
            <span style={{ fontSize:'11px', fontWeight:'600', padding:'4px 12px', borderRadius:'20px', background:c.status==='Publié'?'var(--teal-muted)':'var(--gold-muted)', color:c.status==='Publié'?'var(--teal)':'var(--gold)' }}>{c.status}</span>
            <button style={{ background:'var(--accent-muted)', border:'none', borderRadius:'8px', padding:'7px 14px', color:'var(--accent)', fontSize:'12px', fontWeight:'600' }}>Gérer →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
