import React, { useState } from 'react';
import DateInput          from '@/components/input/DateInput.jsx';
import styles             from './DateRangeFilterFeature.module.css';

const INIT_SEARCH = { bonbu:'', sabupso:'', dateFrom:'', dateTo:'', searchType:'id', searchValue:'' }

/**
 * 풍하중 평과결과 분포도 검색 폼
 * 풍하중 평과결과 분포 조회 의 검색조건이 있는 폼
 *
 * @author LKW
 * @since 2026-04-22
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-22 | LKW    | 최초 작성 |
 */
export default function DateRangeFilterFeature() {

    const [search,  setSearch]  = useState(INIT_SEARCH);

    return (
        <div className={styles.wrap}>
            <DateInput
                placeholder="조회기간(시작)"
                value={search.dateFrom}
                onChange={v => setSearch(s => ({ ...s, dateFrom: v }))}
            />
            <DateInput
                placeholder="조회기간(종료)"
                value={search.dateTo}
                onChange={v => setSearch(s => ({ ...s, dateTo: v }))}
            />
        </div>
    )
}