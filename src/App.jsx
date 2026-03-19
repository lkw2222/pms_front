import React, { useRef, useCallback, useState } from 'react'
import { DockviewReact } from 'dockview-react'
import 'dockview-react/dist/styles/dockview.css'
import { useAppStore } from '@/store/useAppStore.js'

import DashboardPanel from '@/panels/dashboard/DashboardPanel.jsx'
import LoginPanel     from '@/panels/login/LoginPanel.jsx'
import GridPanel      from '@/panels/grid/GridPanel.jsx'
import GisPanel       from '@/panels/gis/GisPanel.jsx'
import SamplePanel    from '@/panels/sample/SamplePanel.jsx'
import ReadmePanel    from '@/panels/readme/ReadmePanel.jsx'

import {
  FileSpreadsheet, Map, LogIn, Menu, Sun, Moon, Bell, HelpCircle,
  ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevRight,
  LayoutDashboard, FilePlus, BarChart2, Layers, Settings,
  X, PanelLeftClose,
} from 'lucide-react'

import styles from '@/styles/layout.module.css'

// ── 패널 컴포넌트 등록 ────────────────────────────────────────────────────────
const PANEL_COMPONENTS = {
  dashboardPanel: DashboardPanel,
  loginPanel:     LoginPanel,
  gridPanel:      GridPanel,
  gridPanel2:     GridPanel,
  gisPanel:       GisPanel,
  gisPanel2:      GisPanel,
  samplePanel:    SamplePanel,
  readmePanel:    ReadmePanel,
  settingPanel:   SamplePanel,
}

const components = Object.fromEntries(
  Object.entries(PANEL_COMPONENTS).map(([key, Comp]) => [
    key,
    () => <div style={{ height:'100%', overflow:'auto', background:'var(--color-bg-primary)' }}><Comp /></div>,
  ])
)

// ── 사이드바 메뉴 ──────────────────────────────────────────────────────────────
const MENU_GROUPS = [
  { id:'dashboard', label:'대시보드', icon:LayoutDashboard, children:[
    { id:'dashboardPanel', label:'대시보드',    icon:LayoutDashboard, component:'dashboardPanel', pip:false },
  ]},
  { id:'work', label:'업무관리', icon:FileSpreadsheet, children:[
    { id:'gridPanel',  label:'업무 현황', icon:BarChart2, component:'gridPanel' },
    { id:'gridPanel2', label:'업무 등록', icon:FilePlus,  component:'gridPanel' },
  ]},
  { id:'gis', label:'GIS', icon:Map, children:[
    { id:'gisPanel',  label:'지도',      icon:Map,    component:'gisPanel' },
    { id:'gisPanel2', label:'공간 분석', icon:Layers, component:'gisPanel' },
  ]},
  { id:'sample', label:'개발 샘플', icon:LayoutDashboard, children:[
    { id:'samplePanel', label:'컴포넌트',       icon:LayoutDashboard, component:'samplePanel' },
    { id:'readmePanel', label:'개발 표준 문서', icon:HelpCircle,      component:'readmePanel' },
  ]},
  { id:'system', label:'시스템', icon:Settings, children:[
    { id:'loginPanel',   label:'로그인', icon:LogIn,    component:'loginPanel',  pip:false },
    { id:'settingPanel', label:'설정',   icon:Settings, component:'samplePanel', pip:false },
  ]},
]

