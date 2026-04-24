/**
 * OpenLayers 공통 스타일 정의.
 * 설비 타입별 포인트 모양, 전선/폴리곤 스타일, 드로우/마커 스타일 포함.
 *
 * @author JDJ
 * @since 2026-04-22
 */

import { Stroke, Fill, Style, Circle as CircleStyle, RegularShape, Icon as OlIcon, Text as OlText } from 'ol/style'
import { GRADE_COLOR } from '@/constants/gradeConst.js'

// ── 드로우(측정) 스타일 ───────────────────────────────────────────────────────
export const DRAW_STYLE = new Style({
  fill:   new Fill({ color: 'rgba(56,189,248,0.12)' }),
  stroke: new Stroke({ color: '#38bdf8', width: 2, lineDash: [6, 3] }),
  image:  new CircleStyle({ radius: 5, fill: new Fill({ color: '#38bdf8' }), stroke: new Stroke({ color: '#fff', width: 1.5 }) }),
})

// ── 핀 마커 스타일 (수동 마커 찍기용) ─────────────────────────────────────────
const PIN_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
  <path d="M14 1C7.373 1 2 6.373 2 13c0 9 12 22 12 22s12-13 12-22C26 6.373 20.627 1 14 1z"
    fill="#ef4444" stroke="#fff" stroke-width="2"/>
  <circle cx="14" cy="13" r="5" fill="#fff" opacity="0.9"/>
</svg>
`)

export const MARKER_STYLE = new Style({
  image: new OlIcon({
    src:          `data:image/svg+xml,${PIN_SVG}`,
    anchor:       [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    scale:        1,
  }),
})

// ── 설비 색상 ─────────────────────────────────────────────────────────────────
const F_COLOR_LINE     = '#f97316'   // 전선 주황
const F_COLOR_LINE_SEL = '#ea580c'   // 전선 선택
export const F_COLOR_WARN = '#f59e0b'   // 상태 '점검필요' 텍스트

// hex → rgba 변환 (OL 색상 파서가 8자리 hex를 미지원하므로 rgba 사용)
export const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// 포인트 공통 색상 (파랑 계열 통일)
const F_POINT     = '#3b82f6'   // 기본 — blue-500
const F_POINT_SEL = '#1d4ed8'   // 선택 — blue-700
/** @deprecated gradeConst.js 의 GRADE_COLOR 를 직접 사용하세요 */
export const GRADE_TEXT = GRADE_COLOR

// ── 포인트 모양 생성 ──────────────────────────────────────────────────────────
// RegularShape: points=꼭짓점 수, radius=크기, angle=회전각(라디안)
const makePointImage = (type, selected) => {
  const r  = selected ? 9 : 7
  const r2 = selected ? 11 : 9
  const fill   = new Fill({ color: selected ? F_POINT_SEL : F_POINT })
  const stroke = new Stroke({ color: '#fff', width: selected ? 2.5 : 1.5 })

  switch (type) {
    case '원':       return new CircleStyle({ radius: r, fill, stroke })
    case '사각형':   return new RegularShape({ points: 4, radius: r2, angle: Math.PI / 4, fill, stroke })
    case '마름모':   return new RegularShape({ points: 4, radius: r2, angle: 0, fill, stroke })
    case '삼각형':   return new RegularShape({ points: 3, radius: r2, angle: 0, fill, stroke })
    case '역삼각형': return new RegularShape({ points: 3, radius: r2, angle: Math.PI, fill, stroke })
    case '오각형':   return new RegularShape({ points: 5, radius: r2, angle: 0, fill, stroke })
    case '별':       return new RegularShape({ points: 5, radius: r2, radius2: r2 * 0.45, angle: 0, fill, stroke })
    case '십자':     return new RegularShape({ points: 4, radius: r2, radius2: r2 * 0.35, angle: Math.PI / 4, fill, stroke })
    default:         return new CircleStyle({ radius: r, fill, stroke })
  }
}

// 설비 타입 → 포인트 모양 매핑 (새 타입 추가 시 여기에 등록)
export const TYPE_SHAPE = {
  '전주':  '원',
  '변압기': '마름모',
}

// ── 설비 통합 스타일 함수 ─────────────────────────────────────────────────────
export const FACILITY_STYLE = (feature, selected = false) => {
  const geomType       = feature.getGeometry().getType()
  const grade          = feature.get('props')?.등급
  const gradeTextColor = GRADE_COLOR[grade] ?? '#475569'

  if (geomType === 'Point') {
    const shape = TYPE_SHAPE[feature.get('type')] ?? '원'
    return new Style({
      image: makePointImage(shape, selected),
      text: grade ? new OlText({
        text:    selected ? `${grade}  ${feature.get('type')} ${feature.get('id')}` : grade,
        offsetY: -14,
        font:    'bold 10px sans-serif',
        fill:    new Fill({ color: gradeTextColor }),
        stroke:  new Stroke({ color: '#fff', width: 3 }),
      }) : undefined,
    })
  }
  if (geomType === 'LineString') {
    return new Style({
      stroke: new Stroke({
        color: selected ? F_COLOR_LINE_SEL : F_COLOR_LINE,
        width: selected ? 4 : 3,
      }),
    })
  }
  if (geomType === 'Polygon') {
    return new Style({
      fill:   new Fill({ color: selected ? 'rgba(59,130,246,0.22)' : 'rgba(59,130,246,0.10)' }),
      stroke: new Stroke({ color: selected ? F_POINT_SEL : F_POINT, width: selected ? 2.5 : 1.5 }),
      text: selected ? new OlText({
        text:   feature.get('props')?.명칭 ?? feature.get('type'),
        font:   'bold 12px sans-serif',
        fill:   new Fill({ color: F_POINT_SEL }),
        stroke: new Stroke({ color: '#fff', width: 3 }),
      }) : undefined,
    })
  }
  return new Style()
}

// ── 컨트롤 패널 공통 인라인 스타일 ───────────────────────────────────────────
export const CTRL_PANEL = {
  background:    'var(--color-bg-secondary)',
  border:        '1px solid var(--color-border)',
  borderRadius:  'var(--radius-md)',
  boxShadow:     'var(--shadow-md)',
  padding:       5,
  display:       'flex',
  flexDirection: 'column',
  gap:           3,
}

export const CTRL_BTN = (active = false, danger = false) => ({
  width: 32, height: 32,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 6, cursor: 'pointer', transition: 'all .12s',
  border:     `1px solid ${active ? 'var(--color-accent)' : 'transparent'}`,
  background: active ? 'var(--color-accent)' : 'transparent',
  color:      active ? '#fff' : danger ? 'var(--color-danger)' : 'var(--color-text-secondary)',
  outline:    'none',
})

export const DIVIDER = { height: 1, background: 'var(--color-border)', margin: '2px 0' }
