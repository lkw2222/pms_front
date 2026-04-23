/**
 * 배경 타일 레이어 설정.
 * 현재: VWorld API (외부망 개발용)
 * 운영: Apache 정적 타일 서버 (폐쇄망) — URL만 교체하면 됨
 *
 * 교체 방법:
 *   const tileUrl = (layer) => `http://내부서버/tiles/${layer}/{z}/{x}/{y}.png`
 *
 * @author JDJ
 * @since 2026-04-22
 */

import TileLayer from 'ol/layer/Tile'
import XYZ      from 'ol/source/XYZ'

// ── 타일 서버 URL ─────────────────────────────────────────────────────────────
// TODO: 운영 환경에서 Apache 내부 타일 서버 URL로 교체
const VWORLD_KEY = '8105102E-2501-375F-87BF-64F42A2720FA'
const tileUrl = (layer) =>
  `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/${layer}/{z}/{y}/{x}.png`

// ── 타일 레이어 생성 ──────────────────────────────────────────────────────────
function createTileLayer(layer) {
  return new TileLayer({
    source: new XYZ({
      url:          tileUrl(layer),
      crossOrigin:  'anonymous',
      attributions: '© VWorld',
      maxZoom:      19,
    }),
  })
}

// ── 레이어 정의 ───────────────────────────────────────────────────────────────
// label: 레이어 전환 UI에 표시될 이름
// create: 레이어 인스턴스 생성 함수 (배열 반환 가능 — 복합 레이어)
export const TILE_LAYERS = {
  Base:   { label: '일반',       create: () => createTileLayer('Base') },
  hybrid: { label: '하이브리드', create: () => [
    createTileLayer('Satellite'),
    createTileLayer('Hybrid'),
  ]},
}
