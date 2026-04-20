import React, { useEffect, useRef } from 'react'
import { Activity, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

// ── 샘플 데이터 (WebSocket 연동 시 교체) ─────────────────────────────────────
// WebSocket 연결 후 afterConnectionEstablished 에서 아래 형태로 수신
// {
//   id:      'job_001',
//   type:    'WIND_LOAD' | 'COMBINED_LOAD' | 'SCC',
//   title:   '풍하중 분석',
//   status:  'running' | 'done' | 'failed',
//   current: 78432,
//   total:   100000,
// }
const SAMPLE_JOBS = [
  { id:'job_001', type:'WIND_LOAD',      title:'풍하중',       status:'running', current:78432,  total:100000 },
  { id:'job_002', type:'COMBINED_LOAD',  title:'편·복합 하중', status:'running', current:32100,  total:100000 },
  { id:'job_003', type:'SCC',            title:'SCC',          status:'running', current:5000,   total:100000 },
]

const STATUS_CONFIG = {
  running: { Icon: Loader2,      color: 'var(--color-accent)',   label: '진행중', spin: true  },
  done:    { Icon: CheckCircle,  color: 'var(--color-success)',  label: '완료',   spin: false },
  failed:  { Icon: AlertCircle,  color: 'var(--color-danger)',   label: '실패',   spin: false },
}

/**
 * JobProgressWidget
 * 탑바 작업 현황 드롭다운
 *
 * @param {boolean}  open    - 열림 여부
 * @param {function} onClose - 닫기 핸들러
 */
export default function JobProgressWidget({ open, onClose }) {
  const panelRef   = useRef(null)
  const runningCount = SAMPLE_JOBS.filter(j => j.status === 'running').length

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
      right:         90,
      width:         320,
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
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 16px', borderBottom:'1px solid var(--color-border)', flexShrink:0 }}>
        <Activity size={14} style={{ color:'var(--color-text-secondary)' }} />
        <span style={{ fontSize:13, fontWeight:700, color:'var(--color-text-primary)', flex:1 }}>작업 현황</span>
        {runningCount > 0 && (
          <span style={{ fontSize:11, fontWeight:700, color:'#fff', background:'var(--color-accent)', borderRadius:10, padding:'1px 7px' }}>
            {runningCount} 진행중
          </span>
        )}
      </div>

      {/* 작업 목록 */}
      <div style={{ display:'flex', flexDirection:'column', padding:'8px' }}>
        {SAMPLE_JOBS.map(job => {
          const pct    = Math.round((job.current / job.total) * 100)
          const cfg    = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.running
          return (
            <div key={job.id} style={{ padding:'10px 10px', borderRadius:'var(--radius-md)', marginBottom:2, transition:'background 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              {/* 제목 + 상태 */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <cfg.Icon size={13} style={{ color:cfg.color, animation: cfg.spin ? 'spin 1.2s linear infinite' : 'none', flexShrink:0 }} />
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--color-text-primary)' }}>{job.title}</span>
                </div>
                <span style={{ fontSize:12, fontWeight:700, color: job.status === 'running' ? 'var(--color-accent)' : cfg.color }}>
                  {job.status === 'done' ? '완료' : job.status === 'failed' ? '실패' : `${pct}%`}
                </span>
              </div>

              {/* 프로그레스 바 */}
              <div style={{ height:6, background:'var(--color-bg-hover, #e5e7eb)', borderRadius:3, overflow:'hidden', marginBottom:6 }}>
                <div style={{
                  height:           '100%',
                  width:            `${pct}%`,
                  borderRadius:     3,
                  background:       job.status === 'failed' ? 'var(--color-danger)' : job.status === 'done' ? 'var(--color-success)' : 'var(--color-accent)',
                  transition:       'width 0.4s ease',
                }} />
              </div>

              {/* 카운트 */}
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--color-text-muted)' }}>
                <span>{job.current.toLocaleString()} / {job.total.toLocaleString()}건</span>
                <span>{cfg.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes notiIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin    { from { transform:rotate(0deg) }               to { transform:rotate(360deg) }           }
      `}</style>
    </div>
  )
}
