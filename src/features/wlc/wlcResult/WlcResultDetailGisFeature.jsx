import React, { useEffect, useRef, useState, useCallback } from 'react'
import { toast } from 'sonner'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Draw from 'ol/interaction/Draw'
import { fromLonLat, toLonLat } from 'ol/proj'
import { getLength, getArea } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
import Overlay from 'ol/Overlay'
import { LineString, Polygon, Point } from 'ol/geom'
import { Stroke, Fill, Style, Circle as CircleStyle, RegularShape, Icon as OlIcon, Text as OlText } from 'ol/style'
import Feature from 'ol/Feature'
import Select from 'ol/interaction/Select'
import { click } from 'ol/events/condition'
import 'ol/ol.css'

import {
  Ruler, Square, Trash2, MousePointer,
  ZoomIn, ZoomOut, Maximize2,
  MapPin, Camera, Layers, ChevronRight, PenTool,
} from 'lucide-react'

// ── OpenLayers 스타일 ────────────────────────────────────────────────────────
const DRAW_STYLE = new Style({
  fill:   new Fill({ color: 'rgba(56,189,248,0.12)' }),
  stroke: new Stroke({ color: '#38bdf8', width: 2, lineDash: [6, 3] }),
  image:  new CircleStyle({ radius: 5, fill: new Fill({ color: '#38bdf8' }), stroke: new Stroke({ color: '#fff', width: 1.5 }) }),
})
// SVG 핀 마커 (lucide MapPin 스타일)
const PIN_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
  <path d="M14 1C7.373 1 2 6.373 2 13c0 9 12 22 12 22s12-13 12-22C26 6.373 20.627 1 14 1z"
    fill="#ef4444" stroke="#fff" stroke-width="2"/>
  <circle cx="14" cy="13" r="5" fill="#fff" opacity="0.9"/>
