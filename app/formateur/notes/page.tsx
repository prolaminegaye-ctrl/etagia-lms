'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type NoteTag = 'cours' | 'pédagogie' | 'idée' | 'admin' | 'réunion' | 'perso'
interface Note {
  id: string; title: string; content: string
  tag: NoteTag; pinned: boolean; color: string
  createdAt: string; updatedAt: string
}

const TAG_CFG: Record<NoteTag, { label: string; color: string; bg: string }> = {
  cours:      { label:'Cours',      color:'#00BFA5', bg:'rgba(0,191,165,0.10)' },
  pédagogie:  { label:'Pédagogie', color:'#7C3AED', bg:'rgba(124,58,237,0.10)' },
  idée:       { label:'Idée',       color:'#E8651A', bg:'rgba(232,101,26,0.10)' },
  admin:      { label:'Admin',      color:'#57534E', bg:'rgba(87,83,78,0.10)' },
  réunion:    { label:'Réunion',    color:'#D4A017', bg:'rgba(212,160,23,0.10)' },
  perso:      { label:'Perso',      color:'#EF4444', bg:'rgba(239,68,68,0.10)' },
}

const NOTE_COLORS = ['#fff','#FFF8F0','#F0FDF4','#E8EAFF','#FDF4FF','#FFFBEB']

