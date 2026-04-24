import React from 'react'
import styles from '../styles/BasicLabel.module.css'

/**
 * 상태 · 우선순위 등을 나타내는 뱃지형 라벨 컴포넌트.
 * variant 로 색상 테마를 지정하며 CSS Module 기반으로 스타일 관리
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object} props
 * @param {string} props.text                  라벨 텍스트
 * @param {string} [props.variant='default']   색상 테마 — default | success | warning | danger | info | blue | purple
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function BasicLabel({ text, variant = 'default', className = '' }) {
  return (
    <span className={[styles.badgeHeight, styles[variant] ?? styles.default, className].join(' ')}>
      {text}
    </span>
  )
}
