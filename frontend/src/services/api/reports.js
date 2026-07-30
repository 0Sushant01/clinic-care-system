import api from './axios'

export const reportsApi = {
  getReports: (params) => api.get('/reports/', { params }),
}

export default reportsApi
