import React from 'react'
import styles from '../styles/BasicButton.module.css'

/**
 * 공통 버튼 컴포넌트. variant 로 색상 테마, size 로 크기를 지정하며 아이콘 삽입 지원
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}    props
 * @param {string}    [props.label]               버튼 텍스트
 * @param {string}    [props.variant='primary']   색상 테마 — primary | secondary | danger | ghost | success | warning
 * @param {string}    [props.size='md']           크기 — sm | md | lg
 * @param {boolean}   [props.disabled=false]      비활성 여부
 * @param {Component} [props.icon]                lucide-react 아이콘
 * @param {function}  [props.onClick]             클릭 핸들러
 * @param {string}    [props.type='button']       button 타입
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function BasicButton({
  label,
  variant  = 'primary',
  size     = 'md',
  disabled = false,
  icon: Icon,
  onClick,
  type     = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        styles.btn,
        styles[size]     ?? styles.md,
        styles[variant]  ?? styles.primary,
        className,
      ].join(' ')}
      {...props}
    >
      {Icon && <Icon size={(size === 'sm' ? 12 : size === 'lg' ? 14 : 13) - 1} strokeWidth={2} />}
      {label}
    </button>
  )
}
