import React from 'react'
import { toast } from 'sonner'
import BasicButton from '@/components/button/BasicButton.jsx'

export default function ToastFeature() {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
      <BasicButton label="성공" variant="success"   onClick={() => toast.success('저장이 완료되었습니다.')} />
      <BasicButton label="오류" variant="danger"    onClick={() => toast.error('저장에 실패했습니다.')} />
      <BasicButton label="경고" variant="warning"   onClick={() => toast.warning('주의가 필요합니다.')} />
      <BasicButton label="정보" variant="secondary" onClick={() => toast.info('엑셀 다운로드를 시작합니다.')} />
    </div>
  )
}
