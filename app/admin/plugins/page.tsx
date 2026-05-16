'use client'
import { useState } from 'react'

const PLUGINS = [
  {
    id: 'edugears', name: 'EduGears AI', version: '1.4.0', protocol: 'LTI 1.3 Advantage',
    status: 'actif', icon: '🤖', color: '#7B5CF5', tools: 10,
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
    status: 'actif', icon: '📦', color: '#22D4A8', tools: 1,
    desc: 'Moteur de lecture SCORM natif — compatible SCORM 1.2 et SCORM 2004, suivi xAPI, import ZIP, table des matières interactive.',
    config: null,
  },
]

export default function AdminPluginsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 1500) })
  }

  const plugin = PLUGINS.find(p => p.id === selected)

  return (
    <div>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg,rgba(123,92,245,0.1),rgba(224,64,160,0.05))', border: '1px solid rgba(123,92,245,0.2)', borderRadius: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg,#F0EEFF,#A78BF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>Plugins & Intégrations LTI</h1>
        <p style={{ color: '#8B7BAE', fontSize: '13px' }}>Gérez les plugins installés et leurs configurations LTI 1.3</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { l: 'Plugins installés', v: '2', c: '#7B5CF5' },
          { l: 'Plugins actifs', v: '2', c: '#22D4A8' },
          { l: 'Protocoles', v: 'LTI 1.3 · SCORM', c: '#5B8DEF' },
          { l: 'Outils IA', v: '10', c: '#E040A0' },
        ].map(k => (
          <div key={k.l} style={{ background: 'linear-gradient(145deg,#1A1530,#130F23)', border: '1px solid rgba(123,92,245,0.12)', borderRadius: '14px', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.c }} />
            <div style={{ fontSize: '22px', fontWeight: '800', color: k.c, marginBottom: '4px' }}>{k.v}</div>
            <div style={{ fontSize: '11px', color: '#4A3D6A' }}>{k.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.6fr' : '1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PLUGINS.map(p => (
            <div key={p.id} onClick={() => setSelected(selected === p.id ? null : p.id)} style={{ background: 'linear-gradient(145deg,#1A1530,#130F23)', border: `1px solid ${selected === p.id ? p.color + '55' : 'rgba(123,92,245,0.12)'}`, borderRadius: '16px', padding: '1.25rem', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: '#F0EEFF' }}>{p.name}</span>
                    <span style={{ fontSize: '10px', color: p.color, background: `${p.color}18`, borderRadius: '4px', padding: '2px 7px', fontWeight: '700' }}>v{p.version}</span>
                    <span style={{ fontSize: '10px', color: '#22D4A8', background: 'rgba(34,212,168,0.12)', borderRadius: '4px', padding: '2px 7px', fontWeight: '700' }}>● {p.status}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B5F8A', marginBottom: '8px' }}>{p.protocol}</div>
                  <p style={{ fontSize: '12px', color: '#5A4D7A', lineHeight: '1.5' }}>{p.desc}</p>
                </div>
              </div>
              {p.config && <div style={{ marginTop: '10px', fontSize: '11px', color: '#A78BF8', background: 'rgba(123,92,245,0.1)', borderRadius: '6px', padding: '4px 10px', display: 'inline-block' }}>Configurer →</div>}
            </div>
          ))}
        </div>

        {selected && plugin?.config && (
          <div style={{ background: 'linear-gradient(145deg,#1A1530,#130F23)', border: '1px solid rgba(123,92,245,0.15)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(123,92,245,0.1)' }}>
              <span style={{ fontSize: '22px' }}>{plugin.icon}</span>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#F0EEFF' }}>{plugin.name} — Configuration LTI</div>
                <div style={{ fontSize: '11px', color: '#6B5F8A' }}>LTI 1.3 Advantage · OAuth 2.0</div>
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
                <div style={{ fontSize: '10px', color: '#4A3D6A', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>{field.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px 12px', border: field.highlight ? '1px solid rgba(34,212,168,0.3)' : '1px solid rgba(123,92,245,0.1)' }}>
                  <code style={{ flex: 1, fontSize: '12px', color: field.highlight ? '#22D4A8' : '#A78BF8', fontFamily: 'monospace', wordBreak: 'break-all' }}>{field.value}</code>
                  <button onClick={() => copy(field.value, field.key)} style={{ background: 'rgba(123,92,245,0.15)', border: 'none', borderRadius: '6px', padding: '4px 8px', color: copied === field.key ? '#22D4A8' : '#A78BF8', fontSize: '11px', cursor: 'pointer', fontWeight: '700', flexShrink: 0 }}>
                    {copied === field.key ? '✓ Copié' : 'Copier'}
                  </button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(123,92,245,0.1)' }}>
              {['Deep Linking ✓', 'Grade Passback ✓', 'Actif'].map((label, i) => (
                <div key={label} style={{ flex: 1, background: 'rgba(123,92,245,0.08)', border: '1px solid rgba(123,92,245,0.2)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: i === 2 ? '#22D4A8' : '#A78BF8', fontWeight: '700' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
