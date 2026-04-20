import React, { useState, useRef } from 'react'

import TextInputFeature    from '@/features/demo/sample/TextInputFeature.jsx'
import SelectInputFeature  from '@/features/demo/sample/SelectInputFeature.jsx'
import DateInputFeature    from '@/features/demo/sample/DateInputFeature.jsx'
import CheckboxRadioFeature from '@/features/demo/sample/CheckboxRadioFeature.jsx'
import RangeInputFeature   from '@/features/demo/sample/RangeInputFeature.jsx'
import EmailInputFeature   from '@/features/demo/sample/EmailInputFeature.jsx'
import FileInputFeature    from '@/features/demo/sample/FileInputFeature.jsx'
import ButtonFeature       from '@/features/demo/sample/ButtonFeature.jsx'
import LabelFeature        from '@/features/demo/sample/LabelFeature.jsx'
import BasicGridFeature         from '@/features/demo/sample/BasicGridFeature.jsx'
import GridActionButtonsFeature from '@/features/demo/sample/GridActionButtonsFeature.jsx'
import ToastFeature           from '@/features/demo/sample/ToastFeature.jsx'
import ConfirmModalFeature    from '@/features/demo/sample/ConfirmModalFeature.jsx'
import ErrorBoundaryFeature   from '@/features/demo/sample/ErrorBoundaryFeature.jsx'
import FormDrawerFeature          from '@/features/demo/sample/FormDrawerFeature.jsx'
import GridDetailDrawerFeature    from '@/features/demo/sample/GridDetailDrawerFeature.jsx'
import GridDetailModalFeature    from '@/features/demo/sample/GridDetailModalFeature.jsx'
import { useAppStore }        from '@/store/useAppStore.js'

