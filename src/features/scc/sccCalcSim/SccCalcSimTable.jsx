import React, { useMemo } from 'react';
import styles from './SccCalcSimTable.module.css';

/**
 * 본부별 중위험군 이상 진단비용(예상) 통계표
 *
 * @author LKW
 * @since 2026-04-22
 * @returns {JSX.Element}
 */
export default function SccCalcSimTable({ data, onExcelDownload }) {
    // 기본 본부 목록 (데이터 없을 때 표시)
    const defaultHeadquarters = useMemo(() => [
        '서울', '남서울', '인천', '경기북부', '경기',
        '강원', '충북', '대전세종충남', '전북', '광주전남',
        '대구', '경북', '부산울산', '경남', '제주',
    ], []);

    // props로 받은 데이터가 없으면 샘플 데이터 사용
    const tableData = useMemo(() => {
        if (data && data.length > 0) return data;

        // 이미지의 샘플 데이터
        return defaultHeadquarters.map((hq) => {
            if (hq === '대전세종충남') {
                return {
                    headquarters: hq,
                    total: 3500,
                    diagnosisTarget: 30,
                    riskRatio: 0.857,
                    cost: 277,
                };
            }
            // 나머지는 비어있음
            return {
                headquarters: hq,
                total: null,
                diagnosisTarget: null,
                riskRatio: null,
                cost: null,
            };
        });
    }, [data, defaultHeadquarters]);

    const handleExcelDownload = () => {
        if (onExcelDownload) {
            onExcelDownload(tableData);
        } else {
            console.log('엑셀 다운로드:', tableData);
        }
    };

    // 값 포맷
    const formatValue = (value) => {
        if (value == null) return '';
        return typeof value === 'number' ? value.toLocaleString() : value;
    };

    return (
        <div className={styles.container}>
            {/* 헤더: 제목 + 엑셀 다운로드 버튼 */}
            <div className={styles.header}>
                <span className={styles.title}>
                    본부별 중위험군 이상 진단비용(예상) 통계표
                </span>
                <button
                    type="button"
                    className={styles.excelButton}
                    onClick={handleExcelDownload}
                >
                    [엑셀다운로드]
                </button>
            </div>

            {/* 테이블 */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th className={styles.firstCol}></th>
                        <th>전체(개)</th>
                        <th>진단대상</th>
                        <th>위험비율</th>
                        <th>진단비용</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map((row) => (
                        <tr key={row.headquarters}>
                            <td className={styles.firstCol}>
                                {row.headquarters}
                            </td>
                            <td>{formatValue(row.total)}</td>
                            <td>{formatValue(row.diagnosisTarget)}</td>
                            <td>{formatValue(row.riskRatio)}</td>
                            <td>{formatValue(row.cost)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}