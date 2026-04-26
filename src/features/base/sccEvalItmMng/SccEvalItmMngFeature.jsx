/**
 * SCC 평가인자관리 기능 컴포넌트.
 * 대분류 → 중분류 → 소분류 계층형 트리 + 우측 고정 분할 패널.
 * UI-PMS-INF-10M / 11M / 12M / 13M 통합
 *
 * @author JDJ
 * @since 2026-04-26
 */
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import SelectInput  from '@/components/input/SelectInput.jsx'
import TextInput    from '@/components/input/TextInput.jsx'
import BasicButton  from '@/components/button/BasicButton.jsx'
import ConfirmModal from '@/components/modal/ConfirmModal.jsx'
import {
    Search, X, Plus, Pencil, Trash2, Save, Loader2, RotateCcw,
    ChevronRight, ChevronDown,
    Layers, Tag, Minus,
    ChevronsDownUp, ChevronsUpDown, // 토글 버튼에서 상태에 따라 전환 사용
    MousePointerClick,
} from 'lucide-react'
import { toast } from 'sonner'
import styles from './SccEvalItmMngFeature.module.css'

// ── 샘플 데이터 ───────────────────────────────────────────────────────────────
const MAJOR_DATA = [
    { majorCode:'A', name:'구조안전성', reflectRate:40, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'B', name:'하중외력',   reflectRate:30, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'C', name:'환경부식',   reflectRate:20, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'D', name:'운영이력',   reflectRate:10, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
]
const MID_DATA = [
    { majorCode:'A', midCode:'01', name:'노후도',     weight:25, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'02', name:'물리적손상', weight:25, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'03', name:'기울기',     weight:15, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'04', name:'기초안전',   weight:15, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'05', name:'전주종류',   weight:10, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'06', name:'재료특성',   weight:10, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'B', midCode:'01', name:'풍압하중',   weight:40, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'B', midCode:'02', name:'빙설하중',   weight:30, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'B', midCode:'03', name:'전선장력',   weight:30, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'C', midCode:'01', name:'염해',       weight:50, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'C', midCode:'02', name:'산성부식',   weight:50, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'D', midCode:'01', name:'사고이력',   weight:60, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'D', midCode:'02', name:'정전이력',   weight:40, useYn:'Y', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
]
const MINOR_DATA = [
    { majorCode:'A', midCode:'01', minorCode:'01', name:'전주 제작 경과년수',           indicatorType:'R', detailInfo:'경년년수',  useYn:'Y', remark:'전주 기본정보 참고', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'02', minorCode:'01', name:'균열·박리·철근노출',           indicatorType:'C', detailInfo:'균열 여부', useYn:'Y', remark:'', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'02', minorCode:'02', name:'도장 손상·박리',               indicatorType:'C', detailInfo:'박리 유무', useYn:'Y', remark:'', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'03', minorCode:'01', name:'부식환경을 통한 전주 경사도',  indicatorType:'R', detailInfo:'전주기울기(경사도)', useYn:'Y', remark:'', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'04', minorCode:'01', name:'HI점수',                       indicatorType:'R', detailInfo:'전주HI점수', useYn:'Y', remark:'', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'05', minorCode:'01', name:'전주종류별 산정기준',           indicatorType:'R', detailInfo:'전주종류', useYn:'Y', remark:'', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'A', midCode:'06', minorCode:'01', name:'재료특성별 산정기준',           indicatorType:'R', detailInfo:'재료특성', useYn:'Y', remark:'', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'B', midCode:'01', minorCode:'01', name:'풍속구역별 풍압 산정',         indicatorType:'R', detailInfo:'풍압하중', useYn:'Y', remark:'', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'B', midCode:'02', minorCode:'01', name:'적설량 기반 빙설 하중',        indicatorType:'R', detailInfo:'빙설하중', useYn:'Y', remark:'', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
    { majorCode:'D', midCode:'01', minorCode:'01', name:'고장·사고 이력 횟수',          indicatorType:'R', detailInfo:'사고횟수', useYn:'Y', remark:'', lastModUser:'김용성', lastModDt:'2026-04-03 16:00:30' },
]

// 소분류별 점수룰 샘플 데이터
const DEFAULT_SCORE_RULES = [
    { id:1, grade:'A', content:'양호',    score:0,   fromVal:null, toVal:3.0,  yv40Map:'A' },
    { id:2, grade:'B', content:'경미',    score:10,  fromVal:3.0,  toVal:5.0,  yv40Map:'B' },
    { id:3, grade:'C', content:'주의',    score:30,  fromVal:5.0,  toVal:8.0,  yv40Map:'C' },
    { id:4, grade:'D', content:'불량',    score:50,  fromVal:8.0,  toVal:13.0, yv40Map:'D' },
    { id:5, grade:'E', content:'위험',    score:70,  fromVal:13.0, toVal:20.0, yv40Map:'E' },
    { id:6, grade:'F', content:'매우위험', score:100, fromVal:20.0, toVal:null, yv40Map:'F' },
]

// ── 옵션 ──────────────────────────────────────────────────────────────────────
const USE_YN_OPT = [{ label:'Y', value:'Y' }, { label:'N', value:'N' }]
const INDICATOR_OPT = [
    { label:'C - 여부/유무 판단', value:'C' },
    { label:'R - 점수구간 (FROM~TO)', value:'R' },
]
const MAJOR_SEARCH_OPT = [{ label:'전체', value:'' }, ...MAJOR_DATA.map(m => ({ label:`${m.majorCode} - ${m.name}`, value:m.majorCode }))]
const MAJOR_FORM_OPT   = MAJOR_DATA.map(m => ({ label:`${m.majorCode} - ${m.name}`, value:m.majorCode }))

// ── 레벨 설정 ─────────────────────────────────────────────────────────────────
const LEVEL_ICON  = { major: Layers, mid: Tag, minor: Minus }
const LEVEL_COLOR = {
    major: 'var(--color-primary)',   // 파랑
    mid:   '#8b5cf6',                // 보라
    minor: 'var(--color-success, #22c55e)', // 초록
}
const LEVEL_INDENT = { major: 4, mid: 22, minor: 40 }
const LEVEL_BADGE_STYLE = {
    major: { background:'color-mix(in srgb, var(--color-primary) 12%, transparent)', color:'var(--color-primary)' },
    mid:   { background:'color-mix(in srgb, #8b5cf6 12%, transparent)',              color:'#8b5cf6'              },
}

// ── 트리 빌더 ─────────────────────────────────────────────────────────────────
function buildTree(majors, mids, minors) {
    return majors.map(maj => ({
        ...maj,
        id:    `M_${maj.majorCode}`,
        type:  'major',
        label: `${maj.majorCode} - ${maj.name}`,
        children: mids.filter(m => m.majorCode === maj.majorCode).map(mid => ({
            ...mid,
            id:    `D_${mid.majorCode}_${mid.midCode}`,
            type:  'mid',
            label: `${mid.midCode} - ${mid.name}`,
            children: minors.filter(n => n.majorCode === mid.majorCode && n.midCode === mid.midCode).map(minor => ({
                ...minor,
                id:       `S_${minor.majorCode}_${minor.midCode}_${minor.minorCode}`,
                type:     'minor',
                label:    `${minor.minorCode} - ${minor.name}`,
                children: [],
            })),
        })),
    }))
}

function filterTree(nodes, q) {
    if (!q) return nodes
    const lq = q.toLowerCase()
    return nodes.reduce((acc, node) => {
        const filteredChildren = filterTree(node.children ?? [], q)
        const isMatch = node.label.toLowerCase().includes(lq)
        if (isMatch || filteredChildren.length > 0)
            acc.push({ ...node, children: filteredChildren, _matchSelf: isMatch })
        return acc
    }, [])
}

// 검색어 하이라이트
function HL({ text, q }) {
    if (!q) return <>{text}</>
    const lq = q.toLowerCase()
    const idx = text.toLowerCase().indexOf(lq)
    if (idx === -1) return <>{text}</>
    return (
        <>
            {text.slice(0, idx)}
            <mark className={styles.highlight}>{text.slice(idx, idx + q.length)}</mark>
            {text.slice(idx + q.length)}
        </>
    )
}

// ── 점수룰 validation ─────────────────────────────────────────────────────────
function validateScoreRules(rules, indicatorType) {
    const errors = []
    if (!rules.length) return errors

    // 점수 중복
    const scores = rules.map(r => Number(r.score)).filter(s => !isNaN(s))
    const dupScores = scores.filter((s, i) => scores.indexOf(s) !== i)
    if (dupScores.length) errors.push(`중복된 평가점수: ${[...new Set(dupScores)].join(', ')}`)

    // 구간 겹침 (R 타입만)
    if (indicatorType === 'R') {
        const ranges = rules
            .map(r => ({ from: r.fromVal ?? -Infinity, to: r.toVal ?? Infinity }))
            .sort((a, b) => a.from - b.from)
        for (let i = 0; i < ranges.length - 1; i++) {
            if (ranges[i].to > ranges[i + 1].from) {
                errors.push('점수 구간이 겹치는 항목이 있습니다.')
                break
            }
        }
    }
    return errors
}

// ── 점수룰 테이블 ─────────────────────────────────────────────────────────────
const GRADE_COLORS = { A:'#22c55e', B:'#84cc16', C:'#eab308', D:'#f97316', E:'#ef4444', F:'#7c3aed' }

function ScoreRuleTable({ rules, onChange, indicatorType }) {
    const isRange  = indicatorType === 'R'
    const errors   = useMemo(() => validateScoreRules(rules, indicatorType), [rules, indicatorType])
    const [checkedIds, setCheckedIds] = useState([])

    const update = (id, field, value) =>
        onChange(rules.map(r => r.id === id ? { ...r, [field]: value } : r))

    const addRow = () =>
        onChange([...rules, { id: Date.now(), grade:'', content:'', score:'', fromVal:null, toVal:null, yv40Map:'' }])

    const removeChecked = () => {
        onChange(rules.filter(r => !checkedIds.includes(r.id)))
        setCheckedIds([])
    }

    const toggleCheck = (id) =>
        setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

    const allChecked = rules.length > 0 && checkedIds.length === rules.length
    const toggleAll  = () => setCheckedIds(allChecked ? [] : rules.map(r => r.id))

    return (
        <>
            <div className={styles.scoreHeader}>
                <div className={styles.scoreHeaderLeft}>
                    <span className={styles.scoreTitle}>점수산정 기준</span>
                    <span
                        className={styles.scoreBadge}
                        style={{ background: isRange
                            ? 'color-mix(in srgb, var(--color-info, #3b82f6) 12%, transparent)'
                            : 'color-mix(in srgb, var(--color-success, #22c55e) 12%, transparent)',
                            color: isRange ? 'var(--color-info, #3b82f6)' : 'var(--color-success, #22c55e)',
                        }}
                    >
                        {isRange ? 'R - 점수구간' : 'C - 여부/유무'}
                    </span>
                    <span style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>
                        {rules.length}개 등급
                    </span>
                </div>
                <div className={styles.scoreHeaderRight}>
                    <BasicButton
                        label="행 삭제" icon={Trash2} variant="danger" size="sm"
                        disabled={checkedIds.length === 0}
                        onClick={removeChecked}
                    />
                    <BasicButton label="행 추가" icon={Plus} variant="secondary" size="sm" onClick={addRow} />
                </div>
            </div>

            <div className={styles.scoreBody}>
                {rules.length === 0
                    ? <div className={styles.scoreEmpty}>점수산정 기준을 추가하세요</div>
                    : (
                        <table className={styles.scoreTable}>
                            <thead>
                                <tr>
                                    <th style={{ width:32 }}>
                                        <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                                    </th>
                                    <th style={{ width:56 }}>등급</th>
                                    <th style={{ width:80 }}>내용</th>
                                    <th style={{ width:72 }}>평가점수</th>
                                    {isRange && <th style={{ width:90 }}>기준(FR)-이상</th>}
                                    {isRange && <th style={{ width:90 }}>기준(TO)-미만</th>}
                                    <th>영배4.0 매핑</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map(row => {
                                    const gradeColor = GRADE_COLORS[row.grade?.toUpperCase()] ?? null
                                    return (
                                        <tr key={row.id} className={checkedIds.includes(row.id) ? styles.scoreRowSelected : ''}>
                                            <td>
                                                <div className={styles.scoreCheckbox}>
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedIds.includes(row.id)}
                                                        onChange={() => toggleCheck(row.id)}
                                                    />
                                                </div>
                                            </td>
                                            <td className={styles.scoreGradeCell} style={gradeColor ? { color: gradeColor } : {}}>
                                                <input
                                                    className={styles.scoreInput}
                                                    style={gradeColor ? { color: gradeColor, fontWeight:700 } : {}}
                                                    value={row.grade ?? ''}
                                                    onChange={e => update(row.id, 'grade', e.target.value.toUpperCase())}
                                                    maxLength={2}
                                                />
                                            </td>
                                            <td>
                                                <input className={styles.scoreInput} value={row.content ?? ''} onChange={e => update(row.id, 'content', e.target.value)} />
                                            </td>
                                            <td>
                                                <input
                                                    className={styles.scoreInput}
                                                    style={{ fontWeight:700, color:'var(--color-primary)' }}
                                                    type="number"
                                                    value={row.score ?? ''}
                                                    onChange={e => update(row.id, 'score', e.target.value === '' ? '' : Number(e.target.value))}
                                                />
                                            </td>
                                            {isRange && (
                                                <td>
                                                    <input
                                                        className={styles.scoreInput}
                                                        type="number"
                                                        placeholder="이상"
                                                        value={row.fromVal ?? ''}
                                                        onChange={e => update(row.id, 'fromVal', e.target.value === '' ? null : Number(e.target.value))}
                                                    />
                                                </td>
                                            )}
                                            {isRange && (
                                                <td>
                                                    <input
                                                        className={styles.scoreInput}
                                                        type="number"
                                                        placeholder="미만"
                                                        value={row.toVal ?? ''}
                                                        onChange={e => update(row.id, 'toVal', e.target.value === '' ? null : Number(e.target.value))}
                                                    />
                                                </td>
                                            )}
                                            <td>
                                                <input className={styles.scoreInput} value={row.yv40Map ?? ''} onChange={e => update(row.id, 'yv40Map', e.target.value)} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )
                }
            </div>

            {errors.length > 0 && (
                <div className={styles.scoreValidError}>
                    ⚠ {errors.join(' / ')}
                </div>
            )}
        </>
    )
}

// ── 반영율 / 가중치 게이지 컴포넌트 ──────────────────────────────────────────
function RateGauge({ usage, inputVal, label }) {
    const input    = inputVal !== '' && !isNaN(Number(inputVal)) ? Number(inputVal) : 0
    const total    = usage.used + input
    const usedPct  = Math.min(100, usage.used)
    const inputPct = Math.min(100 - usedPct, input)
    const isOver   = total > 100
    const isOk     = total === 100

    const barColor = isOver ? 'var(--color-danger, #ef4444)'
        : isOk      ? 'var(--color-success, #22c55e)'
        : 'var(--color-primary)'

    return (
        <div className={styles.rateBox}>
            <div className={styles.rateBoxRow}>
                <span className={styles.rateBoxLabel}>
                    {label} 사용 현황
                </span>
                <span className={styles.rateBoxValue} style={{ color: isOver ? 'var(--color-danger)' : isOk ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                    {total}% / 100%
                    {isOver && ' ⚠ 초과'}
                    {isOk   && ' ✓'}
                </span>
            </div>
            <div className={styles.rateBarWrap}>
                {/* 기존 사용 */}
                <div style={{ display:'flex', height:'100%' }}>
                    <div className={styles.rateBar}
                        style={{ width:`${usedPct}%`, background:'var(--color-text-tertiary)', opacity:0.4 }}
                    />
                    {/* 현재 입력값 */}
                    <div className={styles.rateBar}
                        style={{ width:`${inputPct}%`, background: barColor }}
                    />
                </div>
            </div>
            <div className={styles.rateBoxHint}>
                <span>기존 {usage.used}% 사용 중</span>
                <span style={{ color: isOver ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }}>
                    {isOver
                        ? `${total - 100}% 초과`
                        : `입력 가능: ${usage.available}%`
                    }
                </span>
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

// ── 트리 노드 ─────────────────────────────────────────────────────────────────
function TreeNodeItem({ node, selectedId, createId, expandedIds, onToggle, onSelect, onAddChild, onEdit, onDelete, searchQuery }) {
    const Icon       = LEVEL_ICON[node.type]
    const iconColor  = LEVEL_COLOR[node.type]
    const indent     = LEVEL_INDENT[node.type]
    const hasChildren = node.children?.length > 0
    const isExpanded  = expandedIds.has(node.id)
    const isSelected  = selectedId === node.id
    const isCreate    = createId === node.id
    const isHighlight = !!searchQuery && node._matchSelf
    const badgeStyle  = LEVEL_BADGE_STYLE[node.type]
    const rateVal     = node.type === 'major' ? node.reflectRate : node.type === 'mid' ? node.weight : null

    return (
        <>
            <div
                className={[
                    styles.treeNode,
                    isSelected  ? styles.treeNodeSelected  : '',
                    isCreate    ? styles.treeNodeCreate    : '',
                    isHighlight ? styles.treeNodeHighlight : '',
                ].filter(Boolean).join(' ')}
                style={{ paddingLeft: indent }}
                onClick={() => onSelect(node)}
            >
                {hasChildren
                    ? <span className={styles.treeToggle} onClick={e => { e.stopPropagation(); onToggle(node.id) }}>
                        {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      </span>
                    : <span className={styles.treeToggleEmpty} />
                }
                <Icon size={13} className={styles.treeIcon} style={{ color: iconColor }} />
                <span className={`${styles.treeName} ${styles[`tree${node.type.charAt(0).toUpperCase()+node.type.slice(1)}Name`]}`}>
                    <HL text={node.label} q={searchQuery} />
                    {node.type === 'minor' && node.indicatorType && (
                        <span style={{ marginLeft:4, fontSize:10, opacity:0.6 }}>({node.indicatorType})</span>
                    )}
                </span>
                {rateVal != null && badgeStyle && (
                    <span className={styles.treeBadge} style={badgeStyle}>{rateVal}%</span>
                )}
                {node.useYn === 'N' && <span className={styles.treeUseN}>OFF</span>}
                <span className={styles.treeActions} onClick={e => e.stopPropagation()}>
                    {node.type !== 'minor' && (
                        <button className={styles.treeActionBtn} title="하위 추가" onClick={() => onAddChild(node)}>
                            <Plus size={11} />
                        </button>
                    )}
                    <button className={styles.treeActionBtn} title="수정" onClick={() => onEdit(node)}>
                        <Pencil size={11} />
                    </button>
                    <button className={`${styles.treeActionBtn} ${styles.treeActionBtnDanger}`} title="삭제" onClick={() => onDelete(node)}>
                        <Trash2 size={11} />
                    </button>
                </span>
            </div>
            {isExpanded && node.children?.map(child => (
                <TreeNodeItem key={child.id} node={child}
                    selectedId={selectedId} createId={createId}
                    expandedIds={expandedIds} onToggle={onToggle}
                    onSelect={onSelect} onAddChild={onAddChild}
                    onEdit={onEdit} onDelete={onDelete} searchQuery={searchQuery}
                />
            ))}
        </>
    )
}

// ── SccEvalItmMngFeature ──────────────────────────────────────────────────────
const INIT_FORM = { majorCode:'', midCode:'', minorCode:'', name:'', reflectRate:'', weight:'', detailInfo:'', indicatorType:'R', useYn:'Y', remark:'' }

/**
 * @param {Function} [props.onSaveScore] 점수룰 별도 저장 콜백 ({ node, scoreRules }) => Promise
 *   - 현재는 onRegister/onEdit 저장 후 즉시 호출
 *   - 나중에 별도 화면(UI-PMS-INF-13M)으로 분리 시 이 props만 새 Panel로 이동하면 됨
 */
export default function SccEvalItmMngFeature({ onDelete, onRegister, onEdit, onSaveScore }) {
    // ── 상단 필터 ─────────────────────────────────────────────────────────────
    const [filter,    setFilter]    = useState({ majorCode:'', midCode:'', search:'' })
    const [midOpts,   setMidOpts]   = useState([{ label:'전체', value:'' }])

    // ── 트리 ──────────────────────────────────────────────────────────────────
    const [treeWidth,   setTreeWidth]   = useState(320)
    const [expandedIds, setExpandedIds] = useState(() => new Set(MAJOR_DATA.map(m => `M_${m.majorCode}`)))
    const [searchQuery, setSearchQuery] = useState('')
    const searchRef   = useRef(null)
    const resizerRef  = useRef(null)
    const isDragging  = useRef(false)

    // ── 선택 / 모드 ───────────────────────────────────────────────────────────
    const [selectedNode,    setSelectedNode]    = useState(null)      // 현재 선택 노드
    const [mode,            setMode]            = useState(null)       // 'view' | 'create'
    const [createType,      setCreateType]      = useState(null)       // 'major' | 'mid' | 'minor'
    const [createParent,    setCreateParent]    = useState(null)
    const [createNodeId,    setCreateNodeId]    = useState(null)       // 트리에서 시각적으로 표시할 임시 ID

    // ── 점수룰 ────────────────────────────────────────────────────────────────
    const [scoreRules, setScoreRules] = useState([])

    // ── 삭제 확인 ─────────────────────────────────────────────────────────────
    const [confirmOpen,   setConfirmOpen]   = useState(false)
    const [confirmTarget, setConfirmTarget] = useState(null)

    // ── 반영율/가중치 100% 미만 저장 confirm ─────────────────────────────────
    const [rateConfirmOpen,    setRateConfirmOpen]    = useState(false)
    const [rateConfirmMessage, setRateConfirmMessage] = useState('')
    const [pendingSave,        setPendingSave]        = useState(null) // 미확정 저장 payload

    const { control, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({ defaultValues: INIT_FORM })
    const watchIndicatorType = watch('indicatorType')
    const watchMajorCode     = watch('majorCode')

    // 트리 데이터
    const fullTree = useMemo(() => buildTree(MAJOR_DATA, MID_DATA, MINOR_DATA), [])

    const displayTree = useMemo(() => {
        let tree = fullTree
        if (filter.majorCode) tree = tree.filter(n => n.majorCode === filter.majorCode)
        if (filter.midCode)   tree = tree.map(n => ({ ...n, children: n.children.filter(m => m.midCode === filter.midCode) })).filter(n => n.children.length > 0)
        if (searchQuery)      tree = filterTree(tree, searchQuery)
        return tree
    }, [fullTree, filter, searchQuery])

    // 검색 시 자동 펼치기
    useEffect(() => {
        if (searchQuery) {
            const all = new Set()
            const col = ns => ns.forEach(n => { all.add(n.id); col(n.children ?? []) })
            col(fullTree)
            setExpandedIds(all)
        }
    }, [searchQuery, fullTree])

    // 대분류 변경 시 중분류 옵션 업데이트
    useEffect(() => {
        if (filter.majorCode) {
            const opts = MID_DATA
                .filter(m => m.majorCode === filter.majorCode)
                .map(m => ({ label:`${m.midCode} - ${m.name}`, value:m.midCode }))
            setMidOpts([{ label:'전체', value:'' }, ...opts])
        } else {
            setMidOpts([{ label:'전체', value:'' }])
        }
        setFilter(f => ({ ...f, midCode:'' }))
    }, [filter.majorCode])

    // 중분류 옵션 (폼용)
    const midFormOpts = useMemo(() => {
        const src = watchMajorCode ? MID_DATA.filter(m => m.majorCode === watchMajorCode) : MID_DATA
        return src.map(m => ({ label:`${m.midCode} - ${m.name}`, value:m.midCode }))
    }, [watchMajorCode])

    // 노드 선택 시 폼 + 점수룰 초기화
    useEffect(() => {
        if (mode === 'view' && selectedNode) {
            reset({
                majorCode:     selectedNode.majorCode    ?? '',
                midCode:       selectedNode.midCode      ?? '',
                minorCode:     selectedNode.minorCode    ?? '',
                name:          selectedNode.name         ?? '',
                reflectRate:   selectedNode.reflectRate  != null ? String(selectedNode.reflectRate) : '',
                weight:        selectedNode.weight       != null ? String(selectedNode.weight)       : '',
                detailInfo:    selectedNode.detailInfo   ?? '',
                indicatorType: selectedNode.indicatorType ?? 'R',
                useYn:         selectedNode.useYn        ?? 'Y',
                remark:        selectedNode.remark       ?? '',
            })
            if (selectedNode.type === 'minor') {
                setScoreRules(JSON.parse(JSON.stringify(DEFAULT_SCORE_RULES)))
            }
        } else if (mode === 'create') {
            const pre = {
                majorCode:     createParent?.type === 'major' ? createParent.majorCode
                    :          createParent?.type === 'mid'   ? createParent.majorCode : '',
                midCode:       createParent?.type === 'mid'   ? createParent.midCode  : '',
                minorCode:     '',
                name:          '',
                reflectRate:   '',
                weight:        '',
                detailInfo:    '',
                indicatorType: 'R',
                useYn:         'Y',
                remark:        '',
            }
            reset(pre)
            if (createType === 'minor') setScoreRules([])
        }
    }, [mode, selectedNode, createType, createParent, reset])

    // 지표구분 변경 시 점수룰 자동 세팅 (소분류 모드만)
    useEffect(() => {
        if (!isMinorMode) return
        if (watchIndicatorType === 'C') {
            setScoreRules([
                { id: Date.now(),     grade:'A', content:'해당없음', score:0,   fromVal:null, toVal:null, yv40Map:'A' },
                { id: Date.now() + 1, grade:'E', content:'해당',     score:100, fromVal:null, toVal:null, yv40Map:'E' },
            ])
        } else if (watchIndicatorType === 'R') {
            setScoreRules(JSON.parse(JSON.stringify(DEFAULT_SCORE_RULES)))
        }
    }, [watchIndicatorType]) // eslint-disable-line react-hooks/exhaustive-deps

    // ── 리사이저 드래그 ───────────────────────────────────────────────────────
    const handleResizerDown = useCallback((e) => {
        e.preventDefault()
        isDragging.current = true
        const startX = e.clientX
        const startW = treeWidth
        resizerRef.current?.classList.add(styles.resizerActive)

        const onMove = (e) => {
            if (!isDragging.current) return
            const next = Math.max(200, Math.min(500, startW + (e.clientX - startX)))
            setTreeWidth(next)
        }
        const onUp = () => {
            isDragging.current = false
            resizerRef.current?.classList.remove(styles.resizerActive)
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onUp)
        }
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
    }, [treeWidth])

    // ── 트리 핸들러 ───────────────────────────────────────────────────────────
    const onToggle = useCallback((id) => {
        setExpandedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
    }, [])

    const onSelectNode = useCallback((node) => {
        setSelectedNode(node); setMode('view'); setCreateNodeId(null)
        setExpandedIds(prev => { const s = new Set(prev); s.add(node.id); return s })
    }, [])

    const onAddMajor = useCallback(() => {
        setSelectedNode(null); setMode('create'); setCreateType('major'); setCreateParent(null); setCreateNodeId('__new_major__')
    }, [])

    const onAddChild = useCallback((parentNode) => {
        const childType = parentNode.type === 'major' ? 'mid' : 'minor'
        setSelectedNode(null); setMode('create'); setCreateType(childType); setCreateParent(parentNode)
        setCreateNodeId(`__new_${childType}__`)
        setExpandedIds(prev => { const s = new Set(prev); s.add(parentNode.id); return s })
    }, [])

    const onEditNode = useCallback((node) => {
        setSelectedNode(node); setMode('view')
    }, [])

    const onDeleteNode = useCallback((node) => {
        setConfirmTarget(node); setConfirmOpen(true)
    }, [])

    const handleDeleteConfirm = useCallback(async () => {
        await onDelete?.(confirmTarget)
        setConfirmOpen(false); setConfirmTarget(null)
        if (selectedNode?.id === confirmTarget?.id) { setSelectedNode(null); setMode(null) }
    }, [confirmTarget, selectedNode, onDelete])

    // ── 통계 / 타입 관련 파생 상태 (모든 useCallback/useMemo 이전에 선언 필수) ─
    const stats       = { major: MAJOR_DATA.length, mid: MID_DATA.length, minor: MINOR_DATA.length }
    const typeLabel   = { major:'대분류', mid:'중분류', minor:'소분류' }
    const currentType = mode === 'create' ? createType : selectedNode?.type
    const isMinorMode = (mode === 'view' && selectedNode?.type === 'minor') || (mode === 'create' && createType === 'minor')
    const panelTitle  = mode === 'create'
        ? `${typeLabel[createType] ?? ''} 등록`
        : mode === 'view' ? selectedNode?.name ?? ''
        : null

    // ── 반영율 / 가중치 사용 현황 계산 (onSave 이전에 선언 필수) ──────────────
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const rateUsage = useMemo(() => {
        if (currentType !== 'major' && currentType !== 'mid') return null
        if (currentType === 'major') {
            const others = MAJOR_DATA.filter(m =>
                mode === 'create' ? true : m.majorCode !== selectedNode?.majorCode
            )
            const used = others.reduce((s, m) => s + (m.reflectRate ?? 0), 0)
            return { label:'반영율', used, available: 100 - used, others }
        }
        if (currentType === 'mid') {
            const parentCode = mode === 'create' ? watchMajorCode : selectedNode?.majorCode
            if (!parentCode) return null
            const others = MID_DATA.filter(m =>
                m.majorCode === parentCode &&
                (mode === 'create' ? true : m.midCode !== selectedNode?.midCode)
            )
            const used = others.reduce((s, m) => s + (m.weight ?? 0), 0)
            return { label:'가중치', used, available: 100 - used, others }
        }
        return null
    }, [currentType, mode, selectedNode, watchMajorCode])

    const executeSave = useCallback(async (formValues) => {
        const isMinor = createType === 'minor' || selectedNode?.type === 'minor'
        const payload = {
            ...formValues,
            reflectRate: formValues.reflectRate !== '' ? Number(formValues.reflectRate) : null,
            weight:      formValues.weight      !== '' ? Number(formValues.weight)      : null,
        }
        if (mode === 'create') await onRegister?.(payload)
        else                   await onEdit?.({ ...selectedNode, ...payload })

        if (isMinor && onSaveScore) {
            const nodeRef = mode === 'create'
                ? { majorCode: payload.majorCode, midCode: payload.midCode, minorCode: payload.minorCode }
                : { majorCode: selectedNode.majorCode, midCode: selectedNode.midCode, minorCode: selectedNode.minorCode }
            await onSaveScore({ node: nodeRef, scoreRules })
        }
        setMode(null); setSelectedNode(null); setCreateNodeId(null)
    }, [mode, selectedNode, createType, scoreRules, onRegister, onEdit, onSaveScore])

    const onSave = useCallback(async (formValues) => {
        const isMinor = createType === 'minor' || selectedNode?.type === 'minor'

        // 점수룰 validation (소분류만)
        if (isMinor) {
            const scoreErrors = validateScoreRules(scoreRules, formValues.indicatorType)
            if (scoreErrors.length) { toast.error(`점수룰 오류: ${scoreErrors[0]}`); return }
        }

        // 반영율 / 가중치 합계 validation
        if (currentType === 'major' && formValues.reflectRate !== '') {
            const input = Number(formValues.reflectRate)
            const used  = rateUsage?.used ?? 0
            const total = used + input
            if (total > 100) {
                toast.error(`반영율 합계가 ${total}%입니다. 100%를 초과할 수 없습니다.`)
                return
            }
            if (total < 100) {
                setPendingSave(formValues)
                setRateConfirmMessage(`반영율 합계가 ${total}%입니다. (남은 ${100 - total}% 미배정)\n저장하시겠습니까?`)
                setRateConfirmOpen(true)
                return
            }
        }

        if (currentType === 'mid' && formValues.weight !== '') {
            const input = Number(formValues.weight)
            const used  = rateUsage?.used ?? 0
            const total = used + input
            if (total > 100) {
                toast.error(`가중치 합계가 ${total}%입니다. 100%를 초과할 수 없습니다.`)
                return
            }
            if (total < 100) {
                setPendingSave(formValues)
                setRateConfirmMessage(`가중치 합계가 ${total}%입니다. (남은 ${100 - total}% 미배정)\n저장하시겠습니까?`)
                setRateConfirmOpen(true)
                return
            }
        }

        await executeSave(formValues)
    }, [currentType, createType, selectedNode, scoreRules, rateUsage, executeSave])

    // 반영율 경고 confirm 후 실제 저장
    const handleRateConfirm = useCallback(async () => {
        setRateConfirmOpen(false)
        if (pendingSave) { await executeSave(pendingSave); setPendingSave(null) }
    }, [pendingSave, executeSave])

    const onCancel = useCallback(() => {
        setMode(null); setCreateNodeId(null)
        if (mode === 'create') setSelectedNode(null)
    }, [mode])

    const expandAll   = useCallback(() => {
        const all = new Set(); const c = ns => ns.forEach(n => { all.add(n.id); c(n.children ?? []) }); c(fullTree); setExpandedIds(all)
    }, [fullTree])
    const collapseAll = useCallback(() => setExpandedIds(new Set()), [])

    // 전체 펼치기/접기 토글
    const allNodeCount = useMemo(() => {
        let cnt = 0; const c = ns => ns.forEach(n => { if (n.children?.length) { cnt++; c(n.children) } }); c(fullTree); return cnt
    }, [fullTree])
    const isAllExpanded  = expandedIds.size >= allNodeCount && allNodeCount > 0
    const toggleExpandAll = useCallback(() => isAllExpanded ? collapseAll() : expandAll(), [isAllExpanded, expandAll, collapseAll])

    // ── 브레드크럼 ────────────────────────────────────────────────────────────
    const breadcrumb = useMemo(() => {
        const node = mode === 'create' ? createParent : selectedNode
        if (!node) return []
        if (node.type === 'major') return [node.name]
        if (node.type === 'mid') {
            const maj = MAJOR_DATA.find(m => m.majorCode === node.majorCode)
            return [maj?.name ?? node.majorCode, node.name]
        }
        if (node.type === 'minor') {
            const maj = MAJOR_DATA.find(m => m.majorCode === node.majorCode)
            const mid = MID_DATA.find(m => m.majorCode === node.majorCode && m.midCode === node.midCode)
            return [maj?.name ?? node.majorCode, mid?.name ?? node.midCode, node.name]
        }
        return []
    }, [selectedNode, mode, createParent])

    // 반영율/가중치 합계 표시 (헤더)
    const rateInfo = useMemo(() => {
        if (!selectedNode && mode !== 'view') return null
        const node = selectedNode
        if (!node) return null
        if (node.type === 'major') {
            const total = MAJOR_DATA.reduce((s, m) => s + (m.reflectRate ?? 0), 0)
            return { label:'전체 반영율 합계', total, ok: total === 100 }
        }
        if (node.type === 'mid') {
            const siblings = MID_DATA.filter(m => m.majorCode === node.majorCode)
            const total = siblings.reduce((s, m) => s + (m.weight ?? 0), 0)
            return { label:`${node.majorCode} 대분류 가중치 합계`, total, ok: total === 100 }
        }
        return null
    }, [selectedNode, mode])

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <div className={styles.wrap}>

            {/* ── 상단 필터 바 ──────────────────────────────────────────────── */}
            <div className={styles.filterBar}>
                <SelectInput
                    label="대분류" value={filter.majorCode}
                    onChange={e => setFilter(f => ({ ...f, majorCode: e.target.value }))}
                    options={MAJOR_SEARCH_OPT}
                    style={{ minWidth:180 }}
                />
                <SelectInput
                    label="중분류" value={filter.midCode}
                    onChange={e => setFilter(f => ({ ...f, midCode: e.target.value }))}
                    options={midOpts}
                    style={{ minWidth:160 }}
                />
                <TextInput
                    label="소분류 검색" value={filter.search}
                    onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') setSearchQuery(filter.search) }}
                    placeholder="소분류 코드 / 이름..."
                    style={{ minWidth:200 }}
                />
                <BasicButton label="초기화" icon={RotateCcw} variant="secondary"
                    onClick={() => { setFilter({ majorCode:'', midCode:'', search:'' }); setSearchQuery('') }}
                />
                <BasicButton label="조회" icon={Search} variant="primary"
                    onClick={() => setSearchQuery(filter.search)}
                />
            </div>

            {/* ── 메인 ──────────────────────────────────────────────────────── */}
            <div className={styles.main}>

                {/* 좌측 트리 */}
                <div className={styles.treePanel} style={{ width: treeWidth }}>
                    <div className={styles.treeHeader}>
                        <label className={styles.treeSearch}>
                            <Search size={12} style={{ color:'var(--color-text-tertiary)', flexShrink:0 }} />
                            <input
                                ref={searchRef}
                                className={styles.treeSearchInput}
                                placeholder="트리 검색..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-tertiary)', display:'flex', padding:0 }}
                                    onClick={() => { setSearchQuery(''); searchRef.current?.focus() }}>
                                    <X size={11} />
                                </button>
                            )}
                        </label>
                        <button
                            className={styles.treeIconBtn}
                            title={isAllExpanded ? '전체 접기' : '전체 펼치기'}
                            onClick={toggleExpandAll}
                        >
                            {isAllExpanded ? <ChevronsDownUp size={13} /> : <ChevronsUpDown size={13} />}
                        </button>
                        <button className={styles.treeAddBtn} onClick={onAddMajor}>
                            <Plus size={11} />
                            대분류
                        </button>
                    </div>

                    <div className={styles.treeStat}>
                        {[
                            { type:'major', label:'대분류', count:stats.major },
                            { type:'mid',   label:'중분류', count:stats.mid   },
                            { type:'minor', label:'소분류', count:stats.minor },
                        ].map(s => (
                            <span key={s.type} className={styles.treeStatItem}>
                                <span className={styles.treeStatDot} style={{ background: LEVEL_COLOR[s.type] }} />
                                {s.label} <strong style={{ color:'var(--color-text-primary)' }}>{s.count}</strong>
                            </span>
                        ))}
                    </div>

                    <div className={styles.treeBody}>
                        {displayTree.length === 0
                            ? <div className={styles.treeEmpty}><Search size={24} style={{ opacity:0.3 }} /><span>검색 결과 없음</span></div>
                            : displayTree.map(node => (
                                <TreeNodeItem key={node.id} node={node}
                                    selectedId={selectedNode?.id}
                                    createId={createNodeId}
                                    expandedIds={expandedIds}
                                    onToggle={onToggle} onSelect={onSelectNode}
                                    onAddChild={onAddChild} onEdit={onEditNode} onDelete={onDeleteNode}
                                    searchQuery={searchQuery}
                                />
                            ))
                        }
                    </div>
                </div>

                {/* 리사이저 */}
                <div ref={resizerRef} className={styles.resizer} onMouseDown={handleResizerDown} />

                {/* 우측 패널 */}
                <div className={styles.rightPanel}>
                    {!mode
                        ? (
                            <div className={styles.rightEmpty}>
                                <MousePointerClick size={48} className={styles.rightEmptyIcon} />
                                <span style={{ fontSize:13 }}>좌측 트리에서 항목을 선택하세요</span>
                                <span style={{ fontSize:12 }}>또는 <strong style={{ color:'var(--color-primary)', cursor:'pointer' }} onClick={onAddMajor}>대분류 추가</strong>로 시작하세요</span>
                            </div>
                        )
                        : (
                            <>
                                {/* 우측 헤더 */}
                                <div className={styles.rightHeader}>
                                    <div className={styles.rightHeaderLeft}>
                                        {breadcrumb.length > 1 && (
                                            <div className={styles.breadcrumb}>
                                                {breadcrumb.slice(0, -1).map((b, i) => (
                                                    <React.Fragment key={i}>
                                                        {i > 0 && <ChevronRight size={10} className={styles.breadcrumbSep} />}
                                                        <span>{b}</span>
                                                    </React.Fragment>
                                                ))}
                                                <ChevronRight size={10} className={styles.breadcrumbSep} />
                                                <span className={styles.breadcrumbCurrent}>{typeLabel[currentType]}</span>
                                            </div>
                                        )}
                                        <div className={`${styles.rightTitle} ${mode === 'create' ? styles.rightTitleNew : ''}`}>
                                            {panelTitle}
                                            {rateInfo && (
                                                <span className={rateInfo.ok ? styles.rateOk : styles.rateWarn} style={{ marginLeft:10, fontSize:12 }}>
                                                    {rateInfo.label}: {rateInfo.total}%{rateInfo.ok ? ' ✓' : ' ⚠'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.rightHeaderRight}>
                                        {mode === 'view' && selectedNode?.type !== 'minor' && (
                                            <BasicButton
                                                label={selectedNode?.type === 'major' ? '중분류 추가' : '소분류 추가'}
                                                icon={Plus} variant="info" size="sm"
                                                onClick={() => onAddChild(selectedNode)}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* 상세 폼 */}
                                <div className={styles.detailSection}>
                                    <div className={styles.formGrid}>
                                        {/* 대분류 폼 */}
                                        {currentType === 'major' && (
                                            <>
                                                <div className={styles.formRow2}>
                                                    <CtrlText name="majorCode" control={control} label="대분류코드"
                                                        placeholder="예: E" rules={{ required:'대분류코드를 입력하세요' }}
                                                        readOnly={mode === 'view'}
                                                    />
                                                    <CtrlSelect name="useYn" control={control} label="적용유무"
                                                        options={USE_YN_OPT} rules={{ required:'적용유무를 선택하세요' }}
                                                    />
                                                </div>
                                                <CtrlText name="name" control={control} label="대분류코드명"
                                                    placeholder="대분류코드명을 입력하세요" rules={{ required:'대분류코드명을 입력하세요' }}
                                                />
                                                <CtrlText name="reflectRate" control={control} label="반영율(%)"
                                                    placeholder="0 ~ 100" type="number" rules={{ required:'반영율을 입력하세요' }}
                                                />
                                                {rateUsage && <RateGauge usage={rateUsage} inputVal={watch('reflectRate')} label="반영율" />}
                                            </>
                                        )}

                                        {/* 중분류 폼 */}
                                        {currentType === 'mid' && (
                                            <>
                                                <CtrlSelect name="majorCode" control={control} label="대분류코드"
                                                    options={MAJOR_FORM_OPT} rules={{ required:'대분류코드를 선택하세요' }}
                                                    readOnly={true}
                                                />
                                                <div className={styles.formRow2}>
                                                    <CtrlText name="midCode" control={control} label="중분류코드"
                                                        placeholder="예: 07" rules={{ required:'중분류코드를 입력하세요' }}
                                                        readOnly={mode === 'view'}
                                                    />
                                                    <CtrlSelect name="useYn" control={control} label="적용유무"
                                                        options={USE_YN_OPT} rules={{ required:'적용유무를 선택하세요' }}
                                                    />
                                                </div>
                                                <CtrlText name="name" control={control} label="중분류코드명"
                                                    placeholder="중분류코드명을 입력하세요" rules={{ required:'중분류코드명을 입력하세요' }}
                                                />
                                                <CtrlText name="weight" control={control} label="가중치(%)"
                                                    placeholder="0 ~ 100" type="number" rules={{ required:'가중치를 입력하세요' }}
                                                />
                                                {rateUsage && <RateGauge usage={rateUsage} inputVal={watch('weight')} label="가중치" />}
                                            </>
                                        )}

                                        {/* 소분류 폼 */}
                                        {currentType === 'minor' && (
                                            <>
                                                {/* Row 1: 대분류 | 중분류 | 소분류코드 (3열) */}
                                                <div className={styles.formRow3}>
                                                    <CtrlSelect name="majorCode" control={control} label="대분류코드"
                                                        options={MAJOR_FORM_OPT} rules={{ required:'대분류코드를 선택하세요' }}
                                                        readOnly={true}
                                                    />
                                                    <CtrlSelect name="midCode" control={control} label="중분류코드"
                                                        options={midFormOpts} rules={{ required:'중분류코드를 선택하세요' }}
                                                        readOnly={true}
                                                    />
                                                    <CtrlText name="minorCode" control={control} label="소분류코드"
                                                        placeholder="예: 02" rules={{ required:'소분류코드를 입력하세요' }}
                                                        readOnly={mode === 'view'}
                                                    />
                                                </div>
                                                {/* Row 2: 소분류 정의(2fr) | 적용유무(1fr) */}
                                                <div className={styles.formRow21}>
                                                    <CtrlText name="name" control={control} label="소분류(하위인자) 정의"
                                                        placeholder="소분류 정의를 입력하세요" rules={{ required:'소분류(하위인자) 정의를 입력하세요' }}
                                                    />
                                                    <CtrlSelect name="useYn" control={control} label="적용유무"
                                                        options={USE_YN_OPT} rules={{ required:'적용유무를 선택하세요' }}
                                                    />
                                                </div>
                                                {/* Row 3: 인자정보(2fr) | 지표구분(1fr) */}
                                                <div className={styles.formRow21}>
                                                    <CtrlText name="detailInfo" control={control} label="인자정보(상세)"
                                                        placeholder="상세 인자 정보" rules={{ required:'인자정보를 입력하세요' }}
                                                    />
                                                    <CtrlSelect name="indicatorType" control={control} label="지표구분"
                                                        options={INDICATOR_OPT} rules={{ required:'지표구분을 선택하세요' }}
                                                    />
                                                </div>
                                                {/* Row 4: 비고 (전체 너비) */}
                                                <CtrlText name="remark" control={control} label="비고" placeholder="비고를 입력하세요" />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* 점수룰 (소분류만) */}
                                {isMinorMode && (
                                    <div className={styles.scoreSection}>
                                        <ScoreRuleTable
                                            rules={scoreRules}
                                            onChange={setScoreRules}
                                            indicatorType={watchIndicatorType}
                                        />
                                    </div>
                                )}

                                {/* 하단 버튼 (FormDrawer 방식) */}
                                <div className={styles.rightFooter}>
                                    <BasicButton
                                        label={isSubmitting ? '저장 중...' : '저장'}
                                        icon={isSubmitting ? Loader2 : Save}
                                        variant="primary" size="sm"
                                        disabled={isSubmitting}
                                        onClick={handleSubmit(onSave)}
                                    />
                                    {mode === 'view' && (
                                        <BasicButton label="삭제" icon={Trash2} variant="danger" size="sm"
                                            onClick={() => onDeleteNode(selectedNode)}
                                        />
                                    )}
                                    {mode === 'create' && (
                                        <BasicButton label="취소" icon={X} variant="secondary" size="sm" onClick={onCancel} />
                                    )}
                                </div>
                            </>
                        )
                    }
                </div>
            </div>

            {/* 반영율/가중치 100% 미만 저장 확인 */}
            <ConfirmModal
                open={rateConfirmOpen} variant="warning" title="저장 확인"
                message={rateConfirmMessage}
                confirmText="저장" onConfirm={handleRateConfirm}
                onCancel={() => { setRateConfirmOpen(false); setPendingSave(null) }}
            />

            {/* 삭제 확인 */}
            <ConfirmModal
                open={confirmOpen} variant="danger" title="삭제 확인"
                message={
                    confirmTarget?.type === 'major' ? `'${confirmTarget?.name}' 대분류를 삭제하시겠습니까?\n하위 중분류·소분류 데이터도 함께 삭제됩니다.`
                    : confirmTarget?.type === 'mid'   ? `'${confirmTarget?.name}' 중분류를 삭제하시겠습니까?\n하위 소분류 데이터도 함께 삭제됩니다.`
                    : `'${confirmTarget?.name}' 소분류를 삭제하시겠습니까?`
                }
                confirmText="삭제" onConfirm={handleDeleteConfirm} onCancel={() => setConfirmOpen(false)}
            />
        </div>
    )
}
