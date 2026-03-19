import React from 'react'
import { C } from './dashboardUtils.js'

export function KpiCard({ label, value, unit, sub, subVal, subColor, accent }) {
  return (
    <div style={{ background:'var(--color-bg-secondary)', border:`1px solid ${accent}35`, borderTop:`3px solid ${accent}`, borderRadius:8, padding:'10px 14px' }}>
      <div style={{ fontSize:11, color:'var(--color-text-muted)', marginBottom:4 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
        <span style={{ fontSize:24, fontWeight:800, color:'var(--color-text-primary)', letterSpacing:'-0.5px' }}>{value}</span>
        {unit && <span style={{ fontSize:12, color:'var(--color-text-muted)' }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize:11, color:subColor||C.blue, marginTop:3 }}>{sub} <b style={{ color:'var(--color-text-primary)' }}>{subVal}</b></div>}
    </div>
  )
}

export function Panel({ children, style }) {
  return (
    <div style={{ background:'var(--color-bg-secondary)', border:'1px solid var(--color-border)', borderRadius:8, padding:'10px 12px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', overflow:'hidden', ...style }}>
      {children}
    </div>
  )
}

export function SectionHeader({ title, badge, color = C.blue }) {
  const isEcharts = badge === 'ECharts'
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <div style={{ width:3, height:14, background:color, borderRadius:2 }} />
        <span style={{ fontSize:12, fontWeight:700, color:'var(--color-text-primary)' }}>{title}</span>
      </div>
      {badge && (
        <span style={{ fontSize:9, padding:'2px 7px', borderRadius:10, fontWeight:700,
          background: isEcharts ? '#ff660015' : '#7c3aed15',
          color:      isEcharts ? '#cc4400'   : '#7c3aed',
          border:     `1px solid ${isEcharts ? '#ff660030' : '#7c3aed30'}`,
        }}>{badge}</span>
      )}
    </div>
  )
}
