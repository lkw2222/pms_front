import React, {useCallback} from 'react';
import { useAppStore }    from '@/store/useAppStore.js';
import { setDockviewApi } from '@/store/dockviewStore.js';
import {DockviewReact} from "dockview-react";
import styles from '@/assets/styles/layout.module.css';
import { debounce } from 'lodash'

// ── 대시보드 고정 탭 (× 버튼 없음) ─────────────────────────────────────────
function LockedTab({ api }) {
    return (
        <div className="dv-default-tab" style={{ paddingRight: 10 }}>
            <span className="dv-default-tab-content">{api.title}</span>
        </div>
    )
}
const TAB_COMPONENTS = { lockedTab: LockedTab }

// ── 레이아웃 localStorage 저장/복원 (Dockview toJSON/fromJSON) ───────────────
const LAYOUT_STORAGE_KEY = 'pms-layout';

function saveLayout(api) {
    try {
        localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(api.toJSON()))
    } catch {}
}

const debouncedSave = debounce((api) => {
  saveLayout(api)
}, 300)

function loadLayout() {
    try {
        const raw = localStorage.getItem(LAYOUT_STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

const ContentArea = React.memo(function ContentArea({ apiRef, components }) {
    const setOpenPanels = useAppStore(s => s.setOpenPanels)


    // ── Dockview 준비 → 레이아웃 복원 ───────────────────────────────────────
    const onReady = useCallback((event) => {
        apiRef.current = event.api
        setDockviewApi(event.api)
        const saved = loadLayout()

        const addDashboard = (api) =>
            api.addPanel({ id:'dashboardPanel', component:'dashboardPanel', title:'대시보드', tabComponent:'lockedTab' })

        if (saved) {
            // 저장된 레이아웃 복원 (탭 순서·분할·활성 탭 전부 포함)
            try {
                event.api.fromJSON(saved)
                setOpenPanels(new Set(event.api.panels.map(p => p.id)))
                // 복원된 레이아웃에 대시보드가 없으면 추가
                if (!event.api.panels.find(p => p.id === 'dashboardPanel')) {
                    addDashboard(event.api)
                }
            } catch {
                // 복원 실패 시 (컴포넌트 불일치 등) 기본 대시보드로 폴백
                addDashboard(event.api)
                setOpenPanels(new Set(['dashboardPanel']))
            }
        } else {
            addDashboard(event.api)
            setOpenPanels(new Set(['dashboardPanel']))
        }

        // 레이아웃 변경 시마다 저장
        event.api.onDidAddPanel((p) => {
            setOpenPanels(prev => new Set([...prev, p.id]))
            saveLayout(event.api)
        })
        event.api.onDidRemovePanel(p => {
            setOpenPanels(prev => { const s = new Set(prev); s.delete(p.id); return s })
            // 대시보드가 닫혔으면 즉시 재추가
            if (p.id === 'dashboardPanel') addDashboard(event.api)
            saveLayout(event.api)
        })
        event.api.onDidActivePanelChange(() => debouncedSave(event.api))
        event.api.onDidLayoutChange(()      => debouncedSave(event.api))
    }, [apiRef, setOpenPanels])

    return (
        <div className={styles.dockviewWrap}>
            <DockviewReact
                className="dv-theme-dark"
                onReady={onReady}
                components={components}
                tabComponents={TAB_COMPONENTS}
                disableFloatingGroups={false}
            />
        </div>
    )
})
export default ContentArea