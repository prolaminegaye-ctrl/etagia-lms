'use client'
import { ReactNode } from 'react'

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
  stats?: { value: string; label: string }[]
}

export default function PageHero({ eyebrow, title, subtitle, actions, stats }: PageHeroProps) {
  return (
    <div style={{
      borderRadius: '24px',
      padding: '2rem 2.5rem',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, #F4591F 0%, #FF8C42 40%, #FFB347 100%)',
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
      boxShadow: '0 8px 32px rgba(244,89,31,0.28)',
    }}>
      {/* Orbs décoratifs */}
      <div style={{ position: 'absolute', top: -80, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, right: '15%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', left: '-40px', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative' }}>
        {eyebrow && (
          <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: '6px' }}>
            {eyebrow}
          </div>
        )}
        <h1 style={{
          fontSize: '1.75rem', fontWeight: '900', color: '#fff',
          letterSpacing: '-0.5px', marginBottom: subtitle ? '6px' : (actions || stats ? '1.25rem' : '0'),
          fontFamily: 'Inter, sans-serif',
        }}>{title}</h1>
        {subtitle && (
          <p style={{ color: 'rgba(255,255,255,0.80)', fontSize: '14px', marginBottom: actions || stats ? '1.25rem' : '0', maxWidth: '520px', lineHeight: 1.6 }}>{subtitle}</p>
        )}
        {actions && <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>{actions}</div>}
        {stats && (
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: actions ? '1.25rem' : '0' }}>
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', fontWeight: '600' }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
