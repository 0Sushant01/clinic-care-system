import axios from 'axios'

/**
 * Get cookie by name helper
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

/**
 * Primary Axios Instance for Django REST Backend
 *
 * - baseURL: /api/v1
 * - withCredentials: true sends HttpOnly authentication cookies automatically
 * - X-CSRFToken header attached for mutating requests
 */
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor — CSRF token
api.interceptors.request.use(
  (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      const csrfToken = getCookie('csrftoken')
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor — Extract data & handle cookie refresh/403 forbidden
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    if (originalRequest?.url?.includes('/auth/refresh/') || originalRequest?.url?.includes('/auth/login/')) {
      return Promise.reject(error.response?.data || error)
    }

    // Handle 401 Unauthorized -> Refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await axios.post('/api/v1/auth/refresh/', {}, { withCredentials: true })
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(error.response?.data || error)
      }
    }

    // Handle 403 Forbidden -> Permission denied
    if (error.response?.status === 403) {
      return Promise.reject({
        success: false,
        message: 'You do not have permission to perform this action.',
        status: 403,
      })
    }

    return Promise.reject(error.response?.data || { success: false, message: error.message || 'An error occurred' })
  }
)

export default api
