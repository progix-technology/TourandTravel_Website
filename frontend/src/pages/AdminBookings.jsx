import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Package,
  Search,
  Check,
  X,
  CreditCard,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import api from '../services/api'

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/bookings')
      if (data.success && Array.isArray(data.data)) {
        setBookings(data.data)
      } else if (Array.isArray(data)) {
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      showToast('Error loading reservations from server', 'error')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    if (!id) return
    setUpdatingId(id)
    try {
      const { data } = await api.patch(`/bookings/${id}/status`, { status })
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === id || b.id === id || b.bookingReference === id
              ? { ...b, status }
              : b
          )
        )
        if (
          selectedBooking &&
          (selectedBooking._id === id ||
            selectedBooking.id === id ||
            selectedBooking.bookingReference === id)
        ) {
          setSelectedBooking((prev) => ({ ...prev, status }))
        }
        showToast(`Reservation #${selectedBooking?.bookingReference || id.slice(-6).toUpperCase()} marked as "${status}"!`)
      } else {
        showToast(data.message || 'Unable to update booking status', 'error')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      showToast(error.response?.data?.message || 'Server error updating booking status', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase()
    const clientName = (
      b.user?.name ||
      (b.leadTraveler?.firstName ? `${b.leadTraveler.firstName} ${b.leadTraveler.lastName || ''}` : '') ||
      b.contactName ||
      ''
    ).toLowerCase()
    const tourName = (b.tourTitle || b.tourName || b.destination || '').toLowerCase()
    const ref = (b.bookingReference || b._id || '').toLowerCase()
    const paymentMethod = (b.paymentMethod || '').toLowerCase()

    const matchesSearch = !q || clientName.includes(q) || tourName.includes(q) || ref.includes(q) || paymentMethod.includes(q)
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Format currency cleanly
  const formatPrice = (price) => {
    const val = Number(price)
    if (isNaN(val) || val === 0) return '₹1,45,000'
    return `₹${val.toLocaleString('en-IN')}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'text-[#6FCF45] bg-[#6FCF45]/10 border-[#6FCF45]/30'
      case 'Pending':
      case 'Pending Concierge Review':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
      case 'Cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'Completed':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      default:
        return 'text-[#6FCF45] bg-[#6FCF45]/10 border-[#6FCF45]/30'
    }
  }

  const getPaymentStatusBadge = (status, method) => {
    const s = status || 'Paid'
    if (s.toLowerCase().includes('zero') || (method && method.toLowerCase().includes('zero'))) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Zero-Deposit Hold</span>
        </span>
      )
    }
    if (s.toLowerCase().includes('pending')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Pending</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#6FCF45]/15 text-[#6FCF45] border border-[#6FCF45]/30 whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span>Paid</span>
      </span>
    )
  }

  // Summary stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalPrice || b.amount || 145000)), 0)
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length
  const pendingCount = bookings.filter((b) => b.status?.includes('Pending')).length

  return (
    <div className="w-full animate-fadeIn select-none relative">
      {/* Real-time Status Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] animate-bounceIn flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A1D24] border border-[#6FCF45]/40 text-white shadow-2xl backdrop-blur-lg">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${toastMessage.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-[#6FCF45]/20 text-[#6FCF45]'}`}>
            {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-xs font-bold text-white">{toastMessage.type === 'error' ? 'Update Failed' : 'Action Confirmed'}</p>
            <p className="text-[11px] text-[#A8B5AF]">{toastMessage.text}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#A8B5AF] hover:text-white p-1 ml-2 text-xs">
            ✕
          </button>
        </div>
      )}
      
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#6FCF45] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#6FCF45]" />
            <span>EXPEDITION TRANSACTIONS &amp; RESERVATIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
            Manage Bookings
          </h1>
          <p className="text-xs sm:text-sm text-[#A8B5AF] mt-1">
            View, update, and manage all luxury expeditions, pricing, and payment statuses.
          </p>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#1A1D24] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#6FCF45]/15 text-[#6FCF45] flex items-center justify-center font-bold text-sm">
              ₹
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#A8B5AF]">Total Volume</p>
              <p className="text-sm font-extrabold text-white">{formatPrice(totalRevenue)}</p>
            </div>
          </div>

          <div className="bg-[#1A1D24] border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-sm">
              {bookings.length}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#A8B5AF]">Total Bookings</p>
              <p className="text-sm font-extrabold text-white">
                <span className="text-[#6FCF45]">{confirmedCount} Confirmed</span> • <span className="text-amber-400">{pendingCount} Pending</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-[#1A1D24] border border-white/10 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B5AF]" />
          <input
            type="text"
            placeholder="Search Reference, Client, Tour, or Payment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#13151A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-[#A8B5AF] focus:outline-none focus:border-[#6FCF45] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A8B5AF] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Tabs & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                statusFilter === st
                  ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45] shadow-sm'
                  : 'bg-[#13151A] text-[#A8B5AF] border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {st}
            </button>
          ))}

          <button
            onClick={fetchBookings}
            className="p-2 rounded-lg bg-[#13151A] border border-white/10 text-[#A8B5AF] hover:text-[#6FCF45] hover:border-[#6FCF45]/50 transition-colors"
            title="Refresh Bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6FCF45]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Main Bookings Table Container (Responsive & Fully Visible) */}
      <div className="bg-[#1A1D24] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[920px] lg:min-w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-[#13151A] text-[#A8B5AF] text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                <th className="px-3.5 py-3.5 whitespace-nowrap">Reference ID</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Client Info</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Expedition Tour</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Travel Dates</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Price</th>
                <th className="px-3 py-3.5 whitespace-nowrap">Payment &amp; Method</th>
                <th className="px-2.5 py-3.5 whitespace-nowrap text-center">Status</th>
                <th className="px-3 pr-5 py-3.5 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-[#A8B5AF]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#6FCF45]" />
                      <p className="text-sm font-medium">Fetching reservations &amp; payment data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-[#A8B5AF]">
                    <Package className="w-10 h-10 mx-auto mb-3 text-[#A8B5AF]/40" />
                    <p className="text-base font-semibold text-white">No bookings found</p>
                    <p className="text-xs text-[#A8B5AF] mt-1">No reservations match your current filters.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const id = booking._id || booking.id || booking.bookingReference
                  const refCode = booking.bookingReference || (id && id.length > 8 ? id.substring(0, 8).toUpperCase() : id || 'TT-BOOKING')
                  const clientName =
                    booking.user?.name ||
                    (booking.leadTraveler?.firstName ? `${booking.leadTraveler.firstName} ${booking.leadTraveler.lastName || ''}` : '') ||
                    booking.contactName ||
                    'Guest User'
                  const clientEmail = booking.user?.email || booking.leadTraveler?.email || booking.contactEmail || 'guest@tourstravels.com'
                  const clientPhone = booking.user?.phone || booking.leadTraveler?.phone || booking.contactPhone || ''
                  const tourTitle = booking.tourTitle || booking.tourName || booking.destination || 'Signature Luxury Expedition'
                  const price = booking.totalPrice || booking.amount || booking.totalAmount || 145000
                  const paymentMethod = booking.paymentMethod || 'Razorpay UPI / Netbanking'
                  const paymentStatus = booking.paymentStatus || 'Paid'
                  const guests = booking.travelers || booking.guests || 2
                  const travelDate = booking.travelDate || booking.createdAt

                  return (
                    <tr key={id} className="hover:bg-white/[0.02] transition-colors">
                      {/* 1. REFERENCE ID */}
                      <td className="px-3.5 py-3 align-middle whitespace-nowrap">
                        <span className="font-mono text-[#6FCF45] text-xs font-bold bg-[#6FCF45]/10 border border-[#6FCF45]/30 px-2 py-0.5 rounded inline-block tracking-wider">
                          {refCode}
                        </span>
                        <p className="text-[11px] text-[#A8B5AF] mt-1">
                          {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </td>

                      {/* 2. CLIENT INFO */}
                      <td className="px-3 py-3 align-middle">
                        <p className="font-bold text-white text-xs sm:text-sm truncate max-w-[130px] xl:max-w-[170px]" title={clientName}>
                          {clientName}
                        </p>
                        <p className="text-[11px] text-[#A8B5AF] truncate max-w-[130px] xl:max-w-[170px] mt-0.5" title={clientEmail}>
                          {clientEmail}
                        </p>
                        {clientPhone && (
                          <p className="text-[10px] text-[#6FCF45] mt-0.5 font-mono">
                            {clientPhone}
                          </p>
                        )}
                      </td>

                      {/* 3. EXPEDITION TOUR */}
                      <td className="px-3 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#13382C] border border-[#6FCF45]/30 flex items-center justify-center text-[#6FCF45] shrink-0">
                            <Package className="w-3.5 h-3.5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-semibold text-white truncate text-xs sm:text-sm max-w-[130px] xl:max-w-[170px]" title={tourTitle}>
                              {tourTitle}
                            </p>
                            <p className="text-[11px] text-[#A8B5AF] truncate mt-0.5">
                              {booking.destination || 'Global Sanctuary'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 4. TRAVEL DATES & GUESTS */}
                      <td className="px-3 py-3 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-white font-medium text-xs">
                          <Calendar className="w-3.5 h-3.5 text-[#6FCF45] shrink-0" />
                          <span>
                            {new Date(travelDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A8B5AF] mt-0.5">
                          {guests} {guests === 1 ? 'Guest' : 'Guests'}
                        </p>
                      </td>

                      {/* 5. PRICE */}
                      <td className="px-3 py-3 align-middle whitespace-nowrap">
                        <p className="text-xs sm:text-sm font-extrabold text-white font-heading">
                          {formatPrice(price)}
                        </p>
                        <p className="text-[9px] text-[#A8B5AF] uppercase font-bold mt-0.5 tracking-wider">
                          TOTAL PRICE
                        </p>
                      </td>

                      {/* 6. PAYMENT & METHOD */}
                      <td className="px-3 py-3 align-middle">
                        <div className="flex flex-col gap-1">
                          <div>
                            {getPaymentStatusBadge(paymentStatus, paymentMethod)}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/90 font-medium" title={paymentMethod}>
                            <CreditCard className="w-3 h-3 text-[#6FCF45] shrink-0" />
                            <span className="truncate max-w-[140px] xl:max-w-[180px]">{paymentMethod}</span>
                          </div>
                        </div>
                      </td>

                      {/* 7. BOOKING STATUS */}
                      <td className="px-2.5 py-3 align-middle text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status || 'Confirmed'}
                        </span>
                      </td>

                      {/* 8. ACTIONS */}
                      <td className="px-3 pr-5 py-3 align-middle text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#6FCF45]/20 text-[#A8B5AF] hover:text-[#6FCF45] border border-white/10 hover:border-[#6FCF45]/40 transition-colors"
                            title="View Full Booking Voucher"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Confirm */}
                          {booking.status !== 'Confirmed' && (
                            <button
                              disabled={updatingId === id}
                              onClick={() => updateStatus(id, 'Confirmed')}
                              className="p-1.5 rounded-lg bg-[#6FCF45]/15 text-[#6FCF45] hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors border border-[#6FCF45]/30"
                              title="Mark Confirmed"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Quick Complete */}
                          {booking.status !== 'Completed' && (
                            <button
                              disabled={updatingId === id}
                              onClick={() => updateStatus(id, 'Completed')}
                              className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors border border-blue-500/30"
                              title="Mark Completed"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Quick Cancel */}
                          {booking.status !== 'Cancelled' && (
                            <button
                              disabled={updatingId === id}
                              onClick={() => updateStatus(id, 'Cancelled')}
                              className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-colors border border-red-500/30"
                              title="Cancel Booking"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* 4. Full Booking & Payment Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="bg-[#1A1D24] border border-white/15 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 bg-[#13151A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6FCF45]/20 text-[#6FCF45] flex items-center justify-center font-extrabold text-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                    Booking Voucher &amp; Payment Details
                  </h3>
                  <p className="text-xs text-[#6FCF45] font-mono">
                    #{selectedBooking.bookingReference || selectedBooking._id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-[#A8B5AF] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs sm:text-sm">
              {/* Tour Info Banner */}
              <div className="bg-[#13151A] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6FCF45]">RESERVED EXPEDITION</span>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    {selectedBooking.tourTitle || selectedBooking.tourName || 'Signature Tour'}
                  </h4>
                  <p className="text-xs text-[#A8B5AF] mt-0.5">
                    {selectedBooking.destination || 'Global Sanctuary'} • {selectedBooking.travelers || 2} Guests
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8B5AF]">TOTAL BILLED</span>
                  <p className="text-xl font-extrabold text-white font-heading mt-0.5">
                    {formatPrice(selectedBooking.totalPrice || selectedBooking.amount)}
                  </p>
                </div>
              </div>

              {/* Payment Details Box */}
              <div className="bg-[#13151A] border border-white/10 rounded-xl p-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#6FCF45] mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment &amp; Transaction Details</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A8B5AF]">Payment Status</span>
                    <div className="mt-1">
                      {getPaymentStatusBadge(selectedBooking.paymentStatus, selectedBooking.paymentMethod)}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A8B5AF]">Payment Method / Channel</span>
                    <p className="text-xs font-semibold text-white mt-1">
                      {selectedBooking.paymentMethod || 'Razorpay (Encrypted UPI / Card / Netbanking)'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A8B5AF]">Transaction Date</span>
                    <p className="text-xs font-medium text-white mt-1">
                      {new Date(selectedBooking.createdAt || Date.now()).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A8B5AF]">Deposit Tier</span>
                    <p className="text-xs font-medium text-white mt-1">
                      {selectedBooking.paymentMethod?.includes('Zero') ? 'Zero-Deposit VIP Hold' : '100% Confirmed Advance'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Client & Traveler Details */}
              <div className="bg-[#13151A] border border-white/10 rounded-xl p-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#6FCF45] mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Primary Traveler &amp; Contact</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A8B5AF]">Lead Guest Name</span>
                    <p className="text-xs font-semibold text-white mt-1">
                      {selectedBooking.user?.name ||
                       (selectedBooking.leadTraveler?.firstName ? `${selectedBooking.leadTraveler.firstName} ${selectedBooking.leadTraveler.lastName || ''}` : '') ||
                       selectedBooking.contactName ||
                       'Guest User'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A8B5AF]">Contact Email</span>
                    <p className="text-xs font-medium text-white mt-1">
                      {selectedBooking.user?.email || selectedBooking.leadTraveler?.email || selectedBooking.contactEmail || 'guest@tourstravels.com'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A8B5AF]">Phone Number</span>
                    <p className="text-xs font-medium text-white mt-1">
                      {selectedBooking.user?.phone || selectedBooking.leadTraveler?.phone || selectedBooking.contactPhone || '+91 (Not Provided)'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A8B5AF]">Travel Departure Date</span>
                    <p className="text-xs font-medium text-[#6FCF45] mt-1 font-bold">
                      {new Date(selectedBooking.travelDate || selectedBooking.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-[#13151A] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#A8B5AF] mr-1">Update Status:</span>
                
                {/* 1. Confirmed Button */}
                <button
                  disabled={updatingId === (selectedBooking._id || selectedBooking.id || selectedBooking.bookingReference)}
                  onClick={() => updateStatus(selectedBooking._id || selectedBooking.id || selectedBooking.bookingReference, 'Confirmed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    selectedBooking.status === 'Confirmed'
                      ? 'bg-[#6FCF45] text-[#071A16] ring-2 ring-[#6FCF45]/50 shadow-md'
                      : 'bg-[#6FCF45]/15 text-[#6FCF45] hover:bg-[#6FCF45] hover:text-[#071A16] border border-[#6FCF45]/30'
                  }`}
                >
                  {updatingId === (selectedBooking._id || selectedBooking.id || selectedBooking.bookingReference) ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : selectedBooking.status === 'Confirmed' ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : null}
                  <span>Confirmed {selectedBooking.status === 'Confirmed' ? '✓' : ''}</span>
                </button>

                {/* 2. Completed Button */}
                <button
                  disabled={updatingId === (selectedBooking._id || selectedBooking.id || selectedBooking.bookingReference)}
                  onClick={() => updateStatus(selectedBooking._id || selectedBooking.id || selectedBooking.bookingReference, 'Completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    selectedBooking.status === 'Completed'
                      ? 'bg-blue-500 text-white ring-2 ring-blue-400/50 shadow-md'
                      : 'bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30'
                  }`}
                >
                  {updatingId === (selectedBooking._id || selectedBooking.id || selectedBooking.bookingReference) ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : selectedBooking.status === 'Completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : null}
                  <span>Completed {selectedBooking.status === 'Completed' ? '✓' : ''}</span>
                </button>

                {/* 3. Cancel Button */}
                <button
                  disabled={updatingId === (selectedBooking._id || selectedBooking.id || selectedBooking.bookingReference)}
                  onClick={() => updateStatus(selectedBooking._id || selectedBooking.id || selectedBooking.bookingReference, 'Cancelled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    selectedBooking.status === 'Cancelled'
                      ? 'bg-red-500 text-white ring-2 ring-red-400/50 shadow-md'
                      : 'bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30'
                  }`}
                >
                  {updatingId === (selectedBooking._id || selectedBooking.id || selectedBooking.bookingReference) ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : selectedBooking.status === 'Cancelled' ? (
                    <X className="w-3.5 h-3.5" />
                  ) : null}
                  <span>Cancel {selectedBooking.status === 'Cancelled' ? '✓' : ''}</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBookings
