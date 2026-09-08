import axios from 'axios'

let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
if (rawUrl) {
  rawUrl = rawUrl.trim().replace(/\/+$/, '')
  if (!rawUrl.endsWith('/api/v1')) {
    rawUrl = `${rawUrl}/api/v1`
  }
}
const API_BASE_URL = rawUrl

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
