import React from 'react'
import BasicButton from '@/components/button/BasicButton.jsx'
import { Save, Search, Trash2, X, Check, AlertCircle, Edit, RefreshCw, Download, Plus } from 'lucide-react'

export default function ButtonFeature() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', fontWeight:600, marginBottom:10 }}>Variant</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          <BasicButton label="저장"  variant="primary"   icon={Save}        />
          <BasicButton label="검색"  variant="secondary" icon={Search}      />
          <BasicButton label="삭제"  variant="danger"    icon={Trash2}      />
          <BasicButton label="닫기"  variant="ghost"     icon={X}           />
          <BasicButton label="완료"  variant="success"   icon={Check}       />
          <BasicButton label="주의"  variant="warning"   icon={AlertCircle} />
        </div>
      </div>
      <div>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', fontWeight:600, marginBottom:10 }}>Size</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' }}>
          <BasicButton label="소형 (sm)" size="sm" icon={Edit} />
          <BasicButton label="중형 (md)" size="md" icon={Edit} />
          <BasicButton label="대형 (lg)" size="lg" icon={Edit} />
        </div>
      </div>
      <div>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', fontWeight:600, marginBottom:10 }}>상태 / 기타</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          <BasicButton label="비활성"   disabled            icon={X}        />
          <BasicButton label="새로고침" variant="secondary" icon={RefreshCw} />
          <BasicButton label="다운로드" variant="secondary" icon={Download}  />
          <BasicButton label="추가"     variant="ghost"     icon={Plus}      />
        </div>
      </div>
    </div>
  )
}
