import api from './api'
import { TOURS } from '../utils/mockData'

export const tourService = {
  async getAll(params = {}) {
    let list = []
    try {
      const response = await api.get('/tours', { params })
      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        list = response.data.data
      }
    } catch (e) {
      console.warn('Backend tours API error, using fallback:', e.message)
    }

    if (!list || list.length === 0) {
      list = [...TOURS]
    }

    // Client-side filtering safeguard
    if (params.destination && params.destination !== 'All' && params.destination !== 'all') {
      const d = params.destination.toLowerCase().trim()
      const dName = (params.destinationName || '').toLowerCase().trim()
      list = list.filter((t) => {
        const destSlug = (t.destinationSlug || '').toLowerCase()
        const dest = (t.destination || '').toLowerCase()
        const title = (t.title || '').toLowerCase()
        const slug = (t.slug || t.id || '').toLowerCase()
        const country = (t.country || '').toLowerCase()

        return (
          destSlug === d ||
          destSlug.includes(d) ||
          dest.includes(d) ||
          (dName && dest.includes(dName)) ||
          title.includes(d) ||
          (dName && title.includes(dName)) ||
          slug.includes(d) ||
          country.includes(d)
        )
      })
    }

    if (params.category && params.category !== 'All' && params.category !== 'all') {
      list = list.filter((t) => t.category?.toLowerCase().includes(params.category.toLowerCase()))
    }

    if (params.search) {
      const query = params.search.toLowerCase().trim()
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(query) ||
          t.destination?.toLowerCase().includes(query) ||
          t.overview?.toLowerCase().includes(query)
      )
    }

    return list
  },

  getMockBySlug(slug) {
    if (!slug) return null
    const cleanSlug = decodeURIComponent(slug).toLowerCase().trim()
    const hyphenSlug = cleanSlug.replace(/\s+/g, '-')

    // 1. Direct exact match
    let matched = TOURS.find(
      (t) =>
        t.slug?.toLowerCase() === cleanSlug ||
        t.id?.toLowerCase() === cleanSlug ||
        t.slug?.toLowerCase() === hyphenSlug ||
        t.id?.toLowerCase() === hyphenSlug
    )
    if (matched) return matched

    // 2. Destination slug / name match
    matched = TOURS.find(
      (t) =>
        t.destinationSlug?.toLowerCase() === cleanSlug ||
        t.destination?.toLowerCase() === cleanSlug ||
        t.destinationSlug?.toLowerCase() === hyphenSlug ||
        t.destination?.toLowerCase() === hyphenSlug
    )
    if (matched) return matched

    // 3. Keyword / Substring match (e.g. 'dubai-glamour-desert-safari' matches dubai)
    matched = TOURS.find((t) => {
      const dest = (t.destination || '').toLowerCase()
      const destSlug = (t.destinationSlug || '').toLowerCase()
      const title = (t.title || '').toLowerCase()
      const tSlug = (t.slug || '').toLowerCase()
      const id = (t.id || '').toLowerCase()

      return (
        cleanSlug.includes(destSlug) ||
        cleanSlug.includes(dest) ||
        hyphenSlug.includes(destSlug) ||
        cleanSlug.includes(id) ||
        cleanSlug.includes(tSlug) ||
        tSlug.includes(cleanSlug) ||
        title.includes(cleanSlug)
      )
    })
    if (matched) return matched

    // 4. Token intersection match
    const searchTokens = cleanSlug.split(/[-_\s]+/).filter((tok) => tok.length > 2)
    matched = TOURS.find((t) => {
      const fullText = `${t.title} ${t.destination} ${t.slug} ${t.id} ${t.country}`.toLowerCase()
      return searchTokens.some((tok) => fullText.includes(tok))
    })

    return matched || null
  },

  async getBySlug(slug) {
    if (!slug) return null
    try {
      const response = await api.get(`/tours/${encodeURIComponent(slug)}`)
      if (response.data?.success && response.data.data) {
        return response.data.data
      }
    } catch (e) {
      // Fallback
    }
    return this.getMockBySlug(slug) || TOURS[0]
  },

  async create(tourData) {
    const response = await api.post('/tours', tourData)
    return response.data
  },

  async update(id, tourData) {
    const response = await api.put(`/tours/${id}`, tourData)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/tours/${id}`)
    return response.data
  },
}

export default tourService
