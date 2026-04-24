import React, {useEffect, useMemo, useState} from 'react';
import styles from './UserMngGridFeature.module.css';
import BasicGrid from "@/components/grid/BasicGrid.jsx";

/**
 * 이용자 관리 그리드 피쳐.
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
export default function UserMngGridFeature() {
    const [rowData, setRowData] = useState([]);

    // 샘플 데이터 로드
    useEffect(() => {
        // 실제로는 fetch('/api/users').then(...)
        setRowData([
            {
                userId: 'xor80584',
                userName: '박정희',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '01053926757',
                auth: 'SUPER',
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
                auth: 'SUPER',
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
                auth: 'SUPER',
                pwResetRequest: 'N',
                requestDate: '2026-04-03',
                processDate: '',
                useYn: 'N',
                createDate: '2026-04-03',
                updateDate: '2026-04-03',
                purpose: '운영관리',
            },
            {
                userId: 'yhpark',
                userName: '박용훈',
                headquarters: '충남',
                branch: '전력연구원',
                pwHint: '19887602',
                auth: 'SUPER',
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

    // 컬럼 정의
    const columnDefs = useMemo(() => [
        {
            // 체크박스 선택 + 확장 아이콘
            headerName: '',
            width: 50,
            pinned: 'left',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            sortable: false,
            filter: false,
        },
        { headerName: '아이디', field: 'userId', width: 110 },
        { headerName: '성명', field: 'userName', width: 80 },
        { headerName: '소속본부', field: 'headquarters', width: 90 },
        { headerName: '사업소', field: 'branch', width: 120 },
        { headerName: '비밀번호 힌트', field: 'pwHint', width: 130 },
        {
            headerName: '권한',
            field: 'auth',
            width: 80,
        },
        {
            headerName: 'PW 초기화 요청',
            field: 'pwResetRequest',
            minWidth: 150,
            wrapHeaderText: true,
            autoHeaderHeight: true,
        },
        { headerName: '신청일자', field: 'requestDate', width: 110 },
        { headerName: '처리일자', field: 'processDate', width: 110 },
        {
            headerName: '사용여부',
            field: 'useYn',
            width: 90,
        },
        { headerName: '최초등록일', field: 'createDate', width: 110 },
        { headerName: '최종수정일', field: 'updateDate', width: 110 },
        { headerName: '목적', field: 'purpose', width: 100 },
    ], []);

    return (
        <div className={styles.gridWrap} >
            <div className={styles.gridArea}>
                <BasicGrid
                    mode="paginate"
                    rowData={rowData}
                    colDefs={columnDefs}
                    rowSelection="multiple"
                    height="100%"
                    pageSize={10}
                    defaultColDef={{ sortable:true, resizable:true, filter:false, minWidth:80, flex:1 }}
                />
            </div>
        </div>
    )
}