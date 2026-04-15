import React from 'react'
import { Check } from 'lucide-react'
import styles from '../styles/CheckboxInput.module.css'

/**
 * 체크박스 입력 컴포넌트. checked 상태와 라벨 표시 지원
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}   props
 * @param {string}   [props.label]           라벨 텍스트
 * @param {boolean}  [props.checked=false]   체크 상태
 * @param {function} [props.onChange]        변경 핸들러
 * @param {boolean}  [props.disabled=false]  비활성 여부
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function CheckboxInput({ label, checked = false, onChange, disabled = false, className = '', ...props }) {
  return (
    <label className={[styles.label, disabled ? styles.disabled : '', className].join(' ')}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}
        className={styles.input} {...props} />
      <div className={[styles.box, checked ? styles.checked : ''].join(' ')}>
        {checked && <Check size={11} color="#fff" strokeWidth={3} />}
      </div>
      {label}
    </label>
  )
}
