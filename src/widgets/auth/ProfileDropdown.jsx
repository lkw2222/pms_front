import React, { useState, useRef, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore.js'

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const { user, clearAuth, setSessionExpired } = useAppStore()

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    clearAuth()
    setSessionExpired(true)
  }

  const initial = user?.name?.charAt(0) ?? 'A'

  return (
    <div ref={ref} style={{ position:'relative' }}>

      {/* 아바타 버튼 */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          width:36, height:36, borderRadius:'50%', cursor:'pointer',
          background:'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontSize:13, fontWeight:700,
          border: open ? '2px solid var(--color-accent)' : '2px solid transparent',
          transition:'border-color .15s',
          flexShrink:0,
        }}
      >
        {initial}
      </div>

      {/* 드롭다운 */}
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 8px)', right:0,
          width:210, zIndex:1000,
          background:'var(--color-bg-secondary)',
          border:'1px solid var(--color-border)',
          borderRadius:'var(--radius-lg)',
          boxShadow:'var(--shadow-md)',
          overflow:'hidden',
          animation:'slideUp .15s ease',
        }}>

          {/* 사용자 정보 */}
          <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:'50%', flexShrink:0,
              background:'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontSize:13, fontWeight:700,
            }}>
              {initial}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--color-text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user?.name ?? '사용자'}
              </div>
              <div style={{ fontSize:11, color:'var(--color-text-muted)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {[user?.bonbu, user?.sabupso].filter(Boolean).join(' · ') || '소속 정보 없음'}
              </div>
            </div>
          </div>

          <div style={{ height:1, background:'var(--color-border)', margin:'0 12px' }} />

          {/* 로그아웃 */}
          <div style={{ padding:'6px' }}>
            <button
              onClick={handleLogout}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:8,
                padding:'8px 10px', borderRadius:'var(--radius-md)',
                border:'none', background:'transparent', cursor:'pointer',
                fontSize:13, color:'var(--color-danger)',
                fontWeight:500, transition:'background .12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='color-mix(in srgb, var(--color-danger) 10%, transparent)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              <LogOut size={14} />
              로그아웃
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
