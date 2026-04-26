import React, {useCallback} from 'react';
import { useAppStore } from '@/store/useAppStore.js';
import { setDockviewMenu } from '@/store/dockviewStore.js';
import {
    BarChart2,
    ChevronDown,
    ChevronLeft,
    ChevronRight as ChevRight,
    ChevronRight,
    ClipboardCheck,
    HelpCircle,
    LayoutDashboard, Map, MonitorCog,
    PieChart, PlayCircle, ScrollText, Settings,
    UtilityPole, Wind, ChartBarDecreasing
} from "lucide-react";

import styles from '@/assets/styles/layout.module.css'

const WindPoleIcon = ({ size = 24, color = "currentColor", windColor = "currentColor" }) => (
  <div style={{ position: "relative", width: size * 1.4, height: size, display: "inline-flex" }}>
    <UtilityPole size={size} color={color} />
    <Wind size={size * 0.75} color={windColor}
      style={{ position: "absolute", right: 0, bottom: 0 }} />
  </div>
);

// ── 사이드바 메뉴 ──────────────────────────────────────────────────────────────
const MENU_GROUPS = [
    { id:'dashboard', label:'대시보드', icon:LayoutDashboard, children:[
            { id:'dashboardPanel', label:'대시보드',    icon:LayoutDashboard, component:'dashboardPanel', pip:false },
        ]},
    { id:'wlc', label:'풍하중 평가', icon:WindPoleIcon, children:[
            { id:'wlcBatchExecutePanel', label:'풍하중 배치 실행(수동)',   component:'wlcBatchExecutePanel' },
            { id:'wlcExecuteLogPanel', label:'풍하중 실행로그 조회',     component:'wlcExecuteLogPanel' },
            { id:'wlcResultPanel', label:'풍하중 평가결과',             icon:BarChart2,   component:'wlcResultPanel' },
            { id:'wlcResDistPanel', label:'풍하중 평가결과 분포도',         icon:PieChart,    component:'wlcResDistPanel' },
        ]},
    { id:'scc', label:'진단우선순위 평가', icon:ChartBarDecreasing, children:[
            { id:'sccBatchExePanel', label:'SCC 배치 실행(수동)',        icon:PlayCircle,      component:'sccBatchExePanel' },
            { id:'sccExeLogPanel', label:'SCC 실행로그 조회',          icon:ScrollText,      component:'sccExeLogPanel' },
            { id:'sccResPanel', label:'진단우선순위 결과조회',           icon:ClipboardCheck,  component:'sccResPanel' },
            { id:'sccResDistPanel', label:'SCC 종합평가 분포도',           icon:ClipboardCheck,  component:'sccResDistPanel' },
            { id:'sccCalcSimPanel', label:'SCC 산출 시뮬레이션',           icon:ClipboardCheck,  component:'sccCalcSimPanel' },
        ]},
    { id:'base', label:'기초정보', icon:ChartBarDecreasing, children:[
            { id:'baseInfoPanel', label:'기초 정보 현황',       component:'baseInfoPanel' },
            { id:'lnkPgmStsPanel', label:'연계 프로그램 현황',      component:'lnkPgmStsPanel' },
            { id:'gisSyncHistPanel', label:'GIS 연계 현황',  component:'gisSyncHistPanel' },
            { id:'sccEvalItmMngPanel', label:'SCC 평가 인자관리',  component:'sccEvalItmMngPanel' },
          /*  { id:'', label:'SCC 평가기준 점수관리',  component:'' },*/
            { id:'sccEvalGrdMngPanel', label:'SCC 평가등급 관리',  component:'sccEvalGrdMngPanel' },
        ]},
    { id:'system', label:'시스템', icon:Settings, children:[
            { id:'userMngPanel', label:'이용자 관리', component:'userMngPanel'},
            { id:'userConLogPanel', label:'접속로그 조회', component:'userConLogPanel'},
            { id:'menuMngPanel', label:'메뉴 관리', component:'menuMngPanel'},
            { id:'authMngPanel', label:'권한 설정', component:'authMngPanel' },
            { id:'jobCodePanel', label:'업무분류코드 관리', component:'jobCodePanel'},
            { id:'commonCodePanel', label:'공통코드 관리', component:'commonCodePanel'},
            { id:'noticePanel', label:'공지사항', component:'noticePanel'},
            { id:'programRegPanel', label:'프로그램 등록 관리', component:'programRegPanel'}
        ]},
    { id:'sample', label:'개발 샘플', icon:MonitorCog, children:[
            { id:'samplePanel',       label:'컴포넌트',       icon:MonitorCog, component:'samplePanel' },
            { id:'readmePanel',       label:'개발 표준 문서', icon:HelpCircle,      component:'readmePanel' },
            { id:'gridPanel_sample',  label:'그리드 샘플',    icon:BarChart2,       component:'gridPanel'   },
            { id:'gisPanel_sample',   label:'지도 샘플',      icon:Map,             component:'gisPanel'    },
            { id:'archivePanel',   label:'자료실 샘플',      icon:Map,             component:'archivePanel'    },

        ]},
]

