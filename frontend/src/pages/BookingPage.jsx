import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  User,
  Calendar,
  Lock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Plane,
  Train,
  Bus,
  Car,
  Download,
  Zap,
  Clock,
  MapPin,
  Utensils,
  HeartHandshake,
  AlertCircle,
  QrCode,
  Check,
  Building,
  Phone,
  Mail,
  FileCheck,
  Info,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { useSettings } from '../context/SettingsContext'
import { TOURS } from '../utils/mockData'
import Button from '../components/Button'

// Helper function to get real-time dynamic date
const getDynamicDate = (daysAhead = 10) => {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().split('T')[0]
}

// Helper to format ISO date string to human-readable date
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return 'Selected on Confirmation'
  try {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      }
    }
    return dateStr
  } catch (e) {
    return dateStr
  }
}

export const DEPARTURE_CITIES = [
  'Lucknow (LKO) - Chaudhary Charan Singh Intl',
  'Delhi NCR (DEL) - Indira Gandhi Intl',
  'Mumbai (BOM) - Chhatrapati Shivaji Maharaj Intl',
  'Bengaluru (BLR) - Kempegowda Intl',
  'Hyderabad (HYD) - Rajiv Gandhi Intl',
  'Kolkata (CCU) - Netaji Subhash Chandra Bose Intl',
  'Chennai (MAA) - Chennai Intl',
  'Ahmedabad (AMD) - Sardar Vallabhbhai Patel Intl',
  'Jaipur (JAI) - Jaipur Intl',
  'Chandigarh (IXC) - Shaheed Bhagat Singh Intl',
  'Pune (PNQ) - Pune Airport',
  'Goa (GOI/GOX) - Dabolim / MOPA Intl',
  'Kochi (COK) - Cochin Intl',
  'Other / Home Doorstep Pickup',
]

export const TRAVEL_MODE_OPTIONS = [
  {
    id: 'flight',
    name: 'Flight (Airplane)',
    label: 'Flight / Airplane',
    shortLabel: '✈️ Flight',
    desc: 'Domestic & International flights / Business class',
    icon: Plane,
    ticketLabel: 'Flight Number / Preferred Airline (Optional)',
    placeholder: 'e.g. IndiGo 6E-204 / Air India AI-804',
  },
  {
    id: 'train',
    name: 'Train (Railway Express)',
    label: 'Train / Express Rail',
    shortLabel: '🚆 Train',
    desc: '1st AC / Vande Bharat / Rajdhani / Express Rail',
    icon: Train,
    ticketLabel: 'Train Name / PNR / Coach Preference (Optional)',
    placeholder: 'e.g. Vande Bharat Express (#22436) / 1st AC',
  },
  {
    id: 'bus',
    name: 'Luxury Volvo / Bus',
    label: 'Luxury Volvo Coach',
    shortLabel: '🚌 Luxury Bus',
    desc: 'Multi-Axle AC Sleeper / Semi-Sleeper Coach',
    icon: Bus,
    ticketLabel: 'Bus Operator / Boarding Point (Optional)',
    placeholder: 'e.g. Zingbus / Volvo 9600 Multi-Axle Sleeper',
  },
  {
    id: 'car',
    name: 'Private Chauffeur Car / SUV',
    label: 'Private Chauffeur Car',
    shortLabel: '🚗 Private Car',
    desc: 'Door-to-door dedicated Innova Crysta / Luxury SUV',
    icon: Car,
    ticketLabel: 'Vehicle Preference / Pickup Timing',
    placeholder: 'e.g. Dedicated Innova Crysta / 06:00 AM Pickup',
  },
]

export const CHALET_CONFIG_OPTIONS = [
  { id: 'king', name: '1 King Bed Suite (Luxury)', label: '1 King Bed Suite (Included - ₹0)', extraPrice: 0 },
  { id: 'twin', name: 'Twin Separate Beds (Executive)', label: 'Twin Separate Beds (Included - ₹0)', extraPrice: 0 },
  { id: 'villa', name: 'Private Overwater / Mountain Villa', label: 'Private Villa Upgrade (+₹15,000)', extraPrice: 15000 },
  { id: 'presidential', name: 'Presidential Family Connected Suite', label: 'Presidential Suite (+₹25,000)', extraPrice: 25000 },
  { id: 'pool_villa', name: 'Ultra-Luxury Villa with Private Pool', label: 'Royal Pool Villa (+₹40,000)', extraPrice: 40000 },
]

export const AIRPORT_TRANSFER_OPTIONS = [
  { id: 'sedan', name: 'Yes (Luxury Sedan Airport Pickup & Drop)', label: 'Luxury Sedan Pickup & Drop (+₹3,500)', extraPrice: 3500 },
  { id: 'suv', name: 'Yes (VIP Premium SUV / Crysta Transfer)', label: 'VIP Premium SUV / Crysta (+₹5,500)', extraPrice: 5500 },
  { id: 'mercedes', name: 'Yes (Mercedes / BMW Luxury Limousine Escort)', label: 'Mercedes / BMW Luxury Limousine (+₹12,000)', extraPrice: 12000 },
  { id: 'none', name: 'No (Self-Arranged Transit)', label: 'No Transfer (Self-Arranged - ₹0)', extraPrice: 0 },
]

