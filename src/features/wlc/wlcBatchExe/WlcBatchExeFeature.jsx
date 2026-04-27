import React, { useState, useCallback } from 'react'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import SelectInput      from '@/components/input/SelectInput.jsx'
import DateInput        from '@/components/input/DateInput.jsx'
import ConfirmModal     from '@/components/modal/ConfirmModal.jsx'
import { useAppStore }  from '@/store/useAppStore.js'
import {
    Play, RotateCcw, History,
    Info, Lightbulb,
    UtilityPole, Cable, Cpu, Radio,
    ArrowDown,
} from 'lucide-react'
import { toast }  from 'sonner'
import styles     from './WlcBatchExeFeature.module.css'
import {openDockPanel} from "@/store/dockviewStore.js";

// ── 목업 데이터 ────────────────────────────────────────────────────────────────
const BONBU_OPTIONS = [
    { label: '서울본부',         value: 'SEOUL'   },
    { label: '인천본부',         value: 'INCHEON' },
    { label: '경기북부본부',     value: 'GGB'     },
    { label: '경기남부본부',     value: 'GGS'     },
    { label: '강원본부',         value: 'GW'      },
    { label: '충북본부',         value: 'CB'      },
    { label: '대전세종충남본부', value: 'DSCN'    },
    { label: '전북본부',         value: 'JB'      },
    { label: '광주전남본부',     value: 'GJN'     },
    { label: '대구경북본부',     value: 'DGB'     },
    { label: '부산본부',         value: 'BUSAN'   },
    { label: '경남본부',         value: 'GN'      },
    { label: '울산본부',         value: 'ULSAN'   },
    { label: '제주본부',         value: 'JEJU'    },
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

const INIT_FORM = { bonbu: '', sabupso: '', startYm: '' }

const MONTH_OPTIONS = {
    plugins: [monthSelectPlugin({ shorthand: false, dateFormat: 'Ym', altFormat: 'Y년 m월' })],
    dateFormat: 'Ym',
}

// ── 구성 요소별 계산 로직 정의 ──────────────────────────────────────────────────
const CALC_LOGIC = [
    {
        key:    'pole',
        icon:   UtilityPole,
        label:  '전주',
        color:  'blue',
        items:  [
            '전주 말구경 / 지표구경',
            '전주 지표상 높이 / 근입',
            '지름증가율 (K)',
            '풍압하중 / 설계하중',
            '전주 종류 계수 · 고도계수',
        ],
        result: '굽힘모멘트 (N·m)',
    },
    {
        key:    'wire',
        icon:   Cable,
        label:  '전선',
        color:  'teal',
        items:  [
            '전선 종류 / 조수',
            '전선 직경 / 환산직경',
            '경간 / 수풍길이',
            '상정최대장력',
            '가섭선계수 · 고도계수',
        ],
        result: '굽힘모멘트 (N·m)',
    },
    {
        key:    'equip',
        icon:   Cpu,
        label:  '가공설비',
        color:  'indigo',
        items:  [
            '설비 종류 (변압기 / 개폐기)',
            '설비 직경 / 용량',
            '최고높이 / 최저높이 / 봇싱높이',
            '인하장치 이격거리',
            '풍압계수 · 고도계수',
        ],
        result: '기기 굽힘모멘트 (N·m)',
    },
    {
        key:    'comm',
        icon:   Radio,
        label:  '통신기기',
        color:  'orange',
        items:  [
            '설비 종류명',
            '기기 직경 / 기기 높이',
            '최저 설치 높이',
            '풍압 (N/m²) · 풍압계수 · 고도계수',
        ],
        result: '굽힘모멘트 (N·m)',
    },
]

/**
 * 풍하중 평가 배치 실행 화면.
 * 지역본부/사업소 선택, 시작년월 입력 후 배치를 수동으로 요청한다.
 *
 * @author JDJ
 * @since 2026-04-20
 * @param {Object}   props
 * @param {function} props.onExecute  배치 실행 핸들러 (Panel에서 주입)
 * @param {boolean}  props.isRunning  실행 중 여부
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-20 | JDJ    | 최초 작성 |
 * | 2026-04-25 | JDJ    | UI 디자인 개선 — 구성 요소별 계산 로직 섹션 추가 |
 */
export default function WlcBatchExeFeature({ onExecute, isRunning }) {
    const { user } = useAppStore()
    const [form,        setForm]        = useState(INIT_FORM)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const sabupsoOptions = SABUPSO_MAP[form.bonbu] ?? []

    const goToExeLog = useCallback(() => {
        openDockPanel({ id:'wlcExecuteLogPanel' })
    }, [])

    const handleBonbuChange = useCallback((e) => {
        setForm(f => ({ ...f, bonbu: e.target.value, sabupso: '' }))
    }, [])

    const handleExecuteClick = useCallback(() => {
        if (!form.bonbu)   { toast.warning('지역본부를 선택하세요.');  return }
        if (!form.sabupso) { toast.warning('사업소명을 선택하세요.');  return }
        if (!form.startYm) { toast.warning('시작년월을 선택하세요.'); return }
        setConfirmOpen(true)
    }, [form])

    const handleConfirm = useCallback(async () => {
        setConfirmOpen(false)
        await onExecute?.({ ...form, executorId: user?.id })
    }, [form, user, onExecute])

    const handleReset = useCallback(() => setForm(INIT_FORM), [])

    const bonbuLabel   = BONBU_OPTIONS.find(o => o.value === form.bonbu)?.label ?? ''
    const sabupsoLabel = sabupsoOptions.find(o => o.value === form.sabupso)?.label ?? ''
    const confirmMsg   = `대상: ${bonbuLabel} ${sabupsoLabel}\n시작년월: ${form.startYm}\n\n풍하중 평가 배치를 실행하시겠습니까?`

    return (
        <div className={styles.pageWrap}>

            {/* ── 페이지 헤더 ── */}
            <div className={styles.pageHeader}>
                <div className={styles.pageHeaderLeft}>
                    <span className={styles.pageTitle}>풍하중 배치 실행</span>
                    <span className={styles.pageDesc}>지역본부 및 사업소를 선택하여 풍하중 평가 배치를 수동으로 실행합니다.</span>
                </div>
                <button className={styles.historyBtn} onClick={goToExeLog} type="button">
                    <History size={14} />
                    풍하중 실행로그
                </button>
            </div>

            {/* ── 실행 조건 ── */}
            <div className={styles.section}>
                <div className={styles.sectionLabel}>
                    <span className={styles.sectionLabelText}>실행 조건</span>
                </div>
                <div className={styles.sectionBody}>
                    <div className={styles.conditionGrid}>
                        <SelectInput
                            label="지역본부"
                            value={form.bonbu}
                            onChange={handleBonbuChange}
                            options={BONBU_OPTIONS}
                            placeholder="지역본부 선택"
                            isNotNull
                        />
                        <SelectInput
                            label="사업소명"
                            value={form.sabupso}
                            onChange={e => setForm(f => ({ ...f, sabupso: e.target.value }))}
                            options={sabupsoOptions}
                            placeholder="사업소명 선택"
                            disabled={!form.bonbu}
                            isNotNull
                        />
                        <DateInput
                            label="시작년월"
                            placeholder="년월 선택"
                            value={form.startYm}
                            onChange={(dateStr) => setForm(f => ({ ...f, startYm: dateStr }))}
                            options={MONTH_OPTIONS}
                            isNotNull
                        />
                    </div>
                    <div className={styles.conditionBottom}>
                        <div className={styles.infoBox}>
                            <Info size={14} className={styles.infoIcon} />
                            <span>선택한 사업소의 해당 년월 이후 데이터에 대해 풍하중 평가가 일괄 수행됩니다. 기존 평가 결과는 덮어씌워집니다.</span>
                        </div>
                        <div className={styles.actionButtons}>
                            <button
                                type="button"
                                className={`${styles.execBtn} ${styles.execBtnSecondary}`}
                                onClick={handleReset}
                                disabled={isRunning}
                            >
                                <RotateCcw size={15} />
                                초기화
                            </button>
                            <button
                                type="button"
                                className={`${styles.execBtn} ${styles.execBtnPrimary}`}
                                onClick={handleExecuteClick}
                                disabled={isRunning}
                            >
                                <Play size={16} />
                                {isRunning ? '실행 중...' : '배치 실행'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 구성 요소별 계산 로직 ── */}
            <div className={styles.section}>
                <div className={styles.sectionLabel}>
                    <span className={styles.sectionLabelText}>구성 요소별 계산 로직</span>
                </div>
                <div className={styles.sectionBody}>
                    <p className={styles.sectionDesc}>전주 풍하중 강도 계산을 위한 저항 모멘트 산출 로직을 안내합니다.</p>
                    <div className={styles.calcGrid}>
                        {CALC_LOGIC.map(({ key, icon: Icon, label, color, items, result }) => (
                            <div key={key} className={`${styles.calcCard} ${styles[`calcCard_${color}`]}`}>
                                {/* 카드 헤더 */}
                                <div className={styles.calcCardHeader}>
                                    <span className={`${styles.calcIconWrap} ${styles[`calcIconWrap_${color}`]}`}>
                                        <Icon size={18} />
                                    </span>
                                    <span className={`${styles.calcCardTitle} ${styles[`calcCardTitle_${color}`]}`}>{label}</span>
                                </div>

                                {/* 계산 항목 */}
                                <div className={`${styles.calcSection} ${styles.calcSectionItems}`}>
                                    <span className={styles.calcSectionLabel}>계산 항목</span>
                                    <ul className={styles.calcList}>
                                        {items.map((item, i) => (
                                            <li key={i} className={styles.calcListItem}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 화살표 */}
                                <div className={styles.calcArrow}>
                                    <ArrowDown size={14} />
                                </div>

                                {/* 산출 결과 */}
                                <div className={styles.calcSection}>
                                    <span className={styles.calcSectionLabel}>산출 결과</span>
                                    <span className={`${styles.calcResult} ${styles[`calcResult_${color}`]}`}>{result}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── TIP ── */}
            <div className={styles.tipBox}>
                <Lightbulb size={14} className={styles.tipIcon} />
                <span><strong>TIP</strong> &nbsp;배치 실행은 데이터 양에 따라 <strong>몇 시간 이상</strong> 소요될 수 있습니다. 실행 중 화면을 닫아도 배치는 계속 진행되며, 완료 후 <em>풍하중 실행로그</em>에서 결과를 확인하세요.</span>
            </div>

            <ConfirmModal
                open={confirmOpen}
                variant="warning"
                title="배치 실행 확인"
                message={confirmMsg}
                confirmText="실행"
                cancelText="취소"
                onConfirm={handleConfirm}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    )
}
