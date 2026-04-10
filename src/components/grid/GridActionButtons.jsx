import React from 'react'
import { Eye, Pencil, Trash2, Download, Copy, Plus, Check, X } from 'lucide-react'

/**
 * GridActionButtons
 * 그리드 로우에서 사용하는 액션 버튼 모음
 *
 * @param {object} data    - 현재 로우 데이터
 * @param {Array}  buttons - 버튼 설정 배열
 *
 * buttons 설정 예시:
 * [
 *   { type: 'detail'   },
 *   { type: 'edit'     },
 *   { type: 'delete'   },
 *   { type: 'download' },
 *   { type: 'copy'     },
 *   { type: 'add'      },
 *   { type: 'confirm'  },
 *   { type: 'cancel'   },
 *   { type: 'custom', label:'라벨', icon:IconComponent, variant:'ghost' },
 * ]
 *
 * 공통 옵션 (모든 type에서 사용 가능):
 *   onClick:  (data) => {}          클릭 핸들러
 *   label:    string                버튼 텍스트 (type 기본값 사용 가능)
 *   icon:     LucideIcon            아이콘 (type 기본값 사용 가능)
 *   variant:  string                스타일 (type 기본값 사용 가능)
 *   disabled: bool | (data) => bool
 *   hidden:   bool | (data) => bool
 *   title:    string                툴팁
 */

const TYPE_PRESET = {
  detail:   { label:'상세', icon:Eye,      variant:'ghost'     },
  edit:     { label:'수정', icon:Pencil,   variant:'ghost'     },
  delete:   { label:'삭제', icon:Trash2,   variant:'danger'    },
  download: { label:'다운', icon:Download, variant:'ghost'     },
  copy:     { label:'복사', icon:Copy,     variant:'ghost'     },
  add:      { label:'추가', icon:Plus,     variant:'primary'   },
  confirm:  { label:'승인', icon:Check,    variant:'success'   },
  cancel:   { label:'반려', icon:X,        variant:'secondary' },
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

export default function GridActionButtons({ data, buttons = [] }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:3, height:'100%' }}>
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
