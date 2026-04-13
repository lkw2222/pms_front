import React, { useRef, useState, useEffect } from 'react'
import ContentArea from "@/layout/app/ContentArea";
import TopArea from "@/layout/app/TopArea.jsx";
import LeftArea from "@/layout/app/LeftArea.jsx";
import { Toaster, toast } from 'sonner'
import { useAppStore } from '@/store/useAppStore.js'

import DashboardPanel from '@/panels/dashboard/DashboardPanel.jsx'
import LoginPanel     from '@/panels/login/LoginPanel.jsx'
import GridPanel      from '@/panels/grid/GridPanel.jsx'
import GisPanel       from '@/panels/gis/GisPanel.jsx'
import SamplePanel    from '@/panels/sample/SamplePanel.jsx'
import ReadmePanel    from '@/panels/readme/ReadmePanel.jsx'
import ArchivePanel        from '@/panels/archive/ArchivePanel.jsx'
import WindPressurePanel   from '@/panels/windPressure/WindPressurePanel.jsx'

import SessionExpiredOverlay  from '@/widgets/auth/SessionExpiredOverlay.jsx'
import styles from '@/styles/layout.module.css'



// ── 패널 컴포넌트 등록 ────────────────────────────────────────────────────────
const PANEL_COMPONENTS = {
  dashboardPanel:   DashboardPanel,
  loginPanel:       LoginPanel,
  gridPanel:        GridPanel,
  gridPanel2:       GridPanel,
  gridPanel_sample: GridPanel,
  gisPanel:         GisPanel,
  gisPanel2:        GisPanel,
  gisPanel_sample:  GisPanel,
  samplePanel:      SamplePanel,
  readmePanel:      ReadmePanel,
  settingPanel:     SamplePanel,
  archivePanel:        ArchivePanel,
  windPressurePanel:   WindPressurePanel,
}

// ── PiP 단독 창 ────────────────────────────────────────────────────────────────
function PanelOnlyApp() {
  const panelId   = new URLSearchParams(window.location.search).get('panel')
  const Component = PANEL_COMPONENTS[panelId]
  if (!Component) return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'var(--color-danger)' }}>
        패널을 찾을 수 없습니다: {panelId}
      </div>
  )
  return (
      <div style={{ width:'100vw', height:'100vh', overflow:'hidden', background:'var(--color-bg-primary)' }}>
        <Component />
      </div>
  )
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  if (new URLSearchParams(window.location.search).get('panel')) return <PanelOnlyApp />

  const apiRef = useRef(null)
  const { theme } = useAppStore()
  const [pipBlocked,     setPipBlocked]     = useState(false)


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
  }, [])

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