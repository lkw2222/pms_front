import React                  from 'react';
import ErrorBoundary           from '@/components/feedback/ErrorBoundary.jsx';
import WlcResDistSearchFeature from '@/features/wlc/wlcResDist/WlcResDistSearchFeature.jsx';
import WlcResDistMapFeature from '@/features/wlc/wlcResDist/WlcResDistMapFeature.jsx';
import WlcResDistMatrixFeature from '@/features/wlc/wlcResDist/WlcResDistMatrixFeature.jsx';
import WlcResDistGridFeature from '@/features/wlc/wlcResDist/WlcResDistGridFeature.jsx';
import WlcResDistPieFeature from '@/features/wlc/wlcResDist/WlcResDistPieFeature.jsx';
import WlcResDistBarFeature from '@/features/wlc/wlcResDist/WlcResDistBarFeature.jsx';
import layout from '@/assets/styles/layout.module.css';

/**
 * 풍하중 실행로그 조회 패널.
 *
 * @author JDJ
 * @since 2026-04-20
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-20 | JDJ    | 최초 작성 |
 */
export default function WlcResDistPanel() {
    return (
        <ErrorBoundary>
            <div className="grid-wrap">
                <div className={layout.panelWrap}>
                    <div className={layout.panelLeft}>
                        <div className={layout.panelBox}><WlcResDistMapFeature /></div>
                        <div className={layout.panelBox}><WlcResDistGridFeature /></div>
                    </div>
                    <div className={layout.panelRight}>
                        <div className={layout.panelMinBox}><WlcResDistSearchFeature /></div>
                        <div className={layout.panelBox}><WlcResDistMatrixFeature /></div>
                        <div className={layout.panelBox}><WlcResDistPieFeature /></div>
                        <div className={layout.panelBox}><WlcResDistBarFeature /></div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}
