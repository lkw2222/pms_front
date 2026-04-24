/**
 * SCC 결과 드로어 상세 목업 데이터.
 * 관련전주 · 전선 · 가공설비 · 통신기기 카운트 — PK: calcId + seq
 *
 * 목록 API 와 분리된 이유:
 *   목록은 대용량(1000만 건) 조회 → 카운트 서브쿼리 제외로 성능 확보
 *   드로어 클릭 시 단건 조회 → 카운트 포함
 *
 * API 연동 시 이 파일 전체를 삭제하고 sccResService.js 의 getDrawerDetail() 을 사용할 것.
 *
 * @author JDJ
 * @since 2026-04-22
 */

// key: `${calcId}_${seq}`
const DRAWER_DETAIL_MAP = {
    'SCC20260401002_1':  { relatedPoles: 2, wireCount: 3, overheadCount: 5, commCount: 0 },
    'SCC20260401002_2':  { relatedPoles: 3, wireCount: 4, overheadCount: 6, commCount: 1 },
    'SCC20260401002_3':  { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
    'SCC20260401002_4':  { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 1 },
    'SCC20260401002_5':  { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
    'SCC20260320001_6':  { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 2 },
    'SCC20260320001_7':  { relatedPoles: 4, wireCount: 5, overheadCount: 7, commCount: 1 },
    'SCC20260319002_8':  { relatedPoles: 1, wireCount: 2, overheadCount: 2, commCount: 0 },
    'SCC20260319002_9':  { relatedPoles: 2, wireCount: 3, overheadCount: 5, commCount: 1 },
    'SCC20260319002_10': { relatedPoles: 3, wireCount: 4, overheadCount: 6, commCount: 2 },
    'SCC20260315001_11': { relatedPoles: 2, wireCount: 3, overheadCount: 5, commCount: 0 },
    'SCC20260310001_12': { relatedPoles: 3, wireCount: 4, overheadCount: 6, commCount: 1 },
    'SCC20260310001_13': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
    'SCC20260310001_14': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 1 },
    'SCC20260228001_15': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 2 },
    'SCC20260228001_16': { relatedPoles: 3, wireCount: 4, overheadCount: 5, commCount: 1 },
    'SCC20260228001_17': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
    'SCC20260228001_18': { relatedPoles: 4, wireCount: 5, overheadCount: 7, commCount: 3 },
    'SCC20260220001_19': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
    'SCC20260220001_20': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 1 },
    'SCC20260220001_21': { relatedPoles: 1, wireCount: 2, overheadCount: 2, commCount: 0 },
    'SCC20260215001_22': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 1 },
    'SCC20260215001_23': { relatedPoles: 3, wireCount: 4, overheadCount: 5, commCount: 2 },
    'SCC20260215001_24': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
    'SCC20260215001_25': { relatedPoles: 1, wireCount: 2, overheadCount: 2, commCount: 0 },
    'SCC20260210001_26': { relatedPoles: 2, wireCount: 3, overheadCount: 5, commCount: 1 },
    'SCC20260210001_27': { relatedPoles: 4, wireCount: 5, overheadCount: 6, commCount: 2 },
    'SCC20260210001_28': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
    'SCC20260210001_29': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 1 },
    'SCC20260205001_30': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 0 },
    'SCC20260205001_31': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 1 },
    'SCC20260205001_32': { relatedPoles: 2, wireCount: 3, overheadCount: 3, commCount: 0 },
    'SCC20260201001_33': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 1 },
    'SCC20260201001_34': { relatedPoles: 3, wireCount: 4, overheadCount: 5, commCount: 1 },
    'SCC20260201001_35': { relatedPoles: 1, wireCount: 2, overheadCount: 2, commCount: 0 },
    'SCC20260125001_36': { relatedPoles: 2, wireCount: 3, overheadCount: 5, commCount: 2 },
    'SCC20260125001_37': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 1 },
    'SCC20260125001_38': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 0 },
    'SCC20260120001_39': { relatedPoles: 3, wireCount: 4, overheadCount: 6, commCount: 2 },
    'SCC20260120001_40': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
    'SCC20260120001_41': { relatedPoles: 1, wireCount: 2, overheadCount: 2, commCount: 1 },
    'SCC20260115001_42': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 1 },
    'SCC20260115001_43': { relatedPoles: 3, wireCount: 4, overheadCount: 5, commCount: 2 },
    'SCC20260110001_44': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 0 },
    'SCC20260110001_45': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 1 },
    'SCC20260110001_46': { relatedPoles: 4, wireCount: 5, overheadCount: 6, commCount: 2 },
    'SCC20260105001_47': { relatedPoles: 2, wireCount: 3, overheadCount: 4, commCount: 1 },
    'SCC20260105001_48': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
    'SCC20260105001_49': { relatedPoles: 3, wireCount: 4, overheadCount: 5, commCount: 2 },
    'SCC20260105001_50': { relatedPoles: 1, wireCount: 2, overheadCount: 3, commCount: 0 },
}

/**
 * 드로어 상세 목업 조회.
 * 실제 API: GET /api/scc/result/drawer?calcId={calcId}&seq={seq}
 *
 * @param {string} calcId  SCC 산출 ID
 * @param {number} seq     No
 * @returns {Promise<{ relatedPoles, wireCount, overheadCount, commCount }>}
 */
export async function fetchDrawerDetail(calcId, seq) {
    await new Promise(r => setTimeout(r, 150))  // 네트워크 지연 시뮬레이션

    const key = `${calcId}_${seq}`
    const data = DRAWER_DETAIL_MAP[key]

    if (!data) throw new Error(`드로어 데이터 없음: ${key}`)

    return data
}
