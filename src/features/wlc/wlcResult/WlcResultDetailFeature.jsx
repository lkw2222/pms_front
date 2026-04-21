import React from 'react'
import BasicButton from "@/components/button/BasicButton.jsx"
import { FileDown } from "lucide-react"
import { exportWlcResultDetailExcel } from '@/services/wlc/wlcResult/wlcResultExcelService.js'
import styles from './WlcResultDetailFeature.module.css'

/**
 * 풍하중 평가 결과 상세 화면.
 * data prop 을 받아 각 섹션을 렌더링한다.
 *
 * @author JDJ
 * @since 2026-04-21
 * @param {{ data: object }} props
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-21 | JDJ    | 최초 작성 |
 */

// ── 섹션별 배지 색상 ──────────────────────────────────────────────────────────
const SECTION_COLORS = [
    '#3B82F6', //  — blue
    '#6366F1', //  — indigo
    '#10B981', // — emerald
    '#F59E0B', // — amber
]

// ── 섹션 래퍼 (color prop 은 배지 배경색만 동적 → 인라인 유지) ───────────────
function Section({ badge, title, color, children }) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <span className={styles.sectionBadge} style={{ background: color }}>
                    {badge}
                </span>
                <span className={styles.sectionTitle}>{title}</span>
            </div>
            {children}
        </div>
    )
}

