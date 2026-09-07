import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  Layers,
  Star,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Upload,
  Calendar,
  Users,
  Check,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  AlertCircle,
  FolderOpen,
  Link as LinkIcon
} from 'lucide-react'
import tourService from '../services/tourService'
import api from '../services/api'

// Curated travel presets for instant gallery selection
const GALLERY_PRESETS = [
  {
    title: 'Kashmir Alpine & Houseboats',
    category: 'Alpine & Nature',
    url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Maldives Overwater Lagoon',
    category: 'Luxury & Beach',
    url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Swiss Alps Glacier Express',
    category: 'Alpine & Nature',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Bali Emerald Rice Terraces',
    category: 'Tropical Sanctuary',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Dubai Futuristic Desert Dunes',
    category: 'Urban & Luxury',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Parisian Seine & Architecture',
    category: 'Culture & Romance',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Rajasthan Royal Fortress',
    category: 'Heritage & Royal',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Tokyo Neon & Ancient Temples',
    category: 'Culture & Urban',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Santorini Sunset & Caldera',
    category: 'Island & Sea',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Iceland Aurora & Crystal Caves',
    category: 'Arctic & Snow',
    url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Amalfi Coast Clifftop Villas',
    category: 'Coastal Luxury',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Ladakh High-Pass Pangong Lake',
    category: 'Himalayan Adventure',
    url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Kerala Backwaters Luxury Cruise',
    category: 'Tropical Nature',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Goa Coastal Villa & Ocean',
    category: 'Beach Retreat',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'Nepal Annapurna Himalayan Trail',
    category: 'Mountain Odyssey',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
  }
]

const DEFAULT_CATEGORIES = [
  'All',
  'Alpine & Mountain',
  'Luxury & Beach',
  'Royal & Heritage',
  'Adventure & Nature',
  'Desert & Safari',
  'Culture & History',
  'Arctic & Snow'
]

const INITIAL_FORM = {
  title: '',
  subtitle: '',
  destination: '',
  country: 'India',
  category: 'Alpine & Mountain',
  duration: '7 Days / 6 Nights',
  days: 7,
  startingPrice: 24999,
  price: 24999,
  rating: 4.9,
  reviewsCount: 120,
  groupSize: 'Max 8 Explorers',
  image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85',
  overview: '',
  highlights: [
    'Private VIP chauffeur airport greeting',
    'Curated 5-star luxury boutique accommodations',
    'Exclusive private guided sightseeing excursions',
    '24/7 dedicated personal concierge assistance'
  ],
  inclusions: [
    'All luxury accommodations and daily breakfast',
    'Private transfers in high-end chauffeured vehicles',
    'Complimentary monument & sanctuary access pass'
  ],
  exclusions: [
    'International and domestic flights',
    'Personal insurance and discretionary tips'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival & Grand Welcome Reception',
      description: 'Private airport arrival and transfer to luxury resort followed by an evening welcome banquet.',
      stay: '5-Star Luxury Resort',
      meals: 'Dinner Included'
    },
    {
      day: 2,
      title: 'Signature Guided Heritage & Nature Tour',
      description: 'Full-day personalized exploration with expert cultural historian.',
      stay: '5-Star Luxury Resort',
      meals: 'Breakfast & Lunch'
    }
  ],
  isFeatured: true
}

