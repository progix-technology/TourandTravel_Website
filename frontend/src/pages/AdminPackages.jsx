import React, { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Check,
  X,
  Sparkles,
  Layers,
  FolderOpen,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  FileText,
  Compass,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Building,
  Plane,
  MessageSquare
} from 'lucide-react'
import api from '../services/api'

const STATUS_OPTIONS = [
  'All',
  'New',
  'In Review by Concierge',
  'Quotation Sent',
  'Confirmed',
  'Closed'
]

const INITIAL_PACKAGE = {
  inquiryReference: '',
  fromLocation: 'New Delhi (DEL)',
  toDestinations: ['Kashmir', 'Pahalgam'],
  tripPace: 'Relaxed & Scenic (Alpine Retreat)',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  isFlexibleDates: true,
  approxDurationDays: 7,
  travellers: { adults: 2, children: 0, infants: 0 },
  budgetTier: 'Signature Luxury',
  budgetEstimatedINR: 250000,
  accommodationStyle: ['5-Star Luxury Resort', 'Boutique Heritage Chalet'],
  transport: 'Private Chauffeur & Luxury SUV',
  curatedActivities: [
    'Private VIP Sightseeing',
    'Curated Gourmet Dining Experience',
    'Exclusive Monument & Sanctuary Access'
  ],
  contactInfo: {
    fullName: '',
    email: '',
    phone: '',
    preferredContact: 'WhatsApp',
    bestTimeToCall: 'Evenings (6 PM - 9 PM)',
    notes: ''
  },
  status: 'New'
}

