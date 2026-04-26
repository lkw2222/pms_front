import React, { useRef, useState } from 'react'
import ContentArea from "@/layout/app/ContentArea";
import TopArea from "@/layout/app/TopArea.jsx";
import LeftArea from "@/layout/app/LeftArea.jsx";

import LoginWidget  from '@/widgets/common/auth/LoginWidget.jsx'
import styles from '@/assets/styles/layout.module.css'

import DashboardPanel from '@/panels/dashboard/DashboardPanel.jsx';
import GridPanel      from '@/panels/demo/grid/GridPanel.jsx';
import GisPanel       from '@/panels/demo/gis/GisPanel.jsx';
import SamplePanel    from '@/panels/demo/sample/SamplePanel.jsx';
import ReadmePanel    from '@/panels/demo/readme/ReadmePanel.jsx';
import ArchivePanel             from '@/panels/demo/archive/ArchivePanel.jsx';
import WindPressurePanel        from '@/panels/demo/windPressure/WindPressurePanel.jsx';
import WlcBatchExePanel     from '@/panels/wlc/wlcBatchExe/WlcBatchExePanel.jsx';
import WlcExeLogPanel       from '@/panels/wlc/wlcExeLog/WlcExeLogPanel.jsx';
import WlcResPanel           from '@/panels/wlc/wlcRes/WlcResPanel.jsx';
import WlcResDistPanel from "@/panels/wlc/wlcResDist/WlcResDistPanel.jsx";

import SccBatchExePanel from "@/panels/scc/sccBatchExe/SccBatchExePanel.jsx"
import SccExeLogPanel from "@/panels/scc/sccExeLog/SccExeLogPanel.jsx"
import SccResPanel from "@/panels/scc/sccRes/SccResPanel.jsx"
import SccResDistPanel from "@/panels/scc/sccResDist/SccResDistPanel.jsx";
import SccCalcSimPanel from "@/panels/scc/sccClacSim/SccCalcSimPanel.jsx";

import BaseInfoPanel    from "@/panels/base/baseInfo/BaseInfoPanel.jsx";
import LnkPgmStsPanel   from "@/panels/base/lnkPgmSts/LnkPgmStsPanel.jsx";
import GisSyncHistPanel from "@/panels/base/gisSyncHist/GisSyncHistPanel.jsx";
import SccEvalItmMngPanel from "@/panels/base/sccEvalItmMng/SccEvalItmMngPanel";

import AuthMngPanel from "@/panels/system/auth/AuthMngPanel.jsx";
import NoticePanel from "@/panels/system/bbs/NoticePanel.jsx";
import CommonCodePanel from "@/panels/system/code/CommonCodePanel.jsx";
import JobCodePanel from "@/panels/system/code/JobCodePanel.jsx";
import MenuMngPanel from "@/panels/system/menu/MenuMngPanel.jsx";
import ProgramRegPanel from "@/panels/system/program/ProgramRegPanel.jsx";
import UserMngPanel from "@/panels/system/user/UserMngPanel.jsx";

import EmptyPanel       from '@/panels/demo/sample/EmptyPanel.jsx';


// ── 패널 컴포넌트 등록 ────────────────────────────────────────────────────────
const PANEL_COMPONENTS = {
    dashboardPanel:   DashboardPanel,
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


    wlcBatchExecutePanel: WlcBatchExePanel,
    wlcExecuteLogPanel:   WlcExeLogPanel,
    wlcResultPanel:       WlcResPanel,
    wlcResDistPanel: WlcResDistPanel,


    sccBatchExePanel:   SccBatchExePanel,
    sccExeLogPanel:     SccExeLogPanel,
    sccResPanel:        SccResPanel,
    sccResDistPanel : SccResDistPanel,
    sccCalcSimPanel : SccCalcSimPanel,


    baseInfoPanel    : BaseInfoPanel,
    lnkPgmStsPanel   : LnkPgmStsPanel,
    gisSyncHistPanel : GisSyncHistPanel,
    sccEvalItmMngPanel : SccEvalItmMngPanel,


    authMngPanel : AuthMngPanel,
    noticePanel : NoticePanel,
    commonCodePanel : CommonCodePanel,
    jobCodePanel : JobCodePanel,
    menuMngPanel : MenuMngPanel,
    programRegPanel : ProgramRegPanel,
    userMngPanel : UserMngPanel,

    emptyPanel:         EmptyPanel,
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
export default function AppLayout() {
    if (new URLSearchParams(window.location.search).get('panel')) return <PanelOnlyApp />

    const apiRef = useRef(null)
    const [pipBlocked,     setPipBlocked]     = useState(false)

    return (
        <>
            <LoginWidget />
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
                    <ContentArea apiRef={apiRef} components={components} />
                </div>
            </div>
        </>
    )
}