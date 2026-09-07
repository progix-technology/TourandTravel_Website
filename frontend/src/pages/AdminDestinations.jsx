import React, { useState, useEffect } from 'react'
import { Search, Map, Globe, Trash2, Edit, Plus, X } from 'lucide-react'
import api from '../services/api'

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    country: '',
    region: '',
    category: 'Scenic Luxury',
    image: '',
    startingPrice: '',
    duration: '7 Days',
    description: '',
    bestTimeToVisit: 'October to April',
    isPopular: false,
    rating: 4.9,
    reviewsCount: 240,
    highlights: '',
    gallery: ''
  })

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const { data } = await api.get('/destinations')
      if (data.success) {
        setDestinations(data.data)
      }
    } catch (error) {
      console.error('Error fetching destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDestination = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        const { data } = await api.delete(`/destinations/${id}`)
        if (data.success) {
          fetchDestinations()
        }
      } catch (error) {
        console.error('Error deleting destination:', error)
      }
    }
  }

  const openModal = (dest = null) => {
    if (dest) {
      setEditingId(dest._id)
      setFormData({
        slug: dest.slug || '',
        title: dest.title || '',
        country: dest.country || '',
        region: dest.region || '',
        category: dest.category || 'Scenic Luxury',
        image: dest.image || '',
        startingPrice: dest.startingPrice || '',
        duration: dest.duration || '7 Days',
        description: dest.description || '',
        bestTimeToVisit: dest.bestTimeToVisit || 'October to April',
        isPopular: dest.isPopular || false,
        rating: dest.rating || 4.9,
        reviewsCount: dest.reviewsCount || 240,
        highlights: dest.highlights ? dest.highlights.join(', ') : '',
        gallery: dest.gallery ? dest.gallery.join(', ') : ''
      })
    } else {
      setEditingId(null)
      setFormData({
        slug: '',
        title: '',
        country: '',
        region: '',
        category: 'Scenic Luxury',
        image: '',
        startingPrice: '',
        duration: '7 Days',
        description: '',
        bestTimeToVisit: 'October to April',
        isPopular: false,
        rating: 4.9,
        reviewsCount: 240,
        highlights: '',
        gallery: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('image', file)

    try {
      setIsUploading(true)
      const { data } = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.secure_url }))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(error.response?.data?.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isUploading) {
      alert('Please wait for the image to finish uploading.')
      return
    }
    if (!formData.image) {
      alert('Please select an image or provide an image URL.')
      return
    }
    try {
      const payload = {
        ...formData,
        highlights: typeof formData.highlights === 'string' ? formData.highlights.split(',').map(s => s.trim()).filter(Boolean) : formData.highlights,
        gallery: typeof formData.gallery === 'string' ? formData.gallery.split(',').map(s => s.trim()).filter(Boolean) : formData.gallery
      }
      if (editingId) {
        await api.put(`/destinations/${editingId}`, payload)
      } else {
        await api.post('/destinations', payload)
      }
      fetchDestinations()
      closeModal()
    } catch (error) {
      console.error('Error saving destination:', error)
      alert(error.response?.data?.message || 'Failed to save destination')
    }
  }

  const filteredDestinations = destinations.filter(
    (d) =>
      d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.region?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 max-w-[1400px] mx-auto animate-fadeIn relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Manage Destinations</h1>
          <p className="text-sm text-[#A8B5AF] mt-1">Add, edit, or remove global luxury destinations.</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AF]" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B241E] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#6FCF45] transition-colors"
            />
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6FCF45] text-[#071A16] font-bold rounded-lg hover:bg-[#8BE35A] transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Destination
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#0B241E] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-[#A8B5AF] text-xs uppercase tracking-wider border-b border-white/5">
                <th className="p-4 font-medium">Destination</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#A8B5AF]">Loading destinations...</td>
                </tr>
              ) : filteredDestinations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#A8B5AF]">No destinations found.</td>
                </tr>
              ) : (
                filteredDestinations.map((dest) => (
                  <tr key={dest._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={dest.image} 
                          alt={dest.title}
                          className="w-12 h-12 rounded object-cover border border-white/10"
                        />
                        <div>
                          <p className="font-medium text-white max-w-[200px] truncate">{dest.title}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] uppercase font-bold text-[#6FCF45] bg-[#6FCF45]/10 rounded border border-[#6FCF45]/20">
                            {dest.isPopular ? 'Popular' : 'Standard'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white">
                          <Map className="w-3.5 h-3.5 text-[#A8B5AF]" />
                          <span className="text-xs font-medium">{dest.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#A8B5AF]">
                          <Globe className="w-3.5 h-3.5" />
                          <span className="text-xs">{dest.region}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#A8B5AF] text-xs">
                      {dest.category}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <span className="font-mono font-bold text-sm">{dest.rating}</span>
                        <span className="text-xs text-[#A8B5AF]">/5.0</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(dest)}
                          className="p-1.5 rounded bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-[#071A16] transition-colors border border-blue-400/30"
                          title="Edit Destination"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDestination(dest._id)}
                          className="p-1.5 rounded bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-colors border border-red-400/30"
                          title="Delete Destination"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0B241E] border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/20 shrink-0">
              <h2 className="text-lg font-bold">{editingId ? 'Edit Destination' : 'Add New Destination'}</h2>
              <button onClick={closeModal} className="text-[#A8B5AF] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              <form id="destinationForm" onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Slug</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} required
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Country</label>
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} required
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Region</label>
                    <input type="text" name="region" value={formData.region} onChange={handleInputChange} required
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Starting Price (₹)</label>
                    <input type="number" name="startingPrice" value={formData.startingPrice} onChange={handleInputChange} required
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Duration</label>
                    <input type="text" name="duration" value={formData.duration} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Destination Image</label>
                  <div className="flex items-center gap-4">
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="w-16 h-16 rounded object-cover border border-white/10" />
                    )}
                    <div className="flex-1">
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading}
                        className="block w-full text-sm text-[#A8B5AF] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#6FCF45]/10 file:text-[#6FCF45] hover:file:bg-[#6FCF45]/20 cursor-pointer" />
                      {isUploading && <p className="text-xs text-[#6FCF45] mt-2">Uploading image to Cloudinary...</p>}
                    </div>
                  </div>
                  {/* Keep text input as fallback/manual override */}
                  <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="Or paste image URL here..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none mt-3" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Highlights (Comma Separated)</label>
                  <input type="text" name="highlights" value={formData.highlights} onChange={handleInputChange} placeholder="e.g. Overwater Bungalows, Scuba Diving, Sunset Cruise"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Gallery URLs (Comma Separated)</label>
                  <input type="text" name="gallery" value={formData.gallery} onChange={handleInputChange} placeholder="https://image1.jpg, https://image2.jpg"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Rating (e.g. 4.9)</label>
                    <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleInputChange} required
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Reviews Count</label>
                    <input type="number" name="reviewsCount" value={formData.reviewsCount} onChange={handleInputChange} required
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1.5">Best Time To Visit</label>
                    <input type="text" name="bestTimeToVisit" value={formData.bestTimeToVisit} onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6FCF45] focus:outline-none" />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleInputChange}
                        className="w-4 h-4 rounded text-[#6FCF45] bg-black/40 border-white/20 focus:ring-[#6FCF45]" />
                      <span className="text-sm text-white font-medium">Mark as Popular</span>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/10 bg-black/20 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button type="submit" form="destinationForm" className="px-5 py-2 rounded-lg text-sm font-bold text-[#071A16] bg-[#6FCF45] hover:bg-[#8BE35A] transition-colors">
                {editingId ? 'Save Changes' : 'Create Destination'}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDestinations
