import React, { useState, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import BasicGrid   from '@/components/grid/BasicGrid.jsx'
import TextInput   from '@/components/input/TextInput.jsx'
import SelectInput from '@/components/input/SelectInput.jsx'
import DateInput   from '@/components/input/DateInput.jsx'
import BasicButton from '@/components/button/BasicButton.jsx'
import BasicLabel  from '@/components/label/BasicLabel.jsx'
import { Search, RotateCcw, Download, Loader2 } from 'lucide-react'

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
  { field:'name',     headerName:'담당자', width:100, flex:0 },
  { field:'category', headerName:'분류',   width:90,  flex:0 },
  {
    field:'status', headerName:'상태', width:100, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] || 'default'} />,
  },
  {
    field:'priority', headerName:'우선순위', width:100, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={PRIORITY_VARIANT[value] || 'default'} />,
  },
  { field:'date',   headerName:'등록일', width:110, flex:0 },
  { field:'remark', headerName:'비고',   flex:1 },
]

// ── 검색 폼 ──────────────────────────────────────────────────────────────────
function SearchForm({ search, setSearch, onSearch, onReset, totalCount, isLoading }) {
  return (
    <div className="panel-toolbar" style={{ flexDirection:'column', alignItems:'flex-start', gap:10 }}>
      <div style={{ display:'grid', gridTemplateColumns:'140px 120px 120px 160px 160px', gap:10, alignItems:'end' }}>
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
          onChange={v => setSearch(s => ({ ...s, dateFrom: v }))}
        />
        <DateInput
          label="등록일(종료)" value={search.dateTo}
          onChange={v => setSearch(s => ({ ...s, dateTo: v }))}
        />
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <BasicButton label="조회"   icon={isLoading ? Loader2 : Search} variant="primary"   onClick={onSearch} disabled={isLoading} />
        <BasicButton label="초기화" icon={RotateCcw}                    variant="secondary" onClick={onReset} />
        <BasicButton label="엑셀"   icon={Download}                     variant="ghost"
          onClick={() => {
            // import { workApi } from '@/services/grid/gridService.js'
            // gridApi.downloadExcel(search)
            alert('엑셀 다운로드')
          }}
        />
        <span style={{ fontSize:12, color:'var(--color-text-muted)', marginLeft:4 }}>
          {isLoading
            ? <span style={{ color:'var(--color-accent)' }}>조회 중...</span>
            : <>총 <strong style={{ color:'var(--color-accent)' }}>{totalCount.toLocaleString()}</strong>건</>
          }
        </span>
      </div>
    </div>
  )
}

// ── 페이징 그리드 (useQuery 적용) ─────────────────────────────────────────────
function PaginateGrid() {
  const INIT = { name:'', category:'', status:'', dateFrom:'', dateTo:'' }
  const [search,   setSearch]   = useState(INIT)
  const [applied,  setApplied]  = useState(INIT)
  const [selected, setSelected] = useState(null)

  // ── TanStack Query - 서버 상태 관리 ────────────────────────────────────
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['work', 'list', applied],   // applied 가 바뀌면 자동 재조회
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

  const onSearch = () => setApplied({ ...search })
  const onReset  = () => { setSearch(INIT); setApplied(INIT) }

  if (isError) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', flexDirection:'column', gap:8 }}>
      <span style={{ color:'var(--color-danger)', fontSize:14 }}>⚠ 조회 실패</span>
      <span style={{ color:'var(--color-text-muted)', fontSize:12 }}>{error?.message}</span>
    </div>
  )

  return (
    <div className="panel-container">
      <SearchForm
        search={search} setSearch={setSearch}
        onSearch={onSearch} onReset={onReset}
        totalCount={data?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <div style={{ flex:1, overflow:'hidden' }}>
        <BasicGrid
          mode="paginate"
          rowData={data?.list ?? []}
          colDefs={COL_DEFS}
          onRowClick={setSelected}
          height="100%"
          pageSize={20}
        />
      </div>
      {selected && (
        <div style={{ padding:'8px 16px', borderTop:'1px solid var(--color-border)', fontSize:12, color:'var(--color-text-muted)', display:'flex', gap:16, flexShrink:0 }}>
          <span>선택: <strong style={{ color:'var(--color-text-primary)' }}>{selected.name}</strong></span>
          <span>분류: {selected.category}</span>
          <span>상태: <BasicLabel text={selected.status} variant={STATUS_VARIANT[selected.status]} /></span>
          <span>우선순위: <BasicLabel text={selected.priority} variant={PRIORITY_VARIANT[selected.priority]} /></span>
        </div>
      )}
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

// ── GridFeature ───────────────────────────────────────────────────────────────
export default function GridFeature() {
  const [tab, setTab] = useState('paginate')
  const TABS = [
    { key:'paginate', label:'페이징 그리드'      },
    { key:'infinite', label:'무한 스크롤 그리드' },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ display:'flex', borderBottom:'1px solid var(--color-border)', background:'var(--color-bg-secondary)', flexShrink:0 }}>
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
      <div style={{ flex:1, overflow:'hidden' }}>
        {tab === 'paginate' ? <PaginateGrid /> : <InfiniteGrid />}
      </div>
    </div>
  )
}
