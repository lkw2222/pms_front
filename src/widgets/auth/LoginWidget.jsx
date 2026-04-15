import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ShieldAlert } from 'lucide-react'
import LoginFeature  from '@/features/login/LoginFeature.jsx'
import { loginApi }  from '@/services/login/loginService.js'
import { useAppStore } from '@/store/useAppStore.js'

/**
 * LoginWidget
 *
 * 세션 만료 시 전체 화면 위에 블러 오버레이로 로그인 폼을 표시합니다.
 * 로그인 성공 시 오버레이가 사라지고 기존 탭/작업 상태가 그대로 유지됩니다.
 *
 * 사용법:
 *   // App.jsx 최상단에 배치
 *   <LoginWidget />
 *
 *   // API 401 응답 시 (axios interceptor 등)
 *   useAppStore.getState().setSessionExpired(true)
 */
export default function LoginWidget() {
    const { sessionExpired, setSessionExpired, setAuth } = useAppStore();

    const loginMutation = useMutation({
        mutationFn: ({ id, password }) => loginApi.login(id, password),
        onSuccess: (result) => {
            setAuth(result.user, result.token)
            setSessionExpired(false)
            toast.success('로그인되었습니다. 작업을 계속하세요.')
        },
        onError: (error) => {
            toast.error(error.message || '로그인에 실패했습니다.')
        },
    })

    if (!sessionExpired) return null;

  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      zIndex:         9999,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     'rgba(0, 0, 0, 0.55)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      animation:      'fadeIn 0.2s ease',
    }}>
      <div style={{
        width:        380,
        padding:      '40px',
        borderRadius: 'var(--radius-lg)',
        background:   'var(--color-bg-secondary)',
        border:       '1px solid var(--color-border)',
        boxShadow:    'var(--shadow-lg)',
        animation:    'slideUp 0.22s ease',
      }}>
        {/* 헤더 */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:24, gap:8 }}>
          <div style={{
            width:44, height:44, borderRadius:'50%',
            background: 'color-mix(in srgb, var(--color-warning) 15%, transparent)',
            border:     '1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)',
            display:    'flex', alignItems:'center', justifyContent:'center',
          }}>
            <ShieldAlert size={20} style={{ color:'var(--color-warning)' }} />
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:700, color:'var(--color-text-primary)', marginBottom:4 }}>
              세션이 만료되었습니다
            </div>
            <div style={{ fontSize:15, color:'var(--color-text-muted)', lineHeight:1.5 }}>
              보안을 위해 자동 로그아웃되었습니다.<br />다시 로그인하면 작업을 계속할 수 있습니다.
            </div>
          </div>
        </div>

        {/* 로그인 폼 — 기존 LoginFeature 재사용 */}
        <LoginFeature
            className={'w-full !mt-4'}
            onLogin={(id, password) => loginMutation.mutate({ id, password })}
        />
      </div>
    </div>
  )
}
