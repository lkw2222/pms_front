import apiClient from './api';

export const login = async (id, password) => {
    try {
        // 백엔드의 @PostMapping("/api/login") 엔드포인트로 데이터 전송
        const response = await apiClient.post('/login', {
            id: id,
            password: password
        });

        // 스프링부트에서 리턴해준 응답 데이터 (예: JWT 토큰, 유저 정보 등)
        return response.data;

    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || '로그인에 실패했습니다.');
        }
        throw new Error('서버와 통신할 수 없습니다.');
    }
};