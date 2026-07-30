import api from './axios'

export const settingsApi = {
  getSettings: () => api.get('/auth/me/'),
  updateProfile: (data) => api.put('/auth/me/', data),
}

export default settingsApi