export const AdminExpeditions = () => {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTourId, setCurrentTourId] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [modalTab, setModalTab] = useState('general') // 'general' | 'media' | 'itinerary' | 'inclusions'
  const [submitting, setSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Media Picker Sub-Modal State
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false)
  const [gallerySearch, setGallerySearch] = useState('')
  const [mediaLibraryItems, setMediaLibraryItems] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  // Highlights / Inclusions raw text helpers
  const [highlightsText, setHighlightsText] = useState('')
  const [inclusionsText, setInclusionsText] = useState('')
  const [exclusionsText, setExclusionsText] = useState('')

  useEffect(() => {
    fetchTours()
    fetchMediaLibrary()
  }, [])

  const fetchTours = async () => {
    setLoading(true)
    try {
      const data = await tourService.getAll()
      setTours(data || [])
    } catch (error) {
      console.error('Error fetching expeditions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMediaLibrary = async () => {
    try {
      const { data } = await api.get('/media')
      if (data?.success && Array.isArray(data.data)) {
        setMediaLibraryItems(data.data.filter((m) => m.url))
      }
    } catch (e) {
      // ignore
    }
  }

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false)
    setCurrentTourId(null)
    setFormData(INITIAL_FORM)
    setHighlightsText(INITIAL_FORM.highlights.join('\n'))
    setInclusionsText(INITIAL_FORM.inclusions.join('\n'))
    setExclusionsText(INITIAL_FORM.exclusions.join('\n'))
    setModalTab('general')
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (tour) => {
    setIsEditing(true)
    setCurrentTourId(tour._id || tour.id)
    const normalized = {
      ...INITIAL_FORM,
      ...tour,
      startingPrice: tour.startingPrice || tour.price || 24999,
      price: tour.price || tour.startingPrice || 24999,
      days: tour.days || (tour.duration ? parseInt(tour.duration) : 7) || 7,
      highlights: tour.highlights || [],
      inclusions: tour.inclusions || [],
      exclusions: tour.exclusions || [],
      itinerary: (tour.itinerary && tour.itinerary.length > 0) ? tour.itinerary : INITIAL_FORM.itinerary,
      isFeatured: Boolean(tour.isFeatured ?? true)
    }
    setFormData(normalized)
    setHighlightsText((normalized.highlights || []).join('\n'))
    setInclusionsText((normalized.inclusions || []).join('\n'))
    setExclusionsText((normalized.exclusions || []).join('\n'))
    setModalTab('general')
    setModalOpen(true)
  }

  // Delete Tour
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will remove the package from the website immediately.`)) {
      try {
        await tourService.delete(id)
        setTours((prev) => prev.filter((t) => (t._id || t.id) !== id))
        showSuccess('Expedition deleted successfully')
      } catch (error) {
        console.error('Error deleting expedition:', error)
        alert('Could not delete expedition. Please try again.')
      }
    }
  }

  // Toggle Featured status directly in table
  const handleToggleFeatured = async (tour) => {
    const updatedStatus = !tour.isFeatured
    const id = tour._id || tour.id
    try {
      await tourService.update(id, { isFeatured: updatedStatus })
      setTours((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? { ...t, isFeatured: updatedStatus } : t))
      )
      showSuccess(updatedStatus ? 'Marked as Signature Expedition' : 'Unmarked from Signature Expeditions')
    } catch (error) {
      console.error('Error toggling featured status:', error)
    }
  }

  const showSuccess = (msg) => {
    setFeedbackMsg(msg)
    setTimeout(() => setFeedbackMsg(''), 4000)
  }

  // Image Upload handler from Device
  const handleDeviceFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('image', file)

      const response = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data?.secure_url) {
        const uploadedUrl = response.data.secure_url
        setFormData((prev) => ({ ...prev, image: uploadedUrl }))
        showSuccess('Image uploaded and set as cover photo!')
      } else {
        // Fallback: Read as Data URL
        const reader = new FileReader()
        reader.onload = () => {
          setFormData((prev) => ({ ...prev, image: reader.result }))
          showSuccess('Image loaded from device!')
        }
        reader.readAsDataURL(file)
      }
    } catch (err) {
      console.warn('Upload API fallback to local reader:', err.message)
      const reader = new FileReader()
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }))
        showSuccess('Image loaded from device!')
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
    }
  }

  // Select image from Gallery picker
  const handleSelectGalleryImage = (url) => {
    setFormData((prev) => ({ ...prev, image: url }))
    setGalleryPickerOpen(false)
    showSuccess('Cover image updated from Gallery!')
  }

  // Combined Gallery items for picker
  const allGalleryItems = [
    ...mediaLibraryItems.map((m) => ({
      title: m.filename || 'Uploaded Image',
      category: 'Media Library',
      url: m.url
    })),
    ...GALLERY_PRESETS
  ]

  const filteredGallery = allGalleryItems.filter((item) => {
    const q = gallerySearch.toLowerCase().trim()
    return !q || item.title?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q)
  })

  // Itinerary Handlers
  const handleAddDay = () => {
    const nextDayNum = (formData.itinerary?.length || 0) + 1
    const newDay = {
      day: nextDayNum,
      title: `Day ${nextDayNum} Exploration & Activities`,
      description: 'Private leisure, scenic sightseeing, and local artisan experiences.',
      stay: 'Luxury Mountain Resort / City Chalet',
      meals: 'Breakfast & Dinner'
    }
    setFormData((prev) => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), newDay]
    }))
  }

  const handleUpdateDay = (index, field, value) => {
    const updatedItinerary = [...formData.itinerary]
    updatedItinerary[index] = { ...updatedItinerary[index], [field]: value }
    setFormData((prev) => ({ ...prev, itinerary: updatedItinerary }))
  }

  const handleRemoveDay = (index) => {
    const filtered = formData.itinerary.filter((_, i) => i !== index)
    const reindexed = filtered.map((item, idx) => ({ ...item, day: idx + 1 }))
    setFormData((prev) => ({ ...prev, itinerary: reindexed }))
  }

  // Submit Save Form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        startingPrice: Number(formData.startingPrice) || 24999,
        price: Number(formData.startingPrice) || 24999,
        days: Number(formData.days) || 7,
        highlights: highlightsText.split('\n').map((s) => s.trim()).filter(Boolean),
        inclusions: inclusionsText.split('\n').map((s) => s.trim()).filter(Boolean),
        exclusions: exclusionsText.split('\n').map((s) => s.trim()).filter(Boolean),
      }

      if (isEditing && currentTourId) {
        const res = await tourService.update(currentTourId, payload)
        const updatedTour = res.data || payload
        setTours((prev) =>
          prev.map((t) => ((t._id || t.id) === currentTourId ? { ...t, ...updatedTour } : t))
        )
        showSuccess('Expedition updated successfully!')
      } else {
        const res = await tourService.create(payload)
        const createdTour = res.data || payload
        setTours((prev) => [createdTour, ...prev])
        showSuccess('New Expedition created successfully!')
      }

      setModalOpen(false)
    } catch (error) {
      console.error('Error saving expedition:', error)
      alert(error.response?.data?.message || 'Failed to save expedition. Please verify details.')
    } finally {
      setSubmitting(false)
    }
  }

  // Filter & Sort Logic
  const filteredTours = tours
    .filter((t) => {
      const matchSearch =
        t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.country?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCat =
        selectedCategory === 'All' ||
        t.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        t.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return (a.startingPrice || a.price) - (b.startingPrice || b.price)
      if (sortBy === 'price_desc') return (b.startingPrice || b.price) - (a.startingPrice || a.price)
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })

  // Quick Stats
  const totalCount = tours.length
  const featuredCount = tours.filter((t) => t.isFeatured).length
  const avgPrice = totalCount > 0
    ? Math.round(tours.reduce((sum, t) => sum + Number(t.startingPrice || t.price || 0), 0) / totalCount)
    : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto animate-fadeIn select-none text-left">
      
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#6FCF45] text-[#071A16] font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#6FCF45] uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Ready-Made Travel Packages</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Tour Packages &amp; Expeditions
          </h1>
          <p className="text-xs text-[#A8B5AF] mt-0.5">
            Add new public tour packages, choose photos from Gallery, update day-by-day itineraries &amp; pricing.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5db836] text-[#071A16] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#6FCF45]/20 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Tour Package</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1A1D24] border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8B5AF]">Total Packages</span>
            <div className="w-8 h-8 rounded-lg bg-[#6FCF45]/10 text-[#6FCF45] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">{totalCount}</div>
          <span className="text-[11px] text-[#6FCF45] font-semibold mt-1 block">Live in database</span>
        </div>

        <div className="bg-[#1A1D24] border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8B5AF]">Signature Showcases</span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">{featuredCount}</div>
          <span className="text-[11px] text-amber-400 font-semibold mt-1 block">Featured on Homepage</span>
        </div>

        <div className="bg-[#1A1D24] border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8B5AF]">Avg. Package Rate</span>
            <div className="w-8 h-8 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">₹{avgPrice.toLocaleString()}</div>
          <span className="text-[11px] text-[#A8B5AF] font-semibold mt-1 block">Per person starting rate</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-[#1A1D24] border border-white/5 p-4 rounded-2xl shadow-xl">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
          <input
            type="text"
            placeholder="Search by title, destination, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-[#A8B5AF]/60 focus:outline-none focus:border-[#6FCF45] transition-colors"
          />
        </div>

        {/* Categories Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#13151A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat} Packages</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#13151A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#1A1D24] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#13151A] text-[#A8B5AF] text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                <th className="p-4">Expedition Package</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Duration &amp; Group</th>
                <th className="p-4">Starting Rate</th>
                <th className="p-4 text-center">Homepage Signature</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-[#A8B5AF]">
                    <div className="inline-block w-6 h-6 border-2 border-[#6FCF45] border-t-transparent rounded-full animate-spin mb-2" />
                    <div>Loading live expeditions from database...</div>
                  </td>
                </tr>
              ) : filteredTours.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-[#A8B5AF]">
                    <div className="text-sm font-semibold text-white">No expeditions found</div>
                    <p className="text-xs text-[#A8B5AF] mt-1">Try adjusting your search criteria or click "+ Add Expedition".</p>
                  </td>
                </tr>
              ) : (
                filteredTours.map((tour) => {
                  const id = tour._id || tour.id
                  const price = tour.startingPrice || tour.price || 24999
                  return (
                    <tr key={id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Package Name & Image */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 shadow-md group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-[#6FCF45] transition-colors flex items-center gap-2">
                              <span>{tour.title}</span>
                              {tour.rating && (
                                <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>{tour.rating}</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#A8B5AF] mt-0.5">{tour.category || 'Luxury'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Destination & Country */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#6FCF45]" />
                          <span>{tour.destination}</span>
                        </div>
                        <div className="text-[11px] text-[#A8B5AF] ml-5">{tour.country || 'International'}</div>
                      </td>

                      {/* Duration & Group */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          <span>{tour.duration}</span>
                        </div>
                        <div className="text-[11px] text-[#A8B5AF] ml-5">{tour.groupSize || 'Max 8 Explorers'}</div>
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <div className="font-mono font-extrabold text-[#6FCF45] text-sm">
                          ₹{Number(price).toLocaleString()}
                        </div>
                        <span className="text-[10px] text-[#A8B5AF] uppercase">Per Person</span>
                      </td>

                      {/* Homepage Featured Toggle */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(tour)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            tour.isFeatured
                              ? 'bg-[#6FCF45]/20 text-[#6FCF45] border border-[#6FCF45]/40 hover:bg-[#6FCF45] hover:text-[#071A16]'
                              : 'bg-white/5 text-[#A8B5AF] border border-white/10 hover:border-white/30'
                          }`}
                          title="Click to toggle featured status on Homepage"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{tour.isFeatured ? 'Signature' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View On Public Site */}
                          <a
                            href={`/tours/${tour.slug || id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-white/5 text-[#A8B5AF] hover:text-white hover:bg-white/10 transition-colors"
                            title="View Tour on Customer Site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(tour)}
                            className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-[#071A16] border border-blue-500/30 transition-all cursor-pointer"
                            title="Edit Expedition Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(id, tour.title)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all cursor-pointer"
                            title="Delete Expedition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT EXPEDITION                                             */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1A1D24] border border-white/10 rounded-3xl w-full max-w-[840px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#13151A]">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#6FCF45] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>{isEditing ? 'Update Expedition' : 'New Expedition'}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {isEditing ? `Edit: ${formData.title}` : 'Add New Tour Package'}
                </h2>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#A8B5AF] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tab Navigation */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/5 bg-[#13151A]/60 overflow-x-auto shrink-0">
              {[
                { id: 'general', label: '1. Basic Info & Pricing' },
                { id: 'media', label: '2. Media & Overview' },
                { id: 'inclusions', label: '3. Inclusions & Policies' },
                { id: 'itinerary', label: '4. Day-by-Day Itinerary' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModalTab(tab.id)}
                  className={`px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    modalTab === tab.id
                      ? 'border-[#6FCF45] text-[#6FCF45]'
                      : 'border-transparent text-[#A8B5AF] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* TAB 1: BASIC INFO & PRICING */}
              {modalTab === 'general' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                        Expedition Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kashmir Alpine Wilderness & Houseboat Retreat"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alpine Tranquility & Shikara Dreams"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                        Destination *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kashmir, Maldives, Swiss Alps"
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. India, Switzerland, France"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alpine & Mountain, Luxury & Beach"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                        Starting Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.startingPrice}
                        onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value), price: Number(e.target.value) })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                        Duration Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 7 Days / 6 Nights"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                        Group Capacity
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Max 8 Explorers"
                        value={formData.groupSize}
                        onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                      />
                    </div>
                  </div>

                  {/* Feature on Homepage Toggle */}
                  <div className="flex items-center justify-between p-4 bg-[#13151A] rounded-xl border border-white/5 mt-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Signature Homepage Showcase</h4>
                      <p className="text-[11px] text-[#A8B5AF]">Feature this package in the Signature Expeditions carousel on the Homepage.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6FCF45]"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & OVERVIEW (WITH GALLERY & FILE PICKER) */}
              {modalTab === 'media' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-2">
                      Cover Photo *
                    </label>

                    {/* Image Action Buttons: Gallery Picker & File Upload */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Button 1: Open Gallery Modal */}
                      <button
                        type="button"
                        onClick={() => setGalleryPickerOpen(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#6FCF45]/15 hover:bg-[#6FCF45] text-[#6FCF45] hover:text-[#071A16] border border-[#6FCF45]/40 hover:border-[#6FCF45] text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <FolderOpen className="w-4 h-4" />
                        <span>Choose From Gallery</span>
                      </button>

                      {/* Button 2: Upload Device File */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/40 hover:border-blue-500 text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{uploadingImage ? 'Loading...' : 'Upload From Device'}</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleDeviceFileUpload}
                      />
                    </div>

                    {/* Direct Image URL input */}
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
                      <input
                        type="url"
                        required
                        placeholder="Or paste direct image URL (https://...)"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                      />
                    </div>
                  </div>

                  {/* Real-time Image Preview Card */}
                  {formData.image && (
                    <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner group">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                      
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                        <Check className="w-3 h-3 text-[#6FCF45]" />
                        <span>Current Cover Photo</span>
                      </div>

                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGalleryPickerOpen(true)}
                          className="px-3 py-1 rounded-lg bg-black/70 hover:bg-[#6FCF45] text-white hover:text-[#071A16] border border-white/20 text-[10px] font-bold uppercase transition-all backdrop-blur-md cursor-pointer"
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                      Expedition Overview Description *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe the luxury travel experience, private stays, panoramic views and concierge highlights..."
                      value={formData.overview}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#A8B5AF] uppercase tracking-wider mb-1.5">
                      Key Highlights (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Gulmarg Gondola Ride Phase 1 & 2&#10;Private Dal Lake Sunset Shikara&#10;Luxury Pine Chalet Stay"
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: INCLUSIONS & POLICIES */}
              {modalTab === 'inclusions' && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-[#6FCF45] uppercase tracking-wider mb-1.5">
                      Included in Package (One per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="6 nights luxury boutique chalet accommodation&#10;Private chauffeured luxury SUV throughout&#10;Daily gourmet breakfast &amp; dinner"
                      value={inclusionsText}
                      onChange={(e) => setInclusionsText(e.target.value)}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-red-400 uppercase tracking-wider mb-1.5">
                      Excluded from Package (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="International airfare&#10;Personal travel insurance&#10;Discretionary gratuities"
                      value={exclusionsText}
                      onChange={(e) => setExclusionsText(e.target.value)}
                      className="w-full bg-[#13151A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: DAY-BY-DAY ITINERARY */}
              {modalTab === 'itinerary' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Itinerary Schedule</h3>
                      <p className="text-[11px] text-[#A8B5AF]">Add, organize, and edit each day’s timeline.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddDay}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6FCF45]/20 text-[#6FCF45] border border-[#6FCF45]/40 text-xs font-bold hover:bg-[#6FCF45] hover:text-[#071A16] transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Day</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.itinerary || []).map((item, index) => (
                      <div key={index} className="p-4 bg-[#13151A] border border-white/5 rounded-2xl space-y-2.5 relative group">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded bg-[#6FCF45] text-[#071A16] font-bold text-[10px] uppercase tracking-wider">
                            Day {item.day || index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(index)}
                            className="text-red-400 hover:text-red-300 p-1 rounded transition-colors cursor-pointer"
                            title="Remove Day"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Day Title (e.g. Arrival in Srinagar & Dal Lake Shikara)"
                            value={item.title || ''}
                            onChange={(e) => handleUpdateDay(index, 'title', e.target.value)}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] font-semibold"
                          />
                        </div>

                        <div>
                          <textarea
                            rows={2}
                            placeholder="Detailed description of activities and transfers..."
                            value={item.description || item.desc || ''}
                            onChange={(e) => {
                              handleUpdateDay(index, 'description', e.target.value)
                              handleUpdateDay(index, 'desc', e.target.value)
                            }}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Stay / Hotel"
                            value={item.stay || ''}
                            onChange={(e) => handleUpdateDay(index, 'stay', e.target.value)}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-1 text-[11px] text-[#A8B5AF] focus:outline-none focus:border-[#6FCF45]"
                          />
                          <input
                            type="text"
                            placeholder="Included Meals (e.g. Breakfast & Dinner)"
                            value={item.meals || ''}
                            onChange={(e) => handleUpdateDay(index, 'meals', e.target.value)}
                            className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-1 text-[11px] text-[#A8B5AF] focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer CTA */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5db836] text-[#071A16] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#6FCF45]/20 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{isEditing ? 'Update Expedition' : 'Publish Expedition'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL: SELECT PHOTO FROM GALLERY / MEDIA LIBRARY                     */}
      {/* ========================================================================= */}
      {galleryPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1A1D24] border border-white/10 rounded-3xl w-full max-w-[900px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            
            {/* Gallery Picker Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#13151A]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6FCF45]/15 text-[#6FCF45] flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Select Photo from Media Gallery</h3>
                  <p className="text-[11px] text-[#A8B5AF]">Click any photo to instantly set it as the expedition cover photo.</p>
                </div>
              </div>

              <button
                onClick={() => setGalleryPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#A8B5AF] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gallery Search Filter */}
            <div className="p-4 border-b border-white/5 bg-[#13151A]/60 flex items-center gap-3 shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
                <input
                  type="text"
                  placeholder="Search gallery photos (e.g. Kashmir, Maldives, Alps, Desert, Beach)..."
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  className="w-full bg-[#1A1D24] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                />
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {filteredGallery.length === 0 ? (
                <div className="py-16 text-center text-[#A8B5AF]">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No photos matching "{gallerySearch}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredGallery.map((item, index) => {
                    const isSelected = formData.image === item.url
                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectGalleryImage(item.url)}
                        className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all aspect-video shadow-md hover:scale-[1.03] ${
                          isSelected
                            ? 'border-[#6FCF45] shadow-[0_0_20px_rgba(111,207,69,0.35)] ring-2 ring-[#6FCF45]/50'
                            : 'border-white/10 hover:border-[#6FCF45]/60'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        
                        {/* Selected Indicator Badge */}
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#6FCF45] text-[#071A16] flex items-center justify-center shadow-lg">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2.5 right-2.5">
                          <p className="text-xs font-bold text-white truncate drop-shadow">{item.title}</p>
                          <span className="text-[9px] font-semibold text-[#6FCF45] uppercase tracking-wider">{item.category}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Gallery Picker Footer */}
            <div className="p-4 border-t border-white/10 bg-[#13151A] flex items-center justify-between shrink-0">
              <span className="text-xs text-[#A8B5AF]">
                Showing {filteredGallery.length} curated &amp; uploaded travel photos
              </span>
              <button
                type="button"
                onClick={() => setGalleryPickerOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminExpeditions
