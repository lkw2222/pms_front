import React from 'react'
import ExcelJS    from 'exceljs'
import { saveAs } from 'file-saver'
import { FileDown } from 'lucide-react'
import BasicButton from '@/components/button/BasicButton.jsx'

// ── 스타일 ────────────────────────────────────────────────────────────────────
const S = {
  wrap: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    overflowY: 'auto',
    height: '100%',
    boxSizing: 'border-box',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  pageSub: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
    marginTop: 3,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 8,
    borderBottom: '2px solid var(--color-accent)',
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 20,
    background: 'var(--color-accent)',
    color: '#fff',
    letterSpacing: '0.05em',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
    color: 'var(--color-text-primary)',
  },
  th: {
    background: 'var(--color-bg-large-d)',
    color: 'var(--color-accent)',
    fontWeight: 700,
    padding: '9px 12px',
    border: '1px solid var(--color-border)',
    textAlign: 'center',
    fontSize: 11,
    whiteSpace: 'nowrap',
  },
  thSub: {
    background: 'var(--color-bg-tertiary)',
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
    padding: '7px 12px',
    border: '1px solid var(--color-border)',
    textAlign: 'center',
    fontSize: 11,
  },
  td: {
    padding: '8px 12px',
    border: '1px solid var(--color-border)',
    textAlign: 'center',
    fontSize: 12,
    color: 'var(--color-text-secondary)',
  },
  tdLabel: {
    padding: '8px 14px',
    border: '1px solid var(--color-border)',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    background: 'var(--color-bg-secondary)',
    whiteSpace: 'nowrap',
  },
  tdNum: {
    padding: '8px 12px',
    border: '1px solid var(--color-border)',
    textAlign: 'right',
    fontSize: 12,
    color: 'var(--color-text-secondary)',
    fontVariantNumeric: 'tabular-nums',
  },
  badge: (variant) => ({
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 10,
    background: variant === 'yes'  ? 'var(--color-success)22'
               : variant === 'no'  ? 'var(--color-bg-hover)'
               : variant === 'warn'? 'var(--color-warning)22'
               : 'var(--color-accent)22',
    color: variant === 'yes'  ? 'var(--color-success)'
         : variant === 'no'   ? 'var(--color-text-muted)'
         : variant === 'warn' ? 'var(--color-warning)'
         : 'var(--color-accent)',
    border: `1px solid ${
      variant === 'yes'  ? 'var(--color-success)44'
    : variant === 'no'   ? 'var(--color-border)'
    : variant === 'warn' ? 'var(--color-warning)44'
    : 'var(--color-accent)44'
    }`,
  }),
  noteBox: {
    padding: '14px 18px',
    borderRadius: 8,
    background: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  noteTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--color-text-muted)',
    marginBottom: 2,
    letterSpacing: '0.05em',
  },
  noteText: {
    fontSize: 11,
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
  },
}

const ROW_EVEN = { background: 'var(--color-bg-tertiary)' }
const ROW_ODD  = { background: 'transparent' }
const rowBg = (i) => i % 2 === 1 ? ROW_EVEN : ROW_ODD

// ── 데이터 ────────────────────────────────────────────────────────────────────

// 표 1: 전주 제원 및 풍하중
const POLE_DATA = [
  { no:'1', height:16, type:'콘크리트주', dia:190, stay:'없음',  support:'없음',  coef:0.70, load:2.45, moment:39.2 },
  { no:'2', height:14, type:'콘크리트주', dia:190, stay:'있음',  support:'없음',  coef:0.70, load:2.15, moment:30.1 },
  { no:'3', height:12, type:'콘크리트주', dia:165, stay:'없음',  support:'있음',  coef:0.70, load:1.88, moment:22.6 },
  { no:'4', height:16, type:'강관주',     dia:216, stay:'없음',  support:'없음',  coef:0.60, load:2.10, moment:33.6 },
  { no:'5', height:14, type:'강관주',     dia:190, stay:'있음',  support:'있음',  coef:0.60, load:1.82, moment:25.5 },
]

