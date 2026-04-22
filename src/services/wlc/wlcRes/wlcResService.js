import apiClient from '@/services/api.js'

export const wlcResultApi = {
    getList:    (params) => apiClient.get('/wlc/result/list', { params }).then(r => r.data),
    download:   (params) => apiClient.get('/wlc/result/download', { params, responseType: 'blob' }).then(r => r.data),
    getDetail:  (id)     => apiClient.get(`/wlc/result/${id}`).then(r => r.data),
}

export const WLC_RESULT_KEYS = {
    all:    ['wlc', 'result'],
    list:   (params) => ['wlc', 'result', 'list', params],
    detail: (id)     => ['wlc', 'result', 'detail', id],
}
