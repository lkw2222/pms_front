import React from 'react';
import styles from './DashboardCardFeature.module.css';

export default function DashboardCardFeature({data}) {
    const {
        Icon,
        iconSize,
        sub,
        unit,
        label,
        value,
        color
    } = {...data};

    const SubItems = sub?.map((_s) => (
        <div className={styles.cardSub}>{_s?.label} <b className={styles.cardSubValue}>{_s?.value}</b></div>
    ));

    return (
        <div className={styles.cardWrap} style={{borderTop: color?`3px solid ${color}`:`3px solid var(--color-accents)`}}>
            {Icon && (
                <div className={styles.cardIcon} style={{background: color?`${color}`:`var(--color-accents);`}}>
                    <Icon size={iconSize} />
                </div>
            )}
            <div className={styles.cardLabel} >{label}</div>
            <div className={styles.cardValue} >
                <span className={styles.cardValueText} >{value}</span>
                {unit && <span className={styles.cardValueUnit} >{unit}</span>}
            </div>

            {SubItems}
        </div>
    )
}