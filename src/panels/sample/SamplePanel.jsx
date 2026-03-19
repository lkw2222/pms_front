import React, { useState } from 'react'

import TextInputFeature    from '@/features/sample/TextInputFeature.jsx'
import SelectInputFeature  from '@/features/sample/SelectInputFeature.jsx'
import DateInputFeature    from '@/features/sample/DateInputFeature.jsx'
import CheckboxRadioFeature from '@/features/sample/CheckboxRadioFeature.jsx'
import RangeInputFeature   from '@/features/sample/RangeInputFeature.jsx'
import EmailInputFeature   from '@/features/sample/EmailInputFeature.jsx'
import FileInputFeature    from '@/features/sample/FileInputFeature.jsx'
import ButtonFeature       from '@/features/sample/ButtonFeature.jsx'
import LabelFeature        from '@/features/sample/LabelFeature.jsx'

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
]

// ── SamplePanel ───────────────────────────────────────────────────────────────
export default function SamplePanel() {
  const [active, setActive] = useState('text-input')

  const scrollTo = (id) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' })
  }

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', background:'var(--color-bg-primary)' }}>

      {/* 좌측 목차 */}
      <div style={{ width:180, flexShrink:0, borderRight:'1px solid var(--color-border)', background:'var(--color-bg-secondary)', padding:'16px 8px', overflowY:'auto' }}>
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
      <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>

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

      </div>
    </div>
  )
}
