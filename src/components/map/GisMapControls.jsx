/**
 * GIS 공통 컨트롤 패널.
 * 모든 지도 화면에서 재사용 가능한 우측 패널 + 측정 안내 + 좌표 바를 Fragment 로 반환.
 *
 * ┌─ 렌더 구조 ──────────────────────────────────────────────────────────────┐
 * │  (1) 우상단 컨트롤 패널 — 레이어 전환 / 측정 도구 / 캡처 / 전체화면 / 줌 │
 * │  (2) 좌하단 측정 안내  — 진행 중 힌트 + 완료 결과                        │
 * │  (3) 하단 좌표 바      — 마우스 좌표 + 현재 레이어 배지                   │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Props:
 *   mapInstance   {ol/Map|null}  OL Map 인스턴스 (null 허용 — 초기화 전)
 *   baseLayers    {React.Ref}    현재 배경 레이어 배열 ref (레이어 전환 시 뮤테이션)
 *   zoomLevel     {number}       현재 줌 레벨 (부모가 view change 이벤트로 관리)
 *   layerType     {string}       현재 배경 레이어 키 (부모 state)
 *   setLayerType  {function}     layerType 세터 (하단 배지 표시용으로 부모 소유)
 *   coordInfo     {{lon,lat}|null}
 *   mode          {string}       측정 모드 (useGisMeasure)
 *   setMode       {function}
 *   result        {string|null}  측정 결과 텍스트
 *   handleClear   {function}     측정 초기화
 *
 * @author JDJ
 * @since 2026-04-22
 */

import React, { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Ruler, Square, Trash2, MousePointer,
  ZoomIn, ZoomOut, Maximize2,
  MapPin, Camera, Layers, ChevronRight, PenTool,
} from 'lucide-react'
import { TILE_LAYERS }              from '@/utils/gis/tileLayer.js'
import { CTRL_PANEL, CTRL_BTN, DIVIDER } from '@/utils/gis/gisStyle.js'
import { Tip, AngleIcon }           from './GisTip.jsx'

