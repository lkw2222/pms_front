import React                  from 'react';
import ErrorBoundary           from '@/components/feedback/ErrorBoundary.jsx';
import WlcResultDistributionSearchFeature from '@/features/wlc/wlcResultDistribution/WlcResultDistributionSearchFeature.jsx';
import WlcResultDistributionMapFeature from '@/features/wlc/wlcResultDistribution/WlcResultDistributionMapFeature.jsx';
import WlcResultDistributionMatrixFeature from '@/features/wlc/wlcResultDistribution/WlcResultDistributionMatrixFeature.jsx';
import WlcResultDistributionGridFeature from '@/features/wlc/wlcResultDistribution/WlcResultDistributionGridFeature.jsx';
import WlcResultDistributionPieFeature from '@/features/wlc/wlcResultDistribution/WlcResultDistributionPieFeature.jsx';
import WlcResultDistributionBarFeature from '@/features/wlc/wlcResultDistribution/WlcResultDistributionBarFeature.jsx';
import styles from '@/styles/wlc/wlcResultDistribution/WlcResultDistribution.module.css';

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
export default function WlcResultDistributionPanel() {
    return (
        <ErrorBoundary>
            <div className={styles.dashboard}>
                <div className={styles.header}><WlcResultDistributionSearchFeature /></div>
                <div className={styles.bottom}>
                    <div className={styles.left}>
                        <div className={styles.box}><WlcResultDistributionMapFeature /></div>
                        <div className={styles.box}><WlcResultDistributionGridFeature /></div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.box}><WlcResultDistributionMatrixFeature /></div>
                        <div className={styles.box}><WlcResultDistributionPieFeature /></div>
                        <div className={styles.box}><WlcResultDistributionBarFeature /></div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    )
}
