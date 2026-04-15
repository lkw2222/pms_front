import React, { useEffect } from 'react'
import { AlertTriangle, Info, CheckCircle, Trash2, X } from 'lucide-react'


// variant 별 아이콘 & 색상
const VARIANT = {
  danger:  { icon: Trash2,         color: 'var(--color-danger)',  confirmLabel: '삭제' },
  warning: { icon: AlertTriangle,  color: 'var(--color-warning)', confirmLabel: '확인' },
  info:    { icon: Info,           color: 'var(--color-accent)',  confirmLabel: '확인' },
  success: { icon: CheckCircle,    color: 'var(--color-success)', confirmLabel: '확인' },
}

/**
 * 사용자 확인이 필요한 작업에 사용하는 공통 확인 모달.
 * danger / warning / info / success 네 가지 variant 지원.
 * ESC 키 및 백드롭 클릭으로 취소 가능
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}   props
 * @param {boolean}  props.open                       모달 열림 여부
 * @param {string}   [props.title]                    제목
 * @param {string}   [props.message]                  본문 메시지
 * @param {string}   [props.variant='danger']         색상 테마 — danger | warning | info | success
 * @param {string}   [props.confirmText]              확인 버튼 텍스트 (기본값은 variant에 따라 결정)
 * @param {string}   [props.cancelText='취소']         취소 버튼 텍스트
 * @param {function} [props.onConfirm]                확인 클릭 핸들러
 * @param {function} [props.onCancel]                 취소 / 닫기 핸들러
 * @returns {JSX.Element|null}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function ConfirmModal({
  open,
  title,
  message,
  variant = 'danger',
  confirmText,
  cancelText = '취소',
  onConfirm,
  onCancel,
}) {
  const { icon: Icon, color, confirmLabel } = VARIANT[variant] ?? VARIANT.danger

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onCancel?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    // 오버레이
    <div
      onClick={onCancel}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9999,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        background:      'rgba(0,0,0,0.45)',
        backdropFilter:  'blur(2px)',
        animation:       'fadeIn .15s ease',
      }}
    >
      {/* 모달 본체 — 클릭 전파 차단 */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:           360,
          background:      'var(--color-bg-secondary)',
          border:          '1px solid var(--color-border)',
          borderRadius:    'var(--radius-lg)',
          boxShadow:       'var(--shadow-lg)',
          overflow:        'hidden',
          animation:       'slideUp .18s ease',
        }}
      >
        {/* 헤더 */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
          padding:      '14px 16px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Icon size={16} color={color} />
            <span style={{ fontSize:13, fontWeight:700, color:'var(--color-text-primary)' }}>
              {title}
            </span>
          </div>
          <button
            onClick={onCancel}
            style={{
              display:'flex', alignItems:'center', justifyContent:'center',
              width:24, height:24, border:'1px solid transparent',
              borderRadius:'var(--radius-md)', background:'transparent',
              cursor:'pointer', color:'var(--color-text-muted)', transition:'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--color-bg-tertiary)'; e.currentTarget.style.borderColor='var(--color-border)' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}
          >
            <X size={13} />
          </button>
        </div>

        {/* 본문 */}
        <div style={{ padding:'20px 16px', fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.6 }}>
          {message}
        </div>

        {/* 버튼 영역 */}
        <div style={{
          display:        'flex',
          justifyContent: 'flex-end',
          gap:            8,
          padding:        '12px 16px',
          borderTop:      '1px solid var(--color-border)',
          background:     'var(--color-bg-tertiary)',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding:      '6px 14px',
              fontSize:     12,
              fontWeight:   500,
              border:       '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background:   'var(--color-bg-secondary)',
              color:        'var(--color-text-secondary)',
              cursor:       'pointer',
              transition:   'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--color-bg-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--color-bg-secondary)' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding:      '6px 14px',
              fontSize:     12,
              fontWeight:   600,
              border:       'none',
              borderRadius: 'var(--radius-md)',
              background:   color,
              color:        '#fff',
              cursor:       'pointer',
              transition:   'opacity .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity='0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity='1' }}
          >
            {confirmText ?? confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
