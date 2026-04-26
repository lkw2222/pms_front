import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery }           from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import BasicGrid         from '@/components/grid/BasicGrid.jsx'
import GridActionButtons from '@/components/grid/GridActionButtons.jsx'
import FormDrawer        from '@/components/grid/FormDrawer.jsx'
import TextInput         from '@/components/input/TextInput.jsx'
import SelectInput       from '@/components/input/SelectInput.jsx'
import SearchInput       from '@/components/input/SearchInput.jsx'
import BasicButton       from '@/components/button/BasicButton.jsx'
import BasicLabel        from '@/components/label/BasicLabel.jsx'
import ConfirmModal      from '@/components/modal/ConfirmModal.jsx'
import { exportBaseInfoExcel } from '@/services/base/baseInfo/baseInfoExcelService.js'
import { Search, RotateCcw, Plus, Download, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import styles from './BaseInfoFeature.module.css'

/**
 * 기초정보 현황 기능 컴포넌트.
 *
 * @author JDJ
 * @since 2026-04-24
 */

// ── 옵션 정의 ─────────────────────────────────────────────────────────────────
const INFO_TYPE_SEARCH = [
    { label: '일반', value: '일반' },
    { label: 'GIS',  value: 'GIS' },
]
const SEARCH_TYPE_OPT = [
    { label: '테이블 ID', value: 'tableId'   },
    { label: '테이블명',  value: 'tableName' },
]
const INFO_TYPE_OPTIONS = [
    { label: '일반', value: '일반' },
    { label: 'GIS',  value: 'GIS' },
]
const INFO_TYPE_VARIANT = { 일반: 'info', GIS: 'success' }

// ── 샘플 데이터 ───────────────────────────────────────────────────────────────
const BASE_INFO_DATA = [
    { id:1,  infoType:'일반', tableId:'JMT7101',        tableName:'전주 기본정보',       dataCount:12450, remark:'전주 마스터 데이터',        lastSyncDt:'2026-04-20 09:00:00' },
    { id:2,  infoType:'일반', tableId:'JMT7201',        tableName:'전선 기본정보',       dataCount:8320,  remark:'전선 마스터 데이터',        lastSyncDt:'2026-04-20 09:05:00' },
    { id:3,  infoType:'일반', tableId:'JMT7301',       tableName:'가공설비 기본정보',   dataCount:3210,  remark:'변압기·개폐기 데이터',      lastSyncDt:'2026-04-20 09:10:00' },
    { id:4,  infoType:'일반', tableId:'JMT7401',  tableName:'통신기기 기본정보',   dataCount:1540,  remark:'통신기기 마스터 데이터',    lastSyncDt:'2026-04-20 09:15:00' },
    { id:5,  infoType:'일반', tableId:'JMT7501',        tableName:'경간 정보',           dataCount:9870,  remark:'경간거리 측정 데이터',      lastSyncDt:'2026-04-21 10:00:00' },
    { id:6,  infoType:'일반', tableId:'JMT7601',   tableName:'풍속 구역 정보',      dataCount:240,   remark:'풍속 구역 코드 데이터',     lastSyncDt:'2026-04-21 10:05:00' },
    { id:7,  infoType:'GIS',  tableId:'KBT5101',    tableName:'GIS 전주 위치정보',   dataCount:12450, remark:'GIS 좌표 연계 데이터',      lastSyncDt:'2026-04-22 08:00:00' },
    { id:8,  infoType:'GIS',  tableId:'KBT5201',    tableName:'GIS 전선 경로정보',   dataCount:8320,  remark:'GIS 선형 연계 데이터',      lastSyncDt:'2026-04-22 08:05:00' },
    { id:9,  infoType:'GIS',  tableId:'KBT5301',   tableName:'GIS 설비 위치정보',   dataCount:3210,  remark:'GIS 설비 좌표 데이터',      lastSyncDt:'2026-04-22 08:10:00' },
    { id:10, infoType:'일반', tableId:'KBT5401', tableName:'점검 결과 정보',      dataCount:5680,  remark:'점검 이력 연계 데이터',     lastSyncDt:'2026-04-23 09:00:00' },
    { id:11, infoType:'일반', tableId:'KBT5501',    tableName:'사고 이력 정보',      dataCount:720,   remark:'사고·수리 이력 데이터',     lastSyncDt:'2026-04-23 09:05:00' },
    { id:12, infoType:'GIS',  tableId:'KBT5601',  tableName:'GIS 행정구역 정보',   dataCount:3520,  remark:'시도·시군구 경계 데이터',   lastSyncDt:'2026-04-23 09:10:00' },
]

// ── 검색 폼 ───────────────────────────────────────────────────────────────────
function SearchForm({ search, setSearch, onSearch, onReset, onRegister, onExcel, totalCount, isLoading }) {
    return (
        <div className="panel-toolbar panel-toolbar-col">
            <div className="panel-search-value" style={{ display:'grid', gridTemplateColumns:'160px 400px', gap:10, alignItems:'end' }}>
                <SelectInput
                    label="정보구분" value={search.infoType}
                    onChange={e => setSearch(s => ({ ...s, infoType: e.target.value }))}
                    options={INFO_TYPE_SEARCH}
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
            </div>
            <div className="panel-search-function">
                <div className={styles.totalCount}>
                    {isLoading
                        ? <span style={{ color:'var(--color-danger-total)' }}>조회 중...</span>
                        : <>총 <strong style={{ color:'var(--color-danger-total)' }}>{totalCount.toLocaleString()}</strong>건</>
                    }
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <BasicButton label="초기화" icon={RotateCcw}                    variant="secondary" onClick={onReset} />
                    <BasicButton label="조회"   icon={isLoading ? Loader2 : Search} variant="primary"   onClick={onSearch} disabled={isLoading} />
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
                    <BasicButton label="엑셀" icon={Download} variant="secondary" size="sm" onClick={onExcel} />
                    <BasicButton label="등록" icon={Plus}     variant="primary"   size="sm" onClick={onRegister} />
                </div>
            </div>
        </div>
    )
}

// ── 상세 보기 (읽기 전용) ─────────────────────────────────────────────────────
function DetailView({ data }) {
    if (!data) return null
    const rows = [
        ['정보구분',    data.infoType],
        ['테이블 ID',   data.tableId],
        ['테이블명',    data.tableName],
        ['자료량(건)',  data.dataCount != null ? data.dataCount.toLocaleString() : null],
        ['비고',        data.remark],
        ['최종연계일시', data.lastSyncDt],
    ]
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {rows.map(([label, value]) => (
                <div key={label} className="detail-row">
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">
                        {label === '정보구분'
                            ? <BasicLabel text={value} variant={INFO_TYPE_VARIANT[value] ?? 'default'} />
                            : (value ?? '—')
                        }
                    </span>
                </div>
            ))}
        </div>
    )
}

