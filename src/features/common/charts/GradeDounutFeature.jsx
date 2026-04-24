import React from 'react'
import ReactECharts from 'echarts-for-react';
import { GRADE_COLOR, GRADE_BG, GRADE_NAME } from '@/constants/gradeConst.js'
import styles from './GradeDounutFeature.module.css'

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
export default function GradeDounutFeature() {
    const data = [
        {
            grade: 'S',
            name: GRADE_NAME.S,
            percent: 5.5,
            count: 23,
            trend: 'up',
            color: GRADE_COLOR.S,
        },
        {
            grade: 'A',
            name: GRADE_NAME.A,
            percent: 6.7,
            count: 28,
            trend: 'up',
            color: GRADE_COLOR.A,
        },
        {
            grade: 'B',
            name: GRADE_NAME.B,
            percent: 10.8,
            count: 45,
            trend: 'down',
            color: GRADE_COLOR.B,
        },
        {
            grade: 'C',
            name: GRADE_NAME.C,
            percent: 20.9,
            count: 87,
            trend: 'down',
            color: GRADE_COLOR.C,
        },
        {
            grade: 'D',
            name: GRADE_NAME.D,
            percent: 56.1,
            count: 234,
            trend: 'none',
            color: GRADE_COLOR.D,
        },
    ];

    const total = data.reduce((sum, d) => sum + d.count, 0);

    // 도넛 차트 옵션
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
            itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 2,
            },
            label: {
                show: true,
                position: 'inside',
                formatter: '{c}',
                fontSize: 12,
                fontWeight: 'bold',
                color: '#ffffff',
            },
            labelLine: {
                show: true,
                length: 6,
                length2: 6,
                smooth: true,
            },
            emphasis: {
                scale: true,
                scaleSize: 4,
                itemStyle: {
                    shadowBlur: 6,
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                },
            },
            animationDuration: 800,
            animationEasing: 'cubicOut',
            data: data
                .filter((d) => d.count > 0)  // 0은 차트에서 제외
                .map((d) => ({
                    name: d.name,
                    value: d.count,
                    itemStyle: { color: d.color },
                })),
        }],
        graphic: {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: {
                text: total.toString(),
                fontSize: 22,
                fontWeight: 'bold',
                fill: '#111827',
                textAlign: 'center',
                textVerticalAlign: 'middle',
            },
        },
    };

    return (
        <>
            <div className={styles.cardStyle}>
                {/* 제목 */}
                <div className={styles.titleStyle}>전주 진단우선순위 등급별 현황</div>

                {/* 왼쪽 범례 + 오른쪽 도넛 */}
                <div className={styles.bodyStyle}>
                    {/* 왼쪽: 범례 리스트 */}
                    <div className={styles.legendListStyle}>
                        {data.map((item) => (
                            <div key={item.grade} className={styles.legendRowStyle}>
                                {/* 등급 뱃지 (S/A/B/C/D) */}
                                <span className={styles.badgeStyle} style={{background: item.color}} >
                                {item.grade}
                            </span>

                                {/* 등급명 */}
                                <span className={styles.gradeNameStyle}>{item.name}</span>

                                {/* 퍼센트 */}
                                <span className={styles.percentStyle}>{item.percent}%</span>

                                {/* 추세 아이콘 */}
                                <span style={{
                                    fontSize: 11,
                                    width: 14,
                                    color:  item.trend === 'up' ? '#ef4444' : item.trend === 'down' ? '#2563eb' : 'transparent',
                                }}>
                                {item.trend === 'up' && '▲'}
                                    {item.trend === 'down' && '▼'}
                            </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* 오른쪽: 도넛 차트 */}
            <div className={styles.chartBoxStyle}>
                <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
            </div>
        </>
    );
}