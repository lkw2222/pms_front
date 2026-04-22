import React from 'react'
import ReactECharts from "echarts-for-react";
import styles from './WlcResDistMatrixFeature.module.css'

/**
 * 풍하중 평과결과 분포도 매트릭스 차트 (히트맵 차트)
 * 풍하중 평과결과 분포도 평가 대상 전주를 매트릭스 차트로 조회
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
export default function WlcResDistMatrixFeature() {
    // 이미지와 동일한 샘플 데이터 (5열 × 4행)
    // [x, y, value] 형식 — x: 열 인덱스, y: 행 인덱스 (위에서 아래)
    const rawData = [
        // 1행 (맨 위)
        [0, 0, 9],  [1, 0, 11], [2, 0, 13], [3, 0, 7],  [4, 0, 17],
        // 2행
        [0, 1, 12], [1, 1, 7],  [2, 1, 16], [3, 1, 13], [4, 1, 8],
        // 3행
        [0, 2, 5],  [1, 2, 18], [2, 2, 11], [3, 2, 9],  [4, 2, 14],
        // 4행 (맨 아래)
        [0, 3, 8],  [1, 3, 12], [2, 3, 6],  [3, 3, 15], [4, 3, 10],
    ];

    // 총합 계산
    const total = rawData.reduce((sum, [, , v]) => sum + v, 0);
    const maxValue = Math.max(...rawData.map(([, , v]) => v));
    const minValue = Math.min(...rawData.map(([, , v]) => v));

    const option = {
        tooltip: {
            position: 'top',
            formatter: (params) => `값: <b>${params.value[2]}</b>`,
        },
        grid: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            containLabel: false,
        },
        // 축 완전 숨김 (눈금선, 라벨 모두 제거)
        xAxis: {
            type: 'category',
            data: [0, 1, 2, 3, 4],
            show: false,
            splitArea: { show: false },
        },
        yAxis: {
            type: 'category',
            data: [0, 1, 2, 3],
            show: false,
            splitArea: { show: false },
            inverse: true,  // y축 뒤집어서 0이 맨 위로 오도록
        },
        // 값 → 색상 매핑 (파란색 그라데이션)
        visualMap: {
            min: minValue,
            max: maxValue,
            show: false,   // 범례 숨김
            inRange: {
                color: ['#dbe6fb', '#a4c0f0', '#6e96e5', '#3b6fd9', '#2b50b8'],
            },
        },
        series: [{
            type: 'heatmap',
            data: rawData,
            // 각 칸 안에 값 표시
            label: {
                show: true,
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 'bold',
                textShadowColor: 'rgba(0,0,0,0.2)',
                textShadowBlur: 2,
            },
            // 칸 간격 및 모서리
            itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 3,
                borderRadius: 6,
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 8,
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                },
            },
            // 등장 애니메이션
            animationDuration: 800,
            animationEasing: 'cubicOut',
        }],
    };

    return (
        <div>
            {/* 헤더 영역 */}
            <div className={styles.metrixHeader}>
                <span class={styles.pole} >평가 대상 전주 총 {total.toLocaleString()} 건</span>
                <span class={styles.new} >
                    이번달 최근 신규 <span class={styles.newCnt} >+ 42건</span>
                </span>
            </div>

            {/* 히트맵 */}
            <ReactECharts
                option={option}
                style={{ width: '100%', height: 220 }}
            />
        </div>
    )
}