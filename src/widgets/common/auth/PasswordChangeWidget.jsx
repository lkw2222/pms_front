import React from 'react'
import { useForm } from 'react-hook-form';
import {UserPlus, Pencil, Lock, Save, X, Check} from 'lucide-react'
import BasicButton from "@/Components/button/BasicButton";
import {ControllerText} from "@/utils/HookController.jsx";


export default function PasswordChangeWidget({ onClose, styles }) {

    const {
        control,
        handleSubmit,
        getValues,
        watch,
        formState: { isSubmitting }
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
        }
    });

    const onSubmit = async (data) => {
        try {
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
                    <Lock size={14} className={styles.widgetHeaderIcon} />
                    <span className={styles.widgetHeaderText}>비밀번호 변경</span>
                </div>

                {/*바디*/}
                <div className={styles.widgetBody}>
                    <ControllerText
                        name="currentPassword"
                        control={control}
                        rules={{
                            required : '현재 비밀번호를 입력해주세요.'
                        }}
                        label="현재 비밀번호"
                        type="password"
                        placeholder="현재 비밀번호를 입력해주세요."
                        showStrength={false}
                        icon={Lock}
                    />
                    <ControllerText
                        name="newPassword"
                        control={control}
                        rules={{
                            required : '신규 비밀번호는 필수입니다.',
                            pattern: {
                                value : /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
                                message : '영문과 숫자를 포함한 8자리 이상 입력하세요.'
                            }
                        }}
                        label="신규 비밀번호"
                        type="password"
                        placeholder="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        icon={Lock}
                    />
                    <ControllerText
                        name="newPasswordConfirm"
                        control={control}
                        rules={{
                            required: '비밀번호 확인은 필수입니다.',
                            validate: (v) => v === getValues('password') || '비밀번호가 일치하지 않습니다.',
                        }}
                        label="신규 비밀번호 확인"
                        type="password"
                        placeholder="비밀번호를 한번 더 입력해주세요."
                        showStrength={false}
                        icon={Lock}
                    />
                </div>

                {/*푸터*/}
                <div className={styles.widgetFooter}>
                    <BasicButton label="비밀번호 초기화" icon={Lock} variant="secondary" size="sm" />
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
    )
}
