import axios from 'axios'

/**
 * Helper to get a cookie value by name.
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

/**
 * Pre-configured Axios instance for API communication.
 *
 * - Base URL points to /api/v1.
 * - withCredentials: true sends HttpOnly authentication cookies with every request.
 * - X-CSRFToken header automatically attached for state-changing requests.
 */
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach CSRF token for mutating requests
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

// Response interceptor — handle 401 (attempt token refresh via HttpOnly cookie)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Avoid infinite loop if refresh endpoint itself fails with 401
    if (originalRequest?.url?.includes('/auth/refresh/') || originalRequest?.url?.includes('/auth/login/')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt cookie-based token refresh
        await axios.post('/api/v1/auth/refresh/', {}, { withCredentials: true })
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed — user needs to log in again
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
