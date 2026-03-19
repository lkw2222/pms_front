import React from 'react'
import { ChevronDown } from 'lucide-react'
import styles from '../styles/SelectInput.module.css'

export default function SelectInput({
  label, value = '', onChange, options = [],
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
