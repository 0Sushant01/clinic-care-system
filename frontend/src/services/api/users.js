import api from './axios'

export const usersApi = {
  getUsers: (params) => api.get('/users/', { params }),
  getUserById: (id) => api.get(`/users/${id}/`),
  createUser: (data) => api.post('/users/', data),
  updateUser: (id, data) => api.patch(`/users/${id}/`, data),
  toggleUserActive: (id, isActive) => api.patch(`/users/${id}/`, { is_active: isActive }),
  resetUserPassword: (id, data) => api.post(`/users/${id}/reset-password/`, data),
}

export default usersApi
