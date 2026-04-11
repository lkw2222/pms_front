import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import BasicGrid         from '@/components/grid/BasicGrid.jsx'
import GridActionButtons from '@/components/grid/GridActionButtons.jsx'
import FormDrawer        from '@/components/grid/FormDrawer.jsx'
import TextInput         from '@/components/input/TextInput.jsx'
import SelectInput       from '@/components/input/SelectInput.jsx'
import DateInput         from '@/components/input/DateInput.jsx'
import FileInput         from '@/components/input/FileInput.jsx'
import BasicButton       from '@/components/button/BasicButton.jsx'
import BasicLabel        from '@/components/label/BasicLabel.jsx'
import ConfirmModal      from '@/components/modal/ConfirmModal.jsx'
import { Search, RotateCcw, Plus, Download, FileText, Loader2, Paperclip, Pencil, Trash2, X, Save } from 'lucide-react'
// Download, FileText 는 DetailView 내 파일 목록에서 사용
import { toast } from 'sonner'

// ── 샘플 데이터 ────────────────────────────────────────────────────────────────
const ARCHIVE_DATA = [
  { id:1,  title:'2025년 설비점검 매뉴얼',        category:'기술문서', content:'설비 점검 절차 및 주의사항에 대한 상세 매뉴얼입니다.',         author:'김민준', date:'2025-01-15', files:[{name:'설비점검매뉴얼_v1.pdf',size:'2.4MB'},{name:'점검체크리스트.xlsx',size:'156KB'}] },
  { id:2,  title:'1분기 공지사항',                 category:'공지',     content:'2025년 1분기 주요 공지사항을 안내합니다.',                     author:'이서연', date:'2025-01-20', files:[{name:'1분기공지.pdf',size:'340KB'}] },
  { id:3,  title:'업무보고서 양식',                category:'양식/서식', content:'월간 업무보고서 표준 양식입니다.',                             author:'박지호', date:'2025-02-01', files:[{name:'업무보고서양식.docx',size:'42KB'},{name:'작성가이드.pdf',size:'210KB'}] },
  { id:4,  title:'전기설비 점검 절차서',           category:'기술문서', content:'전기설비 정기점검 절차 및 체크리스트입니다.',                   author:'최수아', date:'2025-02-10', files:[{name:'전기점검절차서.pdf',size:'1.8MB'}] },
  { id:5,  title:'2월 안전교육 자료',              category:'공지',     content:'2월 정기 안전교육 자료입니다. 전 직원 필독 바랍니다.',          author:'정도윤', date:'2025-02-14', files:[{name:'안전교육자료_02월.pptx',size:'5.2MB'},{name:'퀴즈정답.pdf',size:'88KB'}] },
  { id:6,  title:'휴가신청서',                     category:'양식/서식', content:'연차 및 반차 신청 양식입니다.',                                 author:'한지민', date:'2025-02-20', files:[{name:'휴가신청서.xlsx',size:'28KB'}] },
  { id:7,  title:'통신장비 운영 매뉴얼',           category:'기술문서', content:'네트워크 통신장비 운영 및 장애 대응 매뉴얼입니다.',             author:'오승현', date:'2025-03-05', files:[{name:'통신장비매뉴얼.pdf',size:'3.7MB'}] },
  { id:8,  title:'시스템 비밀번호 정책 안내',      category:'공지',     content:'보안 강화를 위한 시스템 비밀번호 변경 정책을 안내합니다.',      author:'임채원', date:'2025-03-10', files:[{name:'비밀번호정책.pdf',size:'120KB'}] },
  { id:9,  title:'출장신청서',                     category:'양식/서식', content:'국내/해외 출장 신청 및 정산 양식입니다.',                       author:'김민준', date:'2025-03-15', files:[{name:'출장신청서.docx',size:'35KB'},{name:'출장정산서.xlsx',size:'29KB'}] },
  { id:10, title:'토목 구조물 점검 지침',          category:'기술문서', content:'교량·터널·옹벽 등 토목 구조물 정기점검 지침서입니다.',          author:'이서연', date:'2025-03-22', files:[{name:'토목점검지침.pdf',size:'4.1MB'}] },
  { id:11, title:'2분기 사업계획 공지',            category:'공지',     content:'2025년 2분기 주요 사업 목표 및 일정을 공지합니다.',             author:'박지호', date:'2025-04-01', files:[{name:'2분기사업계획.pdf',size:'890KB'}] },
  { id:12, title:'물품구매 요청서',                category:'양식/서식', content:'비품 및 소모품 구매 요청 양식입니다.',                          author:'최수아', date:'2025-04-08', files:[{name:'물품구매요청서.xlsx',size:'31KB'}] },
  { id:13, title:'GIS 시스템 사용자 매뉴얼',       category:'기술문서', content:'공간정보 시스템(GIS) 사용법 및 기능 설명서입니다.',             author:'정도윤', date:'2025-04-12', files:[{name:'GIS매뉴얼_v2.pdf',size:'6.8MB'},{name:'FAQ.docx',size:'115KB'}] },
  { id:14, title:'개인정보 보호 지침',             category:'공지',     content:'개인정보 처리 방침 및 임직원 준수사항을 안내합니다.',           author:'한지민', date:'2025-04-18', files:[{name:'개인정보보호지침.pdf',size:'260KB'}] },
  { id:15, title:'회의록 양식',                    category:'양식/서식', content:'주간·월간·임시 회의록 표준 작성 양식입니다.',                   author:'오승현', date:'2025-04-25', files:[{name:'회의록양식.docx',size:'24KB'}] },
]

