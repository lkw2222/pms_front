import apiClient from '@/services/api.js'

export const wlcExecuteLogApi = {
    getList:   (params) => apiClient.get('/wlc/execute-log/list', { params }).then(r => r.data),
    getDetail: (id)     => apiClient.get(`/wlc/execute-log/${id}`).then(r => r.data),
}

export const WLC_LOG_KEYS = {
    all:    ['wlc', 'execute-log'],
    list:   (params) => ['wlc', 'execute-log', 'list', params],
    detail: (id)     => ['wlc', 'execute-log', 'detail', id],
}
