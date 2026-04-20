import React, { useState, useCallback, useMemo } from 'react'
import BasicGrid        from '@/components/grid/BasicGrid.jsx'
import GridDetailDrawer from '@/components/grid/GridDetailDrawer.jsx'
import GridActionButtons from '@/components/grid/GridActionButtons.jsx'
import BasicLabel       from '@/components/label/BasicLabel.jsx'

const SAMPLE_ROWS = [
  { id:1, name:'김민준', category:'설비', status:'정상',  priority:'높음', date:'2025-01-15', remark:'정기 점검 완료' },
  { id:2, name:'이서연', category:'전기', status:'점검중', priority:'중간', date:'2025-02-20', remark:'누전 차단기 교체 중' },
  { id:3, name:'박지호', category:'통신', status:'이상',  priority:'높음', date:'2025-03-05', remark:'신호 불안정 확인 필요' },
  { id:4, name:'최수아', category:'토목', status:'완료',  priority:'낮음', date:'2025-03-22', remark:'균열 보수 완료' },
  { id:5, name:'정도윤', category:'설비', status:'정상',  priority:'중간', date:'2025-04-10', remark:'윤활유 보충' },
]

const STATUS_VARIANT   = { 정상:'success', 점검중:'warning', 이상:'danger', 완료:'info' }
const PRIORITY_VARIANT = { 높음:'danger', 중간:'warning', 낮음:'default' }

// ── pk 기반 상세 패널 (실제 프로젝트에서는 useQuery로 API 조회) ─────────────
function SampleDetailPane({ pk }) {
  // 실제: const { data } = useQuery({ queryKey: ['sample', pk], queryFn: () => api.getDetail(pk), enabled: !!pk })
  const data = useMemo(() => pk ? SAMPLE_ROWS.find(r => r.id === pk.id) ?? null : null, [pk])

  if (!pk) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--color-text-muted)', fontSize:13 }}>
      로우를 선택하세요
    </div>
  )
  if (!data) return null

  const fields = [
    ['No.',      data.id],
    ['담당자',   data.name],
    ['분류',     data.category],
    ['등록일',   data.date],
    ['비고',     data.remark],
  ]

  return (
    <div style={{ padding:14 }}>
      {/* 상태 뱃지 */}
      <div style={{ display:'flex', gap:6, marginBottom:14, paddingBottom:12, borderBottom:'1px solid var(--color-border)' }}>
        <BasicLabel text={data.status}   variant={STATUS_VARIANT[data.status]     ?? 'default'} />
        <BasicLabel text={data.priority} variant={PRIORITY_VARIANT[data.priority] ?? 'default'} />
      </div>
      {/* 필드 목록 */}
      {fields.map(([label, value]) => (
        <div key={label}
          style={{ display:'grid', gridTemplateColumns:'72px 1fr', padding:'8px 10px', fontSize:13, gap:8, borderBottom:'1px solid var(--color-border)', transition:'background .12s' }}
          onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          <span style={{ color:'var(--color-text-muted)', fontWeight:500, fontSize:12 }}>{label}</span>
          <span style={{ color:'var(--color-text-primary)' }}>{value ?? '-'}</span>
        </div>
      ))}
    </div>
  )
}

export default function GridDetailDrawerFeature() {
  const [open,       setOpen]       = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)   // title + pk 기준

  const openDrawer = useCallback((row) => {
    if (selectedRow?.id === row.id) { setOpen(o => !o) }
    else { setSelectedRow(row); setOpen(true) }
  }, [selectedRow])

  const onClose = useCallback(() => setOpen(false), [])

  const colDefs = useMemo(() => [
    { field:'id',       headerName:'No',     width:55,  flex:0 },
    { field:'name',     headerName:'담당자', width:85,  flex:0 },
    { field:'category', headerName:'분류',   width:75,  flex:0 },
    {
      field:'status', headerName:'상태', width:85, flex:0,
      cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] ?? 'default'} />,
    },
    { field:'date',   headerName:'등록일', width:105, flex:0 },
    { field:'remark', headerName:'비고',   flex:1,   minWidth:80 },
    {
      headerName:'액션', width:80, flex:0, sortable:false, filter:false,
      cellRenderer: ({ data }) => (
        <GridActionButtons data={data} buttons={[{ type:'detail', onClick: openDrawer }]} />
      ),
    },
  ], [openDrawer])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

      <div style={{ fontSize:12, color:'var(--color-text-muted)', lineHeight:1.7 }}>
        💡 행 클릭 또는 상세 버튼으로 우측 드로어가 열립니다. 같은 행을 다시 클릭하면 닫힙니다.<br />
        드로어 왼쪽 경계를 드래그해 너비를 조절할 수 있습니다 (300 ~ 800px).<br />
        <code style={{ color:'var(--color-accent)', background:'var(--color-bg-tertiary)', padding:'1px 5px', borderRadius:3 }}>children</code>에
        &nbsp;<code style={{ color:'var(--color-accent)', background:'var(--color-bg-tertiary)', padding:'1px 5px', borderRadius:3 }}>pk</code>를
        전달하면 내부에서 API 조회 후 자유롭게 렌더링할 수 있습니다.
      </div>

      <div style={{ display:'flex', height:280, overflow:'hidden', border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)' }}>
        <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
          <BasicGrid
            mode="none"
            rowData={SAMPLE_ROWS}
            colDefs={colDefs}
            onRowClick={openDrawer}
            height="100%"
          />
        </div>

        {/* children에 pk 기반 상세 컴포넌트 주입 */}
        <GridDetailDrawer
          open={open}
          title={selectedRow ? `${selectedRow.name} — 상세` : '상세 정보'}
          onClose={onClose}
          defaultWidth={320}
        >
          <SampleDetailPane pk={selectedRow ? { id: selectedRow.id } : null} />
        </GridDetailDrawer>
      </div>

    </div>
  )
}
