import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import BasicButton from '@/components/button/BasicButton.jsx'

/**
 * 패널 레벨 에러 경계 컴포넌트. useQuery throwOnError: true 로 던진 에러를 캐치하며
 * 탭 전체를 에러 UI로 교체하고 "다시 시도" 클릭 시 컴포넌트 트리를 재마운트
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}    props
 * @param {ReactNode} props.children   감쌀 컴포넌트 트리
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const msg = this.state.error?.message ?? '알 수 없는 오류가 발생했습니다.'

    return (
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        height:'100%', gap:16,
      }}>
        <div style={{
          width:52, height:52, borderRadius:'50%',
          background:'rgba(239,68,68,0.08)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <AlertCircle size={26} color='var(--color-danger)' />
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:15, fontWeight:600, color:'var(--color-danger)' }}>오류가 발생했습니다</span>
          <span style={{ fontSize:12, color:'var(--color-text-muted)', maxWidth:320, textAlign:'center' }}>{msg}</span>
        </div>
        <BasicButton label="다시 시도" icon={RefreshCw} variant="secondary" onClick={this.handleRetry} />
      </div>
    )
  }
}
