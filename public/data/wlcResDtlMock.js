/**
 * 풍하중 결과 상세 목업 데이터.
 * API 연동 시 이 파일 전체를 삭제하고 wlcResService.js 의 getDetail() 을 사용할 것.
 *
 * @author JDJ
 * @since 2026-04-21
 */

// ── 샘플 1 — 가공설비·통신기기·지선 없음 ─────────────────────────────────────
export const MOCK_DETAIL = {
    seq: 1,
    calcCode: 'JJ',
    poleTypeName: 'CP700kgf',
    designLoad: 6867,
    regionType: 'III지역',
    gid: 2,
    poleShape: '단주',
    poleResist: 90987.75,
    calcNo: '8027R504',
    poleSize: 16,
    stayAngle: 0,

    poleParams: {
        designLoad: 6867, windLoad: 679.25, embedDepth: 2.5,
        bottomDia: 190, surfaceDia: 370, heightAboveSurface: 13.5,
        taperRate: 0.01333, resistMoment: 90987.75, bendingMoment: 15474.16,
        horizontalAngle: 180, poleSubType: '',
    },

    windCoef: {
        poleTypeVal: 0.95, cableVal: 1.00, transformerVal: 1.00,
        switchVal: 1.00, commCableVal: 1.00, commDeviceVal: 2.30, altCoef: 1.10,
    },

    relatedPoles: [
        { calcCode:'JJ', calcNo:'99999999', gid:0,        maxSpan:0,  actualSpan:30, northAngle:0.00   },
        { calcCode:'JJ', calcNo:'8026A593', gid:3,        maxSpan:0,  actualSpan:31, northAngle:166.55 },
        { calcCode:'JJ', calcNo:'8027R603', gid:36262,    maxSpan:24, actualSpan:24, northAngle:45.94  },
        { calcCode:'JJ', calcNo:'8026A493', gid:18906482, maxSpan:66, actualSpan:42, northAngle:256.44 },
    ],

    supportParams: [
        { calcCode:'JJ', calcNo:'8027R504', gid:4119324, windPress:0, surfaceHeight:0, attachLen:0,
          supportHeight:0, repSurfaceHeight:0, upperDia:0, lowerDia:0, taperRate:0,
          altCoef:0, windCoefPoleType:0, bendingMoment:0 },
    ],

    wireParams: [
        { calcCode:'CN', calcNo:'1860Y572', gid:184992, equipCode:2, windPress:715, span:22, maxSpan:0,
          angle:0, windLen:11, equipName:'고압전선',   installOrder:1, wireArrange:'수평',
          materialType:'EC', materialSpec:58, wireCount:3, dia:15.7, origDia:47.1,
          height:11.6, maxTension:7455.60, mt:4297.12, cableWindCoef:1, altCoef:1.1 },
        { calcCode:'CN', calcNo:'1860Y572', gid:184992, equipCode:4, windPress:715, span:22, maxSpan:0,
          angle:0, windLen:11, equipName:'고압중성선', installOrder:0, wireArrange:'수평',
          materialType:'AL', materialSpec:58, wireCount:1, dia:10.5, origDia:10.5,
          height:10.4, maxTension:7769.52, mt:858.85,  cableWindCoef:1, altCoef:1.1 },
        { calcCode:'CN', calcNo:'1860Y572', gid:184993, equipCode:5, windPress:715, span:22, maxSpan:0,
          angle:0, windLen:11, equipName:'저압전선',   installOrder:2, wireArrange:'수직',
          materialType:'OW', materialSpec:22, wireCount:1, dia:8.4,  origDia:8.4,
          height:10.1, maxTension:3488.43, mt:667.26,  cableWindCoef:1, altCoef:1.1 },
    ],

    aerialParams: [],
    commParams:   [],

    strengthResult: {
        distEquipLoad: 16862.32, aerialEquipLoad: 0.00, poleStrengthTotal: 16862.32,
        stayLoad: 0.00, poleLoad: 16862.32, safetyFactor: 6.60,
        poleJudgeCode: '적합', wireMtSum: 5823.24,
    },

    stayResult: {
        stayExists: 'N', stayStress: 0.00, allowLoad: 0.00,
        judgment: '-', wireType: '-', wireSpec: '-',
    },
}

