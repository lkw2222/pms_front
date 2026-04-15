import React from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * 상하 분할 그리드에서 상위/하위 그리드 사이 구분선 컴포넌트
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object} props
 * @param {string} [props.label]   중앙에 표시할 텍스트
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function SectionDivider({ label }) {
  return (
    <div className="section-divider">
      <div className="section-divider-line" />
      <div className="section-divider-label">
        <ChevronRight size={11} style={{ transform:'rotate(90deg)', flexShrink:0 }} />
        <span>{label}</span>
      </div>
      <div className="section-divider-line" />
    </div>
  )
}
