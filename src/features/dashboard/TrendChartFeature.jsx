import React from 'react'
import { ResponsiveLine }  from '@nivo/line'
import { ResponsiveRadar } from '@nivo/radar'
import { Panel, SectionHeader } from './lib/DashboardComponents.jsx'
import { C, useNivoTheme } from './lib/dashboardUtils.js'

function NV_WeeklyLine() {
  const theme = useNivoTheme()
  const data = [
    { id:'이번주', color:C.blue, data:[{x:'월',y:12},{x:'화',y:18},{x:'수',y:15},{x:'목',y:22},{x:'금',y:19}] },
    { id:'지난주', color:C.gray, data:[{x:'월',y:9},{x:'화',y:14},{x:'수',y:20},{x:'목',y:16},{x:'금',y:14}] },
  ]
  return (
    <div style={{ flex:1, minHeight:0 }}>
      <ResponsiveLine
        data={data} theme={theme}
        colors={({ color }) => color}
        margin={{ top:8, right:12, bottom:32, left:30 }}
        xScale={{ type:'point' }} yScale={{ type:'linear', min:0, max:28 }}
        curve="monotoneX"
        axisBottom={{ tickSize:0, tickPadding:6 }}
        axisLeft={{ tickSize:0, tickPadding:6, tickValues:4 }}
        enableGridX={false} gridYValues={4}
        pointSize={6} pointBorderWidth={2}
        pointBorderColor={{ from:'serieColor' }} pointColor="#fff"
        enableArea={true} areaOpacity={0.08} useMesh={true}
        legends={[{ anchor:'bottom', direction:'row', translateY:30, itemWidth:55, itemHeight:12, itemsSpacing:8, symbolShape:'circle', symbolSize:8 }]}
        tooltip={({ point }) => (
          <div style={{ ...theme.tooltip.container, padding:'6px 10px' }}>
            <b>{point.serieId}</b> {point.data.x}: {point.data.y}건
          </div>
        )}
      />
    </div>
  )
}

function NV_PriorityRadar() {
  const theme = useNivoTheme()
  const data = [
    { priority:'긴급', 이번달:75, 지난달:55 },
    { priority:'높음', 이번달:60, 지난달:48 },
    { priority:'보통', 이번달:88, 지난달:72 },
    { priority:'낮음', 이번달:40, 지난달:55 },
    { priority:'예정', 이번달:65, 지난달:50 },
  ]
  return (
    <div style={{ flex:1, minHeight:0 }}>
      <ResponsiveRadar
        data={data} theme={theme}
        keys={['이번달','지난달']} indexBy="priority"
        colors={[C.blue, C.gray]}
        margin={{ top:16, right:40, bottom:24, left:40 }}
        borderWidth={2} gridLevels={4} gridShape="circular"
        dotSize={5} dotBorderWidth={2} fillOpacity={0.1}
        legends={[{ anchor:'bottom', direction:'row', translateY:22, itemWidth:50, itemHeight:12, itemsSpacing:8, symbolShape:'circle', symbolSize:8 }]}
      />
    </div>
  )
}

export default function TrendChartFeature() {
  return (
    <>
      <Panel style={{ flex:1.5 }}>
        <SectionHeader title="주간 처리 추이" badge="Nivo" />
        <NV_WeeklyLine />
      </Panel>
      <Panel style={{ flex:1 }}>
        <SectionHeader title="우선순위별 분포" badge="Nivo" />
        <NV_PriorityRadar />
      </Panel>
    </>
  )
}
