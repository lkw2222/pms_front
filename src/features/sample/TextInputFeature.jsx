import React, { useState } from 'react'
import TextInput from '@/components/input/TextInput.jsx'

export default function TextInputFeature() {
  const [text, setText] = useState('')

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <TextInput
        label="기본 텍스트"
        placeholder="텍스트를 입력하세요"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <TextInput
        label="필수 입력"
        placeholder="필수 항목입니다"
        isNotNull
      />
      <TextInput
        label="비밀번호"
        type="password"
        placeholder="영문+숫자 8자리 이상"
        isNotNull
        regex={/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/}
        errorMessage="영문과 숫자를 포함한 8자리 이상 입력하세요"
      />
      <TextInput
        label="비활성"
        placeholder="입력 불가"
        disabled
      />
    </div>
  )
}
