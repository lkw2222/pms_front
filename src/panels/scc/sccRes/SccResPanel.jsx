import React                from 'react'
import ErrorBoundary        from '@/components/feedback/ErrorBoundary.jsx'
import SccResFeature     from '@/features/scc/sccRes/SccResFeature.jsx'

/**
 * SCC 평가 결과 조회 패널.
 *
 * @author JDJ
 * @since 2026-04-20
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-20 | JDJ    | 최초 작성 |
 */
export default function SccResPanel() {
    return (
        <ErrorBoundary>
            <SccResFeature />
        </ErrorBoundary>
    )
}