// 표 2: 전선 풍하중
const WIRE_DATA = [
  { type:'가공지선',       spec:'GW 32mm²',     windLen:50, height:15.5, dia: 9.0, windPress:31.5, moment:1.55 },
  { type:'고압전선 (ACSR)',spec:'ACSR 58mm²',   windLen:50, height:14.0, dia:14.0, windPress:49.0, moment:2.45 },
  { type:'저압전선',       spec:'OW 35mm²',     windLen:50, height:10.0, dia:16.0, windPress:56.0, moment:2.80 },
  { type:'통신선',         spec:'OPGW 10mm²',   windLen:50, height: 8.5, dia:10.0, windPress:35.0, moment:1.49 },
]

// 표 3: 가공설비 풍하중
const EQUIP_DATA = [
  { category:'변압기', type:'단상 10kVA', height:11.0, area:0.45, coef:1.3, load:0.585, moment: 6.44 },
  { category:'변압기', type:'삼상 30kVA', height:11.0, area:0.65, coef:1.3, load:0.845, moment: 9.30 },
  { category:'변압기', type:'삼상 75kVA', height:11.0, area:0.80, coef:1.3, load:1.040, moment:11.44 },
  { category:'개폐기', type:'고압 COS',   height:12.5, area:0.12, coef:1.3, load:0.156, moment: 1.95 },
  { category:'개폐기', type:'저압 DS',    height:12.5, area:0.10, coef:1.3, load:0.130, moment: 1.63 },
]

const NOTES = [
  '풍하중 산정은 건축구조기준(KBC 2016) 및 한국전력공사 배전설비 설계기준에 따른다.',
  '설계 기준 풍속: 지역별 기준 풍속 적용 (기본 40m/s), 지표면 조도구분 B 기준.',
  '전주 저항 모멘트는 지면에서 지지점까지의 거리에 풍하중을 곱하여 산정한다.',
  '지선 및 지지대가 설치된 경우 수평력의 일부를 부담하므로 실제 전주 모멘트는 감소한다.',
  '가공설비의 풍압계수는 KS C IEC 60826 및 배전설비 설계기준을 따른다.',
]

// ── Excel 스타일 헬퍼 ─────────────────────────────────────────────────────────
const XL_COLOR = {
  bg:        'FFFFFFFF', // 흰색 배경
  bgSec:     'FFF5F7FA', // 연한 회색
  bgTert:    'FFEDF2FA', // 연한 파랑 줄
  bgHover:   'FFE3ECF8', // 살짝 더 진한 파랑
  header:    'FF1F4E79', // 진한 파랑 헤더
  subHeader: 'FF2E75B6', // 중간 파랑
  titleBg:   'FF1F4E79', // 제목 배경
  sectionBg: 'FFD6E4F0', // 섹션 타이틀 배경
  accent:    'FF1F4E79', // 강조색
  success:   'FF375623', // 초록
  warning:   'FF7F6000', // 노랑
  textPrim:  'FF1A1A2E', // 거의 검정
  textSec:   'FF2C3E50', // 진한 회색
  textMuted: 'FF6B7A8D', // 중간 회색
  border:    'FFB8CCE4', // 연한 파랑 테두리
  white:     'FFFFFFFF',
}

function xBorder(cell) {
  const b = { style:'thin', color:{ argb: XL_COLOR.border } }
  cell.border = { top:b, left:b, bottom:b, right:b }
}

function xTitle(cell, text) {
  cell.value     = text
  cell.font      = { bold:true, size:14, color:{ argb: XL_COLOR.white } }
  cell.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: XL_COLOR.titleBg } }
  cell.alignment = { horizontal:'left', vertical:'middle' }
}

function xHeader(cell, text) {
  cell.value     = text
  cell.font      = { bold:true, size:10, color:{ argb: XL_COLOR.white } }
  cell.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: XL_COLOR.header } }
  cell.alignment = { horizontal:'center', vertical:'middle', wrapText:true }
  xBorder(cell)
}

function xLabel(cell, text, even=false) {
  cell.value     = text
  cell.font      = { bold:true, size:10, color:{ argb: XL_COLOR.textPrim } }
  cell.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: even ? XL_COLOR.bgHover : XL_COLOR.bgSec } }
  cell.alignment = { horizontal:'left', vertical:'middle' }
  xBorder(cell)
}

function xData(cell, text, even=false, align='center') {
  cell.value     = (typeof text === 'number') ? text : String(text ?? '')
  cell.font      = { size:10, color:{ argb: XL_COLOR.textSec } }
  cell.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: even ? XL_COLOR.bgTert : XL_COLOR.bg } }
  cell.alignment = { horizontal:align, vertical:'middle' }
  xBorder(cell)
}

