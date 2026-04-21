import React, { useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './SearchInput.module.css'

/**
 * 검색구분 셀렉트 + 검색어 인풋이 하나의 인풋 박스로 통합된 컴포넌트.
 *
 * @author JDJ
 * @since 2026-04-20
 * @param {Object}   props
 * @param {string}   [props.label]           라벨 텍스트
 * @param {Array}    props.options            셀렉트 옵션 — [{ label, value }]
 * @param {string}   props.selectValue        셀렉트 선택값
 * @param {function} props.onSelectChange     셀렉트 변경 핸들러
 * @param {string}   props.inputValue         인풋 값
 * @param {function} props.onInputChange      인풋 변경 핸들러
 * @param {string}   [props.placeholder]      인풋 플레이스홀더
 * @param {function} [props.onKeyDown]        키다운 핸들러
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-20 | JDJ    | 최초 작성 |
 */
export default function SearchInput({
    label,
    options = [],
    selectValue,
    onSelectChange,
    inputValue,
    onInputChange,
    placeholder = '검색어를 입력하세요',
    onKeyDown,
    style,
}) {
    const inputRef = useRef(null)

    return (
        <div className={styles.wrapper} style={style}>
            {label && <span className={styles.labelText} onClick={() => inputRef.current?.focus()}>{label}</span>}
            <div className={styles.inputGroup}>
                <div className={styles.selectWrap}>
                    <select value={selectValue} onChange={onSelectChange} className={styles.select}>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div className={styles.arrow}><ChevronDown size={12} /></div>
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className={styles.input}
                />
            </div>
        </div>
    )
}
