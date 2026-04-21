/**
 * Dockview API 모듈 싱글톤.
 * Zustand persist 미들웨어가 직렬화 불가능한 API 객체를 처리할 수 없으므로
 * 모듈 레벨 변수로 관리한다.
 *
 * @author JDJ
 * @since 2026-04-21
 */

let _api = null
let _menuGroup = null

/** ContentArea onReady 에서 호출 */
export function setDockviewApi(api) {
    _api = api
}

/** LeftArea 렌더 함수에서 호출 */
export function setDockviewMenu(menuGroup) {
    _menuGroup = menuGroup
}

/**
 * 패널 오픈 유틸.
 * - 이미 열려있으면 해당 탭으로 포커스
 * - 없으면 새 탭으로 추가
 *
 * @param {{ id: string, params?: object }} panel
 */
export function openDockPanel({ id, params }) {
    if (!_api || !_menuGroup) return

    const existing = _api.panels.find(p => p.id === id)
    if (existing) {
        existing.focus()
        return
    }

    const menu = _menuGroup.flatMap(p => p.children).find(m => m.id === id)
    if (!menu) return

    _api.addPanel({ id, component: menu.component, title: menu.label, ...(params ? { params } : {}) })
}
