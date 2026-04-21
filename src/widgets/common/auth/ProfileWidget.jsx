import React, { useState, useRef, useEffect } from 'react'
import { LogOut, User } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore.js'
import MyPageWidget from "@/widgets/common/auth/MyPageWidget.jsx";
import styles from '@/styles/CommonAuth.module.css'

export default function ProfileWidget() {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const [ mypageOpen, setMypageOpen ] = useState(false);

    const { user, clearAuth, setSessionExpired } = useAppStore()

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleLogout = () => {
        setOpen(false)
        clearAuth()
        setSessionExpired(true)
    }

    const initial  = user?.name?.charAt(0) ?? 'A'
    const name     = user?.name     ?? '김담당'
    const subInfo  = [user?.bonbu, user?.sabupso].filter(Boolean).join(' · ') || user?.id || 'hongildong123'
    const role     = user?.role     ?? '시스템관리자'

    return (
        <>
            <div ref={ref} style={{ position:'relative' }}>

                {/* 트리거: 아바타만 */}
                <div
                    onClick={() => setOpen(o => !o)}
                    className={[styles.profileAvata, open ? styles.avataOpen : styles.avataClose ].join(" ")}

                >
                    <User size={15} strokeWidth={2} />
                </div>

                {/* 드롭다운 */}
                {open && (
                    <div className={styles.profileDropdown}>

                        {/* 사용자 정보 */}
                        <div className={styles.profileUser} onClick={(e) => setMypageOpen(true)}>
                            <div className={styles.profileUserinfo} >
                                <User size={20} strokeWidth={2} />
                            </div>
                            <div className={styles.profileUserWrap} >
                                <div className={styles.profileUserText} >
                                    <span className={styles.profileUserTextRole}>{role}</span>
                                    <span className={styles.profileUserTextName}>{name}</span>
                                </div>
                                <div className={styles.profileUserSub}>{subInfo}</div>
                            </div>
                        </div>

                        <div className={styles.profileLine} />

                        {/* 로그아웃 */}
                        <div style={{ padding:'6px' }}>
                            <button onClick={handleLogout} className={styles.profileLogout} >
                                <LogOut size={14} />
                                로그아웃
                            </button>
                        </div>

                    </div>
                )}
            </div>

            {mypageOpen && (
                <MyPageWidget onClose={() => setMypageOpen(false)} styles={styles} />
            )}
        </>
    )
}
