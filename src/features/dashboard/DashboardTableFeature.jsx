import React, {useCallback, useMemo, useState} from 'react';
import styles from './DashboardTableFeature.module.css';
import GridDetailModal from "@/components/grid/GridDetailModal.jsx";
import DashboardDtlFeature from "./DashboardDtlFeature.jsx";

/**
 * 본부별 평가등급 비율 통계표
 *
 * @author LKW
 * @since 2026-04-22
 * @returns {JSX.Element}
 */
export default function DashboardTableFeature({ data }) {
    const [modalOpen, setModalOpen] = useState(false);
    const openModal  = useCallback(() => { setModalOpen(true) }, []);
    const closeModal = useCallback(() => setModalOpen(false), []);

    // 기본 본부 목록
    const defaultHeadquarters = useMemo(() => [
        '서울', '남서울', '인천', '경기북부', '경기',
        '강원', '충북', '대전세종충남',
    ], []);

    // 데이터 준비 (props 없을 경우 샘플)
    const tableData = useMemo(() => {
        if (data && data.length > 0) return data;

        return defaultHeadquarters.map((hq) => ({
            headquarters: hq,
            branch: null,
            total: null,
            diagnosisTarget: null,
            sccScore: null,
            gradeRatio: {
                S: null,
                A: null,
                B: null,
                C: null,
                D: null,
            },
        }));
    }, [data, defaultHeadquarters]);

    const handleDetail = (row) => {
        openModal(row);
    };

    // 값 포맷
    const fmt = (value) => {
        if (value == null) return '';
        return typeof value === 'number' ? value.toLocaleString() : value;
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                    {/* 1행: 그룹 헤더 */}
                    <tr>
                        <th rowSpan={2} className={styles.hqCol}>지역본부</th>
                        <th rowSpan={2}>사업소</th>
                        <th rowSpan={2}>전체(개)</th>
                        <th rowSpan={2}>진단대상</th>
                        <th rowSpan={2}>SCC평점</th>
                        <th colSpan={5} className={styles.groupHeader}>
                            평가등급별 비율 (%)
                        </th>
                        <th rowSpan={2} className={styles.detailCol}></th>
                    </tr>
                    {/* 2행: 서브 헤더 */}
                    <tr>
                        <th>즉시위험</th>
                        <th>고위험</th>
                        <th>중위험</th>
                        <th>저위험</th>
                        <th>정기진단</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map((row) => (
                        <tr key={row.headquarters}>
                            <td className={styles.hqCol}>{row.headquarters}</td>
                            <td>{fmt(row.branch)}</td>
                            <td>{fmt(row.total)}</td>
                            <td>{fmt(row.diagnosisTarget)}</td>
                            <td>{fmt(row.sccScore)}</td>
                            <td>{fmt(row.gradeRatio?.S)}</td>
                            <td>{fmt(row.gradeRatio?.A)}</td>
                            <td>{fmt(row.gradeRatio?.B)}</td>
                            <td>{fmt(row.gradeRatio?.C)}</td>
                            <td>{fmt(row.gradeRatio?.D)}</td>
                            <td className={styles.detailCol}>
                                <button
                                    type="button"
                                    className={styles.detailButton}
                                    onClick={() => handleDetail(row)}
                                >
                                    [상세보기]
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 상세 모달 — API 연동 시 mock 분기를 useQuery 결과로 교체 */}
            <GridDetailModal
                width={'1200px'}
                height={'720px'}
                open={modalOpen}
                title={'전주우선순위(SCC) 평가 결과 상세 조회'}
                onClose={closeModal}
            >
                <DashboardDtlFeature initialPoleId="8027R504"/>
            </GridDetailModal>
        </div>
    );
}