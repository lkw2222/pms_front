import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery }          from '@tanstack/react-query'
import { useAppStore }       from '@/store/useAppStore.js'
import BasicGrid             from '@/components/grid/BasicGrid.jsx'
import GridDetailDrawer      from '@/components/grid/GridDetailDrawer.jsx'
import GridDetailModal       from '@/components/grid/GridDetailModal.jsx'
import GridActionButtons     from '@/components/grid/GridActionButtons.jsx'
import WlcResDrwFeature from './WlcResDrwFeature.jsx'
import SelectInput           from '@/components/input/SelectInput.jsx'
import SearchInput           from '@/components/input/SearchInput.jsx'
import BasicButton           from '@/components/button/BasicButton.jsx'
import BasicLabel            from '@/components/label/BasicLabel.jsx'
import WlcResDtlFeature from './WlcResDtlFeature.jsx'
import { MOCK_DETAIL, MOCK_DETAIL_2 } from '../../../../public/data/wlcResDtlMock.js'
import { MOCK_DATA } from '../../../../public/data/wlcResMock.js'
import { Search, RotateCcw, Loader2, Download } from 'lucide-react'
import styles                from './WlcResFeature.module.css'

const RESULT_VARIANT = { '적합':'success', '부적합':'danger' }
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
const YN_OPTIONS         = [{ label:'Y', value:'Y' }, { label:'N', value:'N' }]
const RESULT_OPTIONS     = [{ label:'적합', value:'적합' }, { label:'부적합', value:'부적합' }]
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

const SEARCH_TYPE_OPT = [
    { label:'설비 GID',       value:'gid'    },
    { label:'전산화번호',     value:'calcNo' },
    { label:'풍하중 산출 ID', value:'calcId' },
]

const INIT_SEARCH = { bonbu:'', sabupso:'', poleType:'', poleShape:'', poleSize:'', supportFlag:'', result:'', searchType:'gid', searchValue:'' }


