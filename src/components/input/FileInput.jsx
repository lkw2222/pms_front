import React, { useState, useRef, useId } from 'react';

const FileInput = ({label, onChange, ...props}) => {
    const uniqueId = useId();
    const inputRef = useRef(null);

    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // 파일 용량을 사람이 읽기 쉬운 단위(KB, MB)로 변환하는 유틸리티 함수
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // 상태를 업데이트하고 부모 컴포넌트로 파일 목록을 전달하는 함수
    const updateFiles = (newFiles) => {
        setFiles(newFiles);
        if (onChange) {
            onChange(newFiles); // 부모 컴포넌트의 onChange에 배열(File 객체들)을 넘겨줍니다.
        }
    };

    // --- 드래그 앤 드롭 이벤트 핸들러 ---
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            // 기존 파일 목록에 새로 드롭된 파일들을 병합합니다.
            updateFiles([...files, ...droppedFiles]);
            e.dataTransfer.clearData();
        }
    };

    // --- 클릭해서 파일을 선택할 때 ---
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            updateFiles([...files, ...selectedFiles]);

            // 같은 파일을 지웠다가 다시 선택할 때 반응하도록 input 값을 초기화합니다.
            e.target.value = '';
        }
    };

    // --- 개별 파일 삭제 ---
    const handleRemoveFile = (indexToRemove) => {
        const newFiles = files.filter((_, index) => index !== indexToRemove);
        updateFiles(newFiles);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
            {label && (
                <label htmlFor={uniqueId} style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                    {label}
                </label>
            )}

            {/* 1. 드롭존 (Drag & Drop 영역) */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()} // 영역 클릭 시 숨겨진 input을 클릭한 것과 같은 효과
                style={{
                    border: `2px dashed ${isDragging ? '#4A90E2' : '#ccc'}`,
                    backgroundColor: isDragging ? '#F0F8FF' : '#FAFAFA',
                    padding: '30px',
                    textAlign: 'center',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
            >
                <p style={{ margin: 0, color: '#666' }}>
                    {isDragging ? '파일을 여기에 놓아주세요!' : '파일을 마우스로 끌어오거나 클릭하여 선택하세요.'}
                </p>

                {/* 실제 동작하지만 화면에는 보이지 않는 input 요소 */}
                <input
                    id={uniqueId}
                    type="file"
                    multiple // 여러 개 선택 허용
                    ref={inputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    {...props}
                />
            </div>

            {/* 2. 첨부된 파일 목록 표시 */}
            {files.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px', color:'#000' }}>
                    {files.map((file, index) => (
                        <li
                            key={`${file.name}-${index}`}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 12px',
                                border: '1px solid #eee',
                                borderRadius: '4px',
                                marginBottom: '4px',
                                backgroundColor: '#fff'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                <span style={{ fontSize: '20px' }}>📄</span>
                                <span style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '200px' // 긴 파일명 말줄임 처리
                                }}>{file.name}</span>
                                <span style={{ color: '#888', fontSize: '12px' }}>({formatFileSize(file.size)})</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                style={{
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: 'red',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    padding: '4px'
                                }}
                                title="삭제">
                                ✖
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileInput;