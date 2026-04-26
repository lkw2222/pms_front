import React, { useState, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

const MIN_WIDTH  = 300
const MAX_WIDTH  = 800
const TRANSITION = 'width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)'

/**
 * 그리드 우측 슬라이드 패널. children 에 pk 기반 상세 컴포넌트를 주입하며
 * 드래그 리사이즈(300~800px) 지원
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}    props
 * @param {boolean}   props.open                   열림 여부
 * @param {string}    [props.title='상세 정보']      헤더 제목
 * @param {function}  [props.onClose]              닫기 핸들러
 * @param {ReactNode} [props.children]             내용 — pk 기반 상세 컴포넌트를 주입
 * @param {number}    [props.defaultWidth=420]     초기 너비 (px)
 * @returns {JSX.Element}
 *
 * @example
 * // 단순 PK
 * <GridDetailDrawer open={open} title="업무 상세" onClose={() => setOpen(false)}>
 *   <WorkDetail pk={{ id: selectedRow?.id }} />
 * </GridDetailDrawer>
 *
 * // 복합 PK
 * <GridDetailDrawer open={open} title="처리 이력" onClose={() => setOpen(false)}>
 *   <HistoryDetail pk={{ masterId: selectedRow?.masterId, subId: selectedRow?.id }} />
 * </GridDetailDrawer>
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function GridDetailDrawer({
  open,
  title    = '상세 정보',
  onClose,
  children,
  defaultWidth = 420,
}) {
  const [width, setWidth]         = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef(null)

  const onMouseDown = useCallback((e) => {
    const startX = e.clientX
    const startW = panelRef.current ? panelRef.current.offsetWidth : width

    // transition 을 React state 로 제어 — 직접 DOM 뮤테이션 시 React 가 복원을 건너뛰는 문제 방지
    setIsResizing(true)

    const onMove = (mv) => {
      const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startW + (startX - mv.clientX)))
      if (panelRef.current) {
        panelRef.current.style.width    = `${newW}px`
        panelRef.current.style.minWidth = `${newW}px`
      }
    }
    const onUp = (up) => {
      const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startW + (startX - up.clientX)))
      setWidth(newW)        // state 동기화 (React 18 배치: isResizing=false 와 한 번에 렌더)
      setIsResizing(false)  // transition 복원 — React 가 'none' → TRANSITION 으로 정상 패치
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
            width:5, cursor:'col-resize', background:'transparent',
            flexShrink:0, transition:'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        />
      )}

      {/* 패널 본체 */}
      <div ref={panelRef} style={{
        width:         open ? width : 0,
        minWidth:      open ? width : 0,
        overflow:      'hidden',
        transition:    isResizing ? 'none' : TRANSITION,
        borderLeft:    open ? '1px solid var(--color-border)' : 'none',
        background:    'var(--color-bg-secondary)',
        display:       'flex',
        flexDirection: 'column',
      }}>

        {/* 헤더 — 그리드 컬럼 헤더(38px)와 높이 통일 */}
        <div style={{
          height:38, padding:'0 16px', boxSizing:'border-box',
          borderBottom:'1px solid var(--color-border)', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <span style={{
            fontSize:13, fontWeight:700, color:'var(--color-text-primary)',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              width:26, height:26, border:'1px solid transparent', borderRadius:'var(--radius-md)',
              background:'transparent', cursor:'pointer', color:'var(--color-text-muted)', transition:'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--color-bg-hover)'; e.currentTarget.style.borderColor='var(--color-border)' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* 내용 — children 주입 영역 */}
        <div style={{ flex:1, overflow:'auto' }}>
          {children}
        </div>

      </div>
    </div>
  )
}
