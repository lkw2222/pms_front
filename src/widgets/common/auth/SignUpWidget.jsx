import React from 'react'
import { useForm } from 'react-hook-form';
import {UserPlus, Pencil, Lock, Save, X, Check} from 'lucide-react'
import BasicButton from "@/Components/button/BasicButton";
import {ControllerText, ControllerSelect, ControllerTextarea} from "@/utils/HookController.jsx";


export default function SignUpWidget({ onClose, styles }) {

    const {
        control,
        handleSubmit,
        getValues,
        watch,
        formState: { isSubmitting }
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            userId: '',
            password: '',
            passwordConfirm: '',
            userNm: '',
            headquarters: '',
            branch: '',
            pwQuestion: '',
            pwAnswer: '',
            purpose: ''
        }
    });

    const password = watch('password'); // 비밀번호 확인 검증용

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
        <div className={styles.widgetBg} >
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
                            <ControllerText
                                name="userId"
                                control={control}
                                rules={{
                                    required : 'ID는 필수입니다.',
                                    pattern: {
                                        value : /^[a-z0-9]{6,14}$/,
                                        message : 'ID는 6~14자의 영문 소문자, 숫자만 입력 가능합니다.'
                                    }
                                }}
                                label="ID"
                                type="text"
                                placeholder="6~14자의 영문 소문자, 숫자만 입력 가능합니다."
                                icon={Pencil}
                            />
                        </div>
                        <div className={styles.idCheckButton}>
                            <BasicButton label="ID 중복검사" icon={Check} variant="secondary" />
                        </div>
                    </div>
                    <ControllerText
                        name="password"
                        control={control}
                        rules={{
                            required : '비밀번호는 필수입니다.',
                            pattern: {
                                value : /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
                                message : '영문과 숫자를 포함한 8자리 이상 입력하세요.'
                            }
                        }}
                        label="비밀번호"
                        type="password"
                        placeholder="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        icon={Lock}
                    />
                    <ControllerText
                        name="passwordConfirm"
                        control={control}
                        rules={{
                            required: '비밀번호 확인은 필수입니다.',
                            validate: (v) => v === getValues('password') || '비밀번호가 일치하지 않습니다.',
                        }}
                        label="비밀번호 확인"
                        type="password"
                        placeholder="비밀번호를 한번 더 입력해주세요."
                        showStrength={false}
                        icon={Lock}
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
                </div>

                {/*푸터*/}
                <div className={styles.widgetFooter}>
                    <BasicButton label="닫기" icon={X} variant="secondary" size="sm" onClick={ onClose } />
                    <BasicButton
                        label="가입"
                        icon={Save}
                        variant="primary" size="sm"
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    />

                </div>
            </div>
        </div>
    )
}
