import React, { useState } from 'react'
import RangeInput from '@/components/input/RangeInput.jsx'

export default function RangeInputFeature() {
  const [range, setRange] = useState(40)

  return (
    <div style={{ maxWidth:400 }}>
      <RangeInput label="기본 범위"          value={range} onChange={e => setRange(e.target.value)} />
      <RangeInput label="0 ~ 1000 (단계:10)" value={500}   min={0} max={1000} step={10} />
      <RangeInput label="값 숨기기"          value={30}    showValue={false} />
    </div>
  )
}
