import React, { useState, useMemo, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import BasicGrid          from '@/components/grid/BasicGrid.jsx'
import GridActionButtons  from '@/components/grid/GridActionButtons.jsx'
import GridDetailDrawer  from '@/components/grid/GridDetailDrawer.jsx'
import TextInput   from '@/components/input/TextInput.jsx'
import SelectInput from '@/components/input/SelectInput.jsx'
import DateInput   from '@/components/input/DateInput.jsx'
import BasicButton from '@/components/button/BasicButton.jsx'
import BasicLabel  from '@/components/label/BasicLabel.jsx'
import { Search, RotateCcw, Download, Loader2, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmModal from '@/components/modal/ConfirmModal.jsx'

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
  { field:'id',       headerName:'No',     /* width:55,  flex:0 */ width:70, flex:0 },
  { field:'name',     headerName:'담당자', /* width:85,  flex:0 */ minWidth:110, flex:0.5 },
  { field:'category', headerName:'분류',  /* width:75,  flex:0 */ minWidth:80, flex:0.5 },
  {
    field:'status', headerName:'상태', /* width:85, flex:0, */ minWidth:90, flex:0.5,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] || 'default'} />,
  },
  {
    field:'priority', headerName:'우선... ', /* width:85, flex:0, */ minWidth:90, flex:0.5,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={PRIORITY_VARIANT[value] || 'default'} />,
  },
  { field:'date',   headerName:'등록일', /* width:100, flex:0 */ minWidth:120, flex:0.7 },
  { field:'remark', headerName:'비고',   /* flex:1,   minWidth:80 */ minWidth:140, flex:2 },
]

// ── 검색 폼 ──────────────────────────────────────────────────────────────────
function SearchForm({ search, setSearch, onSearch, onReset, totalCount, isLoading }) {
  return (
    <div className="panel-toolbar" style={{ flexDirection:'column', alignItems:'flex-start', gap:10 }}>
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
      <div className="panel-search-function" style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:8, width:'100%' }}>
          <div style={{ justifySelf:'start', fontSize:13, color:'var(--color-text-muted)', position:'relative', top:5 }}>
              {isLoading
                  ? <span style={{ color:'var(--color-danger-total)' }}>조회 중...</span>
                  : <>총 <strong style={{ color:'var(--color-danger-total)' }}>{totalCount.toLocaleString()}</strong>건</>
              }
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <BasicButton label="초기화" icon={RotateCcw}                    variant="secondary" onClick={onReset} />
              <BasicButton label="조회"   icon={isLoading ? Loader2 : Search} variant="primary" onClick={onSearch} disabled={isLoading} className="btn-search-custom" />
          </div>

          <div className="panel-search-excel" style={{ display:'flex', justifyContent:'flex-end' }}>
              <BasicButton label="엑셀"   icon={Download}                     variant="ghost"
                 onClick={() => {
                    // import { workApi } from '@/services/grid/gridService.js'
                    // gridApi.downloadExcel(search)
                    toast.info('엑셀 다운로드를 시작합니다.')
                 }}
              />
          </div>
      </div>
    </div>
  )
}

