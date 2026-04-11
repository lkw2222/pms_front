import React, { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KpiCard } from './lib/DashboardComponents.jsx'
import { C } from './lib/dashboardUtils.js'
import { LoadingState } from '@/components/feedback/QueryState.jsx'

function KpiCards() {
  const { data } = useSuspenseQuery({
    queryKey: ['dashboard', 'kpi'],
    queryFn:  async () => {
      // ── 실제 API 호출 예제 ───────────────────────────────
      // return dashboardApi.getKpi()
      await new Promise(r => setTimeout(r, 400))
      return { total:389, done:234, inProgress:87, rate:32.6 }
    },
    staleTime: 1000 * 60,
  })

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
      <KpiCard label="전체 업무"    value={String(data.total)}      unit="건" sub="이번달 신규" subVal="+42건"  accent={C.blue}   />
      <KpiCard label="완료"         value={String(data.done)}       unit="건" sub="완료율"     subVal="78%"   subColor={C.green}  accent={C.green}  />
      <KpiCard label="진행중"       value={String(data.inProgress)} unit="건" sub="지연포함"   subVal="23건"  subColor={C.orange} accent={C.orange} />
      <KpiCard label="이번달 처리율" value={String(data.rate)}      unit="%"  sub="전월 대비"  subVal="+4.2%" subColor={C.blue}   accent={C.purple} />
    </div>
  )
}

export default function KpiFeature() {
  return (
    <Suspense fallback={
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
        {Array.from({length:4}).map((_,i) => (
          <div key={i} style={{
            height:80, borderRadius:'var(--radius-lg)',
            background:'var(--color-bg-secondary)', border:'1px solid var(--color-border)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <LoadingState message="" />
          </div>
        ))}
      </div>
    }>
      <KpiCards />
    </Suspense>
  )
}
