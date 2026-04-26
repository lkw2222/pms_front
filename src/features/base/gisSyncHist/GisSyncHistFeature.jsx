import React, { useState, useMemo, useCallback, useRef } from 'react'
import { useQuery }    from '@tanstack/react-query'
import BasicGrid       from '@/components/grid/BasicGrid.jsx'
import DateInput       from '@/components/input/DateInput.jsx'
import SearchInput     from '@/components/input/SearchInput.jsx'
import BasicButton     from '@/components/button/BasicButton.jsx'
import ConfirmModal    from '@/components/modal/ConfirmModal.jsx'
import { exportGisSyncHistExcel } from '@/services/base/gisSyncHist/gisSyncHistExcelService.js'
import { Search, RotateCcw, Download, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import styles from './GisSyncHistFeature.module.css'

/**
 * GIS 데이터 연계 이력 모니터링 기능 컴포넌트.
 *
 * @author JDJ
 * @since 2026-04-26
 */

// ── 날짜 유틸 ─────────────────────────────────────────────────────────────────
const fmt = (d) => d.toISOString().slice(0, 10)
const getDefaultDates = () => {
    const today = new Date()
    const twoMonthsAgo = new Date(today)
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    return { dateFrom: fmt(twoMonthsAgo), dateTo: fmt(today) }
}

// ── 옵션 정의 ─────────────────────────────────────────────────────────────────
const SEARCH_TYPE_OPT = [
    { label: '타겟 테이블 ID', value: 'tgtTableId'   },
    { label: '타겟 테이블명',  value: 'tgtTableName' },
    { label: '연계상태 로그',  value: 'syncLog'      },
]

// ── 샘플 데이터 ───────────────────────────────────────────────────────────────
const GIS_SYNC_HIST_DATA = [
    { id:1,  tgtTableId:'KBT5101', tgtTableName:'전주기본정보',   logDt:'2026-04-25 16:00:30', totCnt:160, insCnt:120, updCnt:35,  delCnt:5,  syncLog:'정상 처리' },
    { id:2,  tgtTableId:'KBT5201', tgtTableName:'전선경로정보',   logDt:'2026-04-25 16:05:10', totCnt:107,  insCnt:85,  updCnt:20,  delCnt:2,  syncLog:'정상 처리' },
    { id:3,  tgtTableId:'KBT5301', tgtTableName:'GIS 설비위치',   logDt:'2026-04-25 16:10:45', totCnt:52,  insCnt:40,  updCnt:12,  delCnt:0,  syncLog:'정상 처리' },
    { id:4,  tgtTableId:'KBT5601', tgtTableName:'행정구역정보',   logDt:'2026-04-25 16:15:00', totCnt:3,  insCnt:0,   updCnt:3,   delCnt:0,  syncLog:'정상 처리' },
    { id:5,  tgtTableId:'KBT5101', tgtTableName:'전주기본정보',   logDt:'2026-04-24 16:00:30', totCnt:126, insCnt:95,  updCnt:28,  delCnt:3,  syncLog:'정상 처리' },
    { id:6,  tgtTableId:'KBT5201', tgtTableName:'전선경로정보',   logDt:'2026-04-24 16:05:10', totCnt:76,  insCnt:60,  updCnt:15,  delCnt:1,  syncLog:'정상 처리' },
    { id:7,  tgtTableId:'KBT5301', tgtTableName:'GIS 설비위치',   logDt:'2026-04-24 16:10:45', totCnt:30,  insCnt:22,  updCnt:8,   delCnt:0,  syncLog:'정상 처리' },
    { id:8,  tgtTableId:'KBT5101', tgtTableName:'전주기본정보',   logDt:'2026-04-23 16:00:30', totCnt:159, insCnt:110, updCnt:42,  delCnt:7,  syncLog:'오류 발생 - 연결 타임아웃' },
    { id:9,  tgtTableId:'KBT5201', tgtTableName:'전선경로정보',   logDt:'2026-04-23 16:05:10', totCnt:97,  insCnt:75,  updCnt:18,  delCnt:4,  syncLog:'정상 처리' },
    { id:10, tgtTableId:'KBT5601', tgtTableName:'행정구역정보',   logDt:'2026-04-23 16:15:00', totCnt:1,  insCnt:0,   updCnt:1,   delCnt:0,  syncLog:'정상 처리' },
]

// ── 로그 일괄 삭제 Modal ──────────────────────────────────────────────────────
function LogDeleteModal({ open, onConfirm, onCancel }) {
    const [baseDate, setBaseDate] = useState(() => {
        const d = new Date()
        d.setMonth(d.getMonth() - 3)
        return fmt(d)
    })

    useCallback(() => {
        if (!open) return
        const handler = (e) => { if (e.key === 'Escape') onCancel?.() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [open, onCancel])

    if (!open) return null

    return (
        <div
            onClick={onCancel}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)',
                animation: 'fadeIn .15s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: 380,
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    overflow: 'hidden',
                    animation: 'slideUp .18s ease',
                }}
            >
                {/* 헤더 */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderBottom: '1px solid var(--color-border)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Trash2 size={16} color="var(--color-danger)" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            로그 일괄 삭제
                        </span>
                    </div>
                    <button
                        onClick={onCancel}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 24, height: 24, border: '1px solid transparent',
                            borderRadius: 'var(--radius-md)', background: 'transparent',
                            cursor: 'pointer', color: 'var(--color-text-muted)', transition: 'all .15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-tertiary)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                    >
                        <X size={13} />
                    </button>
                </div>

                {/* 본문 */}
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <DateInput
                        label="삭제 기준일"
                        value={baseDate}
                        onChange={v => setBaseDate(v)}
                    />
                    <div style={{
                        fontSize: 12, color: 'var(--color-danger)',
                        background: 'rgba(220,38,38,0.06)',
                        padding: '10px 12px', borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(220,38,38,0.25)',
                        lineHeight: 1.6,
                    }}>
                        ※ 선택한 날짜 <strong>이전</strong>의 로그가 모두 삭제됩니다.<br />
                        삭제된 데이터는 복구할 수 없습니다.
                    </div>
                </div>

                {/* 버튼 */}
                <div style={{
                    display: 'flex', justifyContent: 'flex-end', gap: 8,
                    padding: '12px 16px', borderTop: '1px solid var(--color-border)',
                    background: 'var(--color-bg-tertiary)',
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '6px 14px', fontSize: 12, fontWeight: 500,
                            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                            background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)',
                            cursor: 'pointer', transition: 'all .15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-secondary)' }}
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onConfirm(baseDate)}
                        disabled={!baseDate}
                        style={{
                            padding: '6px 14px', fontSize: 12, fontWeight: 600,
                            border: 'none', borderRadius: 'var(--radius-md)',
                            background: 'var(--color-danger)', color: '#fff',
                            cursor: 'pointer', transition: 'opacity .15s',
                            opacity: baseDate ? 1 : 0.5,
                        }}
                        onMouseEnter={e => { if (baseDate) e.currentTarget.style.opacity = '0.85' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── 검색 폼 ───────────────────────────────────────────────────────────────────
function SearchForm({ search, setSearch, onSearch, onReset, onLogDelete, onSelectDelete, onExcel, totalCount, isLoading, hasSelection }) {
    return (
        <div className="panel-toolbar panel-toolbar-col">
            <div className="panel-search-value" style={{ display: 'grid', gridTemplateColumns: '145px 145px 400px 1fr', gap: 10, alignItems: 'end' }}>
                <DateInput
                    label="조회일자(시작)" value={search.dateFrom}
                    onChange={v => setSearch(s => ({
                        ...s,
                        dateFrom: v,
                        dateTo: s.dateTo && v > s.dateTo ? '' : s.dateTo,
                    }))}
                />
                <DateInput
                    label="조회일자(종료)" value={search.dateTo}
                    options={{ minDate: search.dateFrom || undefined }}
                    onChange={v => setSearch(s => ({ ...s, dateTo: v }))}
                />
                <SearchInput
                    label="검색"
                    options={SEARCH_TYPE_OPT}
                    selectValue={search.searchType}
                    onSelectChange={e => setSearch(s => ({ ...s, searchType: e.target.value }))}
                    inputValue={search.searchValue}
                    onInputChange={e => setSearch(s => ({ ...s, searchValue: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && onSearch()}
                />
                {/* 검색 영역 우측 끝: 로그삭제 */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: 1 }}>
                    <BasicButton
                        label="로그삭제" icon={Trash2} variant="danger" size="sm"
                        onClick={onLogDelete}
                    />
                </div>
            </div>
            <div className="panel-search-function">
                {/* 좌측: 총 건수 */}
                <div className={styles.totalCount}>
                    {isLoading
                        ? <span style={{ color: 'var(--color-danger-total)' }}>조회 중...</span>
                        : <>총 <strong style={{ color: 'var(--color-danger-total)' }}>{totalCount.toLocaleString()}</strong>건</>
                    }
                </div>
                {/* 중앙: 초기화 / 조회 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <BasicButton label="초기화" icon={RotateCcw}  variant="secondary" onClick={onReset} />
                    <BasicButton label="조회"   icon={isLoading ? undefined : Search} variant="primary" onClick={onSearch} disabled={isLoading} />
                </div>
                {/* 우측: 선택삭제 / 엑셀 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <BasicButton
                        label="선택삭제" icon={Trash2} variant="danger" size="sm"
                        onClick={onSelectDelete} disabled={!hasSelection}
                    />
                    <BasicButton label="엑셀" icon={Download} variant="secondary" size="sm" onClick={onExcel} />
                </div>
            </div>
        </div>
    )
}

// ── GisSyncHistFeature ────────────────────────────────────────────────────────
const INIT_SEARCH = { ...getDefaultDates(), searchType: 'tgtTableId', searchValue: '' }

export default function GisSyncHistFeature({ onDelete, onLogDelete }) {
    const [search,  setSearch]  = useState(INIT_SEARCH)
    const [applied, setApplied] = useState(INIT_SEARCH)

    const [selectedRows, setSelectedRows] = useState([])
    const gridRef = useRef(null)

    // ── 선택삭제 confirm ───────────────────────────────────────────────────────
    const [selectDeleteOpen, setSelectDeleteOpen] = useState(false)

    // ── 로그삭제 Modal / confirm ───────────────────────────────────────────────
    const [logDeleteOpen,    setLogDeleteOpen]    = useState(false)
    const [logDeleteDate,    setLogDeleteDate]    = useState(null)
    const [logDeleteConfirmOpen, setLogDeleteConfirmOpen] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ['gisSyncHist', 'list', applied],
        throwOnError: true,
        queryFn: async () => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // import { gisSyncHistApi } from '@/services/base/gisSyncHist/gisSyncHistService.js'
            // return gisSyncHistApi.getList(applied)
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 200))
            const list = GIS_SYNC_HIST_DATA.filter(row => {
                if (applied.dateFrom && row.logDt.slice(0, 10) < applied.dateFrom) return false
                if (applied.dateTo   && row.logDt.slice(0, 10) > applied.dateTo)   return false
                if (applied.searchValue) {
                    const v = applied.searchValue.toLowerCase()
                    if (applied.searchType === 'tgtTableId'   && !row.tgtTableId.toLowerCase().includes(v))   return false
                    if (applied.searchType === 'tgtTableName' && !row.tgtTableName.toLowerCase().includes(v)) return false
                    if (applied.searchType === 'syncLog'      && !row.syncLog.toLowerCase().includes(v))      return false
                }
                return true
            })
            return { list, totalCount: list.length }
        },
        staleTime: 1000 * 60,
    })

    const onSearch = () => { setApplied({ ...search }); setSelectedRows([]) }
    const onReset  = () => {
        const defaults = { ...getDefaultDates(), searchType: 'tgtTableId', searchValue: '' }
        setSearch(defaults); setApplied(defaults); setSelectedRows([])
    }
    const onExcel = () =>
        exportGisSyncHistExcel(data?.list ?? []).catch(() => toast.error('엑셀 내보내기 중 오류가 발생했습니다.'))

    // ── 선택삭제 ──────────────────────────────────────────────────────────────
    const handleSelectDeleteConfirm = useCallback(async () => {
        await onDelete?.(selectedRows)
        setSelectDeleteOpen(false)
        setSelectedRows([])
        gridRef.current?.api?.deselectAll()
    }, [selectedRows, onDelete])

    // ── 로그삭제 ──────────────────────────────────────────────────────────────
    const handleLogDeleteModalConfirm = useCallback((date) => {
        setLogDeleteDate(date)
        setLogDeleteOpen(false)
        setLogDeleteConfirmOpen(true)
    }, [])

    const handleLogDeleteFinal = useCallback(async () => {
        await onLogDelete?.(logDeleteDate)
        setLogDeleteConfirmOpen(false)
        setLogDeleteDate(null)
    }, [logDeleteDate, onLogDelete])

    const colDefs = useMemo(() => [
        {
            headerName: '', width: 44, flex: 0, sortable: false, filter: false,
            checkboxSelection: true, headerCheckboxSelection: true,
            resizable: false,
        },
        { field: 'tgtTableId',   headerName: '타겟 테이블ID', width: 130, flex: 0 },
        { field: 'tgtTableName', headerName: '테이블명',      width: 140, flex: 0 },
        { field: 'totCnt',  headerName: '전체건수', width: 100, flex: 0, cellStyle: { textAlign: 'right' }, valueFormatter: ({ value }) => value?.toLocaleString() ?? '-' },
        { field: 'insCnt',  headerName: '등록건수', width: 100, flex: 0, cellStyle: { textAlign: 'right' }, valueFormatter: ({ value }) => value?.toLocaleString() ?? '-' },
        { field: 'updCnt',  headerName: '수정건수', width: 100, flex: 0, cellStyle: { textAlign: 'right' }, valueFormatter: ({ value }) => value?.toLocaleString() ?? '-' },
        { field: 'delCnt',  headerName: '삭제건수', width: 100, flex: 0, cellStyle: { textAlign: 'right' }, valueFormatter: ({ value }) => value?.toLocaleString() ?? '-' },
        { field: 'logDt',   headerName: '로그일시', width: 165, flex: 0 },
        { field: 'syncLog', headerName: '연계 상태 로그', flex: 1, minWidth: 160 },
    ], [])

    return (
        <div className="grid-wrap">
            <SearchForm
                search={search} setSearch={setSearch}
                onSearch={onSearch} onReset={onReset}
                onLogDelete={() => setLogDeleteOpen(true)}
                onSelectDelete={() => setSelectDeleteOpen(true)}
                onExcel={onExcel}
                totalCount={data?.totalCount ?? 0} isLoading={isLoading}
                hasSelection={selectedRows.length > 0}
            />
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <BasicGrid
                    ref={gridRef}
                    mode="paginate" rowData={data?.list ?? []} colDefs={colDefs}
                    height="100%" pageSize={20} loading={isLoading}
                    rowSelection="multiple"
                    onSelectionChanged={e => setSelectedRows(e.api.getSelectedRows())}
                    suppressRowClickSelection={true}
                    defaultColDef={{ sortable:true, resizable:true, filter:false, minWidth:80, flex:1 }}
                />
            </div>

            {/* 선택삭제 ConfirmModal */}
            <ConfirmModal
                open={selectDeleteOpen} variant="danger" title="선택 삭제 확인"
                message={`선택한 ${selectedRows.length}건의 로그를 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
                confirmText="삭제"
                onConfirm={handleSelectDeleteConfirm}
                onCancel={() => setSelectDeleteOpen(false)}
            />

            {/* 로그 일괄 삭제 Modal */}
            <LogDeleteModal
                open={logDeleteOpen}
                onConfirm={handleLogDeleteModalConfirm}
                onCancel={() => setLogDeleteOpen(false)}
            />

            {/* 로그 일괄 삭제 최종 ConfirmModal */}
            <ConfirmModal
                open={logDeleteConfirmOpen} variant="danger" title="로그 일괄 삭제 확인"
                message={`${logDeleteDate} 이전의 로그를 모두 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
                confirmText="삭제"
                onConfirm={handleLogDeleteFinal}
                onCancel={() => setLogDeleteConfirmOpen(false)}
            />
        </div>
    )
}
