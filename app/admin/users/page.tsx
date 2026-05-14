'use client'
import { useState } from 'react'

const users = [
  { name: 'Fatou Diallo', email: 'fatou@sjt.sn', role: 'Apprenant', org: 'SJT', status: 'Actif', courses: 3, joined: '12 jan 2026' },
  { name: 'Moussa Traoré', email: 'moussa@etagia.com', role: 'Formateur', org: 'ETAGIA', status: 'Actif', courses: 5, joined: '3 fév 2026' },
  { name: 'Aïda Koné', email: 'aida@sjt.sn', role: 'Apprenant', org: 'SJT', status: 'Inactif', courses: 1, joined: '20 mar 2026' },
  { name: 'Ibrahim Diop', email: 'ibrahim@etagia.com', role: 'Admin', org: 'ETAGIA', status: 'Actif', courses: 0, joined: '1 jan 2026' },
  { name: 'Aminata Sow', email: 'aminata@example.com', role: 'Apprenant', org: 'CampusForma', status: 'Actif', courses: 4, joined: '5 avr 2026' },
  { name: 'Cheikh Ndiaye', email: 'cheikh@example.com', role: 'Formateur', org: 'SJT', status: 'Actif', courses: 2, joined: '18 avr 2026' },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search))
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Gestion des utilisateurs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{users.length} utilisateurs · {users.filter(u=>u.status==='Actif').length} actifs</p>
        </div>
        <button style={{ background: 'var(--gradient-accent)', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#fff', fontWeight: '600', fontSize: '14px', fontFamily: 'var(--font-display)' }}>
          + Inviter un utilisateur
        </button>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher un utilisateur..."
          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '11px 16px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)' }} />
      </div>
      <div style={{ background: 'var(--gradient-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
              {['Utilisateur','Rôle','Organisation','Cours','Inscrit le','Statut','Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u,i) => (
              <tr key={u.email} style={{ borderBottom: i<filtered.length-1?'1px solid var(--border)':'none', transition: 'background .15s' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'var(--accent-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'700', color:'var(--accent)' }}>{u.name[0]}</div>
                    <div>
                      <div style={{ fontWeight:'500', fontSize:'13px' }}>{u.name}</div>
                      <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'14px 16px', fontSize:'13px', color:'var(--text-secondary)' }}>{u.role}</td>
                <td style={{ padding:'14px 16px', fontSize:'13px', color:'var(--text-secondary)' }}>{u.org}</td>
                <td style={{ padding:'14px 16px', fontSize:'13px', color:'var(--accent)', fontWeight:'600' }}>{u.courses}</td>
                <td style={{ padding:'14px 16px', fontSize:'12px', color:'var(--text-muted)' }}>{u.joined}</td>
                <td style={{ padding:'14px 16px' }}>
                  <span style={{ fontSize:'11px', fontWeight:'600', padding:'3px 10px', borderRadius:'20px', background:u.status==='Actif'?'var(--teal-muted)':'rgba(255,255,255,0.05)', color:u.status==='Actif'?'var(--teal)':'var(--text-muted)' }}>{u.status}</span>
                </td>
                <td style={{ padding:'14px 16px' }}>
                  <div style={{ display:'flex', gap:'6px' }}>
                    <button style={{ background:'var(--accent-muted)', border:'none', borderRadius:'6px', padding:'5px 10px', color:'var(--accent)', fontSize:'12px', fontWeight:'600' }}>Éditer</button>
                    <button style={{ background:'rgba(240,90,90,0.1)', border:'none', borderRadius:'6px', padding:'5px 10px', color:'var(--red)', fontSize:'12px', fontWeight:'600' }}>Retirer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
