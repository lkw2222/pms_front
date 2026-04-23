/**
 * GIS 측정 도구 커스텀 훅.
 * 거리 / 각도 / 면적 측정 + 마커 찍기 + ESC 취소.
 *
 * 사용법:
 *   const { mode, setMode, result, handleClear, drawLayer, markerLayer }
 *     = useGisMeasure(mapInstance)
 *
 *   // mapInstance: OL Map 인스턴스 (null 허용 — map 초기화 전까지 null)
 *   // drawLayer / markerLayer: 지도 초기화 시 map.addLayer() 해줄 것
 *
 * 설계 포인트:
 *   mapInstance 를 ref 가 아닌 state 로 받는다.
 *   → map 이 준비된 시점에 effect 가 자동 재실행되므로
 *     "훅 effect 가 map init 보다 먼저 실행되는 순서 문제" 없음.
 *
 * @author JDJ
 * @since 2026-04-22
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import VectorLayer  from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Draw         from 'ol/interaction/Draw'
import Overlay      from 'ol/Overlay'
import { getLength, getArea } from 'ol/sphere'
import { unByKey }  from 'ol/Observable'
import { LineString, Polygon, Point } from 'ol/geom'
import Feature      from 'ol/Feature'
import { DRAW_STYLE, MARKER_STYLE } from './gisStyle.js'

// ── 포맷 헬퍼 ─────────────────────────────────────────────────────────────────
const fmtDist = (m)  => m  >= 1000    ? `${(m/1000).toFixed(2)} km`         : `${Math.round(m)} m`
const fmtArea = (m2) => m2 >= 1000000 ? `${(m2/1000000).toFixed(2)} km²`    : `${Math.round(m2).toLocaleString()} m²`

const calcAngle = (p1, vertex, p2) => {
  const v1 = [p1[0]-vertex[0], p1[1]-vertex[1]]
  const v2 = [p2[0]-vertex[0], p2[1]-vertex[1]]
  const dot  = v1[0]*v2[0] + v1[1]*v2[1]
  const mag1 = Math.sqrt(v1[0]**2 + v1[1]**2)
  const mag2 = Math.sqrt(v2[0]**2 + v2[1]**2)
  if (mag1 === 0 || mag2 === 0) return '0.0°'
  return `${(Math.acos(Math.max(-1, Math.min(1, dot/(mag1*mag2)))) * 180 / Math.PI).toFixed(1)}°`
}

// ── 훅 ────────────────────────────────────────────────────────────────────────
export function useGisMeasure(mapInstance) {
  const sourceRef    = useRef(new VectorSource())
  const markerSrcRef = useRef(new VectorSource())
  const drawRef      = useRef(null)
  const tooltipRef   = useRef(null)
  const overlayRef   = useRef(null)
  const segOverlays  = useRef([])

  const [mode,   setMode]   = useState('none')
  const [result, setResult] = useState(null)

  // 레이어 — 컴포넌트 마운트 시 1회 생성 (안정된 참조)
  const drawLayerRef   = useRef(null)
  const markerLayerRef = useRef(null)
  if (!drawLayerRef.current)
    drawLayerRef.current   = new VectorLayer({ source: sourceRef.current,   style: DRAW_STYLE,   zIndex: 10 })
  if (!markerLayerRef.current)
    markerLayerRef.current = new VectorLayer({ source: markerSrcRef.current, style: MARKER_STYLE, zIndex: 11 })

  // ── 구간 오버레이 헬퍼 ─────────────────────────────────────────────────────
  const clearSegOverlays = useCallback(() => {
    if (!mapInstance) return
    segOverlays.current.forEach(ov => mapInstance.removeOverlay(ov))
    segOverlays.current = []
  }, [mapInstance])

  const createSegOverlay = useCallback((text, coord, isFinal = false) => {
    if (!mapInstance) return
    const el = document.createElement('div')
    el.style.cssText = [
      `background:${isFinal ? 'rgba(15,23,42,0.95)' : 'rgba(15,23,42,0.75)'}`,
      `color:${isFinal ? '#38bdf8' : '#94e6ff'}`,
      `border:1px solid ${isFinal ? '#38bdf8' : 'rgba(56,189,248,0.4)'}`,
      `border-radius:4px`,
      `padding:${isFinal ? '4px 10px' : '2px 7px'}`,
      `font-size:${isFinal ? '12px' : '10px'}`,
      `font-weight:${isFinal ? '700' : '400'}`,
      'white-space:nowrap',
      'pointer-events:none',
      'font-family:monospace',
      'transform:translate(-50%,-130%)',
    ].join(';')
    el.textContent = text
    const ov = new Overlay({ element: el, positioning: 'bottom-center', stopEvent: false })
    ov.setPosition(coord)
    mapInstance.addOverlay(ov)
    segOverlays.current.push(ov)
  }, [mapInstance])

  // ── 툴팁 오버레이 초기화 (mapInstance 준비 시 자동 실행) ──────────────────
  useEffect(() => {
    if (!mapInstance) return
    const tooltipEl = document.createElement('div')
    tooltipEl.style.cssText = [
      'background:rgba(15,23,42,0.92)',
      'color:#38bdf8',
      'border:1px solid #38bdf8',
      'border-radius:6px',
      'padding:4px 10px',
      'font-size:11px',
      'white-space:nowrap',
      'pointer-events:none',
      'font-family:monospace',
      'display:none',
    ].join(';')
    tooltipRef.current = tooltipEl
    const overlay = new Overlay({ element: tooltipEl, offset: [12, -12], positioning: 'bottom-left' })
    mapInstance.addOverlay(overlay)
    overlayRef.current = overlay
    return () => { mapInstance.removeOverlay(overlay); overlayRef.current = null }
  }, [mapInstance])

  // ── 드로우 모드 전환 ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstance) return
    if (drawRef.current) { mapInstance.removeInteraction(drawRef.current); drawRef.current = null }
    if (tooltipRef.current) tooltipRef.current.style.display = 'none'
    if (mode === 'none' || mode === 'marker') return
    clearSegOverlays()
    setResult(null)

    const type = (mode === 'distance' || mode === 'bearing') ? 'LineString' : 'Polygon'
    const draw = new Draw({ source: sourceRef.current, type, style: DRAW_STYLE })
    let listener, prevCoords = []

    draw.on('drawstart', (e) => {
      sourceRef.current.clear()
      clearSegOverlays()
      setResult(null)
      prevCoords = []

      listener = e.feature.getGeometry().on('change', (evt) => {
        const geom   = evt.target
        const coords = geom.getCoordinates()

        if (geom instanceof LineString) {
          const fixedCount = coords.length - 1
          if (fixedCount > prevCoords.length && fixedCount >= 2) {
            const fc  = coords.slice(0, fixedCount)
            const mid = [(fc[fc.length-2][0]+fc[fc.length-1][0])/2,
                         (fc[fc.length-2][1]+fc[fc.length-1][1])/2]
            if (mode === 'distance') {
              createSegOverlay(fmtDist(getLength(new LineString([fc[fc.length-2], fc[fc.length-1]]))), mid)
            } else if (mode === 'bearing' && fixedCount >= 3) {
              createSegOverlay(calcAngle(fc[fixedCount-3], fc[fixedCount-2], fc[fixedCount-1]), fc[fixedCount-2])
            }
            prevCoords = fc
          }
          const last = coords[coords.length-1]
          if (tooltipRef.current && overlayRef.current) {
            if (mode === 'distance') {
              tooltipRef.current.textContent = `누적: ${fmtDist(getLength(new LineString(coords.slice(0, fixedCount+1))))}`
            } else if (mode === 'bearing') {
              if (fixedCount >= 2) {
                const fc = coords.slice(0, fixedCount)
                tooltipRef.current.textContent = `∠ ${calcAngle(fc[fixedCount-2], fc[fixedCount-1], last)}`
              } else { tooltipRef.current.style.display = 'none'; return }
            }
            tooltipRef.current.style.display = 'block'
            overlayRef.current.setPosition(last)
          }
        } else if (geom instanceof Polygon) {
          const center = geom.getInteriorPoint().getCoordinates()
          if (tooltipRef.current && overlayRef.current) {
            tooltipRef.current.textContent = fmtArea(getArea(geom))
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
        const coords = geom.getCoordinates()
        if (mode === 'distance') {
          const d = getLength(geom)
          createSegOverlay(`✓ ${fmtDist(d)}`, coords[coords.length-1], true)
          setResult(`거리: ${fmtDist(d)}`)
        } else if (mode === 'bearing') {
          if (coords.length >= 3) {
            setResult(`꺾임 각도: ${calcAngle(coords[coords.length-3], coords[coords.length-2], coords[coords.length-1])}`)
          } else setResult(null)
        }
      } else if (geom instanceof Polygon) {
        const center = geom.getInteriorPoint().getCoordinates()
        createSegOverlay(fmtArea(getArea(geom)), center, true)
        setResult(`면적: ${fmtArea(getArea(geom))}`)
      }
      if (tooltipRef.current) tooltipRef.current.style.display = 'none'
    })

    mapInstance.addInteraction(draw)
    drawRef.current = draw
    return () => { mapInstance.removeInteraction(draw); drawRef.current = null }
  }, [mapInstance, mode, createSegOverlay, clearSegOverlays])

  // ── 마커 클릭 ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstance) return
    const handler = (e) => {
      if (mode !== 'marker') return
      markerSrcRef.current.addFeature(new Feature({ geometry: new Point(e.coordinate) }))
    }
    mapInstance.on('click', handler)
    return () => mapInstance.un('click', handler)
  }, [mapInstance, mode])

  // ── ESC → 기본 모드 복귀 ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && mode !== 'none') {
        drawRef.current?.abortDrawing?.()
        setMode('none')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode])

  // ── 전체 초기화 ─────────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    sourceRef.current.clear()
    markerSrcRef.current.clear()
    clearSegOverlays()
    if (tooltipRef.current) tooltipRef.current.style.display = 'none'
    setResult(null)
    setMode('none')
  }, [clearSegOverlays])

  return {
    mode, setMode,
    result,
    handleClear,
    drawLayer:   drawLayerRef.current,
    markerLayer: markerLayerRef.current,
  }
}
