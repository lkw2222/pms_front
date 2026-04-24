import React from 'react';
import styles from './UserMngSearchFeature.module.css';
import SelectInput from "@/components/input/SelectInput";
import SearchInput from "@/components/input/SearchInput.jsx";
import { RotateCcw, Search} from "lucide-react";
import BasicButton from "@/components/button/BasicButton.jsx";

/**
 * 이용자 관리 검색 피쳐.
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
export default function UserMngSearchFeature() {
    return (
        <div className="panel-toolbar panel-toolbar-col">
            <div className={["panel-search-value", styles.filtersWrap].join(' ')}>
                <SelectInput
                    label="지역본부"
                    placeholder="지역본부 선택"
                />
                <SelectInput
                    label="사업소"
                    placeholder="사업소 선택"
                />
                <SelectInput
                    label="권한"
                    placeholder="권한 선택"
                />
                <SearchInput
                    label="검색"
                    options={[{label:"성명", value:"01"}, {label:"아이디", value:"02"}]}
                />
            </div>

            <div className="panel-search-function">
                <div className={styles.totalCount}>
                    <>총 <strong className={styles.cntStrong}>0 </strong>건</>
                </div>
                <div className={styles.searchBtns}>
                    <BasicButton label="초기화" icon={RotateCcw} variant="secondary" />
                    <BasicButton label="조회" icon={Search} variant="primary" />
                </div>
            </div>

        </div>
    )
}