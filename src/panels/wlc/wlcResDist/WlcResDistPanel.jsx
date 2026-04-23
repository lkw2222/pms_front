import React                  from 'react';
import ErrorBoundary           from '@/components/feedback/ErrorBoundary.jsx';
import DateRangeFilterFeature from '@/features/common/filter/DateRangeFilterFeature.jsx';
import MapFilterFeature from '@/features/common/charts/MapFilterFeature.jsx';
import LineBarFeature from '@/features/common/charts/LineBarFeature.jsx';
import DistMatrixFeature from '@/features/common/charts/DistMatrixFeature.jsx';
import WlcResDistGridFeature from '@/features/wlc/wlcResDist/WlcResDistGridFeature.jsx';
import WlcResDistPieFeature from '@/features/wlc/wlcResDist/WlcResDistPieFeature.jsx';

import layout from '@/assets/styles/layout.module.css';

/**
 * 풍하중 평가결과 분포도 조회 패널.
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
export default function WlcResDistPanel() {

    const xAxis = {
        type: 'category',
            data: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
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
            name: '2.0이상',
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
            name: '2.0이하',
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
            name: '평균',
            type: 'line',
            data: [62, 65, 68, 72, 75, 78, 80, 78, 75, 72, 68, 82],
            yAxisIndex: 1,                // 오른쪽 Y축 사용
            smooth: true,                 // 부드러운 곡선
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
                color: '#f97316',         // 주황색
                width: 2,
            },
            itemStyle: {
                color: '#f97316',
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        },
    ];

    const legendData =['2.0이상', '2.0이하', '평균'];

    return (
        <ErrorBoundary>
            <div className="grid-wrap">
                <div className={layout.panelWrap}>
                    <div className={layout.panelLeft}>
                        <div className={layout.panelBox}><MapFilterFeature /></div>
                        <div className={layout.panelBox}><WlcResDistGridFeature /></div>
                    </div>
                    <div className={layout.panelRight}>
                        <div className={layout.panelMinBox}><DateRangeFilterFeature /></div>
                        <div className={layout.panelBox}><DistMatrixFeature /></div>
                        <div className={layout.panelBoxNonFlex}><WlcResDistPieFeature /></div>
                        <div className={layout.panelBox}>
                            <LineBarFeature
                                title="본부별 월간 안전율(수치) 산출 분포"
                                series={series}
                                xAxis={xAxis}
                                yAxis={yAxis}
                                legendData={legendData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}
