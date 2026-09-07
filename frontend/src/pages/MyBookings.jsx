import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, CheckCircle2, XCircle, ArrowLeft, Download } from 'lucide-react'
import { useBooking } from '../context/BookingContext'
import Button from '../components/Button'

export const MyBookings = () => {
  const { bookings, cancelBooking, loadBookings } = useBooking()

  useEffect(() => {
    loadBookings()
  }, [])

  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-24 bg-[#071A16] text-white min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <Link to="/account" className="text-xs text-[#6FCF45] hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
            </Link>
            <h1 className="text-3xl font-extrabold text-white">My Expedition Bookings</h1>
          </div>
          <Button to="/tours" variant="primary" size="sm">
            Book Another Trip
          </Button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-[#0B241E] border border-white/10 rounded-[8px] p-12 text-center max-w-lg mx-auto">
            <p className="text-sm text-[#A8B5AF]">No active or previous bookings found.</p>
            <Button to="/tours" variant="primary" size="md" className="mt-4">
              Explore Signature Tours
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, idx) => {
              const isCancelled = booking.status === 'Cancelled'
              const bookingRef =
                booking.bookingReference ||
                booking.id ||
                (booking._id ? `TT-${booking._id.toString().slice(-6).toUpperCase()}` : `TT-EXP-${idx + 101}`)

              const departure =
                booking.travelDate ||
                booking.dates ||
                booking.logistics?.departureDate ||
                'Flexible Schedule'

              return (
                <div
                  key={booking._id || booking.id || idx}
                  className="bg-[#0B241E] border border-white/10 rounded-[8px] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {booking.image && (
                      <img
                        src={booking.image}
                        alt={booking.tourTitle}
                        className="w-24 h-24 rounded-[6px] object-cover shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#6FCF45] bg-[#12382E] px-2 py-0.5 rounded">
                          {bookingRef}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                            isCancelled
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-[#6FCF45]/20 text-[#6FCF45]'
                          }`}
                        >
                          {isCancelled ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          {booking.status || 'Confirmed'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {booking.tourTitle || 'Luxury Expedition'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#A8B5AF] mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#6FCF45]" />
                          {booking.destination || 'Global Sanctuary'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#6FCF45]" />
                          {departure}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#6FCF45]" />
                          {booking.travelers || 2} Explorers
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 self-end md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-white/10 w-full md:w-auto justify-between">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-[#A8B5AF] uppercase font-bold block">
                        Total Tariff Paid
                      </span>
                      <span className="text-lg font-extrabold text-[#6FCF45]">
                        ₹{Number(booking.totalPrice || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCancelled && (
                        <button
                          onClick={() => cancelBooking(booking._id || booking.id || bookingRef)}
                          className="text-xs text-red-400/80 hover:text-red-300 px-3 py-2 border border-red-500/20 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}
                      <Link
                        to={`/tours/${booking.tourId || 'kashmir-escape'}`}
                        className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded transition-colors"
                      >
                        View Itinerary
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
