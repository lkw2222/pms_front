/**
 * 기초정보 현황 패널.
 * useMutation(등록 / 수정 / 삭제) + ErrorBoundary 구성.
 *
 * @author JDJ
 * @since 2026-04-24
 */
import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ErrorBoundary   from '@/components/feedback/ErrorBoundary.jsx'
import BaseInfoFeature from '@/features/base/baseInfo/BaseInfoFeature.jsx'

// ── BaseInfoPanelInner ────────────────────────────────────────────────────────
function BaseInfoPanelInner() {
    const queryClient = useQueryClient()

    // ── 등록 ─────────────────────────────────────────────────────────────────
    const registerMutation = useMutation({
        mutationFn: async (payload) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // import { baseInfoApi } from '@/services/base/baseInfo/baseInfoService.js'
            // return baseInfoApi.create(payload)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 400))
            return { ...payload, id: Date.now() }
        },
        onSuccess: () => {
            toast.success('기초정보가 등록되었습니다.')
            queryClient.invalidateQueries({ queryKey: ['baseInfo', 'list'] })
        },
        onError: () => {
            toast.error('등록 중 오류가 발생했습니다.')
        },
    })

    // ── 수정 ─────────────────────────────────────────────────────────────────
    const editMutation = useMutation({
        mutationFn: async (payload) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // return baseInfoApi.update(payload.id, payload)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 400))
            return payload
        },
        onSuccess: () => {
            toast.success('기초정보가 수정되었습니다.')
            queryClient.invalidateQueries({ queryKey: ['baseInfo', 'list'] })
        },
        onError: () => {
            toast.error('수정 중 오류가 발생했습니다.')
        },
    })

    // ── 삭제 ─────────────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (row) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // return baseInfoApi.delete(row.id)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 300))
            return row
        },
        onSuccess: (row) => {
            toast.success(`'${row.tableName}' 정보가 삭제되었습니다.`)
            queryClient.invalidateQueries({ queryKey: ['baseInfo', 'list'] })
        },
        onError: () => {
            toast.error('삭제 중 오류가 발생했습니다.')
        },
    })

    return (
        <BaseInfoFeature
            onRegister={registerMutation.mutateAsync}
            onEdit={editMutation.mutateAsync}
            onDelete={deleteMutation.mutateAsync}
        />
    )
}

// ── BaseInfoPanel ─────────────────────────────────────────────────────────────
export default function BaseInfoPanel() {
    return (
        <ErrorBoundary>
            <BaseInfoPanelInner />
        </ErrorBoundary>
    )
}
