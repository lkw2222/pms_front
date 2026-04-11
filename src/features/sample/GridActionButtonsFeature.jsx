import React, { useState } from 'react'
import GridActionButtons from '@/components/grid/GridActionButtons.jsx'
import { Star } from 'lucide-react'

const SAMPLE_ROW = { id: 1, name: '김민준', status: '정상', category: '설비' }

export default function GridActionButtonsFeature() {
  const [log, setLog] = useState('-')
  const emit = (msg) => setLog(msg)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* 기본 제공 타입 */}
      <div>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', fontWeight:600, marginBottom:10 }}>기본 제공 타입 (type)</div>
        <GridActionButtons
          data={SAMPLE_ROW}
          buttons={[
            { type:'detail',   onClick: d => emit(`상세보기: ${d.name}`) },
            { type:'edit',     onClick: d => emit(`수정: ${d.name}`) },
            { type:'delete',   onClick: d => emit(`삭제: ${d.name}`) },
            { type:'download', onClick: d => emit(`다운로드: ${d.name}`) },
            { type:'copy',     onClick: d => emit(`복사: ${d.name}`) },
            { type:'add',      onClick: d => emit(`추가: ${d.name}`) },
            { type:'confirm',  onClick: d => emit(`승인: ${d.name}`) },
            { type:'cancel',   onClick: d => emit(`반려: ${d.name}`) },
            { type:'run',      onClick: d => emit(`실행: ${d.name}`) },
          ]}
        />
      </div>

      {/* 커스텀 */}
      <div>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', fontWeight:600, marginBottom:10 }}>커스텀 (type: 'custom')</div>
        <GridActionButtons
          data={SAMPLE_ROW}
          buttons={[
            { type:'custom', label:'즐겨찾기', icon:Star, variant:'warning', onClick: d => emit(`즐겨찾기: ${d.name}`) },
            { type:'custom', label:'레이블변경', variant:'secondary',         onClick: d => emit(`레이블: ${d.name}`) },
          ]}
        />
      </div>

      {/* disabled / hidden 조건부 제어 */}
      <div>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', fontWeight:600, marginBottom:10 }}>조건부 disabled / hidden</div>
        <GridActionButtons
          data={SAMPLE_ROW}
          buttons={[
            { type:'edit',   disabled: d => d.status === '정상',    onClick: d => emit(`수정: ${d.name}`) },
            { type:'delete', hidden:   d => d.category === '설비',  onClick: d => emit(`삭제: ${d.name}`) },
            { type:'detail',                                         onClick: d => emit(`상세: ${d.name}`) },
          ]}
        />
        <div style={{ fontSize:11, color:'var(--color-text-muted)', marginTop:6 }}>
          status가 '정상'이면 수정 비활성 / category가 '설비'면 삭제 숨김
        </div>
      </div>

      {/* 조합 예시 (실제 그리드 사용 패턴) */}
      <div>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', fontWeight:600, marginBottom:10 }}>실제 사용 예시 (colDefs)</div>
        <pre style={{ fontSize:11, background:'var(--color-bg-tertiary)', padding:'12px 14px', borderRadius:'var(--radius-md)', color:'var(--color-text-secondary)', overflowX:'auto', lineHeight:1.7 }}>
{`import GridActionButtons from '@/components/grid/GridActionButtons.jsx'

const COL_DEFS = [
  // ...다른 컬럼들
  {
    headerName: '액션',
    width: 160,
    flex: 0,
    sortable: false,
    filter: false,
    cellRenderer: ({ data }) => (
      <GridActionButtons
        data={data}
        buttons={[
          { type: 'detail', onClick: handleDetail },
          { type: 'edit',   onClick: handleEdit   },
          { type: 'delete', onClick: handleDelete },
        ]}
      />
    ),
  },
]`}
        </pre>
      </div>

      {/* 클릭 로그 */}
      <div style={{ fontSize:12, padding:'8px 12px', background:'var(--color-bg-tertiary)', borderRadius:'var(--radius-md)', color:'var(--color-accent)' }}>
        클릭 결과: <strong>{log}</strong>
      </div>

    </div>
  )
}
