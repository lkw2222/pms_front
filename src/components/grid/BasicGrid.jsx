import React, { useCallback, useMemo, forwardRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community'

// CSS 파일 import 제거 (v33+ Theming API 사용)
// import 'ag-grid-community/styles/ag-grid.css'      ← 제거
// import 'ag-grid-community/styles/ag-theme-quartz.css' ← 제거

ModuleRegistry.registerModules([AllCommunityModule])

/**
 * BasicGrid
 * @param {'paginate'|'infinite'|'none'} mode
 * @param {Array}    rowData
 * @param {Array}    colDefs
 * @param {function} onRowClick
 * @param {string}   height
 * @param {number}   pageSize
 * @param {object}   datasource   - infinite 모드 전용
 * @param {number}   cacheBlockSize
 * @param {...any}   props
 */
const BasicGrid = forwardRef(function BasicGrid({
  mode           = 'paginate',
  rowData        = [],
  colDefs        = [],
  onRowClick,
  height         = '100%',
  pageSize       = 20,
  datasource,
  cacheBlockSize = 50,
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
    onRowClick?.(e.data)
  }, [onRowClick])

  // ── Theming API (v33+) ────────────────────────────────────────────────────
  // CSS 변수와 연동되도록 커스텀 테마 구성
  const theme = themeQuartz.withParams({
    backgroundColor:            'var(--color-bg-secondary)',
    foregroundColor:            'var(--color-text-primary)',
    headerBackgroundColor:      'var(--color-bg-tertiary)',
    headerTextColor:            'var(--color-text-secondary)',
    borderColor:                'var(--color-border)',
    rowHoverColor:              'var(--color-bg-hover)',
    selectedRowBackgroundColor: 'rgba(88,166,255,0.12)',
    oddRowBackgroundColor:      'var(--color-bg-primary)',
    fontSize:                   13,
    rowHeight:                  36,
    headerHeight:               38,
    cellHorizontalPaddingScale: 1.2,
    fontFamily:                 'inherit',
  })

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
    paginationPageSizeSelector: [10, 20, 50, 100],
  } : {}

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <AgGridReact
        ref={ref}
        theme={theme}
        rowData={mode !== 'infinite' ? rowData : undefined}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onRowClicked={onRowClicked}
        rowSelection="single"
        animateRows={true}
        {...infiniteProps}
        {...paginateProps}
        {...props}
      />
    </div>
  )
})

export default BasicGrid
