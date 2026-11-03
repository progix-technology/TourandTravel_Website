import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Compass,
  Calendar,
  Users,
  Search,
  Check,
  Plane,
  Train,
  Bus,
  Loader2,
  ArrowRight,
  Sparkle,
  Phone,
  Mail,
  User,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  ChevronLeft,
  RotateCcw,
  Navigation,
  MapPin,
  CreditCard,
  QrCode,
  Landmark,
  BadgePercent,
  CheckCircle,
  Lock,
  AlertTriangle,
} from 'lucide-react'
import {
  searchGlobalLocations,
  reverseGeocodeCoords,
  calculateDistanceKm,
} from '../services/locationService'
import { CITIES_WITH_SPOTS } from '../data/citySpotsData'
import { AnimatedBackgroundCompass } from '../components/ui/AnimatedBackgroundCompass'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import { initiateRazorpayPayment, checkRazorpayConfigured } from '../services/razorpayService'
import RazorpayCheckoutModal from '../components/RazorpayCheckoutModal'
import api from '../services/api'

// Bus Category Options (for 200 - 300 km routes)
const BUS_OPTIONS = [
  { id: 'volvo_ac_sleeper', name: 'Volvo Multi-Axle AC Sleeper', farePerPerson: 1400, desc: 'Luxury Reclining Sleepers with USB & Blanket' },
  { id: 'bharatbenz_semi', name: 'BharatBenz AC Semi-Sleeper', farePerPerson: 1100, desc: 'Ergonomic seating with push-back calf support' },
  { id: 'scania_seater', name: 'Scania Executive AC Seater', farePerPerson: 950, desc: 'Express highway transit with air-suspension' },
  { id: 'state_superfast', name: 'State Deluxe AC Express', farePerPerson: 750, desc: 'Direct state highways intercity link' },
]

// Train Category Options (for > 300 km routes)
const TRAIN_OPTIONS = [
  { id: 'train_1ac', name: '1st AC (First Class Sleeper / Coupe)', farePerPerson: 3600, desc: 'Private lockable cabin, VIP gourmet bedding' },
  { id: 'train_2ac', name: '2nd AC (Two-Tier Sleeper)', farePerPerson: 2200, desc: 'Spacious berths with privacy curtains & charging' },
  { id: 'train_3ac', name: '3rd AC (Three-Tier Comfort)', farePerPerson: 1550, desc: 'Standard central AC sleeper with clean linen' },
  { id: 'train_sleeper', name: 'Sleeper Class (SL Non-AC)', farePerPerson: 750, desc: 'Classic scenic open-window budget travel' },
  { id: 'train_vande_bharat', name: 'Vande Bharat / Tejas Chair Car', farePerPerson: 2600, desc: 'High-speed 160 km/h executive chair car with meals' },
]


// Airplane Flight Options (for > 300 km routes)
const FLIGHT_OPTIONS = [
  { id: 'flight_economy', name: 'Domestic / International Economy', farePerPerson: 5400, desc: 'Direct flight with 15kg check-in & 7kg cabin baggage' },
  { id: 'flight_business', name: 'Business Class / Fast-Track VIP', farePerPerson: 14500, desc: 'Priority boarding, airport lounge access & lie-flat seat' },
]

