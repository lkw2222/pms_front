import React, { useState } from 'react';
import TextInput from "@/components/input/TextInput.jsx";

const LoginFeature = ({ onLogin }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(id, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextInput value={id} onChange={(e) => setId(e.target.value)} placeholder={'ID'} isNotNull={true}/>
            <TextInput value={password} type={'password'} onChange={(e) => setPassword(e.target.value)} placeholder={'PASSWORD'} isNotNull={true}/>
            <button type="submit">로그인</button>
        </form>
    );
};

export default LoginFeature;