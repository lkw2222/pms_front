import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery }           from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import BasicGrid         from '@/components/grid/BasicGrid.jsx'
import GridActionButtons from '@/components/grid/GridActionButtons.jsx'
import FormDrawer        from '@/components/grid/FormDrawer.jsx'
import TextInput         from '@/components/input/TextInput.jsx'
import SelectInput       from '@/components/input/SelectInput.jsx'
import SearchInput       from '@/components/input/SearchInput.jsx'
import Textarea          from '@/components/input/Textarea.jsx'
import BasicButton       from '@/components/button/BasicButton.jsx'
import ConfirmModal      from '@/components/modal/ConfirmModal.jsx'
import { Search, RotateCcw, Plus, Download, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import styles from './LnkPgmStsFeature.module.css'
import BasicLabel from "@/components/label/BasicLabel.jsx";

/**
 * 데이터 연계프로그램 현황 기능 컴포넌트.
 *
 * @author JDJ
 * @since 2026-04-26
 */

// ── 옵션 정의 ─────────────────────────────────────────────────────────────────
const SEARCH_TYPE_OPT = [
    { label: '프로그램 ID',    value: 'pgmId'        },
    { label: '프로그램명',     value: 'pgmName'      },
    { label: '타겟 테이블 ID', value: 'tgtTableId'   },
    { label: '타겟 테이블명',  value: 'tgtTableName' },
]
const SW_TYPE_SEARCH = [
    { label: 'ETL',         value: 'ETL'         },
    { label: 'GIS',          value: 'GIS'          },
    { label: 'API',          value: 'API'          },
    { label: 'DMP',          value: 'DMP'          },
    { label: 'DB Procedure', value: 'DB' },
]
const SW_TYPE_OPTIONS = [
    { label: 'ETL',         value: 'ETL'         },
    { label: 'GIS',          value: 'GIS'          },
    { label: 'API',          value: 'API'          },
    { label: 'DMP',          value: 'DMP'          },
    { label: 'DB Procedure', value: 'DB' },
]

const SW_TYPE_VARIANT = {
    ETL: 'purple'
    , GIS: 'success'
    , API: 'warning'
    , DMP: 'default'
    , DB: 'blue'
}

// ── 샘플 데이터 ───────────────────────────────────────────────────────────────
const LNK_PGM_DATA = [
    { id:1,  swType:'ETL', pgmId:'EI-0001', pgmName:'영배4.0연계 - 설비기본',       srcTableId:'JLT0501', tgtTableId:'JLT0501', tgtTableName:'설비기본',        remark:'' },
    { id:2,  swType:'API', pgmId:'EI-0002', pgmName:'K-GIS연계 - 전주기본정보',     srcTableId:'KBT5101', tgtTableId:'KBT5101', tgtTableName:'전주',            remark:'' },
    { id:3,  swType:'ETL', pgmId:'EI-0003', pgmName:'영배4.0연계 - 전선기본',       srcTableId:'JLT0502', tgtTableId:'JMT7201', tgtTableName:'전선기본',        remark:'' },
    { id:4,  swType:'API', pgmId:'EI-0004', pgmName:'K-GIS연계 - 전선경로정보',     srcTableId:'KBT5201', tgtTableId:'KBT5201', tgtTableName:'전선경로',        remark:'' },
    { id:5,  swType:'ETL', pgmId:'EI-0005', pgmName:'영배4.0연계 - 가공설비기본',   srcTableId:'JLT0503', tgtTableId:'JMT7301', tgtTableName:'가공설비기본',    remark:'' },
    { id:6,  swType:'DMP', pgmId:'EI-0006', pgmName:'DMP연계 - 점검결과정보',       srcTableId:'DMP0101', tgtTableId:'KBT5401', tgtTableName:'점검결과',        remark:'분기별 배치' },
    { id:7,  swType:'DMP', pgmId:'EI-0007', pgmName:'DMP연계 - 사고이력정보',       srcTableId:'DMP0201', tgtTableId:'KBT5501', tgtTableName:'사고이력',        remark:'분기별 배치' },
    { id:8,  swType:'DB', pgmId:'EI-0008', pgmName:'통계집계 - 전주현황', srcTableId:'JMT7101', tgtTableId:'STAT0101', tgtTableName:'전주현황통계',   remark:'일별 자동실행' },
    { id:9,  swType:'API', pgmId:'EI-0009', pgmName:'K-GIS연계 - 행정구역정보',     srcTableId:'KBT5601', tgtTableId:'KBT5601', tgtTableName:'행정구역',        remark:'' },
    { id:10, swType:'ETL', pgmId:'EI-0010', pgmName:'영배4.0연계 - 통신기기기본',   srcTableId:'JLT0504', tgtTableId:'JMT7401', tgtTableName:'통신기기기본',    remark:'' },
]

// ── 검색 폼 ───────────────────────────────────────────────────────────────────
function SearchForm({ search, setSearch, onSearch, onReset, onRegister, totalCount, isLoading }) {
    return (
        <div className="panel-toolbar panel-toolbar-col">
            <div className="panel-search-value" style={{ display:'grid', gridTemplateColumns:'160px 400px', gap:10, alignItems:'end' }}>
                <SelectInput
                    label="SW구분" value={search.swType}
                    onChange={e => setSearch(s => ({ ...s, swType: e.target.value }))}
                    options={SW_TYPE_SEARCH}
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
                    <BasicButton label="등록" icon={Plus} variant="primary" size="sm" onClick={onRegister} />
                </div>
            </div>
        </div>
    )
}

// ── 상세 보기 (읽기 전용) ─────────────────────────────────────────────────────
function DetailView({ data }) {
    if (!data) return null
    const rows = [
        ['SW구분',      data.swType],
        ['프로그램 ID', data.pgmId],
        ['프로그램명',  data.pgmName],
        ['소스 테이블 ID', data.srcTableId],
        ['타겟 테이블 ID', data.tgtTableId],
        ['타겟 테이블명',  data.tgtTableName],
        ['비고',        data.remark],
    ]
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {rows.map(([label, value]) => (
                <div key={label} className="detail-row">
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">
                        {label === 'SW구분'
                            ? <BasicLabel text={value} variant={SW_TYPE_VARIANT[value] ?? 'default'} />
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

function CtrlTextarea({ name, control, label, rules, ...rest }) {
    return (
        <Controller name={name} control={control} rules={rules}
            render={({ field, fieldState }) => (
                <Textarea
                    label={label} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur}
                    isNotNull={!!rules?.required} errorMessage={fieldState.error?.message} rows={4} {...rest}
                />
            )}
        />
    )
}

// ── 등록 / 수정 폼 ───────────────────────────────────────────────────────────
function LnkPgmStsForm({ control }) {
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <CtrlSelect
                name="swType" control={control} label="SW구분"
                options={SW_TYPE_OPTIONS}
                rules={{ required: 'SW구분을 선택하세요' }}
            />
            <CtrlText
                name="pgmId" control={control} label="프로그램 ID"
                placeholder="프로그램 ID를 입력하세요"
                rules={{ required: '프로그램 ID를 입력하세요' }}
            />
            <CtrlText
                name="pgmName" control={control} label="프로그램명"
                placeholder="프로그램명을 입력하세요"
                rules={{ required: '프로그램명을 입력하세요' }}
            />
            <div className={styles.linkInfoWrap}>
                <span className={styles.linkInfoLabel}>연계정보</span>
                <div className={styles.linkInfoFields}>
                    <CtrlText name="srcTableId"   control={control} label="소스 테이블 ID" placeholder="소스 테이블 ID" />
                    <CtrlText name="tgtTableId"   control={control} label="타겟 테이블 ID" placeholder="타겟 테이블 ID" />
                    <CtrlText name="tgtTableName" control={control} label="타겟 테이블명"  placeholder="타겟 테이블명"  />
                </div>
            </div>
            <CtrlTextarea
                name="remark" control={control} label="비고"
                placeholder="비고를 입력하세요"
            />
        </div>
    )
}

// ── LnkPgmStsFeature ─────────────────────────────────────────────────────────
const DRAWER_WIDTH = { detail: 480, register: 560, edit: 560 }
const INIT_SEARCH  = { swType: '', searchType: 'pgmId', searchValue: '' }
const INIT_FORM    = { swType: '', pgmId: '', pgmName: '', srcTableId: '', tgtTableId: '', tgtTableName: '', remark: '' }

export default function LnkPgmStsFeature({ onRegister, onEdit, onDelete }) {
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
                swType:       drawerData.swType       ?? '',
                pgmId:        drawerData.pgmId        ?? '',
                pgmName:      drawerData.pgmName      ?? '',
                srcTableId:   drawerData.srcTableId   ?? '',
                tgtTableId:   drawerData.tgtTableId   ?? '',
                tgtTableName: drawerData.tgtTableName ?? '',
                remark:       drawerData.remark       ?? '',
            })
        }
    }, [drawerMode, drawerData, reset])

    const { data, isLoading } = useQuery({
        queryKey: ['lnkPgmSts', 'list', applied],
        throwOnError: true,
        queryFn: async () => {
            // ── 실제 API 호출 예제 ────────────────────────────────────────────
            // import { lnkPgmStsApi } from '@/services/base/lnkPgmSts/lnkPgmStsService.js'
            // return lnkPgmStsApi.getList(applied)  → { list: [], totalCount: 0 }
            // ─────────────────────────────────────────────────────────────────
            await new Promise(r => setTimeout(r, 200))
            const list = LNK_PGM_DATA.filter(row => {
                if (applied.swType && row.swType !== applied.swType) return false
                if (applied.searchValue) {
                    const v = applied.searchValue.toLowerCase()
                    if (applied.searchType === 'pgmId'        && !row.pgmId.toLowerCase().includes(v))        return false
                    if (applied.searchType === 'pgmName'      && !row.pgmName.toLowerCase().includes(v))      return false
                    if (applied.searchType === 'tgtTableId'   && !row.tgtTableId.toLowerCase().includes(v))   return false
                    if (applied.searchType === 'tgtTableName' && !row.tgtTableName.toLowerCase().includes(v)) return false
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
        if (drawerMode === 'register') await onRegister?.(formValues)
        else if (drawerMode === 'edit') await onEdit?.({ ...drawerData, ...formValues })
        closeDrawer()
    }, [drawerMode, drawerData, onRegister, onEdit, closeDrawer])

    const onSearch = () => { setApplied({ ...search }); closeDrawer() }
    const onReset  = () => { setSearch(INIT_SEARCH); setApplied(INIT_SEARCH); closeDrawer() }

    const colDefs = useMemo(() => [
        {
            field:'swType',       headerName:'SW구분',       width:130, flex:0,
            cellRenderer: ({ value }) => <BasicLabel text={value} variant={SW_TYPE_VARIANT[value] ?? 'default'} />,
        },
        { field:'pgmId',        headerName:'프로그램 ID',  width:130, flex:0 },
        { field:'pgmName',      headerName:'프로그램명',   flex:1,    minWidth:160 },
        { field:'srcTableId',   headerName:'소스 테이블ID', width:130, flex:0 },
        { field:'tgtTableId',   headerName:'타겟 테이블ID', width:130, flex:0 },
        { field:'tgtTableName', headerName:'타겟 테이블명', width:130, flex:0 },
        { field:'remark',       headerName:'비고',          flex:1,    minWidth:100 },
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

    const drawerTitle = drawerMode === 'register' ? '연계프로그램 등록'
        : drawerMode === 'edit' ? '연계프로그램 수정'
        : drawerData?.pgmName ?? '연계프로그램 상세'

    return (
        <div className="grid-wrap">
            <SearchForm
                search={search} setSearch={setSearch}
                onSearch={onSearch} onReset={onReset} onRegister={openRegister}
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
                    defaultWidth={DRAWER_WIDTH[drawerMode] ?? 480}
                >
                    {drawerMode === 'detail' && <DetailView data={drawerData} />}
                    {(drawerMode === 'register' || drawerMode === 'edit') && (
                        <LnkPgmStsForm control={control} />
                    )}
                </FormDrawer>
            </div>
            <ConfirmModal
                open={confirmOpen} variant="danger" title="삭제 확인"
                message={`'${confirmTarget?.pgmName}' 프로그램을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
                confirmText="삭제" onConfirm={handleDeleteConfirm} onCancel={() => setConfirmOpen(false)}
            />
        </div>
    )
}
