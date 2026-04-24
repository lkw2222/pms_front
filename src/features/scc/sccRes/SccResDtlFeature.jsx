import React from 'react'
import BasicButton from "@/components/button/BasicButton.jsx"
import BasicLabel  from "@/components/label/BasicLabel.jsx"
import { FileDown } from "lucide-react"
import styles from './SccResDtlFeature.module.css'
import { GRADE_VARIANT } from '@/constants/gradeConst.js'

/**
 * SCC 평가 결과 상세 화면.
 * data prop 을 받아 점수 카드·기본 정보·4개 채점 섹션을 렌더링한다.
 *
 * @author JDJ
 * @since 2026-04-21
 * @param {{ data: object }} props
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-21 | JDJ    | 최초 작성 |
 * | 2026-04-23 | JDJ    | SCC 채점 구조로 전면 개편 |
 */

// ── 섹션 래퍼 ─────────────────────────────────────────────────────────────────
function Section({ title, meta, children }) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionLabel}>
                <span className={styles.sectionLabelText}>{title}</span>
                {meta && <span className={styles.scoringMeta}>{meta}</span>}
            </div>
            {children}
        </div>
    )
}

// ── 종합 SCC 점수 카드 ────────────────────────────────────────────────────────
function ScoreCard({ data }) {
    const variant = GRADE_VARIANT[data.gradeCode] ?? 'default'
    const sections = [
        { label: '구조안정성', score: data.structScore, weight: 40 },
        { label: '하중외력',   score: data.loadScore,   weight: 30 },
        { label: '환경부식',   score: data.envScore,    weight: 20 },
        { label: '운영이력',      score: data.opScore,     weight: 10 },
    ]
    return (
        <div className={styles.scoreCard}>
            <div className={styles.scoreMain}>
                <div className={styles.scoreValue}>{data.totalScore?.toFixed(2)}</div>
                <div className={styles.scoreLabel}>종합 SCC 점수</div>
            </div>
            <div className={styles.scoreDivider} />
            <div className={styles.scoreBadge}>
                <BasicLabel text={`${data.gradeCode} 등급`} variant={variant} />
                <div className={styles.gradeDesc}>{data.gradeDesc}</div>
            </div>
            <div className={styles.scoreDivider} />
            <div className={styles.scoreSections}>
                {sections.map(item => (
                    <div key={item.label} className={styles.scoreItem}>
                        <div className={styles.scoreItemLabel}>{item.label}</div>
                        <div className={styles.scoreItemValue}>{item.score?.toFixed(2)}</div>
                        <div className={styles.scoreItemWeight}>가중치 {item.weight}%</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── 전주 기본 정보 ─────────────────────────────────────────────────────────────
function PoleInfoTable({ data }) {
    const rows = [
        [['설비 GID',      data.gid],         ['전산화번호',   data.calcNo]],
        [['전주종류',      data.poleTypeName], ['전주형태',     data.poleShape]],
        [['전주규격(m)',   data.poleSize],     ['설계하중(N)',  data.designLoad]],
        [['지역구분',      data.regionType],   ['지선주각도(°)',  data.stayAngle]],
    ]
    return (
        <table className={styles.infoTable}>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.map(([label, value], j) => (
                            <React.Fragment key={j}>
                                <td className={styles.infoTdLabel}>{label}</td>
                                <td className={styles.infoTdValue}>{value ?? '-'}</td>
                            </React.Fragment>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

// ── 채점 항목 테이블 ──────────────────────────────────────────────────────────
function ScoringSection({ title, detail }) {
    if (!detail) return null
    const { weight, appliedScore, totalItemsScore, items = [] } = detail
    return (
        <Section title={title} meta={`가중치 ${weight}% · 기여점수 ${appliedScore?.toFixed(2)}`}>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th} style={{ width: '40%' }}>항목명</th>
                            <th className={styles.th}>가중치(%)</th>
                            <th className={styles.th}>원점수</th>
                            <th className={styles.th}>기여점수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i}>
                                <td className={styles.td}>{item.name}</td>
                                <td className={styles.tdNum}>{item.pct}</td>
                                <td className={styles.tdNum}>{item.total?.toFixed(1)}</td>
                                <td className={styles.tdNum}>{item.applied?.toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td className={styles.tdBold}>합계</td>
                            <td className={styles.tdBold}>100</td>
                            <td className={styles.tdBold}>-</td>
                            <td className={styles.tdBold}>{totalItemsScore?.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td className={styles.tdBold} colSpan={3}>가중 적용 (×{weight}%)</td>
                            <td className={styles.tdBold}>{appliedScore?.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Section>
    )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function SccResDtlFeature({ data }) {
    if (!data) return (
        <div className={styles.empty}>
            데이터를 불러오는 중...
        </div>
    )

    return (
        <div className={styles.wrap}>

            {/* 페이지 헤더 */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>전주 SCC 평가 결과</div>
                <BasicButton label="엑셀" icon={FileDown} variant="excel" size="sm" onClick={() => {}} />
            </div>

            {/* 종합 점수 카드 */}
            <ScoreCard data={data} />

            {/* 전주 기본 정보 */}
            <Section title="전주 기본 정보">
                <PoleInfoTable data={data} />
            </Section>

            {/* 4개 채점 섹션 */}
            <ScoringSection title="구조안전성" detail={data.structDetail} />
            <ScoringSection title="하중외력"   detail={data.loadDetail}   />
            <ScoringSection title="환경부식"   detail={data.envDetail}    />
            <ScoringSection title="운영이력"       detail={data.opDetail}     />

        </div>
    )
}
