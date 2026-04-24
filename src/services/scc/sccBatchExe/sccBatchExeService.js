import apiClient from '@/services/api.js'

export const sccBatchExecuteApi = {
    getBonbuList:   ()      => apiClient.get('/scc/batch/bonbu').then(r => r.data),
    getSabupsoList: (bonbu) => apiClient.get('/scc/batch/sabupso', { params: { bonbu } }).then(r => r.data),
    execute:        (body)  => apiClient.post('/scc/batch/execute', body).then(r => r.data),
}

export const SCC_BATCH_KEYS = {
    bonbuList:   ['scc', 'batch', 'bonbu'],
    sabupsoList: (bonbu) => ['scc', 'batch', 'sabupso', bonbu],
}
