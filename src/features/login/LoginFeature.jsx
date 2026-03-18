import React, { useState } from 'react';
import { default as IdInput } from "@/components/input/IdInput.jsx";
import { default as PasswordInput } from "@/components/input/PasswordInput.jsx";

const LoginFeature = ({ onLogin }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(id, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <IdInput value={id} onChange={(e) => setId(e.target.value)}/>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}></PasswordInput>
            <button type="submit">로그인</button>
        </form>
    );
};

export default LoginFeature;