function xNote(ws, rowNum, colCount, text) {
  ws.addRow([])
  const r = ws.getRow(rowNum)
  r.height = 16
  const c = ws.getCell(`A${rowNum}`)
  c.value     = `  ${text}`
  c.font      = { size:9, color:{ argb: XL_COLOR.textMuted }, italic:true }
  c.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: XL_COLOR.bgSec } }
  c.alignment = { horizontal:'left', vertical:'middle', wrapText:true }
  const endCol = String.fromCharCode(64 + colCount)
  ws.mergeCells(`A${rowNum}:${endCol}${rowNum}`)
}

async function exportToExcel() {
  const wb = new ExcelJS.Workbook()
  wb.creator  = 'PMS'
  wb.modified = new Date()

  // 전체 열 수 (가장 넓은 표 기준: 전주 제원 9열)
  const TOTAL_COLS = 9

  const ws = wb.addWorksheet('전주 풍하중 산정표')
  ws.views = [{ showGridLines: false }]
  ws.columns = [
    { width: 7  }, // A
    { width: 18 }, // B
    { width: 16 }, // C
    { width: 14 }, // D
    { width: 12 }, // E
    { width: 12 }, // F
    { width: 12 }, // G
    { width: 16 }, // H
    { width: 20 }, // I
  ]

  let r = 0 // 현재 행 번호 추적

  // ── 헬퍼: 빈 구분 행 ───────────────────────────────────────────────────────
  const addSpacer = () => {
    r++
    ws.addRow([])
    ws.getRow(r).height = 10
    for (let c = 1; c <= TOTAL_COLS; c++) {
      ws.getCell(r, c).fill = { type:'pattern', pattern:'solid', fgColor:{ argb: 'FFFFFFFF' } }
    }
  }

  // ── 헬퍼: 섹션 제목 행 ─────────────────────────────────────────────────────
  const addSectionTitle = (text) => {
    r++
    ws.addRow([])
    ws.getRow(r).height = 26
    const cell = ws.getCell(r, 1)
    cell.value     = `  ${text}`
    cell.font      = { bold:true, size:11, color:{ argb: XL_COLOR.header } }
    cell.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: XL_COLOR.sectionBg } }
    cell.alignment = { horizontal:'left', vertical:'middle' }
    ws.mergeCells(r, 1, r, TOTAL_COLS)
    cell.border = {
      left:   { style:'medium', color:{ argb: XL_COLOR.header } },
      top:    { style:'thin',   color:{ argb: XL_COLOR.border } },
      bottom: { style:'thin',   color:{ argb: XL_COLOR.border } },
      right:  { style:'thin',   color:{ argb: XL_COLOR.border } },
    }
  }

  // ── 헬퍼: 노트 행 ──────────────────────────────────────────────────────────
  const addNote = (text) => {
    r++
    ws.addRow([])
    ws.getRow(r).height = 16
    const cell = ws.getCell(r, 1)
    cell.value     = `  ${text}`
    cell.font      = { size:9, color:{ argb: XL_COLOR.textMuted }, italic:true }
    cell.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: XL_COLOR.bg } }
    cell.alignment = { horizontal:'left', vertical:'middle', wrapText:true }
    ws.mergeCells(r, 1, r, TOTAL_COLS)
  }

  // ── 헬퍼: 빈 열 채우기 (테이블 열이 TOTAL_COLS 보다 적을 때) ───────────────
  const fillEmpty = (rowNum, fromCol) => {
    for (let c = fromCol; c <= TOTAL_COLS; c++) {
      ws.getCell(rowNum, c).fill = { type:'pattern', pattern:'solid', fgColor:{ argb: XL_COLOR.bg } }
    }
  }

  // ════════════════════════════════════════════════════════
  // 메인 제목
  // ════════════════════════════════════════════════════════
  r++
  ws.addRow([])
  ws.getRow(r).height = 36
  const mainTitle = ws.getCell(r, 1)
  mainTitle.value     = '  전주 풍하중 산정표'
  mainTitle.font      = { bold:true, size:16, color:{ argb: XL_COLOR.white } }
  mainTitle.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: XL_COLOR.titleBg } }
  mainTitle.alignment = { horizontal:'left', vertical:'middle' }
  ws.mergeCells(r, 1, r, TOTAL_COLS)

  r++
  ws.addRow([])
  ws.getRow(r).height = 18
  const subTitle = ws.getCell(r, 1)
  subTitle.value     = '  KBC 2016 기준  ·  기준 풍속 40m/s  ·  지표면 조도구분 B'
  subTitle.font      = { size:9, color:{ argb: XL_COLOR.white }, italic:true }
  subTitle.fill      = { type:'pattern', pattern:'solid', fgColor:{ argb: XL_COLOR.subHeader } }
  subTitle.alignment = { horizontal:'left', vertical:'middle' }
  ws.mergeCells(r, 1, r, TOTAL_COLS)

  // ════════════════════════════════════════════════════════
  // 표 1: 전주 제원 및 풍하중 (9열)
  // ════════════════════════════════════════════════════════
  addSpacer()
  addSectionTitle('01  전주 제원 및 풍하중')

  r++
  ws.addRow([])
  ws.getRow(r).height = 30
  ;['No','전주 높이\n(m)','전주 종류','말구 직경\n(mm)','지선\n여부','지지대\n여부','풍압\n계수','설계 풍하중\n(kN)','전주 저항 모멘트\n(kN·m)']
    .forEach((h, i) => xHeader(ws.getCell(r, i+1), h))

  POLE_DATA.forEach((row, i) => {
    r++
    ws.addRow([])
    ws.getRow(r).height = 22
    const ev = i % 2 === 1
    xData( ws.getCell(r, 1), row.no,      ev)
    xData( ws.getCell(r, 2), row.height,  ev, 'right')
    xLabel(ws.getCell(r, 3), row.type,    ev)
    xData( ws.getCell(r, 4), row.dia,     ev, 'right')
    xData( ws.getCell(r, 5), row.stay,    ev)
    xData( ws.getCell(r, 6), row.support, ev)
    xData( ws.getCell(r, 7), row.coef,    ev, 'right')
    xData( ws.getCell(r, 8), row.load,    ev, 'right')
    xData( ws.getCell(r, 9), row.moment,  ev, 'right')
  })

  addNote('  주) 풍하중 산정 기준: KBC 2016, 기준 풍속 40m/s, 지표면 조도구분 B')
  addNote('       지선/지지대 설치 시 실제 전주 모멘트는 감소하므로 별도 검토 필요')

  // ════════════════════════════════════════════════════════
  // 표 2: 전선 풍하중 (7열, 나머지 2열 빈칸)
  // ════════════════════════════════════════════════════════
  addSpacer()
  addSectionTitle('02  전선 풍하중')

  r++
  ws.addRow([])
  ws.getRow(r).height = 30
  ;['전선 종류','규격','수풍 길이\n(m)','전선 높이\n(m)','전선 직경\n(mm)','전선 풍압\n(N/m)','전선 모멘트\n(kN·m)']
    .forEach((h, i) => xHeader(ws.getCell(r, i+1), h))
  fillEmpty(r, 8)

  WIRE_DATA.forEach((row, i) => {
    r++
    ws.addRow([])
    ws.getRow(r).height = 22
    const ev = i % 2 === 1
    xLabel(ws.getCell(r, 1), row.type,      ev)
    xData( ws.getCell(r, 2), row.spec,      ev)
    xData( ws.getCell(r, 3), row.windLen,   ev, 'right')
    xData( ws.getCell(r, 4), row.height,    ev, 'right')
    xData( ws.getCell(r, 5), row.dia,       ev, 'right')
    xData( ws.getCell(r, 6), row.windPress, ev, 'right')
    xData( ws.getCell(r, 7), row.moment,    ev, 'right')
    fillEmpty(r, 8)
  })

  addNote('  주) 전선 풍압 = (전선 직경 × 수풍길이 × 설계풍압) / 1000')
  addNote('       전선 모멘트 = 전선 풍압 × 전선 높이 / 1000')

  // ════════════════════════════════════════════════════════
  // 표 3: 가공설비 풍하중 (7열, 나머지 2열 빈칸)
  // ════════════════════════════════════════════════════════
  addSpacer()
  addSectionTitle('03  가공설비 풍하중')

  r++
  ws.addRow([])
  ws.getRow(r).height = 30
  ;['구분','기기 종류','설치 높이\n(m)','수풍 면적\n(m²)','풍압\n계수','풍하중\n(kN)','기기 모멘트\n(kN·m)']
    .forEach((h, i) => xHeader(ws.getCell(r, i+1), h))
  fillEmpty(r, 8)

  const categories = [...new Set(EQUIP_DATA.map(row => row.category))]
  categories.forEach((cat, ci) => {
    const items = EQUIP_DATA.filter(row => row.category === cat)
    const startRow = r + 1
    items.forEach((row, i) => {
      r++
      ws.addRow([])
      ws.getRow(r).height = 22
      const ev = ci % 2 === 1
      if (i === 0) xLabel(ws.getCell(r, 1), cat, ev)
      else {
        const c = ws.getCell(r, 1)
        c.fill = { type:'pattern', pattern:'solid', fgColor:{ argb: ev ? XL_COLOR.bgHover : XL_COLOR.bgSec } }
        xBorder(c)
      }
      xLabel(ws.getCell(r, 2), row.type,   ev)
      xData( ws.getCell(r, 3), row.height, ev, 'right')
      xData( ws.getCell(r, 4), row.area,   ev, 'right')
      xData( ws.getCell(r, 5), row.coef,   ev, 'right')
      xData( ws.getCell(r, 6), row.load,   ev, 'right')
      xData( ws.getCell(r, 7), row.moment, ev, 'right')
      fillEmpty(r, 8)
    })
    if (items.length > 1) ws.mergeCells(startRow, 1, r, 1)
  })

  addNote('  주) 풍하중 = 수풍면적 × 설계풍압 × 풍압계수,  모멘트 = 풍하중 × 설치높이')
  addNote('       설계풍압 = 0.5 × ρ × V² × Ce,  ρ=1.25 kg/m³, V=설계풍속(m/s)')

  // ════════════════════════════════════════════════════════
  // 참고 사항
  // ════════════════════════════════════════════════════════
  addSpacer()
  addSectionTitle('참고 사항')
  NOTES.forEach((note, i) => addNote(`  ${i + 1})  ${note}`))

  // ── 저장 ───────────────────────────────────────────────────────────────────
  const buf = await wb.xlsx.writeBuffer()
  saveAs(new Blob([buf], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), '전주_풍하중_산정표.xlsx')
}

