import React, { useState, useCallback } from 'react'
import BasicGrid        from '@/components/grid/BasicGrid.jsx'
import GridDetailDrawer from '@/components/grid/GridDetailDrawer.jsx'
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

const COL_DEFS = [
  { field:'id',       headerName:'No',     width:55,  flex:0 },
  { field:'name',     headerName:'담당자', width:85,  flex:0 },
  { field:'category', headerName:'분류',   width:75,  flex:0 },
  {
    field:'status', headerName:'상태', width:85, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] ?? 'default'} />,
  },
  {
    field:'priority', headerName:'우선순위', width:90, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={PRIORITY_VARIANT[value] ?? 'default'} />,
  },
  { field:'date',   headerName:'등록일', width:105, flex:0 },
  { field:'remark', headerName:'비고',   flex:1,   minWidth:80 },
]

export default function GridDetailDrawerFeature() {
  const [open,     setOpen]     = useState(false)
  const [selected, setSelected] = useState(null)

  const onRowClick = useCallback((row) => {
    if (selected?.id === row.id) {
      setOpen(o => !o)
    } else {
      setSelected(row)
      setOpen(true)
    }
  }, [selected])

  const onClose = useCallback(() => setOpen(false), [])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

      <div style={{ fontSize:12, color:'var(--color-text-muted)', lineHeight:1.7 }}>
        💡 행을 클릭하면 우측에 상세 드로어가 열립니다. 같은 행을 다시 클릭하면 닫힙니다.<br />
        드로어 왼쪽 경계를 드래그하면 너비를 조절할 수 있습니다.
      </div>

      <div style={{ display:'flex', height:340, overflow:'hidden', border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)' }}>
        <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
          <BasicGrid
            mode="none"
            rowData={SAMPLE_ROWS}
            colDefs={COL_DEFS}
            onRowClick={onRowClick}
            height="100%"
          />
        </div>
        <GridDetailDrawer
          open={open}
          data={selected}
          onClose={onClose}
          defaultWidth={420}
          columns={2}
        />
      </div>

    </div>
  )
}
