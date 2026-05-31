'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────
type EventType = 'live' | 'deadline' | 'cours' | 'reunion' | 'evaluation'
interface CalEvent {
  id: string; title: string; type: EventType
  date: string; time?: string; duration?: string
  color: string; desc?: string; participants?: number
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const TYPE_CFG: Record<EventType, { label: string; color: string; bg: string; icon: string }> = {
  live:       { label: 'Classe live',   color: '#EF4444', bg: 'rgba(239,68,68,0.10)',   icon: '🔴' },
  deadline:   { label: 'Échéance',      color: '#E8651A', bg: 'rgba(232,101,26,0.10)',  icon: '⏰' },
  cours:      { label: 'Cours',         color: '#00BFA5', bg: 'rgba(0,191,165,0.10)',   icon: '📚' },
  reunion:    { label: 'Réunion',       color: '#7C3AED', bg: 'rgba(124,58,237,0.10)',  icon: '👥' },
  evaluation: { label: 'Évaluation',   color: '#D4A017', bg: 'rgba(212,160,23,0.10)',  icon: '📝' },
}
const card: React.CSSProperties = { background:'#FFFFFF', border:'1px solid rgba(28,25,23,0.08)', borderRadius:'16px', boxShadow:'0 2px 12px rgba(28,25,23,0.04)' }

// ─── Données initiales ────────────────────────────────────────────────────────
const today = new Date()
const y = today.getFullYear(), m = today.getMonth()
const pad = (n: number) => String(n).padStart(2,'0')
const dt = (d: number) => `${y}-${pad(m+1)}-${pad(d)}`

const INITIAL_EVENTS: CalEvent[] = [
  { id:'e1', title:'Data Science — ML Supervisé', type:'live', date:dt(today.getDate()), time:'15:00', duration:'90 min', color:'#EF4444', desc:'Module 3 — Algorithmes de classification', participants:24 },
  { id:'e2', title:'Remise devoirs Python', type:'deadline', date:dt(today.getDate()+2), color:'#E8651A', desc:'Exercices chapitres 4 à 7' },
  { id:'e3', title:'Marketing Digital — Social Media', type:'live', date:dt(today.getDate()+3), time:'17:30', duration:'60 min', color:'#EF4444', participants:18 },
  { id:'e4', title:'Correction quiz Leadership', type:'evaluation', date:dt(today.getDate()+4), time:'10:00', color:'#D4A017', desc:'50 copies à corriger' },
  { id:'e5', title:'Réunion équipe pédagogique', type:'reunion', date:dt(today.getDate()+5), time:'14:00', duration:'45 min', color:'#7C3AED', participants:6 },
  { id:'e6', title:'Publication cours Comptabilité', type:'cours', date:dt(today.getDate()+7), color:'#00BFA5', desc:'Module 5 — Bilan & résultat' },
  { id:'e7', title:'Évaluation finale Data Science', type:'evaluation', date:dt(today.getDate()+10), time:'09:00', duration:'120 min', color:'#D4A017', participants:24 },
  { id:'e8', title:'Live Q&A Leadership', type:'live', date:dt(today.getDate()+12), time:'11:00', duration:'45 min', color:'#EF4444', participants:31 },
  { id:'e9', title:'Deadline mémoire projet', type:'deadline', date:dt(today.getDate()+15), color:'#E8651A' },
  { id:'e10', title:'Réunion direction', type:'reunion', date:dt(today.getDate()+18), time:'09:30', color:'#7C3AED', participants:4 },
]

const DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

// ─── Component ────────────────────────────────────────────────────────────────
export default function CalendrierPage() {
  const router = useRouter()
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS)
  const [currentDate, setCurrentDate] = useState(new Date(y, m, 1))
  const [view, setView] = useState<'month'|'week'|'list'>('month')
  const [selected, setSelected] = useState<CalEvent | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', type:'cours' as EventType, date:'', time:'', duration:'60', desc:'' })

  const curY = currentDate.getFullYear()
  const curM = currentDate.getMonth()

  // Jours du mois
  const daysInMonth = new Date(curY, curM+1, 0).getDate()
  const firstDayOfWeek = (new Date(curY, curM, 1).getDay() + 6) % 7 // Lundi = 0

