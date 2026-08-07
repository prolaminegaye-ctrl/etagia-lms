'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Filet de sécurité des écrans formateur.
 *
 * Sans cette limite d'erreur, une exception pendant le rendu laissait une
 * page entièrement blanche : ni message, ni cause, ni issue. Impossible à
 * diagnostiquer pour l'utilisateur, impossible à reproduire à distance.
 *
 * Elle affiche désormais le message d'erreur réel et renvoie vers l'écran
 * de diagnostic, qui sait inspecter et réparer les données du navigateur —
 * de loin la cause la plus fréquente pour ces pages, qui lisent toutes le
 * stockage local.
 */
export default function FormateurError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Reste visible dans la console pour un signalement, même après reprise.
    console.error('[formateur] rendu interrompu', error)
  }, [error])

  const bouton: React.CSSProperties = {
    padding: '10px 18px', borderRadius: '9px', fontSize: '13px',
    fontWeight: 700, cursor: 'pointer', border: 'none',
  }

  return (
    <div style={{ maxWidth: '620px', margin: '3rem auto', padding: '0 1rem' }}>
      <div style={{
        background: 'var(--surface, #fff)', border: '1px solid rgba(28,25,23,0.10)',
        borderRadius: '16px', padding: '2rem',
      }}>
        <div style={{ fontSize: '38px', marginBottom: '12px' }}>⚠️</div>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1C1917', margin: 0 }}>
          Cette page n&apos;a pas pu s&apos;afficher
        </h1>
        <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.65, color: '#78716C' }}>
          Vos cours et vos données ne sont pas perdus. L&apos;affichage s&apos;est interrompu, le plus
          souvent à cause de contenus enregistrés dans ce navigateur.
        </p>

        <div style={{
          marginTop: '16px', padding: '12px 14px', borderRadius: '10px',
          background: 'rgba(240,90,90,0.07)', border: '1px solid rgba(240,90,90,0.18)',
          fontFamily: 'ui-monospace, monospace', fontSize: '12px', color: '#B03A2E',
          wordBreak: 'break-word',
        }}>
          {error.message || 'Erreur inconnue'}
          {error.digest ? <span style={{ opacity: 0.7 }}> · {error.digest}</span> : null}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{ ...bouton, background: 'linear-gradient(135deg,#E8651A,#D4A017)', color: '#fff' }}
          >
            Réessayer
          </button>
          <button
            type="button"
            onClick={() => router.push('/formateur/diagnostic')}
            style={{ ...bouton, background: 'rgba(28,25,23,0.06)', color: '#1C1917', border: '1px solid rgba(28,25,23,0.10)' }}
          >
            Diagnostiquer et réparer
          </button>
          <button
            type="button"
            onClick={() => router.push('/formateur')}
            style={{ ...bouton, background: 'transparent', color: '#78716C' }}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  )
}
