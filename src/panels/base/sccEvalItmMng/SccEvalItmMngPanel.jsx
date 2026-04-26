/**
 * SCC 평가인자관리 패널.
 * 대분류 → 중분류 → 소분류 계층형 트리 구조.
 * useMutation(등록 / 수정 / 삭제) + ErrorBoundary 구성.
 *
 * @author JDJ
 * @since 2026-04-26
 */
import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ErrorBoundary        from '@/components/feedback/ErrorBoundary.jsx'
import SccEvalItmMngFeature from '@/features/base/sccEvalItmMng/SccEvalItmMngFeature.jsx'

// ── SccEvalItmMngPanelInner ───────────────────────────────────────────────────
function SccEvalItmMngPanelInner() {
    const queryClient = useQueryClient()

    // ── 등록 ─────────────────────────────────────────────────────────────────
    const registerMutation = useMutation({
        mutationFn: async (payload) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // import { sccEvalItmApi } from '@/services/base/sccEvalItmMng/sccEvalItmMngService.js'
            // return sccEvalItmApi.register(payload)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 400))
            return payload
        },
        onSuccess: (_, variables) => {
            const label = variables.minorCode ? '소분류' : variables.midCode ? '중분류' : '대분류'
            toast.success(`${label}가 등록되었습니다.`)
            queryClient.invalidateQueries({ queryKey: ['sccEvalItm'] })
        },
        onError: () => { toast.error('등록 중 오류가 발생했습니다.') },
    })

    // ── 수정 ─────────────────────────────────────────────────────────────────
    const editMutation = useMutation({
        mutationFn: async (payload) => {
            // return sccEvalItmApi.update(payload)
            await new Promise(r => setTimeout(r, 400))
            return payload
        },
        onSuccess: (_, variables) => {
            const label = variables.type === 'minor' ? '소분류' : variables.type === 'mid' ? '중분류' : '대분류'
            toast.success(`${label}가 수정되었습니다.`)
            queryClient.invalidateQueries({ queryKey: ['sccEvalItm'] })
        },
        onError: () => { toast.error('수정 중 오류가 발생했습니다.') },
    })

    // ── 삭제 ─────────────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: async (node) => {
            // return sccEvalItmApi.delete(node)
            await new Promise(r => setTimeout(r, 400))
            return node
        },
        onSuccess: (node) => {
            const label = node.type === 'minor' ? '소분류' : node.type === 'mid' ? '중분류' : '대분류'
            toast.success(`'${node.name}' ${label}가 삭제되었습니다.`)
            queryClient.invalidateQueries({ queryKey: ['sccEvalItm'] })
        },
        onError: () => { toast.error('삭제 중 오류가 발생했습니다.') },
    })

    // ── 점수산정 기준 저장 ────────────────────────────────────────────────────
    // ❗ 분리 포인트: 나중에 별도 메뉴(UI-PMS-INF-13M)로 뺄 경우
    //   이 mutation을 새 SccScoreRulePanel.jsx 로 이동하고
    //   SccEvalItmMngFeature 에서 onSaveScore props를 제거하면 됩니다.
    const scoreRulesMutation = useMutation({
        mutationFn: async ({ node, scoreRules }) => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // return sccEvalItmApi.saveScoreRules({
            //     majorCode:  node.majorCode,
            //     midCode:    node.midCode,
            //     minorCode:  node.minorCode,
            //     scoreRules,
            // })
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 300))
            return { node, scoreRules }
        },
        onSuccess: () => {
            toast.success('점수산정 기준이 저장되었습니다.')
            queryClient.invalidateQueries({ queryKey: ['sccEvalItm', 'scoreRules'] })
        },
        onError: () => { toast.error('점수산정 기준 저장 중 오류가 발생했습니다.') },
    })

    return (
        <SccEvalItmMngFeature
            onRegister={registerMutation.mutateAsync}
            onEdit={editMutation.mutateAsync}
            onDelete={deleteMutation.mutateAsync}
            onSaveScore={scoreRulesMutation.mutateAsync}
        />
    )
}

// ── SccEvalItmMngPanel ────────────────────────────────────────────────────────
export default function SccEvalItmMngPanel() {
    return (
        <ErrorBoundary>
            <SccEvalItmMngPanelInner />
        </ErrorBoundary>
    )
}