</svg>
`)

const MARKER_STYLE = new Style({
  image: new OlIcon({
    src: `data:image/svg+xml,${PIN_SVG}`,
    anchor: [0.5, 1],          // 핀 하단 꼭짓점이 좌표에 맞춰짐
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    scale: 1,
  }),
})

// ── 설비 샘플 데이터 (GeoServer 연동 시 WMS/WFS 레이어로 교체) ───────────────
const FACILITY_FEATURES = [
  // 점 - 전주
  new Feature({
    geometry: new Point(fromLonLat([127.0246, 37.5326])),
    type: '전주', id: 'P-001',
    props: { 관리번호:'P-001', 규격:'16m/400kg', 재질:'철근콘크리트', 설치일:'2018-03-15', 관리기관:'한전 서울본부', 등급:'A', 상태:'정상' },
  }),
  new Feature({
    geometry: new Point(fromLonLat([127.0268, 37.5312])),
    type: '변압기', id: 'T-001',
    props: { 관리번호:'T-001', 용량:'100kVA', 전압:'22.9kV/380V', 설치일:'2020-07-22', 관리기관:'한전 서울본부', 등급:'C', 상태:'정상' },
  }),
  new Feature({
    geometry: new Point(fromLonLat([127.0225, 37.5338])),
    type: '전주', id: 'P-002',
    props: { 관리번호:'P-002', 규격:'14m/350kg', 재질:'철근콘크리트', 설치일:'2019-11-05', 관리기관:'한전 서울본부', 등급:'E', 상태:'점검필요' },
  }),

  // 선 - 전선
  new Feature({
    geometry: new LineString([
      fromLonLat([127.0246, 37.5326]),
      fromLonLat([127.0255, 37.5320]),
      fromLonLat([127.0268, 37.5312]),
    ]),
    type: '전선', id: 'L-001',
    props: { 관리번호:'L-001', 전압등급:'22.9kV', 전선종류:'ACSR 95mm²', 길이:'320m', 설치일:'2018-03-15', 등급:'B', 상태:'정상' },
  }),
  new Feature({
    geometry: new LineString([
      fromLonLat([127.0225, 37.5338]),
      fromLonLat([127.0235, 37.5330]),
      fromLonLat([127.0246, 37.5326]),
    ]),
    type: '전선', id: 'L-002',
    props: { 관리번호:'L-002', 전압등급:'22.9kV', 전선종류:'ACSR 95mm²', 길이:'280m', 설치일:'2019-11-05', 등급:'D', 상태:'정상' },
  }),

  // 면 - 변전소 구역
  new Feature({
    geometry: new Polygon([[
      fromLonLat([127.0260, 37.5335]),
      fromLonLat([127.0275, 37.5335]),
      fromLonLat([127.0275, 37.5325]),
      fromLonLat([127.0260, 37.5325]),
      fromLonLat([127.0260, 37.5335]),
    ]]),
    type: '변전소', id: 'S-001',
    props: { 관리번호:'S-001', 명칭:'강남 변전소', 전압등급:'154kV/22.9kV', 면적:'2,400m²', 준공일:'2010-06-01', 관리기관:'한전 서울본부', 등급:'B', 상태:'정상' },
  }),
]

// ── 설비 색상 ─────────────────────────────────────────────────────────────────
const F_COLOR_LINE     = '#f97316'   // 전선 주황
const F_COLOR_LINE_SEL = '#ea580c'   // 전선 선택
const F_COLOR_WARN     = '#f59e0b'   // 상태 '점검필요' 텍스트

// hex → rgba 변환 (OL 색상 파서가 8자리 hex를 미지원하므로 rgba 사용)
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// 포인트 공통 색상 (파랑 계열 통일)
const F_POINT      = '#3b82f6'   // 기본 — blue-500
const F_POINT_SEL  = '#1d4ed8'   // 선택 — blue-700
const GRADE_TEXT   = { A:'#16a34a', B:'#2563eb', C:'#ca8a04', D:'#ea580c', E:'#dc2626', F:'#7f1d1d' }

// ── 포인트 모양 정의 ─────────────────────────────────────────────────────────
// RegularShape: points=꼭짓점 수, radius=크기, angle=회전각(라디안)
// radius2 지정 시 별 모양 (외곽radius, 안쪽radius2)
const makePointImage = (type, selected) => {
  const r  = selected ? 9 : 7
  const r2 = selected ? 11 : 9
  const fill   = new Fill({ color: selected ? F_POINT_SEL : F_POINT })
  const stroke = new Stroke({ color: '#fff', width: selected ? 2.5 : 1.5 })

  switch (type) {
    case '원':      // ● 원
      return new CircleStyle({ radius: r, fill, stroke })
    case '사각형':  // ■ 정사각형
      return new RegularShape({ points: 4, radius: r2, angle: Math.PI / 4, fill, stroke })
    case '마름모':  // ◆ 마름모
      return new RegularShape({ points: 4, radius: r2, angle: 0, fill, stroke })
    case '삼각형':  // ▲ 삼각형
      return new RegularShape({ points: 3, radius: r2, angle: 0, fill, stroke })
    case '역삼각형':// ▼ 역삼각형
      return new RegularShape({ points: 3, radius: r2, angle: Math.PI, fill, stroke })
    case '오각형':  // ⬠ 오각형
      return new RegularShape({ points: 5, radius: r2, angle: 0, fill, stroke })
    case '별':      // ★ 별
      return new RegularShape({ points: 5, radius: r2, radius2: r2 * 0.45, angle: 0, fill, stroke })
    case '십자':    // ✛ 십자 (8각 별 변형)
      return new RegularShape({ points: 4, radius: r2, radius2: r2 * 0.35, angle: Math.PI / 4, fill, stroke })
    default:
      return new CircleStyle({ radius: r, fill, stroke })
  }
}

// 시설물 타입 → 포인트 모양 매핑 (여기서 원하는 모양으로 변경)
const TYPE_SHAPE = {
  '전주':   '원',
  '변압기':  '마름모',
  // 새 타입 추가 시: '장비명': '삼각형' 등
}

// 설비 통합 스타일
const FACILITY_STYLE = (feature, selected = false) => {
  const geomType  = feature.getGeometry().getType()
  const grade     = feature.get('props')?.등급
  const gradeTextColor = GRADE_TEXT[grade] ?? '#475569'

  if (geomType === 'Point') {
    const shape = TYPE_SHAPE[feature.get('type')] ?? '원'
    return new Style({
      image: makePointImage(shape, selected),
      text: grade ? new OlText({
        text:    selected ? `${grade}  ${feature.get('type')} ${feature.get('id')}` : grade,
        offsetY: -14,
        font:    `bold 10px sans-serif`,
        fill:    new Fill({ color: gradeTextColor }),
        stroke:  new Stroke({ color: '#fff', width: 3 }),
      }) : undefined,
    })
  }
  if (geomType === 'LineString') {
    // 전선은 주황 고정, 등급은 팝업으로만 확인
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

// ── 지역본부 / 사업소 샘플 데이터 (API 연동 시 서버 데이터로 교체) ────────────
const REGION_DATA = [
  {
    id: 'seoul', label: '서울본부',
    offices: [
      { id: 'seoul-gangnam',  label: '강남사업소', lon: 127.0471, lat: 37.5172, zoom: 14 },
      { id: 'seoul-gangbuk',  label: '강북사업소', lon: 127.0276, lat: 37.6396, zoom: 14 },
      { id: 'seoul-jongno',   label: '종로사업소', lon: 126.9784, lat: 37.5704, zoom: 14 },
      { id: 'seoul-mapo',     label: '마포사업소', lon: 126.9010, lat: 37.5511, zoom: 14 },
    ],
  },
  {
    id: 'gyeonggi', label: '경기본부',
    offices: [
      { id: 'gyeonggi-suwon',   label: '수원사업소', lon: 127.0286, lat: 37.2636, zoom: 13 },
      { id: 'gyeonggi-seongnam',label: '성남사업소', lon: 127.1378, lat: 37.4201, zoom: 13 },
      { id: 'gyeonggi-bucheon', label: '부천사업소', lon: 126.7830, lat: 37.5034, zoom: 13 },
      { id: 'gyeonggi-anyang',  label: '안양사업소', lon: 126.9568, lat: 37.3943, zoom: 13 },
    ],
  },
  {
    id: 'incheon', label: '인천본부',
    offices: [
      { id: 'incheon-main',    label: '인천사업소', lon: 126.7052, lat: 37.4563, zoom: 13 },
      { id: 'incheon-bupyeong',label: '부평사업소', lon: 126.7218, lat: 37.5082, zoom: 14 },
      { id: 'incheon-namdong', label: '남동사업소', lon: 126.7296, lat: 37.4456, zoom: 14 },
    ],
  },
  {
    id: 'gangwon', label: '강원본부',
    offices: [
      { id: 'gangwon-chuncheon', label: '춘천사업소', lon: 127.7298, lat: 37.8813, zoom: 13 },
      { id: 'gangwon-wonju',     label: '원주사업소', lon: 127.9298, lat: 37.3422, zoom: 13 },
      { id: 'gangwon-gangneung', label: '강릉사업소', lon: 128.8784, lat: 37.7519, zoom: 13 },
    ],
  },
]

// ── 브이월드 API 설정 ────────────────────────────────────────────────────────
const VWORLD_KEY = '8105102E-2501-375F-87BF-64F42A2720FA'

// 브이월드 XYZ 타일 URL (z/y/x 순서)
const vworldUrl = (layer) =>
  `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/${layer}/{z}/{y}/{x}.png`

function createVWorldLayer(layer) {
  return new TileLayer({
    source: new XYZ({
      url:          vworldUrl(layer),
      crossOrigin:  'anonymous',
      attributions: '© 브이월드',
      maxZoom:      19,
    }),
  })
}

// ── 레이어 정의 ──────────────────────────────────────────────────────────────
const LAYERS = {
  Base:   { label: '일반',       create: () => createVWorldLayer('Base') },
  hybrid: { label: '하이브리드', create: () => [
    createVWorldLayer('Satellite'),
    createVWorldLayer('Hybrid'),
  ]},
}

// ── 컨트롤 패널 공통 스타일 (CSS 변수 사용 — 다크/라이트 자동 대응) ───────────
const CTRL_PANEL = {
  background:    'var(--color-bg-secondary)',
  border:        '1px solid var(--color-border)',
  borderRadius:  'var(--radius-md)',
  boxShadow:     'var(--shadow-md)',
  padding:       5,
  display:       'flex',
  flexDirection: 'column',
  gap:           3,
}

const CTRL_BTN = (active = false, danger = false) => ({
  width: 32, height: 32,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 6, cursor: 'pointer', transition: 'all .12s',
  border: `1px solid ${active ? 'var(--color-accent)' : 'transparent'}`,
  background: active ? 'var(--color-accent)' : 'transparent',
  color: active ? '#fff' : danger ? 'var(--color-danger)' : 'var(--color-text-secondary)',
  outline: 'none',
})

const DIVIDER = { height: 1, background: 'var(--color-border)', margin: '2px 0' }

// ── 각도 측정 아이콘 SVG ────────────────────────────────────────────────────
function AngleIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* 수평선 */}
      <line x1="3" y1="19" x2="21" y2="19" />
      {/* 사선 */}
      <line x1="3" y1="19" x2="14" y2="5" />
      {/* 호 (각도 표시) */}
      <path d="M8 19 A6 6 0 0 1 11.5 9.5" />
      {/* 각도 점 */}
      <circle cx="3" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

// ── 툴팁 컴포넌트 (CSS position:absolute, 버튼 감싸는 wrapper 방식) ──────────
function Tip({ text, side = 'right', children }) {
  const tipStyle = {
    position: 'absolute',
    ...(side === 'bottom'
      ? { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' }
      : side === 'right'
        ? { top: '50%', transform: 'translateY(-50%)', left: 'calc(100% + 8px)' }
        : { top: '50%', transform: 'translateY(-50%)', right: 'calc(100% + 8px)' }
    ),
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '4px 8px',
    fontSize: 11, fontWeight: 500,
    color: 'var(--color-text-primary)',
    boxShadow: 'var(--shadow-md)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity .15s',
    zIndex: 9999,
  }
  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={e => e.currentTarget.querySelector('.gis-tip').style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.querySelector('.gis-tip').style.opacity = '0'}
    >
      {children}
      <div className="gis-tip" style={tipStyle}>{text}</div>
    </div>
  )
}

export default function WlcResultDetailGisFeature() {
  const mapRef       = useRef(null)
  const mapObj       = useRef(null)
  const drawRef      = useRef(null)
  const sourceRef    = useRef(new VectorSource())
  const markerSrcRef = useRef(new VectorSource())
  const tooltipRef   = useRef(null)   // 마우스 따라다니는 실시간 툴팁
  const overlayRef   = useRef(null)   // 실시간 툴팁 overlay
  const segOverlays  = useRef([])     // 구간 거리 overlay 목록
  const baseLayers   = useRef([])

  const facilitySourceRef = useRef(new VectorSource({ features: FACILITY_FEATURES }))
  const popupRef          = useRef(null)
  const popupOverlayRef   = useRef(null)

  const [mode,           setMode]           = useState('none')
  const [result,         setResult]         = useState(null)
  const [zoomLevel,      setZoomLevel]      = useState(12)
  const [layerType,      setLayerType]      = useState('Base')
  const [selectedHub,    setSelectedHub]    = useState('')
  const [selectedOffice, setSelectedOffice] = useState('')
  const [coordInfo,  setCoordInfo]  = useState(null)
  const [showLayers, setShowLayers] = useState(false)
  const [showTools,  setShowTools]  = useState(false)
  const [popup,      setPopup]      = useState(null)   // { type, id, props }

  // ── 지도 초기화 ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const drawLayer     = new VectorLayer({ source: sourceRef.current,         style: DRAW_STYLE,   zIndex: 10 })
    const markerLayer   = new VectorLayer({ source: markerSrcRef.current,       style: MARKER_STYLE, zIndex: 11 })
    const facilityLayer = new VectorLayer({
      source: facilitySourceRef.current,
      style:  (f) => FACILITY_STYLE(f, false),
      zIndex: 5,
    })
    const baseLayer = LAYERS.Base.create()
    baseLayers.current = [baseLayer]

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, facilityLayer, drawLayer, markerLayer],
      view: new View({ center: fromLonLat([127.024612, 37.532600]), zoom: 15, minZoom: 6, maxZoom: 19 }),
      controls: [],
    })

    // ── 팝업 오버레이 ──────────────────────────────────────────────────────
    const popupOverlay = new Overlay({
      element:    popupRef.current,
      positioning:'bottom-center',
      offset:     [0, -10],
      stopEvent:  false,
    })
    map.addOverlay(popupOverlay)
    popupOverlayRef.current = popupOverlay

    // ── 설비 클릭 Select ──────────────────────────────────────────────────
    const select = new Select({
      condition: click,
      layers:    [facilityLayer],
      style:     (f) => FACILITY_STYLE(f, true),
    })
    select.on('select', (e) => {
      if (e.selected.length > 0) {
        const f    = e.selected[0]
        const coord = f.getGeometry().getType() === 'Point'
          ? f.getGeometry().getCoordinates()
          : f.getGeometry().getType() === 'LineString'
            ? f.getGeometry().getCoordinateAt(0.5)
            : f.getGeometry().getInteriorPoint().getCoordinates()
        popupOverlay.setPosition(coord)
        setPopup({ type: f.get('type'), id: f.get('id'), props: f.get('props') })
      } else {
        popupOverlay.setPosition(undefined)
        setPopup(null)
      }
    })
    map.addInteraction(select)

    // 실시간 마우스 툴팁
    const tooltipEl = document.createElement('div')
    tooltipEl.style.cssText = 'background:rgba(15,23,42,0.92);color:#38bdf8;border:1px solid #38bdf8;border-radius:6px;padding:4px 10px;font-size:11px;white-space:nowrap;pointer-events:none;font-family:monospace;display:none;'
    tooltipRef.current = tooltipEl
    const overlay = new Overlay({ element: tooltipEl, offset: [12, -12], positioning: 'bottom-left' })
    map.addOverlay(overlay)
    overlayRef.current = overlay

    map.getView().on('change:resolution', () => setZoomLevel(Math.round(map.getView().getZoom())))
    map.on('pointermove', (e) => {
      const [lon, lat] = toLonLat(e.coordinate)
      setCoordInfo({ lon: lon.toFixed(6), lat: lat.toFixed(6) })
    })

    mapObj.current = map
    return () => map.setTarget(null)
  }, [])

  // ── 레이어 전환 ─────────────────────────────────────────────────────────────
  const handleLayerChange = useCallback((type) => {
    const map = mapObj.current
    if (!map) return
    baseLayers.current.forEach(l => map.removeLayer(l))
    const created = LAYERS[type].create()
    const arr = Array.isArray(created) ? created : [created]
    arr.forEach(l => { l.setZIndex(0); map.getLayers().insertAt(0, l) })
    baseLayers.current = arr
    setLayerType(type)
    setShowLayers(false)
  }, [])

  // ── 측정 오버레이 헬퍼 ─────────────────────────────────────────────────────
  const createSegOverlay = useCallback((map, text, coord, isFinal = false) => {
    const el = document.createElement('div')
    el.style.cssText = `
      background: ${isFinal ? 'rgba(15,23,42,0.95)' : 'rgba(15,23,42,0.75)'};
      color: ${isFinal ? '#38bdf8' : '#94e6ff'};
      border: 1px solid ${isFinal ? '#38bdf8' : 'rgba(56,189,248,0.4)'};
      border-radius: 4px;
      padding: ${isFinal ? '4px 10px' : '2px 7px'};
      font-size: ${isFinal ? '12px' : '10px'};
      font-weight: ${isFinal ? '700' : '400'};
      white-space: nowrap;
      pointer-events: none;
      font-family: monospace;
      transform: translate(-50%, -130%);
    `
    el.textContent = text
    const ov = new Overlay({ element: el, positioning: 'bottom-center', stopEvent: false })
    ov.setPosition(coord)
    map.addOverlay(ov)
    segOverlays.current.push(ov)
    return ov
  }, [])

  const clearSegOverlays = useCallback(() => {
    const map = mapObj.current
    if (!map) return
    segOverlays.current.forEach(ov => map.removeOverlay(ov))
    segOverlays.current = []
  }, [])

  const fmtDist  = (m)  => m >= 1000   ? `${(m/1000).toFixed(2)} km`       : `${Math.round(m)} m`
  const fmtArea  = (m2) => m2 >= 1000000 ? `${(m2/1000000).toFixed(2)} km²` : `${Math.round(m2).toLocaleString()} m²`

  // 두 선분이 꼭짓점(vertex)에서 이루는 각도 계산 (OL 투영 좌표 그대로 사용)
  const calcAngleBetween = (p1, vertex, p2) => {
    const v1 = [p1[0] - vertex[0], p1[1] - vertex[1]]
    const v2 = [p2[0] - vertex[0], p2[1] - vertex[1]]
    const dot  = v1[0] * v2[0] + v1[1] * v2[1]
    const mag1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2)
    const mag2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2)
    if (mag1 === 0 || mag2 === 0) return '0.0°'
    const cosA = Math.max(-1, Math.min(1, dot / (mag1 * mag2)))
    return `${(Math.acos(cosA) * 180 / Math.PI).toFixed(1)}°`
  }

  // ── 측정 모드 ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapObj.current
    if (!map) return
    if (drawRef.current) { map.removeInteraction(drawRef.current); drawRef.current = null }
    if (tooltipRef.current) tooltipRef.current.style.display = 'none'
    // 'none'/'marker' 전환 시 → 완료된 측정 결과 유지
    if (mode === 'none' || mode === 'marker') return
    // 새 측정 모드 전환 시에만 이전 결과 초기화
    clearSegOverlays()
    setResult(null)


    const type = (mode === 'distance' || mode === 'bearing') ? 'LineString' : 'Polygon'
    const draw = new Draw({ source: sourceRef.current, type, style: DRAW_STYLE })
    let listener
    let prevCoords = []   // 이전 클릭 좌표들 (구간 오버레이 생성용)

    draw.on('drawstart', (e) => {
      sourceRef.current.clear()
      clearSegOverlays()
      setResult(null)
      prevCoords = []

      listener = e.feature.getGeometry().on('change', (evt) => {
        const geom   = evt.target
        const coords = geom.getCoordinates()

        if (geom instanceof LineString) {
          // OpenLayers draw 중 coords 마지막은 항상 마우스 커서 위치(미확정)
          // 확정된 점 수 = coords.length - 1
          const fixedCount = coords.length - 1

          // 확정된 점이 늘었을 때 오버레이 추가
          if (fixedCount > prevCoords.length && fixedCount >= 2) {
            const fixedCoords = coords.slice(0, fixedCount)
            const segStart = fixedCoords[fixedCoords.length - 2]
            const segEnd   = fixedCoords[fixedCoords.length - 1]
            const midCoord = [
              (segStart[0] + segEnd[0]) / 2,
              (segStart[1] + segEnd[1]) / 2,
            ]
            if (mode === 'distance') {
              const segDist = getLength(new LineString([segStart, segEnd]))
              createSegOverlay(map, fmtDist(segDist), midCoord)
            } else if (mode === 'bearing' && fixedCount >= 3) {
              // 꼭짓점(직전 점)에서 두 선분 사이 각도 표시
              const p1     = fixedCoords[fixedCount - 3]
              const vertex = fixedCoords[fixedCount - 2]
              const p2     = fixedCoords[fixedCount - 1]
              createSegOverlay(map, calcAngleBetween(p1, vertex, p2), vertex)
            }
            prevCoords = fixedCoords
          }

          // 실시간 툴팁
          const lastCoord = coords[coords.length - 1]
          if (tooltipRef.current && overlayRef.current) {
            if (mode === 'distance') {
              const fixedLine = new LineString(coords.slice(0, fixedCount + 1))
              tooltipRef.current.textContent = `누적: ${fmtDist(getLength(fixedLine))}`
            } else if (mode === 'bearing') {
              // 고정점 2개 이상이면 커서 위치 기준 각도 미리보기
              if (fixedCount >= 2) {
                const fixedCoords = coords.slice(0, fixedCount)
                const p1     = fixedCoords[fixedCount - 2]
                const vertex = fixedCoords[fixedCount - 1]
                tooltipRef.current.textContent = `∠ ${calcAngleBetween(p1, vertex, lastCoord)}`
              } else {
                tooltipRef.current.style.display = 'none'
                return
              }
            }
            tooltipRef.current.style.display = 'block'
            overlayRef.current.setPosition(lastCoord)
          }

        } else if (geom instanceof Polygon) {
          const area   = getArea(geom)
          const center = geom.getInteriorPoint().getCoordinates()
          if (tooltipRef.current && overlayRef.current) {
            tooltipRef.current.textContent = fmtArea(area)
            tooltipRef.current.style.display = 'block'
            overlayRef.current.setPosition(center)
          }
        }
      })
    })

    draw.on('drawend', (e) => {
      unByKey(listener)
      const geom = e.feature.getGeometry()

      if (geom instanceof LineString) {
        const coords    = geom.getCoordinates()
        const lastCoord = coords[coords.length - 1]
        if (mode === 'distance') {
          const totalDist = getLength(geom)
          createSegOverlay(map, `✓ ${fmtDist(totalDist)}`, lastCoord, true)
          setResult(`거리: ${fmtDist(totalDist)}`)
        } else if (mode === 'bearing') {
          // 각도는 꼭짓점 오버레이로 표시됨 — drawend 시 마지막 꼭짓점 각도 최종 강조
          const allCoords = coords
          if (allCoords.length >= 3) {
            const p1     = allCoords[allCoords.length - 3]
            const vertex = allCoords[allCoords.length - 2]
            const p2     = allCoords[allCoords.length - 1]
            setResult(`꺾임 각도: ${calcAngleBetween(p1, vertex, p2)}`)
          } else {
            setResult(null)
          }
        }

      } else if (geom instanceof Polygon) {
        // 면적 — 폴리곤 중앙에 최종 면적 표시
        const area   = getArea(geom)
        const center = geom.getInteriorPoint().getCoordinates()
        createSegOverlay(map, fmtArea(area), center, true)
        setResult(`면적: ${fmtArea(area)}`)
      }

      if (tooltipRef.current) tooltipRef.current.style.display = 'none'
    })

    map.addInteraction(draw)
    drawRef.current = draw
  }, [mode, createSegOverlay, clearSegOverlays])

  // ── 마커 찍기 ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapObj.current
    if (!map) return
    const handler = (e) => {
      if (mode !== 'marker') return
      markerSrcRef.current.addFeature(new Feature({ geometry: new Point(e.coordinate) }))
    }
    map.on('click', handler)
    return () => map.un('click', handler)
  }, [mode])

  // ── ESC 키 → 기본 모드로 복귀 ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && mode !== 'none') {
        // 진행 중인 드로잉 취소
        if (drawRef.current) {
          drawRef.current.abortDrawing?.()
        }
        setMode('none') // 완료된 측정 결과는 유지 (초기화는 handleClear로만)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode])

  // ── 줌 ──────────────────────────────────────────────────────────────────────
  const zoomIn  = () => { const v = mapObj.current?.getView(); v?.animate({ zoom: v.getZoom() + 1, duration: 200 }) }
  const zoomOut = () => { const v = mapObj.current?.getView(); v?.animate({ zoom: v.getZoom() - 1, duration: 200 }) }

  // ── 전체화면 ─────────────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) mapRef.current?.requestFullscreen()
    else document.exitFullscreen()
  }

  // ── 캡처 ─────────────────────────────────────────────────────────────────────
  const captureMap = useCallback(() => {
    const map = mapObj.current
    if (!map) return
    map.once('rendercomplete', () => {
      try {
        const mapCanvas = document.createElement('canvas')
        const size = map.getSize()
        mapCanvas.width = size[0]; mapCanvas.height = size[1]
        const ctx = mapCanvas.getContext('2d')
        map.getViewport().querySelectorAll('.ol-layer canvas').forEach(canvas => {
          if (canvas.width === 0) return
          const opacity = canvas.parentElement.style.opacity || canvas.style.opacity
          ctx.globalAlpha = opacity === '' ? 1 : parseFloat(opacity)
          const transform = canvas.style.transform
          if (transform) {
            const matrix = transform.match(/^matrix\(([^)]*)\)$/)?.[1].split(',').map(Number)
            if (matrix) ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5])
            else ctx.setTransform(1, 0, 0, 1, 0, 0)
          }
          ctx.drawImage(canvas, 0, 0)
        })
        ctx.globalAlpha = 1; ctx.setTransform(1, 0, 0, 1, 0, 0)
        const now = new Date()
        const ts  = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`
        const link = document.createElement('a')
        link.href = mapCanvas.toDataURL('image/png')
        link.download = `지도_${ts}.png`
        document.body.appendChild(link); link.click(); link.remove()
      } catch {
        toast.warning('위성/하이브리드 레이어는 CORS 정책으로 캡처가 제한될 수 있어요.')
      }
    })
    map.renderSync()
  }, [])

  // ── 지도 flyTo 이동 ──────────────────────────────────────────────────────────
  const flyTo = useCallback((lon, lat, zoom = 14) => {
    const view = mapObj.current?.getView()
    if (!view) return
    view.animate({ center: fromLonLat([lon, lat]), zoom, duration: 800 })
  }, [])

  const handleHubChange = useCallback((hubId) => {
    setSelectedHub(hubId)
    setSelectedOffice('')
  }, [])

  const handleOfficeChange = useCallback((officeId) => {
    setSelectedOffice(officeId)
    const hub    = REGION_DATA.find(h => h.id === selectedHub)
    const office = hub?.offices.find(o => o.id === officeId)
    if (office) flyTo(office.lon, office.lat, office.zoom)
  }, [selectedHub, flyTo])

  // ── 초기화 ───────────────────────────────────────────────────────────────────
  const handleClear = () => {
    sourceRef.current.clear(); markerSrcRef.current.clear()
    clearSegOverlays()
    if (tooltipRef.current) tooltipRef.current.style.display = 'none'
    setResult(null); setMode('none')
  }


  return (
    <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden' }}>

      {/* 지도 */}
      <div ref={mapRef} style={{ width:'100%', height:'100%' }} />

      {/* ── 설비 팝업 오버레이 ── */}
      <div ref={popupRef}>
        {popup && (
          <div style={{
            background:   'var(--color-bg-secondary)',
            border:       '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow:    'var(--shadow-lg)',
            minWidth:     210,
            maxWidth:     280,
            overflow:     'hidden',
            transform:    'translateX(-50%)',
          }}>
            {/* 헤더 */}
            <div style={{
              padding: '9px 12px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--color-bg-tertiary)',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                {/* 등급 배지 */}
                {popup.props?.등급 && (() => {
                  const gc = GRADE_TEXT[popup.props.등급] ?? '#475569'
                  return (
                    <span style={{
                      fontSize:11, fontWeight:800, letterSpacing:'0.06em',
                      padding:'2px 8px', borderRadius:99,
                      background: hexToRgba(gc, 0.12),
                      color:      gc,
                      border:     `1px solid ${hexToRgba(gc, 0.4)}`,
                    }}>{popup.props.등급}</span>
                  )
                })()}
                {/* 타입 · ID */}
                <span style={{ fontSize:12, fontWeight:600, color:'var(--color-text-primary)' }}>
                  {popup.type} · {popup.id}
                </span>
              </div>
              <button
                onClick={() => { popupOverlayRef.current?.setPosition(undefined); setPopup(null) }}
                style={{ background:'none', border:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:16, lineHeight:1, padding:'0 2px', display:'flex', alignItems:'center' }}
              >✕</button>
            </div>
            {/* 제원 */}
            <div style={{ padding:'4px 0' }}>
              {Object.entries(popup.props).map(([key, val]) => (
                <div key={key} style={{ display:'grid', gridTemplateColumns:'76px 1fr', padding:'5px 12px', fontSize:12, transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <span style={{ color:'var(--color-text-muted)', fontWeight:500 }}>{key}</span>
                  <span style={{
                    color:      key === '상태' && val !== '정상' ? F_COLOR_WARN : 'var(--color-text-primary)',
                    fontWeight: key === '상태' ? 600 : 400,
                  }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>



      {/* ── 상단 좌측 — 위치 이동 패널 ── */}
      <div style={{
        position:'absolute', top:10, left:10, zIndex:10,
        ...CTRL_PANEL,
        flexDirection:'row',
        alignItems:'center',
        gap:6,
        padding:'6px 8px',
      }}>
        <select
          value={selectedHub}
          onChange={e => handleHubChange(e.target.value)}
          style={{
            height:28, padding:'0 6px', fontSize:12, cursor:'pointer', outline:'none',
            border:'1px solid var(--color-border)', borderRadius:'var(--radius-sm)',
            background:'var(--color-bg-primary)', color: selectedHub ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            minWidth:96,
          }}
        >
          <option value="">지역본부 선택</option>
          {REGION_DATA.map(h => (
            <option key={h.id} value={h.id}>{h.label}</option>
          ))}
        </select>

        <select
          value={selectedOffice}
          onChange={e => handleOfficeChange(e.target.value)}
          disabled={!selectedHub}
          style={{
            height:28, padding:'0 6px', fontSize:12, outline:'none',
            border:'1px solid var(--color-border)', borderRadius:'var(--radius-sm)',
            background:'var(--color-bg-primary)', color: selectedOffice ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            cursor: selectedHub ? 'pointer' : 'not-allowed',
            opacity: selectedHub ? 1 : 0.5,
            minWidth:96,
          }}
        >
          <option value="">사업소 선택</option>
          {(REGION_DATA.find(h => h.id === selectedHub)?.offices ?? []).map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ── 우상단 — 통합 패널 (유틸 + 줌) ── */}
      <div style={{
        position:'absolute', top:10, right:10, zIndex:10,
        ...CTRL_PANEL,
        padding:'5px 6px', gap:3,
      }}>
        {/* 레이어 전환 */}
        <div style={{ position:'relative' }}>
          <Tip text="레이어 전환" side="left">
            <button onClick={() => { setShowLayers(v => !v); setShowTools(false) }}
              style={CTRL_BTN(showLayers)}
              onMouseEnter={e => { if (!showLayers) e.currentTarget.style.background = 'var(--color-bg-tertiary)' }}
              onMouseLeave={e => { if (!showLayers) e.currentTarget.style.background = 'transparent' }}
            ><Layers size={14} /></button>
          </Tip>
          {showLayers && (
            <div style={{
              position:'absolute', top:0, right:40,
              background:'var(--color-bg-secondary)', border:'1px solid var(--color-border)',
              borderRadius:'var(--radius-md)', boxShadow:'var(--shadow-md)',
              padding:4, minWidth:100, display:'flex', flexDirection:'column', gap:2,
            }}>
              {Object.entries(LAYERS).map(([key, val]) => (
                <button key={key} onClick={() => handleLayerChange(key)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer',
                    fontSize:12, fontWeight: layerType===key ? 600 : 400,
                    background: layerType===key ? 'var(--color-accent)' : 'transparent',
                    color: layerType===key ? '#fff' : 'var(--color-text-primary)', transition:'all .1s',
                  }}
                  onMouseEnter={e => { if (layerType !== key) e.currentTarget.style.background = 'var(--color-bg-tertiary)' }}
                  onMouseLeave={e => { if (layerType !== key) e.currentTarget.style.background = 'transparent' }}
                >
                  {val.label}{layerType === key && <ChevronRight size={11} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 도구 */}
        <div style={{ position:'relative' }}>
          <Tip text="측정 도구" side="left">
            <button onClick={() => { setShowTools(v => !v); setShowLayers(false) }}
              style={CTRL_BTN(showTools || mode !== 'none')}
              onMouseEnter={e => { if (!showTools && mode === 'none') e.currentTarget.style.background = 'var(--color-bg-tertiary)' }}
              onMouseLeave={e => { if (!showTools && mode === 'none') e.currentTarget.style.background = 'transparent' }}
            ><PenTool size={14} /></button>
          </Tip>
          {showTools && (
            <div style={{
              position:'absolute', top:0, right:40,
              background:'var(--color-bg-secondary)', border:'1px solid var(--color-border)',
              borderRadius:'var(--radius-md)', boxShadow:'var(--shadow-md)',
              padding:4, minWidth:120, display:'flex', flexDirection:'column', gap:2,
            }}>
              {[
                { key:'none',     icon:MousePointer, label:'기본'      },
                { key:'distance', icon:Ruler,        label:'거리 측정' },
                { key:'bearing',  icon:AngleIcon,    label:'각도 측정' },
                { key:'area',     icon:Square,       label:'면적 측정' },
                { key:'marker',   icon:MapPin,       label:'마커 찍기' },
              ].map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => { setMode(key); setShowTools(false) }}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer',
                    fontSize:12, fontWeight: mode === key ? 600 : 400,
                    background: mode === key ? 'var(--color-accent)' : 'transparent',
                    color: mode === key ? '#fff' : 'var(--color-text-primary)', transition:'all .1s',
                  }}
                  onMouseEnter={e => { if (mode !== key) e.currentTarget.style.background = 'var(--color-bg-tertiary)' }}
                  onMouseLeave={e => { if (mode !== key) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={12} />{label}
                  {mode === key && <ChevronRight size={11} style={{ marginLeft:'auto' }} />}
                </button>
              ))}
              <div style={{ height:1, background:'var(--color-border)', margin:'2px 0' }} />
              <button onClick={() => { handleClear(); setShowTools(false) }}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer',
                  fontSize:12, background:'transparent', color:'var(--color-danger)', transition:'all .1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              ><Trash2 size={12} />초기화</button>
            </div>
          )}
        </div>

        <div style={DIVIDER} />

        {/* 캡처 */}
        <Tip text="지도 캡처 (PNG 저장)" side="left">
          <button onClick={captureMap} style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          ><Camera size={14} /></button>
        </Tip>

        {/* 전체화면 */}
        <Tip text="전체화면" side="left">
          <button onClick={toggleFullscreen} style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          ><Maximize2 size={14} /></button>
        </Tip>

        <div style={DIVIDER} />

        {/* 줌인 */}
        <Tip text="확대" side="left">
          <button onClick={zoomIn} style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          ><ZoomIn size={14} /></button>
        </Tip>

        {/* 줌 게이지 */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
          <div style={{ fontSize:8, padding:'2px 0', color:'var(--color-text-muted)' }}>MAX</div>
          <div style={{ position:'relative', height:80, width:20, padding:'4px 6px' }}>
            <div style={{
              width:'100%', height:'100%', borderRadius:4,
              background:'var(--color-bg-tertiary)', position:'relative', overflow:'hidden',
            }}>
              <div style={{
                position:'absolute', bottom:0, left:0, right:0, borderRadius:4,
                transition:'height .3s ease',
                height:`${((zoomLevel-6)/(19-6))*100}%`,
                background:'linear-gradient(to top, var(--color-accent), var(--color-purple))',
              }} />
            </div>
            {/* 눈금 */}
            {[20,15,10,5,3].map(lvl => (
              <div key={lvl} style={{
                position:'absolute', left:0, right:0, display:'flex', alignItems:'center',
                bottom:`${((lvl-3)/(20-3))*100}%`, transform:'translateY(50%)',
              }}>
                <div style={{
                  width:4, height:1, marginLeft:'auto', marginRight:2,
                  background: zoomLevel >= lvl ? 'var(--color-accent)' : 'var(--color-border)',
                }} />
              </div>
            ))}
            {/* 줌 레벨 숫자 — 게이지 채움 끝에 따라가기 */}
            <div style={{
              position:'absolute',
              bottom:`${Math.max(0, Math.min(100, ((zoomLevel-6)/(19-6))*100))}%`,
              left:0, right:0,
              display:'flex', justifyContent:'center',
              transform:'translateY(50%)',
              pointerEvents:'none',
              zIndex:1,
            }}>
              <span style={{
                fontSize:9, fontWeight:700,
                color:'var(--color-accent)',
                background:'var(--color-bg-secondary)',
                border:'1px solid var(--color-accent)',
                borderRadius:3,
                padding:'0 2px',
                lineHeight:'13px',
              }}>{zoomLevel}</span>
            </div>
          </div>
          <div style={{ fontSize:8, padding:'2px 0', color:'var(--color-text-muted)' }}>MIN</div>
        </div>

        {/* 줌아웃 */}
        <Tip text="축소" side="left">
          <button onClick={zoomOut} style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          ><ZoomOut size={14} /></button>
        </Tip>
      </div>

      {/* ── 좌하단 — 측정 결과 / 안내 ── */}
      {(result || (mode !== 'none' && mode !== 'marker')) && (
        <div style={{
          position:'absolute', bottom:36, left:12, zIndex:10,
          background:'var(--color-bg-secondary)',
          border:'1px solid var(--color-accent)',
          borderRadius:'var(--radius-md)',
          padding:'5px 12px', fontSize:12,
          color:'var(--color-accent)', fontWeight:600,
          boxShadow:'var(--shadow-sm)',
        }}>
          {result
            ? `📐 ${result}`
            : mode === 'bearing'
              ? '시작점 → 꼭짓점 → 끝점 순서로 클릭 (더블클릭 완료)'
              : `클릭해서 ${mode === 'distance' ? '거리' : '면적'} 측정 (더블클릭 완료)`
          }
        </div>
      )}

      {/* ── 하단 — 좌표 + 레이어 배지 ── */}
      <div style={{
        position:'absolute', bottom:10, left:12, right:12, zIndex:10,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        pointerEvents:'none',
      }}>
        {coordInfo ? (
          <div style={{
            padding:'3px 10px', borderRadius:'var(--radius-sm)', fontSize:10,
            fontFamily:'monospace', background:'var(--color-bg-secondary)',
            border:'1px solid var(--color-border)', color:'var(--color-text-secondary)',
            boxShadow:'var(--shadow-sm)',
          }}>
            {coordInfo.lat}, {coordInfo.lon}
          </div>
        ) : <div />}

        <div style={{
          padding:'3px 10px', borderRadius:'var(--radius-sm)', fontSize:10,
          background:'var(--color-bg-secondary)',
          border:'1px solid var(--color-border)', color:'var(--color-text-muted)',
          boxShadow:'var(--shadow-sm)',
        }}>
          {LAYERS[layerType].label}
        </div>
      </div>

    </div>
  )
}
