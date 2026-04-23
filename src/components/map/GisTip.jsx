/**
 * GIS 공통 UI — 툴팁 래퍼 / 각도 측정 아이콘.
 * 모든 지도 화면에서 공통 사용.
 *
 * @author JDJ
 * @since 2026-04-22
 */

import React from 'react'

// ── 각도 측정 아이콘 ──────────────────────────────────────────────────────────
export function AngleIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3"  y1="19" x2="21" y2="19" />
      <line x1="3"  y1="19" x2="14" y2="5"  />
      <path d="M8 19 A6 6 0 0 1 11.5 9.5" />
      <circle cx="3" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

// ── 툴팁 래퍼 (position:relative wrapper + hover 시 말풍선) ───────────────────
// side: 'right' | 'left' | 'bottom'
export function Tip({ text, side = 'right', children }) {
  const tipStyle = {
    position:  'absolute',
    ...(side === 'bottom'
      ? { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' }
      : side === 'right'
        ? { top: '50%', transform: 'translateY(-50%)', left:  'calc(100% + 8px)' }
        : { top: '50%', transform: 'translateY(-50%)', right: 'calc(100% + 8px)' }
    ),
    background:   'var(--color-bg-secondary)',
    border:       '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding:      '4px 8px',
    fontSize: 11, fontWeight: 500,
    color:        'var(--color-text-primary)',
    boxShadow:    'var(--shadow-md)',
    whiteSpace:   'nowrap',
    pointerEvents:'none',
    opacity:      0,
    transition:   'opacity .15s',
    zIndex:       9999,
  }
  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={e => e.currentTarget.querySelector('.gis-tip').style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.querySelector('.gis-tip').style.opacity = '0'}
    >
      {children}
      <div className="gis-tip" style={tipStyle}>{text}</div>
    </div>
  )
}
