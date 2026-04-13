import React, { useRef, useState } from 'react'
import ContentArea from "@/layout/app/ContentArea";
import TopArea from "@/layout/app/TopArea.jsx";
import LeftArea from "@/layout/app/LeftArea.jsx";
import { Toaster } from 'sonner'
import { useAppStore } from '@/store/useAppStore.js'

import SessionExpiredOverlay  from '@/widgets/auth/SessionExpiredOverlay.jsx'
import styles from '@/styles/layout.module.css'

// ── App ────────────────────────────────────────────────────────────────────────
export default function AppLayout() {
    const apiRef = useRef(null)
    const { theme } = useAppStore()
    const [pipBlocked,     setPipBlocked]     = useState(false)

    return (
        <>
            <Toaster
                position="top-center"
                theme={theme}
                richColors
                closeButton
                duration={3000}
            />
            <SessionExpiredOverlay />
            <div className={styles.appRoot}>

                {/* ── 탑바 ── */}
                <TopArea apiRef={apiRef}/>

                <div className={styles.body}>

                    {/* ── 사이드바 ── */}
                    <LeftArea apiRef={apiRef}/>

                    {/* ── PiP 차단 토스트 ── */}
                    {pipBlocked && (
                        <div className={styles.toast}>
                            <span style={{ color:'var(--color-warning)', fontSize:16 }}>⚠</span>
                            <span>팝업이 차단되었습니다. 주소창 우측의 차단 아이콘을 클릭해 허용해주세요.</span>
                            <button className={styles.toastClose} onClick={() => setPipBlocked(false)}>✕</button>
                        </div>
                    )}

                    {/* ── Dockview ── */}
                    <ContentArea apiRef={apiRef} />
                </div>
            </div>
        </>
    )
}