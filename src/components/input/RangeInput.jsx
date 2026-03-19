import React from 'react'

/**
 * RangeInput
 * - 트랙 위에 채워지는 게이지 (min~value 구간 색상 표시)
 * @param {string}   label
 * @param {number}   value
 * @param {function} onChange
 * @param {number}   min
 * @param {number}   max
 * @param {number}   step
 * @param {boolean}  showValue
 * @param {boolean}  disabled
 * @param {...any}   props
 */
export default function RangeInput({
  label,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  disabled = false,
  className = '',
  ...props
}) {
  const pct = ((Number(value) - min) / (max - min)) * 100

  return (
    <div className={`flex flex-col gap-1.5 mb-3 ${className}`}>
      {label && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <label style={{ fontSize:12, fontWeight:500, color:'var(--color-text-secondary)' }}>{label}</label>
          {showValue && (
            <span style={{ fontSize:12, fontWeight:700, color:'var(--color-accent)', minWidth:28, textAlign:'right' }}>
              {value}
            </span>
          )}
        </div>
      )}

      {/* 트랙 + 게이지 래퍼 */}
      <div style={{ position:'relative', height:20, display:'flex', alignItems:'center' }}>
        {/* 배경 트랙 */}
        <div style={{
          position:'absolute', left:0, right:0, height:6,
          borderRadius:3, background:'var(--color-bg-hover)',
          overflow:'hidden',
        }}>
          {/* 채워지는 게이지 */}
          <div style={{
            position:'absolute', left:0, top:0, bottom:0,
            width:`${pct}%`,
            background:`linear-gradient(to right, var(--color-accent), var(--color-purple))`,
            borderRadius:3,
            transition:'width .1s',
          }} />
        </div>

        {/* 실제 input (투명하게 위에 올려서 인터랙션 처리) */}
        <input
          type="range"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          style={{
            position:'relative', width:'100%', height:20,
            appearance:'none', background:'transparent',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.4 : 1,
            zIndex:1,
            // 썸(동그라미) 스타일
            '--thumb-size': '16px',
          }}
          className="range-input"
          {...props}
        />
      </div>

      {/* min / max 라벨 */}
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:10, color:'var(--color-text-muted)' }}>{min}</span>
        <span style={{ fontSize:10, color:'var(--color-text-muted)' }}>{max}</span>
      </div>
    </div>
  )
}
