/**
 * SCC 진단우선순위 등급 공통 상수.
 * BasicLabel.module.css 의 색상 구조를 JS 상수로 동기화.
 *
 * ┌─────────────┬──────────────────────────────┬──────────────────────────────┐
 * │ 상수         │ 용도                          │ 대응 CSS 속성                │
 * ├─────────────┼──────────────────────────────┼──────────────────────────────┤
 * │ GRADE_VARIANT│ BasicLabel variant 키        │ CSS class (.danger 등)       │
 * │ GRADE_COLOR  │ solid hex — OL 지도 포인트   │ color (rgba 베이스 hex)      │
 * │ GRADE_BG     │ 반투명 배경 — 차트 슬라이스  │ background: rgba(..., 0.15)  │
 * │ GRADE_BORDER │ 반투명 보더 — 범례 등        │ border-color: rgba(..., 0.3) │
 * │ GRADE_NAME   │ 한글 명칭                    │ —                            │
 * └─────────────┴──────────────────────────────┴──────────────────────────────┘
 *
 * 등급 순서: S(즉시위험) > A(고위험) > B(중위험) > C(저위험) > D(정기진단)
 *
 * @author JDJ
 * @since 2026-04-24
 */

/** BasicLabel variant 키 매핑 */
export const GRADE_VARIANT = {
    S: 'danger',   // 빨강  #f85149
    A: 'warning',  // 주황  #d29922
    B: 'success',  // 초록  #3fb950
    C: 'info',     // 파랑  #58a6ff
    D: 'blue',     // 진파랑 #2563eb
}

/**
 * solid hex — OpenLayers 포인트 텍스트·지도 마커 등 CSS var 를 못 쓰는 곳에 사용.
 * BasicLabel.module.css 의 rgba 베이스 컬러(dark 기준)와 동일.
 */
export const GRADE_COLOR = {
    S: '#f85149',  // danger  — rgba(248, 81, 73)
    A: '#fbbf24',  // warning — rgba(210,153, 34)
    B: '#3fb950',  // success — rgba( 63,185, 80)
    C: '#58a6ff',  // info    — rgba( 88,166,255)
    D: '#2563eb',  // blue    — rgba( 37, 99,235)
}

/**
 * 반투명 배경색 (opacity 0.15) — BasicLabel.module.css background 와 동일.
 * ECharts 차트 슬라이스, 카드 배경 등에 사용.
 */
export const GRADE_BG = {
    S: 'rgba(248, 81, 73, 0.15)',   // danger
    A: 'rgba(251, 191, 36, 0.15)',   // warning
    B: 'rgba( 63,185, 80, 0.15)',   // success
    C: 'rgba( 88,166,255, 0.15)',   // info
    D: 'rgba( 37, 99,235, 0.15)',   // blue
}

/**
 * 반투명 보더색 (opacity 0.3) — BasicLabel.module.css border-color 와 동일.
 * 범례 테두리, 강조 박스 등에 사용.
 */
export const GRADE_BORDER = {
    S: 'rgba(248, 81, 73, 0.3)',    // danger
    A: 'rgba(251, 191, 36, 0.3)',    // warning
    B: 'rgba( 63,185, 80, 0.3)',    // success
    C: 'rgba( 88,166,255, 0.3)',    // info
    D: 'rgba( 37, 99,235, 0.3)',    // blue
}

/** 등급 한글 명칭 */
export const GRADE_NAME = {
    S: '즉시위험',
    A: '고위험',
    B: '중위험',
    C: '저위험',
    D: '정기진단',
}
