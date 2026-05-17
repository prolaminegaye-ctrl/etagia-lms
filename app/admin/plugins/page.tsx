'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PLATFORM_URL = 'https://etagia-lms.vercel.app'

interface Plugin {
  id: string; name: string; version: string; protocol: string
  status: 'actif' | 'inactif' | 'pending'; icon: string; color: string
  tools: number; desc: string; claim?: string
}

const PLUGINS: Plugin[] = [
  {
    id: 'edugears', name: 'EduGears AI', version: '1.4.0', protocol: 'LTI 1.3 Advantage',
    status: 'actif', icon: '🤖', color: '#E8651A', tools: 10,
    desc: 'Moteur d\'IA pédagogique — génération de quiz, évaluation adaptative, feedback automatique.',
    claim: 'EG-YAFU-G6T9',
  },
  {
    id: 'h5p', name: 'H5P Content', version: '2.1.0', protocol: 'LTI 1.1',
    status: 'actif', icon: '🎮', color: '#00BFA5', tools: 25,
    desc: 'Contenus interactifs H5P : vidéos, quiz, présentations, jeux éducatifs.',
  },
  {
    id: 'zoom', name: 'Zoom Classes', version: '1.0.0', protocol: 'LTI 1.3',
    status: 'inactif', icon: '📹', color: '#7C3AED', tools: 5,
    desc: 'Intégration Zoom pour sessions synchrones directement depuis le LMS.',
  },
]

const card: React.CSSProperties = {
  background: '#FFFFFF', border: '1px solid rgba(28,25,23,0.08)',
  borderRadius: '16px', boxShadow: '0 2px 12px rgba(28,25,23,0.04)',
}

const inpStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: '9px', fontSize: '13px',
  border: '1px solid rgba(28,25,23,0.12)', background: '#FAF9F7',
  color: '#1C1917', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const,
  fontFamily: 'monospace',
}

