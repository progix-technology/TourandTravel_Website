import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Clock,
  Users,
  Star,
  MapPin,
  Check,
  X as CloseIcon,
  Calendar,
  ShieldCheck,
  Heart,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { tourService } from '../services/tourService'
import { useWishlist } from '../context/WishlistContext'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Loader from '../components/Loader'

export const TourDetails = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [tour, setTour] = useState(() => {
    return tourService.getBySlug(slug)
  })
  const [loading, setLoading] = useState(false)
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { startBooking } = useBooking()
  const { isAuthenticated } = useAuth()

  const getUpcomingDate = (daysAhead = 10) => {
    const d = new Date()
    d.setDate(d.getDate() + daysAhead)
    return d.toISOString().split('T')[0]
  }

  // Booking Widget State
  const [travelDate, setTravelDate] = useState(() => getUpcomingDate(10))
  const [travelers, setTravelers] = useState(1)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [openDay, setOpenDay] = useState(1)

  const ADDONS = [
    { id: 'heli', name: 'Scenic Helicopter / Seaplane Charter Upgrade', price: 450 },
    { id: 'spa', name: 'Couples Holistic Ayurveda Spa Ritual', price: 280 },
    { id: 'wine', name: 'Private Sommelier Wine & Dining Experience', price: 190 },
  ]

  useEffect(() => {
    const fetchTour = async () => {
      const data = await tourService.getBySlug(slug)
      setTour(data)
    }
    fetchTour()
  }, [slug])

  if (loading && !tour) return <div className="pt-32"><Loader label="Loading Expedition Itinerary..." /></div>
  if (!tour) {
    return (
      <div className="pt-36 pb-24 text-center">
        <h2 className="text-2xl font-bold text-white">Tour Not Found</h2>
        <Button to="/tours" variant="primary" className="mt-4">
          Browse Tours
        </Button>
      </div>
    )
  }

  const inWishlist = isInWishlist(tour.id || tour.slug)

  const toggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id))
    } else {
      setSelectedAddons([...selectedAddons, addon])
    }
  }

  const startingRate = Number(tour.startingPrice || tour.price || 0)
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price || 0), 0)
  const baseTotal = startingRate * travelers
  const grandTotal = baseTotal + addonsTotal

  const handleProceedToBooking = () => {
    startBooking(tour, {
      travelers,
      travelDate,
      addons: selectedAddons,
    })
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/booking/${tour.slug || tour.id}` } } })
      return
    }
    navigate(`/booking/${tour.slug || tour.id}`)
  }

  return (
    <div className="pb-24 bg-[#071A16] text-white min-h-screen">
      {/* Tour Hero Banner (Full-Bleed Edge-to-Edge to the Top) */}
      <div className="relative h-[560px] sm:h-[620px] lg:h-[660px] w-full overflow-hidden flex flex-col justify-end">
        <img
          src={tour.image}
          alt={tour.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A16] via-[#071A16]/50 to-transparent" />
        <div className="absolute inset-0 bg-[#071A16]/20" />

        <div className="relative z-10 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded bg-[#6FCF45] text-[#071A16] text-xs font-extrabold tracking-widest uppercase">
              {tour.category}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 backdrop-blur-md text-xs text-white font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#6FCF45]" />
              {tour.destination}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 text-xs font-bold text-[#EAB308]">
              <Star className="w-3.5 h-3.5 fill-[#EAB308]" />
              {tour.rating} ({tour.reviewsCount || 60} reviews)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {tour.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#FAF8F2]/90 max-w-2xl">
            {tour.subtitle}
          </p>
        </div>
      </div>

      {/* Main Grid: Details (Left 7) vs Sticky Booking Widget (Right 5) */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Itinerary, Inclusions & Overview */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#0B241E] border border-white/10 rounded-[6px] p-4 text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#6FCF45]" />
                <div>
                  <span className="text-[#A8B5AF] block text-[10px]">DURATION</span>
                  <span className="font-bold text-white">{tour.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#6FCF45]" />
                <div>
                  <span className="text-[#A8B5AF] block text-[10px]">GROUP SIZE</span>
                  <span className="font-bold text-white">{tour.groupSize || 'Max 10'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#6FCF45]" />
                <div>
                  <span className="text-[#A8B5AF] block text-[10px]">DIFFICULTY</span>
                  <span className="font-bold text-white">Custom / Leisure</span>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-[#0B241E] border border-white/10 rounded-[6px] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-3">Expedition Overview</h2>
              <p className="text-xs sm:text-sm text-[#A8B5AF] leading-relaxed">
                {tour.overview}
              </p>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="bg-[#0B241E] border border-white/10 rounded-[6px] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Day-by-Day Journey</h2>
                <span className="text-xs text-[#6FCF45] font-bold uppercase tracking-wider">
                  {tour.itinerary?.length || 7} Days
                </span>
              </div>

              <div className="space-y-3">
                {tour.itinerary?.map((day) => {
                  const isOpen = openDay === day.day
                  return (
                    <div
                      key={day.day}
                      className="border border-white/10 rounded-[4px] bg-[#071A16] overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenDay(isOpen ? null : day.day)}
                        className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-[#12382E] text-[#6FCF45] font-mono text-xs font-bold">
                            DAY {day.day}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white">{day.title}</h4>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#A8B5AF] transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#6FCF45]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs text-[#A8B5AF] leading-relaxed border-t border-white/5">
                          {day.desc}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-[#0B241E] border border-white/10 rounded-[6px] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">What’s Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#6FCF45] mb-3">
                    COMPLIMENTARY INCLUSIONS
                  </h4>
                  <ul className="space-y-2.5 text-xs text-white/90">
                    {tour.inclusions?.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#6FCF45] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#A8B5AF] mb-3">
                    EXCLUSIONS
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#A8B5AF]">
                    {tour.exclusions?.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CloseIcon className="w-4 h-4 text-red-400/80 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#0B241E] border border-white/15 rounded-[8px] p-6 sm:p-8 shadow-2xl">
              <div className="flex items-start justify-between pb-5 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A8B5AF]">
                    STARTING TARIFF
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    ₹{startingRate.toLocaleString('en-IN')}{' '}
                    <span className="text-xs text-[#A8B5AF] font-normal">/ person</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(tour.id || tour.slug, navigate)}
                  className={`p-2.5 rounded-full border transition-colors ${
                    inWishlist
                      ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45]'
                      : 'bg-white/5 text-white border-white/15 hover:bg-white/10'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Form Controls */}
              <div className="py-5 space-y-4">
                {/* Date */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1.5">
                    Select Departure Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={travelDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-[#071A16] border border-white/15 rounded-[4px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                    />
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1.5">
                    Guests (Explorers)
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTravelers(num)}
                        className={`flex-1 py-2 text-xs font-bold rounded-[4px] border text-center transition-all ${
                          travelers === num
                            ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45]'
                            : 'bg-[#071A16] text-white/80 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Luxury Upgrades */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6FCF45] mb-2">
                    Optional Custom Add-ons
                  </label>
                  <div className="space-y-2">
                    {ADDONS.map((addon) => {
                      const isSelected = selectedAddons.some((a) => a.id === addon.id)
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`p-2.5 rounded-[4px] border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                            isSelected
                              ? 'bg-[#12382E] border-[#6FCF45] text-white'
                              : 'bg-[#071A16] border-white/10 text-[#A8B5AF] hover:border-white/20'
                          }`}
                        >
                          <span className="font-medium pr-2 text-[11px]">{addon.name}</span>
                          <span className="font-bold text-white shrink-0">+₹{addon.price.toLocaleString('en-IN')}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs text-[#A8B5AF]">
                  <div className="flex justify-between">
                    <span>
                      ₹{startingRate.toLocaleString('en-IN')} × {travelers} Travelers
                    </span>
                    <span className="text-white">₹{baseTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {addonsTotal > 0 && (
                    <div className="flex justify-between text-[#6FCF45]">
                      <span>Custom Upgrades</span>
                      <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                    <span>Total Tariff</span>
                    <span className="text-[#6FCF45] text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={handleProceedToBooking}
                  variant="primary"
                  size="lg"
                  className="w-full mt-2 tracking-widest text-xs"
                >
                  RESERVE EXPEDITION
                </Button>

                <p className="text-[10px] text-center text-[#A8B5AF] mt-2">
                  🔒 Fully protected booking • Zero deposit required today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetails
