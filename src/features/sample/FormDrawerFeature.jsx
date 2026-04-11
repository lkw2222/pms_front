import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import FormDrawer   from '@/components/grid/FormDrawer.jsx'
import BasicButton  from '@/components/button/BasicButton.jsx'
import TextInput    from '@/components/input/TextInput.jsx'
import SelectInput  from '@/components/input/SelectInput.jsx'
import BasicGrid    from '@/components/grid/BasicGrid.jsx'
import BasicLabel   from '@/components/label/BasicLabel.jsx'
import { Plus, Edit } from 'lucide-react'
import { toast } from 'sonner'

const SAMPLE_ROWS = [
  { id:1, name:'김민준', category:'설비', status:'정상'  },
  { id:2, name:'이서연', category:'전기', status:'점검중' },
  { id:3, name:'박지호', category:'통신', status:'완료'  },
]
const STATUS_VARIANT = { 정상:'success', 점검중:'warning', 완료:'info' }
const COL_DEFS = [
  { field:'id',       headerName:'No',   width:60,  flex:0 },
  { field:'name',     headerName:'담당자', flex:1 },
  { field:'category', headerName:'분류',  width:90,  flex:0 },
  {
    field:'status', headerName:'상태', width:90, flex:0,
    cellRenderer: ({ value }) => <BasicLabel text={value} variant={STATUS_VARIANT[value] ?? 'default'} />,
  },
]

export default function FormDrawerFeature() {
  const [mode,       setMode]       = useState(null)   // null | 'register' | 'edit'
  const [activeRow,  setActiveRow]  = useState(null)

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { name:'', category:'', status:'' },
  })

  const openRegister = () => {
    reset({ name:'', category:'', status:'' })
    setMode('register')
  }

  const openEdit = (row) => {
    reset({ name: row.name, category: row.category, status: row.status })
    setActiveRow(row)
    setMode('edit')
  }

  const onClose = () => setMode(null)

  const onSubmit = async (values) => {
    await new Promise(r => setTimeout(r, 500))
    toast.success(mode === 'register' ? `'${values.name}' 등록 완료` : `'${values.name}' 수정 완료`)
    onClose()
  }

  const footer = (
    <>
      <BasicButton
        label={isSubmitting ? '저장 중...' : '저장'}
        variant="primary" size="sm"
        disabled={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      />
      <BasicButton label="취소" variant="secondary" size="sm" onClick={onClose} />
    </>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

      {/* 등록 버튼 */}
      <div>
        <BasicButton label="등록" icon={Plus} variant="primary" size="sm" onClick={openRegister} />
      </div>

      {/* 그리드 + 드로어 */}
      <div style={{ display:'flex', height:380, overflow:'hidden', border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)' }}>
        <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
          <BasicGrid
            mode="none"
            rowData={SAMPLE_ROWS}
            colDefs={[
              ...COL_DEFS,
              {
                headerName:'액션', width:80, flex:0, sortable:false, filter:false,
                cellRenderer: ({ data }) => (
                  <button
                    onClick={() => openEdit(data)}
                    style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, padding:'3px 8px', borderRadius:'var(--radius-md)', border:'1px solid var(--color-border)', background:'transparent', cursor:'pointer', color:'var(--color-text-secondary)', transition:'all .12s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='var(--color-accent)'; e.currentTarget.style.color='var(--color-accent)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.color='var(--color-text-secondary)' }}
                  >
                    <Edit size={11} /> 수정
                  </button>
                ),
              },
            ]}
            height="100%"
          />
        </div>

        <FormDrawer
          open={mode !== null}
          title={mode === 'register' ? '신규 등록' : '수정'}
          onClose={onClose}
          footer={footer}
          defaultWidth={320}
        >
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <Controller name="name" control={control} rules={{ required:'담당자를 입력하세요' }}
              render={({ field, fieldState }) => (
                <TextInput label="담당자" value={field.value} onChange={field.onChange}
                  isNotNull errorMessage={fieldState.error?.message} />
              )}
            />
            <Controller name="category" control={control} rules={{ required:'분류를 선택하세요' }}
              render={({ field, fieldState }) => (
                <SelectInput label="분류" value={field.value} onChange={field.onChange} isNotNull
                  options={[{label:'설비',value:'설비'},{label:'전기',value:'전기'},{label:'통신',value:'통신'}]}
                />
              )}
            />
            <Controller name="status" control={control} rules={{ required:'상태를 선택하세요' }}
              render={({ field }) => (
                <SelectInput label="상태" value={field.value} onChange={field.onChange} isNotNull
                  options={[{label:'정상',value:'정상'},{label:'점검중',value:'점검중'},{label:'완료',value:'완료'}]}
                />
              )}
            />
          </div>
        </FormDrawer>
      </div>

      <div style={{ fontSize:12, color:'var(--color-text-muted)', lineHeight:1.7 }}>
        💡 행의 <strong>수정</strong> 버튼 또는 상단 <strong>등록</strong> 버튼을 눌러 드로어를 열어보세요.
        드로어 왼쪽 경계를 드래그하면 너비를 조절할 수 있습니다.
      </div>
    </div>
  )
}
