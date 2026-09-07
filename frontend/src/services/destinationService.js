import api from './api'
import { DESTINATIONS } from '../utils/mockData'

export const destinationService = {
  async getAll(params = {}) {
    try {
      const response = await api.get('/destinations', { params })
      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        return response.data.data
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch (e) {
      console.warn('Backend destinations API error, using fallback:', e.message)
    }

    let list = [...DESTINATIONS]
    if (params.region && params.region !== 'All' && params.region !== 'all') {
      list = list.filter((d) => d.region?.toLowerCase() === params.region.toLowerCase())
    }
    if (params.search) {
      const q = params.search.toLowerCase()
      list = list.filter((d) => d.name?.toLowerCase().includes(q) || d.country?.toLowerCase().includes(q))
    }
    return list
  },

  async getBySlug(slug) {
    try {
      const response = await api.get(`/destinations/${slug}`)
      if (response.data?.success && response.data.data) {
        return response.data.data
      } else if (response.data) {
        return response.data
      }
    } catch (e) {
      // Fallback to local
    }
    return DESTINATIONS.find((d) => d.slug === slug || d.id === slug) || null
  },

  async create(destinationData) {
    const response = await api.post('/destinations', destinationData)
    return response.data
  },

  async update(id, destinationData) {
    const response = await api.put(`/destinations/${id}`, destinationData)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/destinations/${id}`)
    return response.data
  },
}

export default destinationService

