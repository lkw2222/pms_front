import React, {useCallback, useState} from 'react';
import { useAppStore } from '@/store/useAppStore.js';
import {
    AlertTriangle,
    Archive,
    BarChart2,
    Calculator,
    ChevronDown,
    ChevronLeft,
    ChevronRight as ChevRight,
    ChevronRight,
    ClipboardCheck,
    FileSpreadsheet, HelpCircle,
    LayoutDashboard, ListOrdered, LogIn, Map, MapPin, MonitorCog,
    PieChart, PlayCircle, ScrollText, Settings,
    TableProperties, Trophy,
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
            { id:'wlc_1', label:'풍하중 배치 실행(수동)', icon:PlayCircle,  component:'wlcBatchExecutePanel' },
            { id:'wlc_2', label:'풍하중 실행로그 조회',   icon:ScrollText,  component:'wlcExecuteLogPanel' },
            { id:'wlc_3', label:'풍하중 결과',             icon:BarChart2,   component:'emptyPanel' },
            { id:'wlc_4', label:'평가결과 분포도',         icon:PieChart,    component:'wlcResultDistributionPanel' },
        ]},
    { id:'scc', label:'진단우선수위 평가', icon:ChartBarDecreasing, children:[
            { id:'scc_1', label:'SCC 배치 실행(수동)',        icon:PlayCircle,      component:'emptyPanel' },
            { id:'scc_2', label:'SCC 실행로그 조회',          icon:ScrollText,      component:'emptyPanel' },
            { id:'scc_3', label:'SCC 종합평가 결과',           icon:ClipboardCheck,  component:'emptyPanel' },
            { id:'scc_4', label:'종합평가 결과조회',          icon:TableProperties, component:'emptyPanel' },
            { id:'scc_5', label:'이상치 설비 목록조회',       icon:AlertTriangle,   component:'emptyPanel' },
            { id:'scc_6', label:'진단비용산출 시물레이션',   icon:Calculator,      component:'emptyPanel' },
            { id:'scc_7', label:'GIS 기반 조회',              icon:MapPin,          component:'emptyPanel' },
            { id:'scc_8', label:'SCC 등급별 조회',            icon:ListOrdered,     component:'emptyPanel' },
            { id:'scc_9', label:'진단우선순위 결과조회',      icon:Trophy,          component:'emptyPanel' },
        ]},
    { id:'sample', label:'개발 샘플', icon:MonitorCog, children:[
            { id:'samplePanel',       label:'컴포넌트',       icon:MonitorCog, component:'samplePanel' },
            { id:'readmePanel',       label:'개발 표준 문서', icon:HelpCircle,      component:'readmePanel' },
            { id:'gridPanel_sample',  label:'그리드 샘플',    icon:BarChart2,       component:'gridPanel'   },
            { id:'gisPanel_sample',   label:'지도 샘플',      icon:Map,             component:'gisPanel'    },
        ]},
    { id:'system', label:'시스템', icon:Settings, children:[
            { id:'archivePanel',      label:'자료실',     icon:Archive,      component:'archivePanel'      },
            { id:'windPressurePanel', label:'전주 풍하중', icon:FileSpreadsheet, component:'windPressurePanel' },
            { id:'loginPanel',        label:'로그인',     icon:LogIn,        component:'loginPanel',  pip:false },
            { id:'settingPanel',      label:'설정',       icon:Settings,     component:'samplePanel', pip:false },
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
    const {sidebarOpen, toggleSidebar, openPanels, setOpenPanels} = useAppStore();
    const [pipBlocked,     setPipBlocked]     = useState(false);
    const [expandedGroups, setExpandedGroups] = useState(new Set(['wlc','scc','sample','system']));

    const openPanel = useCallback((item) => {
        if (!apiRef.current) return;

        const existing = apiRef.current.panels.find(p => p.id === item.id);

        if (existing) { existing.focus(); return };

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

    const toggleGroup = (id) => setExpandedGroups(prev => {
        const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
    });

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