import apiClient from '@/services/api.js'

export const wlcBatchExecuteApi = {
    getBonbuList:   ()      => apiClient.get('/wlc/batch/bonbu').then(r => r.data),
    getSabupsoList: (bonbu) => apiClient.get('/wlc/batch/sabupso', { params: { bonbu } }).then(r => r.data),
    execute:        (body)  => apiClient.post('/wlc/batch/execute', body).then(r => r.data),
}

export const WLC_BATCH_KEYS = {
    bonbuList:   ['wlc', 'batch', 'bonbu'],
    sabupsoList: (bonbu) => ['wlc', 'batch', 'sabupso', bonbu],
}
