import React, {useId, useState} from 'react'
import { useForm } from 'react-hook-form'
import TextInput   from '@/components/input/TextInput.jsx'
import BasicButton from '@/components/button/BasicButton.jsx'
import TextButton from '@/components/button/TextButton.jsx'
import SignUpWidget from "@/widgets/common/auth/SignUpWidget.jsx";
import FindAccountWidget from "@/widgets/common/auth/FindAccountWidget.jsx";
import '@/assets/styles/login.css';
import styles from './LoginFeature.module.css'

/**
 * LoginFeature - React Hook Form 적용
 *
 * register() 반환값 = { name, ref, onChange, onBlur }
 * → TextInput 의 ...props 로 그대로 전달되어 자동 연결
 */
export default function LoginFeature({ onLogin, className='btn-login', isPending }) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: { id: '', password: '' },
    });

    const inputIdID = useId();
    const inputPasswordID = useId();

    const idValue       = watch('id', '');
    const passwordValue = watch('password', '');

    const [ signupOpen, setSignupOpen ] = useState(false);
    const [ findAccountOpen, setFindAccountOpen ] = useState(false);

    const onSubmit = (data) => {
        /*await onLogin(data.id, data.password)*/
        onLogin(data.id, data.password);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label className="field-label" htmlFor={inputIdID}>ID</label>
                    <div className="field">
                      <span className="field-icon" aria-hidden="true">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 448 512"><path fill="rgb(110, 110, 110)" d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/></svg>
                      </span>
                      <TextInput
                          id={inputIdID}
                          type="id"
                          className="field-input"
                          placeholder="ID를 입력하세요"
                          isNotNull
                          value={idValue}
                          autoFocus
                          {...register('id', { required: 'ID를 입력하세요.' })} inputMode="url"/>
                    </div>
                    {errors.id && <span style={{ fontsize:11, color:'var(--color-danger)', margintop:-8 }}>{errors.id.message}</span>}
                </div>

                <div className="form-group">
                    <label className="field-label" htmlFor={inputPasswordID}>비밀번호</label>
                    <div className="field">
                        <span className="field-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 384 512"><path fill="rgb(110, 110, 110)" d="M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z"/></svg></span>
                        <TextInput
                              id={inputPasswordID}
                              type="password"
                              className="field-input"
                              placeholder="비밀번호를 입력하세요"
                              autoComplete="current-password"
                              isNotNull
                              value={passwordValue}
                              {...register('password', {
                                  required:  '비밀번호를 입력하세요.',
                                  minLength: { value: 4, message: '비밀번호는 4자 이상 입력하세요.' },
                              })}
                        />
                    </div>
                    {errors.password && <span style={{ fontSize:11, color:'var(--color-danger)', marginTop:-8 }}>{errors.password.message}</span>}
                </div>

                <BasicButton
                      label={isPending ? '로그인 중...' : '로그인'}
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isPending}
                      className={className}
                />

                <nav className="brand-links" aria-label="로그인 관련 바로가기">
                    <div className="brand-links-group">
                        <TextButton
                            label="ID/비밀번호 찾기"
                            type="button"
                            onClick={() => setFindAccountOpen(true)}
                        />
                    </div>
                    <TextButton
                          label="회원가입"
                          type="button"
                          onClick={() => setSignupOpen(true)}
                    />
                </nav>
            </form>

            {findAccountOpen && (
                <FindAccountWidget onClose={() => setFindAccountOpen(false)} styles={styles} />
            )}

            {signupOpen && (
                <SignUpWidget onClose={() => setSignupOpen(false)} styles={styles} />
            )}
        </>
    )
}
