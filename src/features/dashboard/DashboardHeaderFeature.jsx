import React, {useState} from 'react'
import styles from './DashboardHeaderFeature.module.css';
import SelectInput from "@/components/input/SelectInput";

const BONBU_OPTIONS = [
    { label:'서울본부',         value:'SEOUL'   },
    { label:'인천본부',         value:'INCHEON' },
    { label:'경기북부본부',     value:'GGB'     },
    { label:'경기남부본부',     value:'GGS'     },
    { label:'강원본부',         value:'GW'      },
    { label:'충북본부',         value:'CB'      },
    { label:'대전세종충남본부', value:'DSCN'    },
    { label:'전북본부',         value:'JB'      },
    { label:'광주전남본부',     value:'GJN'     },
    { label:'대구경북본부',     value:'DGB'     },
    { label:'부산본부',         value:'BUSAN'   },
    { label:'경남본부',         value:'GN'      },
    { label:'울산본부',         value:'ULSAN'   },
    { label:'제주본부',         value:'JEJU'    },
];

const SABUPSO_MAP = {
    SEOUL:   [{ label:'강남지사', value:'S01' }, { label:'강동지사', value:'S02' }, { label:'강서지사', value:'S03' }, { label:'강북지사', value:'S04' }, { label:'종로지사', value:'S05' }, { label:'동작지사', value:'S06' }, { label:'서초지사', value:'S07' }],
    INCHEON: [{ label:'인천남부지사', value:'IC01' }, { label:'인천북부지사', value:'IC02' }, { label:'부천지사', value:'IC03' }, { label:'김포지사', value:'IC04' }],
    GGB:     [{ label:'의정부지사', value:'GB01' }, { label:'고양지사', value:'GB02' }, { label:'양주지사', value:'GB03' }, { label:'파주지사', value:'GB04' }],
    GGS:     [{ label:'수원지사', value:'GS01' }, { label:'성남지사', value:'GS02' }, { label:'안양지사', value:'GS03' }, { label:'화성지사', value:'GS04' }],
    GW:      [{ label:'춘천지사', value:'GW01' }, { label:'원주지사', value:'GW02' }, { label:'강릉지사', value:'GW03' }],
    CB:      [{ label:'청주지사', value:'CB01' }, { label:'충주지사', value:'CB02' }, { label:'제천지사', value:'CB03' }],
    DSCN:    [{ label:'대전지사', value:'DJ01' }, { label:'세종지사', value:'DJ02' }, { label:'천안지사', value:'DJ03' }, { label:'아산지사', value:'DJ04' }],
    JB:      [{ label:'전주지사', value:'JB01' }, { label:'군산지사', value:'JB02' }, { label:'익산지사', value:'JB03' }],
    GJN:     [{ label:'광주지사', value:'GJ01' }, { label:'목포지사', value:'GJ02' }, { label:'여수지사', value:'GJ03' }],
    DGB:     [{ label:'대구지사', value:'DG01' }, { label:'경산지사', value:'DG02' }, { label:'구미지사', value:'DG03' }, { label:'포항지사', value:'DG04' }],
    BUSAN:   [{ label:'부산북부지사', value:'BS01' }, { label:'부산남부지사', value:'BS02' }, { label:'해운대지사', value:'BS03' }],
    GN:      [{ label:'창원지사', value:'GN01' }, { label:'진주지사', value:'GN02' }, { label:'통영지사', value:'GN03' }],
    ULSAN:   [{ label:'울산지사', value:'US01' }, { label:'울주지사', value:'US02' }],
    JEJU:    [{ label:'제주지사', value:'JJ01' }, { label:'서귀포지사', value:'JJ02' }],
};

const INIT_SEARCH = { bonbu:'', sabupso:'', month:''};

/**
 * 대시보드 해더 피처
 * @param mainTitle(String default '') 제목
 * @param subTitle(String default '') 부제목
 * @param showFilter(boolean default false) 필터링 여부
 * @returns {JSX.Element}
 * @constructor
 */
export default function DashboardHeaderFeature({mainTitle='', subTitle='', showFilter=false}) {
    const [search, setSearch] = useState(INIT_SEARCH);
    const sabupsoOptions = SABUPSO_MAP[search.bonbu] ?? [];

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;

    return (
        <div className={styles.dashboardHeader}>
            <div className={styles.dashboardTitle}>
                <div className={styles.dashboardDot} />
                <span className={styles.dashboardTitleMain} >{mainTitle}</span>
                <span className={styles.dashboardTitleSub} >{subTitle}</span>
            </div>
            <div className={styles.dashboardDate} >
                {showFilter ? (
                    <>
                        <SelectInput placeholder="지역본부" value={search.bonbu} options={BONBU_OPTIONS} onChange={e => setSearch(s => ({ ...s, bonbu: e.target.value, sabupso: '' }))}/>
                        <SelectInput placeholder="사업소" value={search.sabupso} onChange={e => setSearch(s => ({ ...s, sabupso:     e.target.value }))} options={sabupsoOptions} disabled={!search.bonbu}/>
                        <SelectInput placeholder="평가년월" value={search.month} options={[{label:'4월', value:'4'}]}/>
                    </>
                ) : ''}
                <span className={styles.dashboardDateText}>마지막 평가일자 {dateStr}</span>
            </div>
        </div>
    )
}
