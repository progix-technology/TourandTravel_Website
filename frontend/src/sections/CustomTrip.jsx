import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
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

import { BUS_OPTIONS, TRAIN_OPTIONS, FLIGHT_OPTIONS } from '../features/customTrip/constants/transitOptions'
import TripCostSidebar from '../features/customTrip/components/TripCostSidebar'
import StepRouteTransit from '../features/customTrip/components/StepRouteTransit'
import StepTravelerDetails from '../features/customTrip/components/StepTravelerDetails'
import StepPaymentConfirmation from '../features/customTrip/components/StepPaymentConfirmation'
import TripSuccessScreen from '../features/customTrip/components/TripSuccessScreen'

export const CustomTrip = ({ isPage = false }) => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { settings } = useSettings()

  const isCustomTripRoute = isPage || window.location.pathname === '/custom-trip'

  // Step Management: 1 = Route & Transit, 2 = Travelers Info, 3 = Payment & Confirmation, 4 = Success
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
  const [adults, setAdults] = useState(2)

  // Autocomplete state for Departure
  const [depSearchQuery, setDepSearchQuery] = useState('New Delhi, Delhi, India')
  const [depSuggestions, setDepSuggestions] = useState([])
  const [depLoading, setDepLoading] = useState(false)
  const [depDropdownOpen, setDepDropdownOpen] = useState(false)
  const depRef = useRef(null)

  // Autocomplete state for Destination
  const [destSearchQuery, setDestSearchQuery] = useState('Kashmir, Jammu & Kashmir, India')
  const [destDropdownOpen, setDestDropdownOpen] = useState(false)
  const destRef = useRef(null)

  // Transit Selection State
  const [transitCategory, setTransitCategory] = useState('train')
  const [selectedTransitSubOption, setSelectedTransitSubOption] = useState('train_3ac')

  // Calculate Distance in Km
  const distanceKm = useMemo(() => {
    if (!departure?.lat || !departure?.lng || !destination?.lat || !destination?.lng) {
      return 650
    }
    return calculateDistanceKm(departure.lat, departure.lng, destination.lat, destination.lng)
  }, [departure, destination])

  const isBusEligible = distanceKm >= 150 && distanceKm <= 350
  const isLongDistance = distanceKm > 300

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

  // Sync travelers array when adults changes
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
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(null)
  const [paymentNotice, setPaymentNotice] = useState('')

  const approxBasePerPerson = useMemo(() => {
    const matched = CITIES_WITH_SPOTS.find(
      (c) => c.city.toLowerCase() === (destination.city || '').toLowerCase()
    )
    return matched?.approxStartingPrice || 18999
  }, [destination])

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
  // GEOLOCATION: Browser Permission + Reverse Geocode
  // -------------------------------------------------------------
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocatingError('Geolocation is not supported by your browser.')
      return
    }

    setLocatingUser(true)
    setLocatingError('')

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          const geoRes = await reverseGeocodeCoords(lat, lon)
          if (geoRes) {
            setDeparture({
              city: geoRes.city,
              state: geoRes.state,
              country: geoRes.country,
              display: geoRes.display,
              lat,
              lng: lon,
            })
            setDepSearchQuery(geoRes.display)
            setDepDropdownOpen(false)
          }
        } catch (e) {
          setLocatingError('Location detected, but address lookup failed. You can type it.')
        } finally {
          setLocatingUser(false)
        }
      },
      (err) => {
        setLocatingUser(false)
        if (err.code === 1) {
          setLocatingError('Location permission denied. Please allow GPS or type your city.')
        } else {
          setLocatingError('Unable to retrieve location. Please type manually.')
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  // Autocomplete debounce for Departure
  useEffect(() => {
    if (!depSearchQuery || depSearchQuery.trim().length < 2) {
      setDepSuggestions([])
      return
    }

    let active = true
    const timeout = setTimeout(async () => {
      setDepLoading(true)
      try {
        const results = await searchGlobalLocations(depSearchQuery)
        if (active) {
          setDepSuggestions(results)
        }
      } catch (err) {
        if (active) setDepSuggestions([])
      } finally {
        if (active) setDepLoading(false)
      }
    }, 250)

    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [depSearchQuery])

  // Destination filtered list from local 50+ tourist spots
  const filteredCitySpots = useMemo(() => {
    const q = (destSearchQuery || '').toLowerCase().trim()
    if (!q) return CITIES_WITH_SPOTS
    return CITIES_WITH_SPOTS.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.spots.some((s) => s.toLowerCase().includes(q))
    )
  }, [destSearchQuery])

  // Handle outside clicks for dropdowns
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

  // Build Transit Label
  const getTransitLabel = () => {
    if (transitCategory === 'bus') {
      const b = BUS_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      return `Bus: ${b?.name || 'Luxury AC Sleeper'}`
    } else if (transitCategory === 'train') {
      const t = TRAIN_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      return `Train: ${t?.name || '3rd AC Comfort'}`
    } else {
      const f = FLIGHT_OPTIONS.find((i) => i.id === selectedTransitSubOption)
      return `Flight: ${f?.name || 'Economy'}`
    }
  }

  // Handle Step 1 -> Step 2
  const handleProceedToStep2 = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      sessionStorage.setItem(
        'custom_trip_draft',
        JSON.stringify({
          departure,
          destination,
          adults,
          approxDuration,
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

  // Handle Step 2 -> Step 3
  const handleProceedToPayment = (e) => {
    e.preventDefault()
    if (!travelersList[0]?.fullName?.trim() || !contactData.phone || !contactData.email) {
      alert('Please fill in Traveler 1 Full Name, Phone, and Email address.')
      return
    }
    setCurrentStep(3)
  }

  // Submit Zero-Deposit VIP Hold
  const handleConfirmZeroDeposit = () => {
    const transitLabel = getTransitLabel()
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
      .catch(() => {
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

  // Launch Official Razorpay Modal
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

  // Handle successful payment from Razorpay modal
  const handleRazorpayModalSuccess = (paymentResult) => {
    const transitLabel = getTransitLabel()
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
      .catch(() => {
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
      className={`relative bg-[#071A16] text-white overflow-hidden select-none ${
        isCustomTripRoute ? 'pt-24 sm:pt-32 pb-16 min-h-screen' : 'py-14 sm:py-20'
      }`}
    >
      <AnimatedBackgroundCompass />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#12382E]/45 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#6FCF45]/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* Left Column: Cost Sidebar & Journey Preview */}
          <TripCostSidebar
            distanceKm={distanceKm}
            departure={departure}
            destination={destination}
            adults={adults}
            transitCategory={transitCategory}
            grandTotal={grandTotal}
          />

          {/* Right Column: 3-Step Wizard */}
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
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            currentStep === st.num
                              ? 'bg-[#6FCF45] text-[#071A16] ring-2 ring-[#6FCF45]/40'
                              : currentStep > st.num
                                ? 'bg-[#10B981] text-white'
                                : 'bg-white/10 text-[#A8B5AF]'
                          }`}
                        >
                          {currentStep > st.num ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                        </div>
                        <span
                          className={`text-xs font-bold hidden sm:inline ${
                            currentStep === st.num ? 'text-white' : 'text-[#A8B5AF]'
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
                {currentStep === 1 && (
                  <StepRouteTransit
                    departure={departure}
                    setDeparture={setDeparture}
                    depSearchQuery={depSearchQuery}
                    setDepSearchQuery={setDepSearchQuery}
                    depSuggestions={depSuggestions}
                    depLoading={depLoading}
                    depDropdownOpen={depDropdownOpen}
                    setDepDropdownOpen={setDepDropdownOpen}
                    depRef={depRef}
                    handleDetectCurrentLocation={handleDetectCurrentLocation}
                    locatingUser={locatingUser}
                    locatingError={locatingError}
                    destination={destination}
                    setDestination={setDestination}
                    destSearchQuery={destSearchQuery}
                    setDestSearchQuery={setDestSearchQuery}
                    destDropdownOpen={destDropdownOpen}
                    setDestDropdownOpen={setDestDropdownOpen}
                    destRef={destRef}
                    filteredCitySpots={filteredCitySpots}
                    distanceKm={distanceKm}
                    isBusEligible={isBusEligible}
                    transitCategory={transitCategory}
                    setTransitCategory={setTransitCategory}
                    selectedTransitSubOption={selectedTransitSubOption}
                    setSelectedTransitSubOption={setSelectedTransitSubOption}
                    adults={adults}
                    setAdults={setAdults}
                    approxDuration={approxDuration}
                    setApproxDuration={setApproxDuration}
                    onSubmit={handleProceedToStep2}
                  />
                )}

                {currentStep === 2 && (
                  <StepTravelerDetails
                    adults={adults}
                    travelersList={travelersList}
                    setTravelersList={setTravelersList}
                    contactData={contactData}
                    setContactData={setContactData}
                    onBack={() => setCurrentStep(1)}
                    onSubmit={handleProceedToPayment}
                  />
                )}

                {currentStep === 3 && (
                  <StepPaymentConfirmation
                    grandTotal={grandTotal}
                    adults={adults}
                    approxBasePerPerson={approxBasePerPerson}
                    transitCategory={transitCategory}
                    transitFarePerPerson={transitFarePerPerson}
                    gstTax={gstTax}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    paymentNotice={paymentNotice}
                    setPaymentNotice={setPaymentNotice}
                    submitting={submitting}
                    onBack={() => setCurrentStep(2)}
                    onConfirmZeroDeposit={handleConfirmZeroDeposit}
                    onLaunchRazorpay={handleLaunchOfficialRazorpay}
                  />
                )}

                {currentStep === 4 && submitSuccess && (
                  <TripSuccessScreen
                    submitSuccess={submitSuccess}
                    contactData={contactData}
                    cleanPhone={cleanPhone}
                    onReset={() => {
                      setCurrentStep(1)
                      setSubmitSuccess(null)
                    }}
                  />
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
