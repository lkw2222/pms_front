import apiClient from '@/services/api.js'

/**
 * 업무현황 API 서비스
 * Feature: features/grid/GridFeature.jsx
 */
export const gridApi = {
  getList:  (params) => apiClient.get('/work/list', { params }).then(r => r.data),
  getOne:   (id)     => apiClient.get(`/work/${id}`).then(r => r.data),
  create:   (data)   => apiClient.post('/work', data).then(r => r.data),
  update:   (id, d)  => apiClient.put(`/work/${id}`, d).then(r => r.data),
  delete:   (id)     => apiClient.delete(`/work/${id}`).then(r => r.data),
  downloadExcel: async (params) => {
    const response = await apiClient.get('/work/excel', { params, responseType:'blob' })
    const url  = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute('download', '업무현황.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
}

export const GRID_KEYS = {
  all:    ['grid'],
  list:   (params) => ['grid', 'list', params],
  detail: (id)     => ['grid', 'detail', id],
}
