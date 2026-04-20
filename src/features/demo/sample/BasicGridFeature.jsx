import React, { useState, useMemo, useCallback } from 'react'
import BasicGrid            from '@/components/grid/BasicGrid.jsx'
import BasicLabel           from '@/components/label/BasicLabel.jsx'
import BasicButton          from '@/components/button/BasicButton.jsx'
import GridActionButtons    from '@/components/grid/GridActionButtons.jsx'
import GridDetailModal      from '@/components/grid/GridDetailModal.jsx'
import WindPressureFeature  from '@/features/demo/windPressure/WindPressureFeature.jsx'
import { LoaderCircle } from 'lucide-react'

const SAMPLE_DATA = Array.from({ length: 30 }, (_, i) => ({
  id:       i + 1,
  name:     ['김민준','이서연','박지호','최수아','정도윤'][i % 5],
  category: ['설비','전기','통신','토목'][i % 4],
  status:   ['정상','점검중','이상','완료'][i % 4],
  date:     `2025-${String((i % 12) + 1).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
}))

const STATUS_VARIANT = { 정상:'success', 점검중:'warning', 이상:'danger', 완료:'info' }

const COL_DEFS = [
  { field:'id',       headerName:'No',     width:60,  flex:0 },
  { field:'name',     headerName:'담당자', width:90,  flex:0 },
  { field:'category', headerName:'분류',   width:80,  flex:0 },
  {
    field:'status', headerName:'상태', width:90, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] || 'default'} />,
  },
  { field:'date', headerName:'등록일', flex:1 },
]

const INFINITE_DATASOURCE = {
  getRows: (params) => {
    setTimeout(() => {
      const rows = SAMPLE_DATA.slice(params.startRow, params.endRow)
      params.successCallback(rows, SAMPLE_DATA.length)
    }, 300)
  },
}

function DemoBox({ label, children }) {
  return (
    <div style={{
      border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)',
      overflow:'hidden', marginBottom:16,
    }}>
      <div style={{
        padding:'6px 12px', background:'var(--color-bg-tertiary)',
        borderBottom:'1px solid var(--color-border)',
        fontSize:11, fontWeight:600, color:'var(--color-text-muted)',
      }}>{label}</div>
      <div style={{ height:220 }}>{children}</div>
    </div>
  )
}

export default function BasicGridFeature() {
  const [clicked,   setClicked]   = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalRow,  setModalRow]  = useState(null)

  const openModal = useCallback((row) => { setModalRow(row); setModalOpen(true) }, [])

  const INFINITE_COL_DEFS = useMemo(() => [
    ...COL_DEFS,
    {
      headerName: '액션', width: 80, flex: 0, sortable: false, filter: false,
      cellRenderer: ({ data }) => data
        ? <GridActionButtons data={data} buttons={[{ type:'detail', onClick: openModal }]} />
        : null,
    },
  ], [openModal])

  return (
    <div>
      {clicked && (
        <div style={{
          marginBottom:10, padding:'6px 12px', borderRadius:'var(--radius-md)',
          background:'var(--color-bg-tertiary)', border:'1px solid var(--color-border)',
          fontSize:12, color:'var(--color-text-secondary)',
        }}>
          onRowClick → <strong style={{ color:'var(--color-accent)' }}>{clicked.name}</strong> ({clicked.category} / {clicked.status})
        </div>
      )}

      <DemoBox label="mode=&quot;paginate&quot; — 페이지네이션 / loading prop 토글">
        <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
          <div style={{ padding:'4px 8px', borderBottom:'1px solid var(--color-border)', flexShrink:0 }}>
            <BasicButton
              label={loading ? '로딩 끄기' : '로딩 켜기'}
              icon={LoaderCircle}
              variant={loading ? 'warning' : 'secondary'}
              size="sm"
              onClick={() => setLoading(v => !v)}
            />
          </div>
          <div style={{ flex:1, overflow:'hidden' }}>
            <BasicGrid
              mode="paginate"
              rowData={SAMPLE_DATA}
              colDefs={COL_DEFS}
              onRowClick={setClicked}
              height="100%"
              pageSize={5}
              loading={loading}
            />
          </div>
        </div>
      </DemoBox>

      <DemoBox label="mode=&quot;infinite&quot; — 무한 스크롤 (datasource 필요) · 액션 버튼으로 상세 모달">
        <BasicGrid
          mode="infinite"
          datasource={INFINITE_DATASOURCE}
          colDefs={INFINITE_COL_DEFS}
          onRowClick={setClicked}
          height="100%"
          cacheBlockSize={10}
        />
      </DemoBox>

      <GridDetailModal
        open={modalOpen}
        title={modalRow ? `상세 정보 — ${modalRow.name} (${modalRow.category})` : '상세 정보'}
        onClose={() => setModalOpen(false)}
      >
        <WindPressureFeature />
      </GridDetailModal>

      <DemoBox label="mode=&quot;none&quot; — 페이징/스크롤 없음 (소량 데이터)">
        <BasicGrid
          mode="none"
          rowData={SAMPLE_DATA.slice(0, 5)}
          colDefs={COL_DEFS}
          onRowClick={setClicked}
          height="100%"
        />
      </DemoBox>
    </div>
  )
}
