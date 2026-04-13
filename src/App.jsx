import React, { useRef, useCallback, useState, useEffect } from 'react'
import { DockviewReact } from 'dockview-react'
import 'dockview-react/dist/styles/dockview.css'
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
import TopArea from "./layout/app/TopArea";
import LeftArea from "./layout/app/LeftArea.jsx";

// ── 레이아웃 localStorage 저장/복원 (Dockview toJSON/fromJSON) ───────────────
const LAYOUT_STORAGE_KEY = 'pms-layout'

function saveLayout(api) {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(api.toJSON()))
  } catch {}
}

function loadLayout() {
  try {
    const raw = localStorage.getItem(LAYOUT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

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

const components = Object.fromEntries(
    Object.entries(PANEL_COMPONENTS).map(([key, Comp]) => [
      key,
      ({ params }) => (
          <div className={`${key === 'dashboardPanel' ? styles.dashboardPanelWrap : styles.panelContentWrap} ${key === 'dashboardPanel' ? 'dashboard-panel-wrap' : ''}`}><Comp params={params} /></div>
      ),
    ])
)

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
  const [openPanels, setOpenPanels]     = useState(new Set());

  const [pipBlocked,     setPipBlocked]     = useState(false);

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

  // ── Dockview 준비 → 레이아웃 복원 ───────────────────────────────────────
  const onReady = useCallback((event) => {
    apiRef.current = event.api
    const saved = loadLayout()

    if (saved) {
      // 저장된 레이아웃 복원 (탭 순서·분할·활성 탭 전부 포함)
      try {
        event.api.fromJSON(saved)
        setOpenPanels(new Set(event.api.panels.map(p => p.id)))
      } catch {
        // 복원 실패 시 (컴포넌트 불일치 등) 기본 대시보드로 폴백
        event.api.addPanel({ id:'dashboardPanel', component:'dashboardPanel', title:'대시보드' })
        setOpenPanels(new Set(['dashboardPanel']))
      }
    } else {
      event.api.addPanel({ id:'dashboardPanel', component:'dashboardPanel', title:'대시보드' })
      setOpenPanels(new Set(['dashboardPanel']))
    }

    // 레이아웃 변경 시마다 저장
    event.api.onDidAddPanel(()          => saveLayout(event.api))
    event.api.onDidRemovePanel(p => {
      setOpenPanels(prev => { const s = new Set(prev); s.delete(p.id); return s })
      saveLayout(event.api)
    })
    event.api.onDidActivePanelChange(() => saveLayout(event.api))
    event.api.onDidLayoutChange(()      => saveLayout(event.api))
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
      <TopArea />

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
        <div className={styles.dockviewWrap}>
          <DockviewReact
            className={theme==='dark' ? 'dv-theme-dark' : 'dv-theme-light'}
            onReady={onReady}
            components={components}
            disableFloatingGroups={false}
          />
        </div>
      </div>
    </div>
    </>
  )
}