// ── react-hook-form Controller 래퍼 ──────────────────────────────────────────
function CtrlText({ name, control, label, rules, ...rest }) {
    return (
        <Controller name={name} control={control} rules={rules}
            render={({ field, fieldState }) => (
                <TextInput
                    label={label} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur}
                    isNotNull={!!rules?.required} errorMessage={fieldState.error?.message} {...rest}
                />
            )}
        />
    )
}

function CtrlSelect({ name, control, label, rules, options, ...rest }) {
    return (
        <Controller name={name} control={control} rules={rules}
            render={({ field }) => (
                <SelectInput
                    label={label} value={field.value ?? ''} onChange={field.onChange}
                    isNotNull={!!rules?.required} options={options} {...rest}
                />
            )}
        />
    )
}

// ── 등록 / 수정 폼 ───────────────────────────────────────────────────────────
function BaseInfoForm({ control }) {
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <CtrlSelect
                name="infoType" control={control} label="정보구분"
                options={INFO_TYPE_OPTIONS}
                rules={{ required: '정보구분을 선택하세요' }}
            />
            <CtrlText
                name="tableId" control={control} label="테이블 ID"
                placeholder="테이블 ID를 입력하세요"
                rules={{ required: '테이블 ID를 입력하세요' }}
            />
            <CtrlText
                name="tableName" control={control} label="테이블명"
                placeholder="테이블명을 입력하세요"
                rules={{ required: '테이블명을 입력하세요' }}
            />
            <CtrlText
                name="dataCount" control={control} label="자료량(건)"
                placeholder="자료량을 입력하세요"
                type="number"
            />
            <CtrlText
                name="remark" control={control} label="비고"
                placeholder="비고를 입력하세요"
            />
        </div>
    )
}

