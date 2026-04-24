import apiClient from '@/services/api.js'

export const sccExecuteLogApi = {
    getList:   (params) => apiClient.get('/scc/execute-log/list', { params }).then(r => r.data),
    getDetail: (id)     => apiClient.get(`/scc/execute-log/${id}`).then(r => r.data),
}

export const SCC_LOG_KEYS = {
    all:    ['scc', 'execute-log'],
    list:   (params) => ['scc', 'execute-log', 'list', params],
    detail: (id)     => ['scc', 'execute-log', 'detail', id],
}
