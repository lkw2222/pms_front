import React, { useState } from 'react'
import styles from '../styles/TextInput.module.css'

export default function TextInput({
  label, placeholder = '', value = '', onChange,
  type = 'text', isNotNull = false, regex, errorMessage,
  disabled = false, icon: Icon, className = '', ...props
}) {
  const [touched, setTouched] = useState(false)
  const [focused, setFocused] = useState(false)

  const isError = touched && (
    (isNotNull && !value) ||
    (regex && value && !regex.test(value))
  )

  return (
    <div className={[styles.wrapper, className].join(' ')}>
      <label className={[styles.label, disabled ? styles.disabled : ''].join(' ')}>
        {label && (
          <span className={styles.labelText}>
            {isNotNull && <span className={styles.required}>*</span>}
            {label}
          </span>
        )}
        <div className={styles.inputWrap}>
          {Icon && <div className={styles.icon}><Icon size={13} /></div>}
          <input
            type={type} value={value} onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); setTouched(true) }}
            placeholder={placeholder} disabled={disabled}
            className={[styles.input, isError ? styles.error : '', Icon ? styles.hasIcon : ''].join(' ')}
            {...props}
          />
        </div>
      </label>
      {isError && (
        <span className={styles.errorMsg}>
          {errorMessage || (isNotNull && !value ? '필수 입력 항목입니다.' : '올바른 형식이 아닙니다.')}
        </span>
      )}
    </div>
  )
}
