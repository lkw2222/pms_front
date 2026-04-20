import React, { useState, useCallback, useMemo } from 'react'
import BasicGrid         from '@/components/grid/BasicGrid.jsx'
import GridDetailModal   from '@/components/grid/GridDetailModal.jsx'
import GridActionButtons from '@/components/grid/GridActionButtons.jsx'
import BasicLabel        from '@/components/label/BasicLabel.jsx'

const SAMPLE_ROWS = [
  { id:1, name:'김민준', category:'설비', status:'정상',  priority:'높음', date:'2025-01-15', remark:'정기 점검 완료' },
  { id:2, name:'이서연', category:'전기', status:'점검중', priority:'중간', date:'2025-02-20', remark:'누전 차단기 교체 중' },
  { id:3, name:'박지호', category:'통신', status:'이상',  priority:'높음', date:'2025-03-05', remark:'신호 불안정 확인 필요' },
  { id:4, name:'최수아', category:'토목', status:'완료',  priority:'낮음', date:'2025-03-22', remark:'균열 보수 완료' },
  { id:5, name:'정도윤', category:'설비', status:'정상',  priority:'중간', date:'2025-04-10', remark:'윤활유 보충' },
]

const STATUS_VARIANT   = { 정상:'success', 점검중:'warning', 이상:'danger', 완료:'info' }
const PRIORITY_VARIANT = { 높음:'danger', 중간:'warning', 낮음:'default' }

// ── pk 기반 상세 컴포넌트 (실제 프로젝트에서는 useQuery로 API 조회) ──────────
function SampleDetailPane({ pk }) {
  // 실제: const { data } = useQuery({ queryKey: ['sample', pk], queryFn: () => api.getDetail(pk), enabled: !!pk })
  const data = useMemo(() => pk ? SAMPLE_ROWS.find(r => r.id === pk.id) ?? null : null, [pk])

  if (!pk || !data) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--color-text-muted)', fontSize:13 }}>
      데이터를 찾을 수 없습니다
    </div>
  )

  const fields = [
    ['No.',      data.id],
    ['담당자',   data.name],
    ['분류',     data.category],
    ['등록일',   data.date],
    ['비고',     data.remark],
  ]

  return (
    <div style={{ padding:24 }}>
      {/* 상태 뱃지 */}
      <div style={{ display:'flex', gap:6, marginBottom:20, paddingBottom:16, borderBottom:'1px solid var(--color-border)' }}>
        <BasicLabel text={data.status}   variant={STATUS_VARIANT[data.status]     ?? 'default'} />
        <BasicLabel text={data.priority} variant={PRIORITY_VARIANT[data.priority] ?? 'default'} />
      </div>
      {/* 2열 필드 그리드 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
        {fields.map(([label, value]) => (
          <div key={label}
            style={{ padding:'10px 12px', fontSize:13, borderBottom:'1px solid var(--color-border)', transition:'background .12s' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <div style={{ color:'var(--color-text-muted)', fontWeight:500, fontSize:11, marginBottom:3 }}>{label}</div>
            <div style={{ color:'var(--color-text-primary)' }}>{value ?? '-'}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:24, padding:16, borderRadius:'var(--radius-md)', background:'var(--color-bg-tertiary)', border:'1px solid var(--color-border)', fontSize:12, color:'var(--color-text-muted)', lineHeight:1.7 }}>
        💡 실제 개발 시 이 영역에 <code style={{ color:'var(--color-accent)' }}>useQuery</code>로 pk 기반 상세 데이터를 조회하거나,
        탭·폼·차트 등 원하는 컴포넌트를 자유롭게 배치할 수 있습니다.
      </div>
    </div>
  )
}

export default function GridDetailModalFeature() {
  const [open,        setOpen]       = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)   // title + pk 기준

  const openModal = useCallback((row) => { setSelectedRow(row); setOpen(true)  }, [])
  const onClose   = useCallback(()    => setOpen(false), [])

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
        <GridActionButtons data={data} buttons={[{ type:'detail', onClick: openModal }]} />
      ),
    },
  ], [openModal])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

      <div style={{ fontSize:12, color:'var(--color-text-muted)', lineHeight:1.7 }}>
        💡 상세 버튼을 클릭하면 중앙 모달이 열립니다. ESC 키 또는 바깥 영역 클릭으로도 닫을 수 있습니다.<br />
        모달 <strong>우측 엣지 · 하단 엣지 · 우하단 코너</strong>를 드래그해 크기를 조절할 수 있습니다.<br />
        <code style={{ color:'var(--color-accent)', background:'var(--color-bg-tertiary)', padding:'1px 5px', borderRadius:3 }}>children</code>에
        &nbsp;<code style={{ color:'var(--color-accent)', background:'var(--color-bg-tertiary)', padding:'1px 5px', borderRadius:3 }}>pk</code>를
        전달하면 내부에서 API 조회 후 자유롭게 렌더링할 수 있습니다.
      </div>

      <div style={{ height:240, border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
        <BasicGrid
          mode="none"
          rowData={SAMPLE_ROWS}
          colDefs={colDefs}
          height="100%"
        />
      </div>

      {/* children에 pk 기반 상세 컴포넌트 주입 */}
      <GridDetailModal
        open={open}
        title={selectedRow ? `${selectedRow.name} — 상세 정보` : '상세 정보'}
        onClose={onClose}
        width="640px"
        height="70vh"
      >
        <SampleDetailPane pk={selectedRow ? { id: selectedRow.id } : null} />
      </GridDetailModal>

    </div>
  )
}
