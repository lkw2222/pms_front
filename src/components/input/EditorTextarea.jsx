import React, {useEffect, useState} from 'react';
import styles from "../styles/TextInput.module.css";
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    CreateLink
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

export default function EditorTextarea({label, placeholder = '', value, onChange, isNotNull = false
                         , errorMessage, disabled = false, height = "200px", icon: Icon
                         , className = '', regex, ...props}) {
    const [touched, setTouched] = useState(false);
    const [focused, setFocused] = useState(false);

    const isError = touched && (
        (isNotNull && !value) ||
        (regex && value && !regex.test(value))
    )

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

                <MDXEditor className="form-textarea"
                           placeholder={placeholder}
                           disabled={disabled}
                           markdown={value || ''} // MDXEditor는 HTML 대신 깔끔한 Markdown 문자열을 주고받습니다.
                        onChange={onChange}    // 글을 쓸 때마다 마크다운 텍스트를 부모(RHF)로 올려보냅니다.

                    // 최소한의 높이를 보장하기 위한 인라인 스타일 적용
                    contentEditableClassName="mdx-editor-content"

                    // 사용할 기능과 툴바 버튼을 레고 조립하듯 설정합니다.
                    plugins={[
                        headingsPlugin(),
                        listsPlugin(),
                        quotePlugin(),
                        thematicBreakPlugin(),
                        markdownShortcutPlugin(), // 마크다운 단축키 지원 (예: '#' 치고 스페이스바 누르면 제목 됨)

                        // 상단 툴바 UI 설정
                        toolbarPlugin({
                            toolbarContents: () => (
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <UndoRedo />
                                    <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }} />
                                    <BlockTypeSelect /> {/* 제목, 본문 등 글자 크기 선택 */}
                                    <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }} />
                                    <BoldItalicUnderlineToggles /> {/* 굵게, 기울임 등 */}
                                    <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }} />
                                    <CreateLink />
                                </div>
                            )
                        })
                    ]}
                />
            </div>

            {isError && (
                <span className={styles.errorMsg}>
                    {errorMessage || (isNotNull && !value ? '필수 입력 항목입니다.' : '올바른 형식이 아닙니다.')}
                </span>
            )}

            {/* 에디터 내부 컨텐츠의 최소 높이를 잡아주기 위한 스타일 (글로벌 css에 넣으셔도 됩니다) */}
            <style>
                {`.mdx-editor-content {
                  min-height: ${height};
                  padding: 16px;
                  outline: none;
                }`}
            </style>
        </div>
    );
};