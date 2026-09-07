import api from './api'
import { TOURS } from '../utils/mockData'

const LOCAL_STORAGE_KEY = 'tt_custom_tours_overrides'

// Helper to get locally stored overrides
const getLocalOverrides = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    // ignore
  }
  return []
}

// Helper to save locally stored overrides
const saveLocalOverrides = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('tt_tours_updated', { detail: list }))
  } catch (e) {
    // ignore
  }
}

// Helper to merge base list with local overrides
const mergeWithOverrides = (baseList) => {
  const overrides = getLocalOverrides()
  if (!overrides || overrides.length === 0) return baseList

  const merged = [...baseList]
  overrides.forEach((override) => {
    const idx = merged.findIndex(
      (item) =>
        (override._id && (item._id === override._id || item.id === override._id)) ||
        (override.id && (item.id === override.id || item._id === override.id)) ||
        (override.slug && item.slug?.toLowerCase() === override.slug?.toLowerCase()) ||
        (override.title && item.title?.toLowerCase() === override.title?.toLowerCase())
    )

    if (idx !== -1) {
      merged[idx] = { ...merged[idx], ...override }
    } else {
      merged.unshift(override)
    }
  })

  return merged
}

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

    // Merge with any real-time admin edits/overrides
    list = mergeWithOverrides(list)

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

    const allTours = mergeWithOverrides(TOURS)

    // 1. Direct exact match
    let matched = allTours.find(
      (t) =>
        t.slug?.toLowerCase() === cleanSlug ||
        t.id?.toLowerCase() === cleanSlug ||
        (t._id && t._id === cleanSlug) ||
        t.slug?.toLowerCase() === hyphenSlug ||
        t.id?.toLowerCase() === hyphenSlug
    )
    if (matched) return matched

    // 2. Destination slug / name match
    matched = allTours.find(
      (t) =>
        t.destinationSlug?.toLowerCase() === cleanSlug ||
        t.destination?.toLowerCase() === cleanSlug ||
        t.destinationSlug?.toLowerCase() === hyphenSlug ||
        t.destination?.toLowerCase() === hyphenSlug
    )
    if (matched) return matched

    // 3. Keyword / Substring match (e.g. 'dubai-glamour-desert-safari' matches dubai)
    matched = allTours.find((t) => {
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
    matched = allTours.find((t) => {
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
        const fetched = response.data.data
        // Check if we have any local override with newer/specific image
        const overrides = getLocalOverrides()
        const local = overrides.find(
          (o) =>
            (o._id && o._id === fetched._id) ||
            (o.id && (o.id === fetched.id || o.id === fetched._id)) ||
            (o.slug && o.slug.toLowerCase() === fetched.slug?.toLowerCase())
        )
        return local ? { ...fetched, ...local } : fetched
      }
    } catch (e) {
      // Fallback
    }
    return this.getMockBySlug(slug) || TOURS[0]
  },

  async create(tourData) {
    let savedTour = { ...tourData, id: tourData.slug || `tour-${Date.now()}` }
    try {
      const response = await api.post('/tours', tourData)
      if (response.data?.data) {
        savedTour = response.data.data
      }
    } catch (e) {
      console.warn('API tour create warning, saving to local store:', e.message)
    }

    const currentOverrides = getLocalOverrides()
    saveLocalOverrides([savedTour, ...currentOverrides])
    return { success: true, data: savedTour }
  },

  async update(id, tourData) {
    let updatedTour = { ...tourData, _id: id, id }
    try {
      const response = await api.put(`/tours/${id}`, tourData)
      if (response.data?.data) {
        updatedTour = response.data.data
      }
    } catch (e) {
      console.warn('API tour update warning, saving to local store:', e.message)
    }

    const currentOverrides = getLocalOverrides()
    const index = currentOverrides.findIndex(
      (o) =>
        (o._id && o._id === id) ||
        (o.id && (o.id === id || o.id === updatedTour.id)) ||
        (o.slug && o.slug.toLowerCase() === (updatedTour.slug || id).toLowerCase()) ||
        (o.title && o.title.toLowerCase() === (updatedTour.title || '').toLowerCase())
    )

    if (index !== -1) {
      currentOverrides[index] = { ...currentOverrides[index], ...updatedTour }
    } else {
      currentOverrides.push(updatedTour)
    }

    saveLocalOverrides([...currentOverrides])
    return { success: true, data: updatedTour }
  },

  async delete(id) {
    try {
      await api.delete(`/tours/${id}`)
    } catch (e) {
      console.warn('API tour delete warning:', e.message)
    }

    const currentOverrides = getLocalOverrides()
    const filtered = currentOverrides.filter(
      (o) => o._id !== id && o.id !== id && o.slug !== id
    )
    saveLocalOverrides(filtered)
    return { success: true }
  },
}

export default tourService
