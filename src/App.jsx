import React from 'react';
import { DockviewReact } from 'dockview-react';
import LoginPanel from "./panels/login/LoginPanel.jsx";
import 'dockview-react/dist/styles/dockview.css'; // Dockview 기본 테마 CSS

// 1. 각 탭 안에 들어갈 컴포넌트들을 임시로 만듭니다. (나중에 별도 파일로 분리할 예정)
const MapComponent = () => (
  <div style={{ padding: '20px', backgroundColor: '#eef2f3', height: '100%' }}>
    <h3>🗺️ OpenLayers 지도 영역</h3>
    <p>여기에 전주 위치를 표시할 지도가 들어갑니다.</p>
  </div>
);

const GridComponent = () => (
  <div style={{ padding: '20px', backgroundColor: '#fff', height: '100%' }}>
    <h3>📊 AG-Grid 데이터 영역</h3>
    <p>여기에 진단 우선순위 데이터 표가 들어갑니다. (Flatpickr 달력 연동)</p>
  </div>
);

// 2. Dockview에서 사용할 컴포넌트들을 매핑해 줍니다.
const components = {
    mapPanel: MapComponent,
    gridPanel: GridComponent,
    loginPanel: LoginPanel
};

const App = () => {
    // 3. Dockview가 처음 렌더링될 때 실행될 초기 설정
    const onReady = (event) => {
    // API를 통해 화면에 탭을 추가합니다.
    event.api.addPanel({
      id: 'map_1',
      component: 'mapPanel',
      title: '전주 위치 지도',
    });

    event.api.addPanel({
      id: 'grid_1',
      component: 'gridPanel',
      title: '우선순위 데이터 표',
      position: { referencePanel: 'map_1', direction: 'right' }, // 지도의 오른쪽에 분할해서 배치!
    });

    event.api.addPanel({
        id: 'login_1',
        component: 'loginPanel',
        title: '로그인',
        position: { referencePanel: 'grid_1', direction: 'right' }, // 지도의 오른쪽에 분할해서 배치!
    });
};

  return (
    // 전체 화면을 꽉 채우는 컨테이너
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 상단 헤더 영역 */}
      <header style={{ padding: '15px', backgroundColor: '#2c3e50', color: 'white' }}>
        <h2>⚡ 시스템 통합 대시보드</h2>
      </header>

      {/* Dockview 작업 영역 */}
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <DockviewReact
          components={components}
          onReady={onReady}
          className="dockview-theme-light" // 라이트 테마 적용 (dark로 변경 가능)
        />
      </div>
      
    </div>
  );
};

export default App;