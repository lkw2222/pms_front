import React, { useState, useEffect, useId } from 'react';

const EmailInput = ({label, value = '', onChange, errorMessage = "유효한 이메일 형식이 아닙니다.", ...props}) => {
    const uniqueId = useId();
    const [isValid, setIsValid] = useState(true);

    // 이메일 유효성 검사 정규식
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 내부적으로 아이디와 도메인을 쪼개서 관리합니다.
    const [localPart, setLocalPart] = useState('');
    const [domainPart, setDomainPart] = useState('');
    const [email, setEmail] = useState('');
    const [isDomainReadOnly, setIsDomainReadOnly] = useState(false);

    // 자주 사용하는 도메인 목록
    const domains = [
        { value: 'direct', label: '직접 입력' },
        { value: 'naver.com', label: 'naver.com' },
        { value: 'nate.com', label: 'nate.com' },
        { value: 'daum.net', label: 'daum.net' },
        { value: 'gmail.com', label: 'gmail.com' },
    ];

    // 부모로부터 받은 value가 변경될 때 내부 상태(아이디/도메인) 업데이트
    useEffect(() => {
        if (value) {
            const [local = '', domain = ''] = value.split('@');
            setLocalPart(local);
            setDomainPart(domain);

            // 전달받은 도메인이 목록에 있으면 select 박스 동기화 및 읽기 전용 처리
            const isCommonDomain = domains.some(d => d.value === domain);
            setIsDomainReadOnly(isCommonDomain && domain !== '');
        } else {
            setLocalPart('');
            setDomainPart('');
            setIsDomainReadOnly(false);
        }
    }, [value]);

    // 값이 변경될 때마다 정규식 검사 및 부모로 값 전달
    const triggerChange = (newLocal, newDomain) => {
        const newEmail = newLocal || newDomain ? `${newLocal}@${newDomain}` : '';

        // 빈 값이면 에러 숨김, 값이 있으면 정규식 테스트
        setIsValid(newEmail === '' || emailRegex.test(newEmail));

        if (onChange) {
            setEmail(newEmail);
            // 부모의 onChange 이벤트에 이메일 문자열을 통째로 넘겨줍니다.
            // (기존 e.target.value 대신 문자열 자체를 넘기므로 부모 쪽 코드 수정 필요)
            onChange(newEmail);
        }
    };

    const handleLocalChange = (e) => {
        const newLocal = e.target.value;
        setLocalPart(newLocal);
        triggerChange(newLocal, domainPart);
    };

    const handleDomainChange = (e) => {
        const newDomain = e.target.value;
        setDomainPart(newDomain);
        triggerChange(localPart, newDomain);
    };

    const handleSelectChange = (e) => {
        const selectedDomain = e.target.value;
        if (selectedDomain === 'direct') {
            setIsDomainReadOnly(false);
            setDomainPart('');
            triggerChange(localPart, '');
        } else {
            setIsDomainReadOnly(true);
            setDomainPart(selectedDomain);
            triggerChange(localPart, selectedDomain);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
            {label && (
                <label htmlFor={uniqueId} style={{ marginBottom: '4px', fontSize: '14px' }}>
                    {label}
                </label>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* 1. 아이디 입력 */}
                <input
                    id={uniqueId}
                    type="text"
                    value={localPart}
                    onChange={handleLocalChange}
                    placeholder="아이디"
                    style={inputStyle(isValid)}
                    {...props}
                />

                <span>@</span>

                {/* 2. 도메인 입력 */}
                <input
                    type="text"
                    value={domainPart}
                    onChange={handleDomainChange}
                    placeholder="도메인"
                    readOnly={isDomainReadOnly}
                    style={{
                        ...inputStyle(isValid),
                        backgroundColor: isDomainReadOnly ? '#f0f0f0' : 'white', // 읽기 전용일 때 배경색 변경
                    }}
                />

                {/* 3. 도메인 선택 Select */}
                <select
                    onChange={handleSelectChange}
                    style={inputStyle(isValid)}
                    value={isDomainReadOnly ? domainPart : 'direct'}
                >
                    {domains.map((domain) => (
                        <option key={domain.value} value={domain.value}>
                            {domain.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* 유효성 검사 에러 메시지 */}
            {!isValid && (
                <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {errorMessage}
                </span>
            )}

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                현재 입력된 데이터: {email}
            </div>
        </div>
    );
};

// 중복되는 input/select 스타일을 하나로 묶어둔 헬퍼 함수
const inputStyle = (isValid) => ({
    padding: '8px',
    borderRadius: '4px',
    border: `1px solid ${isValid ? '#ccc' : 'red'}`,
    outline: 'none',
    flex: 1, // 남은 공간을 균율하게 차지하도록 설정
});

export default EmailInput;