const CATEGORY_OPTIONS = [
  { label:'공지',     value:'공지'     },
  { label:'기술문서', value:'기술문서' },
  { label:'양식/서식', value:'양식/서식' },
  { label:'기타',     value:'기타'     },
]
const CATEGORY_VARIANT = { 공지:'info', 기술문서:'purple', '양식/서식':'success', 기타:'default' }


// ── 검색 폼 ───────────────────────────────────────────────────────────────────
function SearchForm({ search, setSearch, onSearch, onReset, onRegister, totalCount, isLoading }) {
  return (
    <div className="panel-toolbar" style={{ flexDirection:'column', alignItems:'flex-start', gap:10 }}>
      <div className="panel-search-value" style={{ display:'grid', gridTemplateColumns:'200px 140px 160px 160px', gap:10, alignItems:'end' }}>
        <TextInput
          label="제목" placeholder="제목 검색"
          value={search.title}
          onChange={e => setSearch(s => ({ ...s, title: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
        />
        <SelectInput
          label="분류" value={search.category}
          onChange={e => setSearch(s => ({ ...s, category: e.target.value }))}
          options={CATEGORY_OPTIONS}
        />
        <DateInput
          label="등록일(시작)" value={search.dateFrom}
          onChange={v => setSearch(s => ({ ...s, dateFrom: v }))}
        />
        <DateInput
          label="등록일(종료)" value={search.dateTo}
          onChange={v => setSearch(s => ({ ...s, dateTo: v }))}
        />
      </div>
      <div className="panel-search-function" style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:8, width:'100%' }}>
        <div style={{ justifySelf:'start', fontSize:13, color:'var(--color-text-muted)', position:'relative', top:5 }}>
          {isLoading
            ? <span style={{ color:'var(--color-danger-total)' }}>조회 중...</span>
            : <>총 <strong style={{ color:'var(--color-danger-total)' }}>{totalCount.toLocaleString()}</strong>건</>
          }
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <BasicButton label="초기화" icon={RotateCcw}                    variant="secondary" onClick={onReset} />
          <BasicButton label="조회"   icon={isLoading ? Loader2 : Search} variant="primary"   onClick={onSearch} disabled={isLoading} />
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <BasicButton label="등록" icon={Plus} variant="primary" size="sm" onClick={onRegister} />
        </div>
      </div>
    </div>
  )
}

// ── 상세 보기 (읽기 전용) ──────────────────────────────────────────────────────
function DetailView({ data }) {
  if (!data) return null
  const rows = [
    ['제목',  data.title],
    ['분류',  data.category],
    ['작성자', data.author],
    ['등록일', data.date],
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      {rows.map(([label, value]) => (
        <div key={label} style={{
          display:'grid', gridTemplateColumns:'80px 1fr',
          padding:'10px 0', borderBottom:'1px solid var(--color-border)',
          fontSize:13, gap:12,
        }}>
          <span style={{ color:'var(--color-text-muted)', fontWeight:500, fontSize:12 }}>{label}</span>
          <span style={{ color:'var(--color-text-primary)', wordBreak:'break-all' }}>
            {label === '분류'
              ? <BasicLabel text={value} variant={CATEGORY_VARIANT[value] ?? 'default'} />
              : (value ?? '—')
            }
          </span>
        </div>
      ))}

      {/* 내용 */}
      <div style={{ padding:'10px 0', borderBottom:'1px solid var(--color-border)' }}>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', fontWeight:500, marginBottom:6 }}>내용</div>
        <div style={{
          fontSize:13, color:'var(--color-text-primary)', lineHeight:1.6,
          background:'var(--color-bg-tertiary)', borderRadius:'var(--radius-md)',
          padding:'10px 12px', border:'1px solid var(--color-border)',
          whiteSpace:'pre-wrap',
        }}>
          {data.content || '—'}
        </div>
      </div>

      {/* 첨부 파일 */}
      <div style={{ padding:'10px 0' }}>
        <div style={{ fontSize:12, color:'var(--color-text-muted)', fontWeight:500, marginBottom:8 }}>
          <Paperclip size={11} style={{ display:'inline', marginRight:4 }} />
          첨부 파일 ({data.files?.length ?? 0}개)
        </div>
        {data.files?.length ? (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {data.files.map((f, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'8px 12px', borderRadius:'var(--radius-md)',
                background:'var(--color-bg-tertiary)', border:'1px solid var(--color-border)',
              }}>
                <FileText size={13} style={{ color:'var(--color-accent)', flexShrink:0 }} />
                <span style={{ flex:1, fontSize:12, color:'var(--color-text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {f.name}
                </span>
                <span style={{ fontSize:11, color:'var(--color-text-muted)', flexShrink:0 }}>{f.size}</span>
                <button
                  onClick={() => toast.info(`"${f.name}" 다운로드를 시작합니다.`)}
                  style={{
                    display:'flex', alignItems:'center', gap:4,
                    padding:'3px 8px', borderRadius:'var(--radius-md)',
                    border:'1px solid var(--color-border)', background:'transparent',
                    cursor:'pointer', fontSize:11, color:'var(--color-text-secondary)',
                    transition:'all .12s', flexShrink:0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--color-accent)'; e.currentTarget.style.color='var(--color-accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.color='var(--color-text-secondary)' }}
                >
                  <Download size={10} /> 다운로드
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize:12, color:'var(--color-text-muted)' }}>첨부 파일이 없습니다.</div>
        )}
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
          label={label}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isNotNull={!!rules?.required}
          errorMessage={fieldState.error?.message}
          {...rest}
        />
      )}
    />
  )
}

function CtrlSelect({ name, control, label, rules, options, ...rest }) {
  return (
    <Controller name={name} control={control} rules={rules}
      render={({ field, fieldState }) => (
        <SelectInput
          label={label}
          value={field.value ?? ''}
          onChange={field.onChange}
          isNotNull={!!rules?.required}
          options={options}
          {...rest}
        />
      )}
    />
  )
}

// ── 등록 / 수정 폼 ────────────────────────────────────────────────────────────
function ArchiveForm({ control, files, onFilesChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <CtrlText
        name="title" control={control} label="제목"
        placeholder="제목을 입력하세요"
        rules={{ required: '제목을 입력하세요' }}
      />
      <CtrlSelect
        name="category" control={control} label="분류"
        options={CATEGORY_OPTIONS}
        rules={{ required: '분류를 선택하세요' }}
      />
      <CtrlText
        name="author" control={control} label="작성자"
        placeholder="작성자명을 입력하세요"
        rules={{ required: '작성자를 입력하세요' }}
      />

      {/* 내용 — 별도 textarea */}
      <Controller name="content" control={control}
        render={({ field }) => (
          <div>
            <div style={{ fontSize:12, color:'var(--color-text-secondary)', fontWeight:500, marginBottom:5 }}>내용</div>
            <textarea
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="내용을 입력하세요"
              rows={5}
              style={{
                width:'100%', boxSizing:'border-box',
                padding:'8px 10px', fontSize:13, lineHeight:1.6,
                color:'var(--color-text-primary)',
                background:'var(--color-bg-primary)',
                border:'1px solid var(--color-border)',
                borderRadius:'var(--radius-md)',
                resize:'vertical', outline:'none',
                fontFamily:'inherit',
                transition:'border-color .15s',
              }}
              onFocus={e => e.target.style.borderColor='var(--color-accent)'}
              onBlur={e => { field.onBlur(); e.target.style.borderColor='var(--color-border)' }}
            />
          </div>
        )}
      />

      {/* 파일 첨부 */}
      <FileInput
        label="첨부 파일"
        onChange={onFilesChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.zip,.png,.jpg"
        multiple
      />
    </div>
  )
}

// ── ArchiveFeature ────────────────────────────────────────────────────────────
const DRAWER_WIDTH = { detail: 440, register: 600, edit: 600 }
const INIT_SEARCH  = { title:'', category:'', dateFrom:'', dateTo:'' }
const INIT_FORM    = { title:'', category:'', author:'', content:'' }

export default function ArchiveFeature({ onRegister, onEdit, onDelete }) {
  // ── 검색 상태 ─────────────────────────────────────────────────────────────
  const [search,  setSearch]  = useState(INIT_SEARCH)
  const [applied, setApplied] = useState(INIT_SEARCH)

  // ── 드로어 상태 ───────────────────────────────────────────────────────────
  // drawerMode: null | 'detail' | 'register' | 'edit'
  const [drawerMode, setDrawerMode] = useState(null)
  const [drawerData, setDrawerData] = useState(null)
  const [formFiles,  setFormFiles]  = useState([])

  // ── 삭제 확인 모달 ────────────────────────────────────────────────────────
  const [confirmOpen,   setConfirmOpen]   = useState(false)
  const [confirmTarget, setConfirmTarget] = useState(null)

  // ── react-hook-form ───────────────────────────────────────────────────────
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: INIT_FORM,
  })

  // 드로어 모드 변경 시 폼 초기화
  useEffect(() => {
    if (drawerMode === 'register') {
      reset(INIT_FORM)
      setFormFiles([])
    } else if (drawerMode === 'edit' && drawerData) {
      reset({
        title:    drawerData.title    ?? '',
        category: drawerData.category ?? '',
        author:   drawerData.author   ?? '',
        content:  drawerData.content  ?? '',
      })
      setFormFiles([])
    }
  }, [drawerMode, drawerData, reset])

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey:     ['archive', 'list', applied],
    throwOnError: true,
    queryFn:      async () => {
      // ── 실제 API 호출 예제 ────────────────────────────────────────────
      // import { archiveApi } from '@/services/archive/archiveService.js'
      // return archiveApi.getList(applied)
      // → 반환값: { list: [], totalCount: 0 }
      // ─────────────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 200))
      const list = ARCHIVE_DATA.filter(row => {
        if (applied.title    && !row.title.includes(applied.title))   return false
        if (applied.category && row.category !== applied.category)     return false
        if (applied.dateFrom && row.date < applied.dateFrom)           return false
        if (applied.dateTo   && row.date > applied.dateTo)             return false
        return true
      })
      return { list, totalCount: list.length }
    },
    staleTime: 1000 * 60,
  })

  // ── 드로어 열기/닫기 ──────────────────────────────────────────────────────
  const openDetail = useCallback((row) => {
    if (drawerData?.id === row.id && drawerMode === 'detail') {
      setDrawerMode(null)
    } else {
      setDrawerData(row)
      setDrawerMode('detail')
    }
  }, [drawerData, drawerMode])

  const openEdit = useCallback((row) => {
    setDrawerData(row)
    setDrawerMode('edit')
  }, [])

  const openRegister = useCallback(() => {
    setDrawerData(null)
    setDrawerMode('register')
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerMode(null)
  }, [])

  // ── 삭제 ─────────────────────────────────────────────────────────────────
  const openDeleteConfirm = useCallback((row) => {
    setConfirmTarget(row)
    setConfirmOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    await onDelete?.(confirmTarget)
    setConfirmOpen(false)
    setConfirmTarget(null)
    if (drawerData?.id === confirmTarget?.id) closeDrawer()
  }, [confirmTarget, drawerData, onDelete, closeDrawer])

  // ── 폼 제출 ───────────────────────────────────────────────────────────────
  const onSubmit = useCallback(async (formValues) => {
    const payload = { ...formValues, files: formFiles }
    if (drawerMode === 'register') {
      await onRegister?.(payload)
    } else if (drawerMode === 'edit') {
      await onEdit?.({ ...drawerData, ...payload })
    }
    closeDrawer()
  }, [drawerMode, drawerData, formFiles, onRegister, onEdit, closeDrawer])

  // ── 검색 ─────────────────────────────────────────────────────────────────
  const onSearch = () => { setApplied({ ...search }); closeDrawer() }
  const onReset  = () => { setSearch(INIT_SEARCH); setApplied(INIT_SEARCH); closeDrawer() }

  // ── 컬럼 정의 ─────────────────────────────────────────────────────────────
  const colDefs = useMemo(() => [
    { field:'id',       headerName:'No',   width:55,  flex:0 },
    { field:'title',    headerName:'제목', flex:1, minWidth:140 },
    {
      field:'category', headerName:'분류', width:90, flex:0,
      cellRenderer: ({ value }) => <BasicLabel text={value} variant={CATEGORY_VARIANT[value] ?? 'default'} />,
    },
    {
      field:'files', headerName:'파일', width:70, flex:0,
      sortable:false, filter:false,
      cellRenderer: ({ value }) => (
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, color: value?.length ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
          <Paperclip size={11} />
          {value?.length ?? 0}
        </span>
      ),
    },
    { field:'author', headerName:'작성자', width:80,  flex:0 },
    { field:'date',   headerName:'등록일', width:105, flex:0 },
    {
      headerName:'액션', width:70, flex:0, sortable:false, filter:false,
      cellRenderer: ({ data }) => (
        <GridActionButtons
          data={data}
          buttons={[
            { type:'detail', onClick: openDetail },
          ]}
        />
      ),
    },
  ], [openDetail])

  // ── 드로어 푸터 ───────────────────────────────────────────────────────────
  const drawerFooter = useMemo(() => {
    if (drawerMode === 'detail') return (
      <>
        <BasicButton label="수정"  icon={Pencil} variant="primary"   size="sm" onClick={() => openEdit(drawerData)} />
        <BasicButton label="삭제"  icon={Trash2} variant="danger"    size="sm" onClick={() => { closeDrawer(); openDeleteConfirm(drawerData) }} />
        <BasicButton label="닫기"  icon={X}      variant="secondary" size="sm" onClick={closeDrawer} />
      </>
    )
    if (drawerMode === 'register' || drawerMode === 'edit') return (
      <>
        <BasicButton
          label={isSubmitting ? '저장 중...' : '저장'}
          icon={isSubmitting ? Loader2 : Save}
          variant="primary" size="sm"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        />
        <BasicButton label="취소" icon={X} variant="secondary" size="sm" onClick={closeDrawer} />
      </>
    )
    return null
  }, [drawerMode, drawerData, isSubmitting, handleSubmit, onSubmit, openEdit, openDeleteConfirm, closeDrawer])

  const drawerTitle = drawerMode === 'register' ? '자료 등록'
    : drawerMode === 'edit' ? '자료 수정'
    : drawerData?.title ?? '자료 상세'

  return (
    <div className="grid-wrap" style={{ display:'flex', flexDirection:'column', height:'100%' }}>

      <SearchForm
        search={search} setSearch={setSearch}
        onSearch={onSearch} onReset={onReset} onRegister={openRegister}
        totalCount={data?.totalCount ?? 0}
        isLoading={isLoading}
      />

      {/* 그리드 + 드로어 */}
      <div style={{ flex:1, overflow:'hidden', display:'flex' }}>
        <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
          <BasicGrid
            mode="paginate"
            rowData={data?.list ?? []}
            colDefs={colDefs}
            onRowClick={openDetail}
            height="100%"
            pageSize={20}
            loading={isLoading}
          />
        </div>

        <FormDrawer
          open={drawerMode !== null}
          title={drawerTitle}
          onClose={closeDrawer}
          footer={drawerFooter}
          defaultWidth={DRAWER_WIDTH[drawerMode] ?? 440}
        >
          {drawerMode === 'detail' && <DetailView data={drawerData} />}
          {(drawerMode === 'register' || drawerMode === 'edit') && (
            <ArchiveForm
              control={control}
              files={formFiles}
              onFilesChange={setFormFiles}
            />
          )}
        </FormDrawer>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        open={confirmOpen}
        variant="danger"
        title="삭제 확인"
        message={`'${confirmTarget?.title}' 자료를 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
        confirmText="삭제"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
