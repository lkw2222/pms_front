import React, { useState, useRef, useCallback, useEffect } from 'react'
import { X } from 'lucide-react'
import BasicLabel  from '@/components/label/BasicLabel.jsx'
import GisFeature  from '@/features/gis/GisFeature.jsx'

const STATUS_VARIANT   = { 정상:'success', 점검중:'warning', 이상:'danger', 완료:'info' }
const PRIORITY_VARIANT = { 높음:'danger', 중간:'warning', 낮음:'default' }

const TABS = [
  { key:'info',    label:'기본 정보' },
  { key:'history', label:'처리 이력' },
  { key:'file',    label:'첨부 파일' },
  { key:'map',     label:'지도'      },
]

const MIN_WIDTH = 300
const MAX_WIDTH = 700

/**
 * GridDetailDrawer
 * 그리드 우측 고정형 상세 드로어 (드래그 리사이즈 지원)
 *
 * @param {boolean}  open         - 패널 열림 여부
 * @param {object}   data         - 선택된 로우 데이터
 * @param {function} onClose      - 닫기 핸들러
 * @param {number}   defaultWidth - 초기 너비 (기본 420px)
 * @param {number}   columns      - 기본정보 탭 열 수 1 | 2 | 3 (기본 1)
 */
export default function GridDetailDrawer({ open, data, onClose, defaultWidth = 420, columns = 1 }) {
  const [tab,   setTab]   = useState('info')
  const [width, setWidth] = useState(defaultWidth)

  // 지도 탭으로 전환 시 OpenLayers updateSize 트리거
  useEffect(() => {
    if (tab === 'map') {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50)
    }
  }, [tab])
  const dragging = useRef(false)
  const startX   = useRef(0)
  const startW   = useRef(0)

  const onMouseDown = useCallback((e) => {
    dragging.current = true
    startX.current   = e.clientX
    startW.current   = width

    const onMove = (e) => {
      if (!dragging.current) return
      const delta = startX.current - e.clientX
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startW.current + delta)))
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
  }, [width])

  return (
    <div style={{ display:'flex', flexShrink:0 }}>

      {/* 리사이즈 핸들 */}
      {open && (
        <div
          onMouseDown={onMouseDown}
          style={{
            width:      5,
            cursor:     'col-resize',
            background: 'transparent',
            flexShrink: 0,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        />
      )}

      {/* 패널 본체 */}
      <div style={{
        width:         open ? width : 0,
        minWidth:      open ? width : 0,
        overflow:      'hidden',
        transition:    dragging.current ? 'none' : 'width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)',
        borderLeft:    open ? '1px solid var(--color-border)' : 'none',
        background:    'var(--color-bg-secondary)',
        display:       'flex',
        flexDirection: 'column',
      }}>

        {/* 헤더 요약 — 그리드 컬럼 헤더(38px)와 높이 통일 */}
        <div style={{ height:38, padding:'0 16px', boxSizing:'border-box', borderBottom:'1px solid var(--color-border)', flexShrink:0, display:'flex', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:6, width:'100%' }}>
            {/* 이름 + 뱃지 + 날짜 한 줄 */}
            <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0, flexWrap:'wrap' }}>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--color-text-primary)', flexShrink:0 }}>
                {data ? data.name : '상세 정보'}
              </span>
              {data && (
                <>
                  <BasicLabel text={data.status}   variant={STATUS_VARIANT[data.status]     ?? 'default'} />
                  <BasicLabel text={data.priority} variant={PRIORITY_VARIANT[data.priority] ?? 'default'} />
                  <span style={{ fontSize:11, color:'var(--color-text-muted)' }}>{data.date}</span>
                </>
              )}
            </div>
            <button onClick={onClose} style={{
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              width:26, height:26, border:'1px solid transparent', borderRadius:'var(--radius-md)',
              background:'transparent', cursor:'pointer', color:'var(--color-text-muted)', transition:'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--color-bg-tertiary)'; e.currentTarget.style.borderColor='var(--color-border)' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div style={{ display:'flex', borderBottom:'1px solid var(--color-border)', flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, padding:'8px 4px', fontSize:12, border:'none', cursor:'pointer',
              background:'transparent', transition:'all .15s', marginBottom:-1,
              fontWeight:   tab===t.key ? 600 : 400,
              borderBottom: tab===t.key ? '2px solid var(--color-accent)' : '2px solid transparent',
              color:        tab===t.key ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            }}
              onMouseEnter={e => { if (tab!==t.key) e.currentTarget.style.color='var(--color-text-primary)' }}
              onMouseLeave={e => { if (tab!==t.key) e.currentTarget.style.color='var(--color-text-secondary)' }}
            >{t.label}</button>
          ))}
        </div>

        {/* 탭 내용 */}
        <div style={{ flex:1, overflow:'hidden', position:'relative' }}>
          {!data ? (
            <div style={{ padding:'14px' }}><Empty text="로우를 선택하세요" /></div>
          ) : (
            <>
              {/* 지도 탭은 display로 숨김/표시 (unmount 시 지도 초기화 방지) */}
              <div style={{ display: tab === 'map' ? 'block' : 'none', height:'100%' }}>
                <GisFeature />
              </div>

              {tab !== 'map' && (
                <div style={{ padding:'14px', height:'100%', overflowY:'auto', boxSizing:'border-box' }}>
                  {tab === 'info'    && <InfoTab    data={data} columns={columns} />}
                  {tab === 'history' && <HistoryTab data={data} />}
                  {tab === 'file'    && <Empty text="첨부 파일이 없습니다." />}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}

// ── 기본 정보 탭 ──────────────────────────────────────────────────────────────
function InfoTab({ data, columns = 1 }) {
  const rows = [
    ['No.',      data.id],
    ['담당자',   data.name],
    ['분류',     data.category],
    ['상태',     data.status],
    ['우선순위', data.priority],
    ['등록일',   data.date],
    ['비고',     data.remark],
  ]

  // 열 수에 따라 rows를 묶음으로 나눔
  // columns=1 → [[row], [row], ...]
  // columns=2 → [[row, row], [row, row], ...]
  const grouped = []
  for (let i = 0; i < rows.length; i += columns) {
    grouped.push(rows.slice(i, i + columns))
  }

  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      {grouped.map((group, gi) => (
        <div key={gi}
          style={{
            display:      'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            borderBottom: '1px solid var(--color-border)',
            transition:   'background 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          {group.map(([label, value]) => (
            <div key={label} style={{ display:'grid', gridTemplateColumns:'80px 1fr', padding:'9px 12px', fontSize:13, gap:8 }}>
              <span style={{ color:'var(--color-text-muted)', fontWeight:500, fontSize:12 }}>{label}</span>
              <span style={{ color:'var(--color-text-primary)' }}>{value ?? '-'}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ── 처리 이력 탭 ──────────────────────────────────────────────────────────────
function HistoryTab({ data }) {
  const history = [
    { date:'2025-03-01', user:'관리자',  action:'등록',    desc:'업무 최초 등록' },
    { date:'2025-03-05', user:data.name, action:'수정',    desc:'상태 변경: 정상 → 점검중' },
    { date:'2025-03-10', user:'김관리',  action:'완료처리', desc:'점검 완료 확인' },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
      {history.map((h, i) => (
        <div key={i} style={{ padding:'10px', borderRadius:'var(--radius-md)', fontSize:12, borderLeft:'2px solid var(--color-border)', marginBottom:4, background:'var(--color-bg-primary)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <BasicLabel text={h.action} variant='info' />
            <span style={{ color:'var(--color-text-muted)' }}>{h.date}</span>
            <span style={{ color:'var(--color-text-secondary)' }}>{h.user}</span>
          </div>
          <div style={{ color:'var(--color-text-primary)' }}>{h.desc}</div>
        </div>
      ))}
    </div>
  )
}

// ── 빈 상태 ───────────────────────────────────────────────────────────────────
function Empty({ text }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:100, color:'var(--color-text-muted)', fontSize:12, border:'1px dashed var(--color-border)', borderRadius:'var(--radius-md)' }}>
      {text}
    </div>
  )
}
