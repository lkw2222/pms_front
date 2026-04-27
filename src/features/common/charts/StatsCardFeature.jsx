import React from 'react';
import styles from './StatsCardFeature.module.css';

/**
 * 통계 카드 카드 피쳐.
 *
 * @author LKW
 * @since 2026-04-24
 * @returns {JSX.Element}
 * @param Icon 아이콘
 * @param iconSize 아이콘크기
 * @param sub 서브내용
 * @param unit 단위
 * @param label 제목
 * @param value 메인내용
 * @param color 색상
 * @param isClickable (boolean false) 클릭여부
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-24 | LKW    | 최초 작성 |
 */
export default function StatsCardFeature({Icon, iconSize, sub, unit, label, value, color, isClickable = false}) {

    const borderStyle = color ? `3px solid ${color}` : `3px solid var(--color-accents)`;
    const bgStyle = color ?? 'var(--color-accents)';
    const wrapStyle = isClickable ? styles.cardClickWrap : styles.cardWrap;

    return (
        <div
            className={wrapStyle}
            style={{borderTop: borderStyle}}
        >
            {Icon && (
                <div className={styles.cardIcon} style={{background: bgStyle}}>
                    <Icon size={iconSize} />
                </div>
            )}
            <div className={styles.cardLabel}>{label}</div>
            <div className={styles.cardValue}>
                <span className={styles.cardValueText}>{value}</span>
                {unit && <span className={styles.cardValueUnit}>{unit}</span>}
            </div>
            {sub?.map((item, index) => (
                <div key={item.label ?? index} className={styles.cardSub}>
                    {item.label} <b className={styles.cardSubValue}>{item.value}</b>
                </div>
            ))}
        </div>
    );
}