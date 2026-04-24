/**
 * SCC 평가 결과 상세 목업 데이터.
 * gid 가 짝수 → D등급 샘플(MOCK_DETAIL), 홀수 → B등급 샘플(MOCK_DETAIL_2) 로 분기.
 *
 * API 연동 시 이 파일 전체를 삭제하고 sccResService.js 의 getDetail() 을 사용할 것.
 *
 * @author JDJ
 * @since 2026-04-22
 */

// ── 샘플 1 — D등급 (정기진단) ─────────────────────────────────────────────────
export const MOCK_DETAIL = {
    seq: 1,
    calcCode: 'JJ',
    gid: 2,
    calcNo: '8027R504',
    poleTypeName: 'CP700kgf',
    poleShape: '단주',
    poleSize: 16,
    designLoad: 6867,
    regionType: 'III지역',
    poleResist: 90987.75,
    stayAngle: 0,
    hotRegion: 'III지역, 지역인가밀집',
    coldRegion: '소방인가밀집',

    totalScore: 53.15,
    gradeCode: 'D',
    gradeDesc: '정기진단',
    structScore: 24.40,
    loadScore:   21.60,
    envScore:     4.05,
    opScore:      3.10,

    // [구조안전성 – 40%]  반영점수 : 24.4 점 / 61.00점
    structDetail: {
        weight: 40,
        appliedScore: 24.40,
        totalItemsScore: 61.00,
        items: [
            { name: '노후도',      pct: 30, total: 90.0, applied: 27.0  },
            { name: '물리적 손상', pct: 30, total: 30.0, applied:  9.0  },
            { name: '기울기',      pct: 20, total: 95.0, applied: 19.0  },
            { name: '기초안전',    pct: 20, total: 30.0, applied:  6.0  },
        ],
    },

    // [하중외력 – 30%]  반영점수 : 21.6 점 / 72.00점
    loadDetail: {
        weight: 30,
        appliedScore: 21.60,
        totalItemsScore: 72.00,
        items: [
            { name: '풍하중안전율',    pct: 30, total: 95.0, applied: 28.5 },
            { name: '복합하중 안전율', pct: 30, total: 85.0, applied: 25.5 },
            { name: '합성하중 안전율', pct: 20, total: 90.0, applied: 18.0 },
            { name: '기타외력',        pct: 20, total:  0.0, applied:  0.0 },
        ],
    },

    // [환경부식 – 20%]  반영점수 : 4.05 점 / 20.25점
    envDetail: {
        weight: 20,
        appliedScore: 4.05,
        totalItemsScore: 20.25,
        items: [
            { name: '염해환경',     pct: 35, total: 10.0, applied:  3.5  },
            { name: '습윤/강우',    pct: 25, total: 25.0, applied:  6.25 },
            { name: '콘트리트열화', pct: 15, total: 50.0, applied:  7.5  },
            { name: '대기오염',     pct: 15, total: 20.0, applied:  3.0  },
        ],
    },

    // [운영이력 – 10%]  반영점수 : 3.1 점 / 31.00점
    opDetail: {
        weight: 10,
        appliedScore: 3.10,
        totalItemsScore: 31.00,
        items: [
            { name: '고장이력',   pct: 40, total: 40.0, applied: 16.0 },
            { name: '중요수용가', pct: 60, total: 25.0, applied: 15.0 },
        ],
    },
}

// ── 샘플 2 — B등급 (중위험) ──────────────────────────────────────────────────
export const MOCK_DETAIL_2 = {
    seq: 4,
    calcCode: 'JJ',
    gid: 5,
    calcNo: '8027R507',
    poleTypeName: 'CP700kgf',
    poleShape: '단주',
    poleSize: 16,
    designLoad: 6867,
    regionType: 'II지역',
    poleResist: 95230.50,
    stayAngle: 0,
    hotRegion: 'II지역',
    coldRegion: '일반지역',

    totalScore: 78.50,
    gradeCode: 'B',
    gradeDesc: '중위험',
    structScore: 31.20,
    loadScore:   24.00,
    envScore:    16.20,
    opScore:      7.10,

    // [구조안전성 – 40%]  반영점수 : 31.2 점 / 78.00점
    structDetail: {
        weight: 40,
        appliedScore: 31.20,
        totalItemsScore: 78.00,
        items: [
            { name: '노후도',      pct: 30, total: 80.0, applied: 24.0  },
            { name: '물리적 손상', pct: 30, total: 65.0, applied: 19.5  },
            { name: '기울기',      pct: 20, total: 85.0, applied: 17.0  },
            { name: '기초안전',    pct: 20, total: 87.5, applied: 17.5  },
        ],
    },

    // [하중외력 – 30%]  반영점수 : 24.0 점 / 80.00점
    loadDetail: {
        weight: 30,
        appliedScore: 24.00,
        totalItemsScore: 80.00,
        items: [
            { name: '풍하중안전율',    pct: 30, total: 82.0, applied: 24.6 },
            { name: '복합하중 안전율', pct: 30, total: 78.5, applied: 23.55 },
            { name: '합성하중 안전율', pct: 20, total: 79.1, applied: 15.82 },
            { name: '기타외력',        pct: 20, total: 80.15, applied: 16.03 },
        ],
    },

    // [환경부식 – 20%]  반영점수 : 16.2 점 / 81.00점
    envDetail: {
        weight: 20,
        appliedScore: 16.20,
        totalItemsScore: 81.00,
        items: [
            { name: '염해환경',     pct: 35, total: 80.0, applied: 28.0  },
            { name: '습윤/강우',    pct: 25, total: 83.3, applied: 20.83 },
            { name: '콘트리트열화', pct: 15, total: 80.0, applied: 12.0  },
            { name: '대기오염',     pct: 15, total: 80.0, applied: 12.0  },
        ],
    },

    // [운영이력 – 10%]  반영점수 : 7.1 점 / 71.00점
    opDetail: {
        weight: 10,
        appliedScore: 7.10,
        totalItemsScore: 71.00,
        items: [
            { name: '고장이력',   pct: 40, total: 75.0, applied: 30.0 },
            { name: '중요수용가', pct: 60, total: 68.33, applied: 41.0 },
        ],
    },
}
