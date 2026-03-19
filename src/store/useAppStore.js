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
  persist(
    (set, get) => ({
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
      user:  null,
      token: null,
      setAuth:   (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
      isLoggedIn: () => !!get().token,
    }),
    {
      name: 'pms-app-store',
    }
  )
)
