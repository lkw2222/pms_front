/**
 * 기초정보 현황 목록 엑셀 내보내기 서비스.
 * ExcelJS + file-saver 사용.
 *
 * @author JDJ
 * @since 2026-04-26
 */
import ExcelJS    from 'exceljs'
import { saveAs } from 'file-saver'

// ── 색상 팔레트 ───────────────────────────────────────────────────────────────
const C = {
    white:     'FFFFFFFF',
    bg:        'FFFFFFFF',
    bgEven:    'FFF0F4FF',
    titleBg:   'FF1F4E79',
    subBg:     'FF2E75B6',
    header:    'FF1F4E79',
    border:    'FFB8CCE4',
    textPrim:  'FF1A1A2E',
    textSec:   'FF2C3E50',
    textMuted: 'FF6B7A8D',
}

const border   = () => ({ style: 'thin', color: { argb: C.border } })
const allBorder = (cell) => { const b = border(); cell.border = { top:b, left:b, bottom:b, right:b } }

const styleTitle = (cell, text) => {
    cell.value     = `  ${text}`
    cell.font      = { bold: true, size: 14, color: { argb: C.white } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.titleBg } }
    cell.alignment = { horizontal: 'left', vertical: 'middle' }
}

const styleSub = (cell, text) => {
    cell.value     = `  ${text}`
    cell.font      = { size: 9, color: { argb: C.white }, italic: true }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.subBg } }
    cell.alignment = { horizontal: 'left', vertical: 'middle' }
}

const styleHeader = (cell, text) => {
    cell.value     = text
    cell.font      = { bold: true, size: 10, color: { argb: C.white } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.header } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    allBorder(cell)
}

const styleData = (cell, value, even = false, align = 'center') => {
    cell.value     = (value == null || value === '') ? '-' : String(value)
    cell.font      = { size: 10, color: { argb: C.textSec } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: even ? C.bgEven : C.bg } }
    cell.alignment = { horizontal: align, vertical: 'middle' }
    allBorder(cell)
}

// ── 컬럼 정의 ─────────────────────────────────────────────────────────────────
const COLS = [
    { key: 'infoType',    label: '정보구분',    width: 12 },
    { key: 'tableId',     label: '테이블 ID',   width: 18 },
    { key: 'tableName',   label: '테이블명',    width: 24 },
    { key: 'dataCount',   label: '자료량(건)',  width: 14, align: 'right' },
    { key: 'remark',      label: '비고',        width: 30 },
    { key: 'lastSyncDt',  label: '최종연계일시', width: 22 },
]

// ── 메인 내보내기 함수 ────────────────────────────────────────────────────────
export async function exportBaseInfoExcel(rows = []) {
    const wb = new ExcelJS.Workbook()
    wb.creator  = 'PMS'
    wb.modified = new Date()

    const ws = wb.addWorksheet('기초정보 현황')
    ws.views    = [{ showGridLines: false }]
    ws.columns  = COLS.map(c => ({ width: c.width }))

    const TOTAL_COLS = COLS.length
    const now = new Date().toLocaleString('ko-KR')

    // ── 제목 ─────────────────────────────────────────────────────────────────
    ws.addRow([])
    ws.getRow(1).height = 34
    styleTitle(ws.getCell(1, 1), '기초정보 현황')
    ws.mergeCells(1, 1, 1, TOTAL_COLS)

    ws.addRow([])
    ws.getRow(2).height = 18
    styleSub(ws.getCell(2, 1), `출력일시: ${now}  ·  총 ${rows.length.toLocaleString()}건`)
    ws.mergeCells(2, 1, 2, TOTAL_COLS)

    // ── 헤더 ─────────────────────────────────────────────────────────────────
    ws.addRow([])
    ws.getRow(3).height = 28
    COLS.forEach((col, i) => styleHeader(ws.getCell(3, i + 1), col.label))

    // ── 데이터 행 ─────────────────────────────────────────────────────────────
    if (rows.length === 0) {
        ws.addRow([])
        ws.getRow(4).height = 22
        const cell = ws.getCell(4, 1)
        cell.value     = '데이터가 없습니다.'
        cell.font      = { size: 10, color: { argb: C.textMuted }, italic: true }
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        ws.mergeCells(4, 1, 4, TOTAL_COLS)
    } else {
        rows.forEach((row, ri) => {
            ws.addRow([])
            const r    = ri + 4
            const even = ri % 2 === 1
            ws.getRow(r).height = 22
            COLS.forEach((col, ci) => {
                styleData(ws.getCell(r, ci + 1), row[col.key], even, col.align ?? 'center')
            })
        })
    }

    // ── 저장 ─────────────────────────────────────────────────────────────────
    const buf = await wb.xlsx.writeBuffer()
    saveAs(
        new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        `기초정보_현황_${new Date().toISOString().slice(0,10)}.xlsx`
    )
}