export const BookingPage = () => {
  const { tourId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeBooking, completeBooking } = useBooking()

  // Find tour if activeBooking not set
  const currentTour =
    activeBooking ||
    TOURS.find((t) => t.id === tourId || t.slug === tourId) ||
    TOURS[0]

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const defaultDeparture = useMemo(() => currentTour.travelDate || getDynamicDate(10), [currentTour.travelDate])

  const [step, setStep] = useState(1)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Name extraction from authenticated user
  const nameParts = (user?.name || '').trim().split(' ')
  const initialFirstName = nameParts[0] || ''
  const initialLastName = nameParts.slice(1).join(' ') || ''

  // 1. Comprehensive Lead Explorer State
  const [leadTraveler, setLeadTraveler] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: user?.email || '',
    phone: user?.phone || '',
    nationality: 'Indian',
    idType: 'Aadhaar Card / Passport',
    idNumber: '',
    ageGroup: 'Adult (18-59)',
  })

  // Synchronize lead traveler if user object is loaded asynchronously
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ')
      setLeadTraveler((prev) => ({
        ...prev,
        firstName: prev.firstName || parts[0] || '',
        lastName: prev.lastName || parts.slice(1).join(' ') || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }))
      setPaymentInfo((prev) => ({
        ...prev,
        cardName: prev.cardName || user.name || '',
      }))
    }
  }, [user])

  // 2. Logistics & Tatkaal Express State
  const [logistics, setLogistics] = useState({
    departureCity: 'Lucknow (LKO) - Chaudhary Charan Singh Intl',
    customDepartureCity: '',
    pickupLocation: '',
    travelMode: 'Flight (Airplane)',
    transitDetails: '',
    departureDate: defaultDeparture,
    isTatkaal: false,
    tatkaalUrgency: 'Within 24-48 Hours (Express Priority)',
    roomPreference: '1 King Bed Suite (Luxury)',
    airportTransfer: 'Yes (Luxury Sedan Airport Pickup & Drop)',
    flightNumber: '',
  })

  // 3. Preferences & Emergency Contact
  const [preferences, setPreferences] = useState({
    dietary: 'Vegetarian (Custom Gourmet)',
    occasion: 'General Leisure & Exploration',
    specialNotes: '',
    emergencyName: '',
    emergencyPhone: '',
  })

  // 4. Payment State
  const [paymentType, setPaymentType] = useState('card') // 'card' | 'upi' | 'concierge'
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: user?.name || '',
    cardNumber: '',
    exp: '',
    cvv: '',
    upiId: '',
  })

  const { bookingSettings } = useSettings()

  // State for guest count (editable on booking page)
  const [guestCount, setGuestCount] = useState(() => Number(currentTour.travelers || 1))

  // Calculations & Dynamic Options
  const startingRate = Number(currentTour.startingPrice || currentTour.price || 14999)
  const addons = currentTour.addons || []
  const addonsTotal = addons.reduce((sum, a) => sum + Number(a.price || 0), 0)
  const tatkaalFee = logistics.isTatkaal ? 2500 : 0
  const basePrice = startingRate * guestCount

  const selectedChalet = CHALET_CONFIG_OPTIONS.find((c) => c.name === logistics.roomPreference) || CHALET_CONFIG_OPTIONS[0]
  const chaletUpgradeFee = selectedChalet.extraPrice || 0

  const selectedTransfer = AIRPORT_TRANSFER_OPTIONS.find((t) => t.name === logistics.airportTransfer) || AIRPORT_TRANSFER_OPTIONS[0]
  const transferFee = selectedTransfer.extraPrice || 0

  const taxRate = Number(bookingSettings?.gstTaxRate !== undefined ? bookingSettings.gstTaxRate : 5)
  const tax = Math.round((basePrice + chaletUpgradeFee + transferFee + addonsTotal + tatkaalFee) * (taxRate / 100))
  const totalPrice = basePrice + chaletUpgradeFee + transferFee + addonsTotal + tatkaalFee + tax

  const effectiveDepartureCity =
    logistics.departureCity.includes('Other') && logistics.customDepartureCity?.trim()
      ? logistics.customDepartureCity.trim()
      : logistics.departureCity

  const handleCompleteOrder = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    const result = await completeBooking({
      tourId: currentTour.id || currentTour.slug,
      tourTitle: currentTour.title || currentTour.tourTitle,
      destination: currentTour.destination,
      duration: currentTour.duration,
      image: currentTour.image,
      departureCity: effectiveDepartureCity,
      pickupLocation: logistics.pickupLocation || 'Main Terminal / Central Hub',
      travelMode: logistics.travelMode,
      transitDetails: logistics.transitDetails || logistics.flightNumber || '',
      travelDate: logistics.departureDate,
      travelers: guestCount,
      addons,
      leadTraveler,
      logistics: {
        ...logistics,
        departureCity: effectiveDepartureCity,
        pickupLocation: logistics.pickupLocation || 'Main Terminal / Central Hub',
        travelMode: logistics.travelMode,
        transitDetails: logistics.transitDetails || logistics.flightNumber || '',
      },
      preferences,
      paymentMethod:
        paymentType === 'card'
          ? 'Credit / Debit Card (256-Bit SSL Encrypted)'
          : paymentType === 'upi'
          ? `Instant UPI (${paymentInfo.upiId})`
          : 'Zero-Deposit VIP Concierge Desk Reservation',
      totalPrice,
    })

    setIsProcessing(false)
    setConfirmedBooking(result)
    setStep(3)
  }

  return (
    <div className="pt-28 sm:pt-32 md:pt-36 pb-20 bg-gradient-to-b from-[#081f19] via-[#0b241e] to-[#061713] text-white min-h-screen select-none">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        
        {/* Step Indicator Header (Compact & Balanced) */}
        <div className="max-w-xl mx-auto mb-7 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 ${
                step >= 1 ? 'text-[#6FCF45]' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= 1
                    ? 'bg-[#6FCF45] text-[#071A16] ring-2 ring-[#6FCF45]/30'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                1
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">Explorer Details</span>
            </div>

            <div className={`w-10 sm:w-16 h-[2px] rounded-full transition-all ${step >= 2 ? 'bg-[#6FCF45]' : 'bg-white/15'}`} />

            <div
              className={`flex items-center gap-2 ${
                step >= 2 ? 'text-[#6FCF45]' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= 2
                    ? 'bg-[#6FCF45] text-[#071A16] ring-2 ring-[#6FCF45]/30'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                2
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">Payment &amp; Review</span>
            </div>

            <div className={`w-10 sm:w-16 h-[2px] rounded-full transition-all ${step === 3 ? 'bg-[#6FCF45]' : 'bg-white/15'}`} />

            <div
              className={`flex items-center gap-2 ${
                step === 3 ? 'text-[#6FCF45]' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 3
                    ? 'bg-[#6FCF45] text-[#071A16] ring-2 ring-[#6FCF45]/30'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                3
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Step 3: Success Confirmation */}
        {step === 3 && confirmedBooking ? (
          <div className="bg-[#0e2721] border border-white/15 rounded-xl p-6 sm:p-10 text-center max-w-xl mx-auto shadow-2xl animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-[#12382E] border-2 border-[#6FCF45] flex items-center justify-center text-[#6FCF45] mx-auto mb-4 shadow-lg shadow-[#6FCF45]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-[#6FCF45] font-heading">
              EXPEDITION RESERVED SUCCESSFULLY
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-heading">
              You’re Heading Somewhere Extraordinary!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md mx-auto">
              Your reservation reference is{' '}
              <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
                {confirmedBooking.id || 'TT-EXP-2026'}
              </strong>.
              Vouchers dispatched to <strong className="text-[#6FCF45]">{leadTraveler.email}</strong>.
            </p>

            {logistics.isTatkaal && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAB308]/20 border border-[#EAB308]/40 text-[#EAB308] text-xs font-bold">
                <Zap className="w-4 h-4 fill-current" />
                <span>Tatkaal Fast-Track Dispatch Activated (within 60 mins)</span>
              </div>
            )}

            {/* Summary Voucher Card */}
            <div className="mt-5 bg-[#061814] border border-white/15 rounded-lg p-4 text-left text-xs space-y-2.5 shadow-inner">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-300">Expedition Package:</span>
                <span className="font-bold text-white text-sm">{confirmedBooking.tourTitle}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-300">Primary Explorer:</span>
                <span className="font-semibold text-white">
                  {leadTraveler.firstName} {leadTraveler.lastName} ({leadTraveler.phone})
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-300">Departure Origin:</span>
                <span className="font-semibold text-white">
                  {effectiveDepartureCity}
                </span>
              </div>
              {logistics.pickupLocation && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-300">Pickup Point:</span>
                  <span className="font-semibold text-white">
                    {logistics.pickupLocation}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-300">Travel Mode:</span>
                <span className="font-semibold text-[#6FCF45]">
                  {logistics.travelMode}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-300">Departure Schedule:</span>
                <span className="font-semibold text-[#6FCF45]">
                  {formatDisplayDate(logistics.departureDate)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-300">Party Size:</span>
                <span className="font-semibold text-white">{guestCount} Guests</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-300 font-semibold">Total Amount:</span>
                <span className="font-bold text-[#6FCF45] text-lg font-mono">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button to="/account/bookings" variant="primary" size="md">
                VIEW MY BOOKINGS
              </Button>
              <Button to="/" variant="secondary" size="md">
                RETURN TO HOME
              </Button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Booking Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Form Steps (Span 7) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* TATKAAL / EXPRESS BOOKING NOTICE BANNER */}
              <div className="bg-gradient-to-r from-[#103027] via-[#0c2620] to-[#071915] border border-[#6FCF45]/35 rounded-xl p-4 shadow-lg relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6FCF45]/20 border border-[#6FCF45]/50 flex items-center justify-center text-[#6FCF45] shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 fill-[#6FCF45]" />
                  </div>
                  <div className="space-y-1 text-left flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wide text-[#6FCF45] font-heading">
                        ⚡ Tatkaal / Urgent Departure Booking Available
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#6FCF45]/20 text-[#6FCF45] text-[10px] font-bold border border-[#6FCF45]/30">
                        24-72h Fast-Track
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Need immediate travel in the next 1 to 3 days? Enable <strong>Tatkaal Dispatch</strong>. Guaranteed flight slots &amp; instant dossier clearance within <strong>60 minutes</strong>.
                    </p>
                    
                    <label className="flex items-center gap-2.5 pt-1.5 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={logistics.isTatkaal}
                        onChange={(e) =>
                          setLogistics({ ...logistics, isTatkaal: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#6FCF45] bg-[#071A16] border-white/30 focus:ring-[#6FCF45] cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-white group-hover:text-[#6FCF45] transition-colors">
                        Request Tatkaal Express Dispatch (+₹2,500 priority handling)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {step === 1 && (
                <div className="bg-[#0e2721] border border-white/12 rounded-xl p-5 sm:p-6 space-y-6 text-left shadow-xl">
                  
                  {/* Part A: Lead Explorer */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#6FCF45] text-[#071A16] font-bold flex items-center justify-center text-xs shadow-md shadow-[#6FCF45]/25">
                          1
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-white font-heading">
                            Primary Voyager (Lead Explorer)
                          </h2>
                          <p className="text-xs text-slate-300">
                            Official contact person receiving all luxury travel vouchers &amp; boarding permits.
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex text-[11px] uppercase font-bold tracking-wider text-[#6FCF45] bg-[#6FCF45]/15 border border-[#6FCF45]/30 px-2.5 py-1 rounded">
                        Verified Contact
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            First Name <span className="text-[#6FCF45]">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Rahul"
                            value={leadTraveler.firstName}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, firstName: e.target.value })
                            }
                            required
                            className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            Last Name <span className="text-[#6FCF45]">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sharma"
                            value={leadTraveler.lastName}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, lastName: e.target.value })
                            }
                            required
                            className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            Official Email <span className="text-[#6FCF45]">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. rahul@example.com"
                            value={leadTraveler.email}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, email: e.target.value })
                            }
                            required
                            className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            Phone / WhatsApp Hotline <span className="text-[#6FCF45]">*</span>
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. +91 98765 43210"
                            value={leadTraveler.phone}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, phone: e.target.value })
                            }
                            required
                            className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            Nationality
                          </label>
                          <input
                            type="text"
                            value={leadTraveler.nationality}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, nationality: e.target.value })
                            }
                            className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            Govt ID / Passport
                          </label>
                          <input
                            type="text"
                            value={leadTraveler.idNumber}
                            placeholder="Aadhaar / Passport No."
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, idNumber: e.target.value })
                            }
                            className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            Age Group
                          </label>
                          <select
                            value={leadTraveler.ageGroup}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, ageGroup: e.target.value })
                            }
                            className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all cursor-pointer"
                          >
                            <option value="Adult (18-59)" className="bg-[#0b241e]">Adult (18-59)</option>
                            <option value="Senior Citizen (60+)" className="bg-[#0b241e]">Senior Citizen (60+)</option>
                            <option value="Young Adult (12-17)" className="bg-[#0b241e]">Young Adult (12-17)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Part B: Travel Mode & Departure Logistics */}
                  <div className="pt-5 border-t border-white/10">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#6FCF45] text-[#071A16] font-bold flex items-center justify-center text-xs shadow-md shadow-[#6FCF45]/25">
                          2
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-white font-heading">
                            Travel Mode &amp; Departure Logistics
                          </h2>
                          <p className="text-xs text-slate-300">
                            Select how you want to travel and where we should pick you up.
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex text-[11px] uppercase font-bold tracking-wider text-[#6FCF45] bg-[#6FCF45]/15 border border-[#6FCF45]/30 px-2.5 py-1 rounded">
                        🏨 Land Package + Chauffeur Included
                      </span>
                    </div>

                    <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-[#6FCF45]/10 to-transparent border border-[#6FCF45]/25 text-xs text-slate-200 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#6FCF45] shrink-0 mt-0.5" />
                      <span>
                        <strong>Package Scope:</strong> All packages include luxury resort stay, private local chauffeur, curated meals, sightseeings &amp; station/airport pickup. You can self-book your flight/train tickets or request our concierge for assisted ticket booking.
                      </span>
                    </div>

                    {/* Mode of Travel Selection (Plane / Train / Bus / Car) */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6FCF45] mb-2.5">
                        🚆 Travel Mode Preference (Kaise Aana/Jana Chahte Hain?) <span className="text-[#6FCF45]">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {TRAVEL_MODE_OPTIONS.map((mode) => {
                          const ModeIcon = mode.icon
                          const isSelected = logistics.travelMode === mode.name
                          return (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() =>
                                setLogistics({ ...logistics, travelMode: mode.name })
                              }
                              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                                isSelected
                                  ? 'bg-[#12382E] border-[#6FCF45] text-white shadow-md shadow-[#6FCF45]/20 ring-1 ring-[#6FCF45]'
                                  : 'bg-[#061814] border-white/15 text-slate-300 hover:border-white/35 hover:bg-[#0b241e] hover:text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div
                                  className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'bg-[#6FCF45] text-[#071A16]'
                                      : 'bg-white/10 text-slate-300 group-hover:bg-white/20'
                                  }`}
                                >
                                  <ModeIcon className="w-4 h-4" />
                                </div>
                                {isSelected ? (
                                  <span className="flex items-center gap-0.5 text-[10px] font-bold bg-[#6FCF45]/20 text-[#6FCF45] px-1.5 py-0.5 rounded border border-[#6FCF45]/40">
                                    <Check className="w-3 h-3 stroke-[3]" /> Selected
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-slate-500 group-hover:text-slate-400">Select</span>
                                )}
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                                  {mode.label}
                                </div>
                                <div className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-1">
                                  {mode.desc}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Origin / Departure City & Exact Pickup Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4 p-3.5 rounded-xl bg-[#061814] border border-[#6FCF45]/30 shadow-inner">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6FCF45] mb-1.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#6FCF45]" />
                          Origin / Departure Hub (Kahan Se Jana Hai) <span className="text-[#6FCF45]">*</span>
                        </label>
                        <select
                          value={logistics.departureCity}
                          onChange={(e) =>
                            setLogistics({ ...logistics, departureCity: e.target.value })
                          }
                          className="w-full bg-[#0b241e] border border-white/20 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45] cursor-pointer"
                        >
                          {DEPARTURE_CITIES.map((city) => (
                            <option key={city} value={city} className="bg-[#0b241e]">
                              {city}
                            </option>
                          ))}
                        </select>
                        {logistics.departureCity.includes('Other') && (
                          <input
                            type="text"
                            placeholder="Enter custom departure city (e.g. Varanasi, Surat)"
                            value={logistics.customDepartureCity}
                            onChange={(e) =>
                              setLogistics({ ...logistics, customDepartureCity: e.target.value })
                            }
                            className="w-full mt-2 bg-[#0b241e] border border-[#6FCF45]/50 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        )}
                        <span className="text-[11px] text-slate-300 mt-1.5 block">
                          📍 Departure: <strong className="text-white">{effectiveDepartureCity.split(' - ')[0]}</strong>
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6FCF45] mb-1.5 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#6FCF45]" />
                          Exact Pickup Point / Residence / Terminal <span className="text-[#6FCF45]">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Home Address / Terminal 2 / Railway Station"
                          value={logistics.pickupLocation}
                          onChange={(e) =>
                            setLogistics({ ...logistics, pickupLocation: e.target.value })
                          }
                          className="w-full bg-[#0b241e] border border-white/20 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6FCF45] placeholder:text-slate-500"
                        />
                        <span className="text-[11px] text-slate-300 mt-1.5 block">
                          🚗 Chauffeur will organize pickup from this spot.
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Transit Details Input based on selected Travel Mode */}
                    {(() => {
                      const currentModeObj =
                        TRAVEL_MODE_OPTIONS.find((m) => m.name === logistics.travelMode) ||
                        TRAVEL_MODE_OPTIONS[0]
                      return (
                        <div className="mb-4">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            {currentModeObj.ticketLabel}
                          </label>
                          <input
                            type="text"
                            placeholder={currentModeObj.placeholder}
                            value={logistics.transitDetails}
                            onChange={(e) =>
                              setLogistics({
                                ...logistics,
                                transitDetails: e.target.value,
                                flightNumber: e.target.value,
                              })
                            }
                            className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                          />
                        </div>
                      )
                    })()}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                          Departure Date <span className="text-[#6FCF45]">*</span>
                        </label>
                        <input
                          type="date"
                          min={todayStr}
                          value={logistics.departureDate}
                          onChange={(e) =>
                            setLogistics({ ...logistics, departureDate: e.target.value })
                          }
                          className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                        />
                        <span className="text-[11px] text-[#6FCF45] mt-1 block font-semibold">
                          Selected: {formatDisplayDate(logistics.departureDate)}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                          Total Explorers (Guests)
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 cursor-pointer"
                        >
                          <option value="1" className="bg-[#0b241e]">1 Explorer (Solo Luxury)</option>
                          <option value="2" className="bg-[#0b241e]">2 Explorers (Couples / Duo)</option>
                          <option value="3" className="bg-[#0b241e]">3 Explorers</option>
                          <option value="4" className="bg-[#0b241e]">4 Explorers (Group)</option>
                          <option value="6" className="bg-[#0b241e]">6 Explorers (VIP Entourage)</option>
                        </select>
                        <span className="text-[11px] text-slate-300 mt-1 block">
                          Tariff calculates per person
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                          Chalet &amp; Bed Configuration
                        </label>
                        <select
                          value={logistics.roomPreference}
                          onChange={(e) =>
                            setLogistics({ ...logistics, roomPreference: e.target.value })
                          }
                          className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 cursor-pointer"
                        >
                          {CHALET_CONFIG_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.name} className="bg-[#0b241e]">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-[11px] text-[#6FCF45] mt-1 block font-semibold">
                          {chaletUpgradeFee > 0 ? `+₹${chaletUpgradeFee.toLocaleString('en-IN')} Upgrade` : 'Standard suite included'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3.5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                          Local Chauffeur / Station Transfer
                        </label>
                        <select
                          value={logistics.airportTransfer}
                          onChange={(e) =>
                            setLogistics({ ...logistics, airportTransfer: e.target.value })
                          }
                          className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 cursor-pointer"
                        >
                          {AIRPORT_TRANSFER_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.name} className="bg-[#0b241e]">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-[11px] text-[#6FCF45] mt-1 block font-semibold">
                          {transferFee > 0 ? `+₹${transferFee.toLocaleString('en-IN')} Dedicated Transfer` : 'Self-arranged (₹0)'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                          Optional Arrival Time / Schedule Notes
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 10:00 AM Morning Check-in"
                          value={logistics.flightNumber}
                          onChange={(e) =>
                            setLogistics({ ...logistics, flightNumber: e.target.value })
                          }
                          className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part C: Dining, Occasions & Emergency Contact */}
                  <div className="pt-5 border-t border-white/10">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/10 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-[#6FCF45] text-[#071A16] font-bold flex items-center justify-center text-xs shadow-md shadow-[#6FCF45]/25">
                        3
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white font-heading">
                          Dining Preferences &amp; Emergency Contact
                        </h2>
                        <p className="text-xs text-slate-300">
                          Tailor your gourmet dining and special celebration requests.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                          Dietary Preference
                        </label>
                        <select
                          value={preferences.dietary}
                          onChange={(e) =>
                            setPreferences({ ...preferences, dietary: e.target.value })
                          }
                          className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 cursor-pointer"
                        >
                          <option value="Vegetarian (Custom Gourmet)" className="bg-[#0b241e]">Vegetarian (Custom Gourmet)</option>
                          <option value="Jain Pure Vegetarian" className="bg-[#0b241e]">Jain Pure Vegetarian</option>
                          <option value="Halal Gourmet" className="bg-[#0b241e]">Halal Gourmet</option>
                          <option value="Vegan / Plant-Based" className="bg-[#0b241e]">Vegan / Plant-Based</option>
                          <option value="Chef Signature Non-Veg" className="bg-[#0b241e]">Chef Signature Non-Veg</option>
                          <option value="Gluten-Free / Allergen Specific" className="bg-[#0b241e]">Gluten-Free / Allergen Specific</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                          Celebrating an Occasion?
                        </label>
                        <select
                          value={preferences.occasion}
                          onChange={(e) =>
                            setPreferences({ ...preferences, occasion: e.target.value })
                          }
                          className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 cursor-pointer"
                        >
                          <option value="Anniversary / Honeymoon Celebration" className="bg-[#0b241e]">💍 Anniversary / Honeymoon</option>
                          <option value="Birthday Milestone" className="bg-[#0b241e]">🎂 Birthday Milestone</option>
                          <option value="Family Reunion Retreat" className="bg-[#0b241e]">👨‍👩‍👧‍👦 Family Reunion Retreat</option>
                          <option value="Executive / Solo Discovery" className="bg-[#0b241e]">✨ Executive / Solo Discovery</option>
                          <option value="General Leisure & Exploration" className="bg-[#0b241e]">🌴 General Leisure &amp; Vacation</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3.5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Family Member Name"
                          value={preferences.emergencyName}
                          onChange={(e) =>
                            setPreferences({ ...preferences, emergencyName: e.target.value })
                          }
                          className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={preferences.emergencyPhone}
                          onChange={(e) =>
                            setPreferences({ ...preferences, emergencyPhone: e.target.value })
                          }
                          className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                        Special Notes / Accessibility / Concierge Requests
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Window seating on transfers, dietary preferences, or quiet suite requests..."
                        value={preferences.specialNotes}
                        onChange={(e) =>
                          setPreferences({ ...preferences, specialNotes: e.target.value })
                        }
                        className="w-full bg-[#061814] border border-white/20 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full mt-4 py-3.5 px-6 rounded-xl bg-[#6FCF45] text-[#071A16] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#5eb539] transition-all shadow-lg shadow-[#6FCF45]/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>CONTINUE TO PAYMENT &amp; REVIEW</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-[#0e2721] border border-white/12 rounded-xl p-5 sm:p-6 space-y-5 text-left shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
                        Select Payment Method
                      </h2>
                      <p className="text-xs text-slate-300">
                        Choose your preferred settlement channel. All transactions are 256-bit encrypted.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-[#6FCF45] hover:underline flex items-center gap-1 font-bold bg-[#6FCF45]/10 px-2.5 py-1 rounded border border-[#6FCF45]/30 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Edit Details
                    </button>
                  </div>

                  {/* Payment Mode Selector Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentType('card')}
                      className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                        paymentType === 'card'
                          ? 'bg-[#12382E] border-[#6FCF45] text-white shadow-md shadow-[#6FCF45]/20 ring-1 ring-[#6FCF45]'
                          : 'bg-[#061814] border-white/15 text-slate-300 hover:border-white/35 hover:bg-[#0b241e]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#6FCF45] mb-1.5" />
                      <div className="text-xs sm:text-sm font-bold text-white">Credit / Debit</div>
                      <div className="text-[11px] text-slate-300">Visa / MC / Amex</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType('upi')}
                      className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                        paymentType === 'upi'
                          ? 'bg-[#12382E] border-[#6FCF45] text-white shadow-md shadow-[#6FCF45]/20 ring-1 ring-[#6FCF45]'
                          : 'bg-[#061814] border-white/15 text-slate-300 hover:border-white/35 hover:bg-[#0b241e]'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-[#6FCF45] mb-1.5" />
                      <div className="text-xs sm:text-sm font-bold text-white">Instant UPI</div>
                      <div className="text-[11px] text-slate-300">GPay / PhonePe / Paytm</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType('concierge')}
                      className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                        paymentType === 'concierge'
                          ? 'bg-[#12382E] border-[#6FCF45] text-white shadow-md shadow-[#6FCF45]/20 ring-1 ring-[#6FCF45]'
                          : 'bg-[#061814] border-white/15 text-slate-300 hover:border-white/35 hover:bg-[#0b241e]'
                      }`}
                    >
                      <Phone className="w-4 h-4 text-[#6FCF45] mb-1.5" />
                      <div className="text-xs sm:text-sm font-bold text-white">Concierge Desk</div>
                      <div className="text-[11px] text-slate-300">Zero-Deposit Hold</div>
                    </button>
                  </div>

                  <form onSubmit={handleCompleteOrder} className="space-y-3.5">
                    {paymentType === 'card' && (
                      <div className="space-y-3.5 bg-[#061814] p-4 rounded-lg border border-white/15 shadow-inner">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            Cardholder Name <span className="text-[#6FCF45]">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Full Name as on card"
                            value={paymentInfo.cardName}
                            onChange={(e) =>
                              setPaymentInfo({ ...paymentInfo, cardName: e.target.value })
                            }
                            required
                            className="w-full bg-[#0b241e] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            Card Number <span className="text-[#6FCF45]">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="4242 •••• •••• ••••"
                            value={paymentInfo.cardNumber}
                            onChange={(e) =>
                              setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                            }
                            required
                            className="w-full bg-[#0b241e] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                              Expiry Date (MM/YY) <span className="text-[#6FCF45]">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="MM / YY"
                              value={paymentInfo.exp}
                              onChange={(e) =>
                                setPaymentInfo({ ...paymentInfo, exp: e.target.value })
                              }
                              required
                              className="w-full bg-[#0b241e] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                              CVV Security Code <span className="text-[#6FCF45]">*</span>
                            </label>
                            <input
                              type="password"
                              placeholder="•••"
                              maxLength={4}
                              value={paymentInfo.cvv}
                              onChange={(e) =>
                                setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                              }
                              required
                              className="w-full bg-[#0b241e] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentType === 'upi' && (
                      <div className="space-y-3 bg-[#061814] p-4 rounded-lg border border-white/15 shadow-inner">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                            Enter UPI ID / VPA <span className="text-[#6FCF45]">*</span>
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.upiId}
                            placeholder="e.g. rahul@oksbi / 9876543210@paytm"
                            onChange={(e) =>
                              setPaymentInfo({ ...paymentInfo, upiId: e.target.value })
                            }
                            required
                            className="w-full bg-[#0b241e] border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6FCF45] focus:ring-1 focus:ring-[#6FCF45]/30 font-mono"
                          />
                        </div>
                        <p className="text-xs text-[#6FCF45] flex items-center gap-1.5">
                          💡 A dynamic payment collect request will be dispatched to your UPI App upon submission.
                        </p>
                      </div>
                    )}

                    {paymentType === 'concierge' && (
                      <div className="p-4 rounded-lg bg-[#12382E] border border-[#6FCF45]/40 space-y-2 text-xs">
                        <div className="font-bold text-[#6FCF45] uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> VIP Concierge 1-on-1 Clearance
                        </div>
                        <p className="text-slate-200 leading-relaxed text-xs">
                          Your luxury expedition seats will be reserved immediately on hold with zero initial deposit. Our Senior Travel Curator will call you on <strong className="text-white">{leadTraveler.phone || 'your phone'}</strong> within 15 minutes to review itinerary specifics and complete authorized invoice clearance.
                        </p>
                      </div>
                    )}

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full mt-4 py-3.5 px-6 rounded-xl bg-[#6FCF45] text-[#071A16] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#5eb539] transition-all shadow-lg shadow-[#6FCF45]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing
                        ? 'Confirming with Concierge...'
                        : `CONFIRM & RESERVE ₹${totalPrice.toLocaleString('en-IN')}`}
                    </button>

                    <p className="text-[11px] text-center text-slate-300 mt-2 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3 text-[#6FCF45]" />
                      <span>100% Guaranteed Safe Checkout • Instant Digital Voucher Generation</span>
                    </p>
                  </form>
                </div>
              )}
            </div>

            {/* Booking Summary Sidebar (Span 5) */}
            <div className="lg:col-span-5 text-left">
              <div className="bg-[#0e2721] border border-white/12 rounded-xl p-5 shadow-xl sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#6FCF45] font-heading">
                    EXPEDITION SUMMARY
                  </h3>
                  {logistics.isTatkaal && (
                    <span className="text-[10px] font-extrabold bg-[#EAB308]/20 text-[#EAB308] px-2 py-0.5 rounded border border-[#EAB308]/40 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" /> TATKAAL
                    </span>
                  )}
                </div>

                <div className="flex gap-3.5 pb-4 border-b border-white/10">
                  <img
                    src={currentTour.image}
                    alt={currentTour.title || currentTour.tourTitle}
                    className="w-20 h-20 rounded-lg object-cover shadow-sm border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm sm:text-base font-heading leading-snug truncate">
                      {currentTour.title || currentTour.tourTitle}
                    </h4>
                    <p className="text-xs text-[#6FCF45] mt-0.5 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{currentTour.destination}</span>
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{currentTour.duration}</span>
                    </p>
                  </div>
                </div>

                <div className="py-3.5 space-y-2.5 text-xs sm:text-sm text-slate-300 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <span>Departure Origin:</span>
                    <span className="text-white font-semibold truncate max-w-[170px]" title={effectiveDepartureCity}>
                      {effectiveDepartureCity.split(' - ')[0]}
                    </span>
                  </div>
                  {logistics.pickupLocation && (
                    <div className="flex justify-between items-center">
                      <span>Pickup Point:</span>
                      <span className="text-slate-200 font-medium truncate max-w-[170px]" title={logistics.pickupLocation}>
                        {logistics.pickupLocation}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Travel Mode:</span>
                    <span className="text-[#6FCF45] font-bold">
                      {logistics.travelMode.split(' (')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Departure Date:</span>
                    <span className="text-[#6FCF45] font-bold">
                      {formatDisplayDate(logistics.departureDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Explorers:</span>
                    <span className="text-white font-semibold">
                      {guestCount} {guestCount === 1 ? 'Explorer' : 'Explorers'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Base Tariff ({guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}):</span>
                    <span className="text-white font-semibold">₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>

                  {chaletUpgradeFee > 0 && (
                    <div className="flex justify-between items-center text-[#6FCF45] font-medium">
                      <span>Chalet / Villa Upgrade:</span>
                      <span>+₹{chaletUpgradeFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {transferFee > 0 && (
                    <div className="flex justify-between items-center text-[#6FCF45] font-medium">
                      <span>Airport Chauffeur Transfer:</span>
                      <span>+₹{transferFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  {addonsTotal > 0 && (
                    <div className="flex justify-between items-center text-[#6FCF45] font-medium">
                      <span>Custom Upgrades ({addons.length}):</span>
                      <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {logistics.isTatkaal && (
                    <div className="flex justify-between items-center text-[#EAB308] font-semibold">
                      <span>Tatkaal Priority Fast-Track:</span>
                      <span>+₹{tatkaalFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Concierge Taxes &amp; Permits ({taxRate}%):</span>
                    <span className="text-white font-semibold">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="pt-3.5 flex justify-between items-center">
                  <div>
                    <div className="text-xs uppercase font-bold tracking-wider text-slate-300">Grand Total Tariff</div>
                    <div className="text-[10px] text-slate-400">All taxes &amp; permits inclusive</div>
                  </div>
                  <div className="text-[#6FCF45] text-xl sm:text-2xl font-extrabold font-mono">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Included VIP Inclusions pill */}
                <div className="mt-4 p-3 rounded-lg bg-[#061814] border border-white/12 text-xs text-slate-300 space-y-1.5 shadow-inner">
                  <div className="text-white font-bold text-xs mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6FCF45]" />
                    <span>Included in This Expedition:</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Check className="w-3 h-3 text-[#6FCF45] shrink-0" />
                    <span>5-Star Heritage / Luxury Chalet Stay</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Check className="w-3 h-3 text-[#6FCF45] shrink-0" />
                    <span>24/7 Dedicated Private Concierge Officer</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Check className="w-3 h-3 text-[#6FCF45] shrink-0" />
                    <span>Full Itinerary Ground Transfers &amp; Chauffeur</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Check className="w-3 h-3 text-[#6FCF45] shrink-0" />
                    <span>Instant WhatsApp Confirmation Notice</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default BookingPage
