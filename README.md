# PMS Front — 개발 표준 가이드

> **이 문서는 팀 개발 시 일관성을 유지하기 위한 필수 표준입니다.**
> 새로운 화면/기능을 개발하기 전에 반드시 숙지하세요.

---

## 목차

1. [프로젝트 실행](#1-프로젝트-실행)
2. [기술 스택](#2-기술-스택)
3. [폴더 구조 & 네이밍 규칙](#3-폴더-구조--네이밍-규칙)
4. [아키텍처 패턴](#4-아키텍처-패턴)
5. [상태 관리 전략](#5-상태-관리-전략)
6. [새 화면 개발 절차](#6-새-화면-개발-절차)
7. [공통 컴포넌트 사용 규칙](#7-공통-컴포넌트-사용-규칙)
8. [레이아웃 & 스타일 규칙](#8-레이아웃--스타일-규칙)
9. [API 호출 규칙](#9-api-호출-규칙)
10. [그리드 사용 규칙](#10-그리드-사용-규칙-ag-grid)
11. [사이드바 메뉴 추가](#11-사이드바-메뉴-추가)
12. [서버 배포](#12-서버-배포-apache--nginx)
13. [대시보드 차트 구성](#13-대시보드-차트-구성)
14. [GIS 지도 사용 규칙](#14-gis-지도-사용-규칙-openlayers)
15. [세션 만료 처리](#15-세션-만료-처리)
16. [탭 레이아웃 자동 저장/복원](#16-탭-레이아웃-자동-저장복원)
17. [뒤로가기 / 백스페이스 방지](#17-뒤로가기--백스페이스-방지)
18. [금지 사항](#18-금지-사항-dont)
- [부록. 아이콘 사용법](#부록-아이콘-사용법-lucide-react)

---

## 1. 프로젝트 실행

```bash
# 1. 의존성 설치 (최초 1회)
npm install

# 2. 환경변수 설정 (최초 1회)
cp .env.example .env
# .env 파일을 열어 VITE_API_URL 을 백엔드 주소로 변경

# 3. 개발 서버 실행
npm run dev

# 배포용 빌드
npm run build
```

| 명령어 | 설명 |
|---|---|
| `npm run dev`     | 개발 서버 실행. 브라우저 `http://localhost:5173` 접속 |
| `npm run build`   | `dist/` 폴더에 정적 파일 생성 → 서버에 업로드 |
| `npm run preview` | 빌드 결과물 로컬에서 미리보기 |

### 환경변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `VITE_API_URL` | 백엔드 API 서버 주소 | `http://localhost:8080/api` |

### PiP (새 창으로 패널 열기)

사이드바 메뉴 항목 우측의 PiP 버튼 클릭 시 `window.open()` 으로 새 브라우저 창에 해당 패널이 열려요.

> 팝업 차단 시 브라우저 주소창 우측 팝업 차단 아이콘을 클릭해서 허용해주세요.

---

## 2. 기술 스택

| 분류       | 라이브러리           | 버전     | 용도                         |
|----------|-----------------|--------|----------------------------|
| UI 프레임워크 | React           | 19     | 컴포넌트 기반 UI                 |
| MDI 레이아웃 | dockview-react  | 5      | 탭/패널 드래그 레이아웃              |
| 서버 상태 관리 | TanStack Query  | 5      | API 데이터, 캐싱, 로딩 상태         |
| 클라이언트 상태 | Zustand         | 5      | 전역 UI 상태 (테마, 인증 등)        |
| 폼 상태 관리  | React Hook Form | 7      | 폼 입력, 유효성 검사               |
| 스타일      | Tailwind CSS    | 4      | 유틸리티 클래스                   |
| 아이콘      | lucide-react    | -      | 아이콘 (SVG 기반)               |
| 그리드      | AG-Grid         | 35     | 데이터 테이블                    |
| 차트       | Apache ECharts  | 5      | 대시보드 차트 (게이지, 혼합 차트, 히트맵 등) |
| 차트       | Nivo            | 0.99   | 대시보드 차트 (도넛, 라인, 레이더 등)    |
| 지도       | OpenLayers      | 10     | GIS 지도                     |
| HTTP     | Axios           | 1      | API 통신                     |
| 날짜       | Flatpickr       | 4      | 날짜 선택기                     |
| 토스트      | Sonner          | 2      | 토스트 알림                     |
| 에디터      | MDXEditor       | 3.54.0 | 텍스트 입력 에디터                 |
| 웹소켓      | stompjs         | 7.3.0  | 클라이언트 웹소켓            |
| Excel    | exceljs         | 4.4.0  | 엑셀 랜더링                |
| 빌드       | Vite            | 7      | 개발 서버 / 번들러                |

---

## 3. 폴더 구조 & 네이밍 규칙

### 전체 폴더 구조

```
src/
├── components/              # 순수 재사용 UI 컴포넌트 — props만 받아 렌더링, 자체 상태·데이터 없음
│   ├── button/
│   │   └── BasicButton.jsx
│   ├── feedback/
│   │   ├── ErrorBoundary.jsx          # 렌더 에러 격리
│   │   └── QueryState.jsx             # LoadingState / ErrorState
│   ├── grid/
│   │   ├── BasicGrid.jsx              # AG Grid 래퍼 (paginate / infinite)
│   │   ├── FormDrawer.jsx             # 등록·수정·상세 사이드 드로어
│   │   ├── GridActionButtons.jsx      # 상세·수정·삭제 버튼 셀 렌더러
│   │   └── GridDetailDrawer.jsx       # 행 클릭 상세 드로어
│   ├── input/
│   │   ├── TextInput.jsx
│   │   ├── SelectInput.jsx
│   │   ├── DateInput.jsx
│   │   ├── EmailInput.jsx
│   │   ├── FileInput.jsx
│   │   ├── CheckboxInput.jsx
│   │   ├── RadioInput.jsx
│   │   └── RangeInput.jsx
│   ├── label/
│   │   └── BasicLabel.jsx
│   ├── modal/
│   │   └── ConfirmModal.jsx           # 삭제 확인 등 공통 확인 모달
│   └── styles/                        # 컴포넌트 CSS Module 모음
│       ├── BasicButton.module.css
│       ├── BasicLabel.module.css
│       ├── CheckboxInput.module.css
│       ├── DateInput.module.css
│       ├── RadioInput.module.css
│       ├── SelectInput.module.css
│       └── TextInput.module.css
│
├── widgets/                 # 독립 UI 모듈 — 자체 데이터·상태 보유, 특정 위치에 고정
│   ├── auth/
│   │   ├── ProfileWidget.jsx        # 우상단 프로필 / 로그아웃
│   │   └── LoginWidget.jsx  # 세션 만료 블러 오버레이
│   ├── job/
│   │   └── JobProgressWidget.jsx      # 탑바 작업 현황 드롭다운
│   └── notification/
│       └── NotificationWidget.jsx     # 탑바 알림 드롭다운
│
├── panels/                  # Dockview 탭 단위 (얇게 유지, useMutation 담당)
│   ├── archive/ArchivePanel.jsx
│   ├── dashboard/DashboardPanel.jsx
│   ├── gis/GisPanel.jsx
│   ├── grid/GridPanel.jsx
│   ├── login/LoginPanel.jsx
│   ├── readme/ReadmePanel.jsx
│   └── sample/SamplePanel.jsx
│
├── features/                # 비즈니스 로직 + UI 조합 (useQuery, useForm 사용)
│   ├── archive/
│   │   └── ArchiveFeature.jsx         # 자료실 목록·등록·상세
│   ├── dashboard/
│   │   ├── DashboardFeature.jsx
│   │   ├── KpiFeature.jsx
│   │   ├── StatusChartFeature.jsx
│   │   ├── MonthlyChartFeature.jsx
│   │   ├── TrendChartFeature.jsx
│   │   ├── DeptChartFeature.jsx
│   │   └── lib/                       # 차트 공통 컴포넌트·유틸
│   │       ├── DashboardComponents.jsx
│   │       └── dashboardUtils.js
│   ├── gis/GisFeature.jsx
│   ├── grid/GridFeature.jsx
│   ├── login/LoginFeature.jsx
│   └── sample/              # 컴포넌트 쇼케이스 (서비스 없음)
│       ├── TextInputFeature.jsx
│       ├── SelectInputFeature.jsx
│       ├── DateInputFeature.jsx
│       ├── EmailInputFeature.jsx
│       ├── FileInputFeature.jsx
│       ├── CheckboxRadioFeature.jsx
│       ├── RangeInputFeature.jsx
│       ├── ButtonFeature.jsx
│       ├── LabelFeature.jsx
│       ├── BasicGridFeature.jsx
│       ├── GridActionButtonsFeature.jsx
│       ├── ConfirmModalFeature.jsx
│       ├── ToastFeature.jsx
│       └── ErrorBoundaryFeature.jsx
│
├── services/                # API 함수 — features 폴더 구조와 1:1 대응
│   ├── api.js               # axios 인스턴스 (공통, 수정 금지)
│   ├── archive/archiveService.js  ↔  features/archive/
│   ├── gis/gisService.js          ↔  features/gis/
│   ├── grid/gridService.js        ↔  features/grid/
│   └── login/loginService.js      ↔  features/login/
│
├── store/useAppStore.js     # Zustand 전역 상태 (테마, 사이드바, 인증, 세션)
├── lib/queryClient.js       # TanStack Query 전역 클라이언트 설정
├── styles/
│   ├── index.css            # CSS 변수(테마), 전역 리셋
│   ├── layout.module.css    # 앱 레이아웃 CSS Module
│   └── dockview.css         # Dockview 테마 오버라이드
├── layout              # App.jsx 에 랜더링 될 레이아웃
│   ├── login               # 로그인
│   ├────── LoginLayout.jsx     # 로그인 레이아웃 
│   └── app                 # App
│       ├── AppLayout.jsx       # App 레이아웃 (탑 + 왼쪽메뉴 + 탭(Dockview))
│       ├── ContentArea.jsx     # 탭(Dockview) 영역
│       ├── LeftArea.jsx        # 왼쪽메뉴 영역
│       └── TopArea.jsx         # 탑 영역
├── App.jsx     # 레이아웃 랜더링 
└── main.jsx    # React 진입점 + QueryClientProvider
```

### 네이밍 규칙

> **Feature 이름 = Panel 이름 = Service 폴더명 = Service 파일명**

```
도메인: archive
  panels/archive/ArchivePanel.jsx
  features/archive/ArchiveFeature.jsx
  services/archive/archiveService.js

도메인: grid
  panels/grid/GridPanel.jsx
  features/grid/GridFeature.jsx
  services/grid/gridService.js
```

### 새 도메인 추가 패턴

```
panels/equipment/EquipmentPanel.jsx
features/equipment/EquipmentFeature.jsx
services/equipment/equipmentService.js   ← API 있을 경우만
```

### API 없는 Feature는 Service 생략

```
features/sample/TextInputFeature.jsx  →  services 없음
features/sample/ButtonFeature.jsx     →  services 없음
```

---

## 4. 아키텍처 패턴

### 레이어 구조

```
┌─────────────────────────────────────────────────┐
│  panels/   Dockview 탭 단위. useMutation 담당    │
│    └── features/   비즈니스 로직 + UI            │
│          ├── useQuery / useForm 사용             │
│          └── components/   순수 UI (props만)     │
│                                                  │
│  widgets/  탑바·전역 고정 UI 모듈                │
│                                                  │
│  services/ API 호출 함수 모음 ──────────────────►│ 백엔드
│    └── features 에서만 호출 (직접 호출 금지)     │
└─────────────────────────────────────────────────┘
```

### 각 레이어 역할

| 레이어 | 역할 | 아는 것 | 모르는 것 |
|--------|------|---------|----------|
| `panels/` | 탭 마운트, useMutation | Feature | API URL |
| `features/` | UI + 쿼리 + 폼 | Component, Service | 탭 구조 |
| `components/` | 스타일 고정 UI | props | 데이터, 도메인 |
| `widgets/` | 탑바·전역 독립 모듈 | Store, Service | 탭 구조 |
| `services/` | API URL + HTTP 호출 | axios | React |

### services/ 와 features/ 를 분리하는 이유

```
services/ = "어디에 요청하냐"  (URL, HTTP 메서드, 파라미터)
features/ = "그 결과로 뭘 하냐" (화면 렌더링, 상태 관리, 폼 처리)
```

```js
// services/grid/gridService.js — React 를 전혀 모름
export const gridApi = {
  getList: (params) => apiClient.get('/work/list', { params }).then(r => r.data),
  create:  (data)   => apiClient.post('/work', data).then(r => r.data),
}

// features/grid/GridFeature.jsx — 서비스를 가져다 씀
const { data } = useQuery({
  queryKey: ['grid', 'list', applied],
  queryFn:  () => gridApi.getList(applied),  // ← 서비스 호출
})
```

이렇게 분리하면:
- API URL 변경 시 → `gridService.js` 한 곳만 수정
- 같은 API를 여러 Feature에서 쓸 때 → `gridApi.getList()` 재사용
- 백엔드 없이 개발할 때 → service 파일만 mock 으로 교체
- Feature 가 길어져도 → URL·파라미터 걱정 없이 UI 로직에 집중

### 코드 예시

```jsx
// ── Panel — useMutation 으로 서버 데이터 변경 ──────────────────────────────
export default function ArchivePanel() {
  const queryClient = useQueryClient()
  const createMutation = useMutation({
    mutationFn: (data) => archiveApi.create(data),
    onSuccess:  ()     => queryClient.invalidateQueries({ queryKey: ['archive'] }),
  })
  return <ArchiveFeature onCreate={createMutation.mutate} />
}

// ── Feature — useQuery 로 조회, useForm 으로 폼 관리 ──────────────────────
export default function ArchiveFeature({ onCreate }) {
  const { data } = useQuery({
    queryKey: ['archive', 'list'],
    queryFn:  () => archiveApi.getList(),
  })
  const { register, handleSubmit } = useForm()
  // ...
}

// ── Component — props 만 받고 스타일 내부 고정 ─────────────────────────────
export default function TextInput({ label, value, onChange }) {
  return ( /* 스타일 고정, 도메인 모름 */ )
}
```

### 새 위젯 추가 패턴

탑바·전역에 고정되는 독립 UI 모듈은 `widgets/`에 추가합니다.

**언제 `widgets/`에 만드나**

| 조건 | 예시 |
|------|------|
| 탑바·전역 고정 위치에 마운트 | 알림, 작업현황, 프로필 |
| Dockview 탭이 아닌 오버레이·드롭다운 | 세션 만료 오버레이 |
| `useAppStore` 또는 자체 데이터를 직접 보유 | WebSocket 데이터, 전역 상태 |

**추가 절차**

```
1. src/widgets/{도메인}/{위젯명}Widget.jsx  생성
2. App.jsx 탑바에 직접 마운트
```

```jsx
// 1. src/widgets/search/GlobalSearchWidget.jsx 생성
export default function GlobalSearchWidget({ open, onClose }) {
  // 자체 상태·데이터 보유 가능
}

// 2. App.jsx 탑바에 마운트
import GlobalSearchWidget from '@/widgets/search/GlobalSearchWidget.jsx'

<GlobalSearchWidget open={searchOpen} onClose={() => setSearchOpen(false)} />
```

> `widgets/`는 `panels/`와 달리 `PANEL_COMPONENTS`·`MENU_GROUPS` 등록이 필요 없습니다.

---

## 5. 상태 관리 전략

```
서버 상태  (API 데이터)      → TanStack Query  useQuery / useMutation
등록·수정 폼 (유효성 검사)   → React Hook Form useForm
전역 UI 상태 (테마, 인증)    → Zustand         useAppStore
검색 조건·로컬 UI 상태       → useState
```

### Zustand (useAppStore)

```js
import { useAppStore } from '@/store/useAppStore.js'

const { theme, toggleTheme }         = useAppStore()
const { sidebarOpen, toggleSidebar } = useAppStore()
const { user, token, setAuth }       = useAppStore()
```

### TanStack Query (useQuery)

```jsx
import { useQuery } from '@tanstack/react-query'
import { gridApi, GRID_KEYS } from '@/services/grid/gridService.js'

const { data, isLoading, isError } = useQuery({
  queryKey: GRID_KEYS.list(params),
  queryFn:  () => gridApi.getList(params),
  staleTime: 1000 * 60,
})
```

### TanStack Query (useMutation)

```jsx
const saveMutation = useMutation({
  mutationFn: (data) => gridApi.create(data),
  onSuccess:  ()     => queryClient.invalidateQueries({ queryKey: GRID_KEYS.all }),
  onError:    (err)  => alert(err.message),
})

saveMutation.mutate(formData)
saveMutation.isPending  // 저장 중 여부
```

### 폼 상태 관리 — useForm vs useState

> 모든 입력 폼에 `useForm`을 쓰는 게 아니다. **용도에 따라 구분한다.**

| 상황 | 방식 | 이유 |
|------|------|------|
| 등록 / 수정 폼 | `useForm` | 유효성 검사, 에러 메시지, 제출 로딩 상태 필요 |
| 검색 / 필터 폼 | `useState` | 유효성 검사 불필요, 단순 조건값 관리 |
| 모달 열림·탭 선택 등 UI 상태 | `useState` | 서버·폼과 무관한 로컬 상태 |

**등록·수정 폼 → useForm 사용**

```jsx
// ✅ 유효성 검사, 에러 메시지, 제출 중 로딩이 필요한 경우
const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
  defaultValues: { name: '', category: '' },
})

<TextInput label="이름" {...register('name', { required: '필수 항목입니다.' })} />
{errors.name && <span>{errors.name.message}</span>}

<BasicButton label="저장" disabled={isSubmitting} onClick={handleSubmit(onSave)} />
```

**검색·필터 폼 → useState 사용**

```jsx
// ✅ 조회 조건은 유효성 검사가 없으므로 useState로 충분
const [search, setSearch] = useState({ name: '', category: '', dateFrom: '' })

<TextInput
  label="담당자"
  value={search.name}
  onChange={e => setSearch(s => ({ ...s, name: e.target.value }))}
/>
<BasicButton label="조회" onClick={() => setApplied({ ...search })} />
```

---

## 6. 새 화면 개발 절차

### Step 1 — 파일 생성

```
src/
├── services/equipment/equipmentService.js
├── features/equipment/EquipmentFeature.jsx
└── panels/equipment/EquipmentPanel.jsx
```

### Step 2 — Service 작성

```js
// services/equipment/equipmentService.js
import apiClient from '@/services/api.js'

export const equipmentApi = {
  getList: (params) => apiClient.get('/equipment/list', { params }).then(r => r.data),
  create:  (data)   => apiClient.post('/equipment', data).then(r => r.data),
  update:  (id, d)  => apiClient.put(`/equipment/${id}`, d).then(r => r.data),
  delete:  (id)     => apiClient.delete(`/equipment/${id}`).then(r => r.data),
}

export const EQUIPMENT_KEYS = {
  all:  ['equipment'],
  list: (params) => ['equipment', 'list', params],
}
```

### Step 3 — Feature 작성

```jsx
// features/equipment/EquipmentFeature.jsx
import { useQuery } from '@tanstack/react-query'
import { equipmentApi, EQUIPMENT_KEYS } from '@/services/equipment/equipmentService.js'

export default function EquipmentFeature({ onSave }) {
  const [applied, setApplied] = useState({ name: '' })

  const { data, isLoading } = useQuery({
    queryKey: EQUIPMENT_KEYS.list(applied),
    queryFn:  () => equipmentApi.getList(applied),
  })

  return (
    <div className="panel-container">
      <div className="panel-toolbar" style={{ gap:10 }}>
        <div style={{ display:'grid', gridTemplateColumns:'160px', gap:10 }}>
          <TextInput label="장비명" value={applied.name}
            onChange={e => setApplied(s => ({ ...s, name: e.target.value }))} />
        </div>
        <BasicButton label="조회" icon={Search} onClick={() => setApplied({...applied})} />
      </div>
      <div style={{ flex:1, overflow:'hidden' }}>
        <BasicGrid mode="paginate" rowData={data?.list ?? []} colDefs={colDefs} height="100%" />
      </div>
    </div>
  )
}
```

### Step 4 — Panel 작성

```jsx
// panels/equipment/EquipmentPanel.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import EquipmentFeature from '@/features/equipment/EquipmentFeature.jsx'
import { equipmentApi, EQUIPMENT_KEYS } from '@/services/equipment/equipmentService.js'

export default function EquipmentPanel() {
  const queryClient  = useQueryClient()
  const saveMutation = useMutation({
    mutationFn: equipmentApi.create,
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEYS.all }),
    onError:    (e) => alert(e.message),
  })
  return <EquipmentFeature onSave={saveMutation.mutate} />
}
```

### Step 5 — App.jsx 등록

```jsx
import EquipmentPanel from '@/panels/equipment/EquipmentPanel.jsx'

const PANEL_COMPONENTS = { equipmentPanel: EquipmentPanel }

// MENU_GROUPS children 에 추가
{ id: 'equipmentPanel', label: '장비 관리', icon: Settings, component: 'equipmentPanel' }
```

---

## 7. 공통 컴포넌트 사용 규칙

### 핵심 원칙

> 컴포넌트는 기본 스타일이 고정되어 있습니다.
> 외부에서 스타일을 덮어쓰지 말고, 값(데이터)만 전달하세요.

### BasicButton

```jsx
// variant: primary | secondary | danger | ghost | success | warning
// size:    sm | md | lg
<BasicButton label="저장"   variant="primary"   icon={Save}   onClick={handleSave}   />
<BasicButton label="조회"   variant="primary"   icon={Search} onClick={handleSearch} />
<BasicButton label="삭제"   variant="danger"    icon={Trash2} onClick={handleDelete} />
<BasicButton label="저장"   type="submit" />
<BasicButton label="비활성" disabled />
```

### Input 컴포넌트

```jsx
// 단순 사용
<TextInput label="이름" value={name} onChange={e => setName(e.target.value)} isNotNull />

// React Hook Form 연동
<TextInput label="이름" {...register('name', { required: '필수 항목입니다.' })} />
```

### BasicGrid

```jsx
// 페이징 (수백 건 이하)
<BasicGrid mode="paginate" rowData={data?.list ?? []} colDefs={colDefs} height="100%" pageSize={20} />

// 무한 스크롤 (수천 건 이상)
<BasicGrid mode="infinite" datasource={datasource} colDefs={colDefs} height="100%" />
```

### Toast 알림 (sonner)

> `alert()` 대신 항상 `toast`를 사용한다. alert는 UI를 차단하고 디자인이 맞지 않는다.

```jsx
import { toast } from 'sonner'

toast.success('저장이 완료되었습니다.')   // ✅ 초록 — 성공
toast.error('저장에 실패했습니다.')       // ❌ 빨강 — 오류
toast.warning('주의가 필요합니다.')       // ⚠ 노랑 — 경고
toast.info('엑셀 다운로드를 시작합니다.') // ℹ 파랑 — 정보
```

- `Toaster`는 `App.jsx` 최상단에 전역 등록되어 있으므로 별도 설정 불필요
- 3초 후 자동으로 사라지며, 닫기 버튼으로 수동 닫기 가능

### ConfirmModal

> 삭제·초기화 등 되돌릴 수 없는 작업에는 반드시 ConfirmModal을 사용한다.

```jsx
import ConfirmModal from '@/components/modal/ConfirmModal.jsx'

// 상태
const [confirmOpen,   setConfirmOpen]   = useState(false)
const [confirmTarget, setConfirmTarget] = useState(null)

// 열기
const handleDeleteClick = (data) => {
  setConfirmTarget(data)
  setConfirmOpen(true)
}

// 확인
const handleConfirm = () => {
  // 삭제 로직
  toast.success(`${confirmTarget.name} 삭제 완료`)
  setConfirmOpen(false)
}

// JSX
<ConfirmModal
  open={confirmOpen}
  variant="danger"
  title="삭제 확인"
  message="정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다."
  onConfirm={handleConfirm}
  onCancel={() => setConfirmOpen(false)}
/>
```

| variant | 색상 | 기본 확인 버튼 텍스트 | 사용 상황 |
|---------|------|--------------------|---------|
| `danger`  | 빨강 | 삭제 | 삭제, 초기화 |
| `warning` | 노랑 | 확인 | 저장 전 경고 |
| `info`    | 파랑 | 확인 | 일반 확인 |
| `success` | 초록 | 확인 | 완료 처리 |

- ESC 키 및 오버레이 클릭으로 닫기 가능
- `confirmText` prop으로 버튼 텍스트 커스텀 가능

---

### ErrorBoundary (패널 레벨 에러 처리)

> API 오류 발생 시 탭 전체를 에러 UI로 교체한다. 컴포넌트 단위 에러 처리는 금지.

**적용 위치: Panel 컴포넌트**

```jsx
// GridPanel.jsx
import ErrorBoundary from '@/components/feedback/ErrorBoundary.jsx'

export default function GridPanel() {
  return (
    <ErrorBoundary>
      <GridFeature />
    </ErrorBoundary>
  )
}
```

**Feature의 useQuery에 throwOnError 추가**

```jsx
const { data, isLoading } = useQuery({
  queryKey: ['work', 'list', applied],
  throwOnError: true,   // 에러 발생 시 ErrorBoundary로 전파
  queryFn: async () => { ... },
})
```

**동작 흐름**
```
useQuery에서 에러 발생
  → throwOnError: true 로 에러를 위로 던짐
  → Panel의 ErrorBoundary가 캐치
  → 탭 전체가 에러 UI로 교체
  → "다시 시도" 클릭 시 컴포넌트 트리 재마운트
```

- 대시보드처럼 여러 위젯이 있어도 하나라도 에러나면 탭 전체 에러 처리
- 새 Panel 추가 시 반드시 `ErrorBoundary`로 감쌀 것

---

### Suspense (위젯 단위 로딩 처리)

> 차트/위젯 등 조회가 필요한 피처에서 사용한다. 그리드는 AG Grid `loading` prop을 사용한다.

**패턴: Panel은 그대로, 차트 영역만 Suspense로 감싸기**

```jsx
// StatusChartFeature.jsx
import { Suspense } from 'react'
import { LoadingState } from '@/components/feedback/QueryState.jsx'

function ChartContent() {
  useSuspenseQuery({ ... })  // 로딩 중 Promise throw → Suspense가 캐치
  return <MyChart />
}

export default function StatusChartFeature() {
  return (
    <Panel>
      <SectionHeader title="업무 상태 현황" />
      <Suspense fallback={<LoadingState />}>
        <ChartContent />   {/* 이 안에서만 로딩 */}
      </Suspense>
    </Panel>
  )
}
```

**useQuery vs useSuspenseQuery**

| | useQuery | useSuspenseQuery |
|---|---|---|
| 로딩 처리 | `isLoading` 분기 직접 작성 | Suspense fallback 자동 표시 |
| 에러 처리 | `isError` 분기 직접 작성 | ErrorBoundary 자동 캐치 |
| 사용 위치 | 그리드 패널 | 차트/위젯 피처 |

**동작 흐름**
```
피처 진입
  → Panel + SectionHeader 즉시 렌더링 (레이아웃 틀 표시)
  → useSuspenseQuery 로딩 중 → 차트 영역만 LoadingState 표시
  → 데이터 도착 → 차트로 교체
  → API 에러 → ErrorBoundary가 캐치 → 패널 전체 에러 UI
```

- `useSuspenseQuery`는 반드시 `<Suspense>` 안에서 사용할 것
- 그리드 패널에는 사용하지 않는다 (검색폼이 사라지는 UX 문제)

---

## 8. 스타일 관리 규칙

### 폴더 구조

```
src/
├── components/
│   ├── styles/                      ← 컴포넌트 CSS Module 모음 (퍼블리셔 작업 영역)
│   │   ├── BasicButton.module.css   ← 버튼 스타일
│   │   ├── TextInput.module.css     ← 텍스트 인풋 스타일
│   │   ├── SelectInput.module.css   ← 셀렉트 스타일
│   │   ├── CheckboxInput.module.css ← 체크박스 스타일
│   │   ├── RadioInput.module.css    ← 라디오 스타일
│   │   └── BasicLabel.module.css    ← 라벨/배지 스타일
│   ├── button/BasicButton.jsx
│   ├── input/TextInput.jsx ...
│   └── label/BasicLabel.jsx
│
└── styles/                          ← 전역 CSS (전체 앱에 적용)
    ├── index.css                    ← CSS 변수 정의, 전역 리셋
    ├── global.css                   ← 전역 클래스 (.panel-container 등)
    ├── layout.module.css            ← 탑바/사이드바 레이아웃 (App.jsx 전용)
    └── dockview.css                 ← Dockview 라이브러리 커스텀
```

### CSS Module vs 일반 CSS 구분 기준

| 구분 | 방식 | 이유 |
|---|---|---|
| 컴포넌트 스타일 | **CSS Module** | 클래스명 충돌 방지, 컴포넌트 단위 관리 |
| 전역 변수/리셋 | **일반 CSS** | 전체 앱에 적용되어야 함 |
| 라이브러리 커스텀 | **일반 CSS** | :global() 전역 선택자 필요 |

### CSS Module 사용 방법

```jsx
// BasicButton.jsx — 컴포넌트에서 import
import styles from '../styles/BasicButton.module.css'

// 클래스 적용
<button className={styles.btn}>버튼</button>

// 여러 클래스 조합
<button className={[styles.btn, styles.primary, styles.md].join(' ')}>버튼</button>
```

```css
/* BasicButton.module.css — 퍼블리셔가 수정하는 파일 */
.btn     { display: inline-flex; border-radius: var(--radius-md); }
.primary { background: var(--color-accent); color: #fff; }
.md      { height: 34px; padding: 0 16px; font-size: 13px; }
```

> **퍼블리셔**: `components/styles/` 폴더의 `.module.css` 파일만 수정하면 됩니다.
> JSX 파일은 건드리지 않아도 스타일 변경이 가능합니다.

### CSS 변수 (색상 하드코딩 금지)

CSS Module 안에서도 반드시 CSS 변수를 사용하세요. 다크/라이트 테마가 자동으로 적용됩니다.

```css
/* ✅ 올바른 방법 */
.btn { background: var(--color-accent); color: var(--color-text-primary); }

/* ❌ 금지 — 하드코딩하면 다크모드 대응 불가 */
.btn { background: #2563eb; color: #1f2328; }
```

### 주요 CSS 변수 목록

```css
/* 배경 */
--color-bg-primary       /* 메인 배경 */
--color-bg-secondary     /* 카드, 패널 배경 */
--color-bg-tertiary      /* 인풋, 호버 배경 */
--color-bg-hover         /* 호버 상태 */

/* 텍스트 */
--color-text-primary     /* 기본 텍스트 */
--color-text-secondary   /* 보조 텍스트 */
--color-text-muted       /* 비활성 텍스트 */

/* 테두리 */
--color-border           /* 기본 테두리 */
--color-border-focus     /* 포커스 테두리 */

/* 강조색 */
--color-accent           /* 메인 강조색 (파란색) */
--color-accent-hover     /* 강조색 호버 */
--color-success          /* 성공 (초록) */
--color-warning          /* 경고 (주황) */
--color-danger           /* 위험 (빨강) */
--color-purple           /* 보조 강조 (보라) */

/* 크기 */
--radius-sm / md / lg    /* 모서리 둥글기 */
--shadow-sm / md / lg    /* 그림자 */
--topbar-height          /* 탑바 높이 */
--sidebar-width          /* 사이드바 너비 */
```

### 인라인 스타일 사용 기준

```jsx
/* ✅ 인라인 스타일 허용 — 동적으로 변하는 값 */
<div style={{ width: `${progress}%` }}>진행률</div>
<div style={{ color: isError ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>

/* ❌ 금지 — 정적인 스타일은 반드시 CSS로 */
<div style={{ display:'flex', alignItems:'center', padding:'10px 16px' }}>
```

### 컴포넌트 너비 제어 원칙

```jsx
/* ✅ 부모 grid 컨테이너로 너비 제어 */
<div style={{ display:'grid', gridTemplateColumns:'160px 140px 140px', gap:10 }}>
  <TextInput   label="이름" />
  <SelectInput label="분류" />
  <DateInput   label="날짜" />
</div>

/* ❌ 금지 — 컴포넌트 스타일 직접 덮어쓰기 */
<TextInput style={{ width:160 }} />
```

### 패널 공통 레이아웃 클래스

```jsx
/* global.css 에 정의된 전역 클래스 사용 */
<div className="panel-container">
  <div className="panel-toolbar">
    {/* 검색 조건 + 버튼 */}
  </div>
  <div style={{ flex:1, overflow:'hidden' }}>
    {/* 그리드 또는 메인 컨텐츠 */}
  </div>
</div>
```

---

### 컴포넌트 너비 제어 원칙

```jsx
// ✅ 올바른 방법 — 부모 grid 컨테이너로 너비 제어
<div style={{ display:'grid', gridTemplateColumns:'160px 140px 140px', gap:10 }}>
  <TextInput   label="이름" />
  <SelectInput label="분류" />
  <DateInput   label="날짜" />
</div>

// ❌ 금지 — 컴포넌트 스타일 직접 덮어쓰기
<TextInput style={{ width:160 }} />
```

### CSS 변수 (색상 하드코딩 금지)

```jsx
// ✅ CSS 변수 — 다크/라이트 테마 자동 대응
style={{ color:'var(--color-text-primary)', background:'var(--color-bg-secondary)' }}

// ❌ 금지
style={{ color:'#1f2328', background:'#ffffff' }}
```

### 주요 CSS 변수

```
배경:   --color-bg-primary / secondary / tertiary / hover
텍스트: --color-text-primary / secondary / muted
테두리: --color-border / border-focus
강조:   --color-accent / success / warning / danger / purple
크기:   --radius-sm/md/lg    --shadow-sm/md/lg
```

### 패널 공통 레이아웃

```jsx
<div className="panel-container">
  <div className="panel-toolbar">
    {/* 검색 조건 + 버튼 */}
  </div>
  <div style={{ flex:1, overflow:'hidden' }}>
    {/* 그리드 또는 메인 컨텐츠 */}
  </div>
</div>
```

---

## 9. API 호출 규칙

### Service 파일 패턴

```js
// services/[도메인]/[도메인]Service.js
import apiClient from '@/services/api.js'

export const gridApi = {
  getList: (params) => apiClient.get('/work/list', { params }).then(r => r.data),
  getOne:  (id)     => apiClient.get(`/work/${id}`).then(r => r.data),
  create:  (data)   => apiClient.post('/work', data).then(r => r.data),
  update:  (id, d)  => apiClient.put(`/work/${id}`, d).then(r => r.data),
  delete:  (id)     => apiClient.delete(`/work/${id}`).then(r => r.data),
}

export const GRID_KEYS = {
  all:    ['grid'],
  list:   (params) => ['grid', 'list', params],
  detail: (id)     => ['grid', 'detail', id],
}
```

### 인증 방식 — httpOnly 쿠키 + JWT

> 보안 정책: JWT를 프론트(localStorage 등)에 저장하지 않고 **httpOnly 쿠키**로만 관리

| 항목 | 내용 |
|---|---|
| 토큰 저장 위치 | 백엔드가 httpOnly 쿠키로 발급 (JS 접근 불가) |
| 프론트 보관 | 없음 — `withCredentials: true` 로 브라우저가 자동 포함 |
| 로그인 | 백엔드 `/login` 호출 → 쿠키 발급 → 유저 정보만 Zustand 저장 |
| 로그아웃 | 백엔드 `/logout` 호출 → 쿠키 만료 처리 |
| 401 발생 시 | 로그인 페이지 이동 (PiP 창이면 창 닫기) |

**프론트 연동 (자동 적용)**

```js
// api.js — withCredentials: true 로 모든 요청에 쿠키 자동 포함
// 별도 토큰 처리 불필요
```

**로그인 처리 예시**

```js
import { useAppStore } from '@/store/useAppStore.js'
import apiClient from '@/services/api.js'

const { setAuth } = useAppStore()

const handleLogin = async ({ username, password }) => {
  const user = await apiClient.post('/auth/login', { username, password })
    .then(r => r.data)    // 백엔드: 쿠키 발급 + 유저 정보 반환
  setAuth(user)           // 유저 정보만 Zustand에 저장
}
```

**로그아웃 처리 예시**

```js
const { clearAuth } = useAppStore()

const handleLogout = async () => {
  await apiClient.post('/auth/logout')  // 백엔드에서 쿠키 만료
  clearAuth()
}
```

**백엔드 CORS 필수 설정 (Spring Boot)**

```java
config.setAllowCredentials(true);
config.setAllowedOrigins(List.of("http://localhost:5173"));
// allowedOrigins 에 * 사용 불가 (credentials 와 함께 사용 시 오류)
```

### 기본 설정 (자동 적용)

- `baseURL`: 환경변수 `VITE_API_URL` (기본 `http://localhost:8080/api`)
- `withCredentials: true` — 모든 요청에 쿠키 자동 포함
- 401 응답 시 로그인 페이지 이동

### 엑셀 다운로드

```js
downloadExcel: async (params) => {
  const res  = await apiClient.get('/work/excel', { params, responseType:'blob' })
  const url  = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href  = url
  link.setAttribute('download', '업무현황.xlsx')
  document.body.appendChild(link)
  link.click()
  link.remove()
}
```

---

## 10. 그리드 사용 규칙 (AG-Grid)

### 컬럼 정의 패턴

```js
const colDefs = [
  { field:'id',     headerName:'No',   width:65,  flex:0 },
  { field:'remark', headerName:'비고', flex:1 },
  {
    field:'status', headerName:'상태', width:100, flex:0,
    cellRenderer: ({ value }) => (
      <BasicLabel text={value} variant={STATUS_MAP[value] || 'default'} />
    ),
  },
  {
    field:'createdAt', headerName:'등록일', width:120, flex:0,
    valueFormatter: ({ value }) => value?.substring(0, 10) ?? '',
  },
]
```

### 모드 선택 기준

| 상황 | 모드 |
|---|---|
| 수백 건 이하 | `paginate` |
| 수천 건 이상 | `infinite` |
| 간단한 목록  | `none` |

### GridActionButtons — 로우 액션 버튼

그리드 로우에 버튼이 필요한 경우 `GridActionButtons` 컴포넌트를 사용해요.

```jsx
import GridActionButtons from '@/components/grid/GridActionButtons.jsx'

{
  headerName: '액션', width: 130, flex: 0, sortable: false, filter: false,
  cellRenderer: ({ data }) => (
    <GridActionButtons
      data={data}
      buttons={[
        { type: 'detail', onClick: openDetail },
        { type: 'edit',   onClick: handleEdit },
        { type: 'delete', onClick: handleDelete },
      ]}
    />
  ),
}
```

**기본 제공 타입**

| type | 라벨 | 스타일 |
|---|---|---|
| `detail` | 상세 | ghost |
| `edit` | 수정 | ghost |
| `delete` | 삭제 | danger |
| `download` | 다운 | ghost |
| `copy` | 복사 | ghost |
| `add` | 추가 | ghost |
| `confirm` | 승인 | success |
| `cancel` | 반려 | ghost |
| `run` | 실행 | warning (ghost, 주황) |
| `custom` | 직접 지정 | 직접 지정 |

**조건부 제어**

```jsx
// 특정 조건일 때 버튼 숨기기
{ type: 'edit',   hidden:   d => d.status === '완료' }

// 특정 조건일 때 버튼 비활성화
{ type: 'delete', disabled: d => d.status === '점검중' }
```

### GridDetailPanel — 우측 상세 패널

상세 보기가 필요한 그리드에 사용해요. 로우 클릭 시 오른쪽에서 슬라이드로 열리고, 다른 로우 클릭하면 내용만 교체돼요.

```jsx
import GridDetailPanel from '@/components/grid/GridDetailPanel.jsx'

// 상태
const [detailOpen, setDetailOpen] = useState(false)
const [detailData, setDetailData] = useState(null)

const openDetail  = useCallback(async (row) => {
  const detail = await workApi.getDetail(row.id)  // 백엔드 상세 조회
  setDetailData(detail)
  setDetailOpen(true)
}, [])

const closeDetail = useCallback(() => setDetailOpen(false), [])

// 그리드 + 패널 레이아웃
<div style={{ flex:1, overflow:'hidden', display:'flex' }}>
  <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
    <BasicGrid
      colDefs={colDefs}
      onRowClick={openDetail}
      ...
    />
  </div>
  <GridDetailPanel
    open={detailOpen}
    data={detailData}
    onClose={closeDetail}
    defaultWidth={500}   // 화면마다 조절
    columns={2}          // 기본정보 탭 열 수 1 | 2 | 3
  />
</div>
```

**Props**

| Prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `open` | boolean | - | 패널 열림 여부 |
| `data` | object | - | 로우 데이터 |
| `onClose` | function | - | 닫기 핸들러 |
| `defaultWidth` | number | `420` | 초기 너비 (px), 드래그로 조절 가능 |
| `columns` | number | `1` | 기본정보 탭 열 수 |

> 상세가 없는 그리드는 `GridDetailPanel` 자체를 추가하지 않으면 됩니다.

---

## 11. 사이드바 메뉴 추가

```jsx
// App.jsx MENU_GROUPS 에 추가
{
  id: 'equipment', label: '장비관리', icon: Settings,
  children: [
    { id: 'equipmentPanel', label: '장비 현황', icon: BarChart2, component: 'equipmentPanel' },
  ],
}
```

> `id` 는 전체 메뉴에서 고유해야 합니다.

---

## 12. 대시보드 차트 구성

대시보드는 **Apache ECharts** 와 **Nivo** 두 라이브러리를 병행 사용해요.
두 라이브러리 모두 MIT 라이선스로 상업용/공공기관 무료 사용 가능합니다.

### 라이브러리 선택 기준

| 상황 | 라이브러리 |
|---|---|
| 히트맵, 게이지, 대용량 데이터, Bar+Line 혼합 | **ECharts** |
| 도넛, 스택 바, 라인+Area, 레이더, 커스텀 디자인 | **Nivo** |

### 현재 차트 목록

| 차트 | 라이브러리 | 설명 |
|---|---|---|
| 월별 등록/완료 현황 | ECharts | Bar + 완료율 Line 혼합 (이중 Y축) |
| 완료율 게이지 ×3 | ECharts | 전체/이달/긴급 완료율 |
| 요일×주차 히트맵 | ECharts | 업무 강도 시각화 — ECharts 전용 기능 |
| 업무 상태 도넛 | Nivo | 중앙 텍스트 커스텀 |
| 업무 복잡도×우선순위 | Nivo | 버블/산점도 — 복잡도(X)×우선순위(Y)×담당자수(크기) |
| 주간 처리 추이 | Nivo | 라인 + Area |
| 우선순위 레이더 | Nivo | 이번달 vs 지난달 비교 |

### 새 차트 추가 방법

```jsx
// ECharts 방식 — useEChart 훅 사용
function MyEChart() {
  const ref = useEChart(() => ({
    // ECharts option 객체
    series: [{ type: 'bar', data: [...] }],
  }))
  return <div ref={ref} style={{ flex:1, minHeight:0 }} />
}

// Nivo 방식 — 컴포넌트 직접 사용
function MyNivoChart() {
  const theme = useNivoTheme()  // 다크/라이트 자동 대응 테마
  return (
    <div style={{ flex:1, minHeight:0 }}>
      <ResponsiveBar data={data} theme={theme} ... />
    </div>
  )
}
```

### 패키지 설치

```bash
npm install echarts          # ECharts
npm install @nivo/core       # Nivo 공통
npm install @nivo/bar        # 바 차트
npm install @nivo/pie        # 파이/도넛
npm install @nivo/line       # 라인
npm install @nivo/radar        # 레이더
npm install @nivo/scatterplot  # 산점도/버블
```

---

## 13. 서버 배포 (Apache / Nginx)

### 빌드

```bash
npm run build
# dist/ 폴더 생성됨
```

### Apache 설정

```apache
<VirtualHost *:80>
    ServerName your-server.com
    DocumentRoot /var/www/pms_front/dist

    <Directory /var/www/pms_front/dist>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>

    # SPA — 새로고침 시 404 방지
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>

    # API 프록시 → Spring Boot
    ProxyPass        /api/ http://localhost:8080/api/
    ProxyPassReverse /api/ http://localhost:8080/api/
</VirtualHost>
```

### Nginx 설정

```nginx
server {
    listen 80;
    server_name your-server.com;
    root /var/www/pms_front/dist;
    index index.html;

    # SPA — 새로고침 시 404 방지
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 프록시 → Spring Boot
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 배포 절차

```bash
# 1. 빌드
npm run build

# 2. dist/ 폴더를 서버에 업로드
scp -r dist/ user@server:/var/www/pms_front/

# 3. 웹서버 재시작
sudo systemctl reload apache2   # Apache
sudo nginx -s reload            # Nginx
```

---

## 14. GIS 지도 사용 규칙 (OpenLayers)

> `src/features/gis/GisFeature.jsx` 기준으로 작성된 가이드입니다.
> GeoServer 연동 전까지는 샘플 데이터로 동작하며, 연동 시 WMS/WFS 레이어로 교체하면 됩니다.

### UI 레이아웃

| 위치 | 내용 |
|---|---|
| 좌상단 (top:0, left:0) | 지역본부 / 사업소 위치 이동 셀렉트 |
| 우상단 (top:0, right:0) | 레이어 전환 드롭다운 · 측정 도구 드롭다운 · 캡처 · 전체화면 · 줌 인/아웃 · 줌 레벨 게이지 |
| 좌하단 (bottom:36, left:12) | 측정 결과 (거리 / 각도 / 면적) |
| 하단 | 현재 좌표 · 레이어 배지 |

> 우상단 패널은 유틸리티 버튼과 줌 컨트롤이 하나의 패널로 통합되어 있습니다.
> 레이어 전환·측정 도구는 버튼 클릭 시 드롭다운으로 펼쳐집니다.

---

### 위치 이동 기능 (지역본부 → 사업소)

`REGION_DATA` 배열에 지역본부/사업소 정보를 정의합니다.
사업소 선택 시 `view.animate()`로 부드럽게 해당 좌표로 이동합니다.

```js
// src/features/gis/GisFeature.jsx
const REGION_DATA = [
  {
    id: 'seoul', label: '서울본부',
    offices: [
      { id: 'seoul-gangnam', label: '강남사업소', lon: 127.0471, lat: 37.5172, zoom: 14 },
      // ...
    ],
  },
  // ...
]
```

> **실제 연동 시**: `REGION_DATA` 상수를 API 호출 결과로 교체하면 됩니다.

---

### 측정 도구

우상단 🖊 버튼 클릭 시 드롭다운으로 도구를 선택합니다.

| 도구 | 사용법 |
|---|---|
| 기본 | 기본 포인터 모드 |
| 거리 측정 | 클릭으로 경로 지정, 더블클릭 완료. 구간별 거리 표시 |
| 각도 측정 | **시작점 → 꼭짓점 → 끝점** 순서로 클릭, 꼭짓점에서의 꺾임 각도 표시 |
| 면적 측정 | 클릭으로 영역 지정, 더블클릭 완료. 면적 표시 |
| 마커 찍기 | 클릭 위치에 핀 마커 추가 |
| 초기화 | 측정 결과 + 마커 전체 삭제 |

**ESC 키**: 그리는 중인 도형만 취소, 완료된 측정값은 유지됩니다.
새 측정 도구를 선택하면 이전 측정 결과가 초기화됩니다.

---

### 설비 레이어 (전주 / 전선 / 변전소 / 변압기)

`FACILITY_FEATURES` 배열에 샘플 Feature를 정의합니다.
GeoServer 연동 시 WFS TileLayer로 교체합니다.

```js
// 설비 Feature 구조
new Feature({
  geometry: new Point(fromLonLat([lon, lat])),
  type: '전주',          // 전주 | 전선 | 변압기 | 변전소
  id:   'P-001',
  props: {              // 팝업에 표시될 제원 정보 (key: value)
    관리번호: 'P-001',
    규격:     '16m/400kg',
    상태:     '정상',   // '점검필요' 시 경고색(amber)으로 강조
  },
})
```

**색상 규칙**
- 모든 설비 타입 단일 파란색(`#3b82f6`) 통일
- `상태 = '점검필요'` 인 설비만 amber(`#f59e0b`)로 표시
- 선택(클릭) 시 더 진한 파란색(`#1d4ed8`)으로 강조

**팝업 클릭 시**
설비를 클릭하면 팝업 오버레이가 표시됩니다.
`props` 객체의 key/value가 그대로 제원 테이블로 렌더링됩니다.

---

### 새 설비 타입 추가

1. `FACILITY_FEATURES` 배열에 Feature 추가
2. 팝업은 `props` 객체 그대로 렌더링되므로 별도 코드 수정 불필요

---

### GeoServer 연동 시 교체 포인트

```js
// 현재 (샘플 데이터)
const facilityLayer = new VectorLayer({
  source: facilitySourceRef.current,  // 직접 Feature 배열
})

// GeoServer 연동 후
import TileWMS from 'ol/source/TileWMS'
const facilityLayer = new TileLayer({
  source: new TileWMS({
    url:    'http://[geoserver-host]/geoserver/wms',
    params: { LAYERS: 'workspace:layer_name', TILED: true },
  }),
})
```

---

## 15. 세션 만료 처리

API 응답이 `401 Unauthorized`이면 로그인 오버레이를 자동으로 표시합니다.
로그인 성공 시 오버레이가 닫히고 **열려있던 탭과 작업 상태가 그대로 유지**됩니다.

### 동작 흐름

```
API 401 응답
  → useAppStore.getState().setSessionExpired(true)
  → LoginWidget 표시 (기존 탭 위에 블러 오버레이)
  → 로그인 성공 → setSessionExpired(false) → 오버레이 닫힘
```

### axios interceptor 연동 (실제 API 연동 시)

```js
// src/services/api.js
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAppStore.getState().setSessionExpired(true)  // ← 이 한 줄만 추가
    }
    return Promise.reject(error)
  }
)
```

### 데모 시뮬레이션

컴포넌트 샘플 → **세션 만료 오버레이** 섹션에서 확인할 수 있습니다.

### 관련 파일

| 파일                                    | 역할                                       |
|---------------------------------------|------------------------------------------|
| `src/components/auth/LoginWidget.jsx` | 로그인 Widget UI 컴포넌트                       |
| `src/store/useAppStore.js`            | `sessionExpired`, `setSessionExpired` 상태 |
| `src/App.jsx`                         | 루트에 `<LoginWidget />` 배치       |

---

## 16. 탭 레이아웃 자동 저장/복원

**별도 작업 불필요** — App.jsx에서 자동으로 처리됩니다.

### 저장되는 정보

| 항목 | 내용 |
|------|------|
| 탭 목록 | 열려있던 모든 탭 |
| 탭 순서 | 탭 배치 순서 |
| 분할 레이아웃 | 좌우/상하 분할 위치 및 크기 비율 |
| 활성 탭 | 마지막으로 보고 있던 탭 |

### 동작 방식

```
탭 열기 / 닫기 / 분할 / 활성 탭 변경
  → Dockview api.toJSON() → localStorage('pms-layout') 저장

F5 새로고침 또는 재접속
  → localStorage('pms-layout') 읽기
  → api.fromJSON(saved) → 탭·분할·활성 탭 전부 복원
  → 저장된 레이아웃 없으면 대시보드만 열림
```

### 새 메뉴 추가 시

`PANEL_COMPONENTS`에 컴포넌트를 등록하면 자동으로 저장/복원에 포함됩니다.
별도 코드 추가가 필요 없습니다.

```js
// src/App.jsx
const PANEL_COMPONENTS = {
  dashboardPanel: DashboardPanel,
  archivePanel:   ArchivePanel,
  newPanel:       NewPanel,   // ← 여기에만 추가하면 됨
}
```

---

## 17. 뒤로가기 / 백스페이스 방지

**별도 작업 불필요** — App.jsx에서 전역으로 처리됩니다.

### 처리 대상

| 입력 | 처리 방식 |
|------|-----------|
| 브라우저 뒤로가기 버튼 | `popstate` 이벤트 차단 + 경고 토스트 |
| 키보드 백스페이스 | `input` / `textarea` 외부에서만 차단 + 경고 토스트 |

> input, textarea 안에서 백스페이스는 정상 동작합니다.

---

## 18. 금지 사항 (DON'T)

### ❌ useState 로 API 데이터 관리

```jsx
// 금지
const [data, setData] = useState([])
useEffect(() => { fetch().then(setData) }, [])

// 대신
const { data, isLoading } = useQuery({ queryKey, queryFn })
```

### ❌ useState 로 폼 필드 각각 관리

```jsx
// 금지
const [name, setName]   = useState('')
const [email, setEmail] = useState('')

// 대신
const { register, handleSubmit } = useForm()
```

### ❌ Context 로 전역 상태 만들기

```jsx
// 금지
const ThemeContext = createContext()

// 대신
const { theme, toggleTheme } = useAppStore()
```

### ❌ 컴포넌트 내부 스타일 덮어쓰기

```jsx
<TextInput style={{ width:200 }} />        // ❌
<TextInput />  // ✅ 너비는 부모 grid 컨테이너로
```

### ❌ 색상 하드코딩

```jsx
style={{ color:'#333' }}                        // ❌
style={{ color:'var(--color-text-primary)' }}   // ✅
```

### ❌ API 호출을 Feature에서 직접

```jsx
const res = await apiClient.post('/work', data)  // ❌ Feature 에서 직접 호출 금지
useMutation({ mutationFn: gridApi.create })      // ✅ Panel 에서 useMutation 으로
```

### ❌ 메뉴 id 와 PANEL_COMPONENTS 불일치

```js
// 금지 — 메뉴 id 가 PANEL_COMPONENTS 에 없으면 PiP 빈 화면
{ id: 'equipmentPanel', component: 'gridPanel' }  // PiP → /?panel=equipmentPanel → 빈 화면

// 대신 — PANEL_COMPONENTS 에 반드시 같은 키 등록
const PANEL_COMPONENTS = {
  equipmentPanel: EquipmentPanel,  // ← 메뉴 id 와 동일한 키
}
```

> PiP 가 필요 없는 메뉴(시스템, 설정 등)는 `pip: false` 속성을 추가하세요.
> ```js
> { id: 'settingPanel', label: '설정', component: 'settingPanel', pip: false }
> ```

### ❌ Service 네이밍 규칙 위반

```
features/login/LoginFeature.jsx  →  services/auth/authService.js   // ❌ 불일치
features/login/LoginFeature.jsx  →  services/login/loginService.js // ✅ 일치
```

### ❌ alert() / confirm() 사용

```jsx
alert('저장 완료')                    // ❌ UI 차단, 디자인 불일치
if (confirm('삭제하시겠습니까?')) {}  // ❌

// 대신
toast.success('저장 완료')            // ✅ 토스트 알림
<ConfirmModal variant="danger" ... /> // ✅ 컨펌 모달
```

### ❌ console.log 커밋

```js
console.log('디버그:', data)  // ❌ PR 전 반드시 제거
```

---

## 부록. 아이콘 사용법 (lucide-react)

```jsx
import { Save, Search, Trash2, Plus, Edit, Download } from 'lucide-react'

<BasicButton label="저장" icon={Save} />
<Search size={14} color="var(--color-accent)" />
```

전체 아이콘: [lucide.dev/icons](https://lucide.dev/icons/)

---

*최종 수정: 2026-04-12*
