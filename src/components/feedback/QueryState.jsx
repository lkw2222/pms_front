import React from 'react'
import { AlertCircle, SearchX, RefreshCw } from 'lucide-react'
import BasicButton from '@/components/button/BasicButton.jsx'

// ── LoadingState ──────────────────────────────────────────────────────────────
function LoadingState({ message = '데이터를 불러오는 중입니다...' }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      height:'100%', gap:12, color:'var(--color-text-muted)',
    }}>
      <div style={{
        width:28, height:28, borderRadius:'50%',
        border:'3px solid var(--color-border)',
        borderTopColor:'var(--color-accent)',
        animation:'spin .7s linear infinite',
      }} />
      <span style={{ fontSize:13 }}>{message}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── ErrorState ────────────────────────────────────────────────────────────────
function ErrorState({ message = '데이터를 불러오지 못했습니다.', onRetry }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      height:'100%', gap:12,
    }}>
      <div style={{
        width:44, height:44, borderRadius:'50%',
        background:'rgba(239,68,68,0.08)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <AlertCircle size={22} color='var(--color-danger)' />
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
        <span style={{ fontSize:14, fontWeight:600, color:'var(--color-danger)' }}>조회 실패</span>
        <span style={{ fontSize:12, color:'var(--color-text-muted)' }}>{message}</span>
      </div>
      {onRetry && (
        <BasicButton label="다시 시도" icon={RefreshCw} variant="secondary" size="sm" onClick={onRetry} />
      )}
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState({ message = '데이터가 없습니다.' }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      height:'100%', gap:10, color:'var(--color-text-muted)',
    }}>
      <div style={{
        width:44, height:44, borderRadius:'50%',
        background:'var(--color-bg-tertiary)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <SearchX size={20} color='var(--color-text-muted)' />
      </div>
      <span style={{ fontSize:13 }}>{message}</span>
    </div>
  )
}

// ── QueryState ────────────────────────────────────────────────────────────────
/**
 * API 요청 상태(로딩 / 에러 / 빈 데이터)를 공통으로 표시하는 피드백 컴포넌트.
 * useQuery 결과에 따라 로딩/에러/정상 상태를 공통 UI로 처리
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}    props
 * @param {boolean}   [props.isLoading]    로딩 중 여부
 * @param {boolean}   [props.isError]      에러 여부
 * @param {Error}     [props.error]        에러 객체
 * @param {Function}  [props.onRetry]      다시 시도 핸들러
 * @param {string}    [props.loadingMsg]   로딩 메시지
 * @param {string}    [props.errorMsg]     에러 메시지
 * @param {ReactNode} [props.children]     정상 상태일 때 렌더링할 내용
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function QueryState({ isLoading, isError, error, onRetry, loadingMsg, errorMsg, style, children }) {
  if (isLoading) return <div style={{ flex:1, ...style }}><LoadingState message={loadingMsg} /></div>
  if (isError)   return <div style={{ flex:1, ...style }}><ErrorState  message={errorMsg ?? error?.message} onRetry={onRetry} /></div>
  return children
}

export { LoadingState, ErrorState, EmptyState }
