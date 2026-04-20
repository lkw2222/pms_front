import React, { useEffect, useRef } from 'react'
import { Bell, CheckCheck, AlertCircle, Info, CheckCircle, AlertTriangle, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// ── 샘플 데이터 (WebSocket 연동 시 교체) ─────────────────────────────────────
const SAMPLE_NOTIFICATIONS = [
  { id:1, type:'success', title:'엑셀 다운로드 완료',     body:'업무현황 전체 (1,000건) 파일이 준비되었습니다.', time:'방금 전',  read:false, download:true  },
  { id:2, type:'success', title:'엑셀 다운로드 완료',     body:'설비 점검 이력 (3,248건) 파일이 준비되었습니다.', time:'5분 전',  read:false, download:true  },
  { id:3, type:'warning', title:'다운로드 처리 중',       body:'공간 분석 결과 데이터를 생성하고 있습니다.', time:'8분 전',     read:false, download:false },
  { id:4, type:'danger',  title:'다운로드 실패',          body:'업무 등록 목록 요청 중 오류가 발생했습니다. 다시 시도해주세요.', time:'1시간 전', read:true, download:false },
  { id:5, type:'success', title:'엑셀 다운로드 완료',     body:'월별 업무 통계 (12개월) 파일이 준비되었습니다.', time:'어제',   read:true,  download:true  },
]

const TYPE_ICON = {
  danger:  { Icon: AlertCircle,   color: 'var(--color-danger)'  },
  warning: { Icon: Loader2,       color: 'var(--color-warning)' },
  info:    { Icon: Info,          color: 'var(--color-accent)'  },
  success: { Icon: CheckCircle,   color: 'var(--color-success)' },
}

/**
 * NotificationWidget
 * 탑바 알림 드롭다운
 *
 * @param {boolean}  open     - 패널 열림 여부
 * @param {function} onClose  - 닫기 핸들러
 */
export default function NotificationWidget({ open, onClose }) {
  const panelRef = useRef(null)
  const unreadCount = SAMPLE_NOTIFICATIONS.filter(n => !n.read).length

  // 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose()
    }
    setTimeout(() => window.addEventListener('mousedown', handler), 0)
    return () => window.removeEventListener('mousedown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div ref={panelRef} style={{
      position:      'absolute',
      top:           'calc(var(--topbar-height) - 4px)',
      right:         52,
      width:         340,
      maxHeight:     480,
      zIndex:        500,
      background:    'var(--color-bg-secondary)',
      border:        '1px solid var(--color-border)',
      borderRadius:  'var(--radius-lg, 10px)',
      boxShadow:     'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.18))',
      display:       'flex',
      flexDirection: 'column',
      overflow:      'hidden',
      animation:     'notiIn 0.18s cubic-bezier(0.4,0,0.2,1)',
    }}>

      {/* 헤더 */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 16px', borderBottom:'1px solid var(--color-border)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Bell size={14} style={{ color:'var(--color-text-secondary)' }} />
          <span style={{ fontSize:13, fontWeight:700, color:'var(--color-text-primary)' }}>알림</span>
          {unreadCount > 0 && (
            <span style={{ fontSize:11, fontWeight:700, color:'#fff', background:'var(--color-danger)', borderRadius:10, padding:'1px 7px', lineHeight:'18px' }}>
              {unreadCount}
            </span>
          )}
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--color-text-muted)', background:'none', border:'none', cursor:'pointer', padding:'3px 6px', borderRadius:'var(--radius-md)', transition:'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background='var(--color-bg-tertiary)'; e.currentTarget.style.color='var(--color-text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--color-text-muted)' }}
        >
          <CheckCheck size={12} />
          모두 읽음
        </button>
      </div>

      {/* 목록 */}
      <div style={{ overflowY:'auto', flex:1 }}>
        {SAMPLE_NOTIFICATIONS.length === 0
          ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:160, gap:8, color:'var(--color-text-muted)', fontSize:12 }}>
              <Bell size={28} style={{ opacity:0.3 }} />
              새 알림이 없습니다.
            </div>
          )
          : SAMPLE_NOTIFICATIONS.map(n => {
            const { Icon, color } = TYPE_ICON[n.type] ?? TYPE_ICON.info
            return (
              <div key={n.id} style={{
                display:    'flex',
                gap:        12,
                padding:    '12px 16px',
                cursor:     'pointer',
                transition: 'background 0.12s',
                background: n.read ? 'transparent' : 'rgba(var(--color-accent-rgb, 37,99,235), 0.04)',
                borderBottom: '1px solid var(--color-border)',
              }}
                onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(37,99,235,0.04)'}
              >
                {/* 아이콘 */}
                <div style={{ width:32, height:32, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                  <Icon size={15} style={{ color }} />
                </div>

                {/* 내용 */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight: n.read ? 500 : 700, color:'var(--color-text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize:11, color:'var(--color-text-muted)', flexShrink:0 }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize:12, color:'var(--color-text-secondary)', margin:'0 0 6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {n.body}
                  </p>
                  {n.download && (
                    <button
                      onClick={e => { e.stopPropagation(); toast.info('다운로드를 시작합니다.') }}
                      style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, color:'var(--color-accent)', background:'rgba(37,99,235,0.08)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:'var(--radius-md)', padding:'2px 8px', cursor:'pointer', transition:'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(37,99,235,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background='rgba(37,99,235,0.08)'}
                    >
                      <Download size={11} /> 파일 받기
                    </button>
                  )}
                </div>

                {/* 읽지 않은 표시 */}
                {!n.read && (
                  <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--color-accent)', flexShrink:0, alignSelf:'center' }} />
                )}
              </div>
            )
          })
        }
      </div>

      {/* 푸터 */}
      <div style={{ padding:'10px 16px', borderTop:'1px solid var(--color-border)', flexShrink:0, textAlign:'center' }}>
        <button style={{ fontSize:12, color:'var(--color-accent)', background:'none', border:'none', cursor:'pointer', fontWeight:500 }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.7'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >
          전체 알림 보기
        </button>
      </div>

      <style>{`
        @keyframes notiIn {
          from { opacity:0; transform: translateY(-8px) }
          to   { opacity:1; transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}
