import React, { useState } from 'react'
import SelectInput from '@/components/input/SelectInput.jsx'

export default function SelectInputFeature() {
  const [value, setValue] = useState('')

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <SelectInput
        label="기본 선택"
        value={value}
        onChange={e => setValue(e.target.value)}
        options={[
          { label:'옵션 1', value:'1' },
          { label:'옵션 2', value:'2' },
          { label:'옵션 3', value:'3' },
        ]}
      />
      <SelectInput
        label="필수 선택"
        isNotNull
        options={[{ label:'선택 A', value:'a' }, { label:'선택 B', value:'b' }]}
      />
      <SelectInput
        label="비활성"
        disabled
        options={[{ label:'선택 불가', value:'d' }]}
      />
    </div>
  )
}
