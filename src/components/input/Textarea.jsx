import React from 'react';
import styles from "../styles/TextInput.module.css";

/**
 * 멀티라인 텍스트 입력 컴포넌트. 유효성 검사(isNotNull / regex),
 * rows 지정, react-hook-form register 와 함께 사용 가능
 *
 * @author JDJ
 * @since 2026-04-15
 * @param {Object}   props
 * @param {string}   [props.label]            라벨 텍스트
 * @param {string}   [props.placeholder='']   플레이스홀더
 * @param {string}   [props.value]            입력값
 * @param {function} [props.onChange]         변경 핸들러
 * @param {boolean}  [props.isNotNull=false]  필수 입력 여부
 * @param {RegExp}   [props.regex]            유효성 검사 정규식
 * @param {string}   [props.errorMessage]     에러 메시지
 * @param {boolean}  [props.disabled=false]   비활성 여부
 * @param {number}   [props.rows]             표시 행 수
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 */
export default function Textarea({label, placeholder = '', value, onChange = () => {}, isNotNull = false
                                           , errorMessage, disabled = false, icon: Icon
                                           , className = '', regex, rows, ...props}) {

    const isError = (isNotNull && !value) || (regex && value && !regex.test(value));

    return (
        <div className={[styles.wrapper, className].join(' ')}>
            <label className={[styles.label, disabled ? styles.disabled : ''].join(' ')}>
                {label && (
                    <span className={styles.labelText}>
                        {isNotNull && <span className={styles.required}>*</span>}
                        {label}
                    </span>
                )}
            </label>

            <div className={styles.inputWrap}>
                {Icon && <div className={styles.icon}><Icon size={13} /></div>}

                <textarea
                    className="form-textarea"
                    value={value ?? ''}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows={rows}
                    {...props}
                />
            </div>

            {isError && (
                <span className={styles.errorMsg}>
                    {errorMessage || (isNotNull && !value ? '필수 입력 항목입니다.' : '올바른 형식이 아닙니다.')}
                </span>
            )}

        </div>
    );
};