import React, { useState } from 'react'
import EmailInput from '@/components/input/EmailInput.jsx'

export default function EmailInputFeature() {
  const [email, setEmail] = useState('')

  return (
    <div style={{ maxWidth:500 }}>
      <EmailInput label="이메일 주소" value={email} onChange={setEmail} />
    </div>
  )
}
