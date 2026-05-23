'use client'

export default function VendreConseillerModule() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#F0F4FF' }}>
      <button
        onClick={() => window.history.back()}
        style={{
          position: 'absolute', top: 16, left: 16, zIndex: 10000,
          background: 'rgba(255,255,255,0.9)', border: '1px solid #e5e7eb',
          borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600,
          color: '#1A1D2E', cursor: 'pointer', display: 'flex', alignItems: 'center',
          gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        ← Retour
      </button>
      <iframe
        src="/modules/vendre-conseiller.html"
        title="L'Art de Vendre & Conseiller — ETAGIA"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="fullscreen"
      />
    </div>
  )
}
