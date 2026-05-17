'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ──────────────────────────────────────────────────────────────────
type SessionStatus = 'live' | 'scheduled' | 'ended'
interface LiveSession {
  id: string
  title: string
  host: string
  hostInitials: string
  date: string
  time: string
  duration: string
  topic: string
  participants: number
  maxParticipants: number
  status: SessionStatus
  meetingID: string
  attendeePW: string
  moderatorPW: string
  color: string
}

// ─── Mock sessions (remplacées par données réelles en prod) ──────────────────
const INITIAL_SESSIONS: LiveSession[] = [
  {
    id: '1', title: 'Data Science — Module 3 : ML supervisé', host: 'Dr. Aminata Diallo',
    hostInitials: 'AD', date: 'Aujourd\'hui', time: '15:00', duration: '90 min',
    topic: 'Algorithmes de classification', participants: 24, maxParticipants: 50,
    status: 'live', meetingID: 'etagia-data-ml-001', attendeePW: 'ap', moderatorPW: 'mp',
    color: '#E8651A',
  },
  {
    id: '2', title: 'Marketing Digital — Stratégie Social Media', host: 'Moussa Konaté',
    hostInitials: 'MK', date: 'Aujourd\'hui', time: '17:30', duration: '60 min',
    topic: 'Algorithmes Facebook & Instagram', participants: 0, maxParticipants: 40,
    status: 'scheduled', meetingID: 'etagia-mkt-social-002', attendeePW: 'ap', moderatorPW: 'mp',
    color: '#00BFA5',
  },
  {
    id: '3', title: 'Leadership & Management — Session Live Q&A', host: 'Fatou Sarr',
    hostInitials: 'FS', date: 'Demain', time: '10:00', duration: '45 min',
    topic: 'Gestion des conflits en équipe', participants: 0, maxParticipants: 60,
    status: 'scheduled', meetingID: 'etagia-lead-qa-003', attendeePW: 'ap', moderatorPW: 'mp',
    color: '#7C3AED',
  },
  {
    id: '4', title: 'Comptabilité SME — Bilan & Résultat', host: 'Ibrahim Touré',
    hostInitials: 'IT', date: 'Hier', time: '14:00', duration: '75 min',
    topic: 'Lecture du bilan financier', participants: 31, maxParticipants: 35,
    status: 'ended', meetingID: 'etagia-compta-004', attendeePW: 'ap', moderatorPW: 'mp',
    color: '#FFB300',
  },
]

