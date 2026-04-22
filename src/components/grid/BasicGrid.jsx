import React, { useCallback, useMemo, forwardRef } from 'react'
import { useAppStore } from '@/store/useAppStore.js'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'

// CSS 파일 import 제거 (v33+ Theming API 사용)
// import 'ag-grid-community/styles/ag-grid.css'      ← 제거
// import 'ag-grid-community/styles/ag-theme-quartz.css' ← 제거

ModuleRegistry.registerModules([AllCommunityModule])

const localeText = {
  pageSizeSelectorLabel: '페이지당 건수',
  ariaPageSizeSelectorLabel: '페이지당 건수',
  page: '페이지',
  more: '더보기',
  to: '~',
  of: '/',
  firstPage: '첫 페이지',
  previousPage: '이전 페이지',
  nextPage: '다음 페이지',
  lastPage: '마지막 페이지',
}
/**
 * AG Grid v33+ 래퍼 컴포넌트. paginate(페이징) / infinite(무한 스크롤) / none(기본)
 * 세 가지 모드 지원. 테마는 Theming API(themeQuartz) 적용
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}                        props
 * @param {'paginate'|'infinite'|'none'}  [props.mode='paginate']     그리드 모드
 * @param {Array}                         [props.rowData=[]]          행 데이터
 * @param {Array}                         [props.colDefs=[]]          컬럼 정의
 * @param {function}                      [props.onRowClick]          행 클릭 핸들러
 * @param {function}                      [props.onRowDoubleClick]    행 더블클릭 핸들러
 * @param {string}                        [props.height='100%']       그리드 높이
 * @param {number}                        [props.pageSize=20]         페이지당 행 수 (paginate 모드)
 * @param {object}                        [props.datasource]          무한 스크롤 데이터소스 (infinite 모드)
 * @param {number}                        [props.cacheBlockSize=50]   캐시 블록 크기 (infinite 모드)
 * @param {boolean}                       [props.loading=false]       로딩 상태
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
const BasicGrid = forwardRef(function BasicGrid({
  mode           = 'paginate',
  rowData        = [],
  colDefs        = [],
  onRowClick,
  onRowDoubleClick,
  height         = '100%',
  pageSize       = 20,
  datasource,
  cacheBlockSize = 50,
  loading        = false,
  className      = '',
  ...props
}, ref) {
  const defaultColDef = useMemo(() => ({
    sortable:  true,
    resizable: true,
    filter:    true,
    minWidth:  80,
    flex:      1,
  }), [])

  const onRowClicked = useCallback((e) => {
    if (e.event?.target?.closest('button')) return
    onRowClick?.(e.data)
  }, [onRowClick])

  const onCellDoubleClicked = useCallback((e) => {
    if (e.event?.target?.closest('button')) return
    if (!e.data) return
    onRowDoubleClick?.(e.data)
  }, [onRowDoubleClick])

  // ── Theming API (v33+) ────────────────────────────────────────────────────
  // theme 변경 시 CSS 변수값을 다시 읽어 그리드 테마 재적용
  const { theme: appTheme } = useAppStore()

  const theme = useMemo(() => {
    const s = getComputedStyle(document.documentElement)
    const v = (name) => s.getPropertyValue(name).trim()
    return themeQuartz.withParams({
      backgroundColor:            v('--color-bg-secondary')  || '#ffffff',
      foregroundColor:            v('--color-text-primary')  || '#1f2328',
      headerBackgroundColor:      v('--color-bg-tertiary')   || '#f6f8fa',
      headerTextColor:            v('--color-text-secondary')|| '#656d76',
      borderColor:                v('--color-border')        || '#d0d7de',
      rowHoverColor:              v('--color-bg-hover')      || '#f3f4f6',
      selectedRowBackgroundColor: appTheme === 'dark' ? 'rgba(88,166,255,0.15)' : 'rgba(37,99,235,0.08)',
      oddRowBackgroundColor:      v('--color-bg-primary')    || '#f9fafb',
      fontSize:                   13,
      rowHeight:                  36,
      headerHeight:               38,
      cellHorizontalPaddingScale: 1.2,
      fontFamily:                 'inherit',
      borderRadius:               0,
      wrapperBorderRadius:        0,
    })
  }, [appTheme])

  // ── 모드별 props ──────────────────────────────────────────────────────────
  const infiniteProps = mode === 'infinite' ? {
    rowModelType:            'infinite',
    datasource,
    cacheBlockSize,
    maxBlocksInCache:        10,
    infiniteInitialRowCount: cacheBlockSize,
  } : {}

  const paginateProps = mode === 'paginate' ? {
    pagination:                 true,
    paginationPageSize:         pageSize,
    paginationPageSizeSelector: [5, 10, 20, 50, 100],
  } : {}

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <AgGridReact
        ref={ref}
        theme={theme}
        localeText={localeText}
        rowData={mode !== 'infinite' ? rowData : undefined}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onRowClicked={onRowClicked}
        onCellDoubleClicked={onCellDoubleClicked}
        rowSelection="single"
        animateRows={true}
        loading={loading}
        {...infiniteProps}
        {...paginateProps}
        {...props}
      />
    </div>
  )
})

export default BasicGrid
