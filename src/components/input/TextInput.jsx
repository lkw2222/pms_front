import React, { useState } from 'react'
import styles from '../styles/TextInput.module.css'

/**
 * 텍스트 입력 컴포넌트. 유효성 검사(isNotNull / regex), 아이콘,
 * 포커스 하이라이트 지원. react-hook-form register 와 함께 사용 가능
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}    props
 * @param {string}    [props.label]              라벨 텍스트
 * @param {string}    [props.placeholder='']     플레이스홀더
 * @param {string}    [props.value='']           입력값
 * @param {function}  [props.onChange]           변경 핸들러
 * @param {string}    [props.type='text']        input 타입 — text | password | number
 * @param {boolean}   [props.isNotNull=false]    필수 입력 여부
 * @param {RegExp}    [props.regex]              유효성 검사 정규식
 * @param {string}    [props.errorMessage]       에러 메시지
 * @param {boolean}   [props.disabled=false]     비활성 여부
 * @param {Component} [props.icon]               lucide-react 아이콘
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function TextInput({
  label, placeholder = '', value = '', onChange = () => {},
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
