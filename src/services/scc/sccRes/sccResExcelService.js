/**
 * SCC 결과 상세 (전주 SCC 산정표) 엑셀 내보내기 서비스.
 * ExcelJS + file-saver 사용.
 *
 * @author JDJ
 * @since 2026-04-21
 */
import ExcelJS    from 'exceljs'
import { saveAs } from 'file-saver'

// ── 색상 팔레트 ───────────────────────────────────────────────────────────────
const C = {
    white:     'FFFFFFFF',
    bg:        'FFFFFFFF',
    bgSec:     'FFF5F7FA',
    bgTert:    'FFEDF2FA',
    bgEven:    'FFE8F0FD',
    titleBg:   'FF1F4E79',
    subBg:     'FF2E75B6',
    sectionBg: 'FFD6E4F0',
    header:    'FF1F4E79',
    border:    'FFB8CCE4',
    textPrim:  'FF1A1A2E',
    textSec:   'FF2C3E50',
    textMuted: 'FF6B7A8D',
    success:   'FF166534',
    successBg: 'FFDCFCE7',
    danger:    'FF991B1B',
    dangerBg:  'FFFEE2E2',
}

// ── 셀 스타일 헬퍼 ────────────────────────────────────────────────────────────
const border = (style = 'thin') => ({ style, color: { argb: C.border } })
const allBorder = (cell, style = 'thin') => {
    const b = border(style)
    cell.border = { top: b, left: b, bottom: b, right: b }
}

const styleTitle = (cell, text) => {
    cell.value     = `  ${text}`
    cell.font      = { bold: true, size: 15, color: { argb: C.white } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.titleBg } }
    cell.alignment = { horizontal: 'left', vertical: 'middle' }
}

const styleSub = (cell, text) => {
    cell.value     = `  ${text}`
    cell.font      = { size: 9, color: { argb: C.white }, italic: true }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.subBg } }
    cell.alignment = { horizontal: 'left', vertical: 'middle' }
}

const styleSection = (cell, text) => {
    cell.value     = `  ${text}`
    cell.font      = { bold: true, size: 11, color: { argb: C.header } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.sectionBg } }
    cell.alignment = { horizontal: 'left', vertical: 'middle' }
    cell.border    = {
        left:   { style: 'medium', color: { argb: C.header } },
        top:    border(),
        bottom: border(),
        right:  border(),
    }
}

const styleHeader = (cell, text) => {
    cell.value     = text
    cell.font      = { bold: true, size: 10, color: { argb: C.white } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.header } }
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    allBorder(cell)
}

const styleLabel = (cell, text, even = false) => {
    cell.value     = text ?? '-'
    cell.font      = { bold: true, size: 10, color: { argb: C.textPrim } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: even ? C.bgEven : C.bgSec } }
    cell.alignment = { horizontal: 'left', vertical: 'middle' }
    allBorder(cell)
}

const styleData = (cell, value, even = false, align = 'center') => {
    cell.value     = (value == null || value === '') ? '-' : (typeof value === 'number' ? value : String(value))
    cell.font      = { size: 10, color: { argb: C.textSec } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: even ? C.bgTert : C.bg } }
    cell.alignment = { horizontal: align, vertical: 'middle' }
    allBorder(cell)
}

// ── 범용 테이블 렌더러 ────────────────────────────────────────────────────────
// cols: [{ key, label, unit?, num? }]
// rows: 객체 배열
function writeTable(ws, cols, rows, startRow, totalCols) {
    let r = startRow

    // 헤더
    ws.addRow([])
    ws.getRow(r).height = 30
    cols.forEach((col, i) => {
        const label = col.unit ? `${col.label}\n(${col.unit})` : col.label
        styleHeader(ws.getCell(r, i + 1), label)
    })
    // 헤더 뒤 빈 열 채우기
    for (let c = cols.length + 1; c <= totalCols; c++) {
        ws.getCell(r, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.bg } }
    }
    r++

    // 데이터 행
    if (!rows || rows.length === 0) {
        ws.addRow([])
        ws.getRow(r).height = 22
        const cell = ws.getCell(r, 1)
        cell.value     = '데이터가 없습니다.'
        cell.font      = { size: 10, color: { argb: C.textMuted }, italic: true }
        cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.bgSec } }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        ws.mergeCells(r, 1, r, cols.length)
        r++
    } else {
        rows.forEach((row, ri) => {
            ws.addRow([])
            ws.getRow(r).height = 22
            const even = ri % 2 === 1
            cols.forEach((col, ci) => {
                const val   = row[col.key]
                const align = col.num ? 'right' : 'center'
                styleData(ws.getCell(r, ci + 1), val, even, align)
            })
            r++
        })
    }

    return r
}

