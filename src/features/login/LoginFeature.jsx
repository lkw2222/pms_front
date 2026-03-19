import React from 'react'
import { useForm } from 'react-hook-form'
import TextInput   from '@/components/input/TextInput.jsx'
import BasicButton from '@/components/button/BasicButton.jsx'
import { User, Lock, LogIn } from 'lucide-react'

/**
 * LoginFeature - React Hook Form 적용
 *
 * register() 반환값 = { name, ref, onChange, onBlur }
 * → TextInput 의 ...props 로 그대로 전달되어 자동 연결
 */
export default function LoginFeature({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { id: '', password: '' },
  })

  const onSubmit = async (data) => {
    await onLogin(data.id, data.password)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:12, width:'100%' }}>

      <TextInput
        label="아이디"
        placeholder="아이디를 입력하세요"
        icon={User}
        isNotNull
        {...register('id', { required: '아이디를 입력하세요.' })}
      />
      {errors.id && <span style={{ fontSize:11, color:'var(--color-danger)', marginTop:-8 }}>{errors.id.message}</span>}

      <TextInput
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        icon={Lock}
        isNotNull
        {...register('password', {
          required:  '비밀번호를 입력하세요.',
          minLength: { value: 4, message: '비밀번호는 4자 이상 입력하세요.' },
        })}
      />
      {errors.password && <span style={{ fontSize:11, color:'var(--color-danger)', marginTop:-8 }}>{errors.password.message}</span>}

      <BasicButton
        label={isSubmitting ? '로그인 중...' : '로그인'}
        type="submit"
        variant="primary"
        size="lg"
        icon={LogIn}
        disabled={isSubmitting}
        className="w-full mt-1"
      />
    </form>
  )
}
