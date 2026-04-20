import apiClient from '@/services/api.js'

/**
 * 자료실 API 서비스
 * Feature: features/archive/ArchiveFeature.jsx
 */
export const archiveApi = {
  getList:  (params) => apiClient.get('/archive/list', { params }).then(r => r.data),
  getOne:   (id)     => apiClient.get(`/archive/${id}`).then(r => r.data),
  create:   (data)   => apiClient.post('/archive', data, {
    headers: { 'Content-Type': 'multipart/form-data' },  // 파일 첨부 시 multipart
  }).then(r => r.data),
  update:   (id, d)  => apiClient.put(`/archive/${id}`, d, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data),
  delete:   (id)     => apiClient.delete(`/archive/${id}`).then(r => r.data),
  downloadFile: async (fileId, fileName) => {
    const response = await apiClient.get(`/archive/file/${fileId}`, { responseType: 'blob' })
    const url  = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}

export const ARCHIVE_KEYS = {
  all:    ['archive'],
  list:   (params) => ['archive', 'list', params],
  detail: (id)     => ['archive', 'detail', id],
}