// ─── Palette ─────────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#FFFFFF', border: '1px solid rgba(28,25,23,0.08)',
  borderRadius: '16px', boxShadow: '0 2px 12px rgba(28,25,23,0.04)',
}
const STATUS_CFG: Record<SessionStatus, { label: string; dot: string; bg: string; text: string }> = {
  live:      { label: '🔴 EN DIRECT', dot: '#EF4444', bg: 'rgba(239,68,68,0.10)', text: '#DC2626' },
  scheduled: { label: '🕐 Programmée', dot: '#00BFA5', bg: 'rgba(0,191,165,0.10)', text: '#00897B' },
  ended:     { label: '✓ Terminée',   dot: '#A8A29E', bg: 'rgba(168,162,158,0.12)', text: '#78716C' },
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LivePage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<LiveSession[]>(INITIAL_SESSIONS)
  const [filter, setFilter] = useState<'all' | SessionStatus>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [joining, setJoining] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', topic: '', date: '', time: '', duration: '60', maxParticipants: '30' })
  const [creating, setCreating] = useState(false)
  const [bbbStatus, setBbbStatus] = useState<'checking'|'ok'|'error'>('checking')

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }, [])

  // Check BBB server connectivity on mount
  useEffect(() => {
    fetch('/api/bbb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getMeetings' }),
    })
      .then(r => r.json())
      .then(d => setBbbStatus(d.ok ? 'ok' : 'error'))
      .catch(() => setBbbStatus('error'))
  }, [])

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.status === filter)

  const handleJoin = async (session: LiveSession, role: 'attendee' | 'moderator' = 'attendee') => {
    setJoining(session.id)
    try {
      // First ensure the meeting exists (create if not running)
      if (session.status === 'scheduled') {
        await fetch('/api/bbb', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'createMeeting', meetingID: session.meetingID,
            name: session.title, attendeePW: session.attendeePW, moderatorPW: session.moderatorPW }),
        })
        setSessions(prev => prev.map(s => s.id === session.id ? { ...s, status: 'live', participants: 1 } : s))
      }
      const res = await fetch('/api/bbb', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'joinMeeting', meetingID: session.meetingID,
          fullName: 'Lamine Gaye', role, attendeePW: session.attendeePW, moderatorPW: session.moderatorPW }),
      })
      const data = await res.json()
      if (data.ok && data.joinUrl) {
        window.open(data.joinUrl, '_blank', 'noopener,noreferrer')
        showToast('Ouverture de la salle BigBlueButton…')
      } else {
        showToast('❌ Impossible de rejoindre la session')
      }
    } catch {
      showToast('❌ Erreur de connexion au serveur BBB')
    } finally {
      setJoining(null)
    }
  }

  const handleCreate = async () => {
    if (!form.title || !form.date || !form.time) return
    setCreating(true)
    const meetingID = 'etagia-' + Date.now()
    try {
      const res = await fetch('/api/bbb', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createMeeting', meetingID, name: form.title }),
      })
      const data = await res.json()
      const newSession: LiveSession = {
        id: meetingID, title: form.title, host: 'Lamine Gaye', hostInitials: 'LG',
        date: form.date, time: form.time, duration: form.duration + ' min', topic: form.topic,
        participants: 0, maxParticipants: parseInt(form.maxParticipants),
        status: 'scheduled', meetingID, attendeePW: 'ap', moderatorPW: 'mp',
        color: '#E8651A',
      }
      setSessions(prev => [newSession, ...prev])
      setShowCreate(false)
      setForm({ title: '', topic: '', date: '', time: '', duration: '60', maxParticipants: '30' })
      showToast(data.ok ? '✅ Classe créée sur BigBlueButton !' : '✅ Classe créée (mode démo)')
    } catch {
      showToast('❌ Erreur lors de la création')
    } finally {
      setCreating(false)
    }
  }

  const inpStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
    border: '1px solid rgba(28,25,23,0.12)', background: '#FAF9F7',
    color: '#1C1917', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: '1000px' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
          background: '#1C1917', color: '#FAF9F7', padding: '12px 20px', borderRadius: '12px',
          fontSize: '14px', fontWeight: '600', boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          animation: 'fadeIn .2s ease' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem', padding: '2rem', borderRadius: '24px',
        background: 'linear-gradient(135deg,#E8651A 0%,#D4A017 100%)',
        boxShadow: '0 8px 32px rgba(232,101,26,0.28)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '240px', height: '240px',
          borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.12),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '32px' }}>🎥</span>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', fontFamily: 'Syne,sans-serif', margin: 0 }}>
                Classes en direct
              </h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: 0 }}>
              Sessions live BigBlueButton · Conférences · Q&amp;A en temps réel
            </p>
            {/* BBB Status */}
            <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.18)', borderRadius: '20px', padding: '5px 12px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%',
                background: bbbStatus === 'ok' ? '#4ADE80' : bbbStatus === 'error' ? '#FCA5A5' : '#FCD34D' }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>
                Serveur BBB : {bbbStatus === 'ok' ? 'Connecté' : bbbStatus === 'error' ? 'Non configuré' : 'Vérification…'}
              </span>
            </div>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            background: '#fff', border: 'none', borderRadius: '14px', padding: '12px 22px',
            fontWeight: '800', fontSize: '14px', color: '#E8651A', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>+</span> Créer une classe
          </button>
        </div>
      </div>

      {/* BBB info banner if not configured */}
      {bbbStatus === 'error' && (
        <div style={{ ...card, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '12px',
          borderLeft: '4px solid #D4A017', background: 'rgba(212,160,23,0.05)' }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>ℹ️</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1C1917', marginBottom: '4px' }}>
              Configurez votre serveur BigBlueButton
            </div>
            <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.6' }}>
              Ajoutez <code style={{ background: '#FAF9F7', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>BBB_URL</code> et{' '}
              <code style={{ background: '#FAF9F7', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>BBB_SECRET</code> dans
              les variables d'environnement Vercel. En attendant, les sessions fonctionnent en mode démonstration.
            </div>
          </div>
        </div>
      )}

      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'En direct maintenant', value: sessions.filter(s=>s.status==='live').length.toString(), icon: '🔴', color: '#EF4444', bg: 'rgba(239,68,68,0.07)' },
          { label: 'Programmées', value: sessions.filter(s=>s.status==='scheduled').length.toString(), icon: '📅', color: '#00BFA5', bg: 'rgba(0,191,165,0.07)' },
          { label: 'Participants actifs', value: sessions.filter(s=>s.status==='live').reduce((a,s)=>a+s.participants,0).toString(), icon: '👥', color: '#E8651A', bg: 'rgba(232,101,26,0.07)' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: '1.1rem 1.25rem', background: s.bg, border: `1px solid ${s.color}22` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: s.color, fontFamily: 'Syne,sans-serif' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#57534E' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
        {(['all','live','scheduled','ended'] as const).map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
            border: `1px solid ${filter===f ? '#E8651A' : 'rgba(28,25,23,0.10)'}`,
            background: filter===f ? '#E8651A' : 'transparent',
            color: filter===f ? '#fff' : '#A8A29E', cursor: 'pointer', transition: 'all .15s',
          }}>
            { f==='all' ? 'Toutes' : f==='live' ? '🔴 En direct' : f==='scheduled' ? 'Programmées' : 'Terminées' }
          </button>
        ))}
      </div>

      {/* Session list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(session => {
          const cfg = STATUS_CFG[session.status]
          const pct = Math.round((session.participants / session.maxParticipants) * 100)
          return (
            <div key={session.id} style={{ ...card, padding: '1.25rem 1.5rem',
              borderLeft: `4px solid ${session.color}`,
              opacity: session.status === 'ended' ? 0.72 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                {/* Left */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px',
                      background: cfg.bg, color: cfg.text, letterSpacing: '0.5px' }}>{cfg.label}</span>
                    {session.status === 'live' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444',
                          boxShadow: '0 0 0 3px rgba(239,68,68,0.25)', animation: 'pulse 1.5s infinite' }} />
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#1C1917', marginBottom: '4px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.title}</div>
                  <div style={{ fontSize: '12px', color: '#57534E', marginBottom: '10px' }}>🎯 {session.topic}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Host */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%',
                        background: `linear-gradient(135deg,${session.color},${session.color}99)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: '800', color: '#fff', flexShrink: 0 }}>{session.hostInitials}</div>
                      <span style={{ fontSize: '12px', color: '#57534E' }}>{session.host}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#A8A29E' }}>📅 {session.date} à {session.time}</span>
                    <span style={{ fontSize: '12px', color: '#A8A29E' }}>⏱ {session.duration}</span>
                  </div>
                  {/* Participants bar */}
                  {session.status !== 'ended' && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#A8A29E' }}>Participants</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: session.color }}>{session.participants}/{session.maxParticipants}</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(28,25,23,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${session.color},${session.color}88)`, borderRadius: '2px', transition: 'width .5s' }} />
                      </div>
                    </div>
                  )}
                </div>
                {/* Right — actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                  {session.status === 'live' && (
                    <>
                      <button onClick={() => handleJoin(session, 'attendee')} disabled={joining===session.id}
                        style={{ background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '10px',
                          padding: '10px 20px', color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(232,101,26,0.35)', opacity: joining===session.id ? 0.7 : 1,
                          whiteSpace: 'nowrap' }}>
                        {joining===session.id ? '…' : '▶ Rejoindre'}
                      </button>
                      <button onClick={() => handleJoin(session, 'moderator')} disabled={joining===session.id}
                        style={{ background: 'transparent', border: '1px solid rgba(28,25,23,0.12)', borderRadius: '10px',
                          padding: '8px 16px', color: '#57534E', fontWeight: '600', fontSize: '12px', cursor: 'pointer',
                          whiteSpace: 'nowrap' }}>
                        🎙 En tant que formateur
                      </button>
                    </>
                  )}
                  {session.status === 'scheduled' && (
                    <button onClick={() => handleJoin(session, 'moderator')} disabled={joining===session.id}
                      style={{ background: 'linear-gradient(135deg,#00BFA5,#00897B)', border: 'none', borderRadius: '10px',
                        padding: '10px 20px', color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(0,191,165,0.30)', opacity: joining===session.id ? 0.7 : 1,
                        whiteSpace: 'nowrap' }}>
                      {joining===session.id ? '…' : '▶ Démarrer'}
                    </button>
                  )}
                  {session.status === 'ended' && (
                    <span style={{ fontSize: '12px', color: '#A8A29E', fontStyle: 'italic' }}>Session archivée</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <div style={{ fontWeight: '700', color: '#1C1917', marginBottom: '6px' }}>Aucune session</div>
            <div style={{ fontSize: '13px', color: '#A8A29E' }}>Créez votre première classe en direct</div>
          </div>
        )}
      </div>

      {/* BBB Info Card */}
      <div style={{ ...card, padding: '1.25rem 1.5rem', marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg,#1C6EAD,#0A4D8C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎓</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: '#1C1917', marginBottom: '3px' }}>
            Propulsé par BigBlueButton
          </div>
          <div style={{ fontSize: '12px', color: '#A8A29E' }}>
            Conférences web open-source · Tableau blanc · Sondages · Enregistrement · Sous-titres automatiques
          </div>
        </div>
        <a href="https://bigbluebutton.org" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '12px', fontWeight: '600', color: '#E8651A', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          En savoir plus →
        </a>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreate(false) }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.20)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1C1917', margin: 0 }}>Créer une classe en direct</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#A8A29E' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#57534E', display: 'block', marginBottom: '5px' }}>Titre de la session *</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}
                  placeholder="Ex : Data Science — Module 4 : Deep Learning"
                  style={inpStyle} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#57534E', display: 'block', marginBottom: '5px' }}>Sujet / Objectif</label>
                <input value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))}
                  placeholder="Ce que les apprenants vont apprendre"
                  style={inpStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#57534E', display: 'block', marginBottom: '5px' }}>Date *</label>
                  <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inpStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#57534E', display: 'block', marginBottom: '5px' }}>Heure *</label>
                  <input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={inpStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#57534E', display: 'block', marginBottom: '5px' }}>Durée (min)</label>
                  <select value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} style={inpStyle}>
                    {['30','45','60','90','120'].map(d => <option key={d} value={d}>{d} min</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#57534E', display: 'block', marginBottom: '5px' }}>Max participants</label>
                  <input type="number" min="5" max="200" value={form.maxParticipants}
                    onChange={e=>setForm(f=>({...f,maxParticipants:e.target.value}))} style={inpStyle} />
                </div>
              </div>
              <button onClick={handleCreate} disabled={creating || !form.title || !form.date || !form.time}
                style={{ background: creating ? '#A8A29E' : 'linear-gradient(135deg,#E8651A,#D4A017)',
                  border: 'none', borderRadius: '12px', padding: '14px', color: '#fff', fontWeight: '800',
                  fontSize: '15px', cursor: creating ? 'not-allowed' : 'pointer',
                  boxShadow: creating ? 'none' : '0 4px 20px rgba(232,101,26,0.35)', marginTop: '4px' }}>
                {creating ? 'Création en cours…' : '🎥 Créer la classe BigBlueButton'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