  const eventsMap = useMemo(() => {
    const map: Record<string, CalEvent[]> = {}
    events.forEach(e => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [events])

  const upcomingEvents = useMemo(() =>
    [...events]
      .filter(e => e.date >= dt(today.getDate()))
      .sort((a,b) => a.date.localeCompare(b.date))
      .slice(0, 8),
    [events]
  )

  const addEvent = () => {
    if (!form.title || !form.date) return
    const cfg = TYPE_CFG[form.type]
    const newEvt: CalEvent = { id:'e'+Date.now(), ...form, color: cfg.color }
    setEvents(prev => [...prev, newEvt])
    setShowForm(false)
    setForm({ title:'', type:'cours', date:'', time:'', duration:'60', desc:'' })
  }

  const inpStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:'9px', border:'1px solid rgba(28,25,23,0.12)', background:'#FAF9F7', color:'#1C1917', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }
  const labelStyle: React.CSSProperties = { fontSize:'11px', fontWeight:'700', color:'#57534E', textTransform:'uppercase' as const, letterSpacing:'0.5px', display:'block', marginBottom:'5px' }

  return (
    <div

      {/* Hero orange */}
      <div style={{ borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #F4591F 0%, #FF8C42 50%, #FFB347 100%)', boxShadow: '0 6px 24px rgba(244,89,31,0.25)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Planning</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.3px', marginBottom: '3px' }}>Calendrier & Planning</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>Organisez vos sessions de formation.</p>
      </div>
 style={{ maxWidth:'1100px' }}>

      {/* Header */}
      <div style={{ marginBottom:'1.75rem', padding:'1.75rem 2rem', borderRadius:'20px', background:'linear-gradient(135deg,#E8651A 0%,#D4A017 100%)', boxShadow:'0 8px 32px rgba(232,101,26,0.28)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-50px', right:'-30px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.12),transparent 70%)', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' }}>
              <span style={{ fontSize:'28px' }}>📅</span>
              <h1 style={{ fontSize:'24px', fontWeight:'800', color:'#fff', fontFamily:'Syne,sans-serif', margin:0 }}>Planning du formateur</h1>
            </div>
            <p style={{ color:'rgba(255,255,255,0.80)', fontSize:'13px', margin:0 }}>
              {MONTHS_FR[curM]} {curY} · {events.filter(e => e.date.startsWith(`${curY}-${pad(curM+1)}`)).length} événements ce mois
            </p>
          </div>
          <button onClick={() => setShowForm(true)} style={{ background:'#fff', border:'none', borderRadius:'12px', padding:'11px 22px', fontWeight:'800', fontSize:'14px', color:'#E8651A', cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'18px' }}>+</span> Ajouter un événement
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'1.5rem' }}>

        {/* Calendrier principal */}
        <div>
          {/* Navigation + vues */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <button onClick={() => setCurrentDate(new Date(curY, curM-1, 1))} style={{ background:'transparent', border:'1px solid rgba(28,25,23,0.10)', borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
              <span style={{ fontWeight:'800', fontSize:'18px', color:'#1C1917', fontFamily:'Syne,sans-serif', minWidth:'180px', textAlign:'center' }}>
                {MONTHS_FR[curM]} {curY}
              </span>
              <button onClick={() => setCurrentDate(new Date(curY, curM+1, 1))} style={{ background:'transparent', border:'1px solid rgba(28,25,23,0.10)', borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
              <button onClick={() => setCurrentDate(new Date(y, m, 1))} style={{ background:'rgba(232,101,26,0.10)', border:'none', borderRadius:'8px', padding:'6px 14px', color:'#E8651A', fontWeight:'700', fontSize:'12px', cursor:'pointer' }}>
                Aujourd&apos;hui
              </button>
            </div>
            <div style={{ display:'flex', gap:'4px', background:'#F4F2F0', borderRadius:'10px', padding:'3px' }}>
              {(['month','week','list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{ padding:'6px 14px', borderRadius:'7px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'700', background:view===v ? '#fff' : 'transparent', color:view===v ? '#E8651A' : '#A8A29E', boxShadow:view===v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition:'all .15s' }}>
                  {v === 'month' ? 'Mois' : v === 'week' ? 'Semaine' : 'Liste'}
                </button>
              ))}
            </div>
          </div>

          {/* Vue Mois */}
          {view === 'month' && (
            <div style={{ ...card, overflow:'hidden' }}>
              {/* En-têtes jours */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:'1px solid rgba(28,25,23,0.06)' }}>
                {DAYS_FR.map(d => (
                  <div key={d} style={{ padding:'10px', textAlign:'center', fontSize:'11px', fontWeight:'800', color:'#A8A29E', letterSpacing:'1px', textTransform:'uppercase' }}>{d}</div>
                ))}
              </div>
              {/* Grille des jours */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
                {/* Cases vides avant le 1er */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ minHeight:'90px', borderRight:'1px solid rgba(28,25,23,0.05)', borderBottom:'1px solid rgba(28,25,23,0.05)', background:'rgba(28,25,23,0.01)' }} />
                ))}
                {/* Jours du mois */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateStr = `${curY}-${pad(curM+1)}-${pad(day)}`
                  const dayEvents = eventsMap[dateStr] || []
                  const isToday = dateStr === `${y}-${pad(m+1)}-${pad(today.getDate())}`
                  const col = (firstDayOfWeek + i) % 7
                  const isWeekend = col === 5 || col === 6
                  return (
                    <div key={day} style={{ minHeight:'90px', borderRight:'1px solid rgba(28,25,23,0.05)', borderBottom:'1px solid rgba(28,25,23,0.05)', padding:'6px', background:isToday ? 'rgba(232,101,26,0.04)' : isWeekend ? 'rgba(28,25,23,0.01)' : '#fff', cursor: dayEvents.length ? 'pointer' : 'default', transition:'background .15s' }}
                      onMouseEnter={e => { if(!isToday)(e.currentTarget as HTMLElement).style.background = 'rgba(232,101,26,0.03)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isToday ? 'rgba(232,101,26,0.04)' : isWeekend ? 'rgba(28,25,23,0.01)' : '#fff' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'26px', height:'26px', borderRadius:'50%', background:isToday ? '#E8651A' : 'transparent', color:isToday ? '#fff' : isWeekend ? '#A8A29E' : '#1C1917', fontWeight:isToday ? '800' : '500', fontSize:'13px', marginBottom:'4px' }}>
                        {day}
                      </div>
                      {dayEvents.slice(0,3).map(evt => {
                        const cfg = TYPE_CFG[evt.type]
                        return (
                          <div key={evt.id} onClick={() => setSelected(evt)} style={{ background:cfg.bg, borderLeft:`2.5px solid ${cfg.color}`, borderRadius:'4px', padding:'2px 5px', marginBottom:'2px', fontSize:'10px', fontWeight:'600', color:cfg.color, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', cursor:'pointer' }}>
                            {cfg.icon} {evt.title}
                          </div>
                        )
                      })}
                      {dayEvents.length > 3 && <div style={{ fontSize:'10px', color:'#A8A29E', fontWeight:'600', paddingLeft:'4px' }}>+{dayEvents.length-3} autres</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Vue Liste */}
          {view === 'list' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {events.sort((a,b)=>a.date.localeCompare(b.date)).map(evt => {
                const cfg = TYPE_CFG[evt.type]
                return (
                  <div key={evt.id} onClick={() => setSelected(evt)} style={{ ...card, padding:'14px 16px', display:'flex', alignItems:'center', gap:'14px', cursor:'pointer', borderLeft:`4px solid ${cfg.color}`, transition:'all .15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FFF8F5'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#fff'}>
                    <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{cfg.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:'700', fontSize:'14px', color:'#1C1917', marginBottom:'3px' }}>{evt.title}</div>
                      <div style={{ fontSize:'12px', color:'#A8A29E' }}>
                        📅 {evt.date}{evt.time ? ` · ${evt.time}` : ''}{evt.duration ? ` · ${evt.duration}` : ''}
                        {evt.participants ? ` · 👥 ${evt.participants}` : ''}
                      </div>
                    </div>
                    <span style={{ fontSize:'10px', fontWeight:'800', background:cfg.bg, color:cfg.color, borderRadius:'6px', padding:'3px 9px', whiteSpace:'nowrap' as const }}>{cfg.label}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Vue Semaine */}
          {view === 'week' && (
            <div style={{ ...card, padding:'1.25rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'60px repeat(7,1fr)', gap:'4px' }}>
                <div />
                {DAYS_FR.map((d, i) => {
                  const date = new Date(today)
                  date.setDate(today.getDate() - today.getDay() + i + 1)
                  const dateStr = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`
                  const isToday = dateStr === `${y}-${pad(m+1)}-${pad(today.getDate())}`
                  return (
                    <div key={d} style={{ textAlign:'center', padding:'8px 4px', borderRadius:'10px', background:isToday ? 'rgba(232,101,26,0.08)' : 'transparent' }}>
                      <div style={{ fontSize:'10px', fontWeight:'700', color:'#A8A29E', marginBottom:'4px' }}>{d}</div>
                      <div style={{ fontSize:'16px', fontWeight:'800', color:isToday ? '#E8651A' : '#1C1917' }}>{date.getDate()}</div>
                      {(eventsMap[dateStr] || []).map(e => {
                        const cfg = TYPE_CFG[e.type]
                        return <div key={e.id} onClick={() => setSelected(e)} style={{ marginTop:'4px', background:cfg.bg, borderRadius:'6px', padding:'3px 4px', fontSize:'10px', fontWeight:'600', color:cfg.color, cursor:'pointer' }}>{cfg.icon} {e.title.slice(0,12)}…</div>
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar droite */}
        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {/* Légende */}
          <div style={{ ...card, padding:'1rem' }}>
            <div style={{ fontSize:'11px', fontWeight:'800', color:'#A8A29E', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'10px' }}>Types d&apos;événements</div>
            {Object.entries(TYPE_CFG).map(([key, cfg]) => (
              <div key={key} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'7px' }}>
                <div style={{ width:'10px', height:'10px', borderRadius:'3px', background:cfg.color, flexShrink:0 }} />
                <span style={{ fontSize:'12px', color:'#57534E' }}>{cfg.icon} {cfg.label}</span>
              </div>
            ))}
          </div>

          {/* Prochains événements */}
          <div style={{ ...card, padding:'1rem' }}>
            <div style={{ fontSize:'11px', fontWeight:'800', color:'#A8A29E', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'10px' }}>À venir</div>
            {upcomingEvents.map(evt => {
              const cfg = TYPE_CFG[evt.type]
              return (
                <div key={evt.id} onClick={() => setSelected(evt)} style={{ display:'flex', gap:'10px', alignItems:'flex-start', marginBottom:'10px', cursor:'pointer', padding:'8px', borderRadius:'10px', transition:'background .15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FFF8F5'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>{cfg.icon}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:'600', fontSize:'12px', color:'#1C1917', marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{evt.title}</div>
                    <div style={{ fontSize:'11px', color:'#A8A29E' }}>{evt.date.slice(8)} · {MONTHS_FR[parseInt(evt.date.slice(5,7))-1].slice(0,3)}{evt.time ? ` · ${evt.time}` : ''}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Lien classes live */}
          <div onClick={() => router.push('/live')} style={{ ...card, padding:'1rem', cursor:'pointer', background:'linear-gradient(135deg,rgba(239,68,68,0.06),rgba(232,101,26,0.06))', border:'1px solid rgba(239,68,68,0.15)', textAlign:'center' as const }}>
            <div style={{ fontSize:'24px', marginBottom:'6px' }}>🔴</div>
            <div style={{ fontWeight:'700', fontSize:'13px', color:'#1C1917', marginBottom:'4px' }}>Classes en direct</div>
            <div style={{ fontSize:'11px', color:'#A8A29E' }}>Gérer vos sessions BigBlueButton</div>
          </div>
        </div>
      </div>

      {/* Détail événement */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.50)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={e => { if(e.target===e.currentTarget) setSelected(null) }}>
          <div style={{ background:'#fff', borderRadius:'20px', padding:'2rem', width:'100%', maxWidth:'420px', boxShadow:'0 24px 64px rgba(0,0,0,0.20)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:TYPE_CFG[selected.type].bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>{TYPE_CFG[selected.type].icon}</div>
                <div>
                  <div style={{ fontWeight:'800', fontSize:'16px', color:'#1C1917' }}>{selected.title}</div>
                  <span style={{ fontSize:'10px', fontWeight:'800', background:TYPE_CFG[selected.type].bg, color:TYPE_CFG[selected.type].color, borderRadius:'6px', padding:'2px 8px' }}>{TYPE_CFG[selected.type].label}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#A8A29E' }}>✕</button>
            </div>
            {[
              { icon:'📅', label:'Date', val:selected.date },
              selected.time && { icon:'🕐', label:'Heure', val:selected.time },
              selected.duration && { icon:'⏱', label:'Durée', val:selected.duration },
              selected.participants && { icon:'👥', label:'Participants', val:`${selected.participants} apprenants` },
              selected.desc && { icon:'📋', label:'Description', val:selected.desc },
            ].filter(Boolean).map((row: any) => (
              <div key={row.label} style={{ display:'flex', gap:'10px', marginBottom:'10px', alignItems:'flex-start' }}>
                <span style={{ fontSize:'16px', flexShrink:0 }}>{row.icon}</span>
                <div>
                  <div style={{ fontSize:'10px', fontWeight:'700', color:'#A8A29E', textTransform:'uppercase', letterSpacing:'0.5px' }}>{row.label}</div>
                  <div style={{ fontSize:'13px', color:'#1C1917', fontWeight:'500' }}>{row.val}</div>
                </div>
              </div>
            ))}
            <div style={{ display:'flex', gap:'8px', marginTop:'1rem' }}>
              {selected.type === 'live' && (
                <button onClick={() => router.push('/live')} style={{ flex:1, background:'linear-gradient(135deg,#E8651A,#D4A017)', border:'none', borderRadius:'10px', padding:'10px', color:'#fff', fontWeight:'700', fontSize:'13px', cursor:'pointer' }}>
                  ▶ Rejoindre
                </button>
              )}
              <button onClick={() => { setEvents(prev => prev.filter(e => e.id !== selected.id)); setSelected(null) }} style={{ flex:1, background:'transparent', border:'1px solid rgba(28,25,23,0.12)', borderRadius:'10px', padding:'10px', color:'#A8A29E', fontWeight:'600', fontSize:'13px', cursor:'pointer' }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire ajout */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={e => { if(e.target===e.currentTarget) setShowForm(false) }}>
          <div style={{ background:'#fff', borderRadius:'20px', padding:'2rem', width:'100%', maxWidth:'460px', boxShadow:'0 24px 64px rgba(0,0,0,0.20)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
              <h2 style={{ fontSize:'18px', fontWeight:'800', color:'#1C1917', margin:0 }}>Nouvel événement</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#A8A29E' }}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div><span style={labelStyle}>Titre *</span><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Titre de l'événement" style={inpStyle} /></div>
              <div>
                <span style={labelStyle}>Type</span>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as EventType}))} style={inpStyle}>
                  {Object.entries(TYPE_CFG).map(([key,cfg]) => <option key={key} value={key}>{cfg.icon} {cfg.label}</option>)}
                </select>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div><span style={labelStyle}>Date *</span><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inpStyle} /></div>
                <div><span style={labelStyle}>Heure</span><input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={inpStyle} /></div>
              </div>
              <div><span style={labelStyle}>Description</span><textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} rows={2} placeholder="Détails optionnels…" style={{ ...inpStyle, resize:'vertical' as const }} /></div>
              <button onClick={addEvent} disabled={!form.title || !form.date} style={{ background:'linear-gradient(135deg,#E8651A,#D4A017)', border:'none', borderRadius:'12px', padding:'13px', color:'#fff', fontWeight:'800', fontSize:'14px', cursor:'pointer', boxShadow:'0 4px 20px rgba(232,101,26,0.35)', marginTop:'4px' }}>
                📅 Ajouter au planning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
