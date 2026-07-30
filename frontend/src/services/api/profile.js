import api from './axios'

export const profileApi = {
  getProfile: () => api.get('/profile/'),
  updateProfile: (data) => api.patch('/profile/', data),
  changePassword: (data) => api.post('/profile/change-password/', data),
}

export default profileApi
