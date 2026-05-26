'use client'

const exports = [
  { id: 'users', label: 'Utilisateurs', desc: 'Tous les comptes, rôles, statuts, dernière connexion', icon: '◎', rows: 1248 },
  { id: 'progress', label: 'Progression apprenants', desc: 'Cours suivis, % complétion, scores quiz par apprenant', icon: '◈', rows: 4892 },
  { id: 'enrollments', label: 'Inscriptions aux cours', desc: 'Qui suit quoi, date inscription, statut', icon: '▦', rows: 3210 },
  { id: 'quiz', label: 'Résultats quiz', desc: 'Toutes les tentatives, scores, réponses par question', icon: '✦', rows: 8740 },
  { id: 'ai', label: 'Interactions AI Tutor', desc: 'Nombre de sessions IA par apprenant et cours', icon: '〜', rows: 2156 },
  { id: 'satisfaction', label: 'Évaluations satisfaction', desc: 'Notes et commentaires par cours', icon: '⭐', rows: 892 },
]

function generateCSV(id: string): string {
  const headers: Record<string, string> = {
    users: 'id,nom,email,role,organisation,statut,date_inscription,derniere_connexion',
    progress: 'user_id,nom,cours_id,cours_titre,progression_%,score_moyen,derniere_activite',
    enrollments: 'user_id,nom,cours_id,cours_titre,date_inscription,statut',
    quiz: 'user_id,nom,quiz_id,cours,score,reussi,date_tentative',
    ai: 'user_id,nom,cours,nb_sessions_ia,nb_questions,date_derniere_session',
    satisfaction: 'user_id,cours,note_contenu,note_tutor,note_interface,commentaire,date',
  }
  const rows: Record<string, string[]> = {
    users: ['1,Fatou Diallo,fatou@sjt.sn,Apprenant,SJT,Actif,2026-01-12,2026-05-14', '2,Moussa Traoré,moussa@etagia.com,Formateur,ETAGIA,Actif,2026-02-03,2026-05-13'],
    progress: ['1,Fatou Diallo,c1,Data Science Python,72,85,2026-05-14', '2,Moussa Traoré,c2,Marketing Digital,45,78,2026-05-12'],
    enrollments: ['1,Fatou Diallo,c1,Data Science Python,2026-01-15,En cours', '1,Fatou Diallo,c2,Marketing Digital,2026-02-01,En cours'],
    quiz: ['1,Fatou Diallo,q1,Data Science,85,true,2026-05-10', '2,Moussa Traoré,q2,Marketing,72,true,2026-05-11'],
    ai: ['1,Fatou Diallo,Data Science,12,45,2026-05-14', '2,Moussa Traoré,Marketing,8,28,2026-05-12'],
    satisfaction: ['1,Data Science,5,4,5,Excellent contenu pratique,2026-05-10', '2,Marketing Digital,4,5,4,Très bonne plateforme,2026-05-11'],
  }
  return [headers[id], ...(rows[id] || [])].join('\n')
}

export default function ExportPage() {
  const download = (id: string, label: string) => {
    const csv = generateCSV(id)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `etagia-${id}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => exports.forEach(e => setTimeout(() => download(e.id, e.label), 200))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-primary)' }}>📊 Export CSV</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Exportez vos données pour analyse externe</p>
        </div>
        <button onClick={downloadAll} className="btn-primary">⬇ Tout exporter</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
        {exports.map(e => (
          <div key={e.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(232,101,26,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#E8651A' }}>{e.icon}</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>{e.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{e.rows.toLocaleString()} lignes estimées</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{e.desc}</p>
            <button onClick={() => download(e.id, e.label)} style={{ background: 'rgba(232,101,26,0.10)', border: '1px solid rgba(232,101,26,0.25)', borderRadius: '10px', padding: '9px 16px', color: '#E8651A', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              ⬇ Télécharger .csv
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
