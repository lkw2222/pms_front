/**
 * GIS 데이터 연계 이력 엑셀 내보내기 서비스.
 * ExcelJS + file-saver 사용.
 *
 * @author JDJ
 * @since 2026-04-26
 */
import ExcelJS    from 'exceljs'
import { saveAs } from 'file-saver'

const C = {
    white:   'FFFFFFFF',
    bg:      'FFFFFFFF',
    bgEven:  'FFF0F4FF',
    titleBg: 'FF1F4E79',
    subBg:   'FF2E75B6',
    header:  'FF1F4E79',
    border:  'FFB8CCE4',
    textSec: 'FF2C3E50',
    white_:  'FFFFFFFF',
}

const border    = () => ({ style: 'thin', color: { argb: C.border } })
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

const COLS = [
    { key: 'tgtTableId',   label: '타겟 테이블ID', width: 16 },
    { key: 'tgtTableName', label: '테이블명',       width: 22 },
    { key: 'totCnt',       label: '전체건수',       width: 12, align: 'right' },
    { key: 'insCnt',       label: '등록건수',       width: 12, align: 'right' },
    { key: 'updCnt',       label: '수정건수',       width: 12, align: 'right' },
    { key: 'delCnt',       label: '삭제건수',       width: 12, align: 'right' },
    { key: 'logDt',        label: '로그일시',       width: 22 },
    { key: 'syncLog',      label: '연계 상태 로그', width: 36 },
]

export async function exportGisSyncHistExcel(rows = []) {
    const wb = new ExcelJS.Workbook()
    wb.creator  = 'PMS'
    wb.modified = new Date()

    const ws = wb.addWorksheet('GIS 연계 이력')
    ws.views   = [{ showGridLines: false }]
    ws.columns = COLS.map(c => ({ width: c.width }))

    const TOTAL_COLS = COLS.length
    const now = new Date().toLocaleString('ko-KR')

    ws.addRow([])
    ws.getRow(1).height = 34
    styleTitle(ws.getCell(1, 1), 'GIS 데이터 연계 이력')
    ws.mergeCells(1, 1, 1, TOTAL_COLS)

    ws.addRow([])
    ws.getRow(2).height = 18
    styleSub(ws.getCell(2, 1), `출력일시: ${now}  ·  총 ${rows.length.toLocaleString()}건`)
    ws.mergeCells(2, 1, 2, TOTAL_COLS)

    ws.addRow([])
    ws.getRow(3).height = 28
    COLS.forEach((col, i) => styleHeader(ws.getCell(3, i + 1), col.label))

    if (rows.length === 0) {
        ws.addRow([])
        ws.getRow(4).height = 22
        const cell = ws.getCell(4, 1)
        cell.value     = '데이터가 없습니다.'
        cell.font      = { size: 10, italic: true }
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

    const buf = await wb.xlsx.writeBuffer()
    saveAs(
        new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        `GIS_연계이력_${new Date().toISOString().slice(0, 10)}.xlsx`
    )
}
