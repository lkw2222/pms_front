import React, {useState} from 'react'
import ReactECharts from 'echarts-for-react';
import styles from './LineBarFeature.module.css'
import SelectInput from "@/components/input/SelectInput";

/**
 * 라인 + 바 차트
 *
 * @author LKW
 * @since 2026-04-22
 *
 * @param title String(default='') 제목
 * @param xAxis Object x축 데이터
 * @param yAxis Object y축 데이터
 * @param series Object 시리즈 데이터
 * @param legendData Object 범례
 *
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-22 | LKW    | 최초 작성 |
 */
export default function LineBarFeature({title='', xAxis, yAxis, series, legendData, showFilter = true}) {
    const [year, setYear] = useState('2026');

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
        },
        legend: {
            data: legendData,
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
        ...{xAxis},
        ...{yAxis},
        ...{series},
        animationDuration: 800,
        animationEasing: 'cubicOut',
    };

    return (
        <div>
            {/* 헤더: 제목 + 드롭다운 */}
            <div className={styles.header}>
                <span className={styles.title} >
                    {title}
                </span>

                {showFilter && (
                    <SelectInput
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        options={[{label: "2026년", value: "2026"}, {label: "2025년", value: "2025"}]}
                    />
                )}
            </div>

            {/* 차트 */}
            <ReactECharts
                option={option}
                style={{ width: '100%', height: 180 }}
            />
        </div>
    );
}