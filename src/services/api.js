import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// ── 요청 인터셉터 — JWT 토큰 자동 첨부 ───────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── 응답 인터셉터 — 401 처리 ─────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')

      // PiP 새 창(window.opener 없는 단독 창)이면 창 닫기
      // 기존 창이면 로그인 페이지로 이동
      if (window.location.search.includes('panel=')) {
        // PiP 창 → 닫고 끝
        window.close()
      } else {
        // 메인 창 → 로그인 페이지로 이동
        // window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default apiClient