// ── 섹션 구분 행 ──────────────────────────────────────────────────────────────
function addSpacer(ws, totalCols) {
    ws.addRow([])
    const row = ws.lastRow
    row.height = 8
    for (let c = 1; c <= totalCols; c++) {
        ws.getCell(row.number, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.white } }
    }
    return row.number + 1
}

function addSectionTitle(ws, text, totalCols) {
    ws.addRow([])
    const r = ws.lastRow.number
    ws.getRow(r).height = 26
    styleSection(ws.getCell(r, 1), text)
    ws.mergeCells(r, 1, r, totalCols)
    return r + 1
}

// ── 기본 정보 (레이블-값 쌍 3열 배치) ────────────────────────────────────────
const COLS_PER_ROW = 3   // 한 행에 몇 쌍
function writeSummary(ws, data) {
    const pairs = [
        ['순번',          data.seq],
        ['지역구분',      data.regionType],
        ['전산화번호',    data.calcNo],
        ['전산실코드',    data.calcCode],
        ['설비 GID',      data.gid],
        ['전주규격 (m)',  data.poleSize],
        ['전주종류',      data.poleTypeName],
        ['전주형태',      data.poleShape],
        ['지선주각도 (°)',data.stayAngle],
        ['설계하중 (N)',  data.designLoad],
        ['전주저항 (N·m)',data.poleResist],
        ['', ''],
    ]

    for (let i = 0; i < pairs.length; i += COLS_PER_ROW) {
        const row = ws.addRow([])
        row.height = 22
        const even = Math.floor(i / COLS_PER_ROW) % 2 === 1

        for (let j = 0; j < COLS_PER_ROW; j++) {
            const [label, value] = pairs[i + j] ?? ['', '']
            styleLabel(row.getCell(j * 2 + 1), label, even)
            styleData (row.getCell(j * 2 + 2), value, even, 'left')
        }
    }
}

// ── 컬럼 정의 (SccResDtlFeature 와 동일) ────────────────────────────────
const POLE_PARAMS_COLS = [
    { key: 'designLoad',         label: '설계하중',        unit: 'N',   num: true },
    { key: 'windLoad',           label: '풍압하중',        unit: 'N/m', num: true },
    { key: 'embedDepth',         label: '근입',            unit: 'm',   num: true },
    { key: 'bottomDia',          label: '전주말구경',      unit: 'mm',  num: true },
    { key: 'surfaceDia',         label: '지표구경',        unit: 'mm',  num: true },
    { key: 'heightAboveSurface', label: '전주지표상높이',  unit: 'm',   num: true },
    { key: 'taperRate',          label: '지름증가율K',                  num: true },
    { key: 'resistMoment',       label: '전주저항모멘트',  unit: 'N·m', num: true },
    { key: 'bendingMoment',      label: '전주굽힘모멘트',  unit: 'N·m', num: true },
    { key: 'horizontalAngle',    label: '수형각도',        unit: '°',   num: true },
    { key: 'poleSubType',        label: '전주세부종류코드' },
]

const WIND_COEF_COLS = [
    { key: 'poleTypeVal',    label: '전주종류', num: true },
    { key: 'cableVal',       label: '가섭선',   num: true },
    { key: 'transformerVal', label: '변압기',   num: true },
    { key: 'switchVal',      label: '개폐기',   num: true },
    { key: 'commCableVal',   label: '통신선',   num: true },
    { key: 'commDeviceVal',  label: '통신기기', num: true },
    { key: 'altCoef',        label: '고도계수', num: true },
]

const RELATED_POLE_COLS = [
    { key: 'calcCode',   label: '전산실코드' },
    { key: 'calcNo',     label: '전산화번호' },
    { key: 'gid',        label: '설비GID',      num: true },
    { key: 'maxSpan',    label: '최대허용경간', unit: 'm', num: true },
    { key: 'actualSpan', label: '실경간',       unit: 'm', num: true },
    { key: 'northAngle', label: '북위방향각도', unit: '°', num: true },
]

