import React, { useState } from 'react'
import DateInput from '@/components/input/DateInput.jsx'

export default function DateInputFeature() {
  const [date, setDate] = useState('')

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <DateInput
        label="날짜 선택"
        value={date}
        onChange={setDate}
      />
      <DateInput
        label="기간 선택"
        options={{ mode:'range' }}
        placeholder="시작일 - 종료일"
      />
      <DateInput
        label="오늘 이후만 선택"
        options={{ minDate:'today' }}
      />
    </div>
  )
}
