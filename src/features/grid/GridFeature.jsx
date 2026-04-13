import React, { useState, useMemo, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import BasicGrid          from '@/components/grid/BasicGrid.jsx'
import GridActionButtons  from '@/components/grid/GridActionButtons.jsx'
import GridDetailDrawer   from '@/components/grid/GridDetailDrawer.jsx'
import SectionDivider     from '@/components/layout/SectionDivider.jsx'
import TextInput   from '@/components/input/TextInput.jsx'
import SelectInput from '@/components/input/SelectInput.jsx'
import DateInput   from '@/components/input/DateInput.jsx'
import BasicButton from '@/components/button/BasicButton.jsx'
import BasicLabel  from '@/components/label/BasicLabel.jsx'
import { Search, RotateCcw, FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmModal from '@/components/modal/ConfirmModal.jsx'
import styles from './GridFeature.module.css'

// ── 샘플 데이터 1000건 (API 연동 시 제거) ─────────────────────────────────────
const ALL_DATA = Array.from({ length: 1000 }, (_, i) => ({
  id:       i + 1,
  name:     ['김민준','이서연','박지호','최수아','정도윤','한지민','오승현','임채원'][i % 8],
  category: ['설비','전기','통신','토목'][i % 4],
  status:   ['정상','점검중','이상','완료'][i % 4],
  priority: ['높음','중간','낮음'][i % 3],
  date:     `2025-${String((i % 12) + 1).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
  remark:   `비고 내용 ${i + 1}`,
}))

const STATUS_VARIANT   = { 정상:'success', 점검중:'warning', 이상:'danger', 완료:'info' }
const PRIORITY_VARIANT = { 높음:'danger', 중간:'warning', 낮음:'default' }

const COL_DEFS = [
  { field:'id',       headerName:'No',     width:65,  flex:0 },
  { field:'name',     headerName:'담당자', width:90,  flex:0 },
  { field:'category', headerName:'분류',   width:80,  flex:0 },
  {
    field:'status', headerName:'상태', width:90, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] || 'default'} />,
  },
  {
    field:'priority', headerName:'우선순위', width:90, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={PRIORITY_VARIANT[value] || 'default'} />,
  },
  { field:'date',   headerName:'등록일', width:110, flex:0 },
  { field:'remark', headerName:'비고',   flex:1 },
]

// ── 검색 폼 ──────────────────────────────────────────────────────────────────
function SearchForm({ search, setSearch, onSearch, onReset, totalCount, isLoading }) {
  return (
    <div className="panel-toolbar panel-toolbar-col">
      <div className="panel-search-value" style={{ display:'grid', gridTemplateColumns:'140px 120px 120px 160px 160px', gap:10, alignItems:'end' }}>
        <TextInput
          label="담당자" placeholder="담당자명"
          value={search.name}
          onChange={e => setSearch(s => ({ ...s, name: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
        />
        <SelectInput
          label="분류" value={search.category}
          onChange={e => setSearch(s => ({ ...s, category: e.target.value }))}
          options={[{label:'설비',value:'설비'},{label:'전기',value:'전기'},{label:'통신',value:'통신'},{label:'토목',value:'토목'}]}
        />
        <SelectInput
          label="상태" value={search.status}
          onChange={e => setSearch(s => ({ ...s, status: e.target.value }))}
          options={[{label:'정상',value:'정상'},{label:'점검중',value:'점검중'},{label:'이상',value:'이상'},{label:'완료',value:'완료'}]}
        />
        <DateInput
          label="등록일(시작)" value={search.dateFrom}
          onChange={v => setSearch(s => ({
            ...s,
            dateFrom: v,
            dateTo: s.dateTo && v > s.dateTo ? '' : s.dateTo,
          }))}
        />
        <DateInput
          label="등록일(종료)" value={search.dateTo}
          options={{ minDate: search.dateFrom || undefined }}
          onChange={v => setSearch(s => ({ ...s, dateTo: v }))}
        />
      </div>
      <div className="panel-search-function">
        <div className="total-count">
          {isLoading
            ? <span style={{ color:'var(--color-danger-total)' }}>조회 중...</span>
            : <>총 <strong style={{ color:'var(--color-danger-total)' }}>{totalCount.toLocaleString()}</strong>건</>
          }
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <BasicButton label="초기화" icon={RotateCcw}                    variant="secondary" onClick={onReset} />
          <BasicButton label="조회"   icon={isLoading ? Loader2 : Search} variant="primary"   onClick={onSearch} disabled={isLoading} />
        </div>
        <div className="panel-search-excel" style={{ display:'flex', justifyContent:'flex-end' }}>
          <BasicButton label="엑셀" icon={FileDown} variant="excel"
            onClick={() => toast.info('엑셀 다운로드를 시작합니다.')}
          />
        </div>
      </div>
    </div>
  )
}

// ── 페이징 그리드 (useQuery 적용) ─────────────────────────────────────────────
function PaginateGrid() {
  const INIT = { name:'', category:'', status:'', dateFrom:'', dateTo:'' }
  const [search,        setSearch]       = useState(INIT)
  const [applied,       setApplied]      = useState(INIT)
  const [detailOpen,    setDetailOpen]   = useState(false)
  const [detailData,    setDetailData]   = useState(null)
  const [confirmOpen,   setConfirmOpen]  = useState(false)
  const [confirmTarget, setConfirmTarget]= useState(null)

  const openDetail  = useCallback((data) => {
    if (detailData?.id === data.id) { setDetailOpen(o => !o) }
    else { setDetailData(data); setDetailOpen(true) }
  }, [detailData])
  const closeDetail = useCallback(() => setDetailOpen(false), [])

  const openDeleteConfirm   = useCallback((data) => { setConfirmTarget(data); setConfirmOpen(true) }, [])
  const handleDeleteConfirm = useCallback(() => {
    toast.success(`${confirmTarget?.name} 삭제 완료`)
    setConfirmOpen(false); setConfirmTarget(null)
  }, [confirmTarget])

  const { data, isLoading } = useQuery({
    queryKey: ['work', 'list', applied],
    throwOnError: true,
    queryFn: async () => {
      // ── 실제 API 호출 예제 ─────────────────────────────────────────────
      // import { workApi } from '@/services/grid/gridService.js'
      // return workApi.getList(applied)  → { list: [], totalCount: 0 }
      // ──────────────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 200))
      const list = ALL_DATA.filter(row => {
        if (applied.name     && !row.name.includes(applied.name))   return false
        if (applied.category && row.category !== applied.category)   return false
        if (applied.status   && row.status   !== applied.status)     return false
        if (applied.dateFrom && row.date < applied.dateFrom)         return false
        if (applied.dateTo   && row.date > applied.dateTo)           return false
        return true
      })
      return { list, totalCount: list.length }
    },
    staleTime: 1000 * 60,
  })

  const colDefs = useMemo(() => [
    ...COL_DEFS,
    {
      headerName: '액션', width:200, flex:0, sortable:false, filter:false,
      cellRenderer: ({ data }) => (
        <GridActionButtons data={data} buttons={[
          { type:'detail', onClick: openDetail },
          { type:'edit',   onClick: d => toast.info(`수정: ${d.name}`) },
          { type:'delete', onClick: openDeleteConfirm },
        ]} />
      ),
    },
  ], [openDetail, openDeleteConfirm])

  const onSearch = () => { setApplied({ ...search }); closeDetail() }
  const onReset  = () => { setSearch(INIT); setApplied(INIT); closeDetail() }

  return (
    <div className="panel-container">
      <SearchForm
        search={search} setSearch={setSearch}
        onSearch={onSearch} onReset={onReset}
        totalCount={data?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <div style={{ flex:1, overflow:'hidden', display:'flex' }}>
        <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
          <BasicGrid
            mode="paginate" rowData={data?.list ?? []} colDefs={colDefs}
            onRowClick={openDetail} height="100%" pageSize={20} loading={isLoading}
          />
        </div>
        <GridDetailDrawer open={detailOpen} data={detailData} onClose={closeDetail} defaultWidth={500} columns={2} />
      </div>
      <ConfirmModal
        open={confirmOpen} variant="danger" title="삭제 확인"
        message={`'${confirmTarget?.name}' 항목을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
        confirmText="삭제" onConfirm={handleDeleteConfirm} onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

// ── 무한 스크롤 그리드 ────────────────────────────────────────────────────────
function InfiniteGrid() {
  const INIT = { name:'', category:'', status:'' }
  const [search,  setSearch]  = useState(INIT)
  const [applied, setApplied] = useState(INIT)
  const gridRef = useRef(null)

  const onSearch = () => {
    setApplied({ ...search })
    setTimeout(() => gridRef.current?.api?.purgeInfiniteCache?.(), 0)
  }
  const onReset = () => {
    setSearch(INIT); setApplied(INIT)
    setTimeout(() => gridRef.current?.api?.purgeInfiniteCache?.(), 0)
  }

  const datasource = useMemo(() => ({
    getRows: async ({ startRow, endRow, successCallback, failCallback }) => {
      try {
        // ── 실제 API 호출 예제 ───────────────────────────────────────────
        // const { list, totalCount } = await workApi.getListInfinite({ startRow, endRow, ...applied })
        // successCallback(list, endRow >= totalCount ? totalCount : undefined)
        // ────────────────────────────────────────────────────────────────
        await new Promise(r => setTimeout(r, 100))
        const result = ALL_DATA.filter(row => {
          if (applied.name     && !row.name.includes(applied.name))   return false
          if (applied.category && row.category !== applied.category)   return false
          if (applied.status   && row.status   !== applied.status)     return false
          return true
        })
        successCallback(result.slice(startRow, endRow), endRow >= result.length ? result.length : undefined)
      } catch { failCallback() }
    },
  }), [applied])

  const totalCount = useMemo(() =>
    ALL_DATA.filter(r => {
      if (applied.name     && !r.name.includes(applied.name))   return false
      if (applied.category && r.category !== applied.category)   return false
      if (applied.status   && r.status   !== applied.status)     return false
      return true
    }).length
  , [applied])

  return (
    <div className="panel-container">
      <SearchForm search={search} setSearch={setSearch} onSearch={onSearch} onReset={onReset} totalCount={totalCount} isLoading={false} />
      <div className={styles.noteBar}>
        <span style={{ fontSize:11, color:'var(--color-text-muted)' }}>
          💡 스크롤 시 자동 로드 —
          <code style={{ fontSize:11, color:'var(--color-accent)', background:'var(--color-bg-tertiary)', padding:'0 4px', borderRadius:3, margin:'0 4px' }}>datasource.getRows</code>
          안의 주석을 참고해 API 호출로 교체하세요.
        </span>
      </div>
      <div style={{ flex:1, overflow:'hidden' }}>
        <BasicGrid ref={gridRef} mode="infinite" datasource={datasource} colDefs={COL_DEFS} height="100%" cacheBlockSize={50} />
      </div>
    </div>
  )
}

// ── 상하 분할 그리드 (마스터-디테일) ─────────────────────────────────────────
const DETAIL_COL_DEFS = [
  { field:'seq',     headerName:'순번',    width:65,  flex:0 },
  { field:'date',    headerName:'처리일',  width:110, flex:0 },
  { field:'handler', headerName:'담당자',  width:90,  flex:0 },
  { field:'action',  headerName:'처리내용', flex:1 },
  {
    field:'result', headerName:'결과', width:85, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] || 'default'} />,
  },
]

const makeSubData = (master) => master ? Array.from({ length: (master.id % 5) + 3 }, (_, i) => ({
  id:      master.id * 100 + i + 1,
  seq:     i + 1,
  date:    `2025-${String(((master.id + i) % 12) + 1).padStart(2,'0')}-${String(((master.id * 2 + i) % 28) + 1).padStart(2,'0')}`,
  handler: ['김민준','이서연','박지호','최수아'][(master.id + i) % 4],
  action:  `[${master.category}] ${master.name} 처리 내용 ${i + 1}`,
  result:  ['정상','점검중','완료','이상'][(master.id + i) % 4],
})) : []

function MasterDetailGrid() {
  const [selected,   setSelected]  = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerData, setDrawerData] = useState(null)

  const masterData = useMemo(() => ALL_DATA, [])
  const detailData = useMemo(() => makeSubData(selected), [selected])

  const selectMaster = useCallback((row) => {
    setSelected(prev => {
      if (prev?.id !== row.id) { setDrawerOpen(false); setDrawerData(null) }
      return row
    })
  }, [])

  const openDrawer = useCallback((row) => {
    if (drawerData?.id === row.id) { setDrawerOpen(o => !o) }
    else { setDrawerData({ ...row, name: row.handler, status: row.result, priority: null }); setDrawerOpen(true) }
  }, [drawerData])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', minWidth:0 }}>

        {/* 상위 그리드 */}
        <div className={styles.gridHalf}>
          <div className="grid-toolbar">
            <div className="grid-accent-bar" style={{ background:'var(--color-accent)' }} />
            <span className="grid-toolbar-title">업무 목록</span>
            <span className="grid-toolbar-badge">{masterData.length.toLocaleString()}건</span>
            {selected && (
              <span className={styles.selectedInfo}>
                <strong>{selected.name}</strong>&nbsp;·&nbsp;{selected.category}&nbsp;·&nbsp;{selected.date}
              </span>
            )}
          </div>
          <div style={{ flex:1, overflow:'hidden' }}>
            <BasicGrid mode="paginate" rowData={masterData} colDefs={COL_DEFS} onRowClick={selectMaster} height="100%" pageSize={10} />
          </div>
        </div>

        {/* 연결 구분선 */}
        <SectionDivider label={selected ? `${selected.name} 처리 이력` : '행을 선택하면 하위 목록이 표시됩니다'} />

        {/* 하위 그리드 */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
          <div className="grid-toolbar">
            <div className="grid-accent-bar" style={{ background: selected ? 'var(--color-accent)' : 'var(--color-border)', transition:'background .2s' }} />
            <span className="grid-toolbar-title">처리 이력</span>
            {selected
              ? <span className="grid-toolbar-badge">{detailData.length}건</span>
              : <span style={{ fontSize:11, color:'var(--color-text-muted)' }}>—</span>
            }
          </div>
          <div style={{ flex:1, overflow:'hidden' }}>
            <BasicGrid
              mode="paginate" rowData={detailData} colDefs={DETAIL_COL_DEFS}
              onRowClick={openDrawer} height="100%" pageSize={5}
              overlayNoRowsTemplate={
                !selected
                  ? '<span style="color:var(--color-text-muted);font-size:13px">위 목록에서 행을 선택하세요</span>'
                  : '<span style="color:var(--color-text-muted);font-size:13px">데이터가 없습니다</span>'
              }
            />
          </div>
        </div>

      </div>
      <GridDetailDrawer open={drawerOpen} data={drawerData} onClose={closeDrawer} defaultWidth={420} />
    </div>
  )
}

// ── GridFeature ───────────────────────────────────────────────────────────────
export default function GridFeature() {
  const [tab, setTab] = useState('paginate')
  const TABS = [
    { key:'paginate',     label:'페이징 그리드'      },
    { key:'infinite',     label:'무한 스크롤 그리드' },
    { key:'masterdetail', label:'상하 분할 그리드'   },
  ]
  return (
    <div className="grid-wrap">
      <div className="grid-tabs-header">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ''}`}
          >{t.label}</button>
        ))}
      </div>
      <div className="grid-tabs-content">
        {tab === 'paginate'     && <PaginateGrid />     }
        {tab === 'infinite'     && <InfiniteGrid />     }
        {tab === 'masterdetail' && <MasterDetailGrid /> }
      </div>
    </div>
  )
}
