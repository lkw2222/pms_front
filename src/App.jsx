import React, { useEffect } from 'react'
import {toast, Toaster} from 'sonner';
import AppLayout from "@/layout/app/AppLayout.jsx";
import LoginLayout from "@/layout/login/LoginLayout.jsx";
import {useAppStore} from "@/store/useAppStore.js";

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
    const user  = useAppStore(s => s.user)
    const theme = useAppStore(s => s.theme)

    // ── 뒤로가기 / 백스페이스 방지 ──────────────────────────────────────────
    useEffect(() => {
        history.pushState(null, '', window.location.href);

        // 브라우저 뒤로가기 버튼
        const handlePop = () => {
            history.pushState(null, '', window.location.href);
            toast.warning('뒤로가기는 지원하지 않습니다.');
        }

        // 백스페이스 키 — input/textarea 외부에서만 차단
        const handleKeyDown = (e) => {
            if (e.key !== 'Backspace') return;
            const tag = e.target.tagName;
            const editable = e.target.isContentEditable;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || editable) return;
            e.preventDefault();
            toast.warning('뒤로가기는 지원하지 않습니다.');
        }

        window.addEventListener('popstate',  handlePop);
        window.addEventListener('keydown',   handleKeyDown);

        return () => {
            window.removeEventListener('popstate',  handlePop);
            window.removeEventListener('keydown',   handleKeyDown);
        }
    }, []);

    const renderLayout = () => {
        if (!user) return <LoginLayout />;
        return <AppLayout />;
    };

    return (
        <>
            <Toaster
                position="top-center"
                theme={theme}
                richColors
                closeButton
                duration={3000}
            />

            { renderLayout() }
        </>
    )

    if(user) {
        return <AppLayout />;
    } else {
        return <LoginLayout />;
    }
}