'use client'
import { useState } from 'react'

type Role = 'super_admin' | 'admin' | 'editeur' | 'lecteur' | 'invite'

interface Member {
  id: string
  name: string
  email: string
  role: Role
  avatar: string
  status: 'actif' | 'en_attente'
  joinedAt: string
  lastSeen?: string
}

const ROLES: { value: Role; label: string; icon: string; color: string; desc: string; perms: string[] }[] = [
  {
    value: 'super_admin', label: 'Super Admin', icon: '👑', color: '#F59E0B',
    desc: 'Accès total à toutes les fonctionnalités et paramètres de la plateforme.',
    perms: ['Tout voir', 'Tout modifier', 'Gérer l\'équipe', 'Configurer la plateforme', 'Facturation'],
  },
  {
    value: 'admin', label: 'Administrateur', icon: '🛡️', color: '#6366F1',
    desc: 'Peut gérer les utilisateurs, contenus et paramètres principaux.',
    perms: ['Tout voir', 'Gérer utilisateurs', 'Gérer contenus', 'Voir analytics', 'Inviter membres'],
  },
  {
    value: 'editeur', label: 'Éditeur', icon: '✏️', color: '#10B981',
    desc: 'Peut créer, modifier et publier des contenus pédagogiques.',
    perms: ['Créer des cours', 'Modifier les contenus', 'Publier', 'Voir analytics cours'],
  },
  {
    value: 'lecteur', label: 'Lecteur', icon: '👁️', color: '#3B82F6',
    desc: 'Accès en lecture seule à tous les contenus et rapports.',
    perms: ['Voir les cours', 'Voir les utilisateurs', 'Voir analytics', 'Exporter rapports'],
  },
  {
    value: 'invite', label: 'Invité', icon: '🔗', color: '#8B5CF6',
    desc: 'Accès limité et temporaire, idéal pour les prestataires externes.',
    perms: ['Voir contenus assignés', 'Commenter'],
  },
]

const INIT_MEMBERS: Member[] = [
  { id: '1', name: 'Lamine Gaye', email: 'prolaminegaye@gmail.com', role: 'super_admin', avatar: 'LG', status: 'actif', joinedAt: '2024-01-15', lastSeen: 'Aujourd\'hui' },
  { id: '2', name: 'Aminata Diallo', email: 'aminata@etagia.com', role: 'admin', avatar: 'AD', status: 'actif', joinedAt: '2024-02-10', lastSeen: 'Hier' },
  { id: '3', name: 'Oumar Traoré', email: 'oumar@etagia.com', role: 'editeur', avatar: 'OT', status: 'actif', joinedAt: '2024-03-05', lastSeen: 'Il y a 3j' },
  { id: '4', name: 'Fatou Ndiaye', email: 'fatou@formation.sn', role: 'lecteur', avatar: 'FN', status: 'en_attente', joinedAt: '2024-05-20' },
]

const ROLE_COLORS: Record<Role, string> = {
  super_admin: '#F59E0B', admin: '#6366F1', editeur: '#10B981', lecteur: '#3B82F6', invite: '#8B5CF6'
}
const ROLE_BG: Record<Role, string> = {
  super_admin: 'rgba(245,158,11,0.1)', admin: 'rgba(99,102,241,0.1)', editeur: 'rgba(16,185,129,0.1)',
  lecteur: 'rgba(59,130,246,0.1)', invite: 'rgba(139,92,246,0.1)'
}

