import React, {useCallback, useState} from 'react';
import { useAppStore } from '@/store/useAppStore.js';
import {DockviewReact} from "dockview-react";

import styles from '@/styles/layout.module.css';

import DashboardPanel from '@/panels/dashboard/DashboardPanel.jsx';
import LoginPanel     from '@/panels/login/LoginPanel.jsx';
import GridPanel      from '@/panels/grid/GridPanel.jsx';
import GisPanel       from '@/panels/gis/GisPanel.jsx';
import SamplePanel    from '@/panels/sample/SamplePanel.jsx';
import ReadmePanel    from '@/panels/readme/ReadmePanel.jsx';
import ArchivePanel        from '@/panels/archive/ArchivePanel.jsx';
import WindPressurePanel   from '@/panels/windPressure/WindPressurePanel.jsx';

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

// ── 레이아웃 localStorage 저장/복원 (Dockview toJSON/fromJSON) ───────────────
const LAYOUT_STORAGE_KEY = 'pms-layout';

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

export default function ContentArea({ apiRef }) {
    const { theme } = useAppStore();
    const [openPanels, setOpenPanels] = useState(new Set());

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
        <div className={styles.dockviewWrap}>
            <DockviewReact
                className={theme==='dark' ? 'dv-theme-dark' : 'dv-theme-light'}
                onReady={onReady}
                components={components}
                disableFloatingGroups={false}
            />
        </div>
    )
}