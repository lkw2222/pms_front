import React, { useId } from 'react';
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/themes/light.css';
import { Korean } from 'flatpickr/dist/l10n/ko.js';

const DateInput = ({label = '', value, onChange, options = {}, ...props}) => {
    const uniqueId = useId();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
            {label && (
                <label htmlFor={uniqueId} style={{ marginBottom: '4px', fontSize: '14px' }}>
                    {label}
                </label>
            )}

            <Flatpickr id={uniqueId} value={value}
                // onChange 시 날짜 문자열(예: '2026-03-18')을 바로 부모로 넘겨주도록 처리
                onChange={(selectedDates, dateStr) => {
                    if (onChange) {
                        onChange(dateStr, selectedDates);
                    }
                }}
                options={{
                    locale: Korean,        // 한국어 달력 적용
                    dateFormat: 'Y-m-d',   // 데이터베이스에 넣기 좋은 표준 포맷
                    ...options             // 부모에서 특정 옵션(minDate 등)을 덮어쓸 수 있도록 전개
                }}
                style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    outline: 'none',
                    cursor: 'pointer',
                }}
                placeholder="날짜 선택"
                {...props}
            />
        </div>
    );
};

export default DateInput;