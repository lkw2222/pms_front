import axios from 'axios'

/**
 * ── 인증 방식: httpOnly 쿠키 + JWT ──────────────────────────────────────────
 *
 * - 로그인 성공 시 백엔드가 httpOnly 쿠키로 JWT 발급
 * - 프론트는 토큰을 직접 저장/관리하지 않음
 * - withCredentials: true 로 모든 요청에 쿠키 자동 포함
 *
 * 백엔드 로그인 응답 예시 (Spring Boot):
 *   ResponseCookie.from("token", jwtToken)
 *     .httpOnly(true).secure(true).sameSite("Strict")
 *     .path("/").maxAge(Duration.ofHours(8)).build()
 *
 * CORS 설정 필수 (Spring Boot):
 *   config.setAllowCredentials(true)
 *   config.setAllowedOrigins(List.of("http://localhost:5173"))
 * ─────────────────────────────────────────────────────────────────────────────
 */
const apiClient = axios.create({
  baseURL:         import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers:         { 'Content-Type': 'application/json' },
  withCredentials: true,  // 쿠키 자동 포함 (httpOnly 쿠키 인증 필수)
})

// ── 응답 인터셉터 — 401 처리 ──────────────────────────────────────────────────
// 쿠키 방식은 토큰을 직접 삭제할 수 없음 → 백엔드 /logout 호출로 쿠키 만료 처리
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (window.location.search.includes('panel=')) {
        // PiP 창 → 닫기
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
