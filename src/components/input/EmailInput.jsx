import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const DOMAINS = [
  { value: 'direct',    label: '직접 입력' },
  { value: 'naver.com', label: 'naver.com'  },
  { value: 'nate.com',  label: 'nate.com'   },
  { value: 'daum.net',  label: 'daum.net'   },
  { value: 'gmail.com', label: 'gmail.com'  },
]

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * EmailInput
 * - 너비는 부모 컨테이너가 결정 (width: 100% 고정)
 * @param {string}   value
 * @param {function} onChange  - (emailString) => void  (e.target.value 아닌 문자열 직접 전달)
 * @param {string}   errorMessage
 */
export default function EmailInput({
  label,
  value = '',
  onChange,
  errorMessage = '유효한 이메일 형식이 아닙니다.',
  className = '',
  ...props
}) {
  const [localPart,      setLocalPart]      = useState('')
  const [domainPart,     setDomainPart]     = useState('')
  const [isDomainLocked, setIsDomainLocked] = useState(false)
  const [isValid,        setIsValid]        = useState(true)

  useEffect(() => {
    if (value) {
      const [local = '', domain = ''] = value.split('@')
      setLocalPart(local)
      setDomainPart(domain)
      setIsDomainLocked(DOMAINS.some(d => d.value !== 'direct' && d.value === domain))
    } else {
      setLocalPart(''); setDomainPart(''); setIsDomainLocked(false)
    }
  }, [value])

  const triggerChange = (newLocal, newDomain) => {
    const email = newLocal || newDomain ? `${newLocal}@${newDomain}` : ''
    setIsValid(email === '' || EMAIL_REGEX.test(email))
    onChange?.(email)
  }

  const handleLocalChange  = (e) => { const v = e.target.value; setLocalPart(v);  triggerChange(v, domainPart) }
  const handleDomainChange = (e) => { const v = e.target.value; setDomainPart(v); triggerChange(localPart, v) }
  const handleSelectChange = (e) => {
    const selected = e.target.value
    if (selected === 'direct') {
      setIsDomainLocked(false); setDomainPart(''); triggerChange(localPart, '')
    } else {
      setIsDomainLocked(true); setDomainPart(selected); triggerChange(localPart, selected)
    }
  }

  // 다른 Input 컴포넌트와 동일한 인라인 스타일
  const inputStyle = (extra = {}) => ({
    height: 36,
    fontSize: 13,
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${isValid ? 'var(--color-border)' : 'var(--color-danger)'}`,
    padding: '0 12px',
    background: 'var(--color-bg-tertiary)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    transition: 'border-color .15s',
    boxSizing: 'border-box',
    ...extra,
  })

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label style={{ fontSize:12, fontWeight:500, color:'var(--color-text-secondary)', display:'flex', flexDirection:'column', gap:6 }}>
          {label}
        </label>
      )}
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        {/* 아이디 */}
        <input
          type="text"
          value={localPart}
          onChange={handleLocalChange}
          placeholder="아이디"
          style={{ ...inputStyle(), flex:1 }}
          onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
          onBlur={e  => e.target.style.borderColor = isValid ? 'var(--color-border)' : 'var(--color-danger)'}
          {...props}
        />

        {/* @ */}
        <span style={{ fontSize:13, color:'var(--color-text-muted)', flexShrink:0 }}>@</span>

        {/* 도메인 직접 입력 */}
        <input
          type="text"
          value={domainPart}
          onChange={handleDomainChange}
          placeholder="도메인"
          readOnly={isDomainLocked}
          style={{ ...inputStyle(), flex:1, opacity: isDomainLocked ? 0.5 : 1, cursor: isDomainLocked ? 'not-allowed' : 'text' }}
          onFocus={e => { if (!isDomainLocked) e.target.style.borderColor = 'var(--color-border-focus)' }}
          onBlur={e  => { if (!isDomainLocked) e.target.style.borderColor = isValid ? 'var(--color-border)' : 'var(--color-danger)' }}
        />

        {/* 도메인 선택 */}
        <div style={{ position:'relative', flexShrink:0, width:120 }}>
          <select
            value={isDomainLocked ? domainPart : 'direct'}
            onChange={handleSelectChange}
            style={{ ...inputStyle(), width:'100%', paddingRight:28, appearance:'none', cursor:'pointer' }}
            onFocus={e => e.target.style.borderColor = 'var(--color-border-focus)'}
            onBlur={e  => e.target.style.borderColor = isValid ? 'var(--color-border)' : 'var(--color-danger)'}
          >
            {DOMAINS.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <ChevronDown size={13} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--color-text-muted)' }} />
        </div>
      </div>

      {!isValid && (
        <span style={{ fontSize:11, color:'var(--color-danger)' }}>{errorMessage}</span>
      )}
    </div>
  )
}