export default function GisMapControls({
  mapInstance, baseLayers,
  zoomLevel, layerType, setLayerType,
  coordInfo,
  mode, setMode,
  result, handleClear,
}) {
  const [showLayers, setShowLayers] = useState(false)
  const [showTools,  setShowTools]  = useState(false)

  // ── 레이어 전환 ─────────────────────────────────────────────────────────────
  const handleLayerChange = useCallback((type) => {
    if (!mapInstance) return
    baseLayers.current.forEach(l => mapInstance.removeLayer(l))
    const created = TILE_LAYERS[type].create()
    const arr = Array.isArray(created) ? created : [created]
    arr.forEach(l => { l.setZIndex(0); mapInstance.getLayers().insertAt(0, l) })
    baseLayers.current = arr
    setLayerType(type)
    setShowLayers(false)
  }, [mapInstance, baseLayers, setLayerType])

  // ── 줌 ──────────────────────────────────────────────────────────────────────
  const zoomIn  = () => { const v = mapInstance?.getView(); v?.animate({ zoom: v.getZoom()+1, duration: 200 }) }
  const zoomOut = () => { const v = mapInstance?.getView(); v?.animate({ zoom: v.getZoom()-1, duration: 200 }) }

  // ── 전체화면 ─────────────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) mapInstance?.getTargetElement()?.requestFullscreen()
    else document.exitFullscreen()
  }

  // ── 지도 캡처 (PNG) ──────────────────────────────────────────────────────────
  const captureMap = useCallback(() => {
    if (!mapInstance) return
    mapInstance.once('rendercomplete', () => {
      try {
        const canvas = document.createElement('canvas')
        const size   = mapInstance.getSize()
        canvas.width = size[0]; canvas.height = size[1]
        const ctx = canvas.getContext('2d')
        mapInstance.getViewport().querySelectorAll('.ol-layer canvas').forEach(c => {
          if (c.width === 0) return
          const opacity  = c.parentElement.style.opacity || c.style.opacity
          ctx.globalAlpha = opacity === '' ? 1 : parseFloat(opacity)
          const m = c.style.transform?.match(/^matrix\(([^)]*)\)$/)?.[1].split(',').map(Number)
          if (m) ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
          else   ctx.setTransform(1, 0, 0, 1, 0, 0)
          ctx.drawImage(c, 0, 0)
        })
        ctx.globalAlpha = 1; ctx.setTransform(1, 0, 0, 1, 0, 0)
        const now  = new Date()
        const ts   = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `지도_${ts}.png`
        document.body.appendChild(link); link.click(); link.remove()
      } catch {
        toast.warning('위성/하이브리드 레이어는 CORS 정책으로 캡처가 제한될 수 있어요.')
      }
    })
    mapInstance.renderSync()
  }, [mapInstance])

  return (
    <>
      {/* ── (1) 우상단 컨트롤 패널 ─────────────────────────────────────────── */}
      <div style={{ position:'absolute', top:10, right:10, zIndex:10, ...CTRL_PANEL, padding:'5px 6px', gap:3 }}>

        {/* 레이어 전환 */}
        <div style={{ position:'relative' }}>
          <Tip text="레이어 전환" side="left">
            <button
              onClick={() => { setShowLayers(v => !v); setShowTools(false) }}
              style={CTRL_BTN(showLayers)}
              onMouseEnter={e => { if (!showLayers) e.currentTarget.style.background='var(--color-bg-tertiary)' }}
              onMouseLeave={e => { if (!showLayers) e.currentTarget.style.background='transparent' }}
            ><Layers size={14} /></button>
          </Tip>
          {showLayers && (
            <div style={{
              position:'absolute', top:0, right:40,
              background:'var(--color-bg-secondary)', border:'1px solid var(--color-border)',
              borderRadius:'var(--radius-md)', boxShadow:'var(--shadow-md)',
              padding:4, minWidth:100, display:'flex', flexDirection:'column', gap:2,
            }}>
              {Object.entries(TILE_LAYERS).map(([key, val]) => (
                <button key={key} onClick={() => handleLayerChange(key)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer',
                    fontSize:12, fontWeight: layerType===key ? 600 : 400,
                    background: layerType===key ? 'var(--color-accent)' : 'transparent',
                    color:      layerType===key ? '#fff' : 'var(--color-text-primary)',
                    transition:'all .1s',
                  }}
                  onMouseEnter={e => { if (layerType!==key) e.currentTarget.style.background='var(--color-bg-tertiary)' }}
                  onMouseLeave={e => { if (layerType!==key) e.currentTarget.style.background='transparent' }}
                >
                  {val.label}{layerType===key && <ChevronRight size={11} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 측정 도구 */}
        <div style={{ position:'relative' }}>
          <Tip text="측정 도구" side="left">
            <button
              onClick={() => { setShowTools(v => !v); setShowLayers(false) }}
              style={CTRL_BTN(showTools || mode !== 'none')}
              onMouseEnter={e => { if (!showTools && mode==='none') e.currentTarget.style.background='var(--color-bg-tertiary)' }}
              onMouseLeave={e => { if (!showTools && mode==='none') e.currentTarget.style.background='transparent' }}
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
                <button key={key}
                  onClick={() => { setMode(key); setShowTools(false) }}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer',
                    fontSize:12, fontWeight: mode===key ? 600 : 400,
                    background: mode===key ? 'var(--color-accent)' : 'transparent',
                    color:      mode===key ? '#fff' : 'var(--color-text-primary)',
                    transition:'all .1s',
                  }}
                  onMouseEnter={e => { if (mode!==key) e.currentTarget.style.background='var(--color-bg-tertiary)' }}
                  onMouseLeave={e => { if (mode!==key) e.currentTarget.style.background='transparent' }}
                >
                  <Icon size={12} />{label}
                  {mode===key && <ChevronRight size={11} style={{ marginLeft:'auto' }} />}
                </button>
              ))}
              <div style={{ height:1, background:'var(--color-border)', margin:'2px 0' }} />
              <button
                onClick={() => { handleClear(); setShowTools(false) }}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'6px 10px', borderRadius:4, border:'none', cursor:'pointer',
                  fontSize:12, background:'transparent', color:'var(--color-danger)', transition:'all .1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              ><Trash2 size={12} />초기화</button>
            </div>
          )}
        </div>

        <div style={DIVIDER} />

        {/* 캡처 */}
        <Tip text="지도 캡처 (PNG 저장)" side="left">
          <button onClick={captureMap} style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          ><Camera size={14} /></button>
        </Tip>

        {/* 전체화면 */}
        <Tip text="전체화면" side="left">
          <button onClick={toggleFullscreen} style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          ><Maximize2 size={14} /></button>
        </Tip>

        <div style={DIVIDER} />

        {/* 줌 인 */}
        <Tip text="확대" side="left">
          <button onClick={zoomIn} style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
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
            {[20,15,10,5,3].map(lvl => (
              <div key={lvl} style={{
                position:'absolute', left:0, right:0,
                display:'flex', alignItems:'center',
                bottom:`${((lvl-3)/(20-3))*100}%`, transform:'translateY(50%)',
              }}>
                <div style={{
                  width:4, height:1, marginLeft:'auto', marginRight:2,
                  background: zoomLevel>=lvl ? 'var(--color-accent)' : 'var(--color-border)',
                }} />
              </div>
            ))}
            <div style={{
              position:'absolute',
              bottom:`${Math.max(0,Math.min(100,((zoomLevel-6)/(19-6))*100))}%`,
              left:0, right:0,
              display:'flex', justifyContent:'center',
              transform:'translateY(50%)',
              pointerEvents:'none', zIndex:1,
            }}>
              <span style={{
                fontSize:9, fontWeight:700,
                color:'var(--color-accent)',
                background:'var(--color-bg-secondary)',
                border:'1px solid var(--color-accent)',
                borderRadius:3, padding:'0 2px', lineHeight:'13px',
              }}>{zoomLevel}</span>
            </div>
          </div>
          <div style={{ fontSize:8, padding:'2px 0', color:'var(--color-text-muted)' }}>MIN</div>
        </div>

        {/* 줌 아웃 */}
        <Tip text="축소" side="left">
          <button onClick={zoomOut} style={CTRL_BTN()}
            onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-tertiary)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          ><ZoomOut size={14} /></button>
        </Tip>
      </div>

      {/* ── (2) 좌하단 — 측정 진행 안내 / 결과 ─────────────────────────────── */}
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

      {/* ── (3) 하단 — 좌표 + 레이어 배지 ──────────────────────────────────── */}
      <div style={{
        position:'absolute', bottom:10, left:12, right:12, zIndex:10,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        pointerEvents:'none',
      }}>
        {coordInfo
          ? <div style={{
              padding:'3px 10px', borderRadius:'var(--radius-sm)', fontSize:10,
              fontFamily:'monospace', background:'var(--color-bg-secondary)',
              border:'1px solid var(--color-border)', color:'var(--color-text-secondary)',
              boxShadow:'var(--shadow-sm)',
            }}>{coordInfo.lat}, {coordInfo.lon}</div>
          : <div />
        }
        <div style={{
          padding:'3px 10px', borderRadius:'var(--radius-sm)', fontSize:10,
          background:'var(--color-bg-secondary)',
          border:'1px solid var(--color-border)', color:'var(--color-text-muted)',
          boxShadow:'var(--shadow-sm)',
        }}>
          {TILE_LAYERS[layerType]?.label}
        </div>
      </div>
    </>
  )
}
