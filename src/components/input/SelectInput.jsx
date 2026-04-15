import React from 'react'
import { ChevronDown } from 'lucide-react'
import styles from '../styles/SelectInput.module.css'

/**
 * 드롭다운 선택 컴포넌트. options 배열로 항목을 정의하며
 * placeholder · isNotNull · disabled 지원
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}  props
 * @param {string}  [props.label]                  라벨 텍스트
 * @param {string}  [props.value='']               선택된 값
 * @param {function}[props.onChange]               변경 핸들러
 * @param {Array}   [props.options=[]]             선택 항목 배열 — [{ label, value }]
 * @param {string}  [props.placeholder='선택하세요'] 기본 문구
 * @param {boolean} [props.isNotNull=false]        필수 선택 여부
 * @param {boolean} [props.disabled=false]         비활성 여부
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function SelectInput({
  label, value = '', onChange = () => {}, options = [],
  placeholder = '선택하세요', isNotNull = false,
  disabled = false, className = '', ...props
}) {
  return (
    <div className={[styles.wrapper, className].join(' ')}>
      <label className={styles.label}>
        {label && (
          <span className={styles.labelText}>
            {isNotNull && <span className={styles.required}>*</span>}
            {label}
          </span>
        )}
        <div className={styles.selectWrap}>
          <select value={value} onChange={onChange} disabled={disabled}
            className={styles.select} {...props}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(opt => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>
                {opt.label ?? opt}
              </option>
            ))}
          </select>
          <div className={styles.arrow}><ChevronDown size={13} /></div>
        </div>
      </label>
    </div>
  )
}
