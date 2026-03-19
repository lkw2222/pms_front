import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { Panel, SectionHeader } from './lib/DashboardComponents.jsx'
import { C, useNivoTheme } from './lib/dashboardUtils.js'

function NV_DeptBar() {
  const theme = useNivoTheme()
  const data = [
    { dept:'기획', 등록:45, 완료:40 },
    { dept:'개발', 등록:88, 완료:75 },
    { dept:'운영', 등록:62, 완료:55 },
    { dept:'품질', 등록:34, 완료:28 },
    { dept:'지원', 등록:51, 완료:46 },
    { dept:'인프라',등록:29, 완료:22 },
  ]
  return (
    <div style={{ flex:1, minHeight:0 }}>
      <ResponsiveBar
        data={data} theme={theme}
        keys={['등록','완료']} indexBy="dept"
        margin={{ top:8, right:12, bottom:28, left:28 }}
        padding={0.3} groupMode="grouped"
        colors={[C.blue, C.cyan]} borderRadius={3}
        axisBottom={{ tickSize:0, tickPadding:6 }}
        axisLeft={{ tickSize:0, tickPadding:6, tickValues:4 }}
        enableLabel={false} enableGridX={false} gridYValues={4}
        legends={[{ dataFrom:'keys', anchor:'top-right', direction:'row', translateY:-10, itemWidth:44, itemHeight:12, itemsSpacing:4, symbolShape:'square', symbolSize:8 }]}
        tooltip={({ id, value, color }) => (
          <div style={{ ...theme.tooltip.container, padding:'6px 10px' }}>
            <span style={{ color }}>{id}</span>: {value}건
          </div>
        )}
      />
    </div>
  )
}

function NV_BubbleScatter() {
  const theme = useNivoTheme()
  const data = [
    { id:'개발팀', color:C.blue,   data:[{x:8,y:5,size:4},{x:6,y:4,size:3},{x:9,y:5,size:5},{x:4,y:3,size:2},{x:7,y:4,size:3}] },
    { id:'운영팀', color:C.cyan,   data:[{x:5,y:4,size:3},{x:3,y:5,size:2},{x:6,y:3,size:4},{x:2,y:2,size:2}] },
    { id:'기획팀', color:C.purple, data:[{x:4,y:3,size:3},{x:3,y:2,size:2},{x:5,y:4,size:4}] },
    { id:'품질팀', color:C.orange, data:[{x:7,y:4,size:3},{x:5,y:3,size:2},{x:6,y:5,size:3}] },
    { id:'인프라', color:C.red,    data:[{x:9,y:5,size:5},{x:7,y:4,size:3},{x:5,y:3,size:2}] },
  ]
  return (
    <div style={{ flex:1, minHeight:0 }}>
      <ResponsiveScatterPlot
        data={data} theme={theme}
        colors={({ serieId }) => data.find(d=>d.id===serieId)?.color || C.blue}
        margin={{ top:8, right:90, bottom:36, left:40 }}
        xScale={{ type:'linear', min:1, max:10 }}
        yScale={{ type:'linear', min:1, max:5 }}
        nodeSize={({ data }) => (data.size||2)*8}
        axisBottom={{ tickSize:0, tickPadding:6, legend:'복잡도', legendOffset:28, legendPosition:'middle', tickValues:[2,4,6,8,10] }}
        axisLeft={{ tickSize:0, tickPadding:6, legend:'우선순위', legendOffset:-30, legendPosition:'middle', tickValues:[1,2,3,4,5], format:v=>['','낮음','보통','높음','긴급','최우선'][v]||v }}
        legends={[{ anchor:'right', direction:'column', translateX:88, translateY:0, itemWidth:72, itemHeight:16, itemsSpacing:4, symbolShape:'circle', symbolSize:10 }]}
        tooltip={({ node }) => (
          <div style={{ ...theme.tooltip.container, padding:'8px 12px' }}>
            <div style={{ fontWeight:700, color:data.find(d=>d.id===node.serieId)?.color }}>{node.serieId}</div>
            <div style={{ fontSize:10, marginTop:2, opacity:0.8 }}>복잡도: {node.data.x} / 우선순위: {['','낮음','보통','높음','긴급','최우선'][node.data.y]}</div>
          </div>
        )}
      />
    </div>
  )
}

export default function DeptChartFeature() {
  return (
    <>
      <Panel style={{ flex:1 }}>
        <SectionHeader title="부서별 처리 현황" badge="Nivo" />
        <NV_DeptBar />
      </Panel>
      <Panel style={{ flex:1.5 }}>
        <SectionHeader title="업무 복잡도 × 우선순위 분포" badge="Nivo" />
        <NV_BubbleScatter />
      </Panel>
    </>
  )
}
