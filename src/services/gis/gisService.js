import apiClient from '@/services/api.js'

/**
 * GIS API 서비스
 * Feature: features/gis/GisFeature.jsx
 */
export const gisApi = {
  // 시설물 목록 조회
  getFeatureList: (params) => apiClient.get('/gis/features', { params }).then(r => r.data),
  // 시설물 단건 조회
  getFeature:     (id)     => apiClient.get(`/gis/features/${id}`).then(r => r.data),
  // 좌표 → 주소 변환 (역지오코딩)
  reverseGeocode: (lon, lat) => apiClient.get('/gis/geocode/reverse', { params: { lon, lat } }).then(r => r.data),
  // 주소 → 좌표 변환
  geocode:        (address)  => apiClient.get('/gis/geocode', { params: { address } }).then(r => r.data),
}

export const GIS_KEYS = {
  all:     ['gis'],
  list:    (params) => ['gis', 'list', params],
  feature: (id)     => ['gis', 'feature', id],
}
