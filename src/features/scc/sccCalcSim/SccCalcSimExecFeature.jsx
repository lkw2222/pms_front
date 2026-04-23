import React, { useState, useMemo } from 'react';
import styles from './SccCalcSimExecFeature.module.css';

/**
 * 진단비용 시뮬레이션 산출 실행
 *
 * @author LKW
 * @since 2026-04-22
 * @returns {JSX.Element}
 */
export default function SccCalcSimExecFeature({ onSimulate }) {
    // 등급별 기본 비용 정보
    const baseCosts = useMemo(() => [
        { key: 'S', name: '즉시위험 (S)', baseCost: 10000000, min: 0, max: 30000000, step: 100000 },
        { key: 'A', name: '고위험 (A)',   baseCost: 9000000,  min: 0, max: 25000000, step: 100000 },
        { key: 'B', name: '중위험 (B)',   baseCost: 8000000,  min: 0, max: 20000000, step: 100000 },
        { key: 'C', name: '저위험 (C)',   baseCost: 5000000,  min: 0, max: 15000000, step: 100000 },
        { key: 'D', name: '정기진단(D)',  baseCost: 100000,   min: 0, max: 1000000,  step: 10000 },
    ], []);

    // 가상 비용 초기값 (이미지 값 기준)
    const [simulatedCosts, setSimulatedCosts] = useState({
        S: 20000000,
        A: 15000000,
        B: 10000000,
        C: 7500000,
        D: 200000,
    });

    const handleSliderChange = (key, value) => {
        setSimulatedCosts((prev) => ({ ...prev, [key]: Number(value) }));
    };

    const handleSimulate = () => {
        onSimulate?.({ baseCosts, simulatedCosts });
        console.log('시뮬레이션 실행:', simulatedCosts);
    };

    return (
        <div className={styles.container} style={{marginBottom: '10px'}}>
            {/* 왼쪽: 기본정보 + 슬라이더 + 가상 비용 */}
            <div className={styles.mainArea}>
                {/* 헤더 */}
                <div className={styles.header}>
                    <div className={styles.leftTitle}>진단비용 산출 기본정보 (개)</div>
                    <div className={styles.rightTitle}>진단비용 (가상)</div>
                </div>

                {/* 등급별 행 */}
                <div className={styles.rowList}>
                    {baseCosts.map((item) => (
                        <div key={item.key} className={styles.row}>
                            {/* 등급 라벨 */}
                            <div className={styles.gradeLabel}>{item.name}</div>

                            {/* 기본 비용 */}
                            <div className={styles.baseCost}>
                                {item.baseCost.toLocaleString()}
                            </div>

                            {/* 슬라이더 */}
                            <div className={styles.sliderBox}>
                                <input
                                    type="range"
                                    min={item.min}
                                    max={item.max}
                                    step={item.step}
                                    value={simulatedCosts[item.key]}
                                    onChange={(e) => handleSliderChange(item.key, e.target.value)}
                                    className={styles.slider}
                                />
                            </div>

                            {/* 가상 비용 */}
                            <div className={styles.simulatedCost}>
                                {simulatedCosts[item.key].toLocaleString()} 원
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 오른쪽: 실행 버튼 */}
            <button
                type="button"
                className={styles.execButton}
                onClick={handleSimulate}
            >
                진단비용
                <br />
                시뮬레이션 산출
            </button>
        </div>
    );
}