import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery }          from '@tanstack/react-query'
import { useAppStore }       from '@/store/useAppStore.js'
import BasicGrid             from '@/components/grid/BasicGrid.jsx'
import GridDetailDrawer      from '@/components/grid/GridDetailDrawer.jsx'
import GridDetailModal       from '@/components/grid/GridDetailModal.jsx'
import GridActionButtons     from '@/components/grid/GridActionButtons.jsx'
import SccResDrwFeature from './SccResDrwFeature.jsx'
import SelectInput           from '@/components/input/SelectInput.jsx'
import SearchInput           from '@/components/input/SearchInput.jsx'
import BasicButton           from '@/components/button/BasicButton.jsx'
import BasicLabel            from '@/components/label/BasicLabel.jsx'
import SccResDtlFeature from './SccResDtlFeature.jsx'
import { MOCK_DETAIL, MOCK_DETAIL_2 } from '../../../../public/data/sccResDtlMock.js'
import { MOCK_DATA } from '../../../../public/data/sccResMock.js'
import { Search, RotateCcw, Loader2, Download } from 'lucide-react'
import styles                from './SccResFeature.module.css'
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index.js";
import DateInput from "@/components/input/DateInput.jsx";
import { GRADE_VARIANT } from '@/constants/gradeConst.js'
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
const GRADE_OPTIONS = [
    { label: 'S (즉시위험)', value: 'S' },
    { label: 'A (고위험)',   value: 'A' },
    { label: 'B (중위험)',   value: 'B' },
    { label: 'C (저위험)',   value: 'C' },
    { label: 'D (정기진단)', value: 'D' },
]
const POLE_TYPE_OPTIONS  = [
    { label:'CP300kgf', value:'CP300kgf' }, { label:'CP500kgf', value:'CP500kgf' },
    { label:'CP700kgf', value:'CP700kgf' }, { label:'CP1000kgf', value:'CP1000kgf' },
    { label:'ST300kgf', value:'ST300kgf' }, { label:'ST500kgf', value:'ST500kgf' },
]
const POLE_SHAPE_OPTIONS = [
    { label:'단주', value:'단주' }, { label:'A형주', value:'A형주' },
    { label:'B형주', value:'B형주' }, { label:'문형주', value:'문형주' },
]
const POLE_SIZE_OPTIONS  = [{ label:'8M', value:'8M' }, { label:'10M', value:'10M' }, { label:'12M', value:'12M' }, { label:'14M', value:'14M' }, { label:'16M', value:'16M' }, { label:'18M', value:'18M' }]

// ── HI 점수 구간 ──────────────────────────────────────────────────────────────
const HI_SCORE_OPTIONS = [
    { label:'0 ~ 100점',   value:'0-100'   },
    { label:'100 ~ 200점', value:'100-200' },
    { label:'200 ~ 300점', value:'200-300' },
    { label:'300 ~ 400점', value:'300-400' },
    { label:'400 ~ 500점', value:'400-500' },
    { label:'500점 이상',  value:'500+'    },
]

// ── 기울기 구간 ───────────────────────────────────────────────────────────────
const TILT_OPTIONS = [
    { label:'0 ~ 1도',  value:'0-1'  },
    { label:'1 ~ 2도',  value:'1-2'  },
    { label:'2 ~ 3도',  value:'2-3'  },
    { label:'3 ~ 4도',  value:'3-4'  },
    { label:'4 ~ 5도',  value:'4-5'  },
    { label:'5도 이상', value:'5+'   },
]

// ── 평가년월 flatpickr 옵션 (월 선택 전용) ───────────────────────────────────
const MONTH_PICKER_OPTIONS = {
    plugins:    [monthSelectPlugin({ shorthand: false, dateFormat: 'Y-m', altFormat: 'Y년 m월' })],
    dateFormat: 'Y-m',
}

const SEARCH_TYPE_OPT = [
    { label:'설비 GID',       value:'gid'    },
    { label:'전산화번호',     value:'calcNo' },
    { label:'SCC 산출 ID', value:'calcId' },
]

const INIT_SEARCH = {
    bonbu: '', sabupso: '', poleType: '', poleShape: '', poleSize: '',
    gradeCode: '',
    hiScore: '',   // HI 점수 구간
    tilt:    '',   // 기울기 구간
    evalYm:  '',   // 평가년월 (YYYY-MM)
    searchType: 'gid', searchValue: '',
}


// ── 그룹 왼쪽 수평 레이블 ────────────────────────────────────────────────────
function GroupLabel({ children }) {
    return <div className={styles.groupLabel}>{children}</div>
}

