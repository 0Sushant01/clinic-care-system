import api from './axios'

export const therapistsApi = {
  getTherapists: (params) => api.get('/therapists/', { params }),
  getTherapistById: (id) => api.get(`/therapists/${id}/`),
  createTherapist: (data) => api.post('/therapists/', data),
}

export default therapistsApi
