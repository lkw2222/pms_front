import React  from 'react'
import styles             from './SccCalcSimMoney.module.css'

/**
 * SCC 산출 시뮬레이터 금액
 *
 * @author LKW
 * @since 2026-04-23
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-23 | LKW    | 최초 작성 |
 */
export default function SccCalcSimMoney({
                                            total = 3500,
                                            riskRatio = 0.857,
                                            totalCost = 277,
                                            gradeData = [
                                                { key: 'S', name: '즉시위험', count: 12,   cost: 120 },
                                                { key: 'A', name: '고위험',   count: 13,   cost: 117 },
                                                { key: 'B', name: '중위험',   count: 5,    cost: 40 },
                                                { key: 'C', name: '저위험',   count: 2,    cost: 10 },
                                                { key: 'D', name: '정기진단', count: 3468, cost: 346.8 },
                                            ],
                                        }) {
    return (
        <div className={styles.container}>
            {/* ── 상단 행 ── */}
            <div className={styles.topRow}>
                <div className={styles.summaryBox}>
                    <span className={styles.summaryLabel}>전체 (개)</span>
                    <span className={styles.summaryValue}>
                        {total.toLocaleString()}
                    </span>
                </div>

                <div className={styles.summaryBox}>
                    <span className={styles.summaryLabel}>중 위험군 이상 대상 비율</span>
                    <span className={styles.summaryValueHighlight}>{riskRatio}</span>
                    <span className={styles.unitText}>%</span>
                </div>

                <div className={styles.summaryBox}>
                    <span className={styles.summaryLabel}>진단비용 산출</span>
                    <span className={styles.summaryValue}>
                        {totalCost.toLocaleString()}
                    </span>
                    <span className={styles.unitText}>백만원</span>
                </div>
            </div>

            {/* ── 하단 행 ── */}
            <div className={styles.bottomRow}>
                {/* 왼쪽 타이틀 박스 */}
                <div className={styles.leftTitle}>
                    <div>진단비용 산출</div>
                </div>

                {/* 등급별 카드 영역 */}
                <div className={styles.gradeGrid}>
                    {gradeData.map((grade) => (
                        <div key={grade.key} className={styles.gradeCol}>
                            {/* 상단: 등급명 + 개수 */}
                            <div className={styles.gradeHeader}>
                                <span className={styles.gradeName}>
                                    {grade.name}
                                </span>
                                <span className={styles.gradeCount}>
                                    {grade.count.toLocaleString()}
                                    <span className={styles.unitTextRight}>개</span>
                                </span>
                            </div>

                            {/* 하단: 비용 박스 */}
                            <div className={styles.costBox}>
                                {grade.cost.toLocaleString()}
                                <span className={styles.unitTextRight}>백만원</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
