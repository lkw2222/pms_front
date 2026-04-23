import React, {useState} from 'react'
import ReactECharts from 'echarts-for-react';
import styles from './LineBarFeature.module.css'
import SelectInput from "@/components/input/SelectInput";

/**
 * 라인 + 바 차트
 *
 * @author LKW
 * @since 2026-04-22
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-22 | LKW    | 최초 작성 |
 */
export default function LineBarFeature() {
    const [year, setYear] = useState('2026');

    const months = ['1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'];

    // 샘플 데이터
    const data2OverCount = [42, 48, 55, 62, 70, 78, 82, 80, 72, 65, 58, 88];  // 2.0 이상
    const data2UnderCount = [25, 28, 32, 35, 40, 42, 45, 43, 38, 36, 30, 55]; // 2.0 이하
    const ratioLine = [62, 65, 68, 72, 75, 78, 80, 78, 75, 72, 68, 82];       // 평균선 (%)

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
        },
        legend: {
            data: ['2.0이상', '2.0이하', '평균'],
            bottom: 0,
            icon: 'rect',
            itemWidth: 12,
            itemHeight: 12,
            textStyle: { fontSize: 12, color: '#4b5563' },
        },
        grid: {
            left: 40,
            right: 50,
            top: 20,
            bottom: 50,
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: months,
            axisLine: {
                lineStyle: { color: '#d1d5db' },
            },
            axisTick: { show: false },
            axisLabel: {
                color: '#6b7280',
                fontSize: 11,
            },
        },
        yAxis: [
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
        ],
        series: [
            {
                name: '2.0이상',
                type: 'bar',
                data: data2OverCount,
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
                data: data2UnderCount,
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
                data: ratioLine,
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
        ],
        animationDuration: 800,
        animationEasing: 'cubicOut',
    };

    return (
        <div>
            {/* 헤더: 제목 + 드롭다운 */}
            <div className={styles.header}>
                <span className={styles.title} >
                    본부별 월간 안전율(수치) 산출 분포
                </span>

                <SelectInput
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    options={[{label: "2026년", value: "2026"}, {label: "2025년", value: "2025"}]}
                />
            </div>

            {/* 차트 */}
            <ReactECharts
                option={option}
                style={{ width: '100%', height: 200 }}
            />
        </div>
    );
}