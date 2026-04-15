import React from 'react'
import styles from '../styles/RadioInput.module.css'

/**
 * 라디오 버튼 그룹 컴포넌트. options 배열로 항목을 정의하며 단일 선택 지원
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}   props
 * @param {Array}    [props.options=[]]       선택 항목 배열 — [{ label, value }] 또는 값 배열
 * @param {string}   [props.value='']        선택된 값
 * @param {function} [props.onChange]        변경 핸들러 — ({ target: { value } }) 형태로 전달
 * @param {boolean}  [props.disabled=false]  비활성 여부
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function RadioInput({ options = [], value = '', onChange, disabled = false, className = '' }) {
  return (
    <div className={[styles.group, className].join(' ')}>
      {options.map(opt => {
        const val = opt.value ?? opt
        const lab = opt.label ?? opt
        const checked = value === val
        return (
          <label key={val} className={[styles.label, disabled ? styles.disabled : ''].join(' ')}>
            <input type="radio" value={val} checked={checked}
              onChange={() => !disabled && onChange?.({ target: { value: val } })}
              disabled={disabled} className={styles.input} />
            <div className={[styles.dot, checked ? styles.checked : ''].join(' ')} />
            {lab}
          </label>
        )
      })}
    </div>
  )
}