const SUPPORT_COLS = [
    { key: 'gid',              label: '설비GID',          num: true },
    { key: 'windPress',        label: '풍압',             unit: 'N/m²', num: true },
    { key: 'surfaceHeight',    label: '지표상높이',       unit: 'm',    num: true },
    { key: 'attachLen',        label: '지지대결합길이',   unit: 'm',    num: true },
    { key: 'supportHeight',    label: '지지대높이',       unit: 'm',    num: true },
    { key: 'repSurfaceHeight', label: '지지대지표상높이', unit: 'm',    num: true },
    { key: 'upperDia',         label: '상부경',           unit: 'mm',   num: true },
    { key: 'lowerDia',         label: '하부경',           unit: 'mm',   num: true },
    { key: 'taperRate',        label: '전주지름증가율',                 num: true },
    { key: 'altCoef',          label: '고도계수',                       num: true },
    { key: 'windCoefPoleType', label: '전주종류계수',                   num: true },
    { key: 'bendingMoment',    label: '굽힘모멘트',       unit: 'N·m',  num: true },
]

const WIRE_COLS = [
    { key: 'calcCode',      label: '전산실코드' },
    { key: 'calcNo',        label: '전산화번호' },
    { key: 'gid',           label: '설비GID',          num: true },
    { key: 'windPress',     label: '풍압',     unit: 'N/m', num: true },
    { key: 'span',          label: '경간',     unit: 'm',   num: true },
    { key: 'maxSpan',       label: '최대허용경간', unit: 'm', num: true },
    { key: 'angle',         label: '각도',     unit: '°',   num: true },
    { key: 'windLen',       label: '수풍길이', unit: 'm',   num: true },
    { key: 'equipName',     label: '설비명' },
    { key: 'installOrder',  label: '설치순서',           num: true },
    { key: 'wireArrange',   label: '전선배열' },
    { key: 'materialType',  label: '자재종류코드' },
    { key: 'materialSpec',  label: '자재규격코드',       num: true },
    { key: 'wireCount',     label: '조수',     unit: '조',  num: true },
    { key: 'dia',           label: '직경',     unit: 'mm',  num: true },
    { key: 'origDia',       label: '환산직경', unit: 'mm',  num: true },
    { key: 'height',        label: '높이',     unit: 'm',   num: true },
    { key: 'maxTension',    label: '상정최대장력', unit: 'N', num: true },
    { key: 'mt',            label: '굽힘모멘트',  unit: 'N·m', num: true },
    { key: 'cableWindCoef', label: '가섭선계수',         num: true },
    { key: 'altCoef',       label: '고도계수',           num: true },
]

const AERIAL_COLS = [
    { key: 'gid',            label: '설비GID',                num: true },
    { key: 'windPress',      label: '풍압',        unit: 'N/m²', num: true },
    { key: 'equipName',      label: '설비명' },
    { key: 'equipTypeCode',  label: '설비종류코드' },
    { key: 'operTypeCode',   label: '조작방식코드' },
    { key: 'capacity',       label: '용량',        unit: 'kVA', num: true },
    { key: 'dia',            label: '직경',        unit: 'mm',  num: true },
    { key: 'maxHeight',      label: '최고높이',    unit: 'm',   num: true },
    { key: 'minHeight',      label: '최저높이',    unit: 'm',   num: true },
    { key: 'subDistDist',    label: '인하장치이격거리',   unit: 'mm', num: true },
    { key: 'subDistBotDist', label: '인하장치봇싱이격거리', unit: 'mm', num: true },
    { key: 'botHeight',      label: '봇싱높이',    unit: 'm',   num: true },
    { key: 'busbar',         label: '소계',                    num: true },
    { key: 'equipHeight',    label: '기기높이',    unit: 'm',   num: true },
    { key: 'wireHeight',     label: '전선높이',    unit: 'm',   num: true },
    { key: 'bendingMoment',  label: '기기굽힘모멘트', unit: 'N·m', num: true },
    { key: 'windCoef',       label: '풍압계수',               num: true },
    { key: 'altCoef',        label: '고도계수',               num: true },
]

const COMM_COLS = [
    { key: 'gid',           label: '설비GID',    num: true },
    { key: 'equipName',     label: '설비명' },
    { key: 'equipTypeName', label: '설비종류명' },
    { key: 'commProvider',  label: '통신사업자' },
    { key: 'equipDia',      label: '기기직경',   unit: 'mm',  num: true },
    { key: 'equipHeight',   label: '기기높이',   unit: 'm',   num: true },
    { key: 'minHeight',     label: '최저높이',   unit: 'm',   num: true },
    { key: 'mt',            label: '굽힘모멘트', unit: 'N·m', num: true },
    { key: 'windCoef',      label: '풍압계수',               num: true },
    { key: 'altCoef',       label: '고도계수',               num: true },
    { key: 'windPress',     label: '풍압',       unit: 'N/m²', num: true },
]

