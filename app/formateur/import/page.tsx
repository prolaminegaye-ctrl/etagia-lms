'use client'
import { useState } from 'react'

export default function ImportPage() {
  const [drag, setDrag] = useState(false)
  const [file, setFile] = useState<File|null>(null)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files[0]
    if (!f) return
    setFile(f)
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200))
      setProgress(i)
    }
    setDone(true)
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Importer un contenu</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>SCORM 1.2 · SCORM 2004 · H5P · PDF · Vidéo MP4</p>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${drag ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '20px', padding: '4rem 2rem', textAlign: 'center',
          background: drag ? 'var(--accent-muted)' : 'var(--bg-card)',
          transition: 'all .2s', cursor: 'pointer', marginBottom: '2rem'
        }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>↑</div>
        <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>
          {file ? file.name : 'Glissez votre fichier ici'}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          ou cliquez pour parcourir · Max 500 MB
        </div>
        <input id="file-input" type="file" style={{ display: 'none' }}
          accept=".zip,.h5p,.pdf,.mp4"
          onChange={e => { if(e.target.files?.[0]) setFile(e.target.files[0]) }} />
      </div>

      {file && !done && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span>Traitement en cours...</span>
            <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{progress}%</span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', borderRadius: '3px', transition: 'width .2s' }} />
          </div>
        </div>
      )}

      {done && (
        <div style={{ background: 'var(--teal-muted)', border: '1px solid var(--teal)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
          <div style={{ fontWeight: '600', color: 'var(--teal)', marginBottom: '4px' }}>Import réussi !</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{file?.name} · Prêt à publier</div>
          <a href="/formateur/cours" style={{ display: 'inline-block', marginTop: '1rem', background: 'var(--accent)', color: '#fff', borderRadius: '8px', padding: '8px 20px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            Voir mes cours →
          </a>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginTop: '2rem' }}>
        {[
          { fmt: 'SCORM 1.2 / 2004', desc: 'Packages e-learning standards', icon: '📦' },
          { fmt: 'H5P', desc: 'Contenus interactifs HTML5', icon: '🎮' },
          { fmt: 'PDF / Vidéo', desc: 'Documents et vidéos MP4', icon: '📄' },
        ].map(f => (
          <div key={f.fmt} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
            <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>{f.fmt}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
