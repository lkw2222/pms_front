import React from 'react';
import styles from "../styles/TextInput.module.css";

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