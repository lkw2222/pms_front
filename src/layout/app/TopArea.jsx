import React, {useCallback, useState} from 'react'
import {Activity, Bell, Menu, Moon, PanelLeftClose, Sun, X} from "lucide-react";
import { useAppStore } from '@/store/useAppStore.js'

import NotificationWidget from '@/widgets/common/notification/NotificationWidget.jsx'
import JobProgressWidget from '@/widgets/common/job/JobProgressWidget.jsx'
import ProfileWidget from '@/widgets/common/auth/ProfileWidget.jsx'

import styles from '@/assets/styles/layout.module.css'
import logoImg from '@/assets/image/logo.png'
import logoDarkImg from '@/assets/image/logo-dark.png'

export default function TopArea({apiRef}) {
    const { theme, toggleTheme, toggleSidebar, openPanels } = useAppStore();
    const closeAllPanels   = useCallback(() =>
        [...(apiRef.current?.panels ?? [])]
            .filter(p => p.id !== 'dashboardPanel')
            .forEach(p => p.api.close()), [])
    const closeActivePanel = useCallback(() => {
        const active = apiRef.current?.activePanel
        if (!active || active.id === 'dashboardPanel') return
        active.api.close()
    }, [])
    const [notiOpen, setNotiOpen] = useState(false);
    const [jobOpen, setJobOpen] = useState(false);

    return (
        <header className={styles.topbar}>
            <button className={styles.iconBtnCustom} onClick={toggleSidebar}>
                <Menu size={16} />
            </button>

            <div className={styles.topbarLogo}>
                {/* ── <div className={styles.topbarLogoIcon}>P</div> ── */}
                <div className={styles.topbarLogoIcon}>
                    <img src={theme === 'dark' ? logoDarkImg : logoImg} alt="전력연구원 로고" className={styles.topbarLogoImage} />
                </div>
                <div>
                    <div className={styles.topbarLogoTitle}>전력연구원</div>
                    <div className={styles.topbarLogoSub}>전주 진단 우선순위 시스템</div>
                </div>
            </div>

            <div className={styles.topbarRight}>
                {[...openPanels].some(id => id !== 'dashboardPanel') && (
                    <>
                        <div className={styles.divider} />
                        <button className={styles.tabCloseBtn} onClick={closeActivePanel} title="현재 탭 닫기">
                            <X size={12} /><span>현재 탭</span>
                        </button>
                        <button className={[styles.tabCloseBtn, styles.danger].join(' ')} onClick={closeAllPanels} title="전체 탭 닫기">
                            <PanelLeftClose size={12} /><span>전체 닫기</span>
                        </button>
                        <div className={styles.divider} />
                    </>
                )}
                <button className={styles.iconBtn} onClick={toggleTheme} title={theme==='dark'?'라이트 모드':'다크 모드'}>
                    {theme==='dark' ? <Sun size={15} /> : <Moon size={15} />}
                </button>
                <button className={styles.iconBtn} onClick={() => { setJobOpen(o => !o); setNotiOpen(false) }} title="작업 현황" style={{ position:'relative' }}>
                    <Activity size={15} />
                    <span className={styles.notiBadge} />
                </button>
                <button className={styles.iconBtn} onClick={() => { setNotiOpen(o => !o); setJobOpen(false) }} title="알림">
                    <Bell size={15} />
                    <span className={styles.notiBadge} />
                </button>
                <JobProgressWidget  open={jobOpen}  onClose={() => setJobOpen(false)}  />
                <NotificationWidget open={notiOpen} onClose={() => setNotiOpen(false)} />
                <ProfileWidget />
            </div>
        </header>
    )
}