// ── 화면 컴포넌트 ─────────────────────────────────────────────────────────────
export default function WindPressureFeature() {
  return (
    <div style={S.wrap}>

      {/* 페이지 헤더 */}
      <div style={S.pageHeader}>
        <div>
          <div style={S.pageTitle}>전주 풍하중 산정표</div>
          <div style={S.pageSub}>KBC 2016 기준 · 기준 풍속 40m/s · 지표면 조도구분 B</div>
        </div>
        <BasicButton label="엑셀 다운로드" icon={FileDown} variant="primary" size="sm" onClick={exportToExcel} />
      </div>

      {/* ── 표 1: 전주 제원 ─────────────────────────────────────────────── */}
      <div style={S.section}>
        <div style={S.sectionHeader}>
          <span style={S.sectionBadge}>01</span>
          <span style={S.sectionTitle}>전주 제원 및 풍하중</span>
        </div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width:40  }}>No</th>
              <th style={{ ...S.th, width:80  }}>전주 높이<br/>(m)</th>
              <th style={{ ...S.th, width:110 }}>전주 종류</th>
              <th style={{ ...S.th, width:90  }}>말구 직경<br/>(mm)</th>
              <th style={{ ...S.th, width:80  }}>지선<br/>여부</th>
              <th style={{ ...S.th, width:80  }}>지지대<br/>여부</th>
              <th style={{ ...S.th, width:80  }}>풍압<br/>계수</th>
              <th style={{ ...S.th, width:100 }}>설계 풍하중<br/>(kN)</th>
              <th style={S.th}>전주 저항 모멘트<br/>(kN·m)</th>
            </tr>
          </thead>
          <tbody>
            {POLE_DATA.map((row, i) => (
              <tr key={i} style={rowBg(i)}>
                <td style={S.td}>{row.no}</td>
                <td style={S.tdNum}>{row.height}</td>
                <td style={S.tdLabel}>{row.type}</td>
                <td style={S.tdNum}>{row.dia}</td>
                <td style={S.td}>
                  <span style={S.badge(row.stay === '있음' ? 'yes' : 'no')}>{row.stay}</span>
                </td>
                <td style={S.td}>
                  <span style={S.badge(row.support === '있음' ? 'yes' : 'no')}>{row.support}</span>
                </td>
                <td style={S.tdNum}>{row.coef}</td>
                <td style={S.tdNum}>{row.load}</td>
                <td style={S.tdNum}>{row.moment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 표 2: 전선 풍하중 ───────────────────────────────────────────── */}
      <div style={S.section}>
        <div style={S.sectionHeader}>
          <span style={{ ...S.sectionBadge, background:'var(--color-purple)' }}>02</span>
          <span style={S.sectionTitle}>전선 풍하중</span>
        </div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width:140 }}>전선 종류</th>
              <th style={{ ...S.th, width:120 }}>규격</th>
              <th style={{ ...S.th, width:90  }}>수풍 길이<br/>(m)</th>
              <th style={{ ...S.th, width:90  }}>전선 높이<br/>(m)</th>
              <th style={{ ...S.th, width:90  }}>전선 직경<br/>(mm)</th>
              <th style={{ ...S.th, width:100 }}>전선 풍압<br/>(N/m)</th>
              <th style={S.th}>전선 모멘트<br/>(kN·m)</th>
            </tr>
          </thead>
          <tbody>
            {WIRE_DATA.map((row, i) => (
              <tr key={i} style={rowBg(i)}>
                <td style={S.tdLabel}>{row.type}</td>
                <td style={{ ...S.td, color:'var(--color-text-muted)', fontSize:11 }}>{row.spec}</td>
                <td style={S.tdNum}>{row.windLen}</td>
                <td style={S.tdNum}>{row.height}</td>
                <td style={S.tdNum}>{row.dia}</td>
                <td style={S.tdNum}>{row.windPress}</td>
                <td style={S.tdNum}>{row.moment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 표 3: 가공설비 ──────────────────────────────────────────────── */}
      <div style={S.section}>
        <div style={S.sectionHeader}>
          <span style={{ ...S.sectionBadge, background:'var(--color-success)' }}>03</span>
          <span style={S.sectionTitle}>가공설비 풍하중</span>
        </div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width:80  }}>구분</th>
              <th style={{ ...S.th, width:140 }}>기기 종류</th>
              <th style={{ ...S.th, width:100 }}>설치 높이<br/>(m)</th>
              <th style={{ ...S.th, width:100 }}>수풍 면적<br/>(m²)</th>
              <th style={{ ...S.th, width:80  }}>풍압<br/>계수</th>
              <th style={{ ...S.th, width:100 }}>풍하중<br/>(kN)</th>
              <th style={S.th}>기기 모멘트<br/>(kN·m)</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows = []
              const cats = [...new Set(EQUIP_DATA.map(r => r.category))]
              let gi = 0
              cats.forEach(cat => {
                const items = EQUIP_DATA.filter(r => r.category === cat)
                items.forEach((row, i) => {
                  rows.push(
                    <tr key={`${cat}-${i}`} style={rowBg(gi)}>
                      {i === 0 && (
                        <td rowSpan={items.length} style={{ ...S.tdLabel, textAlign:'center', verticalAlign:'middle' }}>
                          {cat}
                        </td>
                      )}
                      <td style={S.tdLabel}>{row.type}</td>
                      <td style={S.tdNum}>{row.height}</td>
                      <td style={S.tdNum}>{row.area}</td>
                      <td style={S.tdNum}>{row.coef}</td>
                      <td style={S.tdNum}>{row.load}</td>
                      <td style={S.tdNum}>{row.moment}</td>
                    </tr>
                  )
                  gi++
                })
              })
              return rows
            })()}
          </tbody>
        </table>
      </div>

      {/* 주석 */}
      <div style={S.noteBox}>
        <div style={S.noteTitle}>참고 사항</div>
        {NOTES.map((note, i) => (
          <div key={i} style={S.noteText}>
            <strong style={{ color:'var(--color-accent)' }}>{i + 1})</strong> {note}
          </div>
        ))}
      </div>

    </div>
  )
}
