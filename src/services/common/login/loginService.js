import apiClient from '@/services/api.js'

/**
 * 인증 API 서비스
 * Feature: features/login/LoginFeature.jsx
 */
export const loginApi = {
    // ── 데모: 아이디/비밀번호 무관하게 로그인 성공 처리 ─────────────────────
    // 실제 API 연동 시 아래 주석 해제 후 mock 제거
    // login: (id, password) => apiClient.post('/login', { id, password }).then(r => r.data),
    login: (id, password) => new Promise((resolve, reject) => {
        if(id && password) {
            setTimeout(() => resolve({
                user:  { userId: id, userNm: "홍길동", headquarters: '서울본부', branch: '동대문중랑지사', pwQuestion : '001', pwAnswer: '용곡초등학교', purpose: '시스템 관리', auth:'시스템관리자', useYn: 'Y'}
            }), 1000);
        } else {
            setTimeout(() => reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.')), 1000);
        }

        /*if(id === "pmsuser" && password === "pms123") {
            setTimeout(() => resolve({
                user:  { id, name: id, bonbu: '기술본부', sabupso: '서울사업소' }
            }), 1000);
        } else {
            setTimeout(() => reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.')), 1000);
        }*/
    }),
    logout: ()             => apiClient.post('/logout').then(r => r.data),
    me:     ()             => apiClient.get('/me').then(r => r.data),
}

export const LOGIN_KEYS = {
  me: ['auth', 'me'],
}
