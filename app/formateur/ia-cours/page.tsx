'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function IACoursRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/formateur/creer') }, [router])
  return <div style={{textAlign:'center',padding:'4rem',color:'#7A90B0'}}>Redirection vers le créateur de cours...</div>
}
