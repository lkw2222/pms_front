import React, {useEffect, useRef, useState} from 'react'
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import styles             from '@/features/wlc/wlcResDist/WlcResDistMapFeature.module.css';

/**
 * 풍하중 평과결과 분포도 맵
 * 풍하중 평과결과 분포도 맵 차트 조회
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
export default function WlcResDistMapFeature() {
    const chartRef = useRef(null);
    const [sidoGeo, setSidoGeo] = useState(null);
    const [sigGeo, setSigGeo] = useState(null);
    const [currentView, setCurrentView] = useState({ level: 'sido', code: null });
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/data/sido.json').then((r) => r.json()),
            fetch('/data/sig.json').then((r) => r.json()),
        ])
            .then(([sido, sig]) => {
                sido.features.forEach((f) => {
                    f.properties.name = f.properties.CTP_KOR_NM;
                });
                sig.features.forEach((f) => {
                    f.properties.name = f.properties.SIG_KOR_NM;
                });
                echarts.registerMap('korea-sido', sido);
                setSidoGeo(sido);
                setSigGeo(sig);
            })
            .catch((err) => console.error('지도 로딩 실패:', err));
    }, []);

    const sidoData = [
        { name: '서울', value: 850 },
        { name: '부산', value: 420 },
        { name: '대구', value: 310 },
        { name: '인천', value: 380 },
        { name: '광주', value: 190 },
        { name: '대전', value: 220 },
        { name: '울산', value: 150 },
        { name: '세종', value: 80 },
        { name: '경기도', value: 920 },
        { name: '강원', value: 180 },
        { name: '충북', value: 200 },
        { name: '충남', value: 270 },
        { name: '전북', value: 210 },
        { name: '전남', value: 230 },
        { name: '경북', value: 290 },
        { name: '경남', value: 340 },
        { name: '제주', value: 120 },
    ];

    const sidoNameToCode = {
        '서울': '11', '부산': '26', '대구': '27', '인천': '28',
        '광주': '29', '대전': '30', '울산': '31', '세종': '36',
        '경기도': '41', '강원': '51', '충북': '43', '충남': '44',
        '전북': '52', '전남': '46', '경북': '47', '경남': '48',
        '제주': '50',
    };

    // 부드러운 전환을 위해 짧은 fade-out 후 상태 변경
    const drillDownToSig = (sidoName) => {
        if (!sigGeo) return;
        const code = sidoNameToCode[sidoName];
        if (!code) return;

        const filteredFeatures = sigGeo.features.filter(
            (f) => f.properties.SIG_CD.startsWith(code)
        );
        if (filteredFeatures.length === 0) {
            console.warn(`${sidoName}의 시군구 데이터가 없습니다.`);
            return;
        }

        const filteredGeo = {
            type: 'FeatureCollection',
            features: filteredFeatures,
        };
        const mapName = `sig-${code}`;
        echarts.registerMap(mapName, filteredGeo);

        // 페이드 아웃 → 상태 변경 → 페이드 인
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentView({ level: 'sig', code, mapName, sidoName });
            setIsTransitioning(false);
        }, 150);
    };

    const goBackToSido = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentView({ level: 'sido', code: null });
            setIsTransitioning(false);
        }, 150);
    };

    const buildMainOption = () => {
        if (currentView.level === 'sido') {
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) =>
                        `${params.name}<br/>값: ${params.value ?? '데이터 없음'}`,
                },
                // 일반 애니메이션 (universalTransition 제거)
                animationDuration: 500,
                animationEasing: 'cubicOut',
                series: [{
                    name: '시도',
                    type: 'map',
                    map: 'korea-sido',
                    roam: false,
                    zoom: 1.2,
                    center: [127.8, 36],
                    scaleLimit: { min: 0.8, max: 3 },
                    zlevel: 1,       // 시리즈 자체의 zlevel
                    itemStyle: {
                        areaColor: '#f5f7fa',
                        borderColor: '#d1d9e0',
                        borderWidth: 1,
                    },
                    label: {
                        show: true,
                        color: '#ffffff',
                        backgroundColor: '#2563eb',
                        borderRadius: 12,
                        padding: [4, 10, 4, 10],
                        fontSize: 11,
                        fontWeight: 'bold',
                        z: 10
                    },
                    emphasis: {
                        // 중요: emphasis에서 itemStyle만 바꾸고 label.z는 건드리지 않기
                        itemStyle: { areaColor: '#dbeafe' },
                        label: {
                            color: '#ffffff',
                            backgroundColor: '#1d4ed8',
                            z: 10,    // emphasis 상태에서도 동일하게 유지
                        },
                    },
                    data: sidoData,
                }],
            };
        } else {
            const sigData = sigGeo.features
                .filter((f) => f.properties.SIG_CD.startsWith(currentView.code))
                .map((f) => ({
                    name: f.properties.SIG_KOR_NM,
                    value: Math.floor(Math.random() * 1000),
                }));

            return {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) =>
                        `${params.name}<br/>값: ${params.value ?? '데이터 없음'}`,
                },
                animationDuration: 500,
                animationEasing: 'cubicOut',
                series: [{
                    name: '시군구',
                    type: 'map',
                    map: currentView.mapName,
                    roam: false,
                    scaleLimit: { min: 0.8, max: 5 },
                    zlevel: 1,       // 시리즈 자체의 zlevel
                    itemStyle: {
                        areaColor: '#f5f7fa',
                        borderColor: '#d1d9e0',
                        borderWidth: 1,
                    },
                    label: {
                        show: true,
                        color: '#ffffff',
                        backgroundColor: '#2563eb',
                        borderRadius: 10,
                        padding: [3, 8, 3, 8],
                        fontSize: 10,
                        fontWeight: 'bold',
                        z: 10
                    },
                    emphasis: {
                        // 중요: emphasis에서 itemStyle만 바꾸고 label.z는 건드리지 않기
                        itemStyle: { areaColor: '#dbeafe'},
                        label: {
                            color: '#ffffff',
                            backgroundColor: '#1d4ed8',
                            z: 10,    // emphasis 상태에서도 동일하게 유지
                        },
                    },
                    data: sigData,
                }],
            };
        }
    };

    const buildMiniMapOption = () => {
        return {
            tooltip: { show: false },
            series: [{
                type: 'map',
                map: 'korea-sido',
                roam: false,
                silent: true,
                zoom: 1.1,
                itemStyle: {
                    areaColor: '#e5e7eb',
                    borderColor: '#d1d5db',
                    borderWidth: 0.5,
                },
                label: { show: false },
                data: sidoData.map((item) => ({
                    name: item.name,
                    itemStyle: item.name === currentView.sidoName
                        ? { areaColor: '#3b82f6' }
                        : undefined,
                })),
            }],
        };
    };

    if (!sidoGeo || !sigGeo) {
        return <div style={{ padding: 20 }}>지도 로딩 중...</div>;
    }

    return (
        <div className={styles.wrap} >
            {/* 뒤로가기 버튼 */}
            {currentView.level === 'sig' && (
                <button className={styles.mapBackBtn} onClick={goBackToSido} >
                    ← 돌아가기
                </button>
            )}

            {/* 메인 지도를 감싼 컨테이너에 페이드 적용 */}
            <div className={styles.container} style={{opacity: isTransitioning ? 0 : 1}}>
                <ReactECharts
                    ref={chartRef}
                    option={buildMainOption()}
                    style={{ width: '100%', height: '100%' }}
                    notMerge={true}
                    onEvents={{
                        click: (params) => {
                            if (currentView.level === 'sido') {
                                drillDownToSig(params.name);
                            }
                        },
                    }}
                />
            </div>

            {/* 미니맵 */}
            <div className={styles.miniMap}
                style={{
                    opacity: currentView.level === 'sig' && !isTransitioning ? 1 : 0,
                    transform: currentView.level === 'sig'
                        ? 'translateY(0)'
                        : 'translateY(10px)',
                    pointerEvents: currentView.level === 'sig' ? 'auto' : 'none'
                }}
            >
                {currentView.level === 'sig' && (
                    <>
                        <ReactECharts style={{ width: '100%', height: 140 }} option={buildMiniMapOption()} />
                        <div className={styles.miniMapLabel} >
                            {currentView.sidoName}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}