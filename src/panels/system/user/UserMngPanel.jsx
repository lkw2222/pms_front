import React from 'react';
import ErrorBoundary from "@/components/feedback/ErrorBoundary.jsx";
import UserMngSearchFeature from "@/features/system/user/UserMngSearchFeature.jsx";
import UserMngGridFeature from "@/features/system/user/UserMngGridFeature.jsx";

/**
 * 이용자 관리 패널.
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
export default function UserMngPanel() {
    return (
        <ErrorBoundary>
            <div className="grid-wrap">
                <UserMngSearchFeature/>
                <UserMngGridFeature/>
            </div>
        </ErrorBoundary>
    )
}