export default function PluginsPage() {
  const router = useRouter()
  const [active, setActive] = useState<string | null>('edugears')
  const [copied, setCopied] = useState<string | null>(null)
  const [jwksStatus, setJwksStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle')

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const checkJwks = async () => {
    setJwksStatus('checking')
    try {
      const res = await fetch(`${PLATFORM_URL}/api/lti/certs`)
      const data = await res.json()
      setJwksStatus(data?.keys?.length > 0 ? 'ok' : 'error')
    } catch {
      setJwksStatus('error')
    }
  }

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button onClick={() => copy(text, id)} style={{
      background: copied === id ? '#E8651A' : 'rgba(28,25,23,0.06)',
      border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '11px',
      fontWeight: '700', color: copied === id ? '#fff' : '#57534E', cursor: 'pointer',
      transition: 'all .15s', whiteSpace: 'nowrap' as const, flexShrink: 0,
    }}>
      {copied === id ? '✓ Copié' : 'Copier'}
    </button>
  )

  const Row = ({ label, value, id, highlight }: { label: string; value: string; id: string; highlight?: boolean }) => (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#A8A29E', marginBottom: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input readOnly value={value} style={{ ...inpStyle, flex: 1, color: highlight ? '#E8651A' : '#1C1917', fontWeight: highlight ? '700' : '400' }} />
        <CopyBtn text={value} id={id} />
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '1000px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem', padding: '1.75rem', borderRadius: '20px',
        background: 'linear-gradient(135deg,#1C1917 0%,#2C1E14 100%)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.20)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-20px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,101,26,0.15),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '24px' }}>🔌</span>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', fontFamily: 'Syne,sans-serif', margin: 0 }}>Plugins & LTI 1.3</h1>
            </div>
            <p style={{ color: 'rgba(245,240,232,0.55)', fontSize: '13px', margin: 0 }}>
              Gérez vos intégrations LTI, SCORM et plugins tiers
            </p>
          </div>
          <button onClick={() => router.push('/admin')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '8px 16px', color: 'rgba(245,240,232,0.70)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            ← Admin
          </button>
        </div>
      </div>

      {/* JWKS Status check */}
      <div style={{ ...card, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '14px',
        borderLeft: `4px solid ${jwksStatus === 'ok' ? '#00BFA5' : jwksStatus === 'error' ? '#EF4444' : '#E8651A'}`,
        background: jwksStatus === 'ok' ? 'rgba(0,191,165,0.04)' : 'rgba(232,101,26,0.04)' }}>
        <span style={{ fontSize: '20px' }}>
          {jwksStatus === 'ok' ? '✅' : jwksStatus === 'error' ? '❌' : jwksStatus === 'checking' ? '⏳' : '🔐'}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '13px', color: '#1C1917' }}>
            Endpoint JWKS — <code style={{ fontFamily: 'monospace', fontSize: '12px', color: '#E8651A' }}>{PLATFORM_URL}/api/lti/certs</code>
          </div>
          <div style={{ fontSize: '12px', color: '#A8A29E' }}>
            {jwksStatus === 'ok' ? '✓ JWKS actif — la clé publique RSA est servie correctement' :
             jwksStatus === 'error' ? 'Erreur — vérifiez le déploiement Vercel' :
             jwksStatus === 'checking' ? 'Vérification en cours…' :
             'Vérifiez que votre endpoint JWKS répond correctement (requis par EduGears)'}
          </div>
        </div>
        <button onClick={checkJwks} style={{ background: '#E8651A', border: 'none', borderRadius: '9px', padding: '8px 16px', color: '#fff', fontWeight: '700', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
          {jwksStatus === 'checking' ? '…' : 'Tester JWKS'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>

        {/* Plugin list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PLUGINS.map(p => (
            <div key={p.id} onClick={() => setActive(p.id)} style={{
              ...card, padding: '14px', cursor: 'pointer', transition: 'all .15s',
              borderLeft: active === p.id ? `3px solid ${p.color}` : '3px solid transparent',
              background: active === p.id ? `${p.color}08` : '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{p.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#1C1917' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#A8A29E' }}>{p.protocol}</div>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '20px',
                  background: p.status === 'actif' ? 'rgba(0,191,165,0.12)' : p.status === 'pending' ? 'rgba(212,160,23,0.15)' : 'rgba(168,162,158,0.15)',
                  color: p.status === 'actif' ? '#00897B' : p.status === 'pending' ? '#92400E' : '#78716C',
                }}>
                  {p.status === 'actif' ? '● Actif' : p.status === 'pending' ? '⚠ Config' : '○ Inactif'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Config panel */}
        {active && (() => {
          const plugin = PLUGINS.find(p => p.id === active)!
          return (
            <div style={{ ...card, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(28,25,23,0.06)' }}>
                <span style={{ fontSize: '28px' }}>{plugin.icon}</span>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#1C1917' }}>{plugin.name}</div>
                  <div style={{ fontSize: '12px', color: '#A8A29E' }}>{plugin.desc}</div>
                </div>
              </div>

              {plugin.id === 'edugears' && (
                <>
                  {/* EduGears Dynamic Registration */}
                  <div style={{ background: 'rgba(0,191,165,0.07)', border: '1px solid rgba(0,191,165,0.25)', borderRadius: '12px', padding: '14px', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: '800', fontSize: '13px', color: '#00695C', marginBottom: '8px' }}>✅ EduGears AI — Enregistrement LTI 1.3 actif</div>
                    <div style={{ fontSize: '12px', color: '#004D40', lineHeight: '1.6', marginBottom: '12px' }}>
                      EduGears AI est enregistré avec succès sur ETAGIA LMS via LTI 1.3 dynamique. Code de réclamation actif : <strong>EG-YAFU-G6T9</strong>
                    </div>
                    <a href={`${PLATFORM_URL}/api/lti/register`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E8651A,#D4A017)', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#fff', fontWeight: '800', fontSize: '13px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(232,101,26,0.30)' }}>
                      🔄 Renouveler l&apos;enregistrement
                    </a>
                  </div>

                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#1C1917', marginBottom: '12px' }}>
                    🔧 Configuration LTI 1.3 — URLs de la plateforme ETAGIA LMS
                  </div>
                  <div style={{ fontSize: '12px', color: '#A8A29E', marginBottom: '14px', padding: '10px', background: 'rgba(0,191,165,0.06)', borderRadius: '8px', border: '1px solid rgba(0,191,165,0.15)' }}>
                    ℹ️ Ces URLs sont celles <strong>de notre plateforme</strong> (ETAGIA LMS). À renseigner dans l&apos;interface de configuration d&apos;EduGears.
                  </div>

                  <Row label="Issuer / Platform ID" value={PLATFORM_URL} id="issuer" />
                  <Row label="JWKS URL (clé publique RSA)" value={`${PLATFORM_URL}/api/lti/certs`} id="jwks" highlight />
                  <Row label="OIDC Auth Endpoint" value={`${PLATFORM_URL}/api/lti/auth`} id="auth" />
                  <Row label="Token Endpoint" value={`${PLATFORM_URL}/api/lti/token`} id="token" />
                  <Row label="OpenID Configuration" value={`${PLATFORM_URL}/api/lti/openid-configuration`} id="oidc" />
                  <Row label="Dynamic Registration" value={`${PLATFORM_URL}/api/lti/register`} id="reg" />

                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(28,25,23,0.06)' }}>
                    <div style={{ fontWeight: '800', fontSize: '13px', color: '#1C1917', marginBottom: '12px' }}>
                      🤖 URLs de l&apos;outil EduGears (côté outil — ne pas modifier)
                    </div>
                    <Row label="Login Initiation URL" value="https://lti-api.edugears.ai/lti/login" id="eg-login" />
                    <Row label="Launch URL (POST id_token)" value="https://lti-api.edugears.ai/lti/launch" id="eg-launch" />
                    <Row label="JWKS EduGears" value="https://lti-api.edugears.ai/lti/jwks" id="eg-jwks" />
                  </div>

                  <div style={{ marginTop: '1rem', padding: '12px', background: '#FAF9F7', borderRadius: '10px', border: '1px solid rgba(28,25,23,0.08)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#A8A29E', marginBottom: '6px' }}>CLÉ PUBLIQUE RSA (kid: etagia-lms-2026)</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#57534E', wordBreak: 'break-all' as const, lineHeight: '1.5' }}>
                      n: s3n-UfXLv9qQqDtKWPG4zzdMQijoAzp0DEjZ_-4c3cY…
                    </div>
                    <button onClick={() => copy(`${PLATFORM_URL}/api/lti/certs`, 'jwks-url')}
                      style={{ marginTop: '8px', background: '#E8651A', border: 'none', borderRadius: '7px', padding: '6px 14px', color: '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                      Copier l&apos;URL JWKS
                    </button>
                  </div>
                </>
              )}

              {plugin.id !== 'edugears' && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#A8A29E' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{plugin.icon}</div>
                  <div style={{ fontWeight: '600', color: '#1C1917', marginBottom: '6px' }}>{plugin.name}</div>
                  <div style={{ fontSize: '13px' }}>Configuration disponible prochainement.</div>
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
