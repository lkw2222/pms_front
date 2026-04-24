import React, { useState, useEffect } from 'react'
import BasicLabel            from '@/components/label/BasicLabel.jsx'
import BasicButton           from '@/components/button/BasicButton.jsx'
import SccResDtlGisFeature   from './SccResDtlGisFeature.jsx'
import { ExternalLink }      from 'lucide-react'
import styles from './SccResDrwFeature.module.css'

/**
 * SCC 결과 그리드 행 클릭 시 우측에 열리는 드로어 내용.
 * - 요약 정보 탭: 전주 기본 정보 · SCC 평가 결과
 * - 지도 탭:     전주 설치 위치 (OpenLayers VWorld)
 *
 * @param {{ row: object|null, onOpenModal: function }} props
 *
 * @author JDJ
 * @since 2026-04-22
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-22 | JDJ    | 최초 작성 |
 * | 2026-04-24 | JDJ    | SCC 평가 구조로 개편 (안전율·등급 표시) |
 */

// ── 상수 ──────────────────────────────────────────────────────────────────────
const GRADE_VARIANT = { S: 'danger', A: 'warning', B: 'info', C: 'success', D: 'default' }

const BONBU_OPTIONS = [
    { label:'서울본부',         value:'SEOUL'   },
    { label:'인천본부',         value:'INCHEON' },
    { label:'경기북부본부',     value:'GGB'     },
    { label:'경기남부본부',     value:'GGS'     },
    { label:'강원본부',         value:'GW'      },
    { label:'충북본부',         value:'CB'      },
    { label:'대전세종충남본부', value:'DSCN'    },
    { label:'전북본부',         value:'JB'      },
    { label:'광주전남본부',     value:'GJN'     },
    { label:'대구경북본부',     value:'DGB'     },
    { label:'부산본부',         value:'BUSAN'   },
    { label:'경남본부',         value:'GN'      },
    { label:'울산본부',         value:'ULSAN'   },
    { label:'제주본부',         value:'JEJU'    },
]

const SABUPSO_MAP = {
    SEOUL:   [{ label:'강남지사', value:'S01' }, { label:'강동지사', value:'S02' }, { label:'강서지사', value:'S03' }, { label:'강북지사', value:'S04' }, { label:'종로지사', value:'S05' }, { label:'동작지사', value:'S06' }, { label:'서초지사', value:'S07' }],
    INCHEON: [{ label:'인천남부지사', value:'IC01' }, { label:'인천북부지사', value:'IC02' }, { label:'부천지사', value:'IC03' }, { label:'김포지사', value:'IC04' }],
    GGB:     [{ label:'의정부지사', value:'GB01' }, { label:'고양지사', value:'GB02' }, { label:'양주지사', value:'GB03' }, { label:'파주지사', value:'GB04' }],
    GGS:     [{ label:'수원지사', value:'GS01' }, { label:'성남지사', value:'GS02' }, { label:'안양지사', value:'GS03' }, { label:'화성지사', value:'GS04' }],
    GW:      [{ label:'춘천지사', value:'GW01' }, { label:'원주지사', value:'GW02' }, { label:'강릉지사', value:'GW03' }],
    CB:      [{ label:'청주지사', value:'CB01' }, { label:'충주지사', value:'CB02' }, { label:'제천지사', value:'CB03' }],
    DSCN:    [{ label:'대전지사', value:'DJ01' }, { label:'세종지사', value:'DJ02' }, { label:'천안지사', value:'DJ03' }, { label:'아산지사', value:'DJ04' }],
    JB:      [{ label:'전주지사', value:'JB01' }, { label:'군산지사', value:'JB02' }, { label:'익산지사', value:'JB03' }],
    GJN:     [{ label:'광주지사', value:'GJ01' }, { label:'목포지사', value:'GJ02' }, { label:'여수지사', value:'GJ03' }],
    DGB:     [{ label:'대구지사', value:'DG01' }, { label:'경산지사', value:'DG02' }, { label:'구미지사', value:'DG03' }, { label:'포항지사', value:'DG04' }],
    BUSAN:   [{ label:'부산북부지사', value:'BS01' }, { label:'부산남부지사', value:'BS02' }, { label:'해운대지사', value:'BS03' }],
    GN:      [{ label:'창원지사', value:'GN01' }, { label:'진주지사', value:'GN02' }, { label:'통영지사', value:'GN03' }],
    ULSAN:   [{ label:'울산지사', value:'US01' }, { label:'울주지사', value:'US02' }],
    JEJU:    [{ label:'제주지사', value:'JJ01' }, { label:'서귀포지사', value:'JJ02' }],
}

