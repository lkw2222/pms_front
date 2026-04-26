/**
 * SCC 평가등급 코드관리 패널.
 * useMutation(등록 / 수정 / 삭제 / 적용여부변경) + ErrorBoundary 구성.
 * UI-PMS-INF-14M
 *
 * @author JDJ
 * @since 2026-04-27
 */
import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ErrorBoundary        from '@/components/feedback/ErrorBoundary.jsx'
import SccEvalGrdMngFeature from '@/features/base/sccEvalGrdMng/SccEvalGrdMngFeature.jsx'

// ── SccEvalGrdMngPanelInner ───────────────────────────────────────────────────
function SccEvalGrdMngPanelInner() {
    const queryClient = useQueryClient()

    // ── 등록 ─────────────────────────────────────────────────────────────────
    const registerMutation = useMutation({
        mutationFn: async (payload) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // import { sccEvalGrdApi } from '@/services/base/sccEvalGrdMng/sccEvalGrdMngService.js'
            // return sccEvalGrdApi.create(payload)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 400))
            return { ...payload, id: Date.now() }
        },
        onSuccess: () => {
            toast.success('평가등급이 등록되었습니다.')
            queryClient.invalidateQueries({ queryKey: ['sccEvalGrd', 'list'] })
        },
        onError: () => { toast.error('등록 중 오류가 발생했습니다.') },
    })

    // ── 수정 ─────────────────────────────────────────────────────────────────
    const editMutation = useMutation({
        mutationFn: async (payload) => {
            // return sccEvalGrdApi.update(payload.id, payload)
            await new Promise(r => setTimeout(r, 400))
            return payload
        },
        onSuccess: () => {
            toast.success('평가등급이 수정되었습니다.')
            queryClient.invalidateQueries({ queryKey: ['sccEvalGrd', 'list'] })
        },
        onError: () => { toast.error('수정 중 오류가 발생했습니다.') },
    })

    // ── 삭제 ─────────────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (row) => {
            // return sccEvalGrdApi.delete(row.id)
            await new Promise(r => setTimeout(r, 300))
            return row
        },
        onSuccess: (row) => {
            toast.success(`'${row.gradeCode} - ${row.gradeNm}' 등급이 삭제되었습니다.`)
            queryClient.invalidateQueries({ queryKey: ['sccEvalGrd', 'list'] })
        },
        onError: () => { toast.error('삭제 중 오류가 발생했습니다.') },
    })

    // ── 적용여부 인라인 변경 ─────────────────────────────────────────────────
    const useYnMutation = useMutation({
        mutationFn: async (payload) => {
            // return sccEvalGrdApi.updateUseYn(payload.id, payload.useYn)
            await new Promise(r => setTimeout(r, 200))
            return payload
        },
        onSuccess: (row) => {
            toast.success(`'${row.gradeCode}' 등급 적용여부가 ${row.useYn}로 변경되었습니다.`)
            queryClient.invalidateQueries({ queryKey: ['sccEvalGrd', 'list'] })
        },
        onError: () => { toast.error('적용여부 변경 중 오류가 발생했습니다.') },
    })

    return (
        <SccEvalGrdMngFeature
            onRegister={registerMutation.mutateAsync}
            onEdit={editMutation.mutateAsync}
            onDelete={deleteMutation.mutateAsync}
            onUseYnChange={useYnMutation.mutateAsync}
        />
    )
}

// ── SccEvalGrdMngPanel ────────────────────────────────────────────────────────
export default function SccEvalGrdMngPanel() {
    return (
        <ErrorBoundary>
            <SccEvalGrdMngPanelInner />
        </ErrorBoundary>
    )
}
