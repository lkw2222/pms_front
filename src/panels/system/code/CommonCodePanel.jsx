import React from "react";
import ErrorBoundary from "@/components/feedback/ErrorBoundary.jsx";
import layout from '@/assets/styles/layout.module.css';

/**
 * 공통코드 패널.
 *
 * @author LKW
 * @since 2026-04-24
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-24 | LKW    | 최초 작성 |
 */
export default function CommonCodePanel() {
    return (
        <ErrorBoundary>
            <div>공통코드</div>
        </ErrorBoundary>
    )
}