import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Calendar, Users, Award, ArrowRight } from 'lucide-react'

export const ProfileBookingsTab = ({
  userBookings,
  setSelectedBookingModal,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">My Expeditions &amp; Bookings</h1>
          <p className="text-xs text-[#94A3B8]">Review confirmed vouchers, itinerary details, and booking status.</p>
        </div>
        <Link
          to="/tours"
          className="bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
        >
          Book New Tour
        </Link>
      </div>

      {userBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userBookings.map((b, idx) => {
            const bookingRef =
              b.bookingReference ||
              b.id ||
              (b._id ? `TT-${b._id.toString().slice(-6).toUpperCase()}` : `TT-EXP-${idx + 101}`)
            const travelDateDisplay =
              b.travelDate || b.dates || b.logistics?.departureDate || 'Flexible Schedule'

            return (
              <div
                key={b._id || b.id || idx}
                className="bg-[#081C16] border border-white/5 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-[#94A3B8]">{bookingRef}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#6FCF45]/20 text-[#6FCF45] text-[10px] font-bold uppercase border border-[#6FCF45]/30">
                      {b.status || 'Confirmed'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{b.tourTitle || 'Luxury Expedition'}</h3>
                  <div className="space-y-1 text-xs text-[#94A3B8] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6FCF45]" />
                      <span>{travelDateDisplay}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#6FCF45]" />
                      <span>{b.travelers || 2} Explorers</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#6FCF45]" />
                      <span>Total: {b.totalPrice ? `₹${Number(b.totalPrice).toLocaleString('en-IN')}` : 'Paid & Secured'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setSelectedBookingModal(b)}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold text-center transition-all cursor-pointer"
                  >
                    View Itinerary
                  </button>
                  <button
                    onClick={() => setSelectedBookingModal(b)}
                    className="flex-1 py-2 rounded-xl bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] text-xs font-bold text-center transition-all cursor-pointer shadow-sm"
                  >
                    Download Voucher
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-[#081C16] border border-white/5 rounded-3xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-white mb-1">No Active Bookings Yet</h3>
          <p className="text-xs text-[#94A3B8] mb-4 max-w-sm mx-auto">
            Ready for your next grand adventure? Explore our curated signature journeys.
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
          >
            <span>Browse Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default ProfileBookingsTab