// ── 범용 데이터 테이블 ────────────────────────────────────────────────────────
// columns : [{ key, label, unit?, width?, num? }]
//   unit  : 헤더 아래에 (단위) 로 표시
// rows    : 객체 배열 — 비어있으면 "데이터가 없습니다." 표시
// 단일 행 섹션은 rows={[dataObject]} 형태로 전달
function DataTable({ columns, rows = [] }) {
    return (
        <div className={styles.tableWrap}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className={styles.th} style={{ width: col.width }}>
                                {col.label}
                                {col.unit && <span className={styles.thUnit}>({col.unit})</span>}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className={styles.emptyTd}>
                                데이터가 없습니다.
                            </td>
                        </tr>
                    ) : rows.map((row, i) => (
                        <tr key={i}>
                            {columns.map(col => (
                                <td key={col.key} className={col.num ? styles.tdNum : styles.td}>
                                    {row[col.key] ?? '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// ── 기본 정보 요약 (3열 레이블-값 쌍) ────────────────────────────────────────
function SummaryTable({ data }) {
    const rows = [
        [['순번',        data.seq],          ['지역구분',      data.regionType],    ['전산화번호',     data.calcNo]],
        [['전산실코드',   data.calcCode],     ['설비 GID',      data.gid],           ['전주규격 (m)',   data.poleSize]],
        [['전주종류',     data.poleTypeName], ['전주형태',      data.poleShape],     ['지선주각도 (°)', data.stayAngle]],
        [['설계하중 (N)', data.designLoad],   ['전주저항 (N·m)', data.poleResist],   ['', '']],
    ]
    return (
        <table className={styles.table}>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        {row.map(([label, value], j) => (
                            <React.Fragment key={j}>
                                <td className={styles.tdLabel}>{label}</td>
                                <td className={styles.tdValue}>{value ?? '-'}</td>
                            </React.Fragment>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

// ── 컬럼 정의 ─────────────────────────────────────────────────────────────────

const POLE_PARAMS_COLS = [
    { key:'designLoad',         label:'설계하중',       unit:'N',    num:true },
    { key:'windLoad',           label:'풍압하중',       unit:'N/m',  num:true },
    { key:'embedDepth',         label:'근입',           unit:'m',    num:true },
    { key:'bottomDia',          label:'전주밑구경',     unit:'mm',   num:true },
    { key:'surfaceDia',         label:'지표구경',       unit:'mm',   num:true },
    { key:'heightAboveSurface', label:'전주지표상높이', unit:'m',    num:true },
    { key:'taperRate',          label:'지름증가율K',                 num:true },
    { key:'resistMoment',       label:'전주저항모멘트', unit:'N·m',  num:true },
    { key:'bendingMoment',      label:'전주굽힘모멘트', unit:'N·m',  num:true },
    { key:'horizontalAngle',    label:'수형각도',       unit:'°',    num:true },
    { key:'poleSubType',        label:'전주세부종류코드' },
]

const WIND_COEF_COLS = [
    { key:'poleTypeVal',    label:'전주종류', num:true },
    { key:'cableVal',       label:'가섭선',   num:true },
    { key:'transformerVal', label:'변압기',   num:true },
    { key:'switchVal',      label:'개폐기',   num:true },
    { key:'commCableVal',   label:'통신선',   num:true },
    { key:'commDeviceVal',  label:'통신기기', num:true },
    { key:'altCoef',        label:'고도계수', num:true },
]

const RELATED_POLE_COLS = [
    { key:'calcCode',   label:'전산실코드',   width:90  },
    { key:'calcNo',     label:'전산화번호',   width:110 },
    { key:'gid',        label:'설비GID',      width:100, num:true },
    { key:'maxSpan',    label:'최대허용경간', unit:'m',  width:100, num:true },
    { key:'actualSpan', label:'실경간',       unit:'m',  width:80,  num:true },
    { key:'northAngle', label:'북위방향각도', unit:'°',  width:100, num:true },
]

const SUPPORT_COLS = [
    { key:'gid',              label:'설비GID',          width:90,  num:true },
    { key:'windPress',        label:'풍압',             unit:'N/m²', width:70,  num:true },
    { key:'surfaceHeight',    label:'지표상높이',       unit:'m',  width:80,  num:true },
    { key:'attachLen',        label:'지지대결합길이',   unit:'m',  width:100, num:true },
    { key:'supportHeight',    label:'지지대높이',       unit:'m',  width:80,  num:true },
    { key:'repSurfaceHeight', label:'지지대표상높이',   unit:'m',  width:100, num:true },
    { key:'upperDia',         label:'상부경',           unit:'mm', width:65,  num:true },
    { key:'lowerDia',         label:'하부경',           unit:'mm', width:65,  num:true },
    { key:'taperRate',        label:'전주지름증가율',   width:100, num:true },
    { key:'altCoef',          label:'고도계수',         width:80,  num:true },
    { key:'windCoefPoleType', label:'전주종류계수', width:90, num:true },
    { key:'bendingMoment',    label:'굽힘모멘트',       unit:'N·m', width:90,  num:true },
]

const WIRE_COLS = [
    { key:'calcCode',      label:'전산실코드',       width:80  },
    { key:'calcNo',        label:'전산화번호',       width:100 },
    { key:'gid',           label:'설비GID',          width:90,  num:true },
    { key:'windPress',     label:'풍압',     unit:'N/m', width:65,  num:true },
    { key:'span',          label:'경간',     unit:'m',   width:55,  num:true },
    { key:'maxSpan',       label:'최대허용경간', unit:'m', width:90, num:true },
    { key:'angle',         label:'각도',     unit:'°',   width:50,  num:true },
    { key:'windLen',       label:'수풍길이', unit:'m',   width:70,  num:true },
    { key:'equipName',     label:'설비명',           width:90  },
    { key:'installOrder',  label:'설치순서',         width:65,  num:true },
    { key:'wireArrange',   label:'전선배열',         width:65  },
    { key:'materialType',  label:'자재종류코드',     width:90  },
    { key:'materialSpec',  label:'자재규격코드',     width:90,  num:true },
    { key:'wireCount',     label:'조수',     unit:'조',  width:50,  num:true },
    { key:'dia',           label:'직경',     unit:'mm',  width:55,  num:true },
    { key:'origDia',       label:'원산직경', unit:'mm',  width:65,  num:true },
    { key:'height',        label:'높이',     unit:'m',   width:55,  num:true },
    { key:'maxTension',    label:'상정최대장력', unit:'N', width:100, num:true },
    { key:'mt',            label:'굽힘모멘트',  unit:'N·m', width:90, num:true },
    { key:'cableWindCoef', label:'가섭선계수', width:90, num:true },
    { key:'altCoef',       label:'고도계수',        width:80,  num:true },
]

const AERIAL_COLS = [
    { key:'gid',            label:'설비GID',              width:90,  num:true },
    { key:'windPress',      label:'풍압',        unit:'N/m²', width:65, num:true },
    { key:'equipName',      label:'설비명',               width:90  },
    { key:'equipTypeCode',  label:'설비종류코드',         width:90  },
    { key:'operTypeCode',   label:'조작방식코드',         width:90  },
    { key:'capacity',       label:'용량',        unit:'kVA', width:65, num:true },
    { key:'dia',            label:'직경',        unit:'mm',  width:55, num:true },
    { key:'maxHeight',      label:'최고높이',    unit:'m',   width:70, num:true },
    { key:'minHeight',      label:'최저높이',    unit:'m',   width:70, num:true },
    { key:'subDistDist',    label:'인하장치이격거리',   unit:'mm', width:110, num:true },
    { key:'subDistBotDist', label:'인하장치봇싱이격거리', unit:'mm', width:130, num:true },
    { key:'botHeight',      label:'봇싱높이',    unit:'m',   width:70, num:true },
    { key:'busbar',         label:'소계',                  width:50, num:true },
    { key:'equipHeight',    label:'기기높이',    unit:'m',   width:70, num:true },
    { key:'wireHeight',     label:'전선높이',    unit:'m',   width:70, num:true },
    { key:'bendingMoment',  label:'기기굽힘모멘트', unit:'N·m', width:110, num:true },
    { key:'windCoef',       label:'풍압계수',              width:65, num:true },
    { key:'altCoef',        label:'고도계수',              width:65, num:true },
]

const COMM_COLS = [
    { key:'gid',           label:'설비GID',    width:90,  num:true },
    { key:'equipName',     label:'설비명',     width:110 },
    { key:'equipTypeName', label:'설비종류명', width:100 },
    { key:'commProvider',  label:'통신사업자', width:90  },
    { key:'equipDia',      label:'기기직경',   unit:'mm',  width:70, num:true },
    { key:'equipHeight',   label:'기기높이',   unit:'m',   width:70, num:true },
    { key:'minHeight',     label:'최저높이',   unit:'m',   width:70, num:true },
    { key:'mt',            label:'굽힘모멘트', unit:'N·m', width:90, num:true },
    { key:'windCoef',      label:'풍압계수',   width:65,  num:true },
    { key:'altCoef',       label:'고도계수',   width:65,  num:true },
    { key:'windPress',     label:'풍압',       unit:'N/m²', width:70, num:true },
]

const STRENGTH_COLS = [
    { key:'distEquipLoad',     label:'배전설비측정치', unit:'N·m', num:true },
    { key:'aerialEquipLoad',   label:'공가설비측정치', unit:'N·m', num:true },
    { key:'poleStrengthTotal', label:'전주강도합계',   unit:'N·m', num:true },
    { key:'stayLoad',          label:'지선부담',       unit:'N·m', num:true },
    { key:'poleLoad',          label:'전주부담',       unit:'N·m', num:true },
    { key:'safetyFactor',      label:'안전율',                     num:true },
    { key:'poleJudgeCode',     label:'전주판정코드' },
    { key:'wireMtSum',         label:'전선MT합',       unit:'N·m', num:true },
]

const STAY_COLS = [
    { key:'stayExists', label:'지선존재여부' },
    { key:'stayStress', label:'지선응력',    unit:'N',  num:true },
    { key:'allowLoad',  label:'허용지지력',  unit:'N',  num:true },
    { key:'judgment',   label:'판정' },
    { key:'wireType',   label:'철선종류(현행)' },
    { key:'wireSpec',   label:'규격(현행)' },
]

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function WlcResultDetailFeature({ data }) {
    if (!data) return (
        <div className={styles.empty}>
            데이터를 불러오는 중...
        </div>
    )

    return (
        <div className={styles.wrap}>

            {/* 페이지 헤더 */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitle}>전주 풍하중 산정표</div>
                <BasicButton label="엑셀" icon={FileDown} variant="excel" size="sm" onClick={() => exportWlcResultDetailExcel(data)} />
            </div>

            <Section badge="01" title="기본 정보"          color={SECTION_COLORS[0]}><SummaryTable data={data} /></Section>
            <Section badge="02" title="전주 인자"          color={SECTION_COLORS[1]}><DataTable columns={POLE_PARAMS_COLS} rows={data.poleParams    ? [data.poleParams]    : []} /></Section>
            <Section badge="03" title="전주 풍력계수"      color={SECTION_COLORS[2]}><DataTable columns={WIND_COEF_COLS}   rows={data.windCoef      ? [data.windCoef]      : []} /></Section>
            <Section badge="04" title="관련전주 목록"      color={SECTION_COLORS[3]}><DataTable columns={RELATED_POLE_COLS} rows={data.relatedPoles ?? []} /></Section>
            <Section badge="05" title="지지대 인자 목록"   color={SECTION_COLORS[0]}><DataTable columns={SUPPORT_COLS}     rows={data.supportParams ?? []} /></Section>
            <Section badge="06" title="전선 인자 목록"     color={SECTION_COLORS[1]}><DataTable columns={WIRE_COLS}        rows={data.wireParams    ?? []} /></Section>
            <Section badge="07" title="가공설비 인자 목록" color={SECTION_COLORS[2]}><DataTable columns={AERIAL_COLS}      rows={data.aerialParams  ?? []} /></Section>
            <Section badge="08" title="통신기기 인자 목록" color={SECTION_COLORS[3]}><DataTable columns={COMM_COLS}        rows={data.commParams    ?? []} /></Section>
            <Section badge="09" title="전주 강도계산 결과" color={SECTION_COLORS[0]}><DataTable columns={STRENGTH_COLS}    rows={data.strengthResult ? [data.strengthResult] : []} /></Section>
            <Section badge="10" title="지선 강도계산 결과" color={SECTION_COLORS[1]}><DataTable columns={STAY_COLS}        rows={data.stayResult    ? [data.stayResult]    : []} /></Section>

        </div>
    )
}
