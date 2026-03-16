import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(id, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="이메일"
                />
            </div>
            <div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                />
            </div>
            <button type="submit">로그인</button>
        </form>
    );
};

export default LoginForm;