export default function TeamPage() {
  const [members, setMembers]       = useState<Member[]>(INIT_MEMBERS)
  const [showInvite, setShowInvite] = useState(false)
  const [showMatrix, setShowMatrix] = useState(false)
  const [editId, setEditId]         = useState<string | null>(null)
  const [search, setSearch]         = useState('')
  const [filterRole, setFilterRole] = useState<Role | 'all'>('all')

  const [invEmail, setInvEmail]     = useState('')
  const [invName, setInvName]       = useState('')
  const [invRole, setInvRole]       = useState<Role>('lecteur')
  const [invSent, setInvSent]       = useState(false)

  function sendInvite() {
    if (!invEmail || !invName) return
    const newM: Member = {
      id: Date.now().toString(), name: invName, email: invEmail, role: invRole,
      avatar: invName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2),
      status: 'en_attente', joinedAt: new Date().toISOString().slice(0, 10),
    }
    setMembers(prev => [...prev, newM])
    setInvSent(true)
    setTimeout(() => { setInvSent(false); setShowInvite(false); setInvEmail(''); setInvName(''); setInvRole('lecteur') }, 1800)
  }

  function updateRole(id: string, role: Role) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m))
    setEditId(null)
  }

  function removeMember(id: string) {
    if (id === '1') return
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const filtered = members.filter(m =>
    (filterRole === 'all' || m.role === filterRole) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ padding:'32px', maxWidth:'1000px', margin:'0 auto', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>


      {/* Hero orange */}
      <div style={{ borderRadius: '24px', padding: '2rem 2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #F4591F 0%, #FF8C42 45%, #FFB347 100%)', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(244,89,31,0.25)' }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Équipe</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.4px', marginBottom: '4px' }}>Mon Équipe</h1>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '14px' }}>Gérez les rôles et accès de votre équipe.</p>
        </div>
      </div>
      {/* Header */}
      <div style={{ marginBottom:'32px', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
        <div>
          <h1 style={{ fontSize:'28px', fontWeight:'900', color:'var(--text-primary,#1C1917)', margin:'0 0 6px', letterSpacing:'-0.5px' }}>
            👥 Mon Équipe
          </h1>
          <p style={{ color:'var(--text-secondary,#57534E)', fontSize:'14px', margin:0 }}>
            Gérez les membres de votre équipe et leurs niveaux d'accès à la plateforme ETAGIA.
          </p>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={() => setShowMatrix(true)}
            style={{ padding:'10px 18px', borderRadius:'10px', border:'1.5px solid rgba(99,102,241,0.3)', background:'rgba(99,102,241,0.06)', color:'#6366F1', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>
            📋 Matrice des droits
          </button>
          <button onClick={() => setShowInvite(true)}
            style={{ padding:'10px 20px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,#6366F1,#A855F7)', color:'#fff', fontWeight:'800', fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 16px rgba(99,102,241,0.35)' }}>
            + Inviter un membre
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'28px' }}>
        {[
          { label:'Total membres', value: members.length, icon:'👥', color:'#6366F1' },
          { label:'Actifs',        value: members.filter(m=>m.status==='actif').length, icon:'✅', color:'#10B981' },
          { label:'En attente',    value: members.filter(m=>m.status==='en_attente').length, icon:'⏳', color:'#F59E0B' },
          { label:'Rôles différents', value: new Set(members.map(m=>m.role)).size, icon:'🔑', color:'#A855F7' },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', borderRadius:'16px', padding:'20px', border:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize:'24px', marginBottom:'8px' }}>{s.icon}</div>
            <div style={{ fontSize:'28px', fontWeight:'900', color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:'12px', color:'#78716C', marginTop:'4px', fontWeight:'600' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:1, minWidth:'200px', position:'relative' }}>
          <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', fontSize:'15px' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un membre…"
            style={{ width:'100%', padding:'10px 12px 10px 38px', boxSizing:'border-box', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:'10px', fontSize:'13px', outline:'none', background:'#fff', color:'#1C1917' }} />
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {(['all', ...ROLES.map(r => r.value)] as (Role | 'all')[]).map(r => (
            <button key={r} onClick={() => setFilterRole(r)}
              style={{
                padding:'7px 14px', borderRadius:'8px', border:'1.5px solid',
                borderColor: filterRole === r ? (r === 'all' ? '#6366F1' : ROLE_COLORS[r as Role]) : 'rgba(0,0,0,0.1)',
                background: filterRole === r ? (r === 'all' ? 'rgba(99,102,241,0.08)' : ROLE_BG[r as Role]) : 'transparent',
                color: filterRole === r ? (r === 'all' ? '#6366F1' : ROLE_COLORS[r as Role]) : '#78716C',
                fontSize:'12px', fontWeight:'700', cursor:'pointer', transition:'all 0.2s',
              }}>
              {r === 'all' ? 'Tous' : ROLES.find(ro=>ro.value===r)?.icon + ' ' + ROLES.find(ro=>ro.value===r)?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members table */}
      <div style={{ background:'#fff', borderRadius:'20px', border:'1px solid rgba(0,0,0,0.07)', overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,0.05)' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'rgba(99,102,241,0.04)', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
              {['Membre', 'Rôle', 'Statut', 'Membre depuis', 'Dernière activité', ''].map(h => (
                <th key={h} style={{ padding:'14px 18px', textAlign:'left', fontSize:'11px', fontWeight:'700', color:'#78716C', letterSpacing:'0.7px', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => (
              <tr key={m.id} style={{ borderBottom: idx < filtered.length-1 ? '1px solid rgba(0,0,0,0.05)' : 'none', transition:'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding:'16px 18px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:`linear-gradient(135deg,${ROLE_COLORS[m.role]}22,${ROLE_COLORS[m.role]}44)`, display:'flex', alignItems:'center', justifyContent:'center', color:ROLE_COLORS[m.role], fontWeight:'800', fontSize:'13px', flexShrink:0 }}>
                      {m.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight:'700', fontSize:'14px', color:'#1C1917' }}>{m.name}</div>
                      <div style={{ fontSize:'12px', color:'#A8A29E' }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:'16px 18px' }}>
                  {editId === m.id ? (
                    <select defaultValue={m.role} onChange={e => updateRole(m.id, e.target.value as Role)} autoFocus
                      style={{ padding:'7px 10px', borderRadius:'8px', border:'1.5px solid #6366F1', fontSize:'12px', fontWeight:'700', cursor:'pointer', outline:'none', color:'#1C1917' }}>
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
                    </select>
                  ) : (
                    <span onClick={() => m.id !== '1' && setEditId(m.id)}
                      title={m.id !== '1' ? 'Cliquer pour modifier' : undefined}
                      style={{
                        display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 12px', borderRadius:'8px',
                        background: ROLE_BG[m.role], color: ROLE_COLORS[m.role], fontWeight:'700', fontSize:'12px',
                        cursor: m.id !== '1' ? 'pointer' : 'default', border:`1px solid ${ROLE_COLORS[m.role]}30`,
                      }}>
                      {ROLES.find(r => r.value === m.role)?.icon} {ROLES.find(r => r.value === m.role)?.label}
                      {m.id !== '1' && <span style={{ fontSize:'10px', opacity:0.6 }}>✏️</span>}
                    </span>
                  )}
                </td>
                <td style={{ padding:'16px 18px' }}>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:'700',
                    background: m.status === 'actif' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: m.status === 'actif' ? '#059669' : '#D97706',
                  }}>
                    <span style={{ width:'6px', height:'6px', borderRadius:'50%', background: m.status === 'actif' ? '#10B981' : '#F59E0B' }} />
                    {m.status === 'actif' ? 'Actif' : 'En attente'}
                  </span>
                </td>
                <td style={{ padding:'16px 18px', fontSize:'13px', color:'#78716C' }}>{m.joinedAt}</td>
                <td style={{ padding:'16px 18px', fontSize:'13px', color:'#78716C' }}>{m.lastSeen || '—'}</td>
                <td style={{ padding:'16px 18px' }}>
                  {m.id !== '1' && (
                    <button onClick={() => removeMember(m.id)}
                      style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.05)', color:'#EF4444', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>
                      Retirer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:'48px', textAlign:'center', color:'#A8A29E' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔍</div>
            <div style={{ fontWeight:'700' }}>Aucun membre trouvé</div>
          </div>
        )}
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'20px' }}>
          <div style={{ background:'#fff', borderRadius:'24px', padding:'36px', width:'100%', maxWidth:'480px', boxShadow:'0 32px 80px rgba(0,0,0,0.25)' }}>
            {invSent ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:'56px', marginBottom:'16px' }}>🎉</div>
                <h3 style={{ fontSize:'20px', fontWeight:'800', color:'#1C1917', marginBottom:'8px' }}>Invitation envoyée !</h3>
                <p style={{ color:'#78716C', fontSize:'14px' }}>Un email a été envoyé à <strong>{invEmail}</strong> avec les instructions de connexion.</p>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
                  <h2 style={{ fontSize:'20px', fontWeight:'800', color:'#1C1917', margin:0 }}>Inviter un membre</h2>
                  <button onClick={() => setShowInvite(false)} style={{ border:'none', background:'rgba(0,0,0,0.06)', borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', fontSize:'16px' }}>✕</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  <div>
                    <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#57534E', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Nom complet</label>
                    <input value={invName} onChange={e=>setInvName(e.target.value)} placeholder="Prénom Nom"
                      style={{ width:'100%', padding:'11px 14px', boxSizing:'border-box', border:'1.5px solid rgba(0,0,0,0.12)', borderRadius:'10px', fontSize:'14px', outline:'none', color:'#1C1917' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#57534E', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Adresse email</label>
                    <input value={invEmail} onChange={e=>setInvEmail(e.target.value)} placeholder="membre@exemple.com" type="email"
                      style={{ width:'100%', padding:'11px 14px', boxSizing:'border-box', border:'1.5px solid rgba(0,0,0,0.12)', borderRadius:'10px', fontSize:'14px', outline:'none', color:'#1C1917' }} />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'12px', fontWeight:'700', color:'#57534E', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Rôle</label>
                    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                      {ROLES.map(r => (
                        <label key={r.value} style={{ display:'flex', alignItems:'flex-start', gap:'12px', padding:'12px', borderRadius:'12px', cursor:'pointer', border:`1.5px solid ${invRole===r.value ? r.color : 'rgba(0,0,0,0.08)'}`, background: invRole===r.value ? `${r.color}0D` : 'transparent', transition:'all 0.2s' }}>
                          <input type="radio" name="role" value={r.value} checked={invRole===r.value} onChange={() => setInvRole(r.value)} style={{ marginTop:'2px', accentColor:r.color }} />
                          <div>
                            <div style={{ fontWeight:'700', fontSize:'13px', color:'#1C1917' }}>{r.icon} {r.label}</div>
                            <div style={{ fontSize:'11px', color:'#78716C', marginTop:'2px' }}>{r.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'10px', marginTop:'8px' }}>
                    <button onClick={() => setShowInvite(false)} style={{ flex:1, padding:'12px', borderRadius:'10px', border:'1.5px solid rgba(0,0,0,0.12)', background:'transparent', fontWeight:'700', fontSize:'14px', cursor:'pointer', color:'#57534E' }}>Annuler</button>
                    <button onClick={sendInvite} disabled={!invEmail || !invName}
                      style={{ flex:2, padding:'12px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,#6366F1,#A855F7)', color:'#fff', fontWeight:'800', fontSize:'14px', cursor: invEmail && invName ? 'pointer' : 'default', opacity: invEmail && invName ? 1 : 0.5 }}>
                      📨 Envoyer l'invitation
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Permissions matrix modal */}
      {showMatrix && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'#fff', borderRadius:'24px', padding:'36px', width:'100%', maxWidth:'700px', boxShadow:'0 32px 80px rgba(0,0,0,0.25)', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
              <h2 style={{ fontSize:'20px', fontWeight:'800', color:'#1C1917', margin:0 }}>📋 Matrice des droits</h2>
              <button onClick={() => setShowMatrix(false)} style={{ border:'none', background:'rgba(0,0,0,0.06)', borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', fontSize:'16px' }}>✕</button>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                <thead>
                  <tr>
                    <th style={{ padding:'10px 14px', textAlign:'left', color:'#57534E', fontWeight:'700', borderBottom:'2px solid rgba(0,0,0,0.08)' }}>Permission</th>
                    {ROLES.map(r => (
                      <th key={r.value} style={{ padding:'10px 12px', textAlign:'center', color: r.color, fontWeight:'800', borderBottom:'2px solid rgba(0,0,0,0.08)', whiteSpace:'nowrap' }}>
                        {r.icon} {r.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { perm:'Voir le tableau de bord',       vals:[1,1,1,1,0] },
                    { perm:'Gérer les utilisateurs',        vals:[1,1,0,0,0] },
                    { perm:'Créer des cours',               vals:[1,1,1,0,0] },
                    { perm:'Modifier des cours',            vals:[1,1,1,0,0] },
                    { perm:'Publier des contenus',          vals:[1,1,1,0,0] },
                    { perm:'Voir les analytics',            vals:[1,1,0,1,0] },
                    { perm:'Exporter des rapports',         vals:[1,1,0,1,0] },
                    { perm:'Gérer la marketplace',          vals:[1,1,0,0,0] },
                    { perm:'Configurer la plateforme',      vals:[1,0,0,0,0] },
                    { perm:'Gérer White Label',             vals:[1,0,0,0,0] },
                    { perm:'Gérer l\'équipe',               vals:[1,1,0,0,0] },
                    { perm:'Accès facturation',             vals:[1,0,0,0,0] },
                    { perm:'Voir contenus assignés',        vals:[1,1,1,1,1] },
                    { perm:'Commenter',                     vals:[1,1,1,1,1] },
                  ].map((row, i) => (
                    <tr key={row.perm} style={{ background: i % 2 === 0 ? 'rgba(99,102,241,0.02)' : 'transparent' }}>
                      <td style={{ padding:'10px 14px', color:'#1C1917', fontWeight:'600', borderBottom:'1px solid rgba(0,0,0,0.05)' }}>{row.perm}</td>
                      {row.vals.map((v, vi) => (
                        <td key={vi} style={{ padding:'10px 12px', textAlign:'center', borderBottom:'1px solid rgba(0,0,0,0.05)', fontSize:'16px' }}>
                          {v ? <span style={{ color:'#10B981' }}>✓</span> : <span style={{ color:'rgba(0,0,0,0.15)' }}>—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
