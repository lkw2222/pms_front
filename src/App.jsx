import React, { useEffect } from 'react'
import { toast } from 'sonner'
import AppLayout from "./layout/app/AppLayout.jsx";
import LoginLayout from "./layout/login/LoginLayout";

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {

  // ── 뒤로가기 / 백스페이스 방지 ──────────────────────────────────────────
  useEffect(() => {
    history.pushState(null, '', window.location.href)

    // 브라우저 뒤로가기 버튼
    const handlePop = () => {
      history.pushState(null, '', window.location.href)
      toast.warning('뒤로가기는 지원하지 않습니다.')
    }

    // 백스페이스 키 — input/textarea 외부에서만 차단
    const handleKeyDown = (e) => {
      if (e.key !== 'Backspace') return
      const tag = e.target.tagName
      const editable = e.target.isContentEditable
      if (tag === 'INPUT' || tag === 'TEXTAREA' || editable) return
      e.preventDefault()
      toast.warning('뒤로가기는 지원하지 않습니다.')
    }

    window.addEventListener('popstate',  handlePop)
    window.addEventListener('keydown',   handleKeyDown)
    return () => {
      window.removeEventListener('popstate',  handlePop)
      window.removeEventListener('keydown',   handleKeyDown)
    }
  }, []);

  return (
      <>
        {/*세션이이 있는 경우 App 레이아웃*/}
        <AppLayout />

        {/*세션이 없는 경우 로그인 레이아웃*/}
        {/*<LoginLayout />*/}
      </>
  )
}