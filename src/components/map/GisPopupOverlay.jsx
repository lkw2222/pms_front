/**
 * GIS 공통 팝업 오버레이 컴포넌트.
 * OL Overlay의 element 로 사용되므로 forwardRef 로 DOM ref 노출.
 *
 * 사용법:
 *   const popupRef = useRef(null)
 *
 *   // 지도 초기화 시
 *   const overlay = new Overlay({ element: popupRef.current, ... })
 *
 *   // JSX
 *   <GisPopupOverlay
 *     ref={popupRef}
 *     title="전주 · P-001"
 *     badge={{ text: 'A', color: '#16a34a' }}
 *     items={[
 *       { label: '전주종류', value: '원주' },
 *       { label: '판정',    value: '부적합', variant: 'danger' },
 *     ]}
 *     onClose={() => { overlay.setPosition(undefined) }}
 *   />
 *
 * Props:
 *   overlayRef {React.Ref}                       OL Overlay 인스턴스 ref
 *                                                → coord 변경 시 내부에서 setPosition 호출
 *   coord   {ol.Coordinate|null}                 OL 좌표 ([x,y]) — null 이면 팝업 숨김
 *   title   {string|null}                        헤더 타이틀 (예: "전주 · P-001")
 *   badge   {{ text:string, color:string }|null} 좌측 배지 (등급 등) — null 이면 미표시
 *   items   {Array<{ label, value, variant? }>}  속성 목록
 *             variant: 'default'(기본) | 'success' | 'danger' | 'warn'
 *   onClose {function}                           ✕ 버튼 클릭 핸들러
 *
 * @author JDJ
 * @since 2026-04-22
 */

import React, { forwardRef, useEffect } from 'react'
import { hexToRgba } from '@/utils/gis/gisStyle.js'

// variant → CSS color 변수 매핑
const VARIANT_COLOR = {
  success: 'var(--color-success)',
  danger:  'var(--color-danger)',
  warn:    'var(--color-warn)',
  warning: 'var(--color-warning)',
  info:    'var(--color-accent)',
  default: 'var(--color-text-primary)',
}

const GisPopupOverlay = forwardRef(function GisPopupOverlay(
  { overlayRef, coord, title, badge, items = [], onClose },
  ref
) {
  // React 렌더 완료 후 setPosition 호출
  // → 팝업 DOM 이 실제 크기로 그려진 뒤 autoPan 계산되므로 정확하게 패닝됨
  useEffect(() => {
    overlayRef?.current?.setPosition(coord ?? undefined)
  }, [coord, overlayRef])

  return (
    // ref 는 항상 마운트 — OL Overlay 가 이 DOM 엘리먼트를 참조
    <div ref={ref}>
      {/* popup 데이터가 있을 때만 카드 렌더 */}
      {title && (
        <div style={{
          background:   'var(--color-bg-secondary)',
          border:       '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow:    'var(--shadow-lg)',
          minWidth:     210,
          maxWidth:     280,
          overflow:     'hidden',
          // transform: 'translateX(-50%)'  ← 제거
          // OL Overlay positioning:'bottom-center' 가 이미 translate(-50%,-100%) 적용함
          // 여기서 또 translateX(-50%) 하면 이중 센터링 → autoPan 이 절반만 이동하는 버그
        }}>

          {/* ── 헤더 ── */}
          <div style={{
            padding:      '9px 12px',
            borderBottom: '1px solid var(--color-border)',
            display:      'flex', alignItems: 'center', justifyContent: 'space-between',
            background:   'var(--color-bg-tertiary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {/* 배지 (등급 등) */}
              {badge && (
                <span style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
                  padding: '2px 8px', borderRadius: 99,
                  background: hexToRgba(badge.color, 0.12),
                  color:      badge.color,
                  border:     `1px solid ${hexToRgba(badge.color, 0.4)}`,
                }}>{badge.text}</span>
              )}
              {/* 타이틀 */}
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {title}
              </span>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none',
                color: 'var(--color-text-muted)', cursor: 'pointer',
                fontSize: 16, lineHeight: 1, padding: '0 2px',
                display: 'flex', alignItems: 'center',
              }}
            >✕</button>
          </div>

          {/* ── 속성 목록 ── */}
          <div style={{ padding: '4px 0' }}>
            {items.map(({ label, value, variant = 'default' }) => (
              <div
                key={label}
                style={{
                  display:             'grid',
                  gridTemplateColumns: '76px 1fr',
                  padding:             '5px 12px',
                  fontSize:            12,
                  transition:          'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</span>
                <span style={{
                  color:      VARIANT_COLOR[variant] ?? VARIANT_COLOR.default,
                  fontWeight: variant !== 'default' ? 600 : 400,
                }}>{value}</span>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
})

export default GisPopupOverlay
