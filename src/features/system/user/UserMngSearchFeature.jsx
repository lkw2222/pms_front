import React from 'react';
import styles from './UserMngSearchFeature.module.css';
import SelectInput from "@/components/input/SelectInput";
import SearchInput from "@/components/input/SearchInput.jsx";
import {RotateCcw, Search, Users, UserX, UserRoundCheck, UserRoundCog} from "lucide-react";
import BasicButton from "@/components/button/BasicButton.jsx";
import StatsCardFeature from "@/features/common/charts/StatsCardFeature.jsx"
import { GRADE_COLOR } from '@/constants/gradeConst.js'

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
export default function UserMngSearchFeature({count}) {
    return (
        <div className="panel-toolbar panel-toolbar-col">
            <div className="panel-search-value">
                <div className={styles.cardWrap}>
                    <StatsCardFeature
                        label="전체 이용자"
                        value={count}
                        unit="명"
                        Icon={Users}
                        iconSize="17"
                        isClickable={true}
                    />
                    <StatsCardFeature
                        label="사용중 이용자"
                        value="5"
                        unit="명"
                        Icon={UserRoundCheck}
                        iconSize="17"
                        color={GRADE_COLOR.B}
                        isClickable={true}
                    />
                    <StatsCardFeature
                        label="미사용 이용자"
                        value="5"
                        unit="명"
                        Icon={UserX}
                        iconSize="17"
                        color={GRADE_COLOR.S}
                        isClickable={true}
                    />
                    <StatsCardFeature
                        label="PW 초기화 요청 이용자"
                        value="1"
                        unit="명"
                        Icon={UserRoundCog}
                        iconSize="17"
                        color={GRADE_COLOR.A}
                        isClickable={true}
                    />
                </div>
            </div>

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
                <div></div>
                <div className={styles.searchBtns}>
                    <BasicButton label="초기화" icon={RotateCcw} variant="secondary" />
                    <BasicButton label="조회" icon={Search} variant="primary" />
                </div>
            </div>

        </div>
    )
}