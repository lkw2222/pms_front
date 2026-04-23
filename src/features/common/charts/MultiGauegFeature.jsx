import React from 'react';
import ReactECharts from 'echarts-for-react';
import styles from './MultiGauegFeature.module.css';

// 개별 게이지 차트 컴포넌트
const GaugeItem = ({ title, value, max = 50 }) => {
    // ECharts 옵션 설정 (이전과 동일)
    const option = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: max,
                radius: '100%',
                center: ['50%', '75%'],
                axisLine: {
                    lineStyle: {
                        width: 20,
                        color: [
                            [0.25, '#4285F4'],
                            [0.50, '#7CB342'],
                            [0.75, '#FBBC05'],
                            [1.00, '#EA4335']
                        ]
                    }
                },
                pointer: { width: 4, length: '70%', itemStyle: { color: '#333' } },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                detail: { show: false },
                data: [{ value: value }]
            }
        ]
    };

    return (
        <div className={styles.itemWrapper}>
            <div style={{width:'100px', height:'100px', float:'left'}}>
                <ReactECharts style={{width:'100%', height:'100%'}}
                              option={option}
                />
            </div>

            <div className={styles.textWrapper}>
                <span className={styles.title}>{title}</span>
                <div className={styles.valueGroup}>
                    <span className={styles.value}>{value.toFixed(2)}</span>
                    <span className={styles.unit}>점</span>
                </div>
            </div>
        </div>
    );
};

// 메인 4구역 대시보드 컴포넌트
export default function MultiGauegFeature() {
    const data = [
        { title: '구조안전성', value: 24.40, max: 50 },
        { title: '환경부식', value: 4.05, max: 10 },
        { title: '하중외력', value: 21.60, max: 50 },
        { title: '운영이력', value: 3.10, max: 10 },
    ];

    return (
        <div className={styles.container}>
            {data.map((item, index) => (
                <GaugeItem
                    key={index}
                    title={item.title}
                    value={item.value}
                    max={item.max}
                />
            ))}
        </div>
    );
}