// ── Props 테이블 ──────────────────────────────────────────────────────────────
function PropTable({ rows }) {
  return (
    <table style={{ width:'100%', borderCollapse:'collapse', marginTop:12 }}>
      <thead>
        <tr style={{ borderBottom:'1px solid var(--color-border)' }}>
          {['Props','Type','Default','Description'].map(h => (
            <th key={h} style={{ textAlign:'left', padding:'6px 10px', fontSize:11, color:'var(--color-text-muted)', fontWeight:600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom:'1px solid var(--color-border)' }}>
            <td style={{ padding:'7px 10px', fontSize:12 }}>
              <code style={{ color:'var(--color-accent)', background:'var(--color-bg-tertiary)', padding:'1px 5px', borderRadius:3 }}>{r[0]}</code>
            </td>
            <td style={{ padding:'7px 10px', fontSize:12, color:'var(--color-purple)'        }}>{r[1]}</td>
            <td style={{ padding:'7px 10px', fontSize:12, color:'var(--color-text-muted)'    }}>{r[2]}</td>
            <td style={{ padding:'7px 10px', fontSize:12, color:'var(--color-text-secondary)'}}>{r[3]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── 섹션 카드 ─────────────────────────────────────────────────────────────────
function SectionCard({ id, title, children, propRows }) {
  return (
    <div id={id} className="section-card">
      <div className="section-title">{title}</div>
      {children}
      {propRows && <PropTable rows={propRows} />}
    </div>
  )
}

// ── 목차 섹션 정의 ────────────────────────────────────────────────────────────
const SECTIONS = [
  { id:'text-input',     label:'TextInput'         },
  { id:'select-input',   label:'SelectInput'       },
  { id:'date-input',     label:'DateInput'         },
  { id:'checkbox-radio', label:'Checkbox / Radio'  },
  { id:'range-input',    label:'RangeInput'        },
  { id:'email-input',    label:'EmailInput'        },
  { id:'file-input',     label:'FileInput'         },
  { id:'buttons',        label:'Button'            },
  { id:'labels',         label:'Label'             },
  { id:'basic-grid',          label:'BasicGrid'         },
  { id:'grid-action-buttons',  label:'GridActionButtons'  },
  { id:'grid-detail-drawer',  label:'GridDetailDrawer'   },
  { id:'grid-detail-modal',   label:'GridDetailModal'    },
  { id:'form-drawer',         label:'FormDrawer'         },
  { id:'toast',               label:'Toast'             },
  { id:'confirm-modal',       label:'ConfirmModal'      },
  { id:'error-boundary',      label:'ErrorBoundary / Suspense' },
  { id:'session-expired',     label:'세션 만료 오버레이'       },
]

// ── 세션 만료 데모 ────────────────────────────────────────────────────────────
function SessionExpiredSection() {
  const setSessionExpired = useAppStore(s => s.setSessionExpired)
  return (
    <div id="session-expired" className="section-card">
      <div className="section-title">세션 만료 오버레이</div>
      <p style={{ fontSize:13, color:'var(--color-text-secondary)', marginBottom:16, lineHeight:1.7 }}>
        세션이 만료되었을 때 전체 화면 위에 로그인 폼을 블러 오버레이로 표시합니다.<br />
        로그인 성공 시 오버레이가 사라지고 <strong style={{ color:'var(--color-accent)' }}>열려있던 탭과 작업 상태가 그대로 유지</strong>됩니다.
      </p>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 16px', borderRadius:'var(--radius-md)', background:'var(--color-bg-tertiary)', border:'1px solid var(--color-border)', marginBottom:16 }}>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', flex:1 }}>
          💡 실제 환경: axios interceptor에서 <code style={{ color:'var(--color-accent)', background:'var(--color-bg-primary)', padding:'1px 5px', borderRadius:3 }}>401</code> 응답 시
          {' '}<code style={{ color:'var(--color-accent)', background:'var(--color-bg-primary)', padding:'1px 5px', borderRadius:3 }}>useAppStore.getState().setSessionExpired(true)</code> 한 줄만 호출하면 됩니다.
        </div>
      </div>
      <button
        onClick={() => setSessionExpired(true)}
        style={{
          display:'inline-flex', alignItems:'center', gap:8,
          padding:'10px 20px', borderRadius:'var(--radius-md)', fontSize:13,
          fontWeight:600, cursor:'pointer', border:'none',
          background:'var(--color-warning)',
          color:'#fff', letterSpacing:'0.01em',
          boxShadow:'0 2px 6px rgba(0,0,0,0.25)',
          transition:'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity='0.88'; e.currentTarget.style.transform='translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.opacity='1';    e.currentTarget.style.transform='translateY(0)'    }}
      >
        🔒 세션 만료 시뮬레이션
      </button>
    </div>
  )
}

// ── SamplePanel ───────────────────────────────────────────────────────────────
export default function SamplePanel() {
  const [active,     setActive]     = useState('text-input')
  const contentRef = useRef(null)

  const scrollTo = (id) => {
    setActive(id)
    const el        = document.getElementById(id)
    const container = contentRef.current
    if (!el || !container) return
    const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 16
    container.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', background:'var(--color-bg-primary)' }}>

      {/* 좌측 목차 */}
      <div style={{ width:180, flexShrink:0, borderRight:'1px solid var(--color-border)', background:'var(--color-bg-secondary)', padding:'16px 8px', overflowY:'auto', overscrollBehavior:'contain' }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'0 8px 10px' }}>컴포넌트</div>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            style={{
              width:'100%', textAlign:'left', padding:'7px 10px',
              borderRadius:'var(--radius-md)', fontSize:13, border:'none',
              cursor:'pointer', display:'block', marginBottom:1,
              background:   active===s.id ? 'var(--color-accent)12' : 'transparent',
              color:        active===s.id ? 'var(--color-accent)'   : 'var(--color-text-secondary)',
              fontWeight:   active===s.id ? 600 : 400,
              borderLeft:   active===s.id ? '2px solid var(--color-accent)' : '2px solid transparent',
              transition:   'all .12s',
            }}
            onMouseEnter={e => { if (active!==s.id) { e.currentTarget.style.background='var(--color-bg-tertiary)'; e.currentTarget.style.color='var(--color-text-primary)' }}}
            onMouseLeave={e => { if (active!==s.id) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--color-text-secondary)' }}}
          >{s.label}</button>
        ))}
      </div>

      {/* 우측 내용 - 각 Feature 조합 */}
      <div ref={contentRef} style={{ flex:1, overflowY:'auto', padding:'20px 24px', overscrollBehavior:'contain' }}>

        <SectionCard id="text-input" title="TextInput"
          propRows={[
            ['label',        'string',   '-',     '라벨 텍스트'],
            ['value',        'string',   '-',     '입력값'],
            ['onChange',     'function', '-',     '변경 핸들러'],
            ['type',         'string',   'text',  'text | password | number'],
            ['isNotNull',    'boolean',  'false', '필수 입력 여부'],
            ['regex',        'RegExp',   '-',     '유효성 검사 정규식'],
            ['errorMessage', 'string',   '-',     '에러 메시지'],
            ['icon',         'Component','-',     'lucide-react 아이콘'],
            ['...props',     '-',        '-',     'input 엘리먼트에 그대로 전달 (register 포함)'],
          ]}
        >
          <TextInputFeature />
        </SectionCard>

        <SectionCard id="select-input" title="SelectInput"
          propRows={[
            ['options',     'Array',   '-',       '[{ label, value }] 배열'],
            ['value',       'string',  '-',       '선택된 값'],
            ['placeholder', 'string',  '선택하세요', '기본 문구'],
            ['isNotNull',   'boolean', 'false',   '필수 선택 여부'],
            ['...props',    '-',       '-',       'select 엘리먼트에 그대로 전달'],
          ]}
        >
          <SelectInputFeature />
        </SectionCard>

        <SectionCard id="date-input" title="DateInput"
          propRows={[
            ['value',       'string',   '-',          '선택된 날짜 문자열'],
            ['onChange',    'function', '-',          '(dateStr, dates) => void'],
            ['options',     'object',   '-',          'flatpickr 옵션 (mode, minDate 등)'],
            ['placeholder', 'string',   '날짜를 선택하세요', '플레이스홀더'],
            ['...props',    '-',        '-',          'Flatpickr에 그대로 전달'],
          ]}
        >
          <DateInputFeature />
        </SectionCard>

        <SectionCard id="checkbox-radio" title="Checkbox / Radio">
          <CheckboxRadioFeature />
        </SectionCard>

        <SectionCard id="range-input" title="RangeInput"
          propRows={[
            ['min',       'number',  '0',    '최솟값'],
            ['max',       'number',  '100',  '최댓값'],
            ['step',      'number',  '1',    '단계'],
            ['showValue', 'boolean', 'true', '현재 값 표시 여부'],
            ['...props',  '-',       '-',    'input 엘리먼트에 그대로 전달'],
          ]}
        >
          <RangeInputFeature />
        </SectionCard>

        <SectionCard id="email-input" title="EmailInput"
          propRows={[
            ['value',        'string',   '-', '이메일 문자열 (전체)'],
            ['onChange',     'function', '-', '(emailStr) => void — 문자열 직접 전달'],
            ['errorMessage', 'string',   '-', '유효성 에러 메시지'],
          ]}
        >
          <EmailInputFeature />
        </SectionCard>

        <SectionCard id="file-input" title="FileInput"
          propRows={[
            ['onChange',  'function', '-',    '(File[]) => void — File 객체 배열'],
            ['accept',    'string',   '-',    '허용 확장자 (예: .pdf,image/*)'],
            ['multiple',  'boolean',  'true', '다중 선택 여부'],
            ['...props',  '-',        '-',    'input 엘리먼트에 그대로 전달'],
          ]}
        >
          <FileInputFeature />
        </SectionCard>

        <SectionCard id="buttons" title="Button"
          propRows={[
            ['label',    'string',    '-',       '버튼 텍스트'],
            ['variant',  'string',    'primary', 'primary | secondary | danger | ghost | success | warning'],
            ['size',     'string',    'md',      'sm | md | lg'],
            ['icon',     'Component', '-',       'lucide-react 아이콘'],
            ['disabled', 'boolean',   'false',   '비활성 여부'],
            ['type',     'string',    'button',  'button | submit | reset'],
            ['...props', '-',         '-',       'button 엘리먼트에 그대로 전달'],
          ]}
        >
          <ButtonFeature />
        </SectionCard>

        <SectionCard id="labels" title="Label"
          propRows={[
            ['text',    'string', '-',       '라벨 텍스트'],
            ['variant', 'string', 'default', 'default | success | warning | danger | info | purple'],
          ]}
        >
          <LabelFeature />
        </SectionCard>

        <SectionCard id="basic-grid" title="BasicGrid"
          propRows={[
            ['mode',          'string',   'paginate', 'paginate | infinite | none'],
            ['rowData',       'Array',    '[]',       '행 데이터 배열 (paginate/none 모드)'],
            ['colDefs',       'Array',    '[]',       'AG Grid 컬럼 정의 배열'],
            ['onRowClick',    'function', '-',        '(rowData) => void — 행 클릭 핸들러 (버튼 클릭은 무시)'],
            ['height',        'string',   '100%',     '그리드 높이'],
            ['pageSize',      'number',   '20',       '페이지당 행 수 (paginate 모드)'],
            ['datasource',    'object',   '-',        '{ getRows } — infinite 모드 전용'],
            ['cacheBlockSize','number',   '50',       '한 번에 로드할 행 수 (infinite 모드)'],
            ['loading',       'boolean',  'false',    '로딩 상태 표시'],
            ['...props',      '-',        '-',        'AgGridReact에 그대로 전달'],
          ]}
        >
          <BasicGridFeature />
        </SectionCard>

        <SectionCard id="grid-action-buttons" title="GridActionButtons"
          propRows={[
            ['data',              'object', '-',  '현재 로우 데이터 (AG Grid에서 자동 전달)'],
            ['buttons',           'Array',  '[]', '버튼 설정 배열'],
            ['buttons[].type',    'string', '-',  'detail | edit | delete | download | copy | add | confirm | cancel | custom'],
            ['buttons[].label',   'string', '-',  '버튼 텍스트 (type 기본값 사용 가능)'],
            ['buttons[].icon',    'Component','-','lucide-react 아이콘 (type 기본값 사용 가능)'],
            ['buttons[].variant', 'string', '-',  'ghost | primary | secondary | danger | success | warning'],
            ['buttons[].onClick', 'function','-', '(data) => void'],
            ['buttons[].disabled','bool | (data)=>bool', 'false', '비활성 조건'],
            ['buttons[].hidden',  'bool | (data)=>bool', 'false', '숨김 조건'],
            ['buttons[].title',   'string', '-',  '툴팁'],
          ]}
        >
          <GridActionButtonsFeature />
        </SectionCard>

        <SectionCard id="grid-detail-drawer" title="GridDetailDrawer"
          propRows={[
            ['open',         'boolean',   'false',   '드로어 열림 여부'],
            ['title',        'string',    '상세 정보', '헤더 제목'],
            ['onClose',      'function',  '-',       '닫기 핸들러'],
            ['children',     'ReactNode', '-',       'pk 기반 상세 컴포넌트 주입 — 내부에서 API 조회'],
            ['defaultWidth', 'number',    '420',     '초기 너비(px), 드래그로 조절 가능 (300~800)'],
          ]}
        >
          <GridDetailDrawerFeature />
        </SectionCard>

        <SectionCard id="grid-detail-modal" title="GridDetailModal"
          propRows={[
            ['open',     'boolean',   'false',   '모달 열림 여부'],
            ['title',    'string',    '상세 정보', '헤더 제목'],
            ['onClose',  'function',  '-',       '닫기 핸들러 (ESC · 백드롭 클릭도 동작)'],
            ['children', 'ReactNode', '-',       'pk 기반 상세 컴포넌트 주입 — 내부에서 API 조회'],
            ['width',    'string',    '860px',   '초기 너비, 드래그 리사이즈 가능'],
            ['height',   'string',    '80vh',    '초기 높이, 드래그 리사이즈 가능'],
          ]}
        >
          <GridDetailModalFeature />
        </SectionCard>

        <SectionCard id="form-drawer" title="FormDrawer"
          propRows={[
            ['open',         'boolean',  'false', '드로어 열림 여부'],
            ['title',        'string',   '-',     '헤더 제목'],
            ['onClose',      'function', '-',     '닫기 핸들러'],
            ['footer',       'ReactNode','-',     '하단 버튼 영역 (저장/취소 등)'],
            ['children',     'ReactNode','-',     '폼 내용'],
            ['defaultWidth', 'number',   '600',   '초기 너비(px), 드래그로 조절 가능 (400~900)'],
          ]}
        >
          <FormDrawerFeature />
        </SectionCard>

        <SectionCard id="toast" title="Toast"
          propRows={[
            ['toast.success(msg)', '-', '-', '초록 — 성공 알림'],
            ['toast.error(msg)',   '-', '-', '빨강 — 오류 알림'],
            ['toast.warning(msg)', '-', '-', '노랑 — 경고 알림'],
            ['toast.info(msg)',    '-', '-', '파랑 — 정보 알림'],
          ]}
        >
          <ToastFeature />
        </SectionCard>

        <SectionCard id="confirm-modal" title="ConfirmModal"
          propRows={[
            ['open',        'boolean',  '-',      '모달 열림 여부'],
            ['title',       'string',   '-',      '제목'],
            ['message',     'string',   '-',      '본문 메시지'],
            ['variant',     'string',   'danger', 'danger | warning | info | success'],
            ['confirmText', 'string',   '-',      '확인 버튼 텍스트 (기본값은 variant에 따라 결정)'],
            ['cancelText',  'string',   '취소',   '취소 버튼 텍스트'],
            ['onConfirm',   'function', '-',      '확인 클릭 핸들러'],
            ['onCancel',    'function', '-',      '취소 / ESC / 오버레이 클릭 핸들러'],
          ]}
        >
          <ConfirmModalFeature />
        </SectionCard>

        <SectionCard id="error-boundary" title="ErrorBoundary / Suspense"
          propRows={[
            ['children', 'ReactNode', '-', '감쌀 컴포넌트 (ErrorBoundary)'],
            ['fallback', 'ReactNode', '-', '로딩 중 표시할 UI (Suspense)'],
          ]}
        >
          <ErrorBoundaryFeature />
        </SectionCard>

        <SessionExpiredSection />

      </div>
    </div>
  )
}
