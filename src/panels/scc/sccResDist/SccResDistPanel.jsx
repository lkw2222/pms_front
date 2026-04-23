import React                  from 'react';
import ErrorBoundary           from '@/components/feedback/ErrorBoundary.jsx';
import DateRangeFilterFeature from '@/features/common/filter/DateRangeFilterFeature.jsx';
import MapFilterFeature from '@/features/common/charts/MapFilterFeature.jsx';
import LineBarFeature from '@/features/common/charts/LineBarFeature.jsx';
import DistMatrixFeature from '@/features/common/charts/DistMatrixFeature.jsx';
import SccResDistGridFeature from '@/features/scc/sccResDist/SccResDistGridFeature.jsx';
import SccResDistPieFeature from '@/features/scc/sccResDist/SccResDistPieFeature.jsx';

import layout from '@/assets/styles/layout.module.css';

/**
 * SCC 평가결과 분포도 조회 패널.
 *
 * @author LKW
 * @since 2026-04-20
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-20 | LKW    | 최초 작성 |
 */
export default function SccResDistPanel() {
    return (
        <ErrorBoundary>
            <div className="grid-wrap">
                <div className={layout.panelWrap}>
                    <div className={layout.panelLeft}>
                        <div className={layout.panelBox}><MapFilterFeature /></div>
                        <div className={layout.panelBox}><SccResDistGridFeature /></div>
                    </div>
                    <div className={layout.panelRight}>
                        <div className={layout.panelMinBox}><DateRangeFilterFeature /></div>
                        <div className={layout.panelBox}><DistMatrixFeature /></div>
                        <div className={layout.panelBox}><SccResDistPieFeature /></div>
                        <div className={layout.panelBox}><LineBarFeature /></div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}
