import React from 'react';

const CheckboxInput = ({label = '', checked, onChange, ...props}) => {
    return (
        <div className="checkbox-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
            {/* label 태그로 묶어주면 텍스트를 클릭해도 체크박스가 작동하여 사용성이 좋아집니다. */}
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    style={{ cursor: 'pointer' }}
                    {...props}
                />

                {/* showLabel이 true이고, label 텍스트가 존재할 때만 화면에 렌더링합니다. */}
                {label && (
                    <span style={{ marginLeft: '8px', fontSize: '14px', userSelect: 'none' }}>
                        {label}
                    </span>
                )}
            </label>
        </div>
    );
};

export default CheckboxInput;