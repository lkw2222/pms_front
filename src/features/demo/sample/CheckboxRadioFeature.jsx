import React, { useState } from 'react'
import CheckboxInput from '@/components/input/CheckboxInput.jsx'
import RadioInput    from '@/components/input/RadioInput.jsx'

export default function CheckboxRadioFeature() {
  const [checked, setChecked] = useState(false)
  const [radio,   setRadio]   = useState('a')

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:'var(--color-text-muted)', marginBottom:10 }}>CheckboxInput</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <CheckboxInput label="기본 체크박스" checked={checked} onChange={e => setChecked(e.target.checked)} />
          <CheckboxInput label="체크된 상태"   checked={true}    onChange={() => {}} />
          <CheckboxInput label="비활성 상태"   disabled />
        </div>
      </div>
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:'var(--color-text-muted)', marginBottom:10 }}>RadioInput</div>
        <RadioInput
          label="가로 배치"
          value={radio}
          onChange={e => setRadio(e.target.value)}
          options={[{ label:'A', value:'a' }, { label:'B', value:'b' }, { label:'C', value:'c' }]}
        />
        <RadioInput
          label="세로 배치"
          value={radio}
          onChange={e => setRadio(e.target.value)}
          direction="column"
          options={[{ label:'세로 A', value:'a' }, { label:'세로 B', value:'b' }]}
        />
      </div>
    </div>
  )
}
