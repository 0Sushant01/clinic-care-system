import api from './axios'

export const notesApi = {
  getSessionNotes: (params) => api.get('/notes/', { params }),
  getNoteById: (id) => api.get(`/notes/${id}/`),
  createSessionNote: (data) => api.post('/notes/', data),
  generateAISummary: (noteId) => api.post(`/notes/${noteId}/generate-ai-summary/`),
}

export default notesApi
