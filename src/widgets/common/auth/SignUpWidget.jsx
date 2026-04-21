import React from 'react'
import {UserPlus, Pencil, Lock, Save, X, Check} from 'lucide-react'
import TextInput from "@/components/input/TextInput";
import SelectInput from "@/components/input/SelectInput";
import Textarea from "@/Components/input/Textarea";
import BasicButton from "@/Components/button/BasicButton";

export default function SignUpWidget({ onClose, styles }) {

    return (
        <div className={styles.widgetBg} onClick={onClose} >
            <div className={styles.widgetWrap} onClick={(e) => e.stopPropagation()} >
                {/*헤더*/}
                <div className={styles.widgetHeader}>
                    <UserPlus size={14} className={styles.widgetHeaderIcon} />
                    <span className={styles.widgetHeaderText}>신규 이용자 가입</span>
                </div>

                {/*바디*/}
                <div className={styles.widgetBody}>
                    <div>
                        <div className={styles.idCheckInput}>
                            <TextInput
                                label="ID"
                                placeholder="6~14자의 영문 소문자, 숫자만 입력 가능합니다."
                                type="text"
                                isNotNull
                                icon={Pencil}
                                regex={/^[a-z0-9]{6,14}$/}
                                errorMessage="ID는 6~14자의 영문 소문자, 숫자만 입력 가능합니다."
                            />
                        </div>
                        <div className={styles.idCheckButton}>
                            <BasicButton label="ID 중복검사" icon={Check} variant="secondary" />
                        </div>
                    </div>
                    <TextInput
                        label="비밀번호"
                        type="password"
                        placeholder="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        isNotNull
                        regex={/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/}
                        errorMessage="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        icon={Lock}
                    />
                    <TextInput
                        label="비밀번호 확인"
                        type="password"
                        placeholder="비밀번호를 한번 더 입력해주세요."
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
                    <SelectInput
                        label="지역본부"
                        isNotNull
                        options={[
                            {label:'서울본부', value:'서울본부'},
                            {label:'남서울본부', value:'남서울본부'},
                            {label:'인천본부', value:'인천본부'},
                            {label:'경기북부본부', value:'경기북부본부'},
                            {label:'경기본부', value:'경기본부'},
                            {label:'강원본부', value:'강원본부'},
                            {label:'충북본부', value:'충북본부'},
                            {label:'대전세종충남본부', value:'대전세종충남본부'},
                            {label:'전북본부', value:'전북본부'},
                            {label:'광주전남본부', value:'광주전남본부'},
                            {label:'대구본부', value:'대구본부'},
                            {label:'경북본부', value:'경북본부'},
                            {label:'부산울산본부', value:'부산울산본부'},
                            {label:'경남본부', value:'경남본부'},
                            {label:'제주본부', value:'제주본부'}
                        ]}
                    />
                    <SelectInput
                        label="사업소"
                        isNotNull
                        options={[
                            {label:'동대문중랑지사', value:'동대문중랑지사'},
                            {label:'서대문은평지사', value:'서대문은평지사'},
                            {label:'강북성북지사', value:'강북성북지사'},
                            {label:'광진성동지사', value:'광진성동지사'},
                            {label:'마포용산지사', value:'마포용산지사'},
                            {label:'노원도봉지사', value:'노원도봉지사'}
                        ]}
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
                        label="가입"
                        icon={Save}
                        variant="primary" size="sm"
                    />

                </div>
            </div>
        </div>
    )
}
