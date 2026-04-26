import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery }            from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import BasicGrid         from '@/components/grid/BasicGrid.jsx'
import GridActionButtons from '@/components/grid/GridActionButtons.jsx'
import FormDrawer        from '@/components/grid/FormDrawer.jsx'
import TextInput         from '@/components/input/TextInput.jsx'
import SelectInput       from '@/components/input/SelectInput.jsx'
import SearchInput       from '@/components/input/SearchInput.jsx'
import BasicButton       from '@/components/button/BasicButton.jsx'
import ConfirmModal      from '@/components/modal/ConfirmModal.jsx'
import { Search, RotateCcw, Plus, Download, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import styles from './SccEvalGrdMngFeature.module.css'

/**
 * SCC 평가등급 코드관리 기능 컴포넌트.
 * UI-PMS-INF-14M
 *
 * @author JDJ
 * @since 2026-04-27
 */

// ── 옵션 정의 ─────────────────────────────────────────────────────────────────
const SEARCH_TYPE_OPT = [
    { label: '등급코드',   value: 'gradeCode' },
    { label: '등급코드명', value: 'gradeNm'   },
]
const USE_YN_OPT = [
    { label: 'Y', value: 'Y' },
    { label: 'N', value: 'N' },
]

// ── 샘플 데이터 ───────────────────────────────────────────────────────────────
const EVAL_GRD_DATA = [
    { id:1, gradeCode:'S', gradeNm:'즉시위험', scoreFr:90,  scoreTo:100, diagCost:1000000, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { id:2, gradeCode:'A', gradeNm:'고위험',   scoreFr:75,  scoreTo:89,  diagCost:900000,  useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { id:3, gradeCode:'B', gradeNm:'중위험',   scoreFr:65,  scoreTo:74,  diagCost:800000,  useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { id:4, gradeCode:'C', gradeNm:'주의',     scoreFr:60,  scoreTo:64,  diagCost:700000,  useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { id:5, gradeCode:'D', gradeNm:'저위험',   scoreFr:50,  scoreTo:59,  diagCost:500000,  useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { id:6, gradeCode:'E', gradeNm:'정기진단', scoreFr:0,   scoreTo:49,  diagCost:100000,  useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
]

// ── SearchForm ────────────────────────────────────────────────────────────────
function SearchForm({ search, setSearch, onSearch, onReset, onRegister, onExcel, totalCount, isLoading }) {
    return (
        <div className="panel-toolbar panel-toolbar-col">
            <div className="panel-search-value" style={{ display:'grid', gridTemplateColumns:'360px', gap:10, alignItems:'end' }}>
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
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <BasicButton label="초기화"       icon={RotateCcw}                    variant="secondary" onClick={onReset} />
                    <BasicButton label="조회"         icon={isLoading ? Loader2 : Search} variant="primary"   onClick={onSearch} disabled={isLoading} />
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
                    <BasicButton label="엑셀다운로드" icon={Download} variant="secondary" size="sm" onClick={onExcel} />
                    <BasicButton label="신규등록"     icon={Plus}     variant="primary"   size="sm" onClick={onRegister} />
                </div>
            </div>
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
function CtrlSelect({ name, control, label, rules, options, readOnly, ...rest }) {
    return (
        <Controller name={name} control={control} rules={readOnly ? undefined : rules}
            render={({ field }) => (
                <SelectInput
                    label={label} value={field.value ?? ''} onChange={readOnly ? () => {} : field.onChange}
                    isNotNull={!readOnly && !!rules?.required} options={options} disabled={readOnly} {...rest}
                />
            )}
        />
    )
}

// ── 상세 보기 (읽기 전용) ─────────────────────────────────────────────────────
function DetailView({ data }) {
    if (!data) return null
    const rows = [
        ['등급코드',         data.gradeCode],
        ['등급코드명',       data.gradeNm],
        ['최종산출점수(FR)', data.scoreFr],
        ['최종산출점수(TO)', data.scoreTo],
        ['진단비용(개)',     data.diagCost?.toLocaleString()],
        ['적용유무',         data.useYn],
        ['최종수정자',       data.lastModUser],
        ['최종수정일시',     data.lastModDt],
    ]
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {rows.map(([label, value]) => (
                <div key={label} className="detail-row">
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">{value ?? '—'}</span>
                </div>
            ))}
        </div>
    )
}

// ── 등록 / 수정 폼 ────────────────────────────────────────────────────────────
function EvalGrdForm({ control, mode, data }) {
    return (
        <div className={styles.formGrid}>
            <div className={styles.formRow2}>
                <CtrlText
                    name="gradeCode" control={control} label="등급코드"
                    placeholder="예: S" rules={{ required:'등급코드를 입력하세요' }}
                    readOnly={mode === 'edit'}
                />
                <CtrlText
                    name="gradeNm" control={control} label="등급코드명"
                    placeholder="예: 즉시위험" rules={{ required:'등급코드명을 입력하세요' }}
                />
            </div>
            <div className={styles.formRow2}>
                <CtrlText
                    name="scoreFr" control={control} label="최종산출점수(FR)"
                    placeholder="이상" type="number" rules={{ required:'FR 점수를 입력하세요' }}
                />
                <CtrlText
                    name="scoreTo" control={control} label="최종산출점수(TO)"
                    placeholder="미만" type="number" rules={{ required:'TO 점수를 입력하세요' }}
                />
            </div>
            <CtrlText
                name="diagCost" control={control} label="진단비용(개)"
                placeholder="개당 진단비용 (원)" type="number"
                rules={{ required:'진단비용을 입력하세요' }}
            />
            <CtrlSelect
                name="useYn" control={control} label="적용유무"
                options={USE_YN_OPT} rules={{ required:'적용유무를 선택하세요' }}
            />
            {mode === 'edit' && data && (
                <div className={styles.formRow2}>
                    <div className={styles.readOnlyRow}>
                        <span className={styles.readOnlyLabel}>최종수정자</span>
                        <span className={styles.readOnlyValue}>{data.lastModUser ?? '—'}</span>
                    </div>
                    <div className={styles.readOnlyRow}>
                        <span className={styles.readOnlyLabel}>최종수정일시</span>
                        <span className={styles.readOnlyValue}>{data.lastModDt ?? '—'}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── SccEvalGrdMngFeature ──────────────────────────────────────────────────────
const DRAWER_WIDTH = { detail: 420, register: 480, edit: 480 }
const INIT_SEARCH  = { searchType: 'gradeCode', searchValue: '' }
const INIT_FORM    = { gradeCode: '', gradeNm: '', scoreFr: '', scoreTo: '', diagCost: '', useYn: 'Y' }

export default function SccEvalGrdMngFeature({ onRegister, onEdit, onDelete, onUseYnChange }) {
    const [search,  setSearch]  = useState(INIT_SEARCH)
    const [applied, setApplied] = useState(INIT_SEARCH)

    const [drawerMode, setDrawerMode] = useState(null)
    const [drawerData, setDrawerData] = useState(null)

    const [confirmOpen,   setConfirmOpen]   = useState(false)
    const [confirmTarget, setConfirmTarget] = useState(null)

    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: INIT_FORM })

    // 드로어 모드 변경 시 폼 초기화
    useEffect(() => {
        if (drawerMode === 'register') {
            reset(INIT_FORM)
        } else if (drawerMode === 'edit' && drawerData) {
            reset({
                gradeCode: drawerData.gradeCode ?? '',
                gradeNm:   drawerData.gradeNm   ?? '',
                scoreFr:   drawerData.scoreFr   != null ? String(drawerData.scoreFr) : '',
                scoreTo:   drawerData.scoreTo   != null ? String(drawerData.scoreTo) : '',
                diagCost:  drawerData.diagCost  != null ? String(drawerData.diagCost) : '',
                useYn:     drawerData.useYn     ?? 'Y',
            })
        }
    }, [drawerMode, drawerData, reset])

    // 데이터 조회
    const { data, isLoading } = useQuery({
        queryKey: ['sccEvalGrd', 'list', applied],
        throwOnError: true,
        queryFn: async () => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // import { sccEvalGrdApi } from '@/services/base/sccEvalGrdMng/sccEvalGrdMngService.js'
            // return sccEvalGrdApi.getList(applied)  → { list: [], totalCount: 0 }
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 200))
            const list = EVAL_GRD_DATA.filter(row => {
                if (!applied.searchValue) return true
                const v = applied.searchValue.toLowerCase()
                if (applied.searchType === 'gradeCode' && !row.gradeCode.toLowerCase().includes(v)) return false
                if (applied.searchType === 'gradeNm'   && !row.gradeNm.toLowerCase().includes(v))   return false
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
            scoreFr:  formValues.scoreFr  !== '' ? Number(formValues.scoreFr)  : null,
            scoreTo:  formValues.scoreTo  !== '' ? Number(formValues.scoreTo)  : null,
            diagCost: formValues.diagCost !== '' ? Number(formValues.diagCost) : null,
        }
        if (drawerMode === 'register') await onRegister?.(payload)
        else if (drawerMode === 'edit') await onEdit?.({ ...drawerData, ...payload })
        closeDrawer()
    }, [drawerMode, drawerData, onRegister, onEdit, closeDrawer])

    const onSearch = () => { setApplied({ ...search }); closeDrawer() }
    const onReset  = () => { setSearch(INIT_SEARCH); setApplied(INIT_SEARCH); closeDrawer() }
    const onExcel  = () => toast.info('엑셀 다운로드 기능은 준비 중입니다.')

    // 적용여부 인라인 변경
    const handleUseYnChange = useCallback(async (row, value) => {
        await onUseYnChange?.({ ...row, useYn: value })
    }, [onUseYnChange])

    // 컬럼 정의
    const colDefs = useMemo(() => [
        { field:'gradeCode', headerName:'등급코드',          width:90,  flex:0 },
        { field:'gradeNm',   headerName:'등급코드명',        width:110, flex:0 },
        { field:'scoreFr',   headerName:'최종산출점수(FR)',  width:140, flex:0, type:'numericColumn' },
        { field:'scoreTo',   headerName:'최종산출점수(TO)',  width:140, flex:0, type:'numericColumn' },
        { field:'useYn', headerName:'적용여부', width:100, flex:0 },
        {
            field:'diagCost', headerName:'진단비용(개)', flex:1, minWidth:120, type:'numericColumn',
            valueFormatter: ({ value }) => value != null ? value.toLocaleString() : '',
        },
        { field:'lastModUser', headerName:'최종수정자',  width:100, flex:0 },
        { field:'lastModDt',   headerName:'최종수정일',  width:160, flex:0 },
        {
            headerName:'상세보기', width:90, flex:0, sortable:false, filter:false,
            cellRenderer: ({ data: row }) => (
                <GridActionButtons data={row} buttons={[{ type:'detail', onClick: openDetail }]} />
            ),
        },
    ], [openDetail, handleUseYnChange])

    // 드로어 푸터
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
                <BasicButton label="닫기" icon={X} variant="secondary" size="sm" onClick={closeDrawer} />
            </>
        )
        return null
    }, [drawerMode, drawerData, isSubmitting, handleSubmit, onSubmit, openEdit, openDeleteConfirm, closeDrawer])

    const drawerTitle = drawerMode === 'register' ? '평가등급 등록'
        : drawerMode === 'edit' ? '평가등급 수정'
        : drawerData?.gradeNm ? `${drawerData.gradeCode} - ${drawerData.gradeNm}`
        : '평가등급 상세'

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
                    defaultWidth={DRAWER_WIDTH[drawerMode] ?? 420}
                >
                    {drawerMode === 'detail' && <DetailView data={drawerData} />}
                    {(drawerMode === 'register' || drawerMode === 'edit') && (
                        <EvalGrdForm control={control} mode={drawerMode} data={drawerData} />
                    )}
                </FormDrawer>
            </div>
            <ConfirmModal
                open={confirmOpen} variant="danger" title="삭제 확인"
                message={`'${confirmTarget?.gradeCode} - ${confirmTarget?.gradeNm}' 등급을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
                confirmText="삭제" onConfirm={handleDeleteConfirm} onCancel={() => setConfirmOpen(false)}
            />
        </div>
    )
}
