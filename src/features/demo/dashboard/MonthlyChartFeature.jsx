import React, { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Panel, SectionHeader } from './lib/DashboardComponents.jsx'
import { C, eTT, useEChart } from './lib/dashboardUtils.js'
import { LoadingState } from '@/components/feedback/QueryState.jsx'
import {BarChart3, CalendarDays} from 'lucide-react'

function getChartColors() {
    const css = getComputedStyle(document.documentElement)
    return {
        textPrimary: css.getPropertyValue('--color-text-primary').trim(),
        textSecondary: css.getPropertyValue('--color-text-secondary').trim(),
        textMuted: css.getPropertyValue('--color-text-muted').trim(),
        border: css.getPropertyValue('--color-border').trim(),
        bgSecondary: css.getPropertyValue('--color-bg-secondary').trim(),
    }
}

function EC_MonthlyMix() {
  useSuspenseQuery({
    queryKey: ['dashboard', 'monthly'],
    queryFn:  async () => {
      // return dashboardApi.getMonthly()
      await new Promise(r => setTimeout(r, 800))
      return {}
    },
    staleTime: 1000 * 60,
  })
  const { textSecondary, textMuted, border } = getChartColors()
  const m = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
  const r = [42,55,38,67,71,58,82,74,63,88,76,91]
  const d = [38,48,31,60,65,54,75,68,58,80,70,84]
  const ref = useEChart(() => ({
    tooltip:{ ...eTT, trigger:'axis' },
    legend:{ data:['등록','완료','완료율'], bottom:0, textStyle:{ color:textSecondary, fontSize:10 }, itemWidth:10, itemHeight:10 },
    grid:{ top:8, bottom:36, left:36, right:44 },
    xAxis:{ type:'category', data:m, axisLabel:{ color:textMuted, fontSize:9 }, axisLine:{ lineStyle:{ color:border } }, splitLine:{ show:false } },
    yAxis:[
      { type:'value', axisLabel:{ color:textMuted, fontSize:9 }, splitLine:{ lineStyle:{ color:border, type:'dashed' } } },
      { type:'value', min:0, max:120, axisLabel:{ color:textMuted, fontSize:9, formatter:'{value}%' }, splitLine:{ show:false } },
    ],
    series:[
      { name:'등록', type:'bar', data:r, barMaxWidth:10, itemStyle:{ color:C.blue, borderRadius:[3,3,0,0] } },
      { name:'완료', type:'bar', data:d, barMaxWidth:10, itemStyle:{ color:C.cyan, borderRadius:[3,3,0,0] } },
      { name:'완료율', type:'line', yAxisIndex:1, data:r.map((v,i)=>Math.round(d[i]/v*100)), smooth:true, symbol:'circle', symbolSize:4, lineStyle:{ color:C.orange, width:2 }, itemStyle:{ color:C.orange } },
    ],
  }))
  return <div ref={ref} style={{ flex:1, minHeight:0 }} />
}

function EC_Heatmap() {
  const days = ['월','화','수','목','금']
  const weeks = ['1주','2주','3주','4주']
  const data = []
  const raw = [[8,12,6,15,10],[5,18,11,9,14],[12,7,16,13,8],[9,11,13,7,17]]
  raw.forEach((row,wi) => row.forEach((val,di) => data.push([di,wi,val])))
  const ref = useEChart(() => ({
    tooltip:{ ...eTT, formatter:(p) => `${weeks[p.data[1]]} ${days[p.data[0]]}: ${p.data[2]}건` },
    grid:{ top:8, bottom:28, left:36, right:8 },
    xAxis:{ type:'category', data:days, axisLabel:{ color:'var(--color-text-muted)', fontSize:10 }, splitArea:{ show:true, areaStyle:{ color:['transparent'] } } },
    yAxis:{ type:'category', data:weeks, axisLabel:{ color:'var(--color-text-muted)', fontSize:10 }, splitArea:{ show:true, areaStyle:{ color:['transparent'] } } },
    visualMap:{ min:0, max:20, show:false, inRange:{ color:['#dbeafe','#1d4ed8'] } },
    series:[{ type:'heatmap', data, label:{ show:true, fontSize:9, color:'#fff', formatter:(p)=>p.data[2] }, itemStyle:{ borderRadius:3, borderWidth:2, borderColor:'var(--color-bg-secondary)' } }],
  }))
  return <div ref={ref} style={{ flex:1, minHeight:0 }} />
}

export default function MonthlyChartFeature() {
  return (
    <>
      <Panel style={{ flex:2 }}>
        <SectionHeader title="월별 등록/완료 현황" badge="ECharts" icon={BarChart3} />
        <Suspense fallback={<LoadingState />}>
          <EC_MonthlyMix />
        </Suspense>
      </Panel>
      <Panel style={{ flex:1 }}>
        <SectionHeader title="요일 × 주차 업무 강도" badge="ECharts" icon={CalendarDays} />
        <EC_Heatmap />
      </Panel>
    </>
  )
}