// ── 페이징 그리드 (useQuery 적용) ─────────────────────────────────────────────
function PaginateGrid() {
  const INIT = { name:'', category:'', status:'', dateFrom:'', dateTo:'' }
  const [search,      setSearch]      = useState(INIT)
  const [applied,     setApplied]     = useState(INIT)
  const [detailOpen,  setDetailOpen]  = useState(false)
  const [detailData,  setDetailData]  = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState(null)

  const openDetail  = useCallback((data) => {
    if (detailData?.id === data.id) {
      setDetailOpen(o => !o)
    } else {
      setDetailData(data)
      setDetailOpen(true)
    }
  }, [detailData])
  const closeDetail = useCallback(() => setDetailOpen(false), [])

  const openDeleteConfirm = useCallback((data) => {
    setConfirmTarget(data)
    setConfirmOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    toast.success(`${confirmTarget?.name} 삭제 완료`)
    setConfirmOpen(false)
    setConfirmTarget(null)
  }, [confirmTarget])

  // ── TanStack Query - 서버 상태 관리 ────────────────────────────────────
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['work', 'list', applied],
    throwOnError: true,   // 에러 발생 시 ErrorBoundary 로 전파
    queryFn:  async () => {

      // ── 실제 API 호출 예제 ─────────────────────────────────────────────
      // import { workApi } from '@/services/grid/gridService.js'
      // return gridApi.getList(applied)
      // → 반환값: { list: [], totalCount: 0 }
      // ──────────────────────────────────────────────────────────────────

      // 샘플 필터 (API 연동 시 위 코드로 교체)
      await new Promise(r => setTimeout(r, 200)) // 네트워크 딜레이 시뮬레이션
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
    staleTime: 1000 * 60,  // 1분간 캐시 유지 (같은 조건 재조회 안 함)
  })

  const colDefs = useMemo(() => [
    ...COL_DEFS,
    {
      headerName: '액션', width:200, flex:0, sortable:false, filter:false,
      cellRenderer: ({ data }) => (
        <GridActionButtons
          data={data}
          buttons={[
            { type:'detail', onClick: openDetail                    },
            { type:'edit',   onClick: d => toast.info(`수정: ${d.name}`) },
            { type:'delete', onClick: openDeleteConfirm },
          ]}
        />
      ),
    },
  ], [openDetail])

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
            mode="paginate"
            rowData={data?.list ?? []}
            colDefs={colDefs}
            onRowClick={openDetail}
            height="100%"
            pageSize={20}
            loading={isLoading}
          />
        </div>
        <GridDetailDrawer
          open={detailOpen}
          data={detailData}
          onClose={closeDetail}
          defaultWidth={500}
          columns={2}
        />
      </div>

      <ConfirmModal
        open={confirmOpen}
        variant="danger"
        title="삭제 확인"
        message={`'${confirmTarget?.name}' 항목을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
        confirmText="삭제"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
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
        // const response = await apiClient.get('/work/list/infinite', {
        //   params: { startRow, endRow, ...applied }
        // })
        // const { list, totalCount } = response.data
        // successCallback(list, endRow >= totalCount ? totalCount : undefined)
        // ────────────────────────────────────────────────────────────────

        // 샘플
        await new Promise(r => setTimeout(r, 100))
        const result = ALL_DATA.filter(row => {
          if (applied.name     && !row.name.includes(applied.name))   return false
          if (applied.category && row.category !== applied.category)   return false
          if (applied.status   && row.status   !== applied.status)     return false
          return true
        })
        successCallback(result.slice(startRow, endRow), endRow >= result.length ? result.length : undefined)
      } catch {
        failCallback()
      }
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
      <div style={{ padding:'6px 16px', borderBottom:'1px solid var(--color-border)', flexShrink:0, background:'var(--color-bg-secondary)' }}>
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
  { field:'seq',      headerName:'순번',   width:65,  flex:0 },
  { field:'date',     headerName:'처리일', width:110, flex:0 },
  { field:'handler',  headerName:'담당자', width:90,  flex:0 },
  { field:'action',   headerName:'처리내용', flex:1 },
  {
    field:'result', headerName:'결과', width:85, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] || 'default'} />,
  },
]

// 상위 행 선택 시 하위 샘플 데이터 생성
const makeSubData = (master) => master ? Array.from({ length: (master.id % 5) + 3 }, (_, i) => ({
  id:      master.id * 100 + i + 1,
  seq:     i + 1,
  date:    `2025-${String(((master.id + i) % 12) + 1).padStart(2,'0')}-${String(((master.id * 2 + i) % 28) + 1).padStart(2,'0')}`,
  handler: ['김민준','이서연','박지호','최수아'][(master.id + i) % 4],
  action:  `[${master.category}] ${master.name} 처리 내용 ${i + 1}`,
  result:  ['정상','점검중','완료','이상'][(master.id + i) % 4],
})) : []

function MasterDetailGrid() {
  const [selected,    setSelected]    = useState(null)
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [drawerData,  setDrawerData]  = useState(null)

  const masterData = useMemo(() => ALL_DATA, [])
  const detailData = useMemo(() => makeSubData(selected), [selected])
  const masterCols = useMemo(() => COL_DEFS, [])

  const selectMaster = useCallback((row) => {
    setSelected(prev => {
      if (prev?.id !== row.id) {
        setDrawerOpen(false)
        setDrawerData(null)
      }
      return row
    })
  }, [])

  const openDrawer  = useCallback((row) => {
    if (drawerData?.id === row.id) {
      setDrawerOpen(o => !o)
    } else {
      setDrawerData({
        ...row,
        name:     row.handler,
        status:   row.result,
        priority: null,
      })
      setDrawerOpen(true)
    }
  }, [drawerData])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
    <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', minWidth:0 }}>

      {/* 상위 그리드 */}
      <div style={{ flex:'0 0 50%', display:'flex', flexDirection:'column', minHeight:0 }}>
        {/* 툴바 */}
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          height:38, padding:'0 14px', flexShrink:0,
          background:'var(--color-bg-secondary)',
          borderBottom:'1px solid var(--color-border)',
          boxSizing:'border-box',
        }}>
          <div style={{ width:3, height:14, borderRadius:2, background:'var(--color-accent)', flexShrink:0 }} />
          <span style={{ fontSize:13, fontWeight:600, color:'var(--color-text-primary)' }}>업무 목록</span>
          <span style={{ fontSize:11, color:'var(--color-text-muted)', background:'var(--color-bg-tertiary)', padding:'1px 7px', borderRadius:10, border:'1px solid var(--color-border)' }}>
            {masterData.length.toLocaleString()}건
          </span>
          {selected && (
            <span style={{ marginLeft:'auto', fontSize:11, color:'var(--color-accent)' }}>
              <strong>{selected.name}</strong>&nbsp;·&nbsp;{selected.category}&nbsp;·&nbsp;{selected.date}
            </span>
          )}
        </div>
        <div style={{ flex:1, overflow:'hidden' }}>
          <BasicGrid
            mode="paginate"
            rowData={masterData}
            colDefs={masterCols}
            onRowClick={selectMaster}
            height="100%"
            pageSize={10}
          />
        </div>
      </div>

      {/* 연결 구분선 */}
      <div style={{
        display:'flex', alignItems:'center', gap:0,
        height:28, flexShrink:0, position:'relative',
        background:'var(--color-bg-primary)',
        borderTop:'1px solid var(--color-border)',
        borderBottom:'1px solid var(--color-border)',
      }}>
        <div style={{ flex:1, height:1, background:'var(--color-border)' }} />
        <div style={{
          display:'flex', alignItems:'center', gap:5,
          padding:'0 12px', height:22,
          borderRadius:11,
          background:'var(--color-bg-tertiary)',
          border:'1px solid var(--color-border)',
          fontSize:11, color:'var(--color-text-muted)',
          whiteSpace:'nowrap',
        }}>
          <ChevronRight size={11} style={{ transform:'rotate(90deg)', flexShrink:0 }} />
          {selected ? `${selected.name} 처리 이력` : '행을 선택하면 하위 목록이 표시됩니다'}
        </div>
        <div style={{ flex:1, height:1, background:'var(--color-border)' }} />
      </div>

      {/* 하위 그리드 */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
        {/* 툴바 */}
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          height:38, padding:'0 14px', flexShrink:0,
          background:'var(--color-bg-secondary)',
          borderBottom:'1px solid var(--color-border)',
          boxSizing:'border-box',
        }}>
          <div style={{ width:3, height:14, borderRadius:2, background: selected ? 'var(--color-accent)' : 'var(--color-border)', flexShrink:0, transition:'background .2s' }} />
          <span style={{ fontSize:13, fontWeight:600, color:'var(--color-text-primary)' }}>처리 이력</span>
          {selected
            ? <span style={{ fontSize:11, color:'var(--color-text-muted)', background:'var(--color-bg-tertiary)', padding:'1px 7px', borderRadius:10, border:'1px solid var(--color-border)' }}>
                {detailData.length}건
              </span>
            : <span style={{ fontSize:11, color:'var(--color-text-muted)' }}>—</span>
          }
        </div>
        <div style={{ flex:1, overflow:'hidden' }}>
          <BasicGrid
            mode="paginate"
            rowData={detailData}
            colDefs={DETAIL_COL_DEFS}
            onRowClick={openDrawer}
            height="100%"
            pageSize={5}
            overlayNoRowsTemplate={
              !selected
                ? '<span style="color:var(--color-text-muted);font-size:13px">위 목록에서 행을 선택하세요</span>'
                : '<span style="color:var(--color-text-muted);font-size:13px">데이터가 없습니다</span>'
            }
          />
        </div>
      </div>

    </div>

      <GridDetailDrawer
        open={drawerOpen}
        data={drawerData}
        onClose={closeDrawer}
        defaultWidth={420}
      />

    </div>
  )
}

// ── GridFeature ───────────────────────────────────────────────────────────────
export default function GridFeature() {
  const [tab, setTab] = useState('paginate')
  const TABS = [
    { key:'paginate',      label:'페이징 그리드'      },
    { key:'infinite',      label:'무한 스크롤 그리드' },
    { key:'masterdetail',  label:'상하 분할 그리드'   },
  ]
  return (
    <div className="grid-wrap" style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div className="grid-tabs-header" style={{ display:'flex', borderBottom:'1px solid var(--color-border)', background:'var(--color-bg-secondary)', flexShrink:0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding:'10px 20px', fontSize:13, border:'none', cursor:'pointer', background:'transparent', transition:'all .15s', marginBottom:-1,
              fontWeight: tab===t.key ? 600 : 400,
              borderBottom: tab===t.key ? '2px solid var(--color-accent)' : '2px solid transparent',
              color: tab===t.key ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            }}
            onMouseEnter={e => { if (tab!==t.key) e.currentTarget.style.color='var(--color-text-primary)' }}
            onMouseLeave={e => { if (tab!==t.key) e.currentTarget.style.color='var(--color-text-secondary)' }}
          >{t.label}</button>
        ))}
      </div>
      <div className="grid-tabs-content" style={{ flex:1, overflow:'hidden' }}>
        {tab === 'paginate'     && <PaginateGrid />     }
        {tab === 'infinite'     && <InfiniteGrid />     }
        {tab === 'masterdetail' && <MasterDetailGrid /> }
      </div>
    </div>
  )
}
