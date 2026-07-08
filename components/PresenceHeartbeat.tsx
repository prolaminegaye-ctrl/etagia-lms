'use client'
import { useEffect } from 'react'
import { touchPresence } from '@/lib/activity'

/**
 * Signale la présence de l'utilisateur connecté toutes les 2 minutes,
 * pour permettre à l'admin de voir "qui est connecté maintenant".
 * N'affiche rien ; ne fait rien si personne n'est connecté.
 */
export default function PresenceHeartbeat() {
  useEffect(() => {
    touchPresence()
    const id = setInterval(touchPresence, 2 * 60 * 1000)
    return () => clearInterval(id)
  }, [])
  return null
}
