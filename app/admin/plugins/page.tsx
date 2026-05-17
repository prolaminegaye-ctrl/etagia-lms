'use client'
import { useState } from 'react'

const PLUGINS = [
  {
    id: 'edugears', name: 'EduGears AI', version: '1.4.0', protocol: 'LTI 1.3 Advantage',
    status: 'actif', icon: '🤖', color: '#6B4EFF', tools: 10,
    desc: 'Suite complète d\'outils pédagogiques IA — génération de cours, quiz adaptatifs, tuteur conversationnel, notation automatique.',
    config: {
      claimCode: 'EG-4UGR-MVU9', issuer: 'https://etagia-lms.vercel.app',
      clientId: '7c4a2b1e-9f3d-4e8a-b5c6-3a2d1f0e8b7c',
      authLoginUrl: 'https://lti-api.edugears.ai/lti/auth',
      authTokenUrl: 'https://lti-api.edugears.ai/lti/token',
      keySetUrl: 'https://etagia-lms.vercel.app/lti/certs',
    },
  },
  {
    id: 'scorm', name: 'SCORM Runtime', version: '2.1.0', protocol: 'SCORM 1.2 / 2004',
    status: 'actif', icon: '📦', color: '#00B89C', tools: 1,
    desc: 'Moteur de lecture SCORM natif — compatible SCORM 1.2 et SCORM 2004, suivi xAPI, import ZIP, table des matières interactive.',
    config: null,
  },
]

const card: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid rgba(107,78,255,0.10)',
  borderRadius: '16px',
  boxShadow: '0 2px 12px rgba(107,78,255,0.06)',
}

export default function AdminPluginsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 1500) })
  }

  const plugin = PLUGINS.find(p => p.id === selected)

  return (
    <div>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg,#EBE7FF 0%,#F9F0FF 100%)', border: '1px solid rgba(107,78,255,0.15)', borderRadius: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1A1550', fontFamily: 'Syne,sans-serif', marginBottom: '4px' }}>Plugins & Intégrations LTI</h1>
        <p style={{ color: '#9B8EC0', fontSize: '13px' }}>Gérez les plugins installés et leurs configurations LTI 1.3</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { l: 'Plugins installés', v: '2', c: '#6B4EFF', grad: 'linear-gradient(135deg,#6B4EFF,#8B70FF)' },
          { l: 'Plugins actifs', v: '2', c: '#00B89C', grad: 'linear-gradient(135deg,#00B89C,#6B4EFF)' },
          { l: 'Protocoles', v: 'LTI 1.3 · SCORM', c: '#E6A817', grad: 'linear-gradient(135deg,#E6A817,#D63384)' },
          { l: 'Outils IA', v: '10', c: '#D63384', grad: 'linear-gradient(135deg,#D63384,#6B4EFF)' },
        ].map(k => (
          <div key={k.l} style={{ ...card, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.grad }} />
            <div style={{ fontSize: '20px', fontWeight: '800', color: k.c, marginTop: '8px', marginBottom: '4px', fontFamily: 'Syne,sans-serif' }}>{k.v}</div>
            <div style={{ fontSize: '11px', color: '#6B5EA8' }}>{k.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.6fr' : '1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PLUGINS.map(p => (
            <div key={p.id} onClick={() => setSelected(selected === p.id ? null : p.id)}
              style={{ ...card, padding: '1.25rem', cursor: 'pointer', border: `1px solid ${selected === p.id ? p.color + '40' : 'rgba(107,78,255,0.10)'}`, background: selected === p.id ? '#F4F2FF' : '#FFFFFF', transition: 'all .15s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#1A1550' }}>{p.name}</span>
                    <span style={{ fontSize: '10px', color: p.color, background: `${p.color}15`, borderRadius: '4px', padding: '2px 7px', fontWeight: '700' }}>v{p.version}</span>
                    <span style={{ fontSize: '10px', color: '#00B89C', background: 'rgba(0,184,156,0.12)', borderRadius: '4px', padding: '2px 7px', fontWeight: '700' }}>● {p.status}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#9B8EC0', marginBottom: '8px' }}>{p.protocol}</div>
                  <p style={{ fontSize: '12px', color: '#6B5EA8', lineHeight: '1.5' }}>{p.desc}</p>
                </div>
              </div>
              {p.config && <div style={{ marginTop: '10px', fontSize: '11px', color: '#6B4EFF', background: 'rgba(107,78,255,0.08)', borderRadius: '6px', padding: '4px 10px', display: 'inline-block', fontWeight: '600' }}>Configurer →</div>}
            </div>
          ))}
        </div>

        {selected && plugin?.config && (
          <div style={{ ...card, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(107,78,255,0.08)' }}>
              <span style={{ fontSize: '22px' }}>{plugin.icon}</span>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1A1550' }}>{plugin.name} — Configuration LTI</div>
                <div style={{ fontSize: '11px', color: '#9B8EC0' }}>LTI 1.3 Advantage · OAuth 2.0</div>
              </div>
            </div>
            {[
              { label: 'Code de réclamation', key: 'claimCode', value: plugin.config.claimCode, highlight: true },
              { label: 'Issuer (Platform ID)', key: 'issuer', value: plugin.config.issuer },
              { label: 'Client ID', key: 'clientId', value: plugin.config.clientId },
              { label: 'Auth Login URL', key: 'authLoginUrl', value: plugin.config.authLoginUrl },
              { label: 'Auth Token URL', key: 'authTokenUrl', value: plugin.config.authTokenUrl },
              { label: 'Key Set URL (JWKS)', key: 'keySetUrl', value: plugin.config.keySetUrl },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', color: '#9B8EC0', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>{field.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: field.highlight ? 'rgba(0,184,156,0.06)' : '#F4F2FF', borderRadius: '8px', padding: '10px 12px', border: field.highlight ? '1px solid rgba(0,184,156,0.25)' : '1px solid rgba(107,78,255,0.10)' }}>
                  <code style={{ flex: 1, fontSize: '12px', color: field.highlight ? '#00B89C' : '#6B4EFF', fontFamily: 'monospace', wordBreak: 'break-all' }}>{field.value}</code>
                  <button onClick={() => copy(field.value, field.key)} style={{ background: copied === field.key ? 'rgba(0,184,156,0.12)' : 'rgba(107,78,255,0.08)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: copied === field.key ? '#00B89C' : '#6B4EFF', fontSize: '11px', cursor: 'pointer', fontWeight: '700', flexShrink: 0 }}>
                    {copied === field.key ? '✓ Copié' : 'Copier'}
                  </button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(107,78,255,0.08)' }}>
              {[{label:'Deep Linking ✓', color:'#6B4EFF'},{label:'Grade Passback ✓', color:'#6B4EFF'},{label:'Actif', color:'#00B89C'}].map((item) => (
                <div key={item.label} style={{ flex: 1, background: '#F4F2FF', border: '1px solid rgba(107,78,255,0.12)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: item.color, fontWeight: '700' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