// ── 사이드바 그룹 ──────────────────────────────────────────────────────────────
function SidebarGroup({ group, sidebarOpen, openPanels, onOpen, onPip, expandedGroups, toggleGroup }) {
  const isExpanded = expandedGroups.has(group.id)
  const hasActive  = group.children.some(c => openPanels.has(c.id))

  return (
    <div className={styles.menuGroup}>
      <button
        onClick={() => sidebarOpen && toggleGroup(group.id)}
        className={[styles.menuGroupHeader, hasActive ? styles.active : ''].join(' ')}
        style={{ padding: sidebarOpen ? '7px 10px' : '8px', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
      >
        <group.icon size={14} style={{ flexShrink:0 }} />
        {sidebarOpen && (
          <>
            <span className={styles.menuGroupLabel}>{group.label}</span>
            {isExpanded
              ? <ChevronDown size={12} style={{ flexShrink:0, opacity:0.6 }} />
              : <ChevRight   size={12} style={{ flexShrink:0, opacity:0.6 }} />
            }
          </>
        )}
      </button>

      {sidebarOpen && isExpanded && (
        <div className={styles.menuChildren}>
          {group.children.map(item => {
            const active = openPanels.has(item.id)
            return (
              <button key={item.id}
                onClick={() => onOpen(item)}
                className={[styles.menuItem, active ? styles.active : ''].join(' ')}
              >
                <div className={[styles.menuDot, active ? styles.active : ''].join(' ')} />
                <span style={{ flex:1 }}>{item.label}</span>
                {item.pip !== false && (
                  <span className={styles.pipBtn}
                    onClick={e => { e.stopPropagation(); onPip(item) }}>
                    PiP
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
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
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useAppStore()
  const [openPanels,     setOpenPanels]     = useState(new Set())
  const [expandedGroups, setExpandedGroups] = useState(new Set(['work','gis','sample','system']))
  const [pipBlocked,     setPipBlocked]     = useState(false)

  const toggleGroup = (id) => setExpandedGroups(prev => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s
  })

  const onReady = useCallback((event) => {
    apiRef.current = event.api
    event.api.addPanel({ id:'dashboardPanel', component:'dashboardPanel', title:'대시보드' })
    setOpenPanels(new Set(['dashboardPanel']))
    event.api.onDidRemovePanel(p => setOpenPanels(prev => { const s = new Set(prev); s.delete(p.id); return s }))
  }, [])

  const openPanel = useCallback((item) => {
    if (!apiRef.current) return
    const existing = apiRef.current.panels.find(p => p.id === item.id)
    if (existing) { existing.focus(); return }
    apiRef.current.addPanel({ id:item.id, component:item.component, title:item.label })
    setOpenPanels(prev => new Set([...prev, item.id]))
  }, [])

  const openPip = useCallback((item) => {
    const popup = window.open(
      `${window.location.origin}/?panel=${item.id}`,
      item.label,
      'width=900,height=650,resizable=yes,scrollbars=yes'
    )
    if (!popup) { setPipBlocked(true); setTimeout(() => setPipBlocked(false), 4000) }
  }, [])

  const closeAllPanels   = useCallback(() => [...(apiRef.current?.panels??[])].forEach(p => p.api.close()), [])
  const closeActivePanel = useCallback(() => apiRef.current?.activePanel?.api.close(), [])

  return (
    <div className={styles.appRoot}>

      {/* ── 탑바 ── */}
      <header className={styles.topbar}>
        <button className={styles.iconBtn} onClick={() => setSidebarOpen(o => !o)}>
          <Menu size={16} />
        </button>

        <div className={styles.topbarLogo}>
          <div className={styles.topbarLogoIcon}>P</div>
          <div>
            <div className={styles.topbarLogoTitle}>PMS SYSTEM</div>
            <div className={styles.topbarLogoSub}>Integrated Platform</div>
          </div>
        </div>

        <div className={styles.topbarRight}>
          {openPanels.size > 0 && (
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
          <button className={styles.iconBtn}>
            <Bell size={15} />
            <span className={styles.notiBadge} />
          </button>
          <div className={styles.avatar}>A</div>
        </div>
      </header>

      <div className={styles.body}>

        {/* ── 사이드바 ── */}
        <aside className={styles.sidebar}
          style={{ width: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)' }}>
          <nav className={styles.sidebarNav}>
            {sidebarOpen && <div className={styles.sidebarNavLabel}>Navigation</div>}
            {MENU_GROUPS.map(group => (
              <SidebarGroup key={group.id} group={group} sidebarOpen={sidebarOpen}
                openPanels={openPanels} onOpen={openPanel} onPip={openPip}
                expandedGroups={expandedGroups} toggleGroup={toggleGroup} />
            ))}
          </nav>
          <div className={styles.sidebarFoot}>
            <button className={styles.collapseBtn} onClick={() => setSidebarOpen(o => !o)}
              style={{ justifyContent: sidebarOpen ? 'flex-end' : 'center' }}>
              {sidebarOpen && <span>접기</span>}
              {sidebarOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            </button>
          </div>
        </aside>

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
  )
}
