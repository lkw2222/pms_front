import React from 'react'
import ReactECharts from 'echarts-for-react';
import styles from './SccResDistPieFeature.module.css'

/**
 * 풍하중 평과결과 분포도 파이 차트
 * 풍하중 평과결과 분포를 파이 차트로 조회
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
export default function SccResDistPieFeature() {
    // 샘플 데이터
    const data = [
        { name: '적합-A', value: 234, color: '#2563eb' },   // 진한 파랑
        { name: '적합-B', value: 87,  color: '#60a5fa' },   // 하늘색
        { name: '부적합-A', value: 45, color: '#fbbf24' },  // 노랑
        { name: '부적합-B', value: 23, color: '#ef4444' },  // 빨강
    ];

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const totalPass = 25000;      // 적합 총 건수
    const totalFail = 1000;       // 부적합 총 건수

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: (params) =>
                `${params.name}<br/>값: <b>${params.value}</b> (${params.percent}%)`,
        },
        series: [{
            type: 'pie',
            radius: ['50%', '90%'],  // [내경, 외경] — 도넛 두께 결정
            center: ['50%', '50%'],
            avoidLabelOverlap: true,

            // 외곽선으로 세그먼트 분리감
            itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 2,
                borderRadius: 2,
            },

            // 조각 위에 값 표시
            label: {
                show: true,
                position: 'inside',
                formatter: '{c}',
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ffffff',
            },

            // 연결선
            labelLine: {
                show: true,
                length: 4,
                length2: 4,
                smooth: true,
            },

            emphasis: {
                scale: true,
                scaleSize: 5,
                itemStyle: {
                    shadowBlur: 8,
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                },
            },

            animationDuration: 800,
            animationEasing: 'cubicOut',

            data: data.map((d) => ({
                name: d.name,
                value: d.value,
                itemStyle: { color: d.color },
            })),
        }],
        // 중앙 총합 표시 (graphic으로 구현)
        graphic: {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: {
                text: total.toString(),
                fontSize: 20,
                fontWeight: 'bold',
                fill: '#111827',
                textAlign: 'center',
                textVerticalAlign: 'middle',
            },
        },
    };

    return (
        <div className={styles.wrap}>
            {/* 왼쪽 요약 영역 */}
            <div className={styles.leftCon}>
                <div className={styles.leftTitle}>
                    풍하중 판정결과 분포
                </div>

                <div className={styles.leftStats}>
                    <span className={styles.leftTotalBlue} >
                        {totalPass.toLocaleString()}
                    </span>
                    <span className={styles.leftCnt} >
                        개 <span className={styles.gradeGood} >(적합)</span>
                    </span>
                </div>

                <div>
                    <span className={styles.leftTotalRed} >
                        {totalFail.toLocaleString()}
                    </span>
                    <span className={styles.leftCnt} >
                        개 <span className={styles.gradeBad} >(부적합)</span>
                    </span>
                </div>
            </div>

            {/* 오른쪽 도넛 차트 */}
            <div className={styles.rightCon}>
                <ReactECharts
                    option={option}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
}