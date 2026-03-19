import React from 'react'
import { Check } from 'lucide-react'
import styles from '../styles/CheckboxInput.module.css'

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
