import React, { useState, useMemo, useCallback } from 'react'
import { useQuery }       from '@tanstack/react-query'
import BasicGrid          from '@/components/grid/BasicGrid.jsx'
import GridDetailDrawer   from '@/components/grid/GridDetailDrawer.jsx'
import SelectInput        from '@/components/input/SelectInput.jsx'
import SearchInput        from '@/components/input/SearchInput.jsx'
import DateInput          from '@/components/input/DateInput.jsx'
import BasicButton        from '@/components/button/BasicButton.jsx'
import BasicLabel         from '@/components/label/BasicLabel.jsx'
import { useAppStore }     from '@/store/useAppStore.js'
import { openDockPanel }  from '@/store/dockviewStore.js'
import { Search, RotateCcw, Loader2 } from 'lucide-react'
import styles             from './WlcExecuteLogFeature.module.css'

// ── 목업 데이터 ────────────────────────────────────────────────────────────────
const MOCK_DATA = [
    { id:'WLC20260418001', bonbu:'DSCN',  sabupso:'DJ01', executor:'김용성', status:'계산중', poleCount:10,   message:'',                                              startAt:'2026-04-18 15:00:30', endAt:'' },
    { id:'WLC20260401002', bonbu:'DSCN',  sabupso:'DJ01', executor:'김용성', status:'종료',   poleCount:30,   message:'',                                              startAt:'2026-04-01 15:00:30', endAt:'2026-04-01 16:00:30' },
    { id:'WLC20260401003', bonbu:'DSCN',  sabupso:'DJ01', executor:'김용성', status:'에러',   poleCount:1200, message:'Could Not Open JDBC Connection. Connection refused: connect', startAt:'2026-04-01 15:00:30', endAt:'2026-04-01 16:00:30' },
    { id:'WLC20260320001', bonbu:'SEOUL', sabupso:'S01',  executor:'이서연', status:'종료',   poleCount:540,  message:'',                                              startAt:'2026-03-20 09:10:00', endAt:'2026-03-20 09:45:22' },
    { id:'WLC20260319002', bonbu:'SEOUL', sabupso:'S02',  executor:'이서연', status:'종료',   poleCount:320,  message:'',                                              startAt:'2026-03-19 14:00:00', endAt:'2026-03-19 14:28:10' },
    { id:'WLC20260315001', bonbu:'GGS',   sabupso:'GS01', executor:'박지호', status:'에러',   poleCount:880,  message:'OutOfMemoryError: Java heap space',             startAt:'2026-03-15 10:30:00', endAt:'2026-03-15 10:31:05' },
    { id:'WLC20260310001', bonbu:'GGS',   sabupso:'GS02', executor:'박지호', status:'종료',   poleCount:670,  message:'',                                              startAt:'2026-03-10 13:00:00', endAt:'2026-03-10 13:52:40' },
    { id:'WLC20260305001', bonbu:'BUSAN', sabupso:'BS02', executor:'최수아', status:'종료',   poleCount:410,  message:'',                                              startAt:'2026-03-05 11:00:00', endAt:'2026-03-05 11:34:18' },
    { id:'WLC20260228001', bonbu:'DGB',   sabupso:'DG01', executor:'정도윤', status:'종료',   poleCount:730,  message:'',                                              startAt:'2026-02-28 09:00:00', endAt:'2026-02-28 10:01:55' },
    { id:'WLC20260220001', bonbu:'GJN',   sabupso:'GJ01', executor:'한지민', status:'계산중', poleCount:290,  message:'',                                              startAt:'2026-02-20 16:00:00', endAt:'' },
]

const STATUS_VARIANT  = { 계산중:'warning', 종료:'success', 에러:'danger' }
const SEARCH_TYPE_OPT = [
    { label:'풍하중 산출 ID', value:'id'       },
    { label:'실행자명',       value:'executor' },
]
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

const INIT_SEARCH = { bonbu:'', sabupso:'', dateFrom:'', dateTo:'', searchType:'id', searchValue:'' }

