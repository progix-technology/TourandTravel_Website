import api from './api'

export const customTripService = {
  async submitRequest(data) {
    try {
      const response = await api.post('/custom-trips', data)
      return response.data
    } catch {
      const requests = JSON.parse(localStorage.getItem('tt_custom_trip_requests') || '[]')
      const newReq = {
        id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date().toISOString(),
        ...data,
      }
      requests.unshift(newReq)
      localStorage.setItem('tt_custom_trip_requests', JSON.stringify(requests))
      return { success: true, request: newReq }

    }
  },
}

export const reviewService = {
  async getReviews(tourId) {
    try {
      const response = await api.get(`/reviews?tourId=${tourId}`)
      return response.data
    } catch {
      return []
    }
  },
  async submitReview(tourId, reviewData) {
    try {
      const response = await api.post('/reviews', { tourId, ...reviewData })
      return response.data
    } catch {
      return { success: true }
    }
  },
}

export default { customTripService, reviewService }
