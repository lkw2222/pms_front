import React, { useState } from 'react'
import styles from '../styles/TextInput.module.css'

/**
 * 비밀번호 강도 계산
 * @param {string} password
 * @returns {{ score: number, label: string, level: 'weak'|'medium'|'strong'|'veryStrong' }}
 */
function calcPasswordStrength(password) {
  if (!password) return { score: 0, label: '', level: 'none' }

  let score = 0
  const checks = {
    length8: password.length >= 8,
    length12: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }

  if (checks.length8) score += 1
  if (checks.length12) score += 1
  if (checks.lowercase && checks.uppercase) score += 1
  if (checks.number) score += 1
  if (checks.special) score += 1

  // score: 0 ~ 5
  if (score <= 1) return { score, label: '매우 약함', level: 'weak' }
  if (score === 2) return { score, label: '약함',     level: 'weak' }
  if (score === 3) return { score, label: '보통',     level: 'medium' }
  if (score === 4) return { score, label: '강함',     level: 'strong' }
  return            { score, label: '매우 강함',       level: 'veryStrong' }
}

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
 * @param {boolean}   [props.showStrength]       비밀번호 강도 표시 여부
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function TextInput({
  label, placeholder = '', value = '', onChange = () => {},
  type = 'text', isNotNull = false, regex, errorMessage,
  disabled = false, icon: Icon, className = '', showStrength = true, ...props
}) {
  const [touched, setTouched] = useState(false)
  const [focused, setFocused] = useState(false)

  // 내부 검증
  const internalError = touched && (
      (isNotNull && !value) ||
      (regex && value && !regex.test(value))
  );

  // 외부에서 errorMessage가 주입되면 그것도 에러 상태로 취급
  const hasExternalError = !!errorMessage;
  const isError = internalError || hasExternalError;

  // 표시할 메시지 결정
  const displayMessage = errorMessage || (isNotNull && !value ? '필수 입력 항목입니다.' : '올바른 형식이 아닙니다.');

  // 비밀번호 강도 (password 타입일 때만 계산)
  const strength = (type === 'password' && showStrength && value) ? calcPasswordStrength(value) : null;

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
            className={[styles.input, isError ? styles.error : '', Icon ? styles.hasIcon : '', className ? className : ''].join(' ')}
            {...props}
          />
        </div>
      </label>

      {/* 비밀번호 강도 표시 */}
      {strength && (
          <div className={styles.strengthWrap}>
            <div className={styles.strengthBar}>
              {[1, 2, 3, 4, 5].map((i) => (
                  <div
                      key={i}
                      className={[
                        styles.strengthSegment,
                        i <= strength.score ? styles[strength.level] : ''
                      ].join(' ')}
                  />
              ))}
            </div>
            <span className={[styles.strengthLabel, styles[strength.level]].join(' ')}>
            {strength.label}
          </span>
          </div>
      )}

      {isError && (
          <span className={styles.errorMsg}>{displayMessage}</span>
      )}
    </div>
  )
}
