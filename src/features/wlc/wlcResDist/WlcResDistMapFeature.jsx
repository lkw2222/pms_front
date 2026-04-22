import React from 'react'
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

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
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        // /public/data/sido.json 로드
        fetch('/data/sido.json')
            .then((res) => {
                if (!res.ok) throw new Error('GeoJSON 로딩 실패');
                return res.json();
            })
            .then((geoJson) => {
                // 'korea'라는 이름으로 지도 등록
                echarts.registerMap('korea', geoJson);
                setMapReady(true);
            })
            .catch((err) => console.error(err));
    }, []);

    // 시도별 샘플 데이터
    const data = [
        { name: '서울특별시', value: 850 },
        { name: '부산광역시', value: 420 },
        { name: '대구광역시', value: 310 },
        { name: '인천광역시', value: 380 },
        { name: '광주광역시', value: 190 },
        { name: '대전광역시', value: 220 },
        { name: '울산광역시', value: 150 },
        { name: '세종특별자치시', value: 80 },
        { name: '경기도', value: 920 },
        { name: '강원도', value: 180 },
        { name: '충청북도', value: 200 },
        { name: '충청남도', value: 270 },
        { name: '전라북도', value: 210 },
        { name: '전라남도', value: 230 },
        { name: '경상북도', value: 290 },
        { name: '경상남도', value: 340 },
        { name: '제주특별자치도', value: 120 },
    ];

    const option = {
        title: {
            text: '시도별 현황',
            left: 'center',
            textStyle: { fontSize: 18 },
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) =>
                `${params.name}<br/>값: ${params.value ?? '데이터 없음'}`,
        },
        visualMap: {
            min: 0,
            max: 1000,
            left: 'left',
            bottom: 'bottom',
            text: ['높음', '낮음'],
            calculable: true,
            inRange: {
                color: ['#e0f2ff', '#2b6cb0', '#1a365d'],
            },
        },
        series: [
            {
                name: '시도별 수치',
                type: 'map',
                map: 'korea',
                roam: true,
                label: {
                    show: true,
                    fontSize: 10,
                },
                emphasis: {
                    label: { show: true, fontWeight: 'bold' },
                    itemStyle: { areaColor: '#ffd54f' },
                },
                data,
            },
        ],
    };

    if (!mapReady) {
        return <div style={{ padding: 20 }}>지도 로딩 중...</div>;
    }

    return (
        <ReactECharts
            option={option}
            style={{ width: '100%', height: '600px' }}
            onEvents={{
                click: (params) => {
                    console.log('클릭한 지역:', params.name, '값:', params.value);
                },
            }}
        />
    )
}