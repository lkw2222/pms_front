import React, { useCallback, useMemo, forwardRef } from 'react'
import { useAppStore } from '@/store/useAppStore.js'
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