// ── 상세 보기 ─────────────────────────────────────────────────────────────────
function DetailPane({ data }) {
    if (!data) return null
    const bonbuLabel   = BONBU_OPTIONS.find(o => o.value === data.bonbu)?.label ?? data.bonbu
    const sabupsoLabel = Object.values(SABUPSO_MAP).flat().find(o => o.value === data.sabupso)?.label ?? data.sabupso
    const rows = [
        ['풍하중 산출 ID', data.id],
        ['지역본부',       bonbuLabel],
        ['사업소명',       sabupsoLabel],
        ['실행자',         data.executor],
        ['상태',           data.status],
        ['전주개수',       data.poleCount?.toLocaleString() + ' 건'],
        ['시작일시',       data.startAt || '—'],
        ['종료일시',       data.endAt   || '—'],
    ]
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {rows.map(([label, value]) => (
                <div key={label} className="detail-row">
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">
                        {label === '상태'
                            ? <BasicLabel text={value} variant={STATUS_VARIANT[value] ?? 'default'} />
                            : value
                        }
                    </span>
                </div>
            ))}
            {data.message && (
                <div className="detail-section-last">
                    <div className="detail-section-label">오류 메시지</div>
                    <div className="detail-content" style={{ color:'var(--color-danger)' }}>{data.message}</div>
                </div>
            )}
        </div>
    )
}

