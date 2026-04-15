import React, { useEffect, useState, useRef, useCallback } from 'react'
import { X } from 'lucide-react'

const MIN_W = 400
const MIN_H = 300

/**
 * 그리드 상세 모달. 중앙 팝업 방식으로 우측·하단·우하단 드래그 리사이즈 지원.
 * ESC 키 및 백드롭 클릭으로 닫기 가능
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}    props
 * @param {boolean}   props.open                   열림 여부
 * @param {string}    [props.title='상세 정보']      헤더 제목
 * @param {function}  [props.onClose]              닫기 핸들러 (ESC / 백드롭 클릭도 동작)
 * @param {ReactNode} [props.children]             내용 — pk 기반 상세 컴포넌트를 주입
 * @param {string}    [props.width='860px']        초기 너비
 * @param {string}    [props.height='80vh']        초기 높이
 * @returns {JSX.Element|null}
 *
 * @example
 * <GridDetailModal open={open} title="업무 상세" onClose={() => setOpen(false)}>
 *   <WorkDetailPane pk={{ id: selectedRow?.id }} />
 * </GridDetailModal>
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function GridDetailModal({
  open,
  title    = '상세 정보',
  onClose,
  children,
  width    = '860px',
  height   = '80vh',
}) {
  const modalRef   = useRef(null)
  const isResizing = useRef(false)          // 리사이즈 중 백드롭 클릭 방지용
  const [size, setSize] = useState({ w: null, h: null })

  // 닫힐 때 크기 초기화
  useEffect(() => { if (!open) setSize({ w: null, h: null }) }, [open])

  // ESC 닫기
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  /**
   * dir: 'e' (우측) | 's' (하단) | 'se' (우하단 코너)
   */
  const startResize = useCallback((e, dir) => {
    e.preventDefault()
    e.stopPropagation()
    isResizing.current = true             // 리사이즈 시작

    const rect   = modalRef.current.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const startW = rect.width
    const startH = rect.height

    const onMove = (mv) => {
      const dX   = mv.clientX - startX
      const dY   = mv.clientY - startY
      const newW = dir.includes('e')
        ? Math.max(MIN_W, Math.min(window.innerWidth  * 0.95, startW + dX))
        : startW
      const newH = dir.includes('s')
        ? Math.max(MIN_H, Math.min(window.innerHeight * 0.92, startH + dY))
        : startH
      setSize({ w: newW, h: newH })
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
      // click 이벤트가 발화된 후 플래그 해제 (setTimeout 0으로 다음 틱에 해제)
      setTimeout(() => { isResizing.current = false }, 0)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
  }, [])

  if (!open) return null

  const modalW = size.w ?? width
  const modalH = size.h ?? height

  return (
    <div
      onClick={(e) => { if (isResizing.current) return; if (e.target === e.currentTarget) onClose?.() }}
      style={{
        position:'fixed', inset:0, zIndex:2000,
        background:'rgba(0,0,0,0.6)',
        display:'flex', alignItems:'center', justifyContent:'center',
        backdropFilter:'blur(2px)',
        animation:'fadeIn .15s ease',
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: modalW, maxWidth:'95vw',
          height: modalH, maxHeight:'92vh',
          background:'var(--color-bg-secondary)',
          border:'1px solid var(--color-border)',
          borderRadius:'var(--radius-lg)',
          boxShadow:'var(--shadow-lg)',
          display:'flex', flexDirection:'column',
          overflow:'hidden',
          animation: size.w ? 'none' : 'slideUp .18s ease',
          position:'relative',
          userSelect:'none',
        }}
      >
        {/* 헤더 */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 20px', height:48, flexShrink:0,
          borderBottom:'1px solid var(--color-border)',
          background:'var(--color-bg-tertiary)',
        }}>
          <span style={{ fontSize:14, fontWeight:700, color:'var(--color-text-primary)' }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              display:'flex', alignItems:'center', justifyContent:'center',
              width:28, height:28, border:'none', borderRadius:'var(--radius-md)',
              background:'transparent', color:'var(--color-text-muted)',
              cursor:'pointer', transition:'all .12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--color-bg-hover)'; e.currentTarget.style.color='var(--color-text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--color-text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 내용 — children 주입 영역 */}
        <div style={{ flex:1, overflow:'hidden', userSelect:'text' }}>
          {children}
        </div>

        {/* ── 리사이즈 핸들 ───────────────────────────────────────────────── */}

        {/* 우측 엣지 */}
        <div
          onMouseDown={(e) => startResize(e, 'e')}
          style={{
            position:'absolute', right:0, top:48, bottom:16, width:5,
            cursor:'e-resize', background:'transparent', transition:'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background='var(--color-accent)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        />

        {/* 하단 엣지 */}
        <div
          onMouseDown={(e) => startResize(e, 's')}
          style={{
            position:'absolute', bottom:0, left:16, right:16, height:5,
            cursor:'s-resize', background:'transparent', transition:'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background='var(--color-accent)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        />

        {/* 우하단 코너 */}
        <div
          onMouseDown={(e) => startResize(e, 'se')}
          style={{
            position:'absolute', right:0, bottom:0, width:16, height:16,
            cursor:'se-resize', zIndex:1,
            display:'flex', alignItems:'flex-end', justifyContent:'flex-end',
            padding:'3px',
          }}
        >
          {/* 코너 점선 아이콘 */}
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <circle cx="7.5" cy="7.5" r="1" fill="var(--color-text-muted)" opacity="0.5"/>
            <circle cx="7.5" cy="4"   r="1" fill="var(--color-text-muted)" opacity="0.4"/>
            <circle cx="4"   cy="7.5" r="1" fill="var(--color-text-muted)" opacity="0.4"/>
            <circle cx="4"   cy="4"   r="1" fill="var(--color-text-muted)" opacity="0.25"/>
          </svg>
        </div>

      </div>
    </div>
  )
}
