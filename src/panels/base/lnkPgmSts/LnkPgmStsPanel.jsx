/**
 * 데이터 연계프로그램 현황 패널.
 * useMutation(등록 / 수정 / 삭제) + ErrorBoundary 구성.
 *
 * @author JDJ
 * @since 2026-04-26
 */
import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ErrorBoundary      from '@/components/feedback/ErrorBoundary.jsx'
import LnkPgmStsFeature  from '@/features/base/lnkPgmSts/LnkPgmStsFeature.jsx'

// ── LnkPgmStsPanelInner ───────────────────────────────────────────────────────
function LnkPgmStsPanelInner() {
    const queryClient = useQueryClient()

    // ── 등록 ─────────────────────────────────────────────────────────────────
    const registerMutation = useMutation({
        mutationFn: async (payload) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // import { lnkPgmStsApi } from '@/services/base/lnkPgmSts/lnkPgmStsService.js'
            // return lnkPgmStsApi.create(payload)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 400))
            return { ...payload, id: Date.now() }
        },
        onSuccess: () => {
            toast.success('연계프로그램이 등록되었습니다.')
            queryClient.invalidateQueries({ queryKey: ['lnkPgmSts', 'list'] })
        },
        onError: () => {
            toast.error('등록 중 오류가 발생했습니다.')
        },
    })

    // ── 수정 ─────────────────────────────────────────────────────────────────
    const editMutation = useMutation({
        mutationFn: async (payload) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // return lnkPgmStsApi.update(payload.id, payload)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 400))
            return payload
        },
        onSuccess: () => {
            toast.success('연계프로그램이 수정되었습니다.')
            queryClient.invalidateQueries({ queryKey: ['lnkPgmSts', 'list'] })
        },
        onError: () => {
            toast.error('수정 중 오류가 발생했습니다.')
        },
    })

    // ── 삭제 ─────────────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (row) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // return lnkPgmStsApi.delete(row.id)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 300))
            return row
        },
        onSuccess: (row) => {
            toast.success(`'${row.pgmName}' 프로그램이 삭제되었습니다.`)
            queryClient.invalidateQueries({ queryKey: ['lnkPgmSts', 'list'] })
        },
        onError: () => {
            toast.error('삭제 중 오류가 발생했습니다.')
        },
    })

    return (
        <LnkPgmStsFeature
            onRegister={registerMutation.mutateAsync}
            onEdit={editMutation.mutateAsync}
            onDelete={deleteMutation.mutateAsync}
        />
    )
}

// ── LnkPgmStsPanel ────────────────────────────────────────────────────────────
export default function LnkPgmStsPanel() {
    return (
        <ErrorBoundary>
            <LnkPgmStsPanelInner />
        </ErrorBoundary>
    )
}
