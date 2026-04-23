import React from 'react'
import ReactECharts from 'echarts-for-react';
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
            name: '즉시 위험',
            percent: 12.3,
            count: 23,
            trend: 'up',       // 'up' | 'down' | 'none'
            color: '#ef4444',  // 빨강
        },
        {
            grade: 'A',
            name: '고 위험',
            percent: 38.7,
            count: 234,
            trend: 'up',
            color: '#fbbf24',  // 파랑
        },
        {
            grade: 'B',
            name: '중 위험',
            percent: 25.8,
            count: 87,
            trend: 'down',
            color: '#06d47e',  // 청록
        },
        {
            grade: 'C',
            name: '저 위험',
            percent: 11.2,
            count: 45,
            trend: 'down',
            color: '#06b6d4',  // 노랑
        },
        {
            grade: 'D',
            name: '정기진단',
            percent: 12.0,
            count: 0,          // 0이면 차트에서는 제외되거나 조그맣게
            trend: 'none',
            color: '#2563eb',  // 회색
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
                fontSize: 13,
                fontWeight: 'bold',
                color: '#374151',
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