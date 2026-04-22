import React, { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { fromLonLat } from 'ol/proj'
import { Style, Icon as OlIcon } from 'ol/style'
import 'ol/ol.css'

const VWORLD_KEY = '8105102E-2501-375F-87BF-64F42A2720FA'

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
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    scale: 1,
  }),
})

/**
 * 단일 전주 위치를 지도에 표시하는 경량 OpenLayers 컴포넌트.
 *
 * @author JDJ
 * @since 2026-04-20
 * @param {Object} props
 * @param {number} props.lon       경도 (WGS84)
 * @param {number} props.lat       위도 (WGS84)
 * @param {number} [props.zoom=17] 초기 줌 레벨
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-20 | JDJ    | 최초 작성 (WlcResDtlGisFeature 패턴 참고) |
 */
export default function PoleMapView({ lon, lat, zoom = 17 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || lon == null || lat == null) return

    const coord = fromLonLat([lon, lat])
    const marker = new Feature({ geometry: new Point(coord) })
    marker.setStyle(MARKER_STYLE)

    const map = new Map({
      target: containerRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/{z}/{y}/{x}.png`,
            crossOrigin: 'anonymous',
            attributions: '© 브이월드',
            maxZoom: 19,
          }),
        }),
        new VectorLayer({
          source: new VectorSource({ features: [marker] }),
        }),
      ],
      view: new View({ center: coord, zoom }),
      controls: [],
    })

    return () => { map.setTarget(null) }
  }, [lon, lat, zoom])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
