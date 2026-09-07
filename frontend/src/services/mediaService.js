import api from './api'
import { GALLERY_PHOTOS } from '../utils/galleryData'
import { GALLERY_ITEMS } from '../utils/mockData'

/**
 * Format raw database media item into rich Gallery Card structure
 */
const formatMediaItem = (item, index = 0) => {
  const cleanTitle =
    item.title ||
    item.filename?.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') ||
    'Expedition Capture'

  const aspectOptions = ['tall', 'wide', 'medium']
  const aspect = aspectOptions[index % aspectOptions.length]
  const heightClassOptions = ['h-[220px]', 'h-[280px]', 'h-[240px]', 'h-[300px]']
  const heightClass = heightClassOptions[index % heightClassOptions.length]

  const location = item.location || 'Global Sanctuary'
  const isIndia =
    location.toLowerCase().includes('india') ||
    cleanTitle.toLowerCase().includes('india') ||
    cleanTitle.toLowerCase().includes('kashmir') ||
    cleanTitle.toLowerCase().includes('rajasthan') ||
    cleanTitle.toLowerCase().includes('kerala') ||
    cleanTitle.toLowerCase().includes('goa') ||
    cleanTitle.toLowerCase().includes('ladakh') ||
    cleanTitle.toLowerCase().includes('manali')

  return {
    id: item._id || `db-media-${index}`,
    _id: item._id,
    title: cleanTitle,
    location: location,
    country: isIndia ? 'India' : 'International',
    category: item.category || 'Mountains & Alpine',
    photographer: 'Expedition Team',
    camera: 'High Resolution Sensor',
    image: item.url,
    url: item.url,
    aspect,
    heightClass,
    likes: Math.floor(Math.random() * 400) + 120,
    isDynamic: true,
    createdAt: item.createdAt,
  }
}

export const mediaService = {
  /**
   * Fetch all gallery photos (combines live DB media + curated baseline items)
   */
  async getAll(params = {}) {
    try {
      const response = await api.get('/media', { params })
      const dbMedia = response.data?.data || []

      if (Array.isArray(dbMedia) && dbMedia.length > 0) {
        // Filter only Image type or files with URL
        const imageItems = dbMedia.filter(
          (m) => (!m.fileType || m.fileType === 'Image') && m.url
        )
        const formattedDbItems = imageItems.map((item, idx) => formatMediaItem(item, idx))

        // Prepend dynamic DB items before baseline curated photos (preventing duplicate IDs)
        const combined = [...formattedDbItems, ...GALLERY_PHOTOS]
        return combined
      }
      return GALLERY_PHOTOS
    } catch (error) {
      console.warn('Live media fetch failed, falling back to static gallery:', error)
      return GALLERY_PHOTOS
    }
  },

  /**
   * Fetch Home section travel gallery items
   */
  async getHomeGallery() {
    try {
      const response = await api.get('/media')
      const dbMedia = response.data?.data || []

      if (Array.isArray(dbMedia) && dbMedia.length > 0) {
        const imageItems = dbMedia.filter(
          (m) => (!m.fileType || m.fileType === 'Image') && m.url
        )
        const formattedDbItems = imageItems.map((item, idx) => formatMediaItem(item, idx))
        return [...formattedDbItems, ...GALLERY_ITEMS]
      }
      return GALLERY_ITEMS
    } catch (error) {
      console.warn('Live home gallery fetch failed, falling back to static items:', error)
      return GALLERY_ITEMS
    }
  },
}

export default mediaService
