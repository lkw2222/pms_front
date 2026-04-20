import React, { useState } from 'react'
import { toast } from 'sonner'
import BasicButton  from '@/components/button/BasicButton.jsx'
import ConfirmModal from '@/components/modal/ConfirmModal.jsx'

export default function ConfirmModalFeature() {
  const [open,    setOpen]    = useState(false)
  const [variant, setVariant] = useState('danger')

  const VARIANTS = [
    { key:'danger',  label:'삭제 확인',  btnVariant:'danger'    },
    { key:'warning', label:'경고 확인',  btnVariant:'warning'   },
    { key:'info',    label:'정보 확인',  btnVariant:'secondary' },
    { key:'success', label:'완료 확인',  btnVariant:'success'   },
  ]

  const MESSAGES = {
    danger:  '정말 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.',
    warning: '이 작업은 되돌리기 어렵습니다.\n계속 진행하시겠습니까?',
    info:    '해당 내용을 확인하셨습니까?',
    success: '완료 처리하시겠습니까?',
  }

  const handleConfirm = () => {
    toast.success('확인 버튼을 클릭했습니다.')
    setOpen(false)
  }

  return (
    <>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {VARIANTS.map(v => (
          <BasicButton
            key={v.key}
            label={v.label}
            variant={v.btnVariant}
            onClick={() => { setVariant(v.key); setOpen(true) }}
          />
        ))}
      </div>

      <ConfirmModal
        open={open}
        variant={variant}
        title={VARIANTS.find(v => v.key === variant)?.label ?? '확인'}
        message={MESSAGES[variant]}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
