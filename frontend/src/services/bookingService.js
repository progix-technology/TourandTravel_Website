import api from './api'

const getUserStorageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('tt_user_data') || '{}')
    return user?._id ? `tt_user_bookings_${user._id}` : 'tt_user_bookings_guest'
  } catch {
    return 'tt_user_bookings_guest'
  }
}

export const bookingService = {
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', bookingData)
      let created = null
      if (response.data?.success && response.data.data) {
        created = response.data.data
      } else if (response.data) {
        created = response.data
      }

      if (created) {
        try {
          const key = getUserStorageKey()
          const existing = JSON.parse(localStorage.getItem(key) || '[]')
          const filtered = Array.isArray(existing)
            ? existing.filter(
                (b) =>
                  (b._id || b.id) !== (created._id || created.id) &&
                  (b.bookingReference || '') !== (created.bookingReference || '')
              )
            : []
          localStorage.setItem(key, JSON.stringify([created, ...filtered]))
        } catch {
          // ignore
        }
        return created
      }
    } catch {
      // Mock booking persistence in user-scoped localStorage
      const key = getUserStorageKey()
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      const newBooking = {
        id: 'TT-' + Math.floor(100000 + Math.random() * 900000),
        bookingReference: 'TT-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
        paymentStatus: bookingData.paymentMethod?.includes('Zero-Deposit') ? 'Zero-Deposit Hold' : 'Paid',
        ...bookingData,
      }
      if (Array.isArray(existing)) {
        existing.unshift(newBooking)
        localStorage.setItem(key, JSON.stringify(existing))
      }
      return newBooking
    }
  },

  async getUserBookings() {
    const token = localStorage.getItem('tt_auth_token')
    const key = getUserStorageKey()

    try {
      const response = await api.get('/bookings/my')
      if (response.data?.success && Array.isArray(response.data.data)) {
        const serverBookings = response.data.data
        try {
          localStorage.setItem(key, JSON.stringify(serverBookings))
        } catch {}
        return serverBookings
      } else if (Array.isArray(response.data)) {
        const serverBookings = response.data
        try {
          localStorage.setItem(key, JSON.stringify(serverBookings))
        } catch {}
        return serverBookings
      }
    } catch (err) {
      console.warn('Could not fetch server bookings:', err?.message || err)
    }

    // Only check user-scoped storage if offline/failed
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Fallback
    }

    // Clean legacy shared key if exists
    try {
      localStorage.removeItem('tt_user_bookings')
    } catch {}

    return []
  },

  async cancelBooking(bookingId) {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`)
      return response.data?.data || response.data
    } catch {
      try {
        const existing = JSON.parse(localStorage.getItem('tt_user_bookings') || '[]')
        if (Array.isArray(existing)) {
          const updated = existing.map((b) => (b.id === bookingId || b._id === bookingId ? { ...b, status: 'Cancelled' } : b))
          localStorage.setItem('tt_user_bookings', JSON.stringify(updated))
        }
      } catch {}
      return { success: true }
    }
  },
}

export default bookingService
