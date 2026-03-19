import React from 'react'
import styles from '../styles/RadioInput.module.css'

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