export const CustomTrip = ({ isPage = false }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { settings } = useSettings()

  const isCustomTripRoute = isPage || window.location.pathname === '/custom-trip'

  // Step Management: 1 = Route & Transit, 2 = Travelers Info, 3 = Payment & Confirmation
  const [currentStep, setCurrentStep] = useState(1)

  // -------------------------------------------------------------
  // STEP 1 STATE: Origin, Destination, Transit Mode
  // -------------------------------------------------------------
  const [departure, setDeparture] = useState({
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    display: 'New Delhi, Delhi, India',
    lat: 28.6139,
    lng: 77.209,
  })

  const [destination, setDestination] = useState({
    city: 'Kashmir',
    state: 'Jammu & Kashmir',
    country: 'India',
    display: 'Kashmir, Jammu & Kashmir, India',
    lat: 34.0837,
    lng: 74.7973,
    selectedSpot: 'Gulmarg Gondola & Apharwat Peak',
  })

  const [locatingUser, setLocatingUser] = useState(false)
  const [locatingError, setLocatingError] = useState('')

  const [approxDuration, setApproxDuration] = useState('6–8 Days')
  const [adults, setAdults] = useState(2) // 1 = Solo, 2 = Couple, 4 = Family, 6 = Group

  // Autocomplete state for Departure
  const [depSearchQuery, setDepSearchQuery] = useState('New Delhi, Delhi, India')
  const [depSuggestions, setDepSuggestions] = useState([])
  const [depLoading, setDepLoading] = useState(false)
  const [depDropdownOpen, setDepDropdownOpen] = useState(false)
  const depRef = useRef(null)

  // Autocomplete & Spot Dropdown state for Destination
  const [destSearchQuery, setDestSearchQuery] = useState('Kashmir, Jammu & Kashmir, India')
  const [destDropdownOpen, setDestDropdownOpen] = useState(false)
  const destRef = useRef(null)

  // Transit Selection State
  const [transitCategory, setTransitCategory] = useState('train') // 'bus', 'train', 'flight'
  const [selectedTransitSubOption, setSelectedTransitSubOption] = useState('train_3ac')

  // Calculate Distance between Departure and Destination in Km
  const distanceKm = useMemo(() => {
    if (!departure?.lat || !departure?.lng || !destination?.lat || !destination?.lng) {
      return 650 // default fallback
    }
    return calculateDistanceKm(departure.lat, departure.lng, destination.lat, destination.lng)
  }, [departure, destination])

  // Distance rules:
  // 200 - 300 km: Bus allowed
  // > 300 km: Train & Flight allowed
  const isBusEligible = distanceKm >= 150 && distanceKm <= 350
  const isLongDistance = distanceKm > 300

  // Adjust default transit option when distance changes
  useEffect(() => {
    if (isBusEligible && !isLongDistance) {
      setTransitCategory('bus')
      setSelectedTransitSubOption('volvo_ac_sleeper')
    } else if (isLongDistance && transitCategory === 'bus') {
      setTransitCategory('train')
      setSelectedTransitSubOption('train_3ac')
    }
  }, [isBusEligible, isLongDistance])

  // -------------------------------------------------------------
  // STEP 2 STATE: Dynamic Travelers Details List
  // -------------------------------------------------------------
  const [travelersList, setTravelersList] = useState([
    { id: 1, label: 'Lead Traveler', fullName: user?.name || '', age: '', gender: 'Male' },
    { id: 2, label: 'Traveler 2 (Partner/Guest)', fullName: '', age: '', gender: 'Female' },
  ])

  const [contactData, setContactData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    travelDate: '',
    specialRequests: '',
  })

  // Real Razorpay Gateway Configuration Status
  const [razorpayStatus, setRazorpayStatus] = useState({ isConfigured: false, keyId: '' })

  useEffect(() => {
    checkRazorpayConfigured().then((info) => {
      setRazorpayStatus(info)
    })
  }, [])

  // Sync travelers array when party size (adults) changes
  useEffect(() => {
    setTravelersList((prev) => {
      const newList = []
      for (let i = 0; i < adults; i++) {
        let label = `Traveler ${i + 1}`
        if (adults === 1) label = 'Solo Explorer (Lead Guest)'
        else if (adults === 2 && i === 0) label = 'Lead Traveler (Guest 1)'
        else if (adults === 2 && i === 1) label = 'Partner / Spouse (Guest 2)'
        else if (adults >= 4 && i === 0) label = 'Primary Bookee (Guest 1)'

        const existing = prev[i] || {}
        newList.push({
          id: i + 1,
          label,
          fullName: existing.fullName || (i === 0 ? user?.name || '' : ''),
          age: existing.age || '',
          gender: existing.gender || (i === 1 ? 'Female' : 'Male'),
        })
      }
      return newList
    })
  }, [adults, user])

  // Auto-fill user contact info if available
  useEffect(() => {
    if (user) {
      setContactData((prev) => ({
        ...prev,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user])

  // -------------------------------------------------------------
  // STEP 3 STATE: Payment Options & Calculations
  // -------------------------------------------------------------
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi') // 'upi', 'card', 'zero_deposit'
  const [upiId, setUpiId] = useState('')
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(null)
  const [paymentNotice, setPaymentNotice] = useState('')

  // Pricing calculations
  const approxBasePerPerson = useMemo(() => {
    const matched = CITIES_WITH_SPOTS.find(
      (c) => c.city.toLowerCase() === (destination.city || '').toLowerCase()
    )
    return matched?.approxStartingPrice || 18999
  }, [destination])

  // Transit fee per person
  const transitFarePerPerson = useMemo(() => {
    if (transitCategory === 'bus') {
      const b = BUS_OPTIONS.find((item) => item.id === selectedTransitSubOption)
      return b ? b.farePerPerson : 1100
    }
    if (transitCategory === 'train') {
      const t = TRAIN_OPTIONS.find((item) => item.id === selectedTransitSubOption)
      return t ? t.farePerPerson : 1550
    }
    const f = FLIGHT_OPTIONS.find((item) => item.id === selectedTransitSubOption)
    return f ? f.farePerPerson : 5400
  }, [transitCategory, selectedTransitSubOption])

  const totalBasePrice = (approxBasePerPerson + transitFarePerPerson) * adults
  const gstTax = Math.round(totalBasePrice * 0.05)
  const grandTotal = totalBasePrice + gstTax

  // -------------------------------------------------------------
  // GEOLOCATION: Free Browser Permission + Reverse Geocode
  // -------------------------------------------------------------
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocatingError('Geolocation is not supported by your browser.')
      return
    }

    setLocatingUser(true)
    setLocatingError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const locData = await reverseGeocodeCoords(latitude, longitude)
          setDeparture({
            city: locData.city,
            state: locData.state,
            country: locData.country,
            display: locData.display,
            lat: latitude,
            lng: longitude,
          })
          setDepSearchQuery(locData.display)
          setLocatingUser(false)
        } catch (err) {
          setLocatingError('Unable to resolve city name. Please type your city.')
          setLocatingUser(false)
        }
      },
      (error) => {
        let msg = 'Location permission denied. Please search your city manually.'
        if (error.code === error.TIMEOUT) msg = 'Location request timed out.'
        setLocatingError(msg)
        setLocatingUser(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  // Live Departure Autocomplete with Debounce
  useEffect(() => {
    let active = true
    if (!depDropdownOpen) return

    setDepLoading(true)
    const timeout = setTimeout(async () => {
      const results = await searchGlobalLocations(depSearchQuery)
      if (active) {
        setDepSuggestions(results)
        setDepLoading(false)
      }
    }, 250)
    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [depSearchQuery, depDropdownOpen])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (depRef.current && !depRef.current.contains(e.target)) {
        setDepDropdownOpen(false)
      }
      if (destRef.current && !destRef.current.contains(e.target)) {
        setDestDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter spots based on user typing in Destination search
  const filteredCitySpots = useMemo(() => {
    const q = (destSearchQuery || '').toLowerCase().trim()
    if (!q) return CITIES_WITH_SPOTS
    return CITIES_WITH_SPOTS.filter(
      (item) =>
        item.city.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.spots.some((s) => s.toLowerCase().includes(q))
    )
  }, [destSearchQuery])

  // Handle Step 1 -> Step 2
  const handleProceedToStep2 = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      sessionStorage.setItem(
        'tt_pending_custom_trip',
        JSON.stringify({
          departure,
          destination,
          approxDuration,
          adults,
          transitCategory,
          selectedTransitSubOption,
        })
      )
      navigate('/login', {
        state: {
          from: { pathname: '/custom-trip' },
          message: 'Please sign in to proceed with traveler details and booking.',
        },
      })
      return
    }
    setCurrentStep(2)
  }

  // Handle Launch Official Razorpay Modal directly
  const handleLaunchOfficialRazorpay = () => {
    setPaymentNotice('')
    setSubmitting(true)
    initiateRazorpayPayment({
      amount: grandTotal,
      tourTitle: `${destination.city} (${destination.selectedSpot || 'Curated Expedition'}) • ${adults} Guest${adults > 1 ? 's' : ''}`,
      customerName: travelersList[0]?.fullName || 'Valued Guest',
      customerEmail: contactData.email || '',
      customerPhone: contactData.phone || '',
      onSuccess: (paymentResult) => {
        setSubmitting(false)
        handleRazorpayModalSuccess(paymentResult)
      },
      onError: (err) => {
        setSubmitting(false)
        if (err && typeof err === 'string') {
          setPaymentNotice(err)
        }
      },
    })
  }

  // Handle Step 2 -> Step 3 (Payment)
  const handleProceedToPayment = (e) => {
    e.preventDefault()
    // Validate lead traveler
    if (!travelersList[0]?.fullName?.trim() || !contactData.phone || !contactData.email) {
      alert('Please fill in Traveler 1 Full Name, Phone, and Email address.')
      return
    }
    setCurrentStep(3)
  }

  // Handle Zero-Deposit VIP Hold Submission
  const handleConfirmZeroDeposit = () => {
    let transitLabel = 'Flight (Domestic)'
    if (transitCategory === 'bus') {
      const b = BUS_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      transitLabel = `Bus: ${b?.name || 'Luxury AC Sleeper'}`
    } else if (transitCategory === 'train') {
      const t = TRAIN_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      transitLabel = `Train: ${t?.name || '3rd AC Comfort'}`
    } else {
      const f = FLIGHT_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      transitLabel = `Flight: ${f?.name || 'Economy'}`
    }

    setSubmitting(true)
    const payload = {
      name: travelersList[0].fullName,
      email: contactData.email,
      phone: contactData.phone,
      departure: departure.display || departure.city,
      destination: `${destination.city} (${destination.selectedSpot || 'All Major Spots'})`,
      duration: approxDuration,
      travelers: adults,
      partySize: adults === 1 ? 'Solo' : adults === 2 ? 'Couple' : adults === 4 ? 'Family (4)' : 'Group (6+)',
      travelMode: transitLabel,
      transport: transitLabel,
      travelDate: contactData.travelDate || 'Flexible / Next 30 Days',
      specialRequests: contactData.specialRequests || 'Bespoke Curated Experience',
      travelersDetails: travelersList,
      paymentMethod: 'Zero-Deposit VIP Concierge Hold (Pay on Arrival)',
      paymentStatus: 'Zero-Deposit Hold',
      totalAmount: grandTotal,
      paymentId: 'HOLD_' + Math.floor(100000 + Math.random() * 900000),
    }

    api.post('/custom-trips', payload)
      .then((res) => {
        const refId = res.data?.inquiryReference || 'CT-' + Math.floor(100000 + Math.random() * 900000)
        setSubmitSuccess({
          referenceId: refId,
          departure: departure.city,
          destination: destination.city,
          spot: destination.selectedSpot,
          adults,
          duration: approxDuration,
          transit: transitLabel,
          totalAmount: grandTotal,
          paymentStatus: 'Zero-Deposit VIP Hold',
        })
        setCurrentStep(4)
      })
      .catch((err) => {
        const fallbackRef = 'CT-' + Math.floor(100000 + Math.random() * 900000)
        setSubmitSuccess({
          referenceId: fallbackRef,
          departure: departure.city,
          destination: destination.city,
          spot: destination.selectedSpot,
          adults,
          duration: approxDuration,
          transit: transitLabel,
          totalAmount: grandTotal,
          paymentStatus: 'Zero-Deposit VIP Hold',
        })
        setCurrentStep(4)
      })
      .finally(() => setSubmitting(false))
  }

  // Handle Final Payment Submission
  const handleFinalBookingSubmit = async (e) => {
    e.preventDefault()

    // Build transit description label
    let transitLabel = 'Flight (Domestic)'
    if (transitCategory === 'bus') {
      const b = BUS_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      transitLabel = `Bus: ${b?.name || 'Luxury AC Sleeper'}`
    } else if (transitCategory === 'train') {
      const t = TRAIN_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      transitLabel = `Train: ${t?.name || '3rd AC Comfort'}`
    } else {
      const f = FLIGHT_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      transitLabel = `Flight: ${f?.name || 'Economy'}`
    }

    const saveBookingToDatabase = async (paidMethodLabel, paidStatusLabel, rzpPaymentId = null) => {
      setSubmitting(true)
      const payload = {
        name: travelersList[0].fullName,
        email: contactData.email,
        phone: contactData.phone,
        departure: departure.display || departure.city,
        destination: `${destination.city} (${destination.selectedSpot || 'All Major Spots'})`,
        duration: approxDuration,
        travelers: adults,
        partySize: adults === 1 ? 'Solo' : adults === 2 ? 'Couple' : adults === 4 ? 'Family (4)' : 'Group (6+)',
        travelMode: transitLabel,
        transport: transitLabel,
        travelDate: contactData.travelDate || 'Flexible / Next 30 Days',
        specialRequests: contactData.specialRequests || 'Bespoke Curated Experience',
        travelersDetails: travelersList,
        paymentMethod: paidMethodLabel,
        paymentStatus: paidStatusLabel,
        totalAmount: grandTotal,
        paymentId: rzpPaymentId,
      }

      try {
        const response = await api.post('/custom-trips', payload)
        const refId =
          response.data?.inquiryReference ||
          'CT-' + Math.floor(100000 + Math.random() * 900000)

        setSubmitSuccess({
          referenceId: refId,
          departure: departure.city,
          destination: destination.city,
          spot: destination.selectedSpot,
          adults,
          duration: approxDuration,
          transit: transitLabel,
          totalAmount: grandTotal,
          paymentStatus: payload.paymentStatus,
        })
        setCurrentStep(4)
      } catch (err) {
        console.error('Booking submission notice:', err)
        const fallbackRef = 'CT-' + Math.floor(100000 + Math.random() * 900000)
        setSubmitSuccess({
          referenceId: fallbackRef,
          departure: departure.city,
          destination: destination.city,
          spot: destination.selectedSpot,
          adults,
          duration: approxDuration,
          transit: transitLabel,
          totalAmount: grandTotal,
          paymentStatus: payload.paymentStatus,
        })
        setCurrentStep(4)
      } finally {
        setSubmitting(false)
      }
    }

    // If Razorpay Online Gateway Selected (UPI / Card / NetBanking)
    if (paymentMethod === 'razorpay' || paymentMethod === 'upi' || paymentMethod === 'card') {
      // Launch Dedicated Full Razorpay Gateway Screen
      setRazorpayModalOpen(true)
    } else {
      // Zero-Deposit VIP Hold
      saveBookingToDatabase(
        'Zero-Deposit VIP Concierge Hold (Pay on Arrival)',
        'Zero-Deposit Hold'
      )
    }
  }

  // Handle successful payment from Razorpay modal
  const handleRazorpayModalSuccess = (paymentResult) => {
    let transitLabel = 'Flight (Domestic)'
    if (transitCategory === 'bus') {
      const b = BUS_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      transitLabel = `Bus: ${b?.name || 'Luxury AC Sleeper'}`
    } else if (transitCategory === 'train') {
      const t = TRAIN_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      transitLabel = `Train: ${t?.name || '3rd AC Comfort'}`
    } else {
      const f = FLIGHT_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      transitLabel = `Flight: ${f?.name || 'Economy'}`
    }

    setSubmitting(true)
    const payload = {
      name: travelersList[0].fullName,
      email: contactData.email,
      phone: contactData.phone,
      departure: departure.display || departure.city,
      destination: `${destination.city} (${destination.selectedSpot || 'All Major Spots'})`,
      duration: approxDuration,
      travelers: adults,
      partySize: adults === 1 ? 'Solo' : adults === 2 ? 'Couple' : adults === 4 ? 'Family (4)' : 'Group (6+)',
      travelMode: transitLabel,
      transport: transitLabel,
      travelDate: contactData.travelDate || 'Flexible / Next 30 Days',
      specialRequests: contactData.specialRequests || 'Bespoke Curated Experience',
      travelersDetails: travelersList,
      paymentMethod: `Razorpay (${paymentResult.method || 'Online Verified'})`,
      paymentStatus: 'Paid & Secured (Razorpay)',
      totalAmount: grandTotal,
      paymentId: paymentResult.paymentId,
    }

    api.post('/custom-trips', payload)
      .then((res) => {
        const refId = res.data?.inquiryReference || 'CT-' + Math.floor(100000 + Math.random() * 900000)
        setSubmitSuccess({
          referenceId: refId,
          departure: departure.city,
          destination: destination.city,
          spot: destination.selectedSpot,
          adults,
          duration: approxDuration,
          transit: transitLabel,
          totalAmount: grandTotal,
          paymentStatus: 'Paid & Secured (Razorpay Verified)',
        })
        setCurrentStep(4)
      })
      .catch((err) => {
        const fallbackRef = 'CT-' + Math.floor(100000 + Math.random() * 900000)
        setSubmitSuccess({
          referenceId: fallbackRef,
          departure: departure.city,
          destination: destination.city,
          spot: destination.selectedSpot,
          adults,
          duration: approxDuration,
          transit: transitLabel,
          totalAmount: grandTotal,
          paymentStatus: 'Paid & Secured (Razorpay Verified)',
        })
        setCurrentStep(4)
      })
      .finally(() => setSubmitting(false))
  }

  const cleanPhone = (settings.contactPhone || '+918953208952').replace(/[^0-9]/g, '')

  return (
    <section
      id="custom-trip"
      className={`relative bg-[#071A16] text-white overflow-hidden select-none ${isCustomTripRoute ? 'pt-24 sm:pt-32 pb-16 min-h-screen' : 'py-14 sm:py-20'
        }`}
    >
      <AnimatedBackgroundCompass />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#12382E]/45 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#6FCF45]/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">

          {/* ========================================================================= */}
          {/* LEFT COLUMN: CONTEXT & DYNAMIC JOURNEY PREVIEW (Span 4 cols)              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-3.5 sticky top-28">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#6FCF45] font-heading flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 fill-[#6FCF45]" />
                DIRECT BOOKING &amp; ITINERARY ARCHITECT
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight font-heading leading-tight">
                Plan Your Journey <br />
                <span className="text-[#6FCF45]">In 3 Seamless Steps.</span>
              </h2>
              <p className="mt-1.5 text-xs text-[#A8B5AF] leading-relaxed">
                Live location detection, famous hotspots curated, party-size customized details, and instantaneous VIP booking.
              </p>
            </div>

            {/* Live Journey Summary Preview Card */}
            <div className="bg-[#0B241E]/95 border-2 border-[#6FCF45]/70 rounded-[16px] p-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#6FCF45] flex items-center gap-1.5 font-heading">
                  <Compass className="w-3.5 h-3.5" />
                  Live Route &amp; Transit
                </span>
                <span className="text-xs text-[#6FCF45] font-extrabold">
                  {distanceKm} km approx
                </span>
              </div>

              {/* Connected Visual Route */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6FCF45] ring-2 ring-[#6FCF45]/30 shrink-0 mt-1" />
                  <div>
                    <span className="text-[#A8B5AF] text-[10px] uppercase font-bold block">Origin:</span>
                    <span className="font-bold text-white text-xs">{departure.city || 'Starting Point'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pl-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308] ring-2 ring-[#EAB308]/30 shrink-0 mt-1" />
                  <div>
                    <span className="text-[#A8B5AF] text-[10px] uppercase font-bold block">Destination &amp; Highlight:</span>
                    <span className="font-bold text-white text-xs">{destination.city}</span>
                    {destination.selectedSpot && (
                      <span className="text-[10.5px] text-[#6FCF45] block font-medium">
                        ✦ {destination.selectedSpot}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Transit & Travelers Badges */}
              <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="bg-[#071A16] rounded-md p-1.5 border border-white/5">
                  <div className="text-[#A8B5AF]">Party</div>
                  <div className="font-bold text-white mt-0.5">{adults} Guests</div>
                </div>
                <div className="bg-[#071A16] rounded-md p-1.5 border border-white/5">
                  <div className="text-[#A8B5AF]">Mode</div>
                  <div className="font-bold text-[#6FCF45] mt-0.5 capitalize">{transitCategory}</div>
                </div>
                <div className="bg-[#071A16] rounded-md p-1.5 border border-white/5">
                  <div className="text-[#A8B5AF]">Est. Total</div>
                  <div className="font-bold text-white mt-0.5">₹{grandTotal.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="space-y-2 pt-1 hidden sm:block">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#A8B5AF]">
                <ShieldCheck className="w-4 h-4 text-[#6FCF45] shrink-0" />
                <span>Zero-Deposit Hold Available on Step 3</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#A8B5AF]">
                <CheckCircle className="w-4 h-4 text-[#6FCF45] shrink-0" />
                <span>24/7 Dedicated Concierge &amp; WhatsApp Support</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 3-STEP INTERACTIVE BOOKING WIZARD (Span 8 cols)             */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8">
            <div className="bg-[#0F2922] border-2 border-[#6FCF45]/80 rounded-[20px] p-4 sm:p-7 shadow-2xl relative overflow-hidden min-h-[520px] flex flex-col justify-between">

              {/* Step Navigation Progress Bar */}
              {currentStep <= 3 && (
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    {[
                      { num: 1, label: 'Route & Transit' },
                      { num: 2, label: 'Traveler Info' },
                      { num: 3, label: 'Secure Payment' },
                    ].map((st) => (
                      <div key={st.num} className="flex items-center gap-1.5">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === st.num
                            ? 'bg-[#6FCF45] text-[#071A16] ring-2 ring-[#6FCF45]/40'
                            : currentStep > st.num
                              ? 'bg-[#10B981] text-white'
                              : 'bg-white/10 text-[#A8B5AF]'
                            }`}
                        >
                          {currentStep > st.num ? '✓' : st.num}
                        </div>
                        <span
                          className={`text-xs font-bold hidden sm:inline ${currentStep === st.num ? 'text-white' : 'text-[#A8B5AF]'
                            }`}
                        >
                          {st.label}
                        </span>
                        {st.num < 3 && <span className="text-white/20 mx-1">→</span>}
                      </div>
                    ))}
                  </div>

                  <span className="text-xs font-extrabold uppercase tracking-wider font-heading text-[#6FCF45]">
                    Step {currentStep} of 3
                  </span>
                </div>
              )}

              <AnimatePresence mode="wait">

                {/* =================================================================== */}
                {/* STEP 1: ROUTE, HOTSPOTS & TRANSIT (Bus / Train / Flight)            */}
                {/* =================================================================== */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <form onSubmit={handleProceedToStep2} className="space-y-4">

                      {/* 1. ORIGIN & REAL-TIME LOCATION BUTTON */}
                      <div className="relative" ref={depRef}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 text-[#6FCF45]" />
                            <span>1. Starting City / Origin</span>
                          </label>

                          {/* 📍 Live Location Permission Fetch Button */}
                          <button
                            type="button"
                            onClick={handleDetectCurrentLocation}
                            disabled={locatingUser}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#6FCF45]/15 hover:bg-[#6FCF45]/30 text-[#6FCF45] border border-[#6FCF45]/40 text-[10.5px] font-bold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                          >
                            {locatingUser ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Detecting GPS...</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="w-3 h-3 text-[#6FCF45]" />
                                <span>📍 Detect Current Location</span>
                              </>
                            )}
                          </button>
                        </div>

                        {locatingError && (
                          <p className="text-[11px] text-amber-400 mb-1">{locatingError}</p>
                        )}

                        <div className="relative">
                          <input
                            type="text"
                            value={depSearchQuery}
                            onChange={(e) => {
                              setDepSearchQuery(e.target.value)
                              setDepDropdownOpen(true)
                            }}
                            onFocus={() => setDepDropdownOpen(true)}
                            placeholder="Type starting city (e.g. New Delhi, Mumbai, Lucknow, London)..."
                            className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all shadow-inner pl-10"
                          />
                          <Search className="w-4 h-4 text-[#6FCF45] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          {depLoading && (
                            <Loader2 className="w-4 h-4 text-[#6FCF45] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          )}
                        </div>

                        {/* Autocomplete Dropdown */}
                        {depDropdownOpen && depSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#071A16] border border-[#6FCF45]/40 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto divide-y divide-white/5">
                            {depSuggestions.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setDeparture({
                                    city: item.name,
                                    state: item.state || '',
                                    country: item.country || '',
                                    display: item.display,
                                    lat: item.lat || 28.6139,
                                    lng: item.lon || 77.209,
                                  })
                                  setDepSearchQuery(item.display)
                                  setDepDropdownOpen(false)
                                }}
                                className="w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#12382E] transition-colors text-white"
                              >
                                <div>
                                  <div className="font-semibold text-white">{item.display}</div>
                                  {item.country && <div className="text-[10px] text-[#A8B5AF]">{item.country}</div>}
                                </div>
                                <Check className={`w-3.5 h-3.5 text-[#6FCF45] shrink-0 ${departure.display === item.display ? 'opacity-100' : 'opacity-0'}`} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 2. TARGET DESTINATION WITH 5-5 FAMOUS SPOTS DROPDOWN */}
                      <div className="relative" ref={destRef}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-[#6FCF45]" />
                            <span>2. Target City &amp; 5 Famous Spots</span>
                          </label>
                          <span className="text-[10.5px] text-[#6FCF45] font-semibold">
                            Select city or exact spot
                          </span>
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            value={destSearchQuery}
                            onChange={(e) => {
                              setDestSearchQuery(e.target.value)
                              setDestDropdownOpen(true)
                            }}
                            onFocus={() => setDestDropdownOpen(true)}
                            placeholder="Search destination or spot (e.g. Kashmir, Gulmarg, Jaipur, Hawa Mahal)..."
                            className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all shadow-inner pl-10"
                          />
                          <Compass className="w-4 h-4 text-[#6FCF45] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Selected Spot Notification Pill */}
                        {destination.selectedSpot && (
                          <div className="mt-1.5 flex items-center justify-between px-3 py-1 rounded-lg bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-xs">
                            <span className="text-white/80">Selected Hotspot:</span>
                            <span className="font-bold text-[#6FCF45]">✦ {destination.selectedSpot}</span>
                          </div>
                        )}

                        {/* Famous Spots Dropdown Container */}
                        {destDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#071A16] border border-[#6FCF45]/50 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-white/10 p-2">
                            {filteredCitySpots.length === 0 ? (
                              <div className="p-3 text-xs text-[#A8B5AF] text-center">
                                No direct match. You can still type custom destination above!
                              </div>
                            ) : (
                              filteredCitySpots.map((item, idx) => (
                                <div key={idx} className="p-2.5 hover:bg-[#0B241E] rounded-lg transition-colors">
                                  <div className="flex items-center justify-between">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDestination({
                                          city: item.city,
                                          state: item.state,
                                          country: item.country,
                                          display: `${item.city}, ${item.country}`,
                                          lat: item.lat,
                                          lng: item.lng,
                                          selectedSpot: item.spots[0],
                                        })
                                        setDestSearchQuery(`${item.city}, ${item.country}`)
                                        setDestDropdownOpen(false)
                                      }}
                                      className="font-bold text-white text-xs sm:text-sm hover:text-[#6FCF45] flex items-center gap-1.5 cursor-pointer text-left"
                                    >
                                      <span>📍 {item.city}</span>
                                      <span className="text-[10px] text-[#A8B5AF] font-normal">({item.state || item.country})</span>
                                    </button>
                                    <span className="text-[10px] text-[#6FCF45] font-semibold">
                                      from ₹{item.approxStartingPrice.toLocaleString('en-IN')}
                                    </span>
                                  </div>

                                  {/* 5 Famous Tourist Spots Tags */}
                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                    {item.spots.map((spot, sIdx) => (
                                      <button
                                        key={sIdx}
                                        type="button"
                                        onClick={() => {
                                          setDestination({
                                            city: item.city,
                                            state: item.state,
                                            country: item.country,
                                            display: `${item.city}, ${item.country}`,
                                            lat: item.lat,
                                            lng: item.lng,
                                            selectedSpot: spot,
                                          })
                                          setDestSearchQuery(`${item.city} - ${spot}`)
                                          setDestDropdownOpen(false)
                                        }}
                                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-[#6FCF45] hover:text-[#071A16] text-[#A8B5AF] border border-white/10 transition-all font-medium cursor-pointer"
                                      >
                                        ✦ {spot}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>

                      {/* 3. DYNAMIC TRANSIT MODE (Bus for 200-300km, Train & Flight for >300km) */}
                      <div className="bg-[#071A16]/80 border border-white/15 rounded-xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                            <Plane className="w-3.5 h-3.5 text-[#6FCF45]" />
                            <span>3. Travel Mode by Distance ({distanceKm} km)</span>
                          </label>
                          <span className="text-[10px] text-[#A8B5AF]">Auto-calculated route</span>
                        </div>

                        {/* Mode Switcher Tabs */}
                        <div className="grid grid-cols-3 gap-2">
                          {/* Bus Option (Only active if 200 - 300 km or close range) */}
                          <button
                            type="button"
                            onClick={() => {
                              setTransitCategory('bus')
                              setSelectedTransitSubOption('volvo_ac_sleeper')
                            }}
                            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${transitCategory === 'bus'
                              ? 'bg-[#6FCF45] text-[#071A16] shadow-sm'
                              : 'bg-[#0B241E] text-white/80 border border-white/10 hover:border-[#6FCF45]/50'
                              }`}
                          >
                            <Bus className="w-3.5 h-3.5" />
                            <span>Luxury Bus</span>
                            {isBusEligible && <span className="text-[9px] px-1 rounded bg-black/20">Optimal</span>}
                          </button>

                          {/* Train Option */}
                          <button
                            type="button"
                            onClick={() => {
                              setTransitCategory('train')
                              setSelectedTransitSubOption('train_3ac')
                            }}
                            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${transitCategory === 'train'
                              ? 'bg-[#6FCF45] text-[#071A16] shadow-sm'
                              : 'bg-[#0B241E] text-white/80 border border-white/10 hover:border-[#6FCF45]/50'
                              }`}
                          >
                            <Train className="w-3.5 h-3.5" />
                            <span>Train Express</span>
                          </button>

                          {/* Flight Option */}
                          <button
                            type="button"
                            onClick={() => {
                              setTransitCategory('flight')
                              setSelectedTransitSubOption('flight_economy')
                            }}
                            className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${transitCategory === 'flight'
                              ? 'bg-[#6FCF45] text-[#071A16] shadow-sm'
                              : 'bg-[#0B241E] text-white/80 border border-white/10 hover:border-[#6FCF45]/50'
                              }`}
                          >
                            <Plane className="w-3.5 h-3.5" />
                            <span>Aeroplane</span>
                          </button>
                        </div>

                        {/* SUB-CATEGORY SELECTION BASED ON CHOSEN TRANSIT */}
                        <div className="pt-1">
                          {transitCategory === 'bus' && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] text-[#6FCF45] font-semibold block">
                                Select Bus Model (Ideal for 200 km – 300 km transit):
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {BUS_OPTIONS.map((bus) => (
                                  <button
                                    key={bus.id}
                                    type="button"
                                    onClick={() => setSelectedTransitSubOption(bus.id)}
                                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${selectedTransitSubOption === bus.id
                                      ? 'bg-[#12382E] border-[#6FCF45] text-white ring-1 ring-[#6FCF45]'
                                      : 'bg-[#071A16] border-white/10 text-white/80 hover:border-white/30'
                                      }`}
                                  >
                                    <div className="font-bold text-white flex justify-between">
                                      <span>{bus.name}</span>
                                      <span className="text-[#6FCF45]">₹{bus.farePerPerson}</span>
                                    </div>
                                    <div className="text-[10px] text-[#A8B5AF] mt-0.5">{bus.desc}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {transitCategory === 'train' && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] text-[#6FCF45] font-semibold block">
                                Select Train Berth Class (&gt; 300 km travel):
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                                {TRAIN_OPTIONS.map((trn) => (
                                  <button
                                    key={trn.id}
                                    type="button"
                                    onClick={() => setSelectedTransitSubOption(trn.id)}
                                    className={`p-2 rounded-lg text-left text-xs transition-all border ${selectedTransitSubOption === trn.id
                                      ? 'bg-[#12382E] border-[#6FCF45] text-white ring-1 ring-[#6FCF45]'
                                      : 'bg-[#071A16] border-white/10 text-white/80 hover:border-white/30'
                                      }`}
                                  >
                                    <div className="font-bold text-white text-[11px] truncate">{trn.name}</div>
                                    <div className="text-[10px] text-[#6FCF45] font-bold mt-0.5">₹{trn.farePerPerson}/pax</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {transitCategory === 'flight' && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] text-[#6FCF45] font-semibold block">
                                Select Aeroplane Travel Tier:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {FLIGHT_OPTIONS.map((flt) => (
                                  <button
                                    key={flt.id}
                                    type="button"
                                    onClick={() => setSelectedTransitSubOption(flt.id)}
                                    className={`p-2.5 rounded-lg text-left text-xs transition-all border ${selectedTransitSubOption === flt.id
                                      ? 'bg-[#12382E] border-[#6FCF45] text-white ring-1 ring-[#6FCF45]'
                                      : 'bg-[#071A16] border-white/10 text-white/80 hover:border-white/30'
                                      }`}
                                  >
                                    <div className="font-bold text-white flex justify-between">
                                      <span>{flt.name}</span>
                                      <span className="text-[#6FCF45]">₹{flt.farePerPerson}</span>
                                    </div>
                                    <div className="text-[10px] text-[#A8B5AF] mt-0.5">{flt.desc}</div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4. PARTY SIZE (Solo / Couple / Family 4 / Group 6) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#6FCF45]" />
                            <span>Party Size (Explorers)</span>
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { count: 1, label: 'Solo (1 Guest)' },
                              { count: 2, label: 'Couple (2 Guests)' },
                              { count: 4, label: 'Family (4 Guests)' },
                              { count: 6, label: 'Group (6 Guests)' },
                            ].map((item) => (
                              <button
                                key={item.count}
                                type="button"
                                onClick={() => setAdults(item.count)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all truncate cursor-pointer ${adults === item.count
                                  ? 'bg-[#6FCF45] text-[#071A16] shadow-sm ring-1 ring-[#6FCF45]'
                                  : 'bg-[#071A16] border border-white/15 text-[#A8B5AF] hover:text-white hover:border-[#6FCF45]/50'
                                  }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#6FCF45]" />
                            <span>Approx Duration</span>
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {['3–5 Days', '6–8 Days', '9–14 Days', '2+ Weeks'].map((dur) => (
                              <button
                                key={dur}
                                type="button"
                                onClick={() => setApproxDuration(dur)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${approxDuration === dur
                                  ? 'bg-[#6FCF45] text-[#071A16] shadow-sm ring-1 ring-[#6FCF45]'
                                  : 'bg-[#071A16] border border-white/15 text-[#A8B5AF] hover:text-white hover:border-[#6FCF45]/50'
                                  }`}
                              >
                                {dur}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Step 1 Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full bg-[#6FCF45] hover:bg-[#8BE35A] text-[#071A16] py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-[0.18em] transition-all duration-200 shadow-lg shadow-[#6FCF45]/20 flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer"
                        >
                          <span>CONTINUE TO TRAVELER DETAILS (STEP 2)</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5] text-[#071A16] group-hover:translate-x-1.5 transition-transform" />
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}

                {/* =================================================================== */}
                {/* STEP 2: DYNAMIC TRAVELER DETAILS (1 for Solo, 2 Couple, 4, 6)       */}
                {/* =================================================================== */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#6FCF45] hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back to Step 1</span>
                        </button>
                        <span className="text-xs text-white/80 font-semibold">
                          Party Size: <strong className="text-[#6FCF45]">{adults} Travelers</strong>
                        </span>
                      </div>

                      <div className="mb-3 text-left">
                        <h3 className="text-base sm:text-lg font-extrabold text-white font-heading">
                          Fill In Details for {adults === 1 ? 'Solo Traveler' : `${adults} Travelers`}
                        </h3>
                        <p className="text-xs text-[#A8B5AF]">
                          Individual names are registered with verified transit vouchers and hotel reservations.
                        </p>
                      </div>

                      <form onSubmit={handleProceedToPayment} className="space-y-3.5 text-left">

                        {/* Dynamic Traveler Cards */}
                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                          {travelersList.map((trv, idx) => (
                            <div
                              key={trv.id}
                              className="bg-[#071A16] border border-white/15 rounded-xl p-3 space-y-2 relative"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#6FCF45] flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5" />
                                  <span>{trv.label}</span>
                                </span>
                                <span className="text-[10px] text-white/40 font-mono">#{idx + 1}</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                                <div className="sm:col-span-6">
                                  <input
                                    type="text"
                                    required
                                    value={trv.fullName}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      setTravelersList((prev) =>
                                        prev.map((t) => (t.id === trv.id ? { ...t, fullName: val } : t))
                                      )
                                    }}
                                    placeholder="Full Name (as per Govt ID)"
                                    className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                                  />
                                </div>
                                <div className="sm:col-span-3">
                                  <input
                                    type="number"
                                    required
                                    min="1"
                                    max="100"
                                    value={trv.age}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      setTravelersList((prev) =>
                                        prev.map((t) => (t.id === trv.id ? { ...t, age: val } : t))
                                      )
                                    }}
                                    placeholder="Age"
                                    className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                                  />
                                </div>
                                <div className="sm:col-span-3">
                                  <select
                                    value={trv.gender}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      setTravelersList((prev) =>
                                        prev.map((t) => (t.id === trv.id ? { ...t, gender: val } : t))
                                      )
                                    }}
                                    className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                                  >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Primary Contact Details */}
                        <div className="bg-[#071A16] border border-white/15 rounded-xl p-3 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                            Primary Contact for Tickets &amp; Vouchers
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <input
                                type="tel"
                                required
                                value={contactData.phone}
                                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                                placeholder="WhatsApp / Phone (+91 89532 08952)"
                                className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                              />
                            </div>
                            <div>
                              <input
                                type="email"
                                required
                                value={contactData.email}
                                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                                placeholder="Email (for Booking Confirmation)"
                                className="w-full bg-[#0B241E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Travel Date & Special Requests */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={contactData.travelDate}
                            onChange={(e) => setContactData({ ...contactData, travelDate: e.target.value })}
                            placeholder="Travel Date / Month (e.g. 15 Nov or Flexible)"
                            className="w-full bg-[#071A16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                          />
                          <input
                            type="text"
                            value={contactData.specialRequests}
                            onChange={(e) => setContactData({ ...contactData, specialRequests: e.target.value })}
                            placeholder="Special Preferences (e.g. Pure Veg, Window Seat)"
                            className="w-full bg-[#071A16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>

                        {/* Step 2 Submit Button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full bg-[#6FCF45] hover:bg-[#8BE35A] text-[#071A16] py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#6FCF45]/30 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>PROCEED TO SECURE PAYMENT (STEP 3)</span>
                            <ArrowRight className="w-4 h-4 stroke-[3] text-[#071A16]" />
                          </button>
                        </div>

                      </form>
                    </div>
                  </motion.div>
                )}

                {/* =================================================================== */}
                {/* STEP 3: OFFICIAL RAZORPAY SECURE PAYMENT GATEWAY (WHITE THEME)     */}
                {/* =================================================================== */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#6FCF45] hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back to Traveler Details</span>
                        </button>
                        <span className="text-xs text-white/80 font-semibold">
                          Final Amount: <strong className="text-[#6FCF45]">₹{grandTotal.toLocaleString('en-IN')}</strong>
                        </span>
                      </div>

                      {/* =================================================================== */}
                      {/* STEP 3: PAYMENT SELECTION & SECURE CHECKOUT                         */}
                      {/* =================================================================== */}
                      <div className="bg-[#0B241E]/95 border-2 border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl text-left space-y-4">
                        
                        {/* Title Header */}
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                            Choose Payment Option
                          </h3>
                          <p className="text-xs text-[#A8B5AF]">
                            All transactions are encrypted with 256-bit bank grade security. Instant confirmation voucher dispatched.
                          </p>
                        </div>

                        {/* Breakdown Box */}
                        <div className="bg-[#071A16] border border-white/10 rounded-xl p-3.5 sm:p-4 space-y-2 text-xs">
                          <div className="flex justify-between text-[#A8B5AF]">
                            <span>Package Base ({adults} Guest{adults > 1 ? 's' : ''}):</span>
                            <span className="font-semibold text-white">₹{(approxBasePerPerson * adults).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-[#A8B5AF]">
                            <span>Transit Fare ({transitCategory.toUpperCase()} - {adults} Guest{adults > 1 ? 's' : ''}):</span>
                            <span className="font-semibold text-white">₹{(transitFarePerPerson * adults).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-[#A8B5AF]">
                            <span>GST &amp; Travel Insurance (5%):</span>
                            <span className="font-semibold text-white">₹{gstTax.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="border-t border-white/10 pt-2 flex justify-between items-center text-sm font-bold">
                            <span className="text-white">Total Payable:</span>
                            <span className="text-[#6FCF45] text-lg font-black">₹{grandTotal.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* 3 Payment Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Option 1: Razorpay UPI */}
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod('upi')
                              setPaymentNotice('')
                            }}
                            className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                              paymentMethod === 'upi'
                                ? 'bg-[#0B241E] border-[#6FCF45] ring-2 ring-[#6FCF45]/30'
                                : 'bg-[#071A16] border-white/10 hover:border-white/30 text-white/70'
                            }`}
                          >
                            <QrCode className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-[#6FCF45]' : 'text-white/60'}`} />
                            <div>
                              <div className="font-bold text-xs text-white">Razorpay UPI</div>
                              <div className="text-[10px] text-[#A8B5AF]">GPay, PhonePe, QR</div>
                            </div>
                          </button>

                          {/* Option 2: Cards / NetBanking */}
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod('card')
                              setPaymentNotice('')
                            }}
                            className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                              paymentMethod === 'card'
                                ? 'bg-[#0B241E] border-[#6FCF45] ring-2 ring-[#6FCF45]/30'
                                : 'bg-[#071A16] border-white/10 hover:border-white/30 text-white/70'
                            }`}
                          >
                            <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#6FCF45]' : 'text-white/60'}`} />
                            <div>
                              <div className="font-bold text-xs text-white">Cards / NetBanking</div>
                              <div className="text-[10px] text-[#A8B5AF]">Razorpay Secure Gateway</div>
                            </div>
                          </button>

                          {/* Option 3: Zero-Deposit */}
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod('zero_deposit')
                              setPaymentNotice('')
                            }}
                            className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                              paymentMethod === 'zero_deposit'
                                ? 'bg-[#0B241E] border-[#6FCF45] ring-2 ring-[#6FCF45]/30'
                                : 'bg-[#071A16] border-white/10 hover:border-white/30 text-white/70'
                            }`}
                          >
                            <Landmark className={`w-5 h-5 ${paymentMethod === 'zero_deposit' ? 'text-[#6FCF45]' : 'text-white/60'}`} />
                            <div>
                              <div className="font-bold text-xs text-white">Zero-Deposit</div>
                              <div className="text-[10px] text-[#A8B5AF]">Pay at Hotel / Arrival</div>
                            </div>
                          </button>
                        </div>

                        {/* Detail Description Box */}
                        <div className="p-3.5 rounded-xl bg-[#071A16] border border-white/10 text-xs">
                          {paymentMethod === 'upi' && (
                            <div className="space-y-1">
                              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                                <QrCode className="w-4 h-4 text-[#6FCF45]" />
                                <span>Razorpay UPI &amp; Instant QR Code</span>
                              </div>
                              <p className="text-[11.5px] text-[#A8B5AF] leading-relaxed">
                                Clicking &quot;Pay via Razorpay&quot; will launch the official Razorpay Checkout popup supporting Google Pay, PhonePe, Paytm, BHIM, and instant dynamic QR scanner.
                              </p>
                            </div>
                          )}

                          {paymentMethod === 'card' && (
                            <div className="space-y-1">
                              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                                <CreditCard className="w-4 h-4 text-[#6FCF45]" />
                                <span>Cards &amp; NetBanking (Razorpay)</span>
                              </div>
                              <p className="text-[11.5px] text-[#A8B5AF] leading-relaxed">
                                Clicking &quot;Pay via Razorpay&quot; will launch the official Razorpay Checkout popup supporting Debit/Credit Cards (Visa, MasterCard, RuPay), EMI, and 50+ NetBanking options.
                              </p>
                            </div>
                          )}

                          {paymentMethod === 'zero_deposit' && (
                            <div className="space-y-1">
                              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                                <Landmark className="w-4 h-4 text-[#6FCF45]" />
                                <span>Zero-Deposit VIP Hold (Pay on Arrival)</span>
                              </div>
                              <p className="text-[11.5px] text-[#A8B5AF] leading-relaxed">
                                Reserve your seats and hotel slots now with 0 advance payment. Pay the full amount in cash or card directly when checking in or boarding.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Customer Notice if Gateway Rail is temporarily busy */}
                        {paymentNotice && (
                          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                            <div className="space-y-1">
                              <p className="font-bold text-amber-300">Gateway Notice</p>
                              <p className="text-[11.5px] text-amber-200/90 leading-relaxed">{paymentNotice}</p>
                            </div>
                          </div>
                        )}

                        {/* Action CTA Button */}
                        {paymentMethod === 'zero_deposit' ? (
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={handleConfirmZeroDeposit}
                            className="w-full py-4 rounded-xl bg-[#6FCF45] hover:bg-[#85e65b] text-[#071A16] text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-[#6FCF45]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Landmark className="w-4 h-4 stroke-[2.5]" />
                            <span>CONFIRM WITH VIP ZERO-DEPOSIT HOLD (PAY ON ARRIVAL / CASH)</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={handleLaunchOfficialRazorpay}
                            className="w-full py-4 rounded-xl bg-[#6FCF45] hover:bg-[#85e65b] text-[#071A16] text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-[#6FCF45]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>PAY ₹{grandTotal.toLocaleString('en-IN')} VIA RAZORPAY</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        )}

                        {/* Footer Guarantee */}
                        <div className="flex items-center justify-between text-[10px] text-white/50 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#6FCF45]" />
                            <span>256-Bit SSL Encryption • Bank Grade Security</span>
                          </div>
                          <span className="font-mono text-white/60">Razorpay Official Rails</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* =================================================================== */}
                {/* STEP 4: SUCCESS CONFIRMATION & VOUCHER DISPATCH                     */}
                {/* =================================================================== */}
                {currentStep === 4 && submitSuccess && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-3 flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-full bg-[#6FCF45]/20 border-2 border-[#6FCF45] flex items-center justify-center mx-auto text-[#6FCF45] shadow-lg shadow-[#6FCF45]/30">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#6FCF45] font-heading">
                          EXPEDITION CONFIRMED • REF #{submitSuccess.referenceId}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1">
                          Your Travel Voucher is Generated!
                        </h3>
                        <p className="text-xs text-[#A8B5AF] mt-1 max-w-sm mx-auto">
                          Confirmation voucher with transit tickets dispatched to <strong>{contactData.email}</strong> and your WhatsApp number.
                        </p>
                      </div>

                      {/* Route & Booking Summary Card */}
                      <div className="bg-[#071A16] rounded-xl p-3.5 border border-white/10 text-left text-xs space-y-1.5 my-2">
                        <div className="flex justify-between text-white/70">
                          <span>Route:</span>
                          <span className="font-bold text-white">{submitSuccess.departure} → {submitSuccess.destination}</span>
                        </div>
                        {submitSuccess.spot && (
                          <div className="flex justify-between text-white/70">
                            <span>Key Spot:</span>
                            <span className="font-bold text-[#6FCF45]">✦ {submitSuccess.spot}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-white/70">
                          <span>Party &amp; Transit:</span>
                          <span className="font-bold text-white">{submitSuccess.adults} Guests • {submitSuccess.transit}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Payment Status:</span>
                          <span className="font-bold text-[#6FCF45]">{submitSuccess.paymentStatus}</span>
                        </div>
                        <div className="border-t border-white/10 pt-1 flex justify-between font-bold text-sm">
                          <span className="text-white">Amount:</span>
                          <span className="text-[#6FCF45]">₹{submitSuccess.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Action & Reset */}
                    <div className="space-y-2 pt-2">
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Hello Tours & Travels Concierge! I have confirmed Booking #${submitSuccess.referenceId} for ${submitSuccess.destination} (${submitSuccess.transit}, ${submitSuccess.adults} Guests). Please share my day-by-day itinerary voucher!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" />
                        <span>Instant WhatsApp Concierge Connect</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1)
                          setSubmitSuccess(null)
                        }}
                        className="inline-flex items-center justify-center gap-1.5 text-xs text-[#A8B5AF] hover:text-white transition-colors cursor-pointer py-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Book Another Destination</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>

      {/* Official Full Razorpay Checkout Screen Modal */}
      <RazorpayCheckoutModal
        isOpen={razorpayModalOpen}
        onClose={() => setRazorpayModalOpen(false)}
        amount={grandTotal}
        tourTitle={`${destination.city} Luxury Expedition (${adults} Guests)`}
        customerName={travelersList[0]?.fullName || user?.name || 'Explorer'}
        customerEmail={contactData.email}
        customerPhone={contactData.phone}
        onPaymentSuccess={handleRazorpayModalSuccess}
      />
    </section>
  )
}

export default CustomTrip
