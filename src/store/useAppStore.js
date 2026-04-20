import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 앱 전역 상태 (Zustand)
 *
 * - persist 미들웨어로 localStorage 자동 저장/복원
 * - Context + useState + useEffect 조합 불필요
 *
 * 사용법:
 *   import { useAppStore } from '@/store/useAppStore.js'
 *   const { theme, toggleTheme } = useAppStore()
 */
export const useAppStore = create(
    persist((set, get) => ({
        // ── 테마 (기본값: light) ───────────────────────────────────────────────
        theme: 'light',
        toggleTheme: () => {
            const next = get().theme === 'dark' ? 'light' : 'dark'
            document.documentElement.setAttribute('data-theme', next)
            set({ theme: next })
        },
        setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
        },

        // ── 사이드바 ───────────────────────────────────────────────────────────
        sidebarOpen: true,
        toggleSidebar:  () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),


        // ── 인증 ──────────────────────────────────────────────────────────────
        // JWT는 httpOnly 쿠키로 관리 (프론트에서 토큰 직접 보관 안 함)
        // 로그인 성공 시 백엔드가 쿠키 발급, 로그아웃 시 백엔드가 쿠키 만료 처리
        user: null,
        setAuth:    (user) => set({ user }),
        clearAuth:  () => set({ user: null }),

        // ── 세션 만료 ─────────────────────────────────────────────────────────
        // API 401 응답 시 setSessionExpired(true) → 로그인 오버레이 표시
        // 실제 연동: axios interceptor response error 에서 호출
        sessionExpired:    false,
        setSessionExpired: (v) => set({ sessionExpired: v }),
        openPanels: new Set(),
        setOpenPanels: (updater) => set((state) => ({
            openPanels: typeof updater === 'function' ? updater(state.openPanels) : updater
        })),
    }),
    {
      name: 'pms-app-store',
      partialize: (s) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen, user: s.user }),
    }
  )
)
