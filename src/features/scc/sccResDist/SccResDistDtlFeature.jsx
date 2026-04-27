import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import styles from './SccResDistDtlFeature.module.css'
import {Search} from "lucide-react";
import TextButton from '@/components/button/TextButton.jsx'
import MultiGauegFeature from "@/features/common/charts/MultiGauegFeature.jsx";
import { TILE_LAYERS } from '@/utils/gis/tileLayer.js'

// 평가 등급 정의
const GRADE = {
    PASS: 'pass',       // 적합 (파랑)
    FAIL: 'fail',       // 부적합 (빨강)
};

const GRADE_COLORS = {
    [GRADE.PASS]: '#2563eb',
    [GRADE.FAIL]: '#ef4444',
};

/**
 * SCC 평과결과 분포도 상세
 * SCC 평과결과 분포도 그리드에서 클릭한 항목의 상세 조회
 *
 * @author LKW
 * @since 2026-04-22
 * @returns {JSX.Element}
 *
 * @history
 * | 날짜       | 수정자 | 내용 |
 * |------------|--------|------|
 * | 2026-04-22 | LKW    | 최초 작성 |
 */
export default function SccResDistDtlFeature({ initialPoleId = '8027R504' }) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const vectorSourceRef = useRef(null);
    const selectInteractionRef = useRef(null);   // ── 추가

    const [headquarters, setHeadquarters] = useState('');
    const [branch, setBranch] = useState('');
    const [visibleGrades, setVisibleGrades] = useState({
        all: true,
        [GRADE.PASS]: true,
        [GRADE.FAIL]: true,
    });
    const [selectedPole, setSelectedPole] = useState(null);

    // 샘플 전주 데이터 (실제로는 API에서)
    const [poles, setPoles] = useState([
        {
            id: '8027R504',
            name: '우송정보대학교 앞',
            coordinate: [127.4390, 36.3355],
            grade: GRADE.FAIL,
            poleType: '단주',
            poleSize: 16,
            gid: 2,
            healthIndex: 220,
            설계하중: 6867,
            전주저항: 90987.75,
            고온계지역: 'III 지역, 지역인가 밀집',
            저온계지역: '소방인가 밀집',
            지선주각도: 0,
            고온계합계: 16862.32,
            저온계합계: 16862.32,
            전주부담: { 고온계: '16862.32(0.0)', 저온계: '0.0' },
            안전율: { 고온계: 6.60, 저온계: 6.60 },
            전선MT합: { 고온계: 5823.24, 저온계: 5823.24 },
            설치년월: '2012.08',
            설치기간: '14년 2개월',
            최근평가일자: '2026-04-03 16:00:30',
            주소: '대전세종충남본부 / 대전세종충남부사협 현대구 5852',
            cpInfo: 'CP700kgf 전주',
        },
        {
            id: '8027R505',
            name: '우송정보대학교 옆',
            coordinate: [127.4395, 36.3358],
            grade: GRADE.PASS,
            healthIndex: 80,
            poleType: '단주',
            설계하중: 5000,
            설치년월: '2020.05',
            설치기간: '5년 11개월',
            최근평가일자: '2026-04-03 16:00:30',
            주소: '대전세종충남본부 / 대전세종충남부사협 현대구 5853',
        },
        // 더 많은 샘플...
    ]);

    // OpenLayers 지도 초기화
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // 전주 벡터 소스
        const vectorSource = new VectorSource();
        vectorSourceRef.current = vectorSource;

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: (feature) => createPoleStyle(feature.get('grade')),
        });

        // 지도 생성
        const map = new Map({
            target: mapContainerRef.current,
            layers: [
               TILE_LAYERS.Base.create(),
                vectorLayer,
            ],
            view: new View({
                center: fromLonLat([127.4390, 36.3355]),  // 대전 근처
                zoom: 17,
            }),
        });

        mapRef.current = map;

        // 전주 클릭 이벤트
        const selectInteraction = new Select({
            condition: click,
            style: (feature) => createPoleStyle(feature.get('grade'), true),
        });

        selectInteraction.on('select', (e) => {
            if (e.selected.length > 0) {
                const feature = e.selected[0];
                setSelectedPole(feature.get('poleData'));
            }
        });

        map.addInteraction(selectInteraction);
        selectInteractionRef.current = selectInteraction;  // ── 추가

        return () => {
            map.setTarget(undefined);
        };
    }, []);

    // 전주 데이터가 변경되거나 필터가 바뀔 때 지도 갱신
    useEffect(() => {
        if (!vectorSourceRef.current) return;

        vectorSourceRef.current.clear();

        const filteredPoles = poles.filter((pole) => {
            if (visibleGrades.all) return true;
            return visibleGrades[pole.grade];
        });

        const features = filteredPoles.map((pole) => {
            const feature = new Feature({
                geometry: new Point(fromLonLat(pole.coordinate)),
                grade: pole.grade,
                poleData: pole,
            });
            feature.setId(pole.id);   // ── 추가: ID로 나중에 찾기 쉽게
            return feature;
        });

        vectorSourceRef.current.addFeatures(features);
    }, [poles, visibleGrades]);

    // ── 추가: 초기 선택 전주 설정 ──
    useEffect(() => {
        if (!initialPoleId || !poles.length) return;
        if (!vectorSourceRef.current || !selectInteractionRef.current || !mapRef.current) return;

        // 1. 데이터에서 해당 전주 찾기
        const targetPole = poles.find((p) => p.id === initialPoleId);
        if (!targetPole) {
            console.warn(`초기 전주 ID '${initialPoleId}'를 찾을 수 없습니다.`);
            return;
        }

        // 2. 상세 패널에 정보 표시
        setSelectedPole(targetPole);

        // 3. 지도 중심을 해당 전주 위치로 이동 + 부드럽게 애니메이션
        const view = mapRef.current.getView();
        view.animate({
            center: fromLonLat(targetPole.coordinate),
            zoom: 18,
            duration: 800,
        });

        // 4. Feature를 Select 인터랙션에 추가 (파란 테두리 하이라이트 유지)
        //    Feature가 아직 addFeatures로 추가되기 전일 수 있어 setTimeout으로 지연
        setTimeout(() => {
            const feature = vectorSourceRef.current.getFeatureById(initialPoleId);
            if (feature) {
                const selectedFeatures = selectInteractionRef.current.getFeatures();
                selectedFeatures.clear();
                selectedFeatures.push(feature);
            }
        }, 100);
    }, [initialPoleId, poles]);   // poles가 세팅된 후 실행

    // 스타일 함수
    const createPoleStyle = (grade, isSelected = false) => {
        const color = GRADE_COLORS[grade] || '#6b7280';
        return new Style({
            image: new CircleStyle({
                radius: isSelected ? 10 : 7,
                fill: new Fill({ color }),
                stroke: new Stroke({
                    color: '#ffffff',
                    width: 2,
                }),
            }),
        });
    };

    // 등급 필터 토글
    const handleFilterChange = (filterState) => {
        console.log('필터 변경:', filterState);
        // 예: { all: false, S: true, A: false, B: true, C: true, D: true }
        // → 지도나 차트에서 S, B, C, D만 표시하도록 처리
    };

    return (
        <div className={styles.container}>
            {/* 지도 + 상세정보 */}
            <div className={styles.mainArea}>
                {/* 지도 영역 (relative로 기준점) */}
                <div className={styles.mapWrapper}>
                    <div ref={mapContainerRef} className={styles.map} />

                    {/* 좌측 상단: 지역본부/사업소 선택 */}
                    <div className={styles.selectGroup}>
                        <select
                            value={headquarters}
                            onChange={(e) => setHeadquarters(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">지역본부 선택</option>
                            <option value="seoul">서울본부</option>
                            <option value="daejeon">대전세종충남본부</option>
                            <option value="busan">부산울산본부</option>
                        </select>

                        <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">사업소 선택</option>
                            <option value="1">대덕유성지사</option>
                            <option value="2">서대전지사</option>
                        </select>
                    </div>

                    {/* 우측 상단: 등급 필터 */}
                    <SccLegendBox onFilterChange={handleFilterChange}/>
                </div>

                {/* 우측 상세정보 패널 */}
                <div className={styles.detailPanel}>
                    {selectedPole ? (
                        <PoleDetailPanel pole={selectedPole} />
                    ) : (
                        <div className={styles.emptyState}>
                            지도에서 전주를 선택해주세요.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * 전주 상세정보 패널
 */
function PoleDetailPanel({ pole }) {
    const isFail = pole.grade === GRADE.FAIL;

    return (
        <div className={styles.detailContent}>
            {/* 설비정보 섹션 */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>설비정보</h3>
                <div className={styles.infoText}>{pole.주소}</div>
                {pole.cpInfo && <div className={styles.infoText}>{pole.cpInfo}</div>}
                <dl className={styles.infoList}>
                    {pole.poleType && (
                        <div className={styles.infoRow}>
                            <dt>전주형태:</dt>
                            <dd>{pole.poleType} / 전주규격: {pole.poleSize}</dd>
                        </div>
                    )}
                    <div className={styles.infoRow}>
                        <dt>전산화번호:</dt>
                        <dd>{pole.id}</dd>
                    </div>
                    {pole.gid && (
                        <div className={styles.infoRow}>
                            <dt>설비 GID:</dt>
                            <dd>{pole.gid}</dd>
                        </div>
                    )}
                </dl>
            </section>

            {/* 설치 이력 */}
            <section className={styles.section}>
                <div className={styles.subTitle}>설치년월</div>
                <div className={styles.bigText} style={{ color: '#dc2626' }}>
                    {pole.설치기간}
                    <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>
                        ({pole.설치년월})
                    </span>
                </div>

                <div className={styles.subTitle}>최근 평가일자</div>
                <div className={styles.infoText}>{pole.최근평가일자}</div>
            </section>

            {/* SCC 평가결과 */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                    종합 평가결과
                </h3>
                <div style={{float:'right'}}>
                    <TextButton
                        label="상세보기"
                        type="button"
                        size="sm"
                        icon={Search}
                    />
                </div>

                <div
                    className={styles.gradeBadge}
                    style={{
                        color: '#2563eb',
                        fontWeight: 'bold',
                        fontSize: 20,
                    }}
                >
                    57.25 점 | 정기진단(D)
                </div>

                <div>
                    <MultiGauegFeature />
                </div>

            </section>
        </div>
    );
}

function SccLegendBox({ onFilterChange }) {
    // 등급 정의
    const grades = [
        { code: 'S', name: '즉시위험',  range: '90점 이상',      color: '#ef4444' },
        { code: 'A', name: '고위험',    range: '80점 ~ 89점',    color: '#f97316' },
        { code: 'B', name: '중위험',    range: '70점 ~ 79점',    color: '#fbbf24' },
        { code: 'C', name: '저위험',    range: '60점 ~ 69점',    color: '#06b6d4' },
        { code: 'D', name: '정기진단',  range: '60점 미만',      color: '#9ca3af' },
    ];

    // 체크 상태
    const [checked, setChecked] = useState({
        all: true,
        S: true,
        A: true,
        B: true,
        C: true,
        D: true,
    });

    // 전체 토글
    const toggleAll = () => {
        const newValue = !checked.all;
        const newState = {
            all: newValue,
            S: newValue,
            A: newValue,
            B: newValue,
            C: newValue,
            D: newValue,
        };
        setChecked(newState);
        onFilterChange?.(newState);
    };

    // 개별 항목 토글
    const toggleGrade = (code) => {
        const newState = {
            ...checked,
            [code]: !checked[code],
        };
        // 개별 상태로 전체 여부 재계산
        newState.all = grades.every((g) => newState[g.code]);
        setChecked(newState);
        onFilterChange?.(newState);
    };

    return (
        <div className={styles.box}>
            {/* 헤더 */}
            <div className={styles.header}>SCC 평가결과</div>

            {/* 전체 행 */}
            <label className={styles.row}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={checked.all}
                    onChange={toggleAll}
                />
                <span className={styles.dot} style={{ background: '#000000' }} />
                <span className={styles.label}>전체</span>
            </label>

            {/* 등급별 행 */}
            {grades.map((grade) => (
                <label key={grade.code} className={styles.row}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={checked[grade.code]}
                        onChange={() => toggleGrade(grade.code)}
                    />
                    <span
                        className={styles.dot}
                        style={{ background: grade.color }}
                    />
                    <span className={styles.label}>{grade.name}</span>
                    <span className={styles.range}>{grade.range}</span>
                </label>
            ))}
        </div>
    );
}