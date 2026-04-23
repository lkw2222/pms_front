import React, {useMemo, useState} from 'react';
import styles from './DashboardDtlFeature.module.css';

/**
 * 진단우선순위 (SCC) 평가 결과조회 - 상세 테이블
 *
 * @author LKW
 * @since 2026-04-22
 * @returns {JSX.Element}
 */
export default function DashboardDtlFeature({ data, onExcelDownload }) {
    // ── 페이징 상태 ──
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 판정등급 색상
    const GRADE_COLORS = {
        S: 'var(--color-danger)',
        A: 'var(--color-warning)',
        B: 'var(--color-purple)',
        C: 'var(--color-accent)',
        D: 'var(--color-success)',
    };

    // 샘플 데이터 (props 없을 경우)
    const tableData = useMemo(() => {
        if (data && data.length > 0) return data;

        // 페이징 테스트를 위해 더 많은 샘플 생성 (25개)
        const grades = ['S', 'A', 'B', 'C', 'D'];
        const gradeNames = ['즉시위험', '고위험', '중위험', '저위험', '정기진단'];
        const scores = [91, 89, 74, 64, 57.25];

        return Array.from({ length: 25 }, (_, i) => {
            const gIdx = i % 5;
            return {
                seq: i + 1,
                headquarters: '대전세종충남본부',
                branch: '대덕유성',
                gid: 2 + i,
                facilityId: `8027R${504 + i}`,
                poleKind: '',
                poleType: '',
                poleSize: '',
                safety: { windLoad: null, complex: null, composite: null },
                structureSafety: null,
                loadExternal: null,
                environmentCorrosion: null,
                operationHistory: null,
                score: scores[gIdx],
                grade: grades[gIdx],
                gradeName: gradeNames[gIdx],
            };
        });
    }, [data]);

    // ── 페이징 계산 ──
    const totalCount = tableData.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    // 현재 페이지가 전체 페이지를 넘으면 자동 조정
    const safePage = Math.min(currentPage, totalPages);

    const pagedData = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return tableData.slice(start, start + pageSize);
    }, [tableData, safePage, pageSize]);

    // 페이지 번호 버튼 생성 (최대 5개 표시, 현재 페이지 중심)
    const pageNumbers = useMemo(() => {
        const MAX_BUTTONS = 5;
        let start = Math.max(1, safePage - Math.floor(MAX_BUTTONS / 2));
        let end = Math.min(totalPages, start + MAX_BUTTONS - 1);
        if (end - start + 1 < MAX_BUTTONS) {
            start = Math.max(1, end - MAX_BUTTONS + 1);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [safePage, totalPages]);

    // ── 이벤트 핸들러 ──
    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(totalPages, page)));
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);  // 페이지 크기 변경 시 1페이지로 리셋
    };

    const handleExcelDownload = () => {
        if (onExcelDownload) {
            onExcelDownload(tableData);
        } else {
            console.log('엑셀 다운로드:', tableData);
        }
    };

    const fmt = (value) => {
        if (value == null || value === '') return '';
        return typeof value === 'number' ? value.toLocaleString() : value;
    };

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <div className={styles.header}>
                <span className={styles.title}>
                </span>
                <button
                    type="button"
                    className={styles.excelButton}
                    onClick={handleExcelDownload}
                >
                    엑셀다운로드
                </button>
            </div>

            {/* 테이블 */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th rowSpan={2}>순번</th>
                        <th rowSpan={2}>지역본부</th>
                        <th rowSpan={2}>사업소</th>
                        <th rowSpan={2}>설비<br/>GID</th>
                        <th rowSpan={2}>전산화번호</th>
                        <th rowSpan={2}>전주<br/>종류</th>
                        <th rowSpan={2}>형태</th>
                        <th rowSpan={2}>규격</th>
                        <th colSpan={3} className={styles.groupHeader}>안전율</th>
                        <th rowSpan={2}>구조<br/>안전성</th>
                        <th rowSpan={2}>하중<br/>외력</th>
                        <th rowSpan={2}>환경<br/>부식</th>
                        <th rowSpan={2}>운영<br/>이력</th>
                        <th rowSpan={2}>판정점수</th>
                        <th colSpan={2} rowSpan={2} className={styles.groupHeader}>판정등급</th>
                    </tr>
                    <tr>
                        <th>풍하중</th>
                        <th>복합하중</th>
                        <th>합성하중</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pagedData.map((row) => (
                        <tr key={row.seq}>
                            <td>{row.seq}</td>
                            <td className={styles.hqCell}>{row.headquarters}</td>
                            <td className={styles.branchCell}>{row.branch}</td>
                            <td>{fmt(row.gid)}</td>
                            <td className={styles.idCell}>{row.facilityId}</td>
                            <td>{fmt(row.poleKind)}</td>
                            <td>{fmt(row.poleType)}</td>
                            <td>{fmt(row.poleSize)}</td>
                            <td>{fmt(row.safety?.windLoad)}</td>
                            <td>{fmt(row.safety?.complex)}</td>
                            <td>{fmt(row.safety?.composite)}</td>
                            <td>{fmt(row.structureSafety)}</td>
                            <td>{fmt(row.loadExternal)}</td>
                            <td>{fmt(row.environmentCorrosion)}</td>
                            <td>{fmt(row.operationHistory)}</td>
                            <td className={styles.scoreCell}>{fmt(row.score)}</td>
                            <td className={styles.gradeCodeCell}>
                                    <span
                                        className={styles.gradeBadge}
                                        style={{
                                            background: GRADE_COLORS[row.grade] || 'var(--color-text-muted)',
                                        }}
                                    >
                                        {row.grade}
                                    </span>
                            </td>
                            <td className={styles.gradeNameCell}>
                                {row.gradeName}
                            </td>
                        </tr>
                    ))}

                    {/* 데이터 없을 때 */}
                    {pagedData.length === 0 && (
                        <tr>
                            <td colSpan={18} className={styles.emptyRow}>
                                데이터가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* ── 페이징 영역 ── */}
            <div className={styles.pagination}>
                {/* 왼쪽: 페이지 크기 선택 + 총 건수 */}
                <div className={styles.paginationLeft}>
                    <label className={styles.pageSizeLabel}>
                        페이지당
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className={styles.pageSizeSelect}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        건
                    </label>
                    <span className={styles.totalInfo}>
                        총 <b>{totalCount.toLocaleString()}</b>건
                    </span>
                </div>

                {/* 오른쪽: 페이지 네비게이션 */}
                <div className={styles.paginationRight}>
                    {/* 처음 */}
                    <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => goToPage(1)}
                        disabled={safePage === 1}
                        aria-label="첫 페이지"
                    >
                        «
                    </button>

                    {/* 이전 */}
                    <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => goToPage(safePage - 1)}
                        disabled={safePage === 1}
                        aria-label="이전 페이지"
                    >
                        ‹
                    </button>

                    {/* 페이지 번호 */}
                    {pageNumbers.map((p) => (
                        <button
                            key={p}
                            type="button"
                            className={`${styles.pageBtn} ${
                                p === safePage ? styles.pageBtnActive : ''
                            }`}
                            onClick={() => goToPage(p)}
                        >
                            {p}
                        </button>
                    ))}

                    {/* 다음 */}
                    <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => goToPage(safePage + 1)}
                        disabled={safePage === totalPages}
                        aria-label="다음 페이지"
                    >
                        ›
                    </button>

                    {/* 마지막 */}
                    <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => goToPage(totalPages)}
                        disabled={safePage === totalPages}
                        aria-label="마지막 페이지"
                    >
                        »
                    </button>
                </div>
            </div>
        </div>
    );
}