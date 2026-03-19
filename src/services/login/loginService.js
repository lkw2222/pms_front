import apiClient from '@/services/api.js'

/**
 * 인증 API 서비스
 * Feature: features/login/LoginFeature.jsx
 */
export const loginApi = {
  login:  (id, password) => apiClient.post('/login',  { id, password }).then(r => r.data),
  logout: ()             => apiClient.post('/logout').then(r => r.data),
  me:     ()             => apiClient.get('/me').then(r => r.data),
}

export const LOGIN_KEYS = {
  me: ['auth', 'me'],
}
