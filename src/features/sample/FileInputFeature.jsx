import React from 'react'
import FileInput from '@/components/input/FileInput.jsx'

export default function FileInputFeature() {
  return (
    <div style={{ maxWidth:500 }}>
      <FileInput
        label="파일 업로드"
        accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
        onChange={files => console.log('선택된 파일:', files)}
      />
    </div>
  )
}
