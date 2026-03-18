import React from 'react';
import LoginFeature from '@/features/login/LoginFeature.jsx';
import { login } from '@/services/authService.js';

const LoginPanel = () => {
    const handleLogin = async (id, password) => {
        try {
            const result = await login(id, password);

            // 스프링부트에서 성공적으로 응답(200 OK)이 온 경우
            console.log("로그인 성공, 백엔드 응답:", result);
            alert("로그인 성공!");

            // 예: 발급받은 JWT 토큰을 로컬 스토리지에 저장
            // localStorage.setItem('token', result.token);

        } catch (error) {
            alert(error.message); // 에러 메시지 팝업
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>서비스 로그인</h1>
            <LoginFeature onLogin={handleLogin} />
        </div>
    );
};

export default LoginPanel;