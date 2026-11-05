import api from './api'
import { TESTIMONIALS } from '../utils/mockData'

export const reviewService = {
  /**
   * Fetch approved public testimonials for home page & vacation planner
   */
  async getPublic() {
    try {
      const response = await api.get('/reviews/public')
      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data
      }
    } catch (err) {
      console.warn('Failed to load public reviews from API, using fallback:', err.message)
    }
    return TESTIMONIALS
  },

  /**
   * Fetch all reviews (Admin)
   */
  async getAll(params = {}) {
    const response = await api.get('/reviews', { params })
    return response.data
  },

  /**
   * Update review status (Admin)
   */
  async updateStatus(id, status) {
    const response = await api.patch(`/reviews/${id}/status`, { status })
    return response.data
  },

  /**
   * Delete review (Admin)
   */
  async deleteReview(id) {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  },
}

export default reviewService

