import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Mail, 
  Phone, 
  Clock, 
  MessageSquare, 
  Check, 
  X, 
  Trash2, 
  Sparkles, 
  Filter, 
  Compass, 
  Users, 
  DollarSign, 
  Calendar, 
  Eye, 
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import api from '../services/api'

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all' | 'custom_trip' | 'contact'
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'Pending' | 'In Progress' | 'Resolved'
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/contact')
      if (data.success) {
        setEnquiries(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      // Optimistic UI update
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e))
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry(prev => ({ ...prev, status }))
      }

      await api.patch(`/contact/${id}/status`, { status })
    } catch (error) {
      console.error('Error updating status:', error)
      fetchEnquiries()
    }
  }

  const deleteEnquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        setEnquiries(prev => prev.filter(e => e._id !== id))
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(null)
        }
        await api.delete(`/contact/${id}`)
      } catch (error) {
        console.error('Error deleting enquiry:', error)
        fetchEnquiries()
      }
    }
  }

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch = 
      (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.message || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || e.inquiryType === typeFilter
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const customTripsCount = enquiries.filter(e => e.inquiryType === 'custom_trip').length
  const contactMessagesCount = enquiries.filter(e => e.inquiryType === 'contact').length

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-[#6FCF45]/30 bg-[#6FCF45]/10 text-[#6FCF45]">Resolved</span>
      case 'In Progress':
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">In Progress</span>
      case 'Pending':
      default:
        return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-400/30 bg-blue-400/10 text-blue-400">New / Pending</span>
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto animate-fadeIn font-sans space-y-6">
      
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1D24] border border-white/5 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#6FCF45]/15 text-[#6FCF45]">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
              Client Enquiries & Custom Trip Leads
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#A8B5AF] mt-1.5 ml-1">
            Centralized hub for VIP concierge inquiries, bespoke custom trip itineraries, and customer queries.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 bg-[#13151A] hover:bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-[#A8B5AF] hover:text-white transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#6FCF45]' : ''}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Controls Bar: Type Tabs, Status Filter & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#1A1D24] border border-white/5 p-4 rounded-xl">
        
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 bg-[#13151A] p-1 rounded-xl border border-white/5 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              typeFilter === 'all'
                ? 'bg-[#6FCF45] text-[#13151A] font-bold shadow-sm'
                : 'text-[#A8B5AF] hover:text-white hover:bg-white/5'
            }`}
          >
            All Leads ({enquiries.length})
          </button>
          <button
            onClick={() => setTypeFilter('custom_trip')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              typeFilter === 'custom_trip'
                ? 'bg-[#6FCF45] text-[#13151A] font-bold shadow-sm'
                : 'text-[#A8B5AF] hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Custom Trips ({customTripsCount})</span>
          </button>
          <button
            onClick={() => setTypeFilter('contact')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              typeFilter === 'contact'
                ? 'bg-[#6FCF45] text-[#13151A] font-bold shadow-sm'
                : 'text-[#A8B5AF] hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Messages ({contactMessagesCount})</span>
          </button>
        </div>

        {/* Status Filter & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Status Dropdown */}
          <div className="flex items-center gap-2 bg-[#13151A] border border-white/10 rounded-xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#A8B5AF]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#1A1D24] text-white">All Statuses</option>
              <option value="Pending" className="bg-[#1A1D24] text-white">Pending / New</option>
              <option value="In Progress" className="bg-[#1A1D24] text-white">In Progress</option>
              <option value="Resolved" className="bg-[#1A1D24] text-white">Resolved</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AF]" />
            <input
              type="text"
              placeholder="Search leads, name, destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#13151A] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#6FCF45] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#1A1D24] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#13151A]/80 text-[#A8B5AF] text-[11px] font-bold uppercase tracking-wider border-b border-white/5">
                <th className="py-4 px-5">Lead / Client</th>
                <th className="py-4 px-5">Category & Subject</th>
                <th className="py-4 px-5">Details / Preview</th>
                <th className="py-4 px-5">Date Received</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-[#A8B5AF]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 text-[#6FCF45] animate-spin" />
                      <p>Loading enquiries and leads...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-[#A8B5AF]">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <MessageSquare className="w-10 h-10 text-white/10" />
                      <p className="text-sm font-semibold text-white">No enquiries found</p>
                      <p className="text-xs text-[#A8B5AF]">
                        {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                          ? 'Try adjusting your search query or filters.'
                          : 'New customer enquiries from the website or custom trip requests will appear here automatically.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr 
                    key={enquiry._id} 
                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                    onClick={() => setSelectedEnquiry(enquiry)}
                  >
                    {/* Customer */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#13382C] border border-[#6FCF45]/30 flex items-center justify-center text-[#6FCF45] font-extrabold text-xs shrink-0 shadow-inner">
                          {(enquiry.name || 'VIP').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white group-hover:text-[#6FCF45] transition-colors">
                            {enquiry.name}
                          </span>
                          <span className="text-[11px] text-[#A8B5AF]">{enquiry.email}</span>
                          {enquiry.phone && (
                            <span className="text-[10px] text-white/50">{enquiry.phone}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category & Subject */}
                    <td className="py-4 px-5 max-w-[220px]">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          enquiry.inquiryType === 'custom_trip'
                            ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {enquiry.inquiryType === 'custom_trip' ? <Compass className="w-2.5 h-2.5" /> : <Mail className="w-2.5 h-2.5" />}
                          <span>{enquiry.inquiryType === 'custom_trip' ? 'Custom Trip' : 'VIP Contact'}</span>
                        </span>
                        <span className="text-white/90 font-medium truncate" title={enquiry.subject}>
                          {enquiry.subject}
                        </span>
                      </div>
                    </td>

                    {/* Details / Preview */}
                    <td className="py-4 px-5 max-w-xs">
                      <p className="text-[#A8B5AF] text-[11px] line-clamp-2 leading-relaxed" title={enquiry.message}>
                        {enquiry.message || 'No additional note provided.'}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-[#A8B5AF] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#6FCF45]/60" />
                        <span>{new Date(enquiry.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {getStatusBadge(enquiry.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
                        {enquiry.status !== 'In Progress' && enquiry.status !== 'Resolved' && (
                          <button
                            onClick={() => updateStatus(enquiry._id, 'In Progress')}
                            className="p-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400 hover:text-[#071A16] transition-colors border border-yellow-400/30"
                            title="Mark as In Progress"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {enquiry.status !== 'Resolved' && (
                          <button
                            onClick={() => updateStatus(enquiry._id, 'Resolved')}
                            className="p-1.5 rounded-lg bg-[#6FCF45]/10 text-[#6FCF45] hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors border border-[#6FCF45]/30"
                            title="Mark as Resolved"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteEnquiry(enquiry._id)}
                          className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-colors border border-red-400/30"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Detail View Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1A1D24] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#13151A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#13382C] border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] font-extrabold text-sm">
                  {(selectedEnquiry.name || 'VIP').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedEnquiry.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#A8B5AF]">{selectedEnquiry.source}</span>
                    <span className="text-white/20">•</span>
                    {getStatusBadge(selectedEnquiry.status)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A8B5AF] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#13151A] border border-white/5">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#6FCF45]" />
                  <div>
                    <p className="text-[10px] text-[#A8B5AF] uppercase font-bold">Email Address</p>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-xs font-semibold text-white hover:text-[#6FCF45] hover:underline">
                      {selectedEnquiry.email || 'N/A'}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#6FCF45]" />
                  <div>
                    <p className="text-[10px] text-[#A8B5AF] uppercase font-bold">Phone Number</p>
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-xs font-semibold text-white hover:text-[#6FCF45] hover:underline">
                      {selectedEnquiry.phone || 'N/A'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Custom Trip Details if available */}
              {selectedEnquiry.inquiryType === 'custom_trip' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#13151A] border border-white/5 text-xs">
                  <div>
                    <p className="text-[10px] text-[#A8B5AF] uppercase font-bold">Destination</p>
                    <p className="font-semibold text-white mt-0.5">{selectedEnquiry.destination || 'Bespoke'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#A8B5AF] uppercase font-bold">Duration</p>
                    <p className="font-semibold text-white mt-0.5">{selectedEnquiry.duration ? `${selectedEnquiry.duration} Days` : 'Custom'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#A8B5AF] uppercase font-bold">Adults / Kids</p>
                    <p className="font-semibold text-white mt-0.5">
                      {selectedEnquiry.travellers ? `${selectedEnquiry.travellers.adults || 2} Adults` : '2 Adults'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#A8B5AF] uppercase font-bold">Budget Tier</p>
                    <p className="font-semibold text-[#6FCF45] mt-0.5">{selectedEnquiry.budget || 'Signature Luxury'}</p>
                  </div>
                </div>
              )}

              {/* Subject & Detailed Message */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {selectedEnquiry.subject}
                </h4>
                <div className="p-4 rounded-xl bg-[#13151A] border border-white/5 text-xs text-white/90 whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message || 'No additional notes entered by customer.'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-[#13151A]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A8B5AF]">Change Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => updateStatus(selectedEnquiry._id, e.target.value)}
                  className="bg-[#1A1D24] text-xs text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#6FCF45]"
                >
                  <option value="Pending">Pending / New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {selectedEnquiry.email && (
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Regarding your enquiry: ${encodeURIComponent(selectedEnquiry.subject)}`}
                    className="px-3 py-1.5 rounded-lg bg-[#6FCF45] text-[#071A16] text-xs font-bold hover:bg-[#8AE863] transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                )}
                <button
                  onClick={() => deleteEnquiry(selectedEnquiry._id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-colors border border-red-500/20"
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

export default AdminEnquiries