// ── 사이드바 그룹 ──────────────────────────────────────────────────────────────
function SidebarGroup({ group, sidebarOpen, openPanels, onOpen, onPip, expandedGroups, toggleGroup }) {
    const isExpanded = expandedGroups.has(group.id);
    const hasActive  = group.children.some(c => openPanels.has(c.id));

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
                            ? <ChevronDown size={14} style={{ flexShrink:0, opacity:0.8 }} />
                            : <ChevRight   size={14} style={{ flexShrink:0, opacity:0.8 }} />
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

export default function LeftArea({ apiRef }) {
    const { sidebarOpen, toggleSidebar, openPanels, setOpenPanels,
            expandedGroups: expandedGroupsArr, toggleExpandedGroup } = useAppStore();
    const [pipBlocked, setPipBlocked] = React.useState(false);
    const expandedGroups = new Set(expandedGroupsArr);

    // MENU_GROUPS 는 모듈 상수 → 항상 동일 값이므로 렌더마다 호출해도 안전.
    // useEffect([]) 는 Vite HMR 이 dockviewStore.js 를 재실행할 때 다시 호출되지 않으므로
    // 렌더 함수에서 직접 호출해 HMR 후에도 _menuGroup 이 항상 최신 상태를 유지하게 한다.
    setDockviewMenu(MENU_GROUPS)

    const openPanel = useCallback((item) => {
        if (!apiRef.current) return;

        const existing = apiRef.current.panels.find(p => p.id === item.id);

        if (existing) { existing.focus(); return }

        apiRef.current.addPanel({ id:item.id, component:item.component, title:item.label });
        setOpenPanels(prev => new Set([...prev, item.id]));
    }, []);

    const openPip = useCallback((item) => {
        const popup = window.open(
            `${window.location.origin}/?panel=${item.id}`,
            item.label,
            'width=900,height=650,resizable=yes,scrollbars=yes'
        )
        if (!popup) { setPipBlocked(true); setTimeout(() => setPipBlocked(false), 4000) }
    }, []);

    const toggleGroup = (id) => toggleExpandedGroup(id);

    return (
        <aside className={styles.sidebar}
               style={{ width: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)' }}>
            <nav className={styles.sidebarNav}>
                {sidebarOpen && <div className={styles.sidebarNavLabel}>KEPRI PMS SYSTEM</div>}
                {MENU_GROUPS.map(group => (
                    <SidebarGroup key={group.id} group={group} sidebarOpen={sidebarOpen}
                                  openPanels={openPanels} onOpen={openPanel} onPip={openPip}
                                  expandedGroups={expandedGroups} toggleGroup={toggleGroup} />
                ))}
            </nav>
            <div className={styles.sidebarFoot}>
                <button className={styles.collapseBtn} onClick={toggleSidebar}
                        style={{ justifyContent: sidebarOpen ? 'flex-end' : 'center' }}>
                    {sidebarOpen && <span>접기</span>}
                    {sidebarOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
                </button>
            </div>
        </aside>
    )
}