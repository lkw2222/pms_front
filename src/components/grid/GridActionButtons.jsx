import React from 'react'
import { Eye, Pencil, Trash2, Download, Copy, Plus, Check, X, Play } from 'lucide-react'

const TYPE_PRESET = {
  detail:   { label:'상세', icon:Eye,      variant:'ghost'     },
  edit:     { label:'수정', icon:Pencil,   variant:'ghost'     },
  delete:   { label:'삭제', icon:Trash2,   variant:'danger'    },
  download: { label:'다운', icon:Download, variant:'ghost'     },
  copy:     { label:'복사', icon:Copy,     variant:'ghost'     },
  add:      { label:'추가', icon:Plus,     variant:'ghost'   },
  confirm:  { label:'승인', icon:Check,    variant:'success' },
  cancel:   { label:'반려', icon:X,        variant:'ghost'   },
  run:      { label:'실행', icon:Play,     variant:'warning' },
}

const VARIANT_STYLE = {
  ghost: {
    background:  'transparent',
    borderColor: 'transparent',
    color:       'var(--color-text-secondary)',
  },
  primary: {
    background:  'var(--color-accent)',
    borderColor: 'var(--color-accent)',
    color:       '#fff',
  },
  secondary: {
    background:  'var(--color-bg-tertiary)',
    borderColor: 'var(--color-border)',
    color:       'var(--color-text-primary)',
  },
  danger: {
    background:  'transparent',
    borderColor: 'transparent',
    color:       'var(--color-danger)',
  },
  success: {
    background:  'transparent',
    borderColor: 'transparent',
    color:       'var(--color-success)',
  },
  warning: {
    background:  'transparent',
    borderColor: 'transparent',
    color:       'var(--color-warning)',
  },
}

const VARIANT_HOVER = {
  ghost: {
    background:  'var(--color-bg-tertiary)',
    borderColor: 'var(--color-border)',
    color:       'var(--color-text-primary)',
  },
  primary: {
    background:  'var(--color-accent-hover)',
    borderColor: 'var(--color-accent-hover)',
    color:       '#fff',
  },
  secondary: {
    background:  'var(--color-bg-hover)',
    borderColor: 'var(--color-text-muted)',
    color:       'var(--color-text-primary)',
  },
  danger: {
    background:  'rgba(239,68,68,0.08)',
    borderColor: 'var(--color-danger)',
    color:       'var(--color-danger)',
  },
  success: {
    background:  'rgba(34,197,94,0.08)',
    borderColor: 'var(--color-success)',
    color:       'var(--color-success)',
  },
  warning: {
    background:  'rgba(234,179,8,0.08)',
    borderColor: 'var(--color-warning)',
    color:       'var(--color-warning)',
  },
}

/**
 * 그리드 로우에서 사용하는 액션 버튼 모음. type 프리셋(detail·edit·delete 등)과
 * custom 버튼을 배열로 조합해 렌더링
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object} props
 * @param {object} props.data      현재 로우 데이터
 * @param {Array}  [props.buttons] 버튼 설정 배열
 * @param {string}         props.buttons[].type      프리셋 타입 — detail | edit | delete | download | copy | add | confirm | cancel | run | custom
 * @param {string}         [props.buttons[].label]   버튼 텍스트 (type 기본값 사용 가능)
 * @param {Component}      [props.buttons[].icon]    아이콘 (type 기본값 사용 가능)
 * @param {string}         [props.buttons[].variant] 스타일 (type 기본값 사용 가능)
 * @param {function|boolean} [props.buttons[].disabled] 비활성 여부 또는 (data) => boolean
 * @param {function|boolean} [props.buttons[].hidden]   숨김 여부 또는 (data) => boolean
 * @param {function}       [props.buttons[].onClick]  클릭 핸들러 — (data) => void
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function GridActionButtons({ data, buttons = [] }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3, height:'100%' }}>
      {buttons.map((btn, idx) => {
        const preset  = TYPE_PRESET[btn.type] ?? {}
        const label   = btn.label   ?? preset.label   ?? ''
        const Icon    = btn.icon    ?? preset.icon     ?? null
        const variant = btn.variant ?? preset.variant  ?? 'ghost'
        const title   = btn.title   ?? label

        const disabled = typeof btn.disabled === 'function' ? btn.disabled(data) : (btn.disabled ?? false)
        const hidden   = typeof btn.hidden   === 'function' ? btn.hidden(data)   : (btn.hidden   ?? false)

        if (hidden) return null

        return (
          <button
            key={idx}
            title={title}
            disabled={disabled}
            onClick={(e) => { e.stopPropagation(); btn.onClick?.(data) }}
            style={{
              display:     'inline-flex',
              alignItems:  'center',
              gap:         3,
              padding:     label ? '0 7px' : '0 5px',
              height:      26,
              fontSize:    11,
              fontWeight:  500,
              borderRadius:'var(--radius-md)',
              border:      '1px solid transparent',
              cursor:      disabled ? 'not-allowed' : 'pointer',
              opacity:     disabled ? 0.4 : 1,
              whiteSpace:  'nowrap',
              transition:  'all 0.15s',
              ...VARIANT_STYLE[variant],
            }}
            onMouseEnter={e => { if (!disabled) Object.assign(e.currentTarget.style, VARIANT_HOVER[variant]) }}
            onMouseLeave={e => { if (!disabled) Object.assign(e.currentTarget.style, VARIANT_STYLE[variant]) }}
          >
            {Icon && <Icon size={12} strokeWidth={2} />}
            {label}
          </button>
        )
      })}
    </div>
  )
}
