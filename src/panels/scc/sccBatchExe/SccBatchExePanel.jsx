import React                    from 'react'
import { useMutation }          from '@tanstack/react-query'
import { toast }                from 'sonner'
import ErrorBoundary             from '@/components/feedback/ErrorBoundary.jsx'
import SccBatchExeFeature    from '@/features/scc/sccBatchExe/SccBatchExeFeature.jsx'

/**
 * SCC 평가 배치 실행 패널.
 * useMutation 을 담당하고 SccBatchExeFeature 에 주입한다.
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
function SccBatchExePanelInner() {
    const executeMutation = useMutation({
        mutationFn: async (body) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────
            // import { sccBatchExecuteApi } from '@/services/scc/sccBatchExecute/sccBatchExeService.js'
            // return sccBatchExecuteApi.execute(body)
            // ─────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 1000))
        },
        onSuccess: () => toast.success('SCC 평가 배치 실행이 요청되었습니다.'),
        onError:   () => toast.error('배치 실행 중 오류가 발생했습니다.'),
    })

    return (
        <SccBatchExeFeature
            onExecute={executeMutation.mutateAsync}
            isRunning={executeMutation.isPending}
        />
    )
}

export default function sccBatchExePanel() {
    return (
        <ErrorBoundary>
            <SccBatchExePanelInner/>
        </ErrorBoundary>
    )
}
