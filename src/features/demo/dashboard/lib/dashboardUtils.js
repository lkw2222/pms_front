import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

// ── 색상 팔레트 ───────────────────────────────────────────────────────────────
export const C = {
  blue:   '#2563eb',
  cyan:   '#06b6d4',
  green:  '#16a34a',
  red:    '#dc2626',
  orange: '#ea580c',
  purple: '#7c3aed',
  yellow: '#ca8a04',
  gray:   '#64748b',
}

// ── ECharts 공통 tooltip 스타일 ───────────────────────────────────────────────
export const eTT = {
  backgroundColor: 'var(--color-bg-secondary)',
  borderColor:     'var(--color-border)',
  textStyle:       { color: 'var(--color-text-primary)', fontSize: 11 },
}

// ── ECharts 훅 ────────────────────────────────────────────────────────────────
export function useEChart(getOption) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const inst = echarts.init(ref.current, null, { renderer: 'canvas' })
    inst.setOption(getOption())
    const ro = new ResizeObserver(() => inst.resize())
    ro.observe(ref.current)
    return () => { ro.disconnect(); inst.dispose() }
  }, [])
  return ref
}

// ── Nivo 테마 훅 (CSS 변수 기반, 다크/라이트 자동 대응) ──────────────────────
export function useNivoTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  return {
    background: 'transparent',
    textColor: isDark ? '#cbd5e1' : '#475569',
    fontSize: 10,
    axis: {
      ticks:  { text: { fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' } },
      legend: { text: { fontSize: 11, fill: isDark ? '#cbd5e1' : '#475569' } },
    },
    grid:    { line: { stroke: isDark ? '#1e293b' : '#e2e8f0', strokeWidth: 1 } },
    legends: { text: { fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' } },
    tooltip: {
      container: {
        background:   isDark ? '#1e293b' : '#fff',
        color:        isDark ? '#f1f5f9' : '#1e293b',
        fontSize:     11,
        borderRadius: 6,
        boxShadow:    '0 4px 12px rgba(0,0,0,0.15)',
        border:       `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      },
    },
  }
}