/**
 * 풍하중 실행로그 조회 화면.
 * 지역본부/사업소/기간/검색어로 배치 실행 이력을 조회한다.
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
export default function WlcExecuteLogFeature() {
    const [search,  setSearch]  = useState(INIT_SEARCH)
    const [applied, setApplied] = useState(INIT_SEARCH)
    const [detailOpen, setDetailOpen] = useState(false)
    const [detailData, setDetailData] = useState(null)

    const { setWlcResultFilter } = useAppStore()

    // 산출 ID 클릭 → 풍하중 결과 패널 오픈 + 필터 전달
    // setOpenPanels 는 ContentArea onDidAddPanel 에서 자동 처리됨
    const goToResult = useCallback((row) => {
        setWlcResultFilter({ calcId: row.id, bonbu: row.bonbu, sabupso: row.sabupso })
        openDockPanel({ id:'wlc_3' })
    }, [setWlcResultFilter])

    const sabupsoOptions = SABUPSO_MAP[search.bonbu] ?? []

    const { data, isLoading } = useQuery({
        queryKey: ['wlc', 'execute-log', 'list', applied],
        queryFn: async () => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────
            // import { wlcExecuteLogApi } from '@/services/wlc/wlcExecuteLog/wlcExecuteLogService.js'
            // return wlcExecuteLogApi.getList(applied)
            // ─────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 200))
            const list = MOCK_DATA.filter(row => {
                if (applied.bonbu  && row.bonbu  !== applied.bonbu)  return false
                if (applied.dateFrom && row.startAt < applied.dateFrom) return false
                if (applied.dateTo   && row.startAt > applied.dateTo + ' 23:59:59') return false
                if (applied.searchValue) {
                    const v = applied.searchValue.toLowerCase()
                    if (applied.searchType === 'id'       && !row.id.toLowerCase().includes(v))       return false
                    if (applied.searchType === 'executor' && !row.executor.toLowerCase().includes(v)) return false
                }
                return true
            })
            return { list, totalCount: list.length }
        },
        staleTime: 0,
    })

    const openDetail = useCallback((row) => {
        setDetailData(row)
        setDetailOpen(true)
    }, [])

    const onSearch = () => { setApplied({ ...search }); setDetailOpen(false) }
    const onReset  = () => { setSearch(INIT_SEARCH); setApplied(INIT_SEARCH); setDetailOpen(false) }

    const colDefs = useMemo(() => [
        {
            field:'id', headerName:'풍하중 산출 ID', width:160, flex:0,
            cellRenderer: ({ value, data: row }) => (
                <span className={styles.idLink} onClick={() => goToResult(row)}>{value}</span>
            ),
        },
        { field:'bonbu',   headerName:'지역본부', width:140, flex:0,
          valueFormatter: ({ value }) => BONBU_OPTIONS.find(o => o.value === value)?.label ?? value },
        { field:'sabupso', headerName:'사업소명', width:110, flex:0,
          valueFormatter: ({ value }) => Object.values(SABUPSO_MAP).flat().find(o => o.value === value)?.label ?? value },
        { field:'executor',  headerName:'실행자',   width:80,  flex:0 },
        {
            field:'status', headerName:'상태', width:90, flex:0,
            cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] ?? 'default'} />,
        },
        { field:'poleCount', headerName:'전주개수', width:90, flex:0, type:'numericColumn',
          valueFormatter: ({ value }) => value?.toLocaleString() ?? '' },
        {
            field:'message', headerName:'메시지', flex:1, sortable:false,
            cellRenderer: ({ value }) => value
                ? <span className={styles.msgCell} title={value}>{value}</span>
                : null,
        },
        { field:'startAt', headerName:'시작일시', width:160, flex:0 },
        { field:'endAt',   headerName:'종료일시', width:160, flex:0,
          valueFormatter: ({ value }) => value || '—' },
    ], [openDetail, goToResult])

    return (
        <div className="grid-wrap">
            {/* ── 검색 조건 ── */}
            <div className="panel-toolbar panel-toolbar-col">
                <div className="panel-search-value" style={{ display:'grid', gridTemplateColumns:'150px 150px 160px 160px 1fr', gap:10, alignItems:'end' }}>
                    <SelectInput
                        label="지역본부"
                        value={search.bonbu}
                        onChange={e => setSearch(s => ({ ...s, bonbu: e.target.value, sabupso: '' }))}
                        options={BONBU_OPTIONS}
                        placeholder="지역본부"
                    />
                    <SelectInput
                        label="사업소명"
                        value={search.sabupso}
                        onChange={e => setSearch(s => ({ ...s, sabupso: e.target.value }))}
                        options={sabupsoOptions}
                        placeholder="사업소명"
                        disabled={!search.bonbu}
                    />
                    <DateInput
                        label="조회기간(시작)"
                        value={search.dateFrom}
                        onChange={v => setSearch(s => ({ ...s, dateFrom: v }))}
                    />
                    <DateInput
                        label="조회기간(종료)"
                        value={search.dateTo}
                        onChange={v => setSearch(s => ({ ...s, dateTo: v }))}
                    />
                    <SearchInput
                        label="검색"
                        options={SEARCH_TYPE_OPT}
                        selectValue={search.searchType}
                        onSelectChange={e => setSearch(s => ({ ...s, searchType: e.target.value }))}
                        inputValue={search.searchValue}
                        onInputChange={e => setSearch(s => ({ ...s, searchValue: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && onSearch()}
                    />
                </div>
                <div className="panel-search-function">
                    <div className={styles.totalCount}>
                        {isLoading
                            ? '조회 중...'
                            : <>총 <strong style={{ color:'var(--color-danger-total)' }}>{(data?.totalCount ?? 0).toLocaleString()}</strong>건</>
                        }
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                        <BasicButton label="초기화" icon={RotateCcw}                    variant="secondary" onClick={onReset} />
                        <BasicButton label="조회"   icon={isLoading ? Loader2 : Search} variant="primary"   onClick={onSearch} disabled={isLoading} />
                    </div>
                    <div />
                </div>
            </div>

            {/* ── 그리드 + 상세 드로어 ── */}
            <div style={{ flex:1, overflow:'hidden', display:'flex' }}>
                <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
                    <BasicGrid
                        mode="paginate"
                        rowData={data?.list ?? []}
                        colDefs={colDefs}
                        height="100%"
                        pageSize={10}
                        loading={isLoading}
                        defaultColDef={{ sortable:true, resizable:true, filter:false, minWidth:80, flex:1 }}
                    />
                </div>
                <GridDetailDrawer
                    open={detailOpen}
                    title={detailData?.id ?? '실행 상세'}
                    onClose={() => setDetailOpen(false)}
                    defaultWidth={420}
                >
                    <DetailPane data={detailData} />
                </GridDetailDrawer>
            </div>
        </div>
    )
}
