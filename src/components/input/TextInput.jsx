import React, { useState } from 'react';

const TextInput = ({value, onChange, regex, errorMessage = "유효하지 않은 형식입니다.", ...props }) => {
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e) => {
        const inputValue = e.target.value;

        // 1. 정규식(regex)이 파라미터로 넘어왔다면 유효성 검사 실행
        if (regex) {
            // 정규식 테스트 통과 여부 확인 (빈 칸일 때는 일단 에러를 숨기도록 처리)
            const testResult = inputValue === '' || regex.test(inputValue);
            setIsValid(testResult);
        }

        // 2. 부모 컴포넌트에서 넘겨준 onChange 이벤트가 있다면 실행하여 값 업데이트
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className="input-container" style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${isValid ? '#ccc' : 'red'}`,
                    outline: 'none',
                }}
                // 부모에서 넘긴 onKeyDown, onBlur, placeholder, disabled 등이
                // 이 곳(...props)을 통해 input 태그에 자동으로 쏙 들어갑니다.
                {...props}
            />

            {/* 유효성 검사 실패 시 에러 메시지 출력 */}
            {!isValid && (
                <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
          {errorMessage}
        </span>
            )}
        </div>
    );
};

export default TextInput;