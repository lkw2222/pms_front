import React, { useRef, useCallback, useState } from 'react'
import { X } from 'lucide-react'

const MIN_WIDTH  = 400
const MAX_WIDTH  = 900
const TRANSITION = 'width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)'

/**
 * 등록 / 수정 전용 우측 고정형 드로어. 드래그 리사이즈(400~900px) 지원
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}    props
 * @param {boolean}   props.open                   열림 여부
 * @param {string}    [props.title]                헤더 제목
 * @param {function}  [props.onClose]              닫기 핸들러
 * @param {ReactNode} [props.footer]               하단 버튼 영역 (저장/취소 등)
 * @param {ReactNode} [props.children]             폼 내용
 * @param {number}    [props.defaultWidth=600]     초기 너비 (px)
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function FormDrawer({ open, title, onClose, footer, children, defaultWidth = 600 }) {
  const [width,      setWidth]      = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef(null)

  const onMouseDown = useCallback((e) => {
    const startX = e.clientX
    const startW = panelRef.current ? panelRef.current.offsetWidth : width

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
      setWidth(newW)
      setIsResizing(false)
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

        {/* 헤더 */}
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

        {/* 내용 */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px', boxSizing:'border-box' }}>
          {children}
        </div>

        {/* 푸터 */}
        {footer && (
          <div style={{
            borderTop:'1px solid var(--color-border)', padding:'6px 16px',
            display:'flex', justifyContent:'flex-end', gap:8, flexShrink:0,
          }}>
            {footer}
          </div>
        )}

      </div>
    </div>
  )
}
