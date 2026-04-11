import React, { useRef, useCallback, useState } from 'react'
import { X } from 'lucide-react'

const MIN_WIDTH = 400
const MAX_WIDTH = 900

/**
 * FormDrawer
 * 등록 / 수정 전용 우측 고정형 드로어 (드래그 리사이즈 지원)
 *
 * @param {boolean}   open         - 열림 여부
 * @param {string}    title        - 헤더 제목
 * @param {function}  onClose      - 닫기 핸들러
 * @param {ReactNode} footer       - 하단 버튼 영역 (저장/취소 등)
 * @param {ReactNode} children     - 폼 내용
 * @param {number}    defaultWidth - 초기 너비 (기본 600px)
 */
export default function FormDrawer({ open, title, onClose, footer, children, defaultWidth = 600 }) {
  const [width, setWidth] = useState(defaultWidth)
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
          style={{ width:5, cursor:'col-resize', background:'transparent', flexShrink:0, transition:'background 0.15s' }}
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

        {/* 헤더 */}
        <div style={{
          height:38, padding:'0 16px', boxSizing:'border-box',
          borderBottom:'1px solid var(--color-border)', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <span style={{ fontSize:13, fontWeight:700, color:'var(--color-text-primary)' }}>{title}</span>
          <button onClick={onClose} style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            width:26, height:26, border:'1px solid transparent', borderRadius:'var(--radius-md)',
            background:'transparent', cursor:'pointer', color:'var(--color-text-muted)', transition:'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--color-bg-tertiary)'; e.currentTarget.style.borderColor='var(--color-border)' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* 내용 */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px', boxSizing:'border-box' }}>
          {children}
        </div>

        {/* 푸터 */}
        {footer && (
          <div style={{
            borderTop:'1px solid var(--color-border)', padding:'10px 16px',
            display:'flex', justifyContent:'flex-end', gap:8, flexShrink:0,
          }}>
            {footer}
          </div>
        )}

      </div>
    </div>
  )
}