export const AdminPackages = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [formData, setFormData] = useState(INITIAL_PACKAGE)
  const [submitting, setSubmitting] = useState(false)

  // View Details Modal
  const [viewDetailsModal, setViewDetailsModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)

  // Text helpers for multi-line inputs
  const [destinationsText, setDestinationsText] = useState('')
  const [activitiesText, setActivitiesText] = useState('')
  const [accommodationsText, setAccommodationsText] = useState('')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/custom-trips')
      if (data?.success && Array.isArray(data.data)) {
        setPackages(data.data)
      }
    } catch (error) {
      console.error('Error fetching custom packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const showSuccess = (msg) => {
    setFeedbackMsg(msg)
    setTimeout(() => setFeedbackMsg(''), 4000)
  }

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false)
    setCurrentId(null)
    const newRef = 'CT-' + Math.floor(100000 + Math.random() * 900000)
    const freshData = { ...INITIAL_PACKAGE, inquiryReference: newRef }
    setFormData(freshData)
    setDestinationsText(freshData.toDestinations.join(', '))
    setActivitiesText(freshData.curatedActivities.join('\n'))
    setAccommodationsText(freshData.accommodationStyle.join(', '))
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (pkg) => {
    setIsEditing(true)
    setCurrentId(pkg._id)
    const normalized = {
      ...INITIAL_PACKAGE,
      ...pkg,
      toDestinations: pkg.toDestinations || (pkg.destinations ? pkg.destinations : []),
      travellers: {
        adults: pkg.travellers?.adults || pkg.travelers || 2,
        children: pkg.travellers?.children || 0,
        infants: pkg.travellers?.infants || 0
      },
      budgetEstimatedINR: pkg.budgetEstimatedINR || (typeof pkg.budget === 'number' ? pkg.budget : 250000),
      contactInfo: {
        fullName: pkg.contactInfo?.fullName || pkg.name || '',
        email: pkg.contactInfo?.email || pkg.email || '',
        phone: pkg.contactInfo?.phone || pkg.phone || '',
        preferredContact: pkg.contactInfo?.preferredContact || 'WhatsApp',
        bestTimeToCall: pkg.contactInfo?.bestTimeToCall || 'Evenings',
        notes: pkg.contactInfo?.notes || pkg.notes || ''
      }
    }
    setFormData(normalized)
    setDestinationsText((normalized.toDestinations || []).join(', '))
    setActivitiesText((normalized.curatedActivities || []).join('\n'))
    setAccommodationsText((normalized.accommodationStyle || []).join(', '))
    setModalOpen(true)
  }

  // View Details Modal
  const handleOpenView = (pkg) => {
    setSelectedPackage(pkg)
    setViewDetailsModal(true)
  }

  // Update Status Quick Action
  const handleQuickStatusChange = async (id, newStatus) => {
    if (!id) return
    // Optimistic UI update
    setPackages((prev) =>
      prev.map((p) =>
        p._id === id || p.id === id || p.inquiryReference === id
          ? { ...p, status: newStatus }
          : p
      )
    )
    if (selectedPackage && (selectedPackage._id === id || selectedPackage.id === id || selectedPackage.inquiryReference === id)) {
      setSelectedPackage((prev) => ({ ...prev, status: newStatus }))
    }
    showSuccess(`Status updated to "${newStatus}"`)

    try {
      const { data } = await api.patch(`/custom-trips/${id}/status`, { status: newStatus })
      if (!data?.success) {
        fetchPackages()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      fetchPackages()
    }
  }

  // Delete Package
  const handleDelete = async (id, ref) => {
    if (window.confirm(`Are you sure you want to delete package inquiry ${ref || id}?`)) {
      try {
        const { data } = await api.delete(`/custom-trips/${id}`)
        if (data?.success) {
          setPackages((prev) => prev.filter((p) => p._id !== id))
          showSuccess('Package deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting package:', error)
        alert('Could not delete package. Please try again.')
      }
    }
  }

  // Save Form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        toDestinations: destinationsText.split(',').map((s) => s.trim()).filter(Boolean),
        curatedActivities: activitiesText.split('\n').map((s) => s.trim()).filter(Boolean),
        accommodationStyle: accommodationsText.split(',').map((s) => s.trim()).filter(Boolean),
        budgetEstimatedINR: Number(formData.budgetEstimatedINR) || 250000,
        approxDurationDays: Number(formData.approxDurationDays) || 7,
      }

      if (isEditing && currentId) {
        const { data } = await api.put(`/custom-trips/${currentId}`, payload)
        const updated = data?.data || payload
        setPackages((prev) =>
          prev.map((p) => (p._id === currentId ? { ...p, ...updated } : p))
        )
        showSuccess('Custom package updated successfully!')
      } else {
        const { data } = await api.post('/custom-trips', payload)
        const created = data?.data || payload
        setPackages((prev) => [created, ...prev])
        showSuccess('New Custom Package created successfully!')
      }

      setModalOpen(false)
    } catch (error) {
      console.error('Error saving package:', error)
      alert(error.response?.data?.message || 'Failed to save package. Please verify details.')
    } finally {
      setSubmitting(false)
    }
  }

  // Status Badge Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-[#6FCF45]/20 text-[#6FCF45] border-[#6FCF45]/40'
      case 'Quotation Sent':
        return 'bg-blue-400/20 text-blue-400 border-blue-400/40'
      case 'In Review by Concierge':
        return 'bg-amber-400/20 text-amber-400 border-amber-400/40'
      case 'Closed':
        return 'bg-red-400/20 text-red-400 border-red-400/40'
      default:
        return 'bg-purple-400/20 text-purple-400 border-purple-400/40'
    }
  }

  // Filter & Search
  const filteredPackages = packages.filter((pkg) => {
    const q = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !q ||
      pkg.inquiryReference?.toLowerCase().includes(q) ||
      pkg.contactInfo?.fullName?.toLowerCase().includes(q) ||
      pkg.contactInfo?.email?.toLowerCase().includes(q) ||
      pkg.contactInfo?.phone?.toLowerCase().includes(q) ||
      (pkg.toDestinations || []).some((d) => d?.toLowerCase().includes(q)) ||
      (pkg.destinations || []).some((d) => d?.toLowerCase().includes(q))

    const matchesStatus = statusFilter === 'All' || pkg.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Quick Stats
  const totalCount = packages.length
  const confirmedCount = packages.filter((p) => p.status === 'Confirmed').length
  const inReviewCount = packages.filter((p) => p.status === 'In Review by Concierge' || p.status === 'New').length
  const totalRevenuePipeline = packages.reduce(
    (sum, p) => sum + (Number(p.budgetEstimatedINR) || 0),
    0
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto animate-fadeIn select-none text-left">
      
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#6FCF45] text-[#071A16] font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Header with Title & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#6FCF45] uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Bespoke Client Inquiries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Custom Trip Requests
          </h1>
          <p className="text-xs text-[#A8B5AF] mt-0.5">
            Manage bespoke trip inquiries from Vacation Planner, review client requirements &amp; update quotes.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5db836] text-[#071A16] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#6FCF45]/20 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Custom Request</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A1D24] border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8B5AF]">Total Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-[#6FCF45]/10 text-[#6FCF45] flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">{totalCount}</div>
          <span className="text-[11px] text-[#6FCF45] font-semibold mt-1 block">Live in MongoDB</span>
        </div>

        <div className="bg-[#1A1D24] border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8B5AF]">In Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">{inReviewCount}</div>
          <span className="text-[11px] text-amber-400 font-semibold mt-1 block">Concierge action needed</span>
        </div>

        <div className="bg-[#1A1D24] border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8B5AF]">Confirmed Stays</span>
            <div className="w-8 h-8 rounded-lg bg-[#6FCF45]/10 text-[#6FCF45] flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">{confirmedCount}</div>
          <span className="text-[11px] text-[#6FCF45] font-semibold mt-1 block">Authorized bookings</span>
        </div>

        <div className="bg-[#1A1D24] border border-white/5 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8B5AF]">Estimated Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">
            ₹{(totalRevenuePipeline / 100000).toFixed(1)}L
          </div>
          <span className="text-[11px] text-blue-400 font-semibold mt-1 block">Total custom budget value</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-[#1A1D24] border border-white/5 p-4 rounded-2xl shadow-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B5AF]" />
          <input
            type="text"
            placeholder="Search by Ref code (CT-XXXXXX), client name, phone, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-[#A8B5AF]/60 focus:outline-none focus:border-[#6FCF45] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#13151A] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>Status: {status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#1A1D24] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#13151A] text-[#A8B5AF] text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                <th className="p-4">Package Ref &amp; Client</th>
                <th className="p-4">Route &amp; Destinations</th>
                <th className="p-4">Duration &amp; Guests</th>
                <th className="p-4">Estimated Budget</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-[#A8B5AF]">
                    <div className="inline-block w-6 h-6 border-2 border-[#6FCF45] border-t-transparent rounded-full animate-spin mb-2" />
                    <div>Loading custom packages from MongoDB...</div>
                  </td>
                </tr>
              ) : filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-[#A8B5AF]">
                    <div className="text-sm font-semibold text-white">No custom packages found</div>
                    <p className="text-xs text-[#A8B5AF] mt-1">Click "+ Create Custom Package" to add a bespoke itinerary.</p>
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => {
                  const destinations = pkg.toDestinations || pkg.destinations || []
                  const clientName = pkg.contactInfo?.fullName || pkg.name || 'VIP Traveler'
                  const clientEmail = pkg.contactInfo?.email || pkg.email || ''
                  const clientPhone = pkg.contactInfo?.phone || pkg.phone || ''
                  const budgetVal = Number(pkg.budgetEstimatedINR) || 250000
                  const travelersCount =
                    (pkg.travellers?.adults || 0) +
                    (pkg.travellers?.children || 0) ||
                    pkg.travelers ||
                    2

                  return (
                    <tr key={pkg._id} className="hover:bg-white/[0.02] transition-colors group">
                      
                      {/* Ref & Client */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs bg-[#6FCF45]/15 text-[#6FCF45] border border-[#6FCF45]/30 px-2 py-0.5 rounded-lg">
                            {pkg.inquiryReference || 'CT-REF'}
                          </span>
                        </div>
                        <div className="font-bold text-white text-sm mt-1.5">{clientName}</div>
                        <div className="text-[11px] text-[#A8B5AF] flex items-center gap-2 mt-0.5">
                          {clientPhone && <span>{clientPhone}</span>}
                          {clientEmail && <span className="truncate max-w-[140px]">{clientEmail}</span>}
                        </div>
                      </td>

                      {/* Route & Destinations */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#6FCF45]" />
                          <span className="max-w-[220px] truncate" title={destinations.join(' → ')}>
                            {destinations.length > 0 ? destinations.join(' → ') : 'Custom Itinerary'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#A8B5AF] ml-5 flex items-center gap-1 mt-0.5">
                          <span>From: {pkg.fromLocation || 'India'}</span>
                        </div>
                      </td>

                      {/* Duration & Guests */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <span>{pkg.approxDurationDays || 7} Days</span>
                        </div>
                        <div className="text-[11px] text-[#A8B5AF] ml-5 flex items-center gap-1 mt-0.5">
                          <Users className="w-3 h-3 text-[#A8B5AF]" />
                          <span>{travelersCount} Guests</span>
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="p-4">
                        <div className="font-mono font-extrabold text-[#6FCF45] text-sm">
                          ₹{budgetVal.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-[#A8B5AF] uppercase">
                          {pkg.budgetTier || 'Signature Luxury'}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="p-4 text-center">
                        <select
                          value={pkg.status || 'New'}
                          onChange={(e) => handleQuickStatusChange(pkg._id || pkg.id || pkg.inquiryReference, e.target.value)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none ${getStatusBadge(
                            pkg.status || 'New'
                          )}`}
                        >
                          <option value="New" className="bg-[#1A1D24] text-white">New</option>
                          <option value="Pending Concierge Review" className="bg-[#1A1D24] text-white">In Review</option>
                          <option value="Curating Itinerary" className="bg-[#1A1D24] text-white">Curating Itinerary</option>
                          <option value="Quotation Sent" className="bg-[#1A1D24] text-white">Quotation Sent</option>
                          <option value="Confirmed" className="bg-[#1A1D24] text-white">Confirmed</option>
                          <option value="Closed" className="bg-[#1A1D24] text-white">Closed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Full Inquiry Details */}
                          <button
                            onClick={() => handleOpenView(pkg)}
                            className="p-2 rounded-xl bg-white/5 text-[#A8B5AF] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="View Full Package Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Package */}
                          <button
                            onClick={() => handleOpenEdit(pkg)}
                            className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-[#071A16] border border-blue-500/30 transition-all cursor-pointer"
                            title="Edit Custom Package"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(pkg._id, pkg.inquiryReference)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all cursor-pointer"
                            title="Delete Package"
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
      {/* MODAL: CREATE / EDIT CUSTOM PACKAGE                                      */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1A1D24] border border-white/10 rounded-3xl w-full max-w-[840px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#13151A]">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#6FCF45] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>{isEditing ? 'Update Custom Package' : 'New Bespoke Package'}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {isEditing ? `Edit Package: ${formData.inquiryReference}` : 'Create Custom Travel Package'}
                </h2>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#A8B5AF] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* Section 1: Client Contact Info */}
              <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-[#6FCF45] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Client Contact Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Client Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={formData.contactInfo.fullName}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactInfo: { ...formData.contactInfo, fullName: e.target.value }
                      })}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.contactInfo.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactInfo: { ...formData.contactInfo, email: e.target.value }
                      })}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Phone / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.contactInfo.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        contactInfo: { ...formData.contactInfo, phone: e.target.value }
                      })}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Destinations & Dates */}
              <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-[#6FCF45] uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Route, Duration &amp; Guest Count</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Departure City (From) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi (DEL)"
                      value={formData.fromLocation}
                      onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Destinations (Comma separated) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kashmir, Srinagar, Gulmarg"
                      value={destinationsText}
                      onChange={(e) => setDestinationsText(e.target.value)}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.approxDurationDays}
                      onChange={(e) => setFormData({ ...formData, approxDurationDays: Number(e.target.value) })}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Adult Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.travellers.adults}
                      onChange={(e) => setFormData({
                        ...formData,
                        travellers: { ...formData.travellers, adults: Number(e.target.value) }
                      })}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Budget & Status */}
              <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-[#6FCF45] uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Pricing, Budget Tier &amp; Status</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Estimated Budget (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.budgetEstimatedINR}
                      onChange={(e) => setFormData({ ...formData, budgetEstimatedINR: Number(e.target.value) })}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Budget Tier</label>
                    <input
                      type="text"
                      placeholder="e.g. Signature Luxury"
                      value={formData.budgetTier}
                      onChange={(e) => setFormData({ ...formData, budgetTier: e.target.value })}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Inquiry Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                    >
                      <option value="New">New</option>
                      <option value="In Review by Concierge">In Review by Concierge</option>
                      <option value="Quotation Sent">Quotation Sent</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Activities, Stays & Notes */}
              <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-[#6FCF45] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Stays, Experiences &amp; Concierge Notes</span>
                </h3>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Accommodations (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 5-Star Luxury Cedar Chalet, Heritage Houseboat Suite"
                    value={accommodationsText}
                    onChange={(e) => setAccommodationsText(e.target.value)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#6FCF45]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Curated Activities (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Gulmarg Gondola Phase 2 Summit Tour&#10;Private Dal Lake Shikara with live saffron tea"
                    value={activitiesText}
                    onChange={(e) => setActivitiesText(e.target.value)}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#6FCF45]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A8B5AF] mb-1">Special Notes / Requests</label>
                  <textarea
                    rows={2}
                    placeholder="Anniversary celebration, vegan dietary requests, private charter needs..."
                    value={formData.contactInfo.notes}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, notes: e.target.value }
                    })}
                    className="w-full bg-[#1A1D24] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#6FCF45]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5db836] text-[#071A16] px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#6FCF45]/20 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{isEditing ? 'Update Package' : 'Save Package'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW FULL DETAILS OF PACKAGE                                      */}
      {/* ========================================================================= */}
      {viewDetailsModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1A1D24] border border-white/10 rounded-3xl w-full max-w-[700px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#13151A]">
              <div>
                <span className="font-mono font-bold text-xs bg-[#6FCF45]/15 text-[#6FCF45] px-2 py-0.5 rounded">
                  {selectedPackage.inquiryReference || 'REF-N/A'}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedPackage.contactInfo?.fullName || selectedPackage.name || 'Custom Package'}
                </h3>
              </div>

              <button
                onClick={() => setViewDetailsModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#A8B5AF] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              
              {/* Status & Budget */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#13151A] rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] text-[#A8B5AF] uppercase tracking-wider block">Estimated Budget</span>
                  <span className="text-lg font-mono font-extrabold text-[#6FCF45]">
                    ₹{Number(selectedPackage.budgetEstimatedINR || 250000).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#A8B5AF] block mt-0.5">{selectedPackage.budgetTier}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[#A8B5AF] uppercase tracking-wider block">Status</span>
                  <span className={`inline-block px-3 py-1 mt-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(selectedPackage.status || 'New')}`}>
                    {selectedPackage.status || 'New'}
                  </span>
                </div>
              </div>

              {/* Client Contact Info & Direct WhatsApp Chat */}
              <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5 space-y-3">
                <span className="text-[10px] text-[#6FCF45] uppercase tracking-wider font-bold block">
                  Traveler Contact Details &amp; Discussion
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white">
                  <div>
                    <span className="text-[10px] text-[#A8B5AF] uppercase block">Full Name</span>
                    <span className="font-semibold">{selectedPackage.contactInfo?.fullName || selectedPackage.name || 'Valued Explorer'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A8B5AF] uppercase block">Email Address</span>
                    <a href={`mailto:${selectedPackage.contactInfo?.email || selectedPackage.email}`} className="text-blue-400 hover:underline">
                      {selectedPackage.contactInfo?.email || selectedPackage.email || 'Not provided'}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A8B5AF] uppercase block">WhatsApp / Phone</span>
                    <span className="font-mono font-bold text-[#6FCF45]">{selectedPackage.contactInfo?.phone || selectedPackage.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A8B5AF] uppercase block">Travel Departure Date</span>
                    <span className="text-amber-400 font-medium">{selectedPackage.travelDate || selectedPackage.startDate || 'Flexible / Next 30 Days'}</span>
                  </div>
                </div>

                {(selectedPackage.contactInfo?.phone || selectedPackage.phone) && (
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${(selectedPackage.contactInfo?.phone || selectedPackage.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedPackage.contactInfo?.fullName || selectedPackage.name || 'Explorer'}! This is Tours & Travellers Concierge regarding your Bespoke Trip Inquiry #${selectedPackage.inquiryReference} for ${(selectedPackage.toDestinations || [selectedPackage.destination]).join(', ')}. We have prepared your curated itinerary and quote. Let's discuss!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Connect on WhatsApp with Client</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Route & Guests */}
              <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <MapPin className="w-4 h-4 text-[#6FCF45]" />
                  <span>Destinations: {(selectedPackage.toDestinations || [selectedPackage.destination] || []).join(' → ')}</span>
                </div>
                <div className="flex items-center gap-2 text-[#A8B5AF]">
                  <Plane className="w-4 h-4 text-blue-400" />
                  <span>Departure Location: {selectedPackage.fromLocation || selectedPackage.departure || 'India'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#A8B5AF]">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Duration: {selectedPackage.approxDurationDays || selectedPackage.duration || 7} Days • {selectedPackage.travelers || selectedPackage.travellers?.adults || 2} Guests ({selectedPackage.travelMode || selectedPackage.transport || 'Flight'})</span>
                </div>
              </div>

              {/* Accommodations & Activities */}
              {selectedPackage.accommodationStyle?.length > 0 && (
                <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5">
                  <span className="text-[10px] text-[#6FCF45] uppercase tracking-wider font-bold block mb-1.5">
                    Preferred Accommodations
                  </span>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {selectedPackage.accommodationStyle.map((acc, idx) => (
                      <li key={idx}>{acc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPackage.curatedActivities?.length > 0 && (
                <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5">
                  <span className="text-[10px] text-[#6FCF45] uppercase tracking-wider font-bold block mb-1.5">
                    Curated Activities &amp; Highlights
                  </span>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {selectedPackage.curatedActivities.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Client Notes */}
              {(selectedPackage.contactInfo?.notes || selectedPackage.specialRequests) && (
                <div className="p-4 bg-[#13151A] rounded-2xl border border-white/5">
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block mb-1">
                    Client Notes &amp; Special Requirements
                  </span>
                  <p className="text-white italic">{selectedPackage.contactInfo?.notes || selectedPackage.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-[#13151A] flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#A8B5AF] uppercase font-bold mr-1">Quick Status:</span>
                {['Pending Concierge Review', 'Curating Itinerary', 'Quotation Sent', 'Confirmed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      handleQuickStatusChange(selectedPackage._id, st)
                      setSelectedPackage({ ...selectedPackage, status: st })
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      selectedPackage.status === st
                        ? 'bg-[#6FCF45] text-[#071A16]'
                        : 'bg-white/5 text-[#A8B5AF] hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {st === 'Pending Concierge Review' ? 'In Review' : st === 'Quotation Sent' ? 'Quote Sent' : st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setViewDetailsModal(false)
                    handleOpenEdit(selectedPackage)
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white font-bold transition-colors cursor-pointer"
                >
                  Edit / Set Quote
                </button>
                <button
                  onClick={() => setViewDetailsModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPackages
