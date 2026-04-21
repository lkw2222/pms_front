import React from 'react'
import {Pencil, Lock, Save, X, UserPen} from 'lucide-react'
import TextInput from "@/components/input/TextInput";
import SelectInput from "@/components/input/SelectInput";
import Textarea from "@/Components/input/Textarea";
import BasicButton from "@/Components/button/BasicButton";
import {useAppStore} from "@/store/useAppStore.js";

export default function MyPageWidget({ onClose, styles }) {

    const { user } = useAppStore();

    return (
        <div className={styles.widgetBg} onClick={onClose} >
            <div className={styles.widgetWrap} onClick={(e) => e.stopPropagation()} >
                {/*헤더*/}
                <div className={styles.widgetHeader}>
                    <UserPen size={14} className={styles.widgetHeaderIcon} />
                    <span className={styles.widgetHeaderText}>마이 페이지</span>
                </div>

                {/*바디*/}
                <div className={styles.widgetBody}>
                    <TextInput
                        label="ID"
                        type="text"
                        value={user?.name ?? '김담당'}
                        readonly
                    />
                    <TextInput
                        label="현재 비밀번호"
                        type="password"
                        placeholder="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        isNotNull
                        regex={/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/}
                        errorMessage="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        icon={Lock}
                    />
                    <TextInput
                        label="변경할 비밀번호"
                        type="password"
                        placeholder="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        isNotNull
                        regex={/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/}
                        errorMessage="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        icon={Lock}
                    />
                    <TextInput
                        label="변경할 비밀번호 확인"
                        type="password"
                        placeholder="변경할 비밀번호를 한번 더 입력해주세요."
                        isNotNull
                        icon={Lock}
                    />
                    <TextInput
                        label="이용자 이름"
                        placeholder="이용자 이름을 입력해주세요."
                        type="text"
                        isNotNull
                        icon={Pencil}
                    />
                    <TextInput
                        label="지역본부"
                        type="text"
                        value="서울본부"
                        readonly
                    />
                    <TextInput
                        label="사업소"
                        type="text"
                        value="동대문중랑지사"
                        readonly
                    />
                    <TextInput
                        label="접근권한"
                        type="text"
                        value="시스템관리자"
                        readonly
                    />
                    <SelectInput
                        label="비밀번호 찾기 질문"
                        isNotNull
                        options={[
                            {label:'나의 초등학교 이름은?', value:'001'},
                            {label:'나의 고향은?', value:'002'}
                        ]}
                    />
                    <TextInput
                        label="비밀번호 찾기 답변"
                        placeholder="비밀번호 찾기 질문에 대한 답변을 입력하세요."
                        type="text"
                        isNotNull
                        icon={Pencil}
                    />
                    <Textarea
                        label="이용목적"
                        placeholder="이용목적을 입력해주세요."
                        rows={3}
                    />
                </div>

                {/*푸터*/}
                <div className={styles.widgetFooter}>
                    <BasicButton label="닫기" icon={X} variant="secondary" size="sm" onClick={ onClose } />
                    <BasicButton
                        label="저장"
                        icon={Save}
                        variant="primary" size="sm"
                    />

                </div>
            </div>
        </div>
    )
}
