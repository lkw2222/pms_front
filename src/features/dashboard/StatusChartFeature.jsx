import React, { useEffect, useRef } from 'react'
import { ResponsivePie } from '@nivo/pie'
import * as echarts from 'echarts'
import { Panel, SectionHeader } from './lib/DashboardComponents.jsx'
import { C, useNivoTheme } from './lib/dashboardUtils.js'

function NV_StatusPie() {
  const theme = useNivoTheme()
  const data = [
    { id:'완료',   label:'완료',   value:234, color:C.blue   },
    { id:'진행중', label:'진행중', value:87,  color:C.cyan   },
    { id:'대기',   label:'대기',   value:45,  color:C.yellow },
    { id:'지연',   label:'지연',   value:23,  color:C.red    },
  ]
  return (
    <div style={{ flex:1, minHeight:0 }}>
      <ResponsivePie
        data={data} theme={theme}
        colors={({ data }) => data.color}
        margin={{ top:8, right:90, bottom:8, left:8 }}
        innerRadius={0.55} padAngle={1.5} cornerRadius={3}
        activeOuterRadiusOffset={6} borderWidth={0}
        enableArcLinkLabels={false}
        arcLabel={d => `${d.value}`} arcLabelsSkipAngle={18}
        arcLabelsTextColor="#fff" arcLabelsRadiusOffset={0.65}
        legends={[{ anchor:'right', direction:'column', translateX:88, translateY:0, itemWidth:80, itemHeight:18, itemsSpacing:4, symbolShape:'circle', symbolSize:8, itemTextColor:theme.textColor }]}
        layers={['arcs','arcLabels','arcLinkLabels','legends',
          ({ centerX, centerY }) => (
            <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize:14, fontWeight:800, fill:'var(--color-text-primary)' }}>389</text>
          )
        ]}
      />
    </div>
  )
}

function EC_GaugeSet() {
  const items = [
    { ref:useRef(null), val:78, name:'전체 완료율', color:C.blue  },
    { ref:useRef(null), val:62, name:'이번달',      color:C.green },
    { ref:useRef(null), val:34, name:'긴급 처리율', color:C.red   },
  ]
  items.forEach(({ ref, val, name, color }) => {
    useEffect(() => {
      if (!ref.current) return
      const inst = echarts.init(ref.current)
      inst.setOption({
        series:[{ type:'gauge', center:['50%','60%'], radius:'85%', startAngle:200, endAngle:-20, min:0, max:100,
          axisLine:{ lineStyle:{ width:10, color:[[val/100,color],[1,'#e2e8f020']] } },
          pointer:{ length:'50%', width:4, itemStyle:{ color } },
          axisTick:{ show:false }, splitLine:{ show:false }, axisLabel:{ show:false }, anchor:{ show:false },
          title:{ show:true, offsetCenter:[0,'28%'], fontSize:10, color:'var(--color-text-muted)' },
          detail:{ valueAnimation:true, formatter:'{value}%', fontSize:16, fontWeight:700, color:'var(--color-text-primary)', offsetCenter:[0,'55%'] },
          data:[{ value:val, name }],
        }],
      })
      const ro = new ResizeObserver(() => inst.resize())
      ro.observe(ref.current)
      return () => { ro.disconnect(); inst.dispose() }
    }, [])
  })
  return (
    <div style={{ flex:1, display:'flex', gap:4, minHeight:0 }}>
      {items.map((it,i) => <div key={i} ref={it.ref} style={{ flex:1 }} />)}
    </div>
  )
}

export default function StatusChartFeature() {
  return (
    <>
      <Panel style={{ flex:1 }}>
        <SectionHeader title="업무 상태 현황" badge="Nivo" />
        <NV_StatusPie />
      </Panel>
      <Panel style={{ flex:1 }}>
        <SectionHeader title="완료율 게이지" badge="ECharts" />
        <EC_GaugeSet />
      </Panel>
    </>
  )
}