const now = () => new Date().toISOString()
const fmtDate = (iso: string) => {
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return `Aujourd'hui ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`
  return d.toLocaleDateString('fr-FR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
}

const INIT_NOTES: Note[] = [
  { id:'n1', title:'Plan cours Data Science — Module 4', tag:'cours', pinned:true, color:'#FFF8F0',
    content:'## Objectifs pédagogiques\n- Comprendre les réseaux de neurones\n- Implémenter un modèle de deep learning avec TensorFlow\n- Évaluer les performances du modèle\n\n## Structure du module\n1. Introduction au Deep Learning (30 min)\n2. Architecture des réseaux (45 min)\n3. TP pratique Python (60 min)\n4. Quiz évaluation (15 min)\n\n## Ressources\n- Dataset MNIST pour le TP\n- Notebook Jupyter préparé',
    createdAt: now(), updatedAt: now() },
  { id:'n2', title:'Réunion équipe pédagogique — jeudi', tag:'réunion', pinned:false, color:'#FFFBEB',
    content:'### Points à aborder\n☐ Refonte du curriculum Q3\n☐ Nouveaux outils IA intégrés\n☐ Résultats évaluations finales\n☐ Planning vacances formateurs\n\n### À préparer\nApporter les statistiques de complétion de mai 2026.',
    createdAt: now(), updatedAt: now() },
  { id:'n3', title:'Idée : format micro-learning', tag:'idée', pinned:true, color:'#fff',
    content:'Expérimenter des modules courts de 5-7 minutes pour améliorer la rétention.\n\nRecherches à faire :\n- Études sur l\'attention en e-learning\n- Benchmarks Duolingo / Khan Academy\n- Faisabilité technique dans ETAGIA\n\nPotentiel : +40% de complétion selon les études.',
    createdAt: now(), updatedAt: now() },
  { id:'n4', title:'Feedback apprenants — Semaine 20', tag:'pédagogie', pinned:false, color:'#F0FDF4',
    content:'Points positifs :\n✓ Clarté des explications Python\n✓ Exercices bien calibrés\n✓ Réactivité sur le forum\n\nPoints à améliorer :\n✗ Enregistrements vidéo trop longs\n✗ Manque d\'exemples concrets sur le ML\n✗ Délai correction quiz',
    createdAt: now(), updatedAt: now() },
]

const card: React.CSSProperties = { background:'#FFFFFF', border:'1px solid rgba(28,25,23,0.08)', borderRadius:'16px', boxShadow:'0 2px 12px rgba(28,25,23,0.04)' }

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(INIT_NOTES)
  const [active, setActive] = useState<string>(INIT_NOTES[0].id)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState<NoteTag | 'all'>('all')
  const [saved, setSaved] = useState(true)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeNote = notes.find(n => n.id === active) || notes[0]

  const filtered = notes
    .filter(n => filterTag === 'all' || n.tag === filterTag)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.updatedAt.localeCompare(a.updatedAt))

  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    setSaved(false)
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...patch, updatedAt: now() } : n))
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaved(true), 1200)
  }, [])

  const createNote = () => {
    const newNote: Note = {
      id: 'n' + Date.now(), title: 'Nouvelle note', content: '', tag: 'cours',
      pinned: false, color: '#fff', createdAt: now(), updatedAt: now(),
    }
    setNotes(prev => [newNote, ...prev])
    setActive(newNote.id)
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    if (active === id) setActive(notes.find(n => n.id !== id)?.id || '')
  }

  const wordCount = activeNote?.content.trim().split(/\s+/).filter(Boolean).length || 0

  return (
    <div

      {/* Hero orange */}
      <div style={{ borderRadius: '20px', padding: '1.75rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #F4591F 0%, #FF8C42 50%, #FFB347 100%)', boxShadow: '0 6px 24px rgba(244,89,31,0.25)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Notes</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.3px', marginBottom: '3px' }}>Bloc-note</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>Vos notes et ressources personnelles.</p>
      </div>
 style={{ maxWidth:'1100px', height:'calc(100vh - 120px)', display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <div style={{ marginBottom:'1.25rem', padding:'1.5rem 2rem', borderRadius:'20px', background:'linear-gradient(135deg,#1C1917 0%,#2C1E14 100%)', boxShadow:'0 4px 24px rgba(0,0,0,0.18)', position:'relative', overflow:'hidden', flexShrink:0 }}>
        <div style={{ position:'absolute', top:'-40px', right:'-20px', width:'180px', height:'180px', borderRadius:'50%', background:'radial-gradient(circle,rgba(232,101,26,0.15),transparent 70%)', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
              <span style={{ fontSize:'24px' }}>📓</span>
              <h1 style={{ fontSize:'22px', fontWeight:'800', color:'#fff', fontFamily:'Syne,sans-serif', margin:0 }}>Bloc-note</h1>
            </div>
            <p style={{ color:'rgba(245,240,232,0.50)', fontSize:'13px', margin:0 }}>
              {notes.length} notes · Sauvegarde automatique
            </p>
          </div>
          <button onClick={createNote} style={{ background:'linear-gradient(135deg,#E8651A,#D4A017)', border:'none', borderRadius:'12px', padding:'10px 20px', color:'#fff', fontWeight:'800', fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 16px rgba(232,101,26,0.35)', display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'16px' }}>+</span> Nouvelle note
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:'1.25rem', flex:1, minHeight:0 }}>

        {/* Liste des notes */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px', minHeight:0 }}>
          {/* Recherche */}
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#A8A29E', fontSize:'14px' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
              style={{ width:'100%', padding:'9px 12px 9px 36px', borderRadius:'10px', border:'1px solid rgba(28,25,23,0.10)', background:'#FFFFFF', color:'#1C1917', fontSize:'13px', fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }} />
          </div>

          {/* Filtres tags */}
          <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
            <button onClick={() => setFilterTag('all')} style={{ padding:'4px 10px', borderRadius:'20px', border:'none', background:filterTag==='all' ? '#E8651A' : 'rgba(28,25,23,0.06)', color:filterTag==='all' ? '#fff' : '#A8A29E', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>Tout</button>
            {(Object.keys(TAG_CFG) as NoteTag[]).map(tag => {
              const cfg = TAG_CFG[tag]
              return (
                <button key={tag} onClick={() => setFilterTag(filterTag === tag ? 'all' : tag)} style={{ padding:'4px 10px', borderRadius:'20px', border:'none', background:filterTag===tag ? cfg.color : 'rgba(28,25,23,0.06)', color:filterTag===tag ? '#fff' : '#A8A29E', fontSize:'11px', fontWeight:'700', cursor:'pointer' }}>
                  {cfg.label}
                </button>
              )
            })}
          </div>

          {/* Note cards */}
          <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'8px' }}>
            {filtered.map(note => {
              const cfg = TAG_CFG[note.tag]
              const isActive = note.id === active
              return (
                <div key={note.id} onClick={() => setActive(note.id)} style={{ background:isActive ? note.color || '#fff' : '#fff', border:`1px solid ${isActive ? cfg.color+'40' : 'rgba(28,25,23,0.08)'}`, borderRadius:'12px', padding:'12px 14px', cursor:'pointer', transition:'all .15s', boxShadow:isActive ? `0 4px 16px ${cfg.color}18` : '0 1px 4px rgba(28,25,23,0.04)', borderLeft:isActive ? `3px solid ${cfg.color}` : '3px solid transparent' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'8px', marginBottom:'5px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', flex:1, minWidth:0 }}>
                      {note.pinned && <span style={{ fontSize:'12px' }}>📌</span>}
                      <span style={{ fontWeight:'700', fontSize:'13px', color:'#1C1917', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{note.title}</span>
                    </div>
                  </div>
                  <div style={{ fontSize:'11px', color:'#A8A29E', marginBottom:'6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {note.content.slice(0, 60).replace(/[#*\n]/g, ' ') || 'Note vide…'}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:'10px', fontWeight:'700', background:cfg.bg, color:cfg.color, borderRadius:'4px', padding:'2px 7px' }}>{cfg.label}</span>
                    <span style={{ fontSize:'10px', color:'#C4BCB8' }}>{fmtDate(note.updatedAt)}</span>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'2rem', color:'#A8A29E' }}>
                <div style={{ fontSize:'32px', marginBottom:'8px' }}>📭</div>
                <div style={{ fontSize:'13px' }}>Aucune note trouvée</div>
              </div>
            )}
          </div>
        </div>

        {/* Éditeur */}
        {activeNote && (
          <div style={{ ...card, display:'flex', flexDirection:'column', minHeight:0, overflow:'hidden' }}>
            {/* Toolbar */}
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(28,25,23,0.06)', display:'flex', alignItems:'center', gap:'12px', flexShrink:0, flexWrap:'wrap' as const }}>
              {/* Titre */}
              <input value={activeNote.title} onChange={e => updateNote(activeNote.id, { title:e.target.value })}
                style={{ flex:1, minWidth:'180px', fontWeight:'800', fontSize:'16px', color:'#1C1917', border:'none', outline:'none', background:'transparent', fontFamily:'Syne,sans-serif' }}
                placeholder="Titre de la note" />
              {/* Tag */}
              <select value={activeNote.tag} onChange={e => updateNote(activeNote.id, { tag:e.target.value as NoteTag })}
                style={{ padding:'5px 10px', borderRadius:'8px', border:'1px solid rgba(28,25,23,0.10)', background:'#FAF9F7', color:TAG_CFG[activeNote.tag].color, fontSize:'12px', fontWeight:'700', outline:'none', cursor:'pointer' }}>
                {(Object.keys(TAG_CFG) as NoteTag[]).map(tag => <option key={tag} value={tag}>{TAG_CFG[tag].label}</option>)}
              </select>
              {/* Couleur de fond */}
              <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
                {NOTE_COLORS.map(c => (
                  <button key={c} onClick={() => updateNote(activeNote.id, { color:c })} style={{ width:'18px', height:'18px', borderRadius:'50%', border:`2px solid ${activeNote.color===c ? '#E8651A' : 'rgba(28,25,23,0.10)'}`, background:c, cursor:'pointer', padding:0 }} />
                ))}
              </div>
              {/* Épingler */}
              <button onClick={() => updateNote(activeNote.id, { pinned:!activeNote.pinned })}
                style={{ background:activeNote.pinned ? 'rgba(232,101,26,0.10)' : 'transparent', border:'1px solid rgba(28,25,23,0.10)', borderRadius:'8px', padding:'5px 10px', fontSize:'12px', cursor:'pointer', color:activeNote.pinned ? '#E8651A' : '#A8A29E' }}>
                {activeNote.pinned ? '📌 Épinglé' : '📌 Épingler'}
              </button>
              {/* Supprimer */}
              <button onClick={() => deleteNote(activeNote.id)} style={{ background:'transparent', border:'1px solid rgba(239,68,68,0.20)', borderRadius:'8px', padding:'5px 10px', fontSize:'12px', cursor:'pointer', color:'#EF4444' }}>
                🗑
              </button>
            </div>

            {/* Raccourcis markdown */}
            <div style={{ padding:'8px 16px', borderBottom:'1px solid rgba(28,25,23,0.04)', display:'flex', gap:'6px', flexShrink:0, flexWrap:'wrap' as const, background:'#FAFAF8' }}>
              {[
                { label:'H1', insert:'# ', title:'Titre 1' },
                { label:'H2', insert:'## ', title:'Titre 2' },
                { label:'**B**', insert:'**texte**', title:'Gras' },
                { label:'_I_', insert:'_texte_', title:'Italique' },
                { label:'• Liste', insert:'\n- élément\n- élément\n', title:'Liste à puces' },
                { label:'☐ Todo', insert:'\n☐ tâche\n☐ tâche\n', title:'Liste de tâches' },
                { label:'---', insert:'\n---\n', title:'Séparateur' },
              ].map(btn => (
                <button key={btn.label} title={btn.title} onClick={() => {
                  const ta = textareaRef.current
                  if (!ta) return
                  const start = ta.selectionStart, end = ta.selectionEnd
                  const before = activeNote.content.slice(0, start)
                  const after = activeNote.content.slice(end)
                  const newContent = before + btn.insert + after
                  updateNote(activeNote.id, { content: newContent })
                  setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + btn.insert.length }, 10)
                }} style={{ padding:'3px 8px', borderRadius:'6px', border:'1px solid rgba(28,25,23,0.10)', background:'#fff', color:'#57534E', fontSize:'11px', fontWeight:'600', cursor:'pointer', fontFamily:'monospace' }}>
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Zone d'écriture */}
            <textarea ref={textareaRef} value={activeNote.content}
              onChange={e => updateNote(activeNote.id, { content:e.target.value })}
              placeholder="Commencez à écrire… Markdown supporté : # Titre, **gras**, _italique_, - liste, ☐ todo"
              style={{ flex:1, padding:'20px', border:'none', outline:'none', resize:'none', fontFamily:'\'Plus Jakarta Sans\',sans-serif', fontSize:'14px', lineHeight:'1.8', color:'#1C1917', background: activeNote.color || '#fff', overflowY:'auto' }} />

            {/* Status bar */}
            <div style={{ padding:'8px 16px', borderTop:'1px solid rgba(28,25,23,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#FAFAF8', flexShrink:0 }}>
              <div style={{ display:'flex', gap:'16px', fontSize:'11px', color:'#A8A29E' }}>
                <span>{wordCount} mots</span>
                <span>{activeNote.content.length} caractères</span>
                <span>Modifié : {fmtDate(activeNote.updatedAt)}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', color: saved ? '#00BFA5' : '#E8651A', fontWeight:'700' }}>
                <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: saved ? '#00BFA5' : '#E8651A', animation: saved ? 'none' : 'pulse 1s infinite' }} />
                {saved ? '✓ Sauvegardé' : 'Sauvegarde…'}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )
}