/**
 * 풍하중 평가 결과 조회 화면.
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
export default function WlcResFeature() {
    const [search,    setSearch]    = useState(INIT_SEARCH)
    const [applied,   setApplied]   = useState(INIT_SEARCH)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalRow,  setModalRow]  = useState(null)

    const { wlcResultFilter, clearWlcResultFilter } = useAppStore()

    // 실행로그에서 넘어온 필터 감지 → 검색 조건 세팅 후 자동 조회
    useEffect(() => {
        if (!wlcResultFilter) return
        const { calcId, bonbu, sabupso } = wlcResultFilter
        const next = { ...INIT_SEARCH, searchType:'calcId', searchValue: calcId ?? '', bonbu: bonbu ?? '', sabupso: sabupso ?? '' }
        setSearch(next)
        setApplied(next)
        clearWlcResultFilter()
    }, [wlcResultFilter, clearWlcResultFilter])

    const sabupsoOptions = SABUPSO_MAP[search.bonbu] ?? []

    const { data, isLoading } = useQuery({
        queryKey: ['wlc', 'result', 'list', applied],
        queryFn: async () => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────
            // import { wlcResultApi } from '@/services/wlc/wlcResult/wlcResService.js'
            // return wlcResultApi.getList(applied)
            // ─────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 200))
            const list = MOCK_DATA.filter(row => {
                if (applied.bonbu       && row.bonbu       !== applied.bonbu)       return false
                if (applied.sabupso     && row.sabupso     !== applied.sabupso)     return false
                if (applied.poleType    && row.poleType    !== applied.poleType)    return false
                if (applied.poleShape   && row.poleShape   !== applied.poleShape)   return false
                if (applied.poleSize    && row.poleSize    !== applied.poleSize)    return false
                if (applied.supportFlag && row.supportFlag !== applied.supportFlag) return false
                if (applied.result      && row.result      !== applied.result)      return false
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
        { field:'seq',    headerName:'No',         flex:1, minWidth:50,  type:'numericColumn' },
        { field:'calcId', headerName:'풍하중 산출ID', flex:2, minWidth:140 },
        { field:'bonbu',  headerName:'지역본부',       flex:2, minWidth:110, valueFormatter: ({ value }) => BONBU_OPTIONS.find(o => o.value === value)?.label ?? value },
        { field:'sabupso',headerName:'사업소',         flex:2, minWidth:80,  valueFormatter: ({ value }) => Object.values(SABUPSO_MAP).flat().find(o => o.value === value)?.label ?? value },
        { field:'gid',    headerName:'설비GID',        flex:2, minWidth:80  },
        { field:'calcNo',       headerName:'전산화번호', flex:2, minWidth:95 },
        { field:'poleType',     headerName:'전주종류', flex:2, minWidth:90  },
        { field:'poleShape',    headerName:'형태',     flex:1, minWidth:90  },
        { field:'poleSize',     headerName:'규격',     flex:1, minWidth:80  },
        { field:'supportFlag',  headerName:'지지대',   flex:1, minWidth:80,  cellStyle:{ textAlign:'center' } },
        /*{ field:'relatedPoles', headerName:'관련전주', flex:1, minWidth:90,  type:'numericColumn' },
        { field:'wireCount',    headerName:'전선',     flex:1, minWidth:70,  type:'numericColumn' },
        { field:'overheadCount',headerName:'가공설비', flex:1, minWidth:90,  type:'numericColumn' },
        { field:'commCount',    headerName:'통신기기', flex:1, minWidth:90,  type:'numericColumn' },*/
        { field:'safetyFactor',   headerName:'안전율',   flex:1, minWidth:80,  type:'numericColumn', valueFormatter: ({ value }) => value != null ? value.toFixed(2) : '' },
        { field:'result',       headerName:'판정결과', flex:1, minWidth:100,  cellRenderer: ({ value }) => <BasicLabel text={value} variant={RESULT_VARIANT[value] ?? 'default'} />, cellStyle:{ display:'flex', alignItems:'center', justifyContent:'center' } },
        { headerName:'액션',    flex:1, minWidth:68,  sortable:false, filter:false,
          cellRenderer: ({ data }) => data
            ? <GridActionButtons data={data} buttons={[{ type:'detail', onClick: openModal }]} />
            : null,
        },
    ], [openModal])

    return (
        <div className="grid-wrap">
            {/* ── 검색 조건 ── */}
            <div className="panel-toolbar panel-toolbar-col">
                <div className="panel-search-value" style={{ display:'grid', gridTemplateColumns:'150px 150px 130px 100px 100px', gap:10, alignItems:'end' }}>
                    <SelectInput label="지역본부"   value={search.bonbu}       onChange={e => setSearch(s => ({ ...s, bonbu: e.target.value, sabupso: '' }))} options={BONBU_OPTIONS}      placeholder="지역본부" />
                    <SelectInput label="사업소명"   value={search.sabupso}     onChange={e => setSearch(s => ({ ...s, sabupso:     e.target.value }))} options={sabupsoOptions}     placeholder="사업소명" disabled={!search.bonbu} />
                    <SelectInput label="전주종류"   value={search.poleType}    onChange={e => setSearch(s => ({ ...s, poleType:    e.target.value }))} options={POLE_TYPE_OPTIONS}  placeholder="종류" />
                    <SelectInput label="전주형태"   value={search.poleShape}   onChange={e => setSearch(s => ({ ...s, poleShape:   e.target.value }))} options={POLE_SHAPE_OPTIONS} placeholder="형태" />
                    <SelectInput label="전주규격"   value={search.poleSize}    onChange={e => setSearch(s => ({ ...s, poleSize:    e.target.value }))} options={POLE_SIZE_OPTIONS}  placeholder="규격" />
                    <SelectInput label="지지대여부" value={search.supportFlag} onChange={e => setSearch(s => ({ ...s, supportFlag: e.target.value }))} options={YN_OPTIONS}         placeholder="전체" />
                    <SelectInput label="판정결과"   value={search.result}      onChange={e => setSearch(s => ({ ...s, result:      e.target.value }))} options={RESULT_OPTIONS}     placeholder="전체" />
                    <SearchInput
                        label="검색"
                        style={{ gridColumn: 'span 3' }}
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
                    <div style={{ display:'flex', gap:8 }}>
                        <BasicButton label="초기화" icon={RotateCcw}                    variant="secondary" onClick={onReset} />
                        <BasicButton label="조회"   icon={isLoading ? Loader2 : Search} variant="primary"   onClick={onSearch} disabled={isLoading} />
                    </div>
                    <div style={{ display:'flex', justifyContent:'flex-end' }}>
                        <BasicButton label="엑셀 다운로드" icon={Download} variant="secondary" size="sm" onClick={() => {}} />
                    </div>
                </div>
            </div>

            {/* ── 그리드 + 드로어 ── */}
            <div style={{ flex:1, overflow:'hidden', display:'flex' }}>
                <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
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
                    <WlcResDrwFeature
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
                <WlcResDtlFeature
                    data={Number(modalRow?.gid) % 2 === 1 ? MOCK_DETAIL_2 : MOCK_DETAIL}
                />
            </GridDetailModal>
        </div>
    )
}
