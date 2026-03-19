import React from 'react'
import { useMutation } from '@tanstack/react-query'
import LoginFeature from '@/features/login/LoginFeature.jsx'
import { loginApi } from '@/services/login/loginService.js'
import { useAppStore } from '@/store/useAppStore.js'

export default function LoginPanel() {
  const { setAuth } = useAppStore()

  // ── TanStack Query useMutation - 서버 데이터 변경 (POST/PUT/DELETE) ────
  const loginMutation = useMutation({
    mutationFn: ({ id, password }) => loginApi.login(id, password),
    onSuccess: (result) => {
      // 로그인 성공 → Zustand에 유저 정보 저장
      setAuth(result.user, result.token)
      alert('로그인 성공!')
      // localStorage.setItem('token', result.token)  // api.js interceptor가 자동 처리
    },
    onError: (error) => {
      alert(error.message || '로그인에 실패했습니다.')
    },
  })

  const handleLogin = (id, password) => {
    loginMutation.mutate({ id, password })
  }

  return (
    <div className="panel-container items-center justify-center">
      <div className="w-80 p-8 rounded-[var(--radius-lg)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
        <div className="flex flex-col items-center mb-7">
          <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center mb-3"
            style={{ boxShadow:'var(--shadow-md)' }}>
            <span className="text-white font-bold text-base">P</span>
          </div>
          <h2 className="text-base font-bold text-[var(--color-text-primary)] tracking-wide">PMS 시스템</h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">계정 정보를 입력하세요</p>
        </div>
        <LoginFeature onLogin={handleLogin} />
      </div>
    </div>
  )
}
