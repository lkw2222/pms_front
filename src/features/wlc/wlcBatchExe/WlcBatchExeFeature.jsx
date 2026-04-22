import React, { useState, useCallback } from 'react'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import 'flatpickr/dist/plugins/monthSelect/style.css'
import SelectInput      from '@/components/input/SelectInput.jsx'
import DateInput        from '@/components/input/DateInput.jsx'
import BasicButton      from '@/components/button/BasicButton.jsx'
import ConfirmModal     from '@/components/modal/ConfirmModal.jsx'
import { useAppStore }  from '@/store/useAppStore.js'
import { Play, RotateCcw } from 'lucide-react'
import { toast }        from 'sonner'
import styles           from './WlcBatchExeFeature.module.css'

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
 */
export default function WlcBatchExeFeature({ onExecute, isRunning }) {
    const { user } = useAppStore()
    const [form,        setForm]        = useState(INIT_FORM)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const sabupsoOptions = SABUPSO_MAP[form.bonbu] ?? []

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
        <div className="panel-container">
            <div className="panel-toolbar panel-toolbar-col">

                {/* ── 조건 입력 박스 ── */}
                <div className="panel-search-value">
                    <div className={styles.conditionWrap}>

                        <div className={styles.conditionGroup}>
                            <div className={styles.dropdownRow}>
                                <SelectInput
                                    label="지역본부"
                                    value={form.bonbu}
                                    onChange={handleBonbuChange}
                                    options={BONBU_OPTIONS}
                                    placeholder="지역본부"
                                    isNotNull
                                />
                                <SelectInput
                                    label="사업소명"
                                    value={form.sabupso}
                                    onChange={e => setForm(f => ({ ...f, sabupso: e.target.value }))}
                                    options={sabupsoOptions}
                                    placeholder="사업소명"
                                    disabled={!form.bonbu}
                                    isNotNull
                                />
                            </div>
                        </div>

                        <div className={styles.conditionGroup}>
                            <DateInput
                                label="시작년월"
                                placeholder="년월 선택"
                                value={form.startYm}
                                onChange={(dateStr) => setForm(f => ({ ...f, startYm: dateStr }))}
                                options={MONTH_OPTIONS}
                                isNotNull
                            />
                        </div>

                    </div>
                </div>

                {/* ── 버튼 영역 ── */}
                <div className="panel-search-function">
                    <div />
                    <div style={{ display: 'flex', gap: 8 }}>
                        <BasicButton
                            label={isRunning ? '실행 중...' : '배치 실행'}
                            icon={Play}
                            variant="primary"
                            onClick={handleExecuteClick}
                            disabled={isRunning}
                        />
                        <BasicButton
                            label="초기화"
                            icon={RotateCcw}
                            variant="secondary"
                            onClick={handleReset}
                            disabled={isRunning}
                        />
                    </div>
                    <div />
                </div>

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