const TABS = [
    { key: 'summary', label: '요약 정보' },
    { key: 'map',     label: '지도'      },
]

// ── 2열 정보 그룹 ─────────────────────────────────────────────────────────────
function InfoGroup({ items }) {
    const groups = []
    let i = 0
    while (i < items.length) {
        if (items[i].full) {
            groups.push([items[i]]); i++
        } else if (i + 1 < items.length && !items[i + 1].full) {
            groups.push([items[i], items[i + 1]]); i += 2
        } else {
            groups.push([items[i]]); i++
        }
    }
    return (
        <>
            {groups.map((group, gi) => (
                <div key={gi} className={styles.group}>
                    {group.map(({ label, value, full }) => (
                        <div key={label} className={`${styles.cell} ${(full || group.length === 1) ? styles.cellFull : ''}`}>
                            <span className={styles.cellLabel}>{label}</span>
                            <span className={styles.cellValue}>{value ?? '-'}</span>
                        </div>
                    ))}
                </div>
            ))}
        </>
    )
}

// ── 드로어 요약 컨텐츠 ────────────────────────────────────────────────────────
function DrawerContent({ row, onOpenModal }) {
    const bonbuLabel   = BONBU_OPTIONS.find(o => o.value === row.bonbu)?.label ?? row.bonbu
    const sabupsoLabel = Object.values(SABUPSO_MAP).flat().find(o => o.value === row.sabupso)?.label ?? row.sabupso
    const variant      = GRADE_VARIANT[row.gradeCode] ?? 'default'

    const fmt = (v) => v != null ? v.toFixed(2) : '-'

    return (
        <>
            <div className={styles.content}>

                {/* ── 전주 기본 정보 ── */}
                <div className={styles.sectionLabel}>
                    <span className={styles.sectionLabelText}>전주 기본 정보</span>
                </div>
                <InfoGroup items={[
                    { label: '지역본부',   value: bonbuLabel },
                    { label: '사업소',     value: sabupsoLabel },
                    { label: '설비 GID',   value: row.gid },
                    { label: '전산화번호', value: row.calcNo },
                    { label: '전주종류',   value: row.poleType },
                    { label: '전주형태',   value: row.poleShape },
                    { label: '전주규격',   value: row.poleSize },
                ]} />

                {/* ── 안전율 ── */}
                <div className={styles.sectionLabel}>
                    <span className={styles.sectionLabelText}>안전율</span>
                </div>
                <InfoGroup items={[
                    { label: '풍하중',   value: fmt(row.windSafetyFactor)      },
                    { label: '복합하중', value: fmt(row.combinedSafetyFactor)  },
                    { label: '합성하중', value: fmt(row.compositeSafetyFactor) },
                ]} />

                {/* ── SCC 평가 결과 ── */}
                <div className={styles.sectionLabel}>
                    <span className={styles.sectionLabelText}>SCC 평가 결과</span>
                </div>
                <InfoGroup items={[
                    { label: '구조안전성', value: fmt(row.structScore) },
                    { label: '하중외력',   value: fmt(row.loadScore)   },
                    { label: '환경부식',   value: fmt(row.envScore)    },
                    { label: '운영이력',   value: fmt(row.opScore)     },
                    { label: '종합점수',   value: fmt(row.totalScore) },
                    { label: '진단결과',   value: row.gradeCode
                        ? <BasicLabel text={`${row.gradeCode} ${row.gradeDesc}`} variant={variant} />
                        : '-'
                    },
                ]} />

            </div>

            {/* 푸터 */}
            <div className={styles.footer}>
                <BasicButton
                    label="전체 상세 보기"
                    icon={ExternalLink}
                    variant="primary"
                    size="sm"
                    onClick={onOpenModal}
                />
            </div>
        </>
    )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function SccResDrwFeature({ row, onOpenModal }) {
    const [tab, setTab] = useState('summary')

    useEffect(() => {
        if (tab === 'map') setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    }, [tab])

    return (
        <div className={styles.wrap}>

            {/* ── 탭 바 ── */}
            <div className={styles.tabBar}>
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── 지도: 항상 마운트 ── */}
            <div className={styles.mapWrap} style={{ display: tab === 'map' ? 'block' : 'none' }}>
                <SccResDtlGisFeature row={row} />
            </div>

            {/* ── 요약 정보 탭 ── */}
            {tab === 'summary' && (
                row
                    ? <DrawerContent row={row} onOpenModal={onOpenModal} />
                    : <div className={styles.empty}>행을 선택하세요</div>
            )}

        </div>
    )
}
