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
13. [금지 사항](#13-금지-사항-dont)

---

## 1. 프로젝트 실행

```bash
# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev

# 배포용 빌드
npm run build
```

| 명령어 | 설명 |
|---|---|
| `npm run dev`   | 개발 서버 실행. 브라우저 `http://localhost:5173` 접속 |
| `npm run build` | `dist/` 폴더에 정적 파일 생성 → 서버에 업로드 |
| `npm run preview` | 빌드 결과물 로컬에서 미리보기 |

### PiP (새 창으로 패널 열기)

사이드바 메뉴 항목 우측의 PiP 버튼 클릭 시 `window.open()` 으로 새 브라우저 창에 해당 패널이 열려요.

> 팝업 차단 시 브라우저 주소창 우측 팝업 차단 아이콘을 클릭해서 허용해주세요.

---

## 2. 기술 스택

| 분류 | 라이브러리 | 버전 | 용도 |
|---|---|---|---|
| UI 프레임워크 | React | 19 | 컴포넌트 기반 UI |
| MDI 레이아웃 | dockview-react | 5 | 탭/패널 드래그 레이아웃 |
| 서버 상태 관리 | TanStack Query | 5 | API 데이터, 캐싱, 로딩 상태 |
| 클라이언트 상태 | Zustand | 5 | 전역 UI 상태 (테마, 인증 등) |
| 폼 상태 관리 | React Hook Form | 7 | 폼 입력, 유효성 검사 |
| 스타일 | Tailwind CSS | 4 | 유틸리티 클래스 |
| 아이콘 | lucide-react | - | 아이콘 (SVG 기반) |
| 그리드 | AG-Grid | 35 | 데이터 테이블 |
| 지도 | OpenLayers | 10 | GIS 지도 |
| HTTP | Axios | - | API 통신 |
| 날짜 | Flatpickr | - | 날짜 선택기 |
| 빌드 | Vite | 7 | 개발 서버 / 번들러 |

---

## 3. 폴더 구조 & 네이밍 규칙

### 전체 폴더 구조

```
src/
├── components/              # 공통 재사용 UI 컴포넌트 (스타일 고정)
│   ├── button/BasicButton.jsx
│   ├── input/               # TextInput, SelectInput, DateInput ...
│   ├── grid/BasicGrid.jsx
│   └── label/BasicLabel.jsx
│
├── panels/                  # Dockview 탭 단위 (얇게 유지, useMutation 담당)
│   ├── login/LoginPanel.jsx
│   ├── grid/GridPanel.jsx
│   └── gis/GisPanel.jsx
│
├── features/                # 비즈니스 로직 + UI 조합 (useQuery, useForm 사용)
│   ├── login/LoginFeature.jsx
│   ├── grid/GridFeature.jsx
│   ├── gis/GisFeature.jsx
│   └── sample/              # 컴포넌트 쇼케이스 (서비스 없음)
│       ├── TextInputFeature.jsx
│       ├── ButtonFeature.jsx
│       └── ...
│
├── services/                # API 함수 — features 폴더 구조와 1:1 대응
│   ├── api.js               # axios 인스턴스 (공통, 수정 금지)
│   ├── login/loginService.js    ↔  features/login/
│   ├── grid/gridService.js      ↔  features/grid/
│   └── gis/gisService.js        ↔  features/gis/
│
├── store/useAppStore.js     # Zustand 전역 상태 (테마, 사이드바, 인증)
├── lib/queryClient.js       # TanStack Query 전역 클라이언트 설정
├── styles/
│   ├── index.css            # CSS 변수(테마), 전역 리셋
│   └── dockview.css         # Dockview 테마 오버라이드
├── App.jsx                  # 레이아웃 (탑바 + 사이드바 + Dockview)
└── main.jsx                 # React 진입점 + QueryClientProvider
```

### 네이밍 규칙

> **Feature 이름 = Panel 이름 = Service 폴더명 = Service 파일명**

```
도메인: login
  panels/login/LoginPanel.jsx
  features/login/LoginFeature.jsx
  services/login/loginService.js

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
```

---

## 4. 아키텍처 패턴

```
panels/          ← Dockview 탭 단위. useMutation 담당, 얇게 유지
  └── features/  ← 비즈니스 로직 + UI. useQuery / useForm 사용
        └── components/  ← 순수 UI (스타일만, 로직 없음)
```

```jsx
// Panel — useMutation 으로 서버 데이터 변경
export default function LoginPanel() {
  const loginMutation = useMutation({
    mutationFn: ({ id, password }) => loginApi.login(id, password),
    onSuccess:  (result) => setAuth(result.user, result.token),
    onError:    (err)    => alert(err.message),
  })
  return <LoginFeature onLogin={loginMutation.mutate} />
}

// Feature — useQuery 로 조회 + useForm 으로 폼 관리
export default function GridFeature() {
  const { data, isLoading } = useQuery({
    queryKey: GRID_KEYS.list(applied),
    queryFn:  () => gridApi.getList(applied),
  })
  // ...
}

// Component — 값(props)만 받고 스타일은 내부 고정
export default function TextInput({ label, value, onChange, ...props }) {
  return ( /* 스타일 고정 */ )
}
```

---

## 5. 상태 관리 전략

```
서버 상태  (API 데이터)      → TanStack Query  useQuery / useMutation
폼 상태    (입력값, 유효성)   → React Hook Form useForm
전역 UI 상태 (테마, 인증)    → Zustand         useAppStore
로컬 UI 상태 (모달 열림 등)  → useState
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

### React Hook Form (useForm)

```jsx
const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
  defaultValues: { name: '', category: '' },
})

// TextInput 에 register 연동 (...props 로 자동 전달)
<TextInput label="이름" {...register('name', { required: '필수 항목입니다.' })} />
{errors.name && <span>{errors.name.message}</span>}
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

### 기본 설정 (자동 적용)

- `baseURL`: `http://localhost:8080/api`
- JWT 토큰 자동 헤더 첨부 (`Authorization: Bearer {token}`)
- 401 응답 시 토큰 자동 제거

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

## 14. 금지 사항 (DON'T)

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

*최종 수정: 2026-03-18*
