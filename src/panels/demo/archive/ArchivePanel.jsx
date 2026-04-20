import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import ErrorBoundary  from '@/components/feedback/ErrorBoundary.jsx'
import ArchiveFeature from '@/features/demo/archive/ArchiveFeature.jsx'

// ── ArchivePanel ──────────────────────────────────────────────────────────────
function ArchivePanelInner() {
  const queryClient = useQueryClient()

  // ── 등록 ─────────────────────────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: async (payload) => {
      // ── 실제 API 호출 예제 ────────────────────────────────────────────
      // import { archiveApi } from '@/services/archive/archiveService.js'
      // return archiveApi.create(payload)
      // ─────────────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 400))
      return { ...payload, id: Date.now() }
    },
    onSuccess: () => {
      toast.success('자료가 등록되었습니다.')
      queryClient.invalidateQueries({ queryKey: ['archive', 'list'] })
    },
    onError: () => {
      toast.error('등록 중 오류가 발생했습니다.')
    },
  })

  // ── 수정 ─────────────────────────────────────────────────────────────────
  const editMutation = useMutation({
    mutationFn: async (payload) => {
      // ── 실제 API 호출 예제 ────────────────────────────────────────────
      // return archiveApi.update(payload.id, payload)
      // ─────────────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 400))
      return payload
    },
    onSuccess: () => {
      toast.success('자료가 수정되었습니다.')
      queryClient.invalidateQueries({ queryKey: ['archive', 'list'] })
    },
    onError: () => {
      toast.error('수정 중 오류가 발생했습니다.')
    },
  })

  // ── 삭제 ─────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (row) => {
      // ── 실제 API 호출 예제 ────────────────────────────────────────────
      // return archiveApi.delete(row.id)
      // ─────────────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 300))
      return row
    },
    onSuccess: (row) => {
      toast.success(`'${row.title}' 자료가 삭제되었습니다.`)
      queryClient.invalidateQueries({ queryKey: ['archive', 'list'] })
    },
    onError: () => {
      toast.error('삭제 중 오류가 발생했습니다.')
    },
  })

  return (
    <ArchiveFeature
      onRegister={registerMutation.mutateAsync}
      onEdit={editMutation.mutateAsync}
      onDelete={deleteMutation.mutateAsync}
    />
  )
}

export default function ArchivePanel() {
  return (
    <ErrorBoundary>
      <ArchivePanelInner />
    </ErrorBoundary>
  )
}
