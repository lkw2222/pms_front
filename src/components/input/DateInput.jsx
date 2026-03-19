import React from 'react'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { Korean } from 'flatpickr/dist/l10n/ko.js'
import { Calendar } from 'lucide-react'

/**
 * DateInput
 * - 너비는 부모 컨테이너가 결정 (width: 100% 고정)
 * - options 으로 flatpickr 옵션 확장 (mode, minDate 등 특수 케이스만)
 */
export default function DateInput({
  label, value, onChange,
  placeholder = '날짜를 선택하세요',
  options = {}, disabled = false, className = '', ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label style={{ display:'flex', flexDirection:'column', gap:6, cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {label && (
          <span style={{ fontSize:12, fontWeight:500, color:'var(--color-text-secondary)' }}>
            {label}
          </span>
        )}
        <div style={{ position:'relative' }}>
          <Calendar size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--color-text-muted)', zIndex:1 }} />
          <Flatpickr
            value={value}
            onChange={(dates, dateStr) => onChange?.(dateStr, dates)}
            options={{ locale:Korean, dateFormat:'Y-m-d', ...options }}
            disabled={disabled}
            placeholder={placeholder}
            style={{
              width:'100%', height:36, fontSize:13,
              borderRadius:'var(--radius-md)',
              border:'1px solid var(--color-border)',
              padding:'0 12px 0 32px',
              background:'var(--color-bg-tertiary)',
              color:'var(--color-text-primary)',
              outline:'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              boxSizing:'border-box', transition:'border-color .15s',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
            onBlur={e  => e.target.style.borderColor = 'var(--color-border)'}
            {...props}
          />
        </div>
      </label>
    </div>
  )
}
