import api from './api'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('tt_auth_token', response.data.token)
      localStorage.setItem('tt_user_data', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    if (response.data.token) {
      localStorage.setItem('tt_auth_token', response.data.token)
      localStorage.setItem('tt_user_data', JSON.stringify(response.data.user))
    }
    return response.data
  },

  getCurrentUser() {
    try {
      const saved = localStorage.getItem('tt_user_data')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  },

  logout() {
    const user = this.getCurrentUser()
    if (user?._id) {
      localStorage.removeItem(`tt_user_bookings_${user._id}`)
      localStorage.removeItem(`user_read_notifications_${user._id}`)
      localStorage.removeItem(`user_cleared_notifications_${user._id}`)
    }
    localStorage.removeItem('tt_auth_token')
    localStorage.removeItem('tt_user_data')
    localStorage.removeItem('tt_user_bookings')
    localStorage.removeItem('tt_user_bookings_guest')
  },
}

export default authService
