'use client'
import PageHero from '@/components/PageHero'
import { useState, useEffect, useCallback } from 'react'

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

// ─── Mock sessions enrichies ─────────────────────────────────────────────────
const INITIAL_SESSIONS: LiveSession[] = [
  {
    id: '1', title: 'Data Science — Module 3 : ML supervisé', host: 'Dr. Aminata Diallo',
    hostInitials: 'AD', date: "Aujourd'hui", time: '15:00', duration: '90 min',
    topic: 'Algorithmes de classification', participants: 24, maxParticipants: 50,
    status: 'live', meetingID: 'etagia-data-ml-001', attendeePW: 'ap', moderatorPW: 'mp',
    color: '#4255FF',
  },
  {
    id: '2', title: 'Marketing Digital — Stratégie Social Media', host: 'Moussa Konaté',
    hostInitials: 'MK', date: "Aujourd'hui", time: '17:30', duration: '60 min',
    topic: 'Algorithmes Facebook & Instagram', participants: 0, maxParticipants: 40,
    status: 'scheduled', meetingID: 'etagia-mkt-social-002', attendeePW: 'ap', moderatorPW: 'mp',
    color: '#4255FF',
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
  scheduled: { label: '🕐 Programmée', dot: '#4255FF', bg: 'rgba(0,191,165,0.10)', text: '#00897B' },
  ended:     { label: '✓ Terminée',   dot: '#A8A29E', bg: 'rgba(168,162,158,0.12)', text: '#78716C' },
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function LivePage() {
  const [sessions, setSessions] = useState<LiveSession[]>(INITIAL_SESSIONS)
  const [filter, setFilter] = useState<'all' | SessionStatus>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [joining, setJoining] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', topic: '', date: '', time: '', duration: '60', maxParticipants: '30' })
  const [creating, setCreating] = useState(false)
  const [bbbStatus, setBbbStatus] = useState<'checking' | 'ok' | 'error' | 'demo'>('checking')

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }, [])

  // ── Vérifier la connexion BBB au démarrage ─────────────────────────────────
  useEffect(() => {
    const checkBBB = async () => {
      try {
        const res = await fetch('/api/bbb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'getMeetings' }),
        })
        if (res.status === 503) {
          setBbbStatus('demo')
        } else if (res.ok) {
          setBbbStatus('ok')
        } else {
          setBbbStatus('error')
        }
      } catch {
        setBbbStatus('error')
      }
    }
    checkBBB()
  }, [])

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.status === filter)

  // ── Rejoindre une session ──────────────────────────────────────────────────
  const handleJoin = async (session: LiveSession, role: 'attendee' | 'moderator' = 'attendee') => {
    setJoining(session.id)

    // Mode démo — simulation locale
    if (bbbStatus === 'demo' || bbbStatus === 'checking') {
      await new Promise(r => setTimeout(r, 1200))
      if (session.status === 'scheduled') {
        setSessions(prev => prev.map(s => s.id === session.id ? { ...s, status: 'live', participants: 1 } : s))
      } else {
        setSessions(prev => prev.map(s => s.id === session.id ? { ...s, participants: s.participants + 1 } : s))
      }
      showToast(role === 'moderator'
        ? '🎙 Mode démo — Vous animez la session en tant que formateur'
        : '🎯 Mode démo — Connexion simulée avec succès')
      setJoining(null)
      return
    }

    // Mode réel — BBB connecté
    try {
      // Si la session est programmée, on la crée d'abord côté BBB
      if (session.status === 'scheduled') {
        const createRes = await fetch('/api/bbb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'createMeeting',
            meetingID: session.meetingID,
            name: session.title,
            attendeePW: session.attendeePW,
            moderatorPW: session.moderatorPW,
          }),
        })
        if (!createRes.ok) {
          const err = await createRes.json()
          showToast('❌ Erreur création salle : ' + (err.message || err.error || 'Inconnu'))
          setJoining(null)
          return
        }
        setSessions(prev => prev.map(s => s.id === session.id ? { ...s, status: 'live', participants: 0 } : s))
      }

      // Obtenir le lien de connexion BBB
      const joinRes = await fetch('/api/bbb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'joinMeeting',
          meetingID: session.meetingID,
          fullName: role === 'moderator' ? 'Formateur ETAGIA' : 'Apprenant ETAGIA',
          role,
          attendeePW: session.attendeePW,
          moderatorPW: session.moderatorPW,
        }),
      })
      const joinData = await joinRes.json()

      if (joinData.ok && joinData.joinUrl) {
        setSessions(prev => prev.map(s =>
          s.id === session.id ? { ...s, participants: s.participants + 1 } : s
        ))
        showToast(role === 'moderator' ? '🎙 Ouverture de la salle BBB en tant que formateur…' : '🎯 Connexion à la salle BBB…')
        // Ouvrir la salle dans un nouvel onglet
        window.open(joinData.joinUrl, '_blank', 'noopener,noreferrer')
      } else {
        showToast('❌ Impossible de rejoindre la salle : ' + (joinData.error || 'Vérifiez BBB_URL et BBB_SECRET'))
      }
    } catch (err) {
      showToast('❌ Erreur réseau : ' + String(err))
    }
    setJoining(null)
  }

  // ── Créer une session ──────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.title || !form.date || !form.time) return
    setCreating(true)

    const meetingID = 'etagia-' + Date.now()
    const newSession: LiveSession = {
      id: meetingID, title: form.title, host: 'Formateur ETAGIA', hostInitials: 'FE',
      date: form.date, time: form.time, duration: form.duration + ' min', topic: form.topic,
      participants: 0, maxParticipants: parseInt(form.maxParticipants),
      status: 'scheduled', meetingID, attendeePW: 'ap', moderatorPW: 'mp',
      color: '#4255FF',
    }

    // Mode démo — création locale
    if (bbbStatus === 'demo' || bbbStatus === 'checking') {
      await new Promise(r => setTimeout(r, 800))
      setSessions(prev => [newSession, ...prev])
      setShowCreate(false)
      setForm({ title: '', topic: '', date: '', time: '', duration: '60', maxParticipants: '30' })
      showToast('✅ Classe créée (mode démo)')
      setCreating(false)
      return
    }

    // Mode réel — créer la salle sur BBB
    try {
      const res = await fetch('/api/bbb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createMeeting',
          meetingID,
          name: form.title,
          attendeePW: 'ap',
          moderatorPW: 'mp',
        }),
      })
      const data = await res.json()

      if (data.ok) {
        setSessions(prev => [{ ...newSession, status: 'live' }, ...prev])
        setShowCreate(false)
        setForm({ title: '', topic: '', date: '', time: '', duration: '60', maxParticipants: '30' })
        showToast('✅ Salle BBB créée avec succès — prête à accueillir des apprenants')
      } else {
        showToast('❌ Erreur BBB : ' + (data.message || data.error || 'Vérifiez vos variables Vercel'))
      }
    } catch (err) {
      showToast('❌ Erreur réseau : ' + String(err))
    }
    setCreating(false)
  }

  const inpStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
    border: '1px solid rgba(28,25,23,0.12)', background: '#FAF9F7',
    color: '#1C1917', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  // ── Statut BBB affiché ─────────────────────────────────────────────────────
  const bbbBadge = {
    checking: { dot: '#FCD34D', label: 'Vérification…',   bg: 'rgba(255,255,255,0.18)' },
    ok:       { dot: '#4ADE80', label: '✓ BBB Connecté',  bg: 'rgba(74,222,128,0.22)' },
    error:    { dot: '#FCA5A5', label: '⚠ Erreur BBB',    bg: 'rgba(252,165,165,0.22)' },
    demo:     { dot: '#60A5FA', label: 'Mode démo actif', bg: 'rgba(255,255,255,0.18)' },
  }[bbbStatus]

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
        background: 'linear-gradient(135deg, #F4591F 0%, #FF8C42 45%, #FFB347 100%)',
        boxShadow: '0 8px 32px rgba(244,89,31,0.30)', position: 'relative', overflow: 'hidden' }}>
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
            {/* BBB Status badge */}
            <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: bbbBadge.bg, borderRadius: '20px', padding: '5px 12px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: bbbBadge.dot,
                boxShadow: bbbStatus === 'ok' ? '0 0 0 3px rgba(74,222,128,0.35)' : 'none' }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>
                BigBlueButton : {bbbBadge.label}
              </span>
            </div>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            background: '#fff', border: 'none', borderRadius: '14px', padding: '12px 22px',
            fontWeight: '800', fontSize: '14px', color: '#4255FF', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>+</span> Créer une classe
          </button>
        </div>
      </div>

      {/* Bandeaux contextuels selon état BBB */}
      {bbbStatus === 'demo' && (
        <div style={{ ...card, padding: '0.75rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '10px',
          borderLeft: '3px solid #60A5FA', background: 'rgba(96,165,250,0.04)' }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>🔵</span>
          <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.5' }}>
            <strong style={{ color: '#1C1917' }}>Mode démo actif</strong> — Serveur BBB non configuré.
            Ajoutez <code style={{ background: '#F5F5F5', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '11px' }}>BBB_URL</code> et{' '}
            <code style={{ background: '#F5F5F5', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '11px' }}>BBB_SECRET</code> dans
            Vercel › Settings › Environment Variables, puis redéployez.
          </div>
        </div>
      )}
      {bbbStatus === 'ok' && (
        <div style={{ ...card, padding: '0.75rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '10px',
          borderLeft: '3px solid #4ADE80', background: 'rgba(74,222,128,0.04)' }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>✅</span>
          <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.5' }}>
            <strong style={{ color: '#1C1917' }}>BigBlueButton connecté</strong> — Les classes ouvertes redirigeront les apprenants
            vers la vraie salle de visioconférence BBB dans un nouvel onglet.
          </div>
        </div>
      )}
      {bbbStatus === 'error' && (
        <div style={{ ...card, padding: '0.75rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '10px',
          borderLeft: '3px solid #FCA5A5', background: 'rgba(252,165,165,0.04)' }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠️</span>
          <div style={{ fontSize: '12px', color: '#57534E', lineHeight: '1.5' }}>
            <strong style={{ color: '#1C1917' }}>Erreur de connexion BBB</strong> — Variables configurées mais le serveur
            ne répond pas. Vérifiez que <code style={{ background: '#F5F5F5', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '11px' }}>BBB_URL</code> est
            correct et que le serveur est en ligne.
          </div>
        </div>
      )}

      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'En direct maintenant', value: sessions.filter(s=>s.status==='live').length.toString(), icon: '🔴', color: '#EF4444', bg: 'rgba(239,68,68,0.07)' },
          { label: 'Programmées', value: sessions.filter(s=>s.status==='scheduled').length.toString(), icon: '📅', color: '#4255FF', bg: 'rgba(0,191,165,0.07)' },
          { label: 'Participants actifs', value: sessions.filter(s=>s.status==='live').reduce((a,s)=>a+s.participants,0).toString(), icon: '👥', color: '#4255FF', bg: 'rgba(66,85,255,0.07)' },
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
            border: `1px solid ${filter===f ? '#4255FF' : 'rgba(28,25,23,0.10)'}`,
            background: filter===f ? '#4255FF' : 'transparent',
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
                        style={{ background: 'linear-gradient(135deg,#4255FF,#D4A017)', border: 'none', borderRadius: '10px',
                          padding: '10px 20px', color: '#fff', fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(66,85,255,0.35)', opacity: joining===session.id ? 0.7 : 1,
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
                      style={{ background: 'linear-gradient(135deg,#4255FF,#00897B)', border: 'none', borderRadius: '10px',
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
          style={{ fontSize: '12px', fontWeight: '600', color: '#4255FF', textDecoration: 'none', whiteSpace: 'nowrap' }}>
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
            {bbbStatus === 'ok' && (
              <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(74,222,128,0.10)',
                border: '1px solid rgba(74,222,128,0.25)', marginBottom: '12px',
                fontSize: '12px', color: '#15803D', fontWeight: '600' }}>
                ✅ Une vraie salle BBB sera créée et disponible immédiatement
              </div>
            )}
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
                style={{ background: creating ? '#A8A29E' : 'linear-gradient(135deg,#4255FF,#D4A017)',
                  border: 'none', borderRadius: '12px', padding: '14px', color: '#fff', fontWeight: '800',
                  fontSize: '15px', cursor: creating ? 'not-allowed' : 'pointer',
                  boxShadow: creating ? 'none' : '0 4px 20px rgba(66,85,255,0.35)', marginTop: '4px' }}>
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
