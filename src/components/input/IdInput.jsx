import React from 'react';

const IdInput = ({value, onChange}) => {

    const handleChange = (e) => {
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className="input-container" style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
            <input
                type="id"
                value={value}
                onChange={handleChange}
                style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    outline: 'none',
                }}
                placeholder="ID"
            />
        </div>
    );
};

export default IdInput;