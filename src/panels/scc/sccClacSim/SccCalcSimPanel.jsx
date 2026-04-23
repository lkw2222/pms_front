import React                  from 'react';
import ErrorBoundary           from '@/components/feedback/ErrorBoundary.jsx';

import layout from '@/assets/styles/layout.module.css';
import SccCalcSimSearchFeatrue from "@/features/scc/sccCalcSim/SccCalcSimSearchFeatrue";
import SccCalcSimMoney from "../../../features/scc/sccCalcSim/SccCalcSimMoney";
import SccCalcSimExecFeature from "../../../features/scc/sccCalcSim/SccCalcSimExecFeature.jsx";
import LineBarFeature from "../../../features/common/charts/LineBarFeature.jsx";
import SccCalcSimTable from "../../../features/scc/sccCalcSim/SccCalcSimTable";

/**
 * SCC 산출 시뮬레이션 패널.
 *
 * @author LKW
 * @since 2026-04-20
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-20 | LKW    | 최초 작성 |
 */
export default function SccCalcSimPanel() {
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
            <div className="grid-wrap">
                <SccCalcSimSearchFeatrue />
                <SccCalcSimMoney />
                <SccCalcSimExecFeature/>

                <div className={layout.panelWrap}>
                    <div className={layout.panelLeft}>
                        <div className={layout.panelBox}>
                            <LineBarFeature
                                title="본부별 월간 위험군별 산출 분포"
                                series={series}
                                xAxis={xAxis}
                                yAxis={yAxis}
                                legendData={legendData}
                            />
                        </div>
                    </div>
                    <div className={layout.panelRight}>
                        <div className={layout.panelBox}>
                            <SccCalcSimTable />
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}
