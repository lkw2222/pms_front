import { QueryClient } from '@tanstack/react-query'

/**
 * TanStack Query 전역 클라이언트 설정
 *
 * staleTime:            데이터가 "신선"한 시간. 이 시간 안에는 재요청 안 함
 * gcTime:               캐시 보관 시간 (메모리에 유지)
 * retry:                실패 시 재시도 횟수
 * refetchOnWindowFocus: 창 포커스 시 자동 재요청 여부
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            1000 * 60 * 5,   // 5분
      gcTime:               1000 * 60 * 10,  // 10분
      retry:                1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
