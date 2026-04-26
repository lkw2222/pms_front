/**
 * GIS 데이터 연계 이력 모니터링 패널.
 * useMutation(선택삭제 / 로그 일괄 삭제) + ErrorBoundary 구성.
 *
 * @author JDJ
 * @since 2026-04-26
 */
import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ErrorBoundary       from '@/components/feedback/ErrorBoundary.jsx'
import GisSyncHistFeature  from '@/features/base/gisSyncHist/GisSyncHistFeature.jsx'

// ── GisSyncHistPanelInner ─────────────────────────────────────────────────────
function GisSyncHistPanelInner() {
    const queryClient = useQueryClient()

    // ── 선택삭제 ─────────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (rows) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // import { gisSyncHistApi } from '@/services/base/gisSyncHist/gisSyncHistService.js'
            // return gisSyncHistApi.deleteByIds(rows.map(r => r.id))
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 400))
            return rows
        },
        onSuccess: (rows) => {
            toast.success(`${rows.length}건의 로그가 삭제되었습니다.`)
            queryClient.invalidateQueries({ queryKey: ['gisSyncHist', 'list'] })
        },
        onError: () => {
            toast.error('삭제 중 오류가 발생했습니다.')
        },
    })

    // ── 로그 일괄 삭제 ────────────────────────────────────────────────────────
    const logDeleteMutation = useMutation({
        mutationFn: async (baseDate) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // return gisSyncHistApi.deleteBeforeDate(baseDate)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 500))
            return baseDate
        },
        onSuccess: (baseDate) => {
            toast.success(`${baseDate} 이전 로그가 삭제되었습니다.`)
            queryClient.invalidateQueries({ queryKey: ['gisSyncHist', 'list'] })
        },
        onError: () => {
            toast.error('로그 삭제 중 오류가 발생했습니다.')
        },
    })

    return (
        <GisSyncHistFeature
            onDelete={deleteMutation.mutateAsync}
            onLogDelete={logDeleteMutation.mutateAsync}
        />
    )
}

// ── GisSyncHistPanel ──────────────────────────────────────────────────────────
export default function GisSyncHistPanel() {
    return (
        <ErrorBoundary>
            <GisSyncHistPanelInner />
        </ErrorBoundary>
    )
}
