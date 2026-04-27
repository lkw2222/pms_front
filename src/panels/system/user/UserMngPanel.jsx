import React, {useEffect, useState} from 'react';
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
    const [rowData, setRowData] = useState([]);
    const [count, setCount] = useState(0);

    // 샘플 데이터 로드
    useEffect(() => {
        // 실제로는 fetch('/api/users').then(...)
        setCount(10);
        setRowData([
            {
                userId: 'xor80584',
                userName: '박영휘',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '01053926757',
                auth: 'ROLE_USER',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '2026-04-03',
                useYn: 'Y',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'kdongkim',
                userName: '김길동',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '김길동',
                auth: 'ROLE_SYSTEM',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'jchulyang',
                userName: '양진철',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: 'didwlscjf',
                auth: 'ROLE_USER',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'yhpark5',
                userName: '박용훈',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '19887602',
                auth: 'ROLE_MNG',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'yhpark4',
                userName: '박용훈',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '19887602',
                auth: 'ROLE_MNG',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'yhpark3',
                userName: '박용훈',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '19887602',
                auth: 'ROLE_MNG',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'yhpark2',
                userName: '박용훈',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '19887602',
                auth: 'ROLE_MNG',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'yhpark1',
                userName: '박용훈',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '19887602',
                auth: 'ROLE_MNG',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'yhpark13',
                userName: '박용훈',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '19887602',
                auth: 'ROLE_MNG',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'yhpark12',
                userName: '박용훈',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '19887602',
                auth: 'ROLE_MNG',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
        ]);
    }, []);

    return (
        <ErrorBoundary>
            <div className="grid-wrap">
                <UserMngSearchFeature rowData={rowData} count={count}/>
                <UserMngGridFeature rowData={rowData} count={count}/>
            </div>
        </ErrorBoundary>
    )
}