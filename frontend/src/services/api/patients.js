import api from './axios'

export const patientsApi = {
  getPatients: (params) => api.get('/patients/', { params }),
  getPatientById: (id) => api.get(`/patients/${id}/`),
  createPatient: (data) => api.post('/patients/', data),
  updatePatient: (id, data) => api.put(`/patients/${id}/`, data),
  deletePatient: (id) => api.delete(`/patients/${id}/`),
}

export default patientsApi
