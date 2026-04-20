import React from 'react'
import BasicLabel from '@/components/label/BasicLabel.jsx'

export default function LabelFeature() {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
      <BasicLabel text="기본"   variant="default" />
      <BasicLabel text="성공"   variant="success" />
      <BasicLabel text="경고"   variant="warning" />
      <BasicLabel text="위험"   variant="danger"  />
      <BasicLabel text="정보"   variant="info"    />
      <BasicLabel text="보라"   variant="purple"  />
      <BasicLabel text="활성"   variant="success" />
      <BasicLabel text="점검중" variant="warning" />
      <BasicLabel text="이상"   variant="danger"  />
      <BasicLabel text="완료"   variant="info"    />
    </div>
  )
}
