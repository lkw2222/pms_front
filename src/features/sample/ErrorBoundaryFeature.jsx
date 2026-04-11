import React, { Suspense, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import ErrorBoundary    from '@/components/feedback/ErrorBoundary.jsx'
import BasicButton      from '@/components/button/BasicButton.jsx'
import { LoadingState } from '@/components/feedback/QueryState.jsx'
import { AlertTriangle, RotateCcw } from 'lucide-react'

// ── 에러를 강제로 던지는 컴포넌트 ────────────────────────────────────────────
function BombComponent() {
  throw new Error('테스트 에러입니다. API 호출 실패를 시뮬레이션합니다.')
}

// ── 느린 API를 시뮬레이션하는 컴포넌트 ───────────────────────────────────────
function SlowComponent({ delay, queryKey }) {
  useSuspenseQuery({
    queryKey: [queryKey],
    queryFn:  async () => {
      await new Promise(r => setTimeout(r, delay))
      return {}
    },
    staleTime: 0,
    gcTime:    0,
  })
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      height:'100%', fontSize:13, color:'var(--color-text-muted)',
    }}>
      로딩 완료 ({delay}ms)
    </div>
  )
}

// ── 공통 UI ───────────────────────────────────────────────────────────────────
function DemoBox({ label, height = 150, children }) {
  return (
    <div style={{ border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)', overflow:'hidden', flex:1 }}>
      <div style={{
        padding:'5px 12px', background:'var(--color-bg-tertiary)',
        borderBottom:'1px solid var(--color-border)',
        fontSize:11, fontWeight:600, color:'var(--color-text-muted)',
      }}>{label}</div>
      <div style={{ height }}>{children}</div>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize:12, fontWeight:700, color:'var(--color-text-primary)',
      marginBottom:10, paddingBottom:6,
      borderBottom:'2px solid var(--color-accent)',
      display:'inline-block',
    }}>{children}</div>
  )
}

// ── ErrorBoundary 데모 ────────────────────────────────────────────────────────
function ErrorBoundaryDemo() {
  const [explode, setExplode] = useState(false)
  return (
    <div style={{ marginBottom:24 }}>
      <SectionTitle>ErrorBoundary</SectionTitle>
      <div style={{ fontSize:12, color:'var(--color-text-muted)', marginBottom:10 }}>
        에러 발생 시 해당 영역을 에러 UI로 교체합니다. Panel에 감싸면 탭 전체, 위젯에 감싸면 해당 위젯만 교체됩니다.
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <BasicButton
          label={explode ? '에러 복구' : '에러 발생시키기'}
          icon={AlertTriangle}
          variant={explode ? 'secondary' : 'danger'}
          size="sm"
          onClick={() => setExplode(v => !v)}
        />
      </div>
      <DemoBox label="ErrorBoundary 감싼 영역 — 에러 시 내부만 교체">
        <ErrorBoundary>
          {explode ? <BombComponent /> : (
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'center',
              height:'100%', fontSize:13, color:'var(--color-text-muted)',
            }}>
              정상 상태입니다. 위 버튼을 눌러 에러를 발생시켜 보세요.
            </div>
          )}
        </ErrorBoundary>
      </DemoBox>
    </div>
  )
}

// ── Suspense 데모 ─────────────────────────────────────────────────────────────
function SuspenseDemo() {
  const [key, setKey] = useState(0)
  return (
    <div>
      <SectionTitle>Suspense (로딩)</SectionTitle>
      <div style={{ fontSize:12, color:'var(--color-text-muted)', marginBottom:10 }}>
        차트·위젯 피처에서 사용합니다. Panel/SectionHeader는 즉시 그려지고 차트 영역만 로딩이 걸립니다. 그리드는 AG Grid <code style={{ fontSize:11, color:'var(--color-accent)' }}>loading</code> prop을 사용합니다.
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <BasicButton
          label="다시 로딩"
          icon={RotateCcw}
          variant="secondary"
          size="sm"
          onClick={() => setKey(v => v + 1)}
        />
        <span style={{ fontSize:12, color:'var(--color-text-muted)' }}>클릭 시 캐시 초기화 후 로딩 재실행</span>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <DemoBox label="Suspense — 600ms">
          <Suspense fallback={<LoadingState message="데이터 로딩 중..." />}>
            <SlowComponent key={`a-${key}`} delay={600} queryKey={`slow-a-${key}`} />
          </Suspense>
        </DemoBox>
        <DemoBox label="Suspense — 1800ms (느린 API 시뮬레이션)">
          <Suspense fallback={<LoadingState message="데이터 로딩 중..." />}>
            <SlowComponent key={`b-${key}`} delay={1800} queryKey={`slow-b-${key}`} />
          </Suspense>
        </DemoBox>
      </div>
    </div>
  )
}

// ── export ────────────────────────────────────────────────────────────────────
export default function ErrorBoundaryFeature() {
  return (
    <div>
      <ErrorBoundaryDemo />
      <SuspenseDemo />
    </div>
  )
}
