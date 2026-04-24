import apiClient from '@/services/api.js'

export const sccResultApi = {
    getList:    (params) => apiClient.get('/scc/result/list', { params }).then(r => r.data),
    download:   (params) => apiClient.get('/scc/result/download', { params, responseType: 'blob' }).then(r => r.data),
    getDetail:  (id)     => apiClient.get(`/scc/result/${id}`).then(r => r.data),
}

export const SCC_RESULT_KEYS = {
    all:    ['scc', 'result'],
    list:   (params) => ['scc', 'result', 'list', params],
    detail: (id)     => ['scc', 'result', 'detail', id],
}
