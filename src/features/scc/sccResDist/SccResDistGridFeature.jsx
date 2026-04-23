import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery }          from '@tanstack/react-query'
import { useAppStore }       from '@/store/useAppStore.js'
import BasicGrid             from '@/components/grid/BasicGrid.jsx'
import GridDetailModal       from '@/components/grid/GridDetailModal.jsx'
import GridActionButtons     from '@/components/grid/GridActionButtons.jsx'
import SearchInput           from '@/components/input/SearchInput.jsx'
import BasicButton           from '@/components/button/BasicButton.jsx'
import WlcResDistDtlFeature from '@/features/wlc/wlcResDist/WlcResDistDtlFeature.jsx'
import { MOCK_DATA } from '../../../../public/data/wlcResMock.js'
import { Search, RotateCcw, Loader2 } from 'lucide-react'
import styles from './SccResDistGridFeature.module.css'
import SelectInput from "@/components/input/SelectInput.jsx";
import BasicLabel from "@/components/label/BasicLabel.jsx";
import SccResDistDtlFeature from "./SccResDistDtlFeature.jsx";

const GRADE_SCORE = [
    {label:'즉시위험', value:'S'}
    ,{label:'고 위험', value:'A'}
    ,{label:'중 위험', value:'B'}
    ,{label:'저 위험', value:'C'}
    ,{label:'정기진단', value:'D'}
];

// 판정등급 색상 맵
const GRADE_COLORS = {
    S: {color:'danger', value:'즉시위험'},   // 즉시위험 - 빨강
    A: {color:'warning', value:'고위험'},  // 고위험   - 주황
    B: {color:'default', value:'중위험'},  // 중위험   - 노랑
    C: {color:'success', value:'저위험'},  // 저위험   - 연두
    D: {color:'info', value:'정기진단'}  // 정기진단 - 파랑
};


const SEARCH_TYPE_OPT = [
    { label:'설비 GID',       value:'gid'    },
    { label:'전산화번호',     value:'calcNo' },
]

const INIT_SEARCH = { bonbu:'', sabupso:'', poleType:'', poleShape:'', poleSize:'', supportFlag:'', result:'', searchType:'gid', searchValue:'' }

/**
 * 풍하중 평과결과 분포도 그리드
 * 풍하중 평과결과 분포도 그리드 조회
 *
 * @author LKW
 * @since 2026-04-22
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-22 | LKW    | 최초 작성 |
 */
export default function SccResDistGridFeature() {
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
    }, [wlcResultFilter, clearWlcResultFilter]);

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

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerRow,  setDrawerRow]  = useState(null);

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

    const openModal  = useCallback((row) => { setModalRow(row); setModalOpen(true) }, [])
    const closeModal = useCallback(() => setModalOpen(false), [])
    const onSearch   = () => { setApplied({ ...search }); setDrawerOpen(false) }
    const onReset    = () => { setSearch(INIT_SEARCH); setApplied(INIT_SEARCH); setDrawerOpen(false) }

    const colDefs = useMemo(() => [
        { field:'gid',    headerName:'설비GID',        flex:1, minWidth:100  },
        { field:'calcNo',       headerName:'전산화번호', flex:1, minWidth:95 },
        { field:'poleType',     headerName:'전주종류', flex:1, minWidth:90  },
        { field:'poleShape',    headerName:'형태',     flex:1, minWidth:90  },
        { field:'poleSize',     headerName:'규격',     flex:1, minWidth:80  },
        { field:'score',       headerName:'판정점수', flex:1, minWidth:100, valueFormatter: (params) => {
                if (params.value == null) return '';
                // 소수점 있으면 그대로, 없으면 정수로
                return Number.isInteger(params.value)
                    ? params.value.toString()
                    : params.value.toFixed(2);
            }},
        {
            headerName: '판정등급',
            field: 'grade',
            cellStyle:{ display:'flex', alignItems:'center', justifyContent:'center' },
            cellRenderer: ({ value }) => {
                return <BasicLabel text={value+' '+GRADE_COLORS[value].value} variant={GRADE_COLORS[value].color} />;
            },
        },
        { headerName:'액션',    flex:1, minWidth:68,  sortable:false, filter:false,
            cellRenderer: ({ data }) => data
                ? <GridActionButtons data={data} buttons={[{ type:'detail', onClick: openModal }]} />
                : null,
        },
    ], [openModal])

    return (
        <div >
            {/* ── 검색 조건 ── */}
            <div style={{display:'grid', gridTemplateColumns:'305px 220px 120px 100px 100px', gap:10, alignItems:'center', paddingBottom:10}}>
                <div className={styles.totalCount}>
                    {isLoading
                        ? '조회 중...'
                        : <>총 <strong style={{ color:'var(--color-danger-total)' }}>{(data?.totalCount ?? 0).toLocaleString()}</strong>건</>
                    }
                </div>
                <SelectInput
                    placeholder='판정등급'
                    options={GRADE_SCORE}
                />
                <SearchInput
                    style={{ gridColumn: 'span 2' }}
                    options={SEARCH_TYPE_OPT}
                    selectValue={search.searchType}
                    onSelectChange={e => setSearch(s => ({ ...s, searchType: e.target.value }))}
                    inputValue={search.searchValue}
                    onInputChange={e => setSearch(s => ({ ...s, searchValue: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && onSearch()}
                />
                <div style={{ display:'flex', gap:8 }}>
                    <BasicButton label="초기화" icon={RotateCcw}                    variant="secondary" onClick={onReset} />
                    <BasicButton label="조회"   icon={isLoading ? Loader2 : Search} variant="primary"   onClick={onSearch} disabled={isLoading} />
                </div>
            </div>

            {/* ── 그리드 + 드로어 ── */}
            <BasicGrid
                mode="paginate"
                rowData={data?.list ?? []}
                colDefs={colDefs}
                onRowClick={openDrawer}
                height="280px"
                pageSize={5}
                loading={isLoading}
                defaultColDef={{ sortable:true, resizable:true, filter:false, minWidth:60, flex:1 }}
            />


            {/* 상세 모달 — API 연동 시 mock 분기를 useQuery 결과로 교체 */}
            <GridDetailModal
                width={'1200px'}
                height={'720px'}
                open={modalOpen}
                title={modalRow ? `${modalRow.calcNo} · ${modalRow.poleType} ${modalRow.poleSize}` : '상세 정보'}
                onClose={closeModal}
            >
                <SccResDistDtlFeature initialPoleId="8027R504"/>
            </GridDetailModal>
        </div>
    )
}