import React, { useEffect, useRef, useState, useCallback } from 'react'
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
import { Stroke, Fill, Style, Circle as CircleStyle, Icon as OlIcon } from 'ol/style'
import Feature from 'ol/Feature'
import 'ol/ol.css'

import {
  Ruler, Square, Trash2, MousePointer,
  ZoomIn, ZoomOut, Maximize2,
  MapPin, Camera, Layers, ChevronRight,
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
    top: '50%',
    transform: 'translateY(-50%)',
    ...(side === 'right' ? { left: 'calc(100% + 8px)' } : { right: 'calc(100% + 8px)' }),
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

export default function GisFeature() {
  const mapRef       = useRef(null)
  const mapObj       = useRef(null)
  const drawRef      = useRef(null)
  const sourceRef    = useRef(new VectorSource())
  const markerSrcRef = useRef(new VectorSource())
  const tooltipRef   = useRef(null)   // 마우스 따라다니는 실시간 툴팁
  const overlayRef   = useRef(null)   // 실시간 툴팁 overlay
  const segOverlays  = useRef([])     // 구간 거리 overlay 목록
  const baseLayers   = useRef([])

  const [mode,       setMode]       = useState('none')
  const [result,     setResult]     = useState(null)
  const [zoomLevel,  setZoomLevel]  = useState(12)
  const [layerType,  setLayerType]  = useState('Base')
  const [coordInfo,  setCoordInfo]  = useState(null)
  const [showLayers, setShowLayers] = useState(false)

  // ── 지도 초기화 ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const drawLayer   = new VectorLayer({ source: sourceRef.current,   style: DRAW_STYLE,   zIndex: 10 })
    const markerLayer = new VectorLayer({ source: markerSrcRef.current, style: MARKER_STYLE, zIndex: 11 })
    const baseLayer   = LAYERS.Base.create()
    baseLayers.current = [baseLayer]

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, drawLayer, markerLayer],
      view: new View({ center: fromLonLat([127.024612, 37.532600]), zoom: 12, minZoom: 3, maxZoom: 20 }),
      controls: [],
    })

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

  // 두 좌표(OL 투영) 사이 방위각(°) 계산
  const calcBearing = (c1, c2) => {
    const [lon1, lat1] = toLonLat(c1)
    const [lon2, lat2] = toLonLat(c2)
    const toRad = d => d * Math.PI / 180
    const dLon  = toRad(lon2 - lon1)
    const y = Math.sin(dLon) * Math.cos(toRad(lat2))
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2))
            - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon)
    const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
    return `${brng.toFixed(1)}°`
  }

  // ── 측정 모드 ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapObj.current
    if (!map) return
    if (drawRef.current) { map.removeInteraction(drawRef.current); drawRef.current = null }
    clearSegOverlays()
    setResult(null)
    if (tooltipRef.current) tooltipRef.current.style.display = 'none'
    if (mode === 'none' || mode === 'marker') return


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

          // 확정된 점이 늘었을 때만 구간 오버레이 추가
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
            } else if (mode === 'bearing') {
              createSegOverlay(map, calcBearing(segStart, segEnd), midCoord)
            }
            prevCoords = fixedCoords
          }

          // 실시간 툴팁
          const lastCoord = coords[coords.length - 1]
          if (tooltipRef.current && overlayRef.current) {
            if (mode === 'distance') {
              // 확정 구간만의 누적 거리
              const fixedLine = new LineString(coords.slice(0, fixedCount + 1))
              tooltipRef.current.textContent = `누적: ${fmtDist(getLength(fixedLine))}`
            } else if (mode === 'bearing') {
              // 방위각은 구간 오버레이로만 표시 — 실시간 툴팁 불필요
              tooltipRef.current.style.display = 'none'
              return
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
          // 구간별 방위각은 이미 change 이벤트에서 표시됨 — 최종값 불필요
          setResult(null)
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
        setMode('none')
        setResult(null)
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
        alert('일부 레이어가 CORS 정책으로 인해 캡처되지 않을 수 있습니다.\n위성/하이브리드 레이어는 캡처가 제한될 수 있어요.')
      }
    })
    map.renderSync()
  }, [])

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



      {/* ── 좌상단 — 도구 패널 ── */}
      <div style={{ position:'absolute', top:12, left:12, zIndex:10, ...CTRL_PANEL }}>
        {[
          { key:'none',     icon:MousePointer, title:'기본'      },
          { key:'distance', icon:Ruler,        title:'거리 측정' },
          { key:'bearing',  icon:AngleIcon,    title:'각도 측정' },
          { key:'area',     icon:Square,       title:'면적 측정' },
          { key:'marker',   icon:MapPin,       title:'마커 찍기' },
        ].map(({ key, icon: Icon, title }) => (
          <Tip key={key} text={title} side="right">
            <button onClick={() => setMode(key)}
              style={CTRL_BTN(mode === key)}
              onMouseEnter={e => { if (mode !== key) e.currentTarget.style.background = 'var(--color-bg-tertiary)' }}
              onMouseLeave={e => { if (mode !== key) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={14} />
            </button>
          </Tip>
        ))}
        <div style={DIVIDER} />
        <Tip text="초기화 (측정/마커 전체 삭제)" side="right">
          <button onClick={handleClear}
            style={CTRL_BTN(false, true)}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={14} />
          </button>
        </Tip>
      </div>

      {/* ── 우상단 — 유틸 패널 (줌컨트롤과 같은 right:12 정렬) ── */}
      <div style={{ position:'absolute', top:12, right:12, zIndex:10, ...CTRL_PANEL }}>

        {/* 레이어 전환 */}
        <div style={{ position:'relative' }}>
          <Tip text="레이어 전환" side="left">
          <button onClick={() => setShowLayers(v => !v)}
            style={CTRL_BTN(showLayers)}
            onMouseEnter={e => { if (!showLayers) e.currentTarget.style.background = 'var(--color-bg-tertiary)' }}
            onMouseLeave={e => { if (!showLayers) e.currentTarget.style.background = 'transparent' }}
          >
            <Layers size={14} />
          </button>
          </Tip>

          {/* 레이어 드롭다운 */}
          {showLayers && (
            <div style={{
              position:'absolute', top:0, right:40,
              background:'var(--color-bg-secondary)',
              border:'1px solid var(--color-border)',
              borderRadius:'var(--radius-md)',
              boxShadow:'var(--shadow-md)',
              padding:4, minWidth:100,
              display:'flex', flexDirection:'column', gap:2,
            }}>
              {Object.entries(LAYERS).map(([key, val]) => (
                <button key={key} onClick={() => handleLayerChange(key)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer',
                    fontSize:12, fontWeight: layerType===key ? 600 : 400,
                    background: layerType===key ? 'var(--color-accent)' : 'transparent',
                    color: layerType===key ? '#fff' : 'var(--color-text-primary)',
                    transition:'all .1s',
                  }}
                  onMouseEnter={e => { if (layerType !== key) e.currentTarget.style.background = 'var(--color-bg-tertiary)' }}
                  onMouseLeave={e => { if (layerType !== key) e.currentTarget.style.background = 'transparent' }}
                >
                  {val.label}
                  {layerType === key && <ChevronRight size={11} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={DIVIDER} />

        <Tip text="지도 캡처 (PNG 저장)" side="left">
          <button onClick={captureMap}
            style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Camera size={14} />
          </button>
        </Tip>
        <Tip text="전체화면" side="left">
          <button onClick={toggleFullscreen}
            style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Maximize2 size={14} />
          </button>
        </Tip>
      </div>

      {/* ── 우측 중앙 — 줌 컨트롤 ── */}
      <div style={{
        position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
        zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
      }}>
        {/* 줌인 */}
        <Tip text="확대" side="left">
          <button onClick={zoomIn}
            style={{ ...CTRL_BTN(), ...CTRL_PANEL, width:32, height:32, padding:0 }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
          ><ZoomIn size={14} /></button>
        </Tip>

        {/* 줌 게이지 */}
        <div style={{
          ...CTRL_PANEL, padding:0, width:32, overflow:'hidden', gap:0,
          alignItems:'center',
        }}>
          {/* 줌 레벨 숫자 */}
          <div style={{
            fontSize:10, fontWeight:700, padding:'4px 0', width:'100%', textAlign:'center',
            color:'var(--color-accent)', borderBottom:'1px solid var(--color-border)',
          }}>{zoomLevel}</div>

          {/* 게이지 바 */}
          <div style={{ position:'relative', height:100, width:32, padding:'5px 8px' }}>
            <div style={{
              width:'100%', height:'100%', borderRadius:4,
              background:'var(--color-bg-tertiary)', position:'relative', overflow:'hidden',
            }}>
              <div style={{
                position:'absolute', bottom:0, left:0, right:0, borderRadius:4,
                transition:'height .3s ease',
                height:`${((zoomLevel-3)/(20-3))*100}%`,
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
                  width:5, height:1, marginLeft:'auto', marginRight:3,
                  background: zoomLevel >= lvl ? 'var(--color-accent)' : 'var(--color-border)',
                }} />
              </div>
            ))}
          </div>
          <div style={{ fontSize:8, padding:'2px 0 4px', color:'var(--color-text-muted)' }}>MIN</div>
        </div>

        {/* 줌아웃 */}
        <Tip text="축소" side="left">
          <button onClick={zoomOut}
            style={{ ...CTRL_BTN(), ...CTRL_PANEL, width:32, height:32, padding:0 }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
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
            : `클릭해서 ${mode === 'distance' ? '거리' : mode === 'bearing' ? '각도' : '면적'} 측정 (더블클릭 완료)`
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
