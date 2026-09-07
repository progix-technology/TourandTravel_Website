import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Upload,
  Image as ImageIcon,
  Video,
  File,
  Trash2,
  Edit,
  Link as LinkIcon,
  Plus,
  X,
  Check,
  Eye,
  Layers,
  Sparkles,
  MapPin,
  Mountain,
  Palmtree,
  Sun,
  Landmark,
  Building2,
  Compass,
  Globe,
  ExternalLink,
  HardDrive,
  RefreshCw,
} from 'lucide-react'
import api from '../services/api'

export const AdminMedia = () => {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedFileType, setSelectedFileType] = useState('All')
  const [copiedId, setCopiedId] = useState(null)
  const [previewMedia, setPreviewMedia] = useState(null)

  // Uploading state
  const [uploading, setUploading] = useState(false)
  const [modalUploading, setModalUploading] = useState(false)
  const fileInputRef = useRef(null)
  const editFileInputRef = useRef(null)
  const createFileInputRef = useRef(null)

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    filename: '',
    category: 'Mountains & Alpine',
    location: '',
    url: '',
    fileType: 'Image',
    size: '2.5 MB',
  })

  const categories = [
    { label: 'ALL', value: 'ALL', icon: Layers },
    { label: 'Mountains & Alpine', value: 'Mountains & Alpine', icon: Mountain },
    { label: 'Islands & Coastal', value: 'Islands & Coastal', icon: Palmtree },
    { label: 'Desert & Dunes', value: 'Desert & Dunes', icon: Sun },
    { label: 'Heritage & Palaces', value: 'Heritage & Palaces', icon: Landmark },
    { label: 'Urban & Skylines', value: 'Urban & Skylines', icon: Building2 },
    { label: 'India', value: 'INDIA', icon: Compass },
    { label: 'International', value: 'INTERNATIONAL', icon: Globe },
  ]

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/media')
      if (data?.success && Array.isArray(data.data)) {
        setMedia(data.data)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Quick File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    const formattedTitle = rawName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    try {
      const uploadForm = new FormData()
      uploadForm.append('image', file)

      const response = await api.post('/upload', uploadForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const secureUrl = response.data?.secure_url
      if (secureUrl) {
        const { data } = await api.post('/media', {
          filename: file.name,
          title: formattedTitle,
          category: 'Mountains & Alpine',
          location: 'Expedition Sanctuary',
          url: secureUrl,
          fileType: 'Image',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        })
        if (data.success) {
          fetchMedia()
        }
      }
    } catch (err) {
      console.warn('Upload API error, saving via local reader:', err)
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const { data } = await api.post('/media', {
            filename: file.name,
            title: formattedTitle,
            category: 'Mountains & Alpine',
            location: 'Expedition Sanctuary',
            url: reader.result,
            fileType: 'Image',
            size: `${(file.size / 1024).toFixed(0)} KB`,
          })
          if (data.success) {
            fetchMedia()
          }
        } catch (postErr) {
          console.error('Failed to create media record:', postErr)
        }
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Handle Modal Device File Upload (for both Edit Modal and Create Modal)
  const handleModalFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setModalUploading(true)
    const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    const formattedTitle = rawName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    const fileSizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`

    try {
      const uploadForm = new FormData()
      uploadForm.append('image', file)

      const response = await api.post('/upload', uploadForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const secureUrl = response.data?.secure_url
      if (secureUrl) {
        setFormData((prev) => ({
          ...prev,
          url: secureUrl,
          filename: file.name,
          title: prev.title || formattedTitle,
          size: fileSizeStr,
        }))
      }
    } catch (err) {
      console.warn('Modal upload API error, falling back to local data URL:', err)
      const reader = new FileReader()
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          url: reader.result,
          filename: file.name,
          title: prev.title || formattedTitle,
          size: fileSizeStr,
        }))
      }
      reader.readAsDataURL(file)
    } finally {
      setModalUploading(false)
      if (editFileInputRef.current) editFileInputRef.current.value = ''
      if (createFileInputRef.current) createFileInputRef.current.value = ''
    }
  }

  // Handle Manual Create Form Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!formData.url) {
      alert('Please enter an image URL')
      return
    }

    try {
      const filename = formData.filename || formData.title.toLowerCase().replace(/\s+/g, '-') + '.jpg'
      const { data } = await api.post('/media', {
        ...formData,
        filename,
      })
      if (data.success) {
        setCreateModalOpen(false)
        setFormData({
          title: '',
          filename: '',
          category: 'Mountains & Alpine',
          location: '',
          url: '',
          fileType: 'Image',
          size: '2.5 MB',
        })
        fetchMedia()
      }
    } catch (error) {
      console.error('Error creating media:', error)
      alert(error.response?.data?.message || 'Failed to add media item')
    }
  }

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingItem) return

    try {
      const { data } = await api.put(`/media/${editingItem._id}`, formData)
      if (data.success) {
        setEditModalOpen(false)
        setEditingItem(null)
        fetchMedia()
      }
    } catch (error) {
      console.error('Error updating media:', error)
      alert(error.response?.data?.message || 'Failed to update media item')
    }
  }

  const openEditModal = (item, e) => {
    e.stopPropagation()
    setEditingItem(item)
    setFormData({
      title: item.title || '',
      filename: item.filename || '',
      category: item.category || 'Mountains & Alpine',
      location: item.location || '',
      url: item.url || '',
      fileType: item.fileType || 'Image',
      size: item.size || '2.5 MB',
    })
    setEditModalOpen(true)
  }

  // Handle Delete
  const handleDeleteMedia = async (id, e) => {
    if (e) e.stopPropagation()
    if (window.confirm('Are you sure you want to permanently delete this media asset? This action will remove it from the database and public gallery.')) {
      try {
        const { data } = await api.delete(`/media/${id}`)
        if (data.success) {
          setMedia((prev) => prev.filter((m) => m._id !== id))
          if (previewMedia?._id === id) setPreviewMedia(null)
        }
      } catch (error) {
        console.error('Error deleting media:', error)
        alert('Failed to delete media asset')
      }
    }
  }

  // Copy Link with Toast
  const copyLink = (url, id, e) => {
    if (e) e.stopPropagation()
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filtered Media List
  const filteredMedia = media.filter((m) => {
    const q = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !q ||
      m.filename?.toLowerCase().includes(q) ||
      m.title?.toLowerCase().includes(q) ||
      m.location?.toLowerCase().includes(q) ||
      m.category?.toLowerCase().includes(q)

    const cat = selectedCategory.toUpperCase()
    let matchesCategory = true
    if (cat !== 'ALL') {
      if (cat === 'INDIA') {
        matchesCategory = m.location?.toLowerCase().includes('india')
      } else if (cat === 'INTERNATIONAL') {
        matchesCategory = !m.location?.toLowerCase().includes('india')
      } else {
        matchesCategory = m.category?.toUpperCase() === cat
      }
    }

    const matchesFileType =
      selectedFileType === 'All' || m.fileType === selectedFileType

    return matchesSearch && matchesCategory && matchesFileType
  })

  // KPI Calculations
  const totalAssets = media.length
  const totalImages = media.filter((m) => !m.fileType || m.fileType === 'Image').length
  const indiaSpots = media.filter((m) => m.location?.toLowerCase().includes('india')).length
  const internationalSpots = totalAssets - indiaSpots

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto animate-fadeIn select-none">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#6FCF45] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#6FCF45]" />
            <span>EXPEDITION MEDIA ASSET MANAGER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
            Media Library &amp; Gallery Archive
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5AF] mt-1">
            Real-time database storage for high-definition photography, travel captures, and global assets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchMedia}
            className="p-2.5 rounded-xl bg-[#1A1D24] border border-white/10 text-[#A8B5AF] hover:text-white hover:border-white/25 transition-all shadow-md cursor-pointer"
            title="Reload Media"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6FCF45]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 bg-[#1A1D24] hover:bg-[#252932] border border-white/10 hover:border-[#6FCF45]/50 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4 text-[#6FCF45]" />
            <span>Add Via URL</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 bg-gradient-to-r from-[#6FCF45] to-[#8AE863] text-[#071A16] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-[#6FCF45]/20 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* 2. 3D Stat Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1F242D] to-[#0E1117] border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#6FCF45]/15 border border-[#6FCF45]/30 flex items-center justify-center text-[#6FCF45] shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5AF] block">Total Database Assets</span>
            <span className="text-xl sm:text-2xl font-black text-white font-heading">{totalAssets}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1F242D] to-[#0E1117] border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5AF] block">Incredible India</span>
            <span className="text-xl sm:text-2xl font-black text-white font-heading">{indiaSpots}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1F242D] to-[#0E1117] border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5AF] block">Global Destinations</span>
            <span className="text-xl sm:text-2xl font-black text-white font-heading">{internationalSpots}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1F242D] to-[#0E1117] border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5AF] block">Live Status</span>
            <span className="text-xs font-bold text-[#6FCF45] bg-[#6FCF45]/10 px-2 py-0.5 rounded border border-[#6FCF45]/20 inline-block mt-0.5">
              MongoDB Synced
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-[#1A1D24] border border-white/5 rounded-2xl p-4 mb-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AF]" />
            <input
              type="text"
              placeholder="Search by title, location, category, or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#A8B5AF] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A8B5AF] shrink-0 font-medium">Type:</span>
            <select
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="bg-[#13151A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6FCF45] cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Image">Images</option>
              <option value="Video">Videos</option>
              <option value="Document">Documents</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45] shadow-md shadow-[#6FCF45]/20 font-bold'
                    : 'bg-[#13151A] text-[#A8B5AF] border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Media Asset Grid */}
      <div className="bg-[#1A1D24] border border-white/5 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-[#A8B5AF] font-bold uppercase tracking-wider">
            Showing {filteredMedia.length} of {media.length} Total Assets
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#6FCF45] animate-spin" />
            <p className="text-sm text-[#A8B5AF]">Loading MongoDB Media Archive...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <ImageIcon className="w-14 h-14 text-[#A8B5AF]/40 mb-3" />
            <h3 className="text-base font-bold text-white">No Media Found</h3>
            <p className="text-xs text-[#A8B5AF] mt-1 max-w-sm">
              No files match your current filters or search query. Click "Upload Image" or "Add Via URL" to save new assets to database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item._id}
                onClick={() => setPreviewMedia(item)}
                className="group relative bg-[#13151A] border border-white/10 rounded-xl overflow-hidden hover:border-[#6FCF45]/60 hover:shadow-xl hover:shadow-[#6FCF45]/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] bg-black/50 relative overflow-hidden flex items-center justify-center">
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.title || item.filename}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-[#A8B5AF]/50" />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] font-bold text-[#6FCF45] border border-white/10 uppercase tracking-wider">
                      {item.category || 'Landscape'}
                    </span>
                    {item.location?.toLowerCase().includes('india') && (
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-[9px] font-bold text-orange-300 border border-orange-500/30">
                        India
                      </span>
                    )}
                  </div>

                  {/* Hover Floating Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-[2px] bg-black/40">
                    <button
                      type="button"
                      onClick={(e) => copyLink(item.url, item._id, e)}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedId === item._id
                          ? 'bg-[#6FCF45] text-[#071A16]'
                          : 'bg-white/15 text-white hover:bg-white/30'
                      }`}
                      title="Copy Image URL"
                    >
                      {copiedId === item._id ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => openEditModal(item, e)}
                      className="p-2 rounded-lg bg-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white transition-colors"
                      title="Edit Metadata"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteMedia(item._id, e)}
                      className="p-2 rounded-lg bg-red-500/30 text-red-300 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Info Footer */}
                <div className="p-3 bg-[#13151A] border-t border-white/5 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-xs font-bold text-white truncate leading-tight group-hover:text-[#6FCF45] transition-colors" title={item.title || item.filename}>
                      {item.title || item.filename}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-[#A8B5AF] mt-1">
                      <MapPin className="w-3 h-3 text-[#6FCF45] shrink-0" />
                      <span className="truncate">{item.location || 'Sanctuary'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-[#A8B5AF]/70">
                    <span className="truncate font-mono">{item.size || '2.0 MB'}</span>
                    <span>{new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. ADD NEW ASSET MODAL */}
      {createModalOpen && (
        <div
          onClick={() => setCreateModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1A1D24] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#6FCF45]" />
                <h3 className="text-base font-bold text-white">Add New Media Asset</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#A8B5AF] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sonamarg Alpine Valley View"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#13151A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider">
                    Image Source *
                  </label>
                  <button
                    type="button"
                    onClick={() => createFileInputRef.current?.click()}
                    className="text-xs font-bold text-[#6FCF45] hover:text-[#8AE863] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload From Device</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-... or upload from device"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="flex-1 bg-[#13151A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45]"
                  />
                  <button
                    type="button"
                    onClick={() => createFileInputRef.current?.click()}
                    disabled={modalUploading}
                    className="px-3.5 py-2.5 bg-[#12382E] hover:bg-[#1a4a3e] border border-[#6FCF45]/30 text-[#6FCF45] hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    title="Choose from local storage"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">{modalUploading ? 'Uploading...' : 'Browse Device'}</span>
                  </button>
                </div>

                <input
                  ref={createFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleModalFileUpload}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#13151A] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                  >
                    <option value="Mountains & Alpine">Mountains &amp; Alpine</option>
                    <option value="Islands & Coastal">Islands &amp; Coastal</option>
                    <option value="Desert & Dunes">Desert &amp; Dunes</option>
                    <option value="Heritage & Palaces">Heritage &amp; Palaces</option>
                    <option value="Urban & Skylines">Urban &amp; Skylines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1">
                    Location / Country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sonamarg, Kashmir, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#13151A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45]"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#A8B5AF] block tracking-wider">
                  Live Preview {modalUploading && '(Uploading new device photo...)'}
                </span>
                <div 
                  onClick={() => createFileInputRef.current?.click()}
                  className="group relative rounded-xl overflow-hidden border border-white/15 h-36 bg-black/60 flex items-center justify-center cursor-pointer"
                  title="Click to choose photo from device"
                >
                  {formData.url ? (
                    <img 
                      src={formData.url} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
                      }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="w-8 h-8 text-[#6FCF45] mx-auto mb-1 opacity-80" />
                      <span className="text-xs text-white font-bold block">Click to upload from device</span>
                      <span className="text-[10px] text-[#A8B5AF]">PNG, JPG, WebP up to 10MB</span>
                    </div>
                  )}

                  {formData.url && (
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                      <Upload className="w-6 h-6 text-[#6FCF45]" />
                      <span className="text-xs font-bold">Click to replace photo from device</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#A8B5AF] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6FCF45] text-[#071A16] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#8AE863] transition-colors shadow-lg shadow-[#6FCF45]/20 cursor-pointer"
                >
                  Save To Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. EDIT ASSET MODAL */}
      {editModalOpen && editingItem && (
        <div
          onClick={() => setEditModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1A1D24] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#6FCF45]" />
                <h3 className="text-base font-bold text-white">Edit Media Asset</h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-[#A8B5AF] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#13151A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider">
                    Image Source *
                  </label>
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="text-xs font-bold text-[#6FCF45] hover:text-[#8AE863] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo From Device</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-... or upload from device"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="flex-1 bg-[#13151A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45]"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={modalUploading}
                    className="px-3.5 py-2.5 bg-[#12382E] hover:bg-[#1a4a3e] border border-[#6FCF45]/30 text-[#6FCF45] hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    title="Choose from local storage"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">{modalUploading ? 'Uploading...' : 'Browse Device'}</span>
                  </button>
                </div>

                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleModalFileUpload}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#13151A] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                  >
                    <option value="Mountains & Alpine">Mountains &amp; Alpine</option>
                    <option value="Islands & Coastal">Islands &amp; Coastal</option>
                    <option value="Desert & Dunes">Desert &amp; Dunes</option>
                    <option value="Heritage & Palaces">Heritage &amp; Palaces</option>
                    <option value="Urban & Skylines">Urban &amp; Skylines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8B5AF] uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#13151A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45]"
                  />
                </div>
              </div>

              {/* Preview with Device Upload Overlay Option */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#A8B5AF] block tracking-wider">
                  Live Preview {modalUploading && '(Uploading new device photo...)'}
                </span>
                <div 
                  onClick={() => editFileInputRef.current?.click()}
                  className="group relative rounded-xl overflow-hidden border border-white/15 h-36 bg-black/60 flex items-center justify-center cursor-pointer"
                  title="Click to replace with photo from device"
                >
                  {formData.url ? (
                    <img 
                      src={formData.url} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
                      }}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-[#A8B5AF]/40 mx-auto mb-1" />
                      <span className="text-xs text-[#A8B5AF]">No image chosen</span>
                    </div>
                  )}

                  {/* Hover Overlay with Change Photo prompt */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                    <Upload className="w-6 h-6 text-[#6FCF45]" />
                    <span className="text-xs font-bold">Click to replace with photo from device</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#A8B5AF] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6FCF45] text-[#071A16] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#8AE863] transition-colors shadow-lg shadow-[#6FCF45]/20 cursor-pointer"
                >
                  Update Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. FULLSCREEN LIGHTBOX PREVIEW MODAL */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1A1D24] border border-white/15 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scaleUp"
          >
            <div className="p-4 bg-[#13151A] border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white font-heading">{previewMedia.title || previewMedia.filename}</h4>
                <p className="text-xs text-[#6FCF45] mt-0.5">{previewMedia.location || 'Global Sanctuary'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => copyLink(previewMedia.url, previewMedia._id, e)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === previewMedia._id ? <Check className="w-3.5 h-3.5 text-[#6FCF45]" /> : <LinkIcon className="w-3.5 h-3.5" />}
                  <span>{copiedId === previewMedia._id ? 'Copied' : 'Copy URL'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  className="p-1.5 rounded-lg text-[#A8B5AF] hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-black/90 p-4 flex items-center justify-center overflow-hidden min-h-[350px]">
              <img
                src={previewMedia.url}
                alt={previewMedia.title}
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            <div className="p-4 bg-[#13151A] border-t border-white/10 flex items-center justify-between text-xs text-[#A8B5AF]">
              <div className="flex items-center gap-4">
                <span>Category: <strong className="text-white">{previewMedia.category}</strong></span>
                <span>Type: <strong className="text-white">{previewMedia.fileType || 'Image'}</strong></span>
                <span>Size: <strong className="text-white">{previewMedia.size}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => openEditModal(previewMedia, e)}
                  className="px-3 py-1.5 bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white rounded-lg transition-colors font-semibold"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteMedia(previewMedia._id, e)}
                  className="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMedia
