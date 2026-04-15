import React, { useState } from 'react'
import readmeContent from '../../../README.md?raw'

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 마크다운 파서
 * - 코드블록을 먼저 placeholder로 추출 → 나머지 변환 → 마지막에 복원
 * - 이렇게 해야 코드블록 안의 #, **, - 등이 헤더/강조로 잘못 변환되지 않음
 */
function parseMarkdown(md) {
  // ── Step 0. 줄바꿈 정규화 (Windows CRLF → LF) ───────────────────────────
  md = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // ── Step 1. 코드블록을 placeholder 로 추출 ──────────────────────────────
  const codeBlocks = []
  const withPlaceholders = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const html = `<pre class="md-pre"><code class="md-code lang-${lang}">${escapeHtml(code.trimEnd())}</code></pre>`
    codeBlocks.push(html)
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`
  })

  // ── Step 2. 나머지 마크다운 변환 (코드블록 없는 상태) ────────────────────
  let result = withPlaceholders
    // 인라인 코드
    .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
    // 헤더
    .replace(/^# (.+)$/gm,    '<h1 class="md-h1">$1</h1>')
    .replace(/^## (.+)$/gm,   '<h2 class="md-h2">$1</h2>')
    .replace(/^### (.+)$/gm,  '<h3 class="md-h3">$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    // 구분선
    .replace(/^---$/gm, '<hr class="md-hr" />')
    // 굵게 / 기울임
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 테이블 — trailing 공백 및 CRLF 대응, 빈 행 필터
    .replace(
      /(\|.+\|\s*\n)\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)*)/g,
      (_, header, rows) => {
        const th  = header.trim().split('|').filter(Boolean).map(c => `<th>${c.trim()}</th>`).join('')
        const trs = rows.trim().split('\n').filter(Boolean).map(row =>
          '<tr>' + row.split('|').filter(Boolean).map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
        ).join('')
        return `<table class="md-table"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`
      }
    )
    // 목차 링크 → span
    .replace(/\[([^\]]+)\]\(#[^)]+\)/g, '<span class="md-toc-link">$1</span>')
    // 일반 링크
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="md-link" href="$2" target="_blank" rel="noopener">$1</a>')
    // 목록
    .replace(/^(\s*)[-*] (.+)$/gm, (_, indent, text) =>
      `<li class="md-li" style="padding-left:${indent.length * 8 + 8}px">• ${text}</li>`
    )
    // 인용구
    .replace(/^> (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>')
    // 단락
    .replace(/\n\n/g, '</p><p class="md-p">')
    .replace(/^/, '<p class="md-p">')
    .concat('</p>')
    .replace(/<p class="md-p"><\/p>/g, '')
    // 단일 줄바꿈 → <br> (HTML 닫는 태그 뒤 \n 은 제외 — 태그 사이 불필요한 br 방지)
    .replace(/([^>])\n/g, '$1<br>')

  // ── Step 3. placeholder 를 실제 코드블록 HTML 로 복원 ────────────────────
  result = result.replace(/%%CODEBLOCK_(\d+)%%/g, (_, i) => codeBlocks[parseInt(i)])

  return result
}

function extractToc(md) {
  return md.split('\n')
    .filter(l => l.startsWith('## '))
    .map(l => l.replace('## ', '').trim())
}

export default function ReadmePanel() {
  const [active, setActive] = useState(null)
  const html = parseMarkdown(readmeContent)
  const toc  = extractToc(readmeContent)

  const scrollTo = (title) => {
    setActive(title)
    const headers = document.querySelectorAll('.readme-content h2')
    for (const h of headers) {
      if (h.textContent.trim() === title) {
        h.scrollIntoView({ behavior:'smooth', block:'start' })
        break
      }
    }
  }

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', background:'var(--color-bg-primary)' }}>

      {/* 좌측 목차 */}
      <div style={{ width:220, flexShrink:0, borderRight:'1px solid var(--color-border)', background:'var(--color-bg-secondary)', padding:'16px 8px', overflowY:'auto' }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'0 8px 10px' }}>목차</div>
        {toc.map((title, i) => (
          <button key={i} onClick={() => scrollTo(title)}
            style={{
              width:'100%', textAlign:'left', padding:'7px 10px',
              borderRadius:'var(--radius-md)', fontSize:12, border:'none',
              cursor:'pointer', display:'block', marginBottom:1,
              background:  active===title ? 'var(--color-accent)12' : 'transparent',
              color:       active===title ? 'var(--color-accent)'   : 'var(--color-text-secondary)',
              fontWeight:  active===title ? 600 : 400,
              borderLeft:  active===title ? '2px solid var(--color-accent)' : '2px solid transparent',
              transition: 'all .12s',
            }}
            onMouseEnter={e => { if (active!==title) { e.currentTarget.style.background='var(--color-bg-tertiary)'; e.currentTarget.style.color='var(--color-text-primary)' }}}
            onMouseLeave={e => { if (active!==title) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--color-text-secondary)' }}}
          >
            {title.replace(/^\d+\.\s*/, '')}
          </button>
        ))}
      </div>

      {/* 우측 본문 */}
      <div className="readme-content"
        style={{ flex:1, overflowY:'auto', padding:'32px 40px' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style>{`
        .readme-content { font-size:13px; line-height:1.75; color:var(--color-text-primary); }
        .md-h1 { font-size:22px; font-weight:800; border-bottom:2px solid var(--color-border); padding-bottom:10px; margin:0 0 20px; }
        .md-h2 { font-size:17px; font-weight:700; border-bottom:1px solid var(--color-border); padding-bottom:8px; margin:36px 0 14px; scroll-margin-top:16px; }
        .md-h3 { font-size:14px; font-weight:700; margin:20px 0 10px; }
        .md-h4 { font-size:13px; font-weight:600; color:var(--color-text-secondary); margin:14px 0 8px; }
        .md-p  { margin:0 0 10px; color:var(--color-text-secondary); }
        .md-hr { border:none; border-top:1px solid var(--color-border); margin:28px 0; }
        .md-pre {
          background:var(--color-bg-tertiary);
          border:1px solid var(--color-border);
          border-radius:var(--radius-md);
          padding:14px 16px; margin:12px 0; overflow-x:auto;
        }
        .md-code {
          font-family:'JetBrains Mono','Fira Code','Courier New',monospace;
          font-size:12px; line-height:1.6; color:var(--color-text-primary); display:block;
          white-space: pre;
        }
        .md-inline-code {
          font-family:'JetBrains Mono','Fira Code','Courier New',monospace;
          font-size:11px; padding:1px 5px;
          background:var(--color-bg-tertiary);
          border:1px solid var(--color-border);
          border-radius:var(--radius-sm);
          color:var(--color-accent);
        }
        .md-table { width:100%; border-collapse:collapse; margin:12px 0; font-size:12px; }
        .md-table th { background:var(--color-bg-tertiary); color:var(--color-text-secondary); font-weight:600; text-align:left; padding:8px 12px; border:1px solid var(--color-border); }
        .md-table td { padding:7px 12px; border:1px solid var(--color-border); color:var(--color-text-primary); }
        .md-table tr:hover td { background:var(--color-bg-tertiary); }
        .md-li { margin:4px 0; color:var(--color-text-secondary); list-style:none; }
        .md-blockquote {
          border-left:3px solid var(--color-accent);
          padding:8px 16px; margin:12px 0;
          background:rgba(88,166,255,0.06);
          color:var(--color-text-secondary);
          border-radius:0 var(--radius-md) var(--radius-md) 0;
          font-style:italic;
        }
        .md-link { color:var(--color-accent); text-decoration:none; }
        .md-link:hover { text-decoration:underline; }
        .md-toc-link { color:var(--color-accent); }
        .readme-content strong { color:var(--color-text-primary); font-weight:700; }
        .readme-content em { color:var(--color-text-secondary); font-style:italic; }
        .lang-bash .md-code { color:#34d399; }
        .lang-css  .md-code { color:#a78bfa; }
      `}</style>
    </div>
  )
}