// ── 샘플 2 — 가공설비·통신기기·지선 포함 ─────────────────────────────────────
export const MOCK_DETAIL_2 = {
    seq: 2,
    calcCode: 'JJ',
    poleTypeName: 'CP1000kgf',
    designLoad: 9810,
    regionType: 'II지역',
    gid: 5,
    poleShape: '단주',
    poleResist: 138600.00,
    calcNo: '8027R601',
    poleSize: 18,
    stayAngle: 45,

    poleParams: {
        designLoad: 9810, windLoad: 824.50, embedDepth: 2.7,
        bottomDia: 210, surfaceDia: 410, heightAboveSurface: 15.0,
        taperRate: 0.01333, resistMoment: 138600.00, bendingMoment: 34512.88,
        horizontalAngle: 90, poleSubType: '',
    },

    windCoef: {
        poleTypeVal: 0.95, cableVal: 1.00, transformerVal: 1.20,
        switchVal: 1.20, commCableVal: 1.00, commDeviceVal: 2.30, altCoef: 1.10,
    },

    relatedPoles: [
        { calcCode:'JJ', calcNo:'99999999', gid:0,        maxSpan:0,  actualSpan:25, northAngle:0.00   },
        { calcCode:'JJ', calcNo:'8027R600', gid:36260,    maxSpan:0,  actualSpan:38, northAngle:182.30 },
        { calcCode:'JJ', calcNo:'8027R602', gid:36263,    maxSpan:36, actualSpan:36, northAngle:2.50   },
        { calcCode:'JJ', calcNo:'8025B401', gid:20174881, maxSpan:72, actualSpan:55, northAngle:91.12  },
        { calcCode:'JJ', calcNo:'8025B301', gid:20174880, maxSpan:72, actualSpan:48, northAngle:270.88 },
    ],

    supportParams: [
        { calcCode:'JJ', calcNo:'8027R601', gid:5204810, windPress:0, surfaceHeight:0, attachLen:0,
          supportHeight:0, repSurfaceHeight:0, upperDia:0, lowerDia:0, taperRate:0,
          altCoef:0, windCoefPoleType:0, bendingMoment:0 },
    ],

    wireParams: [
        { calcCode:'CN', calcNo:'2071A110', gid:291840, equipCode:2, windPress:715, span:36, maxSpan:0,
          angle:0, windLen:18, equipName:'고압전선',   installOrder:1, wireArrange:'수평',
          materialType:'EC', materialSpec:95, wireCount:3, dia:19.6, origDia:58.8,
          height:13.2, maxTension:11285.40, mt:8717.22, cableWindCoef:1, altCoef:1.1 },
        { calcCode:'CN', calcNo:'2071A110', gid:291840, equipCode:4, windPress:715, span:36, maxSpan:0,
          angle:0, windLen:18, equipName:'고압중성선', installOrder:0, wireArrange:'수평',
          materialType:'AL', materialSpec:95, wireCount:1, dia:13.4, origDia:13.4,
          height:12.0, maxTension:12340.20, mt:1523.16, cableWindCoef:1, altCoef:1.1 },
        { calcCode:'CN', calcNo:'2071A110', gid:291841, equipCode:5, windPress:715, span:36, maxSpan:0,
          angle:0, windLen:18, equipName:'저압전선',   installOrder:2, wireArrange:'수직',
          materialType:'OW', materialSpec:38, wireCount:4, dia:9.6,  origDia:38.4,
          height:11.0, maxTension:5184.60, mt:4014.36, cableWindCoef:1, altCoef:1.1 },
        { calcCode:'CN', calcNo:'2071A110', gid:291841, equipCode:6, windPress:715, span:36, maxSpan:0,
          angle:0, windLen:18, equipName:'저압중성선', installOrder:0, wireArrange:'수직',
          materialType:'OW', materialSpec:22, wireCount:1, dia:7.2,  origDia:7.2,
          height:10.6, maxTension:3120.00, mt:514.80,  cableWindCoef:1, altCoef:1.1 },
        { calcCode:'CN', calcNo:'2071A220', gid:291842, equipCode:8, windPress:715, span:48, maxSpan:0,
          angle:90, windLen:24, equipName:'인하선',    installOrder:3, wireArrange:'수직',
          materialType:'OC', materialSpec:22, wireCount:3, dia:8.4,  origDia:25.2,
          height:9.5,  maxTension:2960.00, mt:2413.44, cableWindCoef:1, altCoef:1.1 },
    ],

    aerialParams: [
        { gid:7120044, windPress:715, equipName:'주상변압기', equipTypeCode:'TR', operTypeCode:'',
          capacity:100, dia:530, maxHeight:11.8, minHeight:9.8, subDistDist:350, subDistBotDist:0,
          botHeight:0, busbar:1, equipHeight:2.0, wireHeight:11.8, bendingMoment:11524.30,
          windCoef:1.2, altCoef:1.1 },
        { gid:7120045, windPress:715, equipName:'기중개폐기', equipTypeCode:'ASS', operTypeCode:'MOT',
          capacity:0, dia:240, maxHeight:13.0, minHeight:11.5, subDistDist:0, subDistBotDist:0,
          botHeight:0, busbar:1, equipHeight:1.5, wireHeight:13.0, bendingMoment:4218.75,
          windCoef:1.2, altCoef:1.1 },
    ],

    commParams: [
        { gid:9830120, equipName:'광케이블접속함', equipTypeName:'통신접속함', commProvider:'KT',
          equipDia:180, equipHeight:0.4, minHeight:9.0, mt:386.64,
          windCoef:2.3, altCoef:1.1, windPress:715 },
        { gid:9830121, equipName:'광단말장치',     equipTypeName:'통신단말기', commProvider:'SKT',
          equipDia:150, equipHeight:0.3, minHeight:8.5, mt:291.38,
          windCoef:2.3, altCoef:1.1, windPress:715 },
    ],

    strengthResult: {
        distEquipLoad: 38412.10, aerialEquipLoad: 15743.05, poleStrengthTotal: 54155.15,
        stayLoad: 24369.82, poleLoad: 29785.33, safetyFactor: 4.65,
        poleJudgeCode: '적합', wireMtSum: 17182.98,
    },

    stayResult: {
        stayExists: 'Y', stayStress: 24369.82, allowLoad: 31200.00,
        judgment: '적합', wireType: 'GW', wireSpec: '22',
    },
}
