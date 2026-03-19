import React, { useState, useRef, useId } from 'react'
import { Upload, X, FileText } from 'lucide-react'

const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * FileInput
 * @param {string}   label
 * @param {function} onChange   - (File[]) => void
 * @param {string}   accept     - 허용 확장자 (예: ".pdf,.doc,image/*")
 * @param {boolean}  multiple   - 다중 선택 여부
 * @param {...any}   props      - input 엘리먼트에 전달되는 나머지 props
 */
export default function FileInput({
  label,
  onChange,
  accept,
  multiple = true,
  className = '',
  ...props
}) {
  const uniqueId   = useId()
  const inputRef   = useRef(null)
  const [files,     setFiles]     = useState([])
  const [isDragging, setIsDragging] = useState(false)

  const updateFiles = (newFiles) => {
    setFiles(newFiles)
    onChange?.(newFiles)
  }

  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true)  }
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop      = (e) => {
    e.preventDefault(); setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    updateFiles([...files, ...dropped])
  }
  const handleSelect = (e) => {
    const selected = Array.from(e.target.files)
    updateFiles([...files, ...selected])
    e.target.value = ''
  }
  const handleRemove = (idx) => updateFiles(files.filter((_, i) => i !== idx))

  return (
    <div className={`flex flex-col gap-1 mb-3 ${className}`}>
      {label && (
        <label htmlFor={uniqueId} className="text-xs text-[var(--color-text-secondary)] font-medium">
          {label}
        </label>
      )}

      {/* 드롭존 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-2 p-6 rounded-[var(--radius-lg)]
          border-2 border-dashed cursor-pointer transition-all duration-150
          ${isDragging
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
            : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-bg-hover)]/30'
          }
        `}
      >
        <Upload size={20} className={isDragging ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'} />
        <p className="text-xs text-[var(--color-text-muted)] text-center">
          {isDragging ? '파일을 여기에 놓아주세요!' : '파일을 끌어다 놓거나 클릭해서 선택하세요'}
        </p>
        <input
          id={uniqueId}
          type="file"
          multiple={multiple}
          accept={accept}
          ref={inputRef}
          onChange={handleSelect}
          className="hidden"
          {...props}
        />
      </div>

      {/* 파일 목록 */}
      {files.length > 0 && (
        <ul className="flex flex-col gap-1 mt-1">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
              <FileText size={13} className="text-[var(--color-accent)] flex-shrink-0" />
              <span className="text-xs text-[var(--color-text-primary)] truncate flex-1">{file.name}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] flex-shrink-0">{formatSize(file.size)}</span>
              <button type="button" onClick={() => handleRemove(i)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors flex-shrink-0">
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
