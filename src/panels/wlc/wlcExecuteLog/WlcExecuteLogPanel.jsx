import React                  from 'react'
import ErrorBoundary           from '@/components/feedback/ErrorBoundary.jsx'
import WlcExecuteLogFeature    from '@/features/wlc/wlcExecuteLog/WlcExecuteLogFeature.jsx'

/**
 * 풍하중 실행로그 조회 패널.
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
export default function WlcExecuteLogPanel() {
    return (
        <ErrorBoundary>
            <WlcExecuteLogFeature />
        </ErrorBoundary>
    )
}
