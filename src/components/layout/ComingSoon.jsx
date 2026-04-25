import React from 'react';
import styles from './ComingSoon.module.css';
import { Blocks } from 'lucide-react'

/**
 * 화면 중비중 컴포넌트
 *
 * @author LKW
 * @since 2026-04-25
 * @param {string} title - 페이지 제목 (선택)
 * @param {string} message - 메인 메시지 (기본: 준비중입니다)
 * @param {string} description - 보조 설명 (선택)
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function ComingSoon({
                                       title,
                                       message = '준비중입니다.',
                                       description = '빠른 시일 내에 서비스를 제공하도록 하겠습니다.',
                                   }) {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                {/* 아이콘 */}
                <div className={styles.icon}>
                    <Blocks/>
                </div>

                {title && <div className={styles.title}>{title}</div>}
                <div className={styles.message}>{message}</div>
                <div className={styles.description}>{description}</div>
            </div>
        </div>
    );
}