const STRENGTH_COLS = [
    { key: 'distEquipLoad',     label: '배전설비측정치', unit: 'N·m', num: true },
    { key: 'aerialEquipLoad',   label: '공가설비측정치', unit: 'N·m', num: true },
    { key: 'poleStrengthTotal', label: '전주강도합계',   unit: 'N·m', num: true },
    { key: 'stayLoad',          label: '지선부담',       unit: 'N·m', num: true },
    { key: 'poleLoad',          label: '전주부담',       unit: 'N·m', num: true },
    { key: 'safetyFactor',      label: '안전율',                     num: true },
    { key: 'poleJudgeCode',     label: '전주판정코드' },
    { key: 'wireMtSum',         label: '전선MT합',       unit: 'N·m', num: true },
]

const STAY_COLS = [
    { key: 'stayExists', label: '지선존재여부' },
    { key: 'stayStress', label: '지선응력',    unit: 'N',  num: true },
    { key: 'allowLoad',  label: '허용지지력',  unit: 'N',  num: true },
    { key: 'judgment',   label: '판정' },
    { key: 'wireType',   label: '철선종류(현행)' },
    { key: 'wireSpec',   label: '규격(현행)' },
]

// ── 메인 내보내기 함수 ────────────────────────────────────────────────────────
export async function exportSccResultDetailExcel(data) {
    if (!data) return

    const wb = new ExcelJS.Workbook()
    wb.creator  = 'PMS'
    wb.modified = new Date()

    // 가장 열이 많은 섹션 기준 (전선 인자: 21열)
    const TOTAL_COLS = WIRE_COLS.length

    const ws = wb.addWorksheet('전주 SCC 산정표')
    ws.views = [{ showGridLines: false }]

    // 열 너비 설정 (22열)
    const COL_WIDTHS = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
    ws.columns = COL_WIDTHS.map(w => ({ width: w }))

    // ── 메인 제목 ─────────────────────────────────────────────────────────────
    ws.addRow([])
    ws.getRow(1).height = 36
    styleTitle(ws.getCell(1, 1), '전주 SCC 산정표')
    ws.mergeCells(1, 1, 1, TOTAL_COLS)

    ws.addRow([])
    ws.getRow(2).height = 18
    styleSub(ws.getCell(2, 1), `전산화번호: ${data.calcNo ?? '-'}  ·  전주종류: ${data.poleTypeName ?? '-'}  ·  GID: ${data.gid ?? '-'}`)
    ws.mergeCells(2, 1, 2, TOTAL_COLS)

    // ── 섹션별 출력 ───────────────────────────────────────────────────────────
    const sections = [
        { badge: '01', title: '기본 정보',            type: 'summary' },
        { badge: '02', title: '전주 인자',            cols: POLE_PARAMS_COLS,  rows: data.poleParams    ? [data.poleParams]    : [] },
        { badge: '03', title: '전주 풍력계수',        cols: WIND_COEF_COLS,    rows: data.windCoef      ? [data.windCoef]      : [] },
        { badge: '04', title: '관련전주 목록',        cols: RELATED_POLE_COLS, rows: data.relatedPoles  ?? [] },
        { badge: '05', title: '지지대 인자 목록',     cols: SUPPORT_COLS,      rows: data.supportParams ?? [] },
        { badge: '06', title: '전선 인자 목록',       cols: WIRE_COLS,         rows: data.wireParams    ?? [] },
        { badge: '07', title: '가공설비 인자 목록',   cols: AERIAL_COLS,       rows: data.aerialParams  ?? [] },
        { badge: '08', title: '통신기기 인자 목록',   cols: COMM_COLS,         rows: data.commParams    ?? [] },
        { badge: '09', title: '전주 강도계산 결과',   cols: STRENGTH_COLS,     rows: data.strengthResult ? [data.strengthResult] : [] },
        { badge: '10', title: '지선 강도계산 결과',   cols: STAY_COLS,         rows: data.stayResult    ? [data.stayResult]    : [] },
    ]

    for (const sec of sections) {
        addSpacer(ws, TOTAL_COLS)
        addSectionTitle(ws, `${sec.badge}  ${sec.title}`, sec.cols ? sec.cols.length : COLS_PER_ROW * 2)

        if (sec.type === 'summary') {
            writeSummary(ws, data)
        } else {
            const startRow = ws.lastRow.number + 1
            writeTable(ws, sec.cols, sec.rows, startRow, TOTAL_COLS)
        }
    }

    // ── 저장 ─────────────────────────────────────────────────────────────────
    const buf      = await wb.xlsx.writeBuffer()
    const fileName = `전주_SCC_산정표_${data.calcNo ?? 'export'}.xlsx`
    saveAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName)
}
