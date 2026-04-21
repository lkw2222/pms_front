import React, {useState} from 'react'
import {Pencil, Lock, Save, X, UserPen} from 'lucide-react'
import BasicButton from "@/Components/button/BasicButton";
import {useAppStore} from "@/store/useAppStore.js";
import {ControllerText, ControllerSelect, ControllerTextarea, ControllerRadio} from "@/utils/HookController.jsx";
import {useForm} from "react-hook-form";
import PasswordChangeWidget from "@/widgets/common/auth/PasswordChangeWidget.jsx";

export default function MyPageWidget({ onClose, styles }) {
    const { user } = useAppStore(); // zustand

    const [ passwordChangeOpen, setPasswordChangeOpen ] = useState(false);

    const {
        control,
        handleSubmit,
        getValues,
        watch,
        formState: { isSubmitting }
    } = useForm({
        mode: 'onChange',
        values: {
            userId: user?.userId ?? '',
            userNm: user?.userNm ?? '',
            headquarters: user?.headquarters ?? '',
            branch: user?.branch ?? '',
            pwQuestion: user?.pwQuestion ?? '',
            pwAnswer: user?.pwAnswer ?? '',
            purpose: user?.purpose ?? '',
            auth : user?.auth??'',
            useYn : user?.useYn??'',
            password: '',
        }
    });

    const onSubmit = async (data) => {
        try {
            /*const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('가입 실패');*/
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className={styles.widgetBg} >
                <div className={styles.widgetWrap} onClick={(e) => e.stopPropagation()} >
                    {/*헤더*/}
                    <div className={styles.widgetHeader}>
                        <UserPen size={14} className={styles.widgetHeaderIcon} />
                        <span className={styles.widgetHeaderText}>마이 페이지</span>
                    </div>

                    {/*바디*/}
                    <div className={styles.widgetBody}>
                        <ControllerText
                            name="userId"
                            control={control}
                            label="ID"
                            type="text"
                            readOnly
                        />
                        <ControllerText
                            name="userNm"
                            control={control}
                            rules={{
                                required : '이용자 이름은 필수입니다.',
                            }}
                            label="이용자 이름"
                            type="text"
                            placeholder="이용자 이름을 입력해주세요."
                            icon={Pencil}
                        />
                        <ControllerSelect
                            name="headquarters"
                            control={control}
                            label="지역본부"
                            rules={{
                                required : '지역본부를 선택해주세요.',
                            }}
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

                        <ControllerSelect
                            name="branch"
                            control={control}
                            label="사업소"
                            rules={{
                                required : '사업소를 선택해주세요.',
                            }}
                            options={[
                                {label:'동대문중랑지사', value:'동대문중랑지사'},
                                {label:'서대문은평지사', value:'서대문은평지사'},
                                {label:'강북성북지사', value:'강북성북지사'},
                                {label:'광진성동지사', value:'광진성동지사'},
                                {label:'마포용산지사', value:'마포용산지사'},
                                {label:'노원도봉지사', value:'노원도봉지사'}
                            ]}
                        />

                        <ControllerRadio
                            name="auth"
                            control={control}
                            label="접근권한"
                            options={[{ label:'일반사용자', value:'일반사용자' }, { label:'관리자', value:'관리자' }, { label:'시스템관리자', value:'시스템관리자' }]}
                            readOnly
                        />
                        <ControllerRadio
                            name="useYn"
                            control={control}
                            label="사용여부"
                            options={[{ label:'사용중', value:'Y' }, { label:'사용안함', value:'N' }]}
                            readOnly
                        />
                        <ControllerSelect
                            name="pwQuestion"
                            control={control}
                            label="비밀번호 찾기 질문"
                            rules={{
                                required : '비밀번호 찾기 질문을 선택해주세요.',
                            }}
                            options={[
                                {label:'나의 초등학교 이름은?', value:'001'},
                                {label:'나의 고향은?', value:'002'}
                            ]}
                        />
                        <ControllerText
                            name="pwAnswer"
                            control={control}
                            rules={{
                                required : '비밀번호 찾기 답변은 필수입니다.',
                            }}
                            label="비밀번호 찾기 답변"
                            placeholder="비밀번호 찾기 질문에 대한 답변을 입력하세요."
                            type="text"
                            icon={Pencil}
                        />
                        <ControllerTextarea
                            name="purpose"
                            control={control}
                            label="이용목적"
                            placeholder="이용목적을 입력해주세요."
                            rows={3}
                        />
                        <ControllerText
                            name="password"
                            control={control}
                            rules={{
                                required : '저장 하려면 비밀번호를 입력해주세요.'
                            }}
                            label="현재 비밀번호"
                            type="password"
                            placeholder="저장하려면 현재 비밀번호를 입력해주세요."
                            showStrength={false}
                            icon={Lock}
                        />
                    </div>

                    {/*푸터*/}
                    <div className={styles.widgetFooter}>
                        <BasicButton label="비밀번호 변경" icon={Lock} variant="secondary" size="sm" onClick={() => setPasswordChangeOpen(true)} />
                        <div className={styles.widgetFooterEnd}>
                            <BasicButton label="닫기" icon={X} variant="secondary" size="sm" onClick={ onClose } />
                            <BasicButton
                                label="저장"
                                icon={Save}
                                variant="primary" size="sm"
                                disabled={isSubmitting}
                                onClick={handleSubmit(onSubmit)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {passwordChangeOpen && (
                <PasswordChangeWidget onClose={() => setPasswordChangeOpen(false)} styles={styles} />
            )}

        </>
    )
}