// ── 그룹 사이 세로 구분선 ─────────────────────────────────────────────────────
function VDivider() {
    return <div className={styles.vDivider} />
}

/**
 * SCC 평가 결과 조회 화면.
 *
 * @author JDJ
 * @since 2026-04-20
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-20 | JDJ    | 최초 작성 |
 */
export default function SccResFeature() {
    const [search,    setSearch]    = useState(INIT_SEARCH)
    const [applied,   setApplied]   = useState(INIT_SEARCH)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalRow,  setModalRow]  = useState(null)

    const { sccResultFilter, clearSccResultFilter } = useAppStore()

    // 실행로그에서 넘어온 필터 감지 → 검색 조건 세팅 후 자동 조회
    useEffect(() => {
        if (!sccResultFilter) return
        const { calcId, bonbu, sabupso } = sccResultFilter
        const next = { ...INIT_SEARCH, searchType:'calcId', searchValue: calcId ?? '', bonbu: bonbu ?? '', sabupso: sabupso ?? '' }
        setSearch(next)
        setApplied(next)
        clearSccResultFilter()
    }, [sccResultFilter, clearSccResultFilter])

    const sabupsoOptions = SABUPSO_MAP[search.bonbu] ?? []

    const { data, isLoading } = useQuery({
        queryKey: ['scc', 'result', 'list', applied],
        queryFn: async () => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────
            // import { sccResultApi } from '@/services/scc/sccResult/sccResService.js'
            // return sccResultApi.getList(applied)
            // ─────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 200))
            const list = MOCK_DATA.filter(row => {
                if (applied.bonbu       && row.bonbu       !== applied.bonbu)       return false
                if (applied.sabupso     && row.sabupso     !== applied.sabupso)     return false
                if (applied.poleType    && row.poleType    !== applied.poleType)    return false
                if (applied.poleShape   && row.poleShape   !== applied.poleShape)   return false
                if (applied.poleSize    && row.poleSize    !== applied.poleSize)    return false
                if (applied.gradeCode   && row.gradeCode   !== applied.gradeCode)   return false
                // HI 점수 구간 필터 (API 연동 시 서버에서 처리)
                if (applied.hiScore && row.hiScore != null) {
                    const [min, max] = applied.hiScore === '500+'
                        ? [500, Infinity]
                        : applied.hiScore.split('-').map(Number)
                    if (row.hiScore < min || row.hiScore >= max) return false
                }
                // 기울기 구간 필터
                if (applied.tilt && row.tilt != null) {
                    const [min, max] = applied.tilt === '5+'
                        ? [5, Infinity]
                        : applied.tilt.split('-').map(Number)
                    if (row.tilt < min || row.tilt >= max) return false
                }
                // 평가년월 필터 (row.evalYm: 'YYYY-MM' 형식 기준)
                if (applied.evalYm && row.evalYm && row.evalYm !== applied.evalYm) return false
                if (applied.searchValue) {
                    const v = applied.searchValue.toLowerCase()
                    if (applied.searchType === 'gid'    && !row.gid.toLowerCase().includes(v))    return false
                    if (applied.searchType === 'calcNo' && !row.calcNo.toLowerCase().includes(v)) return false
                    if (applied.searchType === 'calcId' && !row.calcId.toLowerCase().includes(v)) return false
                }
                return true
            })
            return { list, totalCount: list.length }
        },
        staleTime: 0,
    })

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerRow,  setDrawerRow]  = useState(null)

    // 쿼리 데이터가 갱신되면 열린 드로어의 row 도 최신 데이터로 동기화
    useEffect(() => {
        if (!drawerRow || !data?.list) return
        const updated = data.list.find(r => r.gid === drawerRow.gid)
        if (updated) setDrawerRow(updated)
    }, [data?.list])

    const openDrawer = useCallback((row) => {
        if (drawerRow?.gid === row.gid) { setDrawerOpen(o => !o) }
        else { setDrawerRow(row); setDrawerOpen(true) }
    }, [drawerRow])
    const closeDrawer = useCallback(() => setDrawerOpen(false), [])

    const openModal  = useCallback((row) => { setModalRow(row); setModalOpen(true) }, [])
    const closeModal = useCallback(() => setModalOpen(false), [])
    const onSearch   = () => { setApplied({ ...search }); setDrawerOpen(false) }
    const onReset    = () => { setSearch(INIT_SEARCH); setApplied(INIT_SEARCH); setDrawerOpen(false) }

    const colDefs = useMemo(() => [
        { field:'seq',     headerName:'순번',         flex:1, minWidth:60,  type:'numericColumn' },
        { field:'calcId',  headerName:'SCC 산출ID', flex:2, minWidth:80 },
        { field:'bonbu',   headerName:'지역본부',   flex:2, minWidth:120, valueFormatter: ({ value }) => BONBU_OPTIONS.find(o => o.value === value)?.label ?? value },
        { field:'sabupso', headerName:'사업소',     flex:2, minWidth:80,  valueFormatter: ({ value }) => Object.values(SABUPSO_MAP).flat().find(o => o.value === value)?.label ?? value },
        { field:'gid',     headerName:'설비GID',    flex:1, minWidth:110  },
        { field:'calcNo',  headerName:'전산화번호', flex:1, minWidth:110  },
        { field:'poleType',  headerName:'전주종류', flex:1, minWidth:110  },
        { field:'poleShape', headerName:'형태',     flex:1, minWidth:100  },
        { field:'poleSize',  headerName:'규격',     flex:1, minWidth:100  },
        {
            headerName: '안전율', marryChildren: true,
            children: [
                { field:'windSafetyFactor',      headerName:'풍하중', flex:1, minWidth:100, type:'numericColumn', valueFormatter: ({ value }) => value != null ? value.toFixed(2) : '-' },
                { field:'combinedSafetyFactor',  headerName:'복합하중', flex:1, minWidth:100, type:'numericColumn', valueFormatter: ({ value }) => value != null ? value.toFixed(2) : '-' },
                { field:'compositeSafetyFactor', headerName:'합성하중', flex:1, minWidth:100, type:'numericColumn', valueFormatter: ({ value }) => value != null ? value.toFixed(2) : '-' },
            ],
        },
        {
            headerName: '판정등급', marryChildren: true,
            children: [
                { field:'gradeCode', headerName:'등급',    flex:1, minWidth:80,
                  cellRenderer: ({ value }) => value
                    ? <BasicLabel text={`${value} 등급`} variant={GRADE_VARIANT[value] ?? 'default'} />
                    : null,
                  cellStyle: { display:'flex', alignItems:'center', justifyContent:'center' },
                },
                { field:'gradeDesc', headerName:'진단결과', flex:1, minWidth:90 },
            ],
        },
        { headerName:'상세보기', flex:1, minWidth:90, sortable:false, filter:false,
          cellRenderer: ({ data }) => data
            ? <GridActionButtons data={data} buttons={[{ type:'detail', onClick: openModal }]} />
            : null,
        },
    ], [openModal])

    return (
        <div className="grid-wrap">
            {/* ── 검색 조건 ── */}
            <div className="panel-toolbar panel-toolbar-col">
                {/*
                 * 2행 × 좌우 그룹 레이아웃 (6:4 비율)
                 * 그룹 레이블은 필드 왼쪽에 수평 텍스트로 배치 — 수직 공간 절약
                 *
                 * 행1: [지역/사업소  지역본부 │ 사업소명] ┃ [평가기준  평가년월 │ HI │ 기울기 │ 판정]
                 * 행2: [전주제원  종류 │ 형태 │ 규격 │ 지지대] ┃ [검색  검색타입 + 검색어]
                 */}
                <div className={`panel-search-value ${styles.searchArea}`}>

                    {/* ── 행1: 지역/사업소 + 평가기준 ── */}
                    <div className={styles.searchRow}>

                        <div className={styles.groupSm}>
                            <GroupLabel>{'지역 /\n사업소'}</GroupLabel>
                            <div className={`${styles.fieldGrid} ${styles.col2}`}>
                                <SelectInput label="지역본부" value={search.bonbu}   onChange={e => setSearch(s => ({ ...s, bonbu: e.target.value, sabupso: '' }))} options={BONBU_OPTIONS}  placeholder="전체" />
                                <SelectInput label="사업소명" value={search.sabupso} onChange={e => setSearch(s => ({ ...s, sabupso: e.target.value }))}            options={sabupsoOptions} placeholder="전체" disabled={!search.bonbu} />
                            </div>
                        </div>

                        <VDivider />

                        <div className={styles.groupLg}>
                            <GroupLabel>{'평가\n기준'}</GroupLabel>
                            <div className={`${styles.fieldGrid} ${styles.col4}`}>
                                <DateInput   label="평가년월" value={search.evalYm}  onChange={dateStr => setSearch(s => ({ ...s, evalYm: dateStr }))} placeholder="년월 선택" options={MONTH_PICKER_OPTIONS} />
                                <SelectInput label="HI 점수"  value={search.hiScore} onChange={e => setSearch(s => ({ ...s, hiScore: e.target.value }))} options={HI_SCORE_OPTIONS} placeholder="전체" />
                                <SelectInput label="기울기"   value={search.tilt}    onChange={e => setSearch(s => ({ ...s, tilt:    e.target.value }))} options={TILT_OPTIONS}     placeholder="전체" />
                                <SelectInput label="판정등급" value={search.gradeCode} onChange={e => setSearch(s => ({ ...s, gradeCode: e.target.value }))} options={GRADE_OPTIONS} placeholder="전체" />
                            </div>
                        </div>
                    </div>

                    {/* ── 행2: 전주제원 + 검색 ── */}
                    <div className={styles.searchRow}>

                        <div className={styles.groupSm}>
                            <GroupLabel>{'전주\n제원'}</GroupLabel>
                            <div className={`${styles.fieldGrid} ${styles.col3}`}>
                                <SelectInput label="전주종류" value={search.poleType}  onChange={e => setSearch(s => ({ ...s, poleType:  e.target.value }))} options={POLE_TYPE_OPTIONS}  placeholder="전체" />
                                <SelectInput label="전주형태" value={search.poleShape} onChange={e => setSearch(s => ({ ...s, poleShape: e.target.value }))} options={POLE_SHAPE_OPTIONS} placeholder="전체" />
                                <SelectInput label="전주규격" value={search.poleSize}  onChange={e => setSearch(s => ({ ...s, poleSize:  e.target.value }))} options={POLE_SIZE_OPTIONS}  placeholder="전체" />
                            </div>
                        </div>

                        <VDivider />

                        <div className={styles.groupLg}>
                            <GroupLabel>{'검색'}</GroupLabel>
                            <div className={styles.fieldFull}>
                                <SearchInput
                                    options={SEARCH_TYPE_OPT}
                                    selectValue={search.searchType}
                                    onSelectChange={e => setSearch(s => ({ ...s, searchType: e.target.value }))}
                                    inputValue={search.searchValue}
                                    onInputChange={e => setSearch(s => ({ ...s, searchValue: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && onSearch()}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="panel-search-function">
                    <div className={styles.totalCount}>
                        {isLoading
                            ? '조회 중...'
                            : <>총 <strong className={styles.totalCountStrong}>{(data?.totalCount ?? 0).toLocaleString()}</strong>건</>
                        }
                    </div>
                    <div className={styles.searchButtons}>
                        <BasicButton label="초기화" icon={RotateCcw}                    variant="secondary" onClick={onReset} />
                        <BasicButton label="조회"   icon={isLoading ? Loader2 : Search} variant="primary"   onClick={onSearch} disabled={isLoading} />
                    </div>
                    <div className={styles.searchButtonsRight}>
                        <BasicButton label="엑셀 다운로드" icon={Download} variant="secondary" size="sm" onClick={() => {}} />
                    </div>
                </div>
            </div>

            {/* ── 그리드 + 드로어 ── */}
            <div className={styles.gridArea}>
                <div className={styles.gridInner}>
                    <BasicGrid
                        mode="paginate"
                        rowData={data?.list ?? []}
                        colDefs={colDefs}
                        onRowClick={openDrawer}
                        height="100%"
                        pageSize={10}
                        loading={isLoading}
                        defaultColDef={{ sortable:true, resizable:true, filter:false, minWidth:60, flex:1 }}
                    />
                </div>
                <GridDetailDrawer
                    open={drawerOpen}
                    title={drawerRow ? `${drawerRow.calcNo} · ${drawerRow.poleType} ${drawerRow.poleSize}` : '상세 정보'}
                    onClose={closeDrawer}
                    defaultWidth={500}
                >
                    <SccResDrwFeature
                        row={drawerRow}
                        onOpenModal={() => { setModalRow(drawerRow); setModalOpen(true) }}
                    />
                </GridDetailDrawer>
            </div>

            {/* 상세 모달 — API 연동 시 mock 분기를 useQuery 결과로 교체 */}
            <GridDetailModal
                width={'1000px'}
                open={modalOpen}
                title={modalRow ? `${modalRow.calcNo} · ${modalRow.poleType} ${modalRow.poleSize}` : '상세 정보'}
                onClose={closeModal}
            >
                <SccResDtlFeature
                    data={Number(modalRow?.gid) % 2 === 1 ? MOCK_DETAIL_2 : MOCK_DETAIL}
                />
            </GridDetailModal>
        </div>
    )
}
