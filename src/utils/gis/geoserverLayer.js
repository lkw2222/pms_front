/**
 * GeoServer 레이어 설정.
 * 설비 데이터를 WMS(렌더링) / WFS(피처 조회) 로 서빙.
 *
 * TODO: GeoServer 연동 시 아래 상수 및 함수 구현
 *   - GEOSERVER_URL: 내부망 GeoServer 주소
 *   - createWMSLayer: 설비 WMS 레이어 생성
 *   - createWFSSource: 설비 WFS VectorSource 생성
 *
 * @author JDJ
 * @since 2026-04-22
 */

import TileLayer   from 'ol/layer/Tile'
import TileWMS     from 'ol/source/TileWMS'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON     from 'ol/format/GeoJSON'

// ── GeoServer 접속 정보 ───────────────────────────────────────────────────────
// TODO: 환경변수 또는 설정 파일로 관리
export const GEOSERVER_URL      = 'http://내부서버/geoserver'
export const GEOSERVER_WORKSPACE = 'pms'

// ── WMS 레이어 생성 (렌더링 전용) ─────────────────────────────────────────────
// @param {string} layerName  GeoServer 레이어명 (workspace:layer 형식)
// @param {number} [zIndex=5]
export function createWMSLayer(layerName, zIndex = 5) {
  return new TileLayer({
    source: new TileWMS({
      url:    `${GEOSERVER_URL}/wms`,
      params: { LAYERS: layerName, TILED: true },
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
    }),
    zIndex,
  })
}

// ── WFS VectorSource 생성 (피처 클릭·조회용) ──────────────────────────────────
// @param {string} layerName  GeoServer 레이어명
// @param {string} [srsName]  좌표계 (기본 EPSG:3857)
export function createWFSSource(layerName, srsName = 'EPSG:3857') {
  return new VectorSource({
    format: new GeoJSON(),
    url: (extent) =>
      `${GEOSERVER_URL}/wfs?service=WFS&version=1.1.0&request=GetFeature` +
      `&typeName=${layerName}&outputFormat=application/json` +
      `&srsname=${srsName}&bbox=${extent.join(',')},${srsName}`,
    strategy: (extent) => [extent],  // bbox 전략 — 뷰포트 내 피처만 로드
  })
}

// ── WFS VectorLayer 생성 ──────────────────────────────────────────────────────
export function createWFSLayer(layerName, style, zIndex = 5) {
  return new VectorLayer({
    source: createWFSSource(layerName),
    style,
    zIndex,
  })
}
