import api from './axios'

export const appointmentsApi = {
  getAppointments: (params) => api.get('/appointments/', { params }),
  getAppointmentById: (id) => api.get(`/appointments/${id}/`),
  createAppointment: (data) => api.post('/appointments/', data),
  updateAppointment: (id, data) => api.patch(`/appointments/${id}/`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}/`),
}

export default appointmentsApi
