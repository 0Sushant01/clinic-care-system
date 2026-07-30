import api from './axios'

export const dashboardApi = {
  getDashboardData: () => api.get('/dashboard/'),
}

export default dashboardApi