// ── BaseInfoFeature ───────────────────────────────────────────────────────────
const DRAWER_WIDTH = { detail: 440, register: 500, edit: 500 }
const INIT_SEARCH  = { infoType: '', searchType: 'tableId', searchValue: '' }
const INIT_FORM    = { infoType: '', tableId: '', tableName: '', dataCount: '', remark: '' }

export default function BaseInfoFeature({ onRegister, onEdit, onDelete }) {
    const [search,  setSearch]  = useState(INIT_SEARCH)
    const [applied, setApplied] = useState(INIT_SEARCH)

    const [drawerMode, setDrawerMode] = useState(null)
    const [drawerData, setDrawerData] = useState(null)

    const [confirmOpen,   setConfirmOpen]   = useState(false)
    const [confirmTarget, setConfirmTarget] = useState(null)

    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: INIT_FORM })

    useEffect(() => {
        if (drawerMode === 'register') { reset(INIT_FORM) }
        else if (drawerMode === 'edit' && drawerData) {
            reset({
                infoType:  drawerData.infoType  ?? '',
                tableId:   drawerData.tableId   ?? '',
                tableName: drawerData.tableName ?? '',
                dataCount: drawerData.dataCount != null ? String(drawerData.dataCount) : '',
                remark:    drawerData.remark    ?? '',
            })
        }
    }, [drawerMode, drawerData, reset])

    const { data, isLoading } = useQuery({
        queryKey: ['baseInfo', 'list', applied],
        throwOnError: true,
        queryFn: async () => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // import { baseInfoApi } from '@/services/base/baseInfo/baseInfoService.js'
            // return baseInfoApi.getList(applied)  → { list: [], totalCount: 0 }
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 200))
            const list = BASE_INFO_DATA.filter(row => {
                if (applied.infoType && row.infoType !== applied.infoType) return false
                if (applied.searchValue) {
                    const v = applied.searchValue.toLowerCase()
                    if (applied.searchType === 'tableId'   && !row.tableId.toLowerCase().includes(v))   return false
                    if (applied.searchType === 'tableName' && !row.tableName.toLowerCase().includes(v)) return false
                }
                return true
            })
            return { list, totalCount: list.length }
        },
        staleTime: 1000 * 60,
    })

    const openDetail   = useCallback((row) => {
        if (drawerData?.id === row.id && drawerMode === 'detail') setDrawerMode(null)
        else { setDrawerData(row); setDrawerMode('detail') }
    }, [drawerData, drawerMode])
    const openEdit     = useCallback((row) => { setDrawerData(row); setDrawerMode('edit') }, [])
    const openRegister = useCallback(() => { setDrawerData(null); setDrawerMode('register') }, [])
    const closeDrawer  = useCallback(() => setDrawerMode(null), [])

    const openDeleteConfirm   = useCallback((row) => { setConfirmTarget(row); setConfirmOpen(true) }, [])
    const handleDeleteConfirm = useCallback(async () => {
        await onDelete?.(confirmTarget)
        setConfirmOpen(false); setConfirmTarget(null)
        if (drawerData?.id === confirmTarget?.id) closeDrawer()
    }, [confirmTarget, drawerData, onDelete, closeDrawer])

    const onSubmit = useCallback(async (formValues) => {
        const payload = {
            ...formValues,
            dataCount: formValues.dataCount !== '' ? Number(formValues.dataCount) : null,
        }
        if (drawerMode === 'register') await onRegister?.(payload)
        else if (drawerMode === 'edit') await onEdit?.({ ...drawerData, ...payload })
        closeDrawer()
    }, [drawerMode, drawerData, onRegister, onEdit, closeDrawer])

    const onSearch = () => { setApplied({ ...search }); closeDrawer() }
    const onReset  = () => { setSearch(INIT_SEARCH); setApplied(INIT_SEARCH); closeDrawer() }
    const onExcel  = () => exportBaseInfoExcel(data?.list ?? []).catch(() => toast.error('엑셀 내보내기 중 오류가 발생했습니다.'))

    const colDefs = useMemo(() => [
        {
            field:'infoType', headerName:'정보구분', width:110, flex:0,
            cellRenderer: ({ value }) => <BasicLabel text={value} variant={INFO_TYPE_VARIANT[value] ?? 'default'} />,
        },
        { field:'tableId',    headerName:'테이블 ID',   width:160, flex:0 },
        { field:'tableName',  headerName:'테이블명',    flex:1,    minWidth:140 },
        {
            field:'dataCount', headerName:'자료량(건)', width:120, flex:0,
            cellStyle: { textAlign:'right' },
            valueFormatter: ({ value }) => value != null ? value.toLocaleString() : '-',
        },
        { field:'remark',     headerName:'비고',        flex:1,    minWidth:120 },
        { field:'lastSyncDt', headerName:'최종연계일시', width:165, flex:0 },
        {
            headerName:'상세보기', width:90, flex:0, sortable:false, filter:false,
            cellRenderer: ({ data }) => (
                <GridActionButtons data={data} buttons={[{ type:'detail', onClick: openDetail }]} />
            ),
        },
    ], [openDetail])

    const drawerFooter = useMemo(() => {
        if (drawerMode === 'detail') return (
            <>
                <BasicButton label="수정" icon={Pencil} variant="primary"   size="sm" onClick={() => openEdit(drawerData)} />
                <BasicButton label="삭제" icon={Trash2} variant="danger"    size="sm" onClick={() => { closeDrawer(); openDeleteConfirm(drawerData) }} />
                <BasicButton label="닫기" icon={X}      variant="secondary" size="sm" onClick={closeDrawer} />
            </>
        )
        if (drawerMode === 'register' || drawerMode === 'edit') return (
            <>
                <BasicButton
                    label={isSubmitting ? '저장 중...' : '저장'}
                    icon={isSubmitting ? Loader2 : Save}
                    variant="primary" size="sm" disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                />
                <BasicButton label="취소" icon={X} variant="secondary" size="sm" onClick={closeDrawer} />
            </>
        )
        return null
    }, [drawerMode, drawerData, isSubmitting, handleSubmit, onSubmit, openEdit, openDeleteConfirm, closeDrawer])

    const drawerTitle = drawerMode === 'register' ? '기초정보 등록'
        : drawerMode === 'edit' ? '기초정보 수정'
        : drawerData?.tableName ?? '기초정보 상세'

    return (
        <div className="grid-wrap">
            <SearchForm
                search={search} setSearch={setSearch}
                onSearch={onSearch} onReset={onReset}
                onRegister={openRegister} onExcel={onExcel}
                totalCount={data?.totalCount ?? 0} isLoading={isLoading}
            />
            <div style={{ flex:1, overflow:'hidden', display:'flex' }}>
                <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
                    <BasicGrid
                        mode="paginate" rowData={data?.list ?? []} colDefs={colDefs}
                        onRowClick={openDetail} height="100%" pageSize={20} loading={isLoading}
                        defaultColDef={{ sortable:true, resizable:true, filter:false, minWidth:60, flex:1 }}
                    />
                </div>
                <FormDrawer
                    open={drawerMode !== null} title={drawerTitle}
                    onClose={closeDrawer} footer={drawerFooter}
                    defaultWidth={DRAWER_WIDTH[drawerMode] ?? 440}
                >
                    {drawerMode === 'detail' && <DetailView data={drawerData} />}
                    {(drawerMode === 'register' || drawerMode === 'edit') && (
                        <BaseInfoForm control={control} />
                    )}
                </FormDrawer>
            </div>
            <ConfirmModal
                open={confirmOpen} variant="danger" title="삭제 확인"
                message={`'${confirmTarget?.tableName}' 정보를 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
                confirmText="삭제" onConfirm={handleDeleteConfirm} onCancel={() => setConfirmOpen(false)}
            />
        </div>
    )
}
