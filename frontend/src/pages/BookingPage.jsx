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
  Sparkles,
  Plane,
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

  const { bookingSettings, settings } = useSettings()

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

  const handleCompleteOrder = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    const result = await completeBooking({
      tourId: currentTour.id || currentTour.slug,
      tourTitle: currentTour.title || currentTour.tourTitle,
      destination: currentTour.destination,
      duration: currentTour.duration,
      image: currentTour.image,
      travelDate: logistics.departureDate,
      travelers: guestCount,
      addons,
      leadTraveler,
      logistics,
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
    <div className="pt-40 sm:pt-44 md:pt-48 pb-24 bg-[#071A16] text-white min-h-screen select-none">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between max-w-xl mx-auto mb-8 pb-6 border-b border-white/10 text-xs font-bold uppercase tracking-wider">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? 'text-[#6FCF45]' : 'text-[#A8B5AF]'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                step >= 1 ? 'bg-[#6FCF45] text-[#071A16]' : 'bg-white/10 text-white'
              }`}
            >
              1
            </span>
            <span>Explorer Details</span>
          </div>

          <div className="w-8 h-[1px] bg-white/15" />

          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? 'text-[#6FCF45]' : 'text-[#A8B5AF]'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                step >= 2 ? 'bg-[#6FCF45] text-[#071A16]' : 'bg-white/10 text-white'
              }`}
            >
              2
            </span>
            <span>Payment &amp; Review</span>
          </div>

          <div className="w-8 h-[1px] bg-white/15" />

          <div
            className={`flex items-center gap-2 ${
              step === 3 ? 'text-[#6FCF45]' : 'text-[#A8B5AF]'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                step === 3 ? 'bg-[#6FCF45] text-[#071A16]' : 'bg-white/10 text-white'
              }`}
            >
              3
            </span>
            <span>Confirmed</span>
          </div>
        </div>

        {/* Step 3: Success Confirmation */}
        {step === 3 && confirmedBooking ? (
          <div className="bg-[#0B241E] border border-white/15 rounded-[12px] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl animate-scaleUp">
            <div className="w-20 h-20 rounded-full bg-[#12382E] border-2 border-[#6FCF45] flex items-center justify-center text-[#6FCF45] mx-auto mb-6 shadow-lg shadow-[#6FCF45]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#6FCF45] font-heading">
              EXPEDITION RESERVED SUCCESSFULLY
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
              You’re Heading Somewhere Extraordinary!
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#A8B5AF] leading-relaxed max-w-md mx-auto">
              Your reservation reference is{' '}
              <strong className="text-white font-mono">{confirmedBooking.id || 'TT-EXP-2026'}</strong>.
              A VIP dossier &amp; vouchers have been dispatched to{' '}
              <strong className="text-white">{leadTraveler.email}</strong>.
            </p>

            {logistics.isTatkaal && (
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAB308]/15 border border-[#EAB308]/40 text-[#EAB308] text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4 fill-current" />
                <span>Tatkaal Priority Fast-Track Activated (Dispatch within 60 mins)</span>
              </div>
            )}

            {/* Summary Voucher Card */}
            <div className="mt-6 bg-[#071A16] border border-white/10 rounded-[8px] p-5 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#A8B5AF]">Expedition Package:</span>
                <span className="font-bold text-white">{confirmedBooking.tourTitle}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#A8B5AF]">Primary Explorer:</span>
                <span className="font-semibold text-white">
                  {leadTraveler.firstName} {leadTraveler.lastName} ({leadTraveler.phone})
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#A8B5AF]">Departure Schedule:</span>
                <span className="font-semibold text-[#6FCF45]">
                  {formatDisplayDate(logistics.departureDate)}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#A8B5AF]">Party Size:</span>
                <span className="font-semibold text-white">{guestCount} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8B5AF]">Total Amount:</span>
                <span className="font-bold text-[#6FCF45] text-base">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Form Steps (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* TATKAAL / EXPRESS BOOKING NOTICE BANNER */}
              <div className="bg-gradient-to-r from-[#12382E] via-[#0E2C24] to-[#071A16] border border-[#6FCF45]/35 rounded-[10px] p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/50 flex items-center justify-center text-[#6FCF45] shrink-0 mt-0.5">
                    <Zap className="w-5 h-5 fill-[#6FCF45]" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#6FCF45] font-heading">
                        ⚡ Tatkaal / Urgent Departure Booking Available
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#6FCF45]/20 text-[#6FCF45] text-[10px] font-bold">
                        24-72h Fast-Track
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#A8B5AF] leading-relaxed">
                      Need immediate travel in the next 1 to 3 days? Enable <strong>Tatkaal Dispatch</strong> below. Our VIP Operations team guarantees emergency flight slots, luxury chalet access &amp; instant dossier clearance within <strong>60 minutes</strong>.
                    </p>
                    
                    <label className="flex items-center gap-2.5 pt-2 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={logistics.isTatkaal}
                        onChange={(e) =>
                          setLogistics({ ...logistics, isTatkaal: e.target.value === 'true' || e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#6FCF45] bg-[#071A16] border-white/20 focus:ring-[#6FCF45] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-white group-hover:text-[#6FCF45] transition-colors">
                        Request Tatkaal Express Dispatch (+₹2,500 priority handling)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {step === 1 && (
                <div className="bg-[#0B241E] border border-white/10 rounded-[10px] p-6 sm:p-8 space-y-6 text-left shadow-xl">
                  
                  {/* Part A: Lead Explorer */}
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-white font-heading">
                          1. Primary Voyager (Lead Explorer)
                        </h2>
                        <p className="text-[11px] text-[#A8B5AF]">
                          Official contact person receiving all luxury travel vouchers &amp; boarding permits.
                        </p>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#6FCF45] bg-[#6FCF45]/10 px-2.5 py-1 rounded">
                        Verified Contact
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. John"
                            value={leadTraveler.firstName}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, firstName: e.target.value })
                            }
                            required
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Doe"
                            value={leadTraveler.lastName}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, lastName: e.target.value })
                            }
                            required
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Official Email *
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. traveler@domain.com"
                            value={leadTraveler.email}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, email: e.target.value })
                            }
                            required
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Phone / WhatsApp Hotline *
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. +91 98765 43210"
                            value={leadTraveler.phone}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, phone: e.target.value })
                            }
                            required
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Nationality
                          </label>
                          <input
                            type="text"
                            value={leadTraveler.nationality}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, nationality: e.target.value })
                            }
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Govt ID / Passport
                          </label>
                          <input
                            type="text"
                            value={leadTraveler.idNumber}
                            placeholder="Aadhaar / Passport No."
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, idNumber: e.target.value })
                            }
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Age Group
                          </label>
                          <select
                            value={leadTraveler.ageGroup}
                            onChange={(e) =>
                              setLeadTraveler({ ...leadTraveler, ageGroup: e.target.value })
                            }
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] cursor-pointer"
                          >
                            <option value="Adult (18-59)" className="bg-[#071A16]">Adult (18-59)</option>
                            <option value="Senior Citizen (60+)" className="bg-[#071A16]">Senior Citizen (60+)</option>
                            <option value="Young Adult (12-17)" className="bg-[#071A16]">Young Adult (12-17)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Part B: Departure & Logistics */}
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#6FCF45] font-heading mb-3">
                      2. Real-Time Departure Schedule &amp; Suite Logistics
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                          Live Departure Date *
                        </label>
                        <input
                          type="date"
                          min={todayStr}
                          value={logistics.departureDate}
                          onChange={(e) =>
                            setLogistics({ ...logistics, departureDate: e.target.value })
                          }
                          className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                        />
                        <span className="text-[10px] text-[#6FCF45] mt-1 block">
                          Selected: {formatDisplayDate(logistics.departureDate)}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                          Total Explorers (Guests)
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] cursor-pointer"
                        >
                          <option value="1" className="bg-[#071A16]">1 Explorer (Solo Luxury)</option>
                          <option value="2" className="bg-[#071A16]">2 Explorers (Couples / Duo)</option>
                          <option value="3" className="bg-[#071A16]">3 Explorers</option>
                          <option value="4" className="bg-[#071A16]">4 Explorers (Group)</option>
                          <option value="6" className="bg-[#071A16]">6 Explorers (VIP Entourage)</option>
                        </select>
                        <span className="text-[10px] text-[#A8B5AF] mt-1 block">
                          Tariff calculates per person
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                          Chalet &amp; Bed Configuration
                        </label>
                        <select
                          value={logistics.roomPreference}
                          onChange={(e) =>
                            setLogistics({ ...logistics, roomPreference: e.target.value })
                          }
                          className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] cursor-pointer"
                        >
                          {CHALET_CONFIG_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.name} className="bg-[#071A16]">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] text-[#6FCF45] mt-1 block">
                          {chaletUpgradeFee > 0 ? `+₹${chaletUpgradeFee.toLocaleString('en-IN')} Suite Upgrade applied` : 'Standard luxury suite included'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3.5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                          Airport Chauffeur Transfer
                        </label>
                        <select
                          value={logistics.airportTransfer}
                          onChange={(e) =>
                            setLogistics({ ...logistics, airportTransfer: e.target.value })
                          }
                          className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] cursor-pointer"
                        >
                          {AIRPORT_TRANSFER_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.name} className="bg-[#071A16]">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] text-[#6FCF45] mt-1 block">
                          {transferFee > 0 ? `+₹${transferFee.toLocaleString('en-IN')} Dedicated chauffeur transfer` : 'Self-arranged transit (₹0)'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                          Arrival Flight No. / Time (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. AI-804 / 14:30 Arrival"
                          value={logistics.flightNumber}
                          onChange={(e) =>
                            setLogistics({ ...logistics, flightNumber: e.target.value })
                          }
                          className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Part C: Dining, Occasions & Emergency Contact */}
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#6FCF45] font-heading mb-3">
                      3. Culinary Preferences &amp; Emergency Support
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                          Dietary Preference
                        </label>
                        <select
                          value={preferences.dietary}
                          onChange={(e) =>
                            setPreferences({ ...preferences, dietary: e.target.value })
                          }
                          className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] cursor-pointer"
                        >
                          <option value="Vegetarian (Custom Gourmet)" className="bg-[#071A16]">Vegetarian (Custom Gourmet)</option>
                          <option value="Jain Pure Vegetarian" className="bg-[#071A16]">Jain Pure Vegetarian</option>
                          <option value="Halal Gourmet" className="bg-[#071A16]">Halal Gourmet</option>
                          <option value="Vegan / Plant-Based" className="bg-[#071A16]">Vegan / Plant-Based</option>
                          <option value="Chef Signature Non-Veg" className="bg-[#071A16]">Chef Signature Non-Veg</option>
                          <option value="Gluten-Free / Allergen Specific" className="bg-[#071A16]">Gluten-Free / Allergen Specific</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                          Celebrating an Occasion?
                        </label>
                        <select
                          value={preferences.occasion}
                          onChange={(e) =>
                            setPreferences({ ...preferences, occasion: e.target.value })
                          }
                          className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45] cursor-pointer"
                        >
                          <option value="Anniversary / Honeymoon Celebration" className="bg-[#071A16]">💍 Anniversary / Honeymoon</option>
                          <option value="Birthday Milestone" className="bg-[#071A16]">🎂 Birthday Milestone</option>
                          <option value="Family Reunion Retreat" className="bg-[#071A16]">👨‍👩‍👧‍👦 Family Reunion Retreat</option>
                          <option value="Executive / Solo Discovery" className="bg-[#071A16]">✨ Executive / Solo Discovery</option>
                          <option value="General Leisure & Exploration" className="bg-[#071A16]">🌴 General Leisure &amp; Vacation</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3.5">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Contact Person Name"
                          value={preferences.emergencyName}
                          onChange={(e) =>
                            setPreferences({ ...preferences, emergencyName: e.target.value })
                          }
                          className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={preferences.emergencyPhone}
                          onChange={(e) =>
                            setPreferences({ ...preferences, emergencyPhone: e.target.value })
                          }
                          className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                        />
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                        Special Notes / Accessibility / Concierge Requests
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Window seating on transfers, dietary preferences, or quiet suite requests..."
                        value={preferences.specialNotes}
                        onChange={(e) =>
                          setPreferences({ ...preferences, specialNotes: e.target.value })
                        }
                        className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    variant="primary"
                    size="lg"
                    className="w-full mt-4 text-xs font-bold uppercase tracking-widest h-[46px] shadow-lg shadow-[#6FCF45]/20"
                  >
                    CONTINUE TO PAYMENT &amp; REVIEW
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-[#0B241E] border border-white/10 rounded-[10px] p-6 sm:p-8 space-y-6 text-left shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h2 className="text-lg font-bold text-white font-heading">
                        Select Payment Method
                      </h2>
                      <p className="text-[11px] text-[#A8B5AF]">
                        Choose your preferred settlement channel. All transactions are 256-bit encrypted.
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-[#6FCF45] hover:underline flex items-center gap-1 font-bold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Edit Details
                    </button>
                  </div>

                  {/* Payment Mode Selector Tabs */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentType('card')}
                      className={`p-3 rounded-[8px] border text-left transition-all ${
                        paymentType === 'card'
                          ? 'bg-[#12382E] border-[#6FCF45] text-white shadow-md shadow-[#6FCF45]/15'
                          : 'bg-[#071A16] border-white/15 text-[#A8B5AF] hover:border-white/30'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#6FCF45] mb-1.5" />
                      <div className="text-xs font-bold">Credit/Debit</div>
                      <div className="text-[10px] text-[#A8B5AF]">Visa / MC / Amex</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType('upi')}
                      className={`p-3 rounded-[8px] border text-left transition-all ${
                        paymentType === 'upi'
                          ? 'bg-[#12382E] border-[#6FCF45] text-white shadow-md shadow-[#6FCF45]/15'
                          : 'bg-[#071A16] border-white/15 text-[#A8B5AF] hover:border-white/30'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-[#6FCF45] mb-1.5" />
                      <div className="text-xs font-bold">Instant UPI</div>
                      <div className="text-[10px] text-[#A8B5AF]">GPay / PhonePe / Paytm</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType('concierge')}
                      className={`p-3 rounded-[8px] border text-left transition-all ${
                        paymentType === 'concierge'
                          ? 'bg-[#12382E] border-[#6FCF45] text-white shadow-md shadow-[#6FCF45]/15'
                          : 'bg-[#071A16] border-white/15 text-[#A8B5AF] hover:border-white/30'
                      }`}
                    >
                      <Phone className="w-4 h-4 text-[#6FCF45] mb-1.5" />
                      <div className="text-xs font-bold">Concierge Desk</div>
                      <div className="text-[10px] text-[#A8B5AF]">Zero-Deposit Hold</div>
                    </button>
                  </div>

                  <form onSubmit={handleCompleteOrder} className="space-y-4">
                    {paymentType === 'card' && (
                      <div className="space-y-3.5 bg-[#071A16]/60 p-4 rounded-[8px] border border-white/10">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Full Name as on card"
                            value={paymentInfo.cardName}
                            onChange={(e) =>
                              setPaymentInfo({ ...paymentInfo, cardName: e.target.value })
                            }
                            required
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            placeholder="4242 •••• •••• ••••"
                            value={paymentInfo.cardNumber}
                            onChange={(e) =>
                              setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                            }
                            required
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                              Expiry Date (MM/YY) *
                            </label>
                            <input
                              type="text"
                              placeholder="MM / YY"
                              value={paymentInfo.exp}
                              onChange={(e) =>
                                setPaymentInfo({ ...paymentInfo, exp: e.target.value })
                              }
                              required
                              className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                              CVV Security Code *
                            </label>
                            <input
                              type="password"
                              placeholder="•••"
                              value={paymentInfo.cvv}
                              onChange={(e) =>
                                setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                              }
                              required
                              className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentType === 'upi' && (
                      <div className="space-y-3 bg-[#071A16]/60 p-4 rounded-[8px] border border-white/10">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Enter UPI ID / VPA *
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.upiId}
                            placeholder="e.g. yourname@oksbi / mobile@paytm"
                            onChange={(e) =>
                              setPaymentInfo({ ...paymentInfo, upiId: e.target.value })
                            }
                            required
                            className="w-full bg-[#071A16] border border-white/15 rounded-[6px] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>
                        <p className="text-[11px] text-[#6FCF45]">
                          💡 A dynamic payment collect request will be sent to your UPI App upon confirmation.
                        </p>
                      </div>
                    )}

                    {paymentType === 'concierge' && (
                      <div className="p-4 rounded-[8px] bg-[#12382E]/50 border border-[#6FCF45]/30 space-y-2 text-xs">
                        <div className="font-bold text-[#6FCF45] uppercase tracking-wider text-[11px]">
                          VIP Concierge 1-on-1 Clearance
                        </div>
                        <p className="text-[#A8B5AF] leading-relaxed text-[11.5px]">
                          Your luxury expedition seats will be reserved immediately on hold with zero initial deposit. Our Senior Travel Curator will call you on <strong>{leadTraveler.phone}</strong> within 15 minutes to review itinerary specifics and complete authorized invoice clearance.
                        </p>
                      </div>
                    )}

                    {/* Submit CTA */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isProcessing}
                      className="w-full mt-4 h-[48px] text-xs font-bold uppercase tracking-widest shadow-xl shadow-[#6FCF45]/20"
                    >
                      {isProcessing
                        ? 'Confirming with Concierge...'
                        : `CONFIRM & RESERVE ₹${totalPrice.toLocaleString('en-IN')}`}
                    </Button>

                    <p className="text-[10.5px] text-center text-[#A8B5AF] mt-2">
                      🔒 100% Guaranteed Safe Checkout • Instant Digital Voucher Generation
                    </p>
                  </form>
                </div>
              )}
            </div>

            {/* Booking Summary Sidebar (Span 5) */}
            <div className="lg:col-span-5 text-left">
              <div className="bg-[#0B241E] border border-white/15 rounded-[12px] p-6 shadow-2xl sticky top-36">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#6FCF45] font-heading">
                    EXPEDITION SUMMARY
                  </h3>
                  {logistics.isTatkaal && (
                    <span className="text-[10px] font-extrabold bg-[#EAB308]/20 text-[#EAB308] px-2 py-0.5 rounded border border-[#EAB308]/40">
                      ⚡ TATKAAL
                    </span>
                  )}
                </div>

                <div className="flex gap-4 pb-4 border-b border-white/10">
                  <img
                    src={currentTour.image}
                    alt={currentTour.title || currentTour.tourTitle}
                    className="w-20 h-20 rounded-[6px] object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm font-heading">
                      {currentTour.title || currentTour.tourTitle}
                    </h4>
                    <p className="text-xs text-[#6FCF45] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{currentTour.destination}</span>
                    </p>
                    <p className="text-xs text-[#A8B5AF] mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{currentTour.duration}</span>
                    </p>
                  </div>
                </div>

                <div className="py-4 space-y-2.5 text-xs text-[#A8B5AF] border-b border-white/10">
                  <div className="flex justify-between">
                    <span>Departure Date:</span>
                    <span className="text-[#6FCF45] font-bold">
                      {formatDisplayDate(logistics.departureDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Explorers:</span>
                    <span className="text-white font-medium">
                      {guestCount} {guestCount === 1 ? 'Explorer' : 'Explorers'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Tariff ({guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}):</span>
                    <span className="text-white font-medium">₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>

                  {chaletUpgradeFee > 0 && (
                    <div className="flex justify-between text-[#6FCF45]">
                      <span>Chalet / Villa Upgrade:</span>
                      <span>+₹{chaletUpgradeFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {transferFee > 0 && (
                    <div className="flex justify-between text-[#6FCF45]">
                      <span>Airport Chauffeur Transfer:</span>
                      <span>+₹{transferFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  {addonsTotal > 0 && (
                    <div className="flex justify-between text-[#6FCF45]">
                      <span>Custom Upgrades ({addons.length}):</span>
                      <span>+₹{addonsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {logistics.isTatkaal && (
                    <div className="flex justify-between text-[#EAB308]">
                      <span>Tatkaal Priority Fast-Track:</span>
                      <span>+₹{tatkaalFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Concierge Taxes &amp; Permits ({taxRate}%):</span>
                    <span className="text-white font-medium">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="pt-4 flex justify-between items-center text-sm font-extrabold text-white">
                  <span>Grand Total Tariff</span>
                  <span className="text-[#6FCF45] text-2xl font-mono">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Included VIP Inclusions pill */}
                <div className="mt-5 p-3 rounded-[6px] bg-[#071A16] border border-white/10 text-[11px] text-[#A8B5AF] space-y-1">
                  <div className="text-white font-bold text-[11px] mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6FCF45]" />
                    <span>Included in This Expedition:</span>
                  </div>
                  <div>✓ 5-Star Heritage / Luxury Chalet Stay</div>
                  <div>✓ 24/7 Dedicated Private Concierge Officer</div>
                  <div>✓ Full Itinerary Ground Transfers Included</div>
                  <div>✓ Instant WhatsApp Confirmation Notice</div>
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
