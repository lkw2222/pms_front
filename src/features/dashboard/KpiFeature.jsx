import React from 'react'
import { KpiCard } from './lib/DashboardComponents.jsx'
import { C } from './lib/dashboardUtils.js'

export default function KpiFeature() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
      <KpiCard label="전체 업무"    value="389"  unit="건" sub="이번달 신규" subVal="+42건"  accent={C.blue}   />
      <KpiCard label="완료"         value="234"  unit="건" sub="완료율"     subVal="78%"   subColor={C.green}  accent={C.green}  />
      <KpiCard label="진행중"       value="87"   unit="건" sub="지연포함"   subVal="23건"  subColor={C.orange} accent={C.orange} />
      <KpiCard label="이번달 처리율" value="32.6" unit="%"  sub="전월 대비"  subVal="+4.2%" subColor={C.blue}   accent={C.purple} />
    </div>
  )
}
