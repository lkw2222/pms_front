import React from 'react'
import { C } from './lib/dashboardUtils.js'
import KpiFeature          from './KpiFeature.jsx'
import StatusChartFeature  from './StatusChartFeature.jsx'
import MonthlyChartFeature from './MonthlyChartFeature.jsx'
import DeptChartFeature    from './DeptChartFeature.jsx'
import TrendChartFeature   from './TrendChartFeature.jsx'

export default function DashboardFeature() {
  const now = new Date()
  const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`

  return (
    <div style={{ width:'100%', height:'100%', overflow:'auto', background:'var(--color-bg-primary)', padding:'12px 14px', boxSizing:'border-box', display:'flex', flexDirection:'column', gap:10 }}>

      {/* 헤더 */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:4, height:18, background:C.blue, borderRadius:2 }} />
          <span style={{ fontSize:15, fontWeight:800, color:'var(--color-text-primary)' }}>통합 대시보드</span>
          <span style={{ fontSize:11, color:'var(--color-text-muted)' }}>업무현황 종합</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:9, padding:'2px 8px', borderRadius:4, background:'#ff660015', color:'#cc4400', border:'1px solid #ff660030', fontWeight:700 }}>ECharts</span>
          <span style={{ fontSize:9, padding:'2px 8px', borderRadius:4, background:'#7c3aed15', color:'#7c3aed', border:'1px solid #7c3aed30', fontWeight:700 }}>Nivo</span>
          <span style={{ fontSize:11, color:'var(--color-text-muted)' }}>{dateStr} 기준</span>
        </div>
      </div>

      {/* KPI */}
      <div style={{ flexShrink:0 }}>
        <KpiFeature />
      </div>

      {/* 1행: 상태 도넛 + 완료율 게이지 + 월별 혼합 + 히트맵 */}
      <div style={{ display:'flex', gap:8, height:210, flexShrink:0 }}>
        <StatusChartFeature />
        <MonthlyChartFeature />
      </div>

      {/* 2행: 부서별 바 + 산점도 */}
      <div style={{ display:'flex', gap:8, height:220, flexShrink:0 }}>
        <DeptChartFeature />
      </div>

      {/* 3행: 주간 라인 + 레이더 */}
      <div style={{ display:'flex', gap:8, height:190, flexShrink:0 }}>
        <TrendChartFeature />
      </div>

    </div>
  )
}
