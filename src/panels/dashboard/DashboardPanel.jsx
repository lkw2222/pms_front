import React from 'react'
import ErrorBoundary    from '@/components/feedback/ErrorBoundary.jsx'
import layout from '@/assets/styles/layout.module.css';
import DashboardHeaderFeature from "../../features/dashboard/DashboardHeaderFeature.jsx";
import DashboardCardFeature from "../../features/dashboard/DashboardCardFeature";
import {UtilityPole, ScanSearch, Skull, Angry, Annoyed, Smile, SmilePlus} from "lucide-react";
import GradeDounutFeature from "@/features/common/charts/GradeDounutFeature";
import LineBarFeature from "@/features/common/charts/LineBarFeature.jsx";
import DashboardTableFeature from "@/features/dashboard/DashboardTableFeature.jsx";
import { GRADE_COLOR } from '@/constants/gradeConst.js'

export default function DashboardPanel() {
    const xAxis = {
        type: 'category',
        data: ['서울', '남서울', '인천', '경기북부', '경기', '강원', '충북', '대세충', '전북', '광주전남', '대구', '경북'],
        axisLine: {
            lineStyle: { color: '#d1d5db' },
        },
        axisTick: { show: false },
        axisLabel: {
            color: '#6b7280',
            fontSize: 11,
        },
    };

    const yAxis = [
        {
            // 왼쪽 Y축 (건수)
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
                lineStyle: { color: '#e5e7eb', type: 'dashed' },
            },
            axisLabel: {
                color: '#9ca3af',
                fontSize: 11,
            },
        },
        {
            // 오른쪽 Y축 (비율 %)
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
                color: '#9ca3af',
                fontSize: 11,
                formatter: '{value}%',
            },
        },
    ];
    const series = [
        {
            name: '중위험군 이상',
            type: 'bar',
            data: [42, 48, 55, 62, 70, 78, 82, 80, 72, 65, 58, 88],
            barWidth: 12,
            barGap: '20%',
            itemStyle: {
                color: '#2563eb',
                borderRadius: [3, 3, 0, 0],
            },
            yAxisIndex: 0,
        },
        {
            name: '중위험군 이상(진단비용)',
            type: 'bar',
            data: [25, 28, 32, 35, 40, 42, 45, 43, 38, 36, 30, 55],
            barWidth: 12,
            itemStyle: {
                color: '#06b6d4',
                borderRadius: [3, 3, 0, 0],
            },
            yAxisIndex: 0,
        },
        {
            name: '전체대상',
            type: 'line',
            data: [62, 65, 68, 72, 75, 78, 80, 78, 75, 72, 68, 82],
            yAxisIndex: 1,                // 오른쪽 Y축 사용
            smooth: true,                 // 부드러운 곡선
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                color: '#fbbf24',
                width: 2,
            },
            itemStyle: {
                color: '#06d47e',
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        },
    ];

    const legendData =['전체대상', '중위험군 이상', '중위험군 이상(진단비용)'];

    return (
        <ErrorBoundary>
            <div className={layout.dashboardWrap} >

                {/* 헤더 */}
                <DashboardHeaderFeature mainTitle="통합 대시보드" subTitle="진단우선순위 (SCC)" showFilter={true} />

                {/* 카드 */}
                <div className={layout.dashboardCard}>
                    <DashboardCardFeature data={{
                        label:"전체",
                        value:"3,500",
                        unit:"개",
                        Icon:UtilityPole,
                        iconSize:17
                    }}/>

                    <DashboardCardFeature data={{
                        label:"진단대상",
                        value:"3,500",
                        unit:"개",
                        sub:[{label: "HI점수 200이상", value:"1,000"}, {label: "기울기 3도 이상", value:"2,000"}],
                        Icon:ScanSearch,
                        iconSize:17
                    }}/>

                    <DashboardCardFeature data={{
                        label:"즉시위험(S등급)",
                        value:"430",
                        unit:"개",
                        sub:[{label: "430", value:"백만원"}],
                        Icon:Skull,
                        iconSize:17,
                        color:GRADE_COLOR.S
                    }}/>

                    <DashboardCardFeature data={{
                        label:"고위험(A등급)",
                        value:"1,354",
                        unit:"개",
                        sub:[{label: "121.1", value:"백만원"}],
                        Icon:Angry,
                        iconSize:17,
                        color:GRADE_COLOR.A
                    }}/>

                    <DashboardCardFeature data={{
                        label:"중위험(B등급)",
                        value:"903",
                        unit:"개",
                        sub:[{label: "72.2", value:"백만원"}],
                        Icon:Annoyed,
                        iconSize:17,
                        color:GRADE_COLOR.B
                    }}/>

                    <DashboardCardFeature data={{
                        label:"저위험(C등급)",
                        value:"392",
                        unit:"개",
                        sub:[{label: "19.6", value:"백만원"}],
                        Icon:Smile,
                        iconSize:17,
                        color:GRADE_COLOR.C
                    }}/>

                    <DashboardCardFeature data={{
                        label:"정기진단(D등급)",
                        value:"420",
                        unit:"개",
                        sub:[{label: "0.4", value:"백만원"}],
                        Icon:SmilePlus,
                        iconSize:17,
                        color:GRADE_COLOR.D
                    }}/>
                </div>

                <div className={layout.dashboardChart}>
                    {/*도넛차트*/}
                    <div className={layout.dashboardDounut}>
                        <GradeDounutFeature/>
                    </div>

                    {/*라인바차트*/}
                    <div className={layout.dashboardLineBar}>
                        <LineBarFeature
                            title="본부별 현황 분석"
                            series={series}
                            xAxis={xAxis}
                            yAxis={yAxis}
                            legendData={legendData}
                            showFilter={false}
                        />
                    </div>
                </div>


                {/*테이블*/}
                <div className={layout.dashboardTable}>
                    <DashboardTableFeature/>
                </div>

            </div>
        </ErrorBoundary>
    )
}
