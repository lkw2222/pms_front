/**
 * SCC 평가 결과 드로어 — 지도 탭.
 * row 변경 시 해당 전주 위치로 flyTo + 마커 갱신.
 *
 * 구조:
 *   SccResDtlGisFeature  — 지도 초기화 / 팝업 / 전주 마커
 *     └─ GisMapControls  — 우측 패널 · 측정 안내 · 좌표 바 (공통)
 *        useGisMeasure   — 측정 인터랙션 훅 (공통)
 *
 * @author JDJ
 * @since 2026-04-22
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Map     from 'ol/Map'
import View    from 'ol/View'
import VectorLayer  from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { fromLonLat, toLonLat } from 'ol/proj'
import Overlay from 'ol/Overlay'
import { LineString, Polygon, Point } from 'ol/geom'
import Feature from 'ol/Feature'
import Select  from 'ol/interaction/Select'
import { click } from 'ol/events/condition'
import 'ol/ol.css'

import { FACILITY_STYLE, GRADE_TEXT } from '@/utils/gis/gisStyle.js'
import { TILE_LAYERS }               from '@/utils/gis/tileLayer.js'
import { useGisMeasure }             from '@/utils/gis/useGisMeasure.js'
import GisMapControls                from '@/components/map/GisMapControls.jsx'
import GisPopupOverlay               from '@/components/map/GisPopupOverlay.jsx'

// ── 등급 → 팝업 variant 매핑 ────────────────────────────────────────────────────
const GRADE_POPUP_VARIANT = { S: 'danger', A: 'warning', B: 'info', C: 'success', D: 'default' }

// ── 설비 샘플 데이터 (GeoServer 연동 시 WMS/WFS 레이어로 교체) ───────────────
// OL Feature 생성자에 전달한 key/value 는 setProperties() 로 자동 등록됨
// → f.get('type'), f.get('id'), f.get('props') 로 바로 접근 가능
const FACILITY_FEATURES = [
  new Feature({ geometry: new Point(fromLonLat([127.0246, 37.5326])),  type:'전주',   id:'P-001', props:{ 전산화번호:'1234A001', 전주종류:'CP700kgf', 전주형태:'단주', 전주규격:'16M', 등급:'A', 종합점수:'82.00', 진단결과:'A 고위험'   } }),
  new Feature({ geometry: new Point(fromLonLat([127.0268, 37.5312])),  type:'변압기', id:'T-001', props:{ 관리번호:'T-001', 용량:'100kVA',      전압:'22.9kV/380V',  설치일:'2020-07-22', 관리기관:'한전 서울본부', 등급:'C', 상태:'정상'    } }),
  new Feature({ geometry: new Point(fromLonLat([127.0225, 37.5338])),  type:'전주',   id:'P-002', props:{ 전산화번호:'1234A002', 전주종류:'CP300kgf', 전주형태:'B형주', 전주규격:'14M', 등급:'S', 종합점수:'93.00', 진단결과:'S 즉시위험' } }),
  new Feature({ geometry: new LineString([fromLonLat([127.0246,37.5326]),fromLonLat([127.0255,37.5320]),fromLonLat([127.0268,37.5312])]), type:'전선', id:'L-001', props:{ 관리번호:'L-001', 전압등급:'22.9kV', 전선종류:'ACSR 95mm²', 길이:'320m', 설치일:'2018-03-15', 등급:'B', 상태:'정상' } }),
  new Feature({ geometry: new LineString([fromLonLat([127.0225,37.5338]),fromLonLat([127.0235,37.5330]),fromLonLat([127.0246,37.5326])]), type:'전선', id:'L-002', props:{ 관리번호:'L-002', 전압등급:'22.9kV', 전선종류:'ACSR 95mm²', 길이:'280m', 설치일:'2019-11-05', 등급:'D', 상태:'정상' } }),
  new Feature({ geometry: new Polygon([[fromLonLat([127.0260,37.5335]),fromLonLat([127.0275,37.5335]),fromLonLat([127.0275,37.5325]),fromLonLat([127.0260,37.5325]),fromLonLat([127.0260,37.5335])]]), type:'변전소', id:'S-001', props:{ 관리번호:'S-001', 명칭:'강남 변전소', 전압등급:'154kV/22.9kV', 면적:'2,400m²', 준공일:'2010-06-01', 관리기관:'한전 서울본부', 등급:'B', 상태:'정상' } }),
]

export default function SccResDtlGisFeature({ row }) {
  const mapRef     = useRef(null)
  const baseLayers = useRef([])

  const facilitySourceRef = useRef(new VectorSource({ features: FACILITY_FEATURES }))
  const poleSourceRef     = useRef(new VectorSource())
  const popupRef          = useRef(null)
  const popupOverlayRef   = useRef(null)

  // mapInstance: OL Map 인스턴스 (null → init 후 set) — useGisMeasure 트리거 키
  const [mapInstance, setMapInstance] = useState(null)
  const [zoomLevel,   setZoomLevel]   = useState(12)
  const [layerType,   setLayerType]   = useState('Base')
  const [coordInfo,   setCoordInfo]   = useState(null)
  const [popup,       setPopup]       = useState(null)  // { type, id, props }

  // 측정 훅 — mapInstance 가 준비되면 자동으로 effect 실행
  const { mode, setMode, result, handleClear, drawLayer, markerLayer } = useGisMeasure(mapInstance)

  // ── 지도 초기화 ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const facilityLayer = new VectorLayer({ source: facilitySourceRef.current, style: (f) => FACILITY_STYLE(f, false), zIndex: 5 })
    const poleLayer     = new VectorLayer({ source: poleSourceRef.current,     style: (f) => FACILITY_STYLE(f, false), zIndex: 12 })
    const baseLayer     = TILE_LAYERS.Base.create()
    baseLayers.current  = [baseLayer]

    const map = new Map({
      target:   mapRef.current,
      layers:   [baseLayer, facilityLayer, poleLayer, drawLayer, markerLayer],
      view:     new View({ center: fromLonLat([127.024612, 37.532600]), zoom: 15, minZoom: 6, maxZoom: 19 }),
      controls: [],
    })

    // 팝업 오버레이
    const popupOverlay = new Overlay({
      element:     popupRef.current,
      positioning: 'bottom-center',
      offset:      [0, -14],
      stopEvent:   false,
      autoPan:     { animation: { duration: 300 } },  // 뷰포트 밖 팝업 자동 패닝
    })
    map.addOverlay(popupOverlay)
    popupOverlayRef.current = popupOverlay

    // 설비 클릭 Select — facilityLayer + poleLayer 공통
    const select = new Select({
      condition: click,
      layers:    [facilityLayer, poleLayer],
      style:     (f) => FACILITY_STYLE(f, true),
    })
    select.on('select', (e) => {
      if (e.selected.length > 0) {
        const f        = e.selected[0]
        const geomType = f.getGeometry().getType()
        const coord    =
          geomType === 'Point'      ? f.getGeometry().getCoordinates() :
          geomType === 'LineString' ? f.getGeometry().getCoordinateAt(0.5) :
          f.getGeometry().getInteriorPoint().getCoordinates()
        // coord 를 popup state 에 함께 저장 — setPosition 은 useEffect 에서 호출
        // (React 렌더 완료 후 팝업 실제 크기 기준으로 autoPan 계산되도록)
        setPopup({ type: f.get('type'), id: f.get('id'), props: f.get('props'), coord })
      } else {
        popupOverlay.setPosition(undefined)
        setPopup(null)
      }
    })
    map.addInteraction(select)

    map.getView().on('change:resolution', () => setZoomLevel(Math.round(map.getView().getZoom())))
    map.on('pointermove', (e) => {
      const [lon, lat] = toLonLat(e.coordinate)
      setCoordInfo({ lon: lon.toFixed(6), lat: lat.toFixed(6) })
    })

    setMapInstance(map)   // useGisMeasure effect 트리거
    return () => { map.setTarget(null); setMapInstance(null) }
  }, [drawLayer, markerLayer])  // drawLayer/markerLayer 는 안정 ref → 1회만 실행

  // ── 부드러운 flyTo (줌 아웃 → 이동 → 줌 인) ──────────────────────────────
  // setPosition 은 GisPopupOverlay 내부 useEffect 에서 처리
  const flyTo = useCallback((lon, lat, zoom = 15) => {
    const view = mapInstance?.getView()
    if (!view) return
    const currentZoom = view.getZoom() ?? zoom
    const midZoom     = Math.min(currentZoom, zoom, 9)
    view.animate(
      { zoom: midZoom,                        duration: 350 },
      { center: fromLonLat([lon, lat]),        duration: 500 },
      { zoom,                                  duration: 350 },
    )
  }, [mapInstance])

  // ── row 변경 시 전주 마커 갱신 + 지도 이동 ────────────────────────────────
  useEffect(() => {
    if (!row?.lon || !row?.lat) return
    poleSourceRef.current.clear()
    const f = new Feature({ geometry: new Point(fromLonLat([row.lon, row.lat])) })
    f.set('type',  '전주')
    f.set('id',    row.calcNo ?? row.gid)
    f.set('props', {
      전산화번호: row.calcNo,
      설비GID:   row.gid,
      전주종류:   row.poleType,
      전주형태:   row.poleShape,
      전주규격:   row.poleSize,
      등급:       row.gradeCode,   // badge 용 (items 에서 필터링)
      종합점수:   row.totalScore != null ? row.totalScore.toFixed(2) : '-',
      진단결과:   row.gradeCode && row.gradeDesc ? `${row.gradeCode} ${row.gradeDesc}` : '-',
    })
    poleSourceRef.current.addFeature(f)
    flyTo(row.lon, row.lat, 17)
  }, [row?.lon, row?.lat, flyTo])

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden' }}>

      {/* 지도 캔버스 */}
      <div ref={mapRef} style={{ width:'100%', height:'100%' }} />

      {/* ── 설비 팝업 오버레이 ── */}
      <GisPopupOverlay
        ref={popupRef}
        overlayRef={popupOverlayRef}
        coord={popup?.coord}
        title={popup ? `${popup.type} · ${popup.id}` : null}
        badge={popup?.props?.등급
          ? { text: popup.props.등급, color: GRADE_TEXT[popup.props.등급] ?? '#475569' }
          : null
        }
        items={popup
          ? Object.entries(popup.props)
              .filter(([label]) => label !== '등급')   // badge 전용 필드 — 목록에서 제외
              .map(([label, value]) => ({
                label,
                value,
                variant:
                  label === '진단결과' ? (GRADE_POPUP_VARIANT[value?.charAt(0)] ?? 'default') :
                  label === '상태' && value !== '정상' ? 'warn' :
                  'default',
              }))
          : []
        }
        onClose={() => { popupOverlayRef.current?.setPosition(undefined); setPopup(null) }}
      />

      {/* ── 공통 컨트롤 패널 (우측 + 측정 안내 + 좌표 바) ── */}
      <GisMapControls
        mapInstance={mapInstance}
        baseLayers={baseLayers}
        zoomLevel={zoomLevel}
        layerType={layerType}
        setLayerType={setLayerType}
        coordInfo={coordInfo}
        mode={mode}
        setMode={setMode}
        result={result}
        handleClear={handleClear}
      />

    </div>
  )
}
