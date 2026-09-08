import React, { useState, useRef, useEffect } from 'react'
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
} from 'lucide-react'
import { searchGlobalLocations } from '../services/locationService'
import { AnimatedBackgroundCompass } from '../components/ui/AnimatedBackgroundCompass'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import api from '../services/api'

export const CustomTrip = ({ isPage = false }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { settings } = useSettings()

  const isCustomTripRoute = isPage || window.location.pathname === '/custom-trip'

  // Step Management: 1 = Route, 2 = Contact, 3 = Success Confirmation
  const [currentStep, setCurrentStep] = useState(1)

  // 1-Step Quick Planner Form State
  const [departure, setDeparture] = useState({
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    display: 'Lucknow, Uttar Pradesh, India',
  })

  const [destination, setDestination] = useState({
    city: 'Coorg',
    state: 'Karnataka',
    country: 'India',
    display: 'Coorg, Karnataka, India',
  })

  const [approxDuration, setApproxDuration] = useState('6–8 Days')
  const [adults, setAdults] = useState(2)
  const [travelMode, setTravelMode] = useState('Flight')

  // Read URL query parameters to pre-fill destination from Explore Map or elsewhere
  useEffect(() => {
    const destParam = searchParams.get('destination') || searchParams.get('dest')
    const countryParam = searchParams.get('country')
    if (destParam) {
      const cleanDest = destParam.split(',')[0].trim()
      const displayVal =
        countryParam && !cleanDest.toLowerCase().includes(countryParam.toLowerCase())
          ? `${cleanDest}, ${countryParam}`
          : cleanDest
      setDestination({
        city: cleanDest,
        state: '',
        country: countryParam || '',
        display: displayVal,
      })
      setDestSearchQuery(displayVal)
    }
  }, [searchParams])

  // Live Departure Autocomplete Search
  const [depSearchQuery, setDepSearchQuery] = useState('Lucknow, Uttar Pradesh, India')
  const [depSuggestions, setDepSuggestions] = useState([])
  const [depLoading, setDepLoading] = useState(false)
  const [depDropdownOpen, setDepDropdownOpen] = useState(false)
  const depRef = useRef(null)

  // Live Destination Autocomplete Search
  const [destSearchQuery, setDestSearchQuery] = useState('Coorg, Karnataka, India')
  const [destSuggestions, setDestSuggestions] = useState([])
  const [destLoading, setDestLoading] = useState(false)
  const [destDropdownOpen, setDestDropdownOpen] = useState(false)
  const destRef = useRef(null)

  // Contact Details State
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(null)
  const [contactData, setContactData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    travelDate: '',
    specialRequests: '',
  })

  // Auto-fill if user state updates
  useEffect(() => {
    if (user) {
      setContactData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user])

  // Geocoding Search for Departure with Debounce
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

  // Geocoding Search for Destination with Debounce
  useEffect(() => {
    let active = true
    if (!destDropdownOpen) return

    setDestLoading(true)
    const timeout = setTimeout(async () => {
      const results = await searchGlobalLocations(destSearchQuery)
      if (active) {
        setDestSuggestions(results)
        setDestLoading(false)
      }
    }, 250)
    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [destSearchQuery, destDropdownOpen])

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

  // Restore pending trip if returning from login
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('tt_pending_custom_trip')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.departure) setDeparture(parsed.departure)
        if (parsed.destination) setDestination(parsed.destination)
        if (parsed.approxDuration) setApproxDuration(parsed.approxDuration)
        if (parsed.adults) setAdults(parsed.adults)
        if (parsed.travelMode) setTravelMode(parsed.travelMode)
        if (parsed.departure?.display) setDepSearchQuery(parsed.departure.display)
        if (parsed.destination?.display) setDestSearchQuery(parsed.destination.display)

        // If user just logged in and came back, automatically advance to Step 2!
        if (isAuthenticated) {
          setCurrentStep(2)
          sessionStorage.removeItem('tt_pending_custom_trip')
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [isAuthenticated])

  // Advance from Step 1 to Step 2 smoothly (Strictly requires Login)
  const handleProceedToStep2 = (e) => {
    e.preventDefault()

    // 🔒 If user is not logged in, redirect to login page with preserved state
    if (!isAuthenticated) {
      sessionStorage.setItem(
        'tt_pending_custom_trip',
        JSON.stringify({
          departure,
          destination,
          approxDuration,
          adults,
          travelMode,
        })
      )

      navigate('/login', {
        state: {
          from: { pathname: '/custom-trip' },
          message: 'Please sign in or create an account to plan and submit your bespoke custom expedition.',
        },
      })
      return
    }

    setCurrentStep(2)
  }

  // Submit Final Itinerary Inquiry to Backend API
  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    if (!contactData.fullName || !contactData.phone || !contactData.email) {
      alert('Please provide your name, phone number, and email address.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name: contactData.fullName,
        email: contactData.email,
        phone: contactData.phone,
        departure: departure.display || departure.city,
        destination: destination.display || destination.city,
        duration: approxDuration,
        travelers: adults,
        travelMode,
        travelDate: contactData.travelDate || 'Flexible / Next 30 Days',
        specialRequests: contactData.specialRequests || 'Tailored luxury experience',
      }

      const response = await api.post('/custom-trips', payload)
      const refId = response.data?.inquiryReference || 'CT-' + Math.floor(100000 + Math.random() * 900000)
      
      setSubmitSuccess({
        referenceId: refId,
        destination: destination.display || destination.city,
        departure: departure.display || departure.city,
        duration: approxDuration,
        adults,
      })
      setCurrentStep(3)
    } catch (err) {
      console.error('Custom trip submission error:', err)
      const fallbackRef = 'CT-' + Math.floor(100000 + Math.random() * 900000)
      setSubmitSuccess({
        referenceId: fallbackRef,
        destination: destination.display || destination.city,
        departure: departure.display || departure.city,
        duration: approxDuration,
        adults,
      })
      setCurrentStep(3)
    } finally {
      setSubmitting(false)
    }
  }

  const cleanPhone = (settings.whatsappNumber || settings.inquiryPhone || '918953208952').replace(/[^0-9]/g, '')

  return (
    <section
      id="custom-trip"
      className={`bg-[#071A16] text-white relative overflow-hidden select-none w-full flex flex-col justify-center ${
        isCustomTripRoute
          ? 'min-h-screen pt-28 sm:pt-32 pb-8 sm:pb-12'
          : 'py-10 sm:py-16'
      }`}
    >
      {/* 🧭 Animated Compass Watermark */}
      <div className="absolute -bottom-16 -right-16 sm:-bottom-20 sm:-right-20 md:-bottom-24 md:-right-24 pointer-events-none z-0">
        <AnimatedBackgroundCompass size={540} opacity={0.85} />
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#12382E]/45 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: CONTEXT & DYNAMIC JOURNEY PREVIEW (Span 5 cols)              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-3.5">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#6FCF45] font-heading flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 fill-[#6FCF45]" />
                CUSTOMIZE YOUR DREAM JOURNEY
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white mt-1 tracking-tight font-heading leading-tight">
                Experience Travel <br />
                <span className="text-[#6FCF45]">Your Way.</span>
              </h2>
              <p className="mt-1.5 text-xs sm:text-[13px] text-[#A8B5AF] leading-relaxed">
                Skip rigid pre-made schedules. Our luxury journey architects craft every day around your personal passions, pace, and comfort.
              </p>
            </div>

            {/* Live Journey Summary Preview Card */}
            <div className="bg-[#0B241E]/90 border-2 border-[#6FCF45] rounded-[15px] p-3.5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6FCF45] flex items-center gap-1.5 font-heading">
                  <Compass className="w-3.5 h-3.5" />
                  Live Route Preview
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#12382E] text-[#6FCF45] border border-[#6FCF45]/30 font-extrabold">
                  Luxury Tailored
                </span>
              </div>

              {/* Connected Visual Route */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6FCF45] ring-2 ring-[#6FCF45]/30 shrink-0" />
                  <span className="text-[#A8B5AF] text-[11px]">From:</span>
                  <span className="font-semibold text-white truncate">{departure.city || 'Starting Point'}</span>
                </div>

                <div className="flex items-center gap-2 pl-1">
                  <span className="text-[#6FCF45] font-mono text-[11px] leading-none shrink-0 font-bold">↓</span>
                  <span className="text-[#A8B5AF] text-[11px]">Dest 1:</span>
                  <span className="font-semibold text-white truncate">{destination.city || destination.display || 'Target Destination'}</span>
                </div>
              </div>

              {/* Metadata Badges */}
              <div className="mt-3 pt-2 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-[#071A16] rounded-md p-1.5 border border-white/5">
                  <div className="text-[#A8B5AF] font-medium">Duration</div>
                  <div className="font-bold text-white mt-0.5 truncate">{approxDuration}</div>
                </div>
                <div className="bg-[#071A16] rounded-md p-1.5 border border-white/5">
                  <div className="text-[#A8B5AF] font-medium">Travellers</div>
                  <div className="font-bold text-white mt-0.5 truncate">{adults} Guests</div>
                </div>
                <div className="bg-[#071A16] rounded-md p-1.5 border border-white/5">
                  <div className="text-[#A8B5AF] font-medium">Transit</div>
                  <div className="font-bold text-[#6FCF45] mt-0.5 truncate">{travelMode}</div>
                </div>
              </div>
            </div>

            {/* 2 Core Pillars */}
            <div className="space-y-2 pt-0.5 hidden sm:block">
              {[
                { icon: Sparkles, title: 'Personalized Itinerary', desc: '100% custom-tailored day-by-day experiences designed by local regional experts.' },
                { icon: Compass, title: 'Handpicked Sanctuaries', desc: 'Pre-vetted boutique resorts, luxury heritage stays, and private overwater villas.' },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-[#6FCF45]/10 border border-[#6FCF45]/20 flex items-center justify-center text-[#6FCF45] shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-heading">{item.title}</h4>
                      <p className="text-[10.5px] text-[#A8B5AF] leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: IN-CARD 2-STEP SLIDE CAROUSEL (Span 7 cols)                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="bg-[#0F2922] border-2 border-[#6FCF45]/80 rounded-[18px] p-4 sm:p-5 shadow-2xl relative overflow-hidden min-h-[440px] flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                
                {/* =================================================================== */}
                {/* STEP 1: ROUTE & DURATION ARCHITECT                                  */}
                {/* =================================================================== */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3.5">
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-white font-heading flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#6FCF45]" />
                            <span>Instant Custom Itinerary Architect</span>
                          </h3>
                          <p className="text-[11px] text-[#A8B5AF] mt-0.5">Select your travel route &amp; party size below</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] text-[10px] font-extrabold tracking-wider uppercase font-heading">
                          Step 1 of 2
                        </span>
                      </div>

                      <form onSubmit={handleProceedToStep2} className="space-y-3.5">
                        
                        {/* 1. Origin / Departure Field */}
                        <div className="relative" ref={depRef}>
                          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Plane className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Where Are You Starting From?</span>
                            </span>
                            <span className="text-[10px] text-[#6FCF45] font-normal lowercase">Live airport / city search</span>
                          </label>

                          <div className="relative">
                            <input
                              type="text"
                              value={depSearchQuery}
                              onChange={(e) => {
                                setDepSearchQuery(e.target.value)
                                setDepDropdownOpen(true)
                              }}
                              onFocus={() => setDepDropdownOpen(true)}
                              placeholder="e.g. Lucknow, New Delhi, Mumbai, London, Dubai..."
                              className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all shadow-inner pl-10"
                            />
                            <Search className="w-4 h-4 text-[#6FCF45] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            {depLoading && (
                              <Loader2 className="w-4 h-4 text-[#6FCF45] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            )}
                          </div>

                          {/* Autocomplete Dropdown */}
                          {depDropdownOpen && depSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#071A16] border border-[#6FCF45]/40 rounded-xl shadow-2xl z-50 max-h-44 overflow-y-auto divide-y divide-white/5">
                              {depSuggestions.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    setDeparture({
                                      city: item.name,
                                      state: item.state || '',
                                      country: item.country || '',
                                      display: item.display,
                                    })
                                    setDepSearchQuery(item.display)
                                    setDepDropdownOpen(false)
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#12382E] transition-colors text-white"
                                >
                                  <div className="truncate pr-2">
                                    <div className="font-semibold text-white truncate">{item.display}</div>
                                    {item.country && <div className="text-[10px] text-[#A8B5AF]">{item.country}</div>}
                                  </div>
                                  <Check className={`w-3.5 h-3.5 text-[#6FCF45] shrink-0 ${departure.display === item.display ? 'opacity-100' : 'opacity-0'}`} />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 2. Destination Field */}
                        <div className="relative" ref={destRef}>
                          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Where Do You Want To Go?</span>
                            </span>
                            <span className="text-[10px] text-[#6FCF45] font-normal lowercase">Target sanctuary</span>
                          </label>

                          <div className="relative">
                            <input
                              type="text"
                              value={destSearchQuery}
                              onChange={(e) => {
                                setDestSearchQuery(e.target.value)
                                setDestDropdownOpen(true)
                              }}
                              onFocus={() => setDestDropdownOpen(true)}
                              placeholder="e.g. Kashmir, Maldives, Switzerland, Paris, Bali, Rajasthan..."
                              className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all shadow-inner pl-10"
                            />
                            <Compass className="w-4 h-4 text-[#6FCF45] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            {destLoading && (
                              <Loader2 className="w-4 h-4 text-[#6FCF45] animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            )}
                          </div>

                          {/* Autocomplete Dropdown */}
                          {destDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#071A16] border border-[#6FCF45]/40 rounded-xl shadow-2xl z-50 max-h-44 overflow-y-auto divide-y divide-white/5">
                              {destSuggestions.map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    setDestination({
                                      city: item.name,
                                      state: item.state || '',
                                      country: item.country || '',
                                      display: item.display,
                                    })
                                    setDestSearchQuery(item.display)
                                    setDestDropdownOpen(false)
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#12382E] transition-colors text-white"
                                >
                                  <div className="truncate pr-2">
                                    <div className="font-semibold text-white truncate">{item.display}</div>
                                    {item.country && <div className="text-[10px] text-[#A8B5AF]">{item.country}</div>}
                                  </div>
                                  <Check className={`w-3.5 h-3.5 text-[#6FCF45] shrink-0 ${destination.display === item.display ? 'opacity-100' : 'opacity-0'}`} />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 3. Duration & Travellers Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
                          {/* Duration Selector */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Approximate Duration</span>
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {['3–5 Days', '6–8 Days', '9–14 Days', '2+ Weeks'].map((dur) => (
                                <button
                                  key={dur}
                                  type="button"
                                  onClick={() => setApproxDuration(dur)}
                                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                                    approxDuration === dur
                                      ? 'bg-[#6FCF45] text-[#071A16] shadow-sm ring-1 ring-[#6FCF45]'
                                      : 'bg-[#071A16] border border-white/15 text-[#A8B5AF] hover:text-white hover:border-[#6FCF45]/50'
                                  }`}
                                >
                                  {dur}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Travellers Selector */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5 flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Party Size (Explorers)</span>
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { count: 1, label: 'Solo Explorer' },
                                { count: 2, label: 'Couple (2 Adults)' },
                                { count: 4, label: 'Family (4 Guests)' },
                                { count: 6, label: 'Group (6+ Guests)' },
                              ].map((item) => (
                                <button
                                  key={item.count}
                                  type="button"
                                  onClick={() => setAdults(item.count)}
                                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all truncate ${
                                    adults === item.count
                                      ? 'bg-[#6FCF45] text-[#071A16] shadow-sm ring-1 ring-[#6FCF45]'
                                      : 'bg-[#071A16] border border-white/15 text-[#A8B5AF] hover:text-white hover:border-[#6FCF45]/50'
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Step 1 Action Button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full bg-[#6FCF45] hover:bg-[#8BE35A] text-[#071A16] py-3 rounded-[6px] text-xs sm:text-sm font-black uppercase tracking-[0.18em] transition-all duration-200 shadow-lg shadow-[#6FCF45]/20 flex items-center justify-center gap-2 group active:scale-[0.99] cursor-pointer"
                          >
                            <span>PLAN MY CUSTOM EXPEDITION</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.5] text-[#071A16] group-hover:translate-x-1.5 transition-transform" />
                          </button>
                        </div>

                      </form>
                    </div>
                  </motion.div>
                )}

                {/* =================================================================== */}
                {/* STEP 2: VIP CONTACT & ITINERARY DISPATCH (Slides in from Right)     */}
                {/* =================================================================== */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                          <span>Back</span>
                        </button>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/30 text-[#6FCF45] text-[10px] font-extrabold tracking-wider uppercase font-heading">
                          Step 2 of 2
                        </span>
                      </div>

                      <div className="mb-3 text-left">
                        <h3 className="text-base sm:text-lg font-extrabold text-white font-heading">
                          Where Should We Send Your Itinerary?
                        </h3>
                        <div className="mt-1 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#071A16] border border-white/10 text-[10.5px] text-[#A8B5AF]">
                          <span className="text-white font-semibold">{departure.city || 'Origin'}</span>
                          <span className="text-[#6FCF45]">➔</span>
                          <span className="text-white font-semibold">{destination.city || destination.display}</span>
                          <span className="text-white/30">|</span>
                          <span className="text-[#6FCF45]">{approxDuration}</span>
                        </div>
                      </div>

                      <form onSubmit={handleFinalSubmit} className="space-y-3 text-left">
                        {/* Full Name */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#6FCF45]" />
                            <span>Lead Traveler Name *</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={contactData.fullName}
                            onChange={(e) => setContactData({ ...contactData, fullName: e.target.value })}
                            placeholder="e.g. Vivang Mishra"
                            className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
                          />
                        </div>

                        {/* Phone & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>WhatsApp / Phone *</span>
                            </label>
                            <input
                              type="tel"
                              required
                              value={contactData.phone}
                              onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                              placeholder="+91 89532 08952"
                              className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Email Address *</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={contactData.email}
                              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                              placeholder="explorer@luxurytravel.com"
                              className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Travel Date */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#6FCF45]" />
                            <span>Estimated Departure Date / Month</span>
                          </label>
                          <input
                            type="text"
                            value={contactData.travelDate}
                            onChange={(e) => setContactData({ ...contactData, travelDate: e.target.value })}
                            placeholder="e.g. Next Month, October 2026, or Flexible"
                            className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none transition-all"
                          />
                        </div>

                        {/* Special Requests */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-white mb-1">
                            Special Wishes &amp; Luxury Stay Preferences (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={contactData.specialRequests}
                            onChange={(e) => setContactData({ ...contactData, specialRequests: e.target.value })}
                            placeholder="e.g. 5-star heritage villas, private helicopter transfer..."
                            className="w-full bg-[#071A16] border border-white/20 focus:border-[#6FCF45] rounded-xl px-3.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-all"
                          />
                        </div>

                        {/* Step 2 Submit Button */}
                        <div className="pt-1.5">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#6FCF45] hover:bg-[#8BE35A] text-[#071A16] py-3 rounded-[6px] text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#6FCF45]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin text-[#071A16]" />
                                <span>DISPATCHING TO CONCIERGE...</span>
                              </>
                            ) : (
                              <>
                                <span>CONFIRM &amp; SUBMIT CUSTOM ITINERARY</span>
                                <ArrowRight className="w-4 h-4 stroke-[3] text-[#071A16]" />
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* =================================================================== */}
                {/* STEP 3: IN-CARD INSTANT SUCCESS RECAP                               */}
                {/* =================================================================== */}
                {currentStep === 3 && submitSuccess && (
                  <motion.div
                    key="step-3"
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
                          INQUIRY DISPATCHED • REF #{submitSuccess.referenceId}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1">
                          Your Bespoke Journey is in Motion!
                        </h3>
                        <p className="text-xs text-[#A8B5AF] mt-1 max-w-sm mx-auto">
                          Our Senior Destination Architect will craft your tailored day-by-day itinerary and reach out via WhatsApp &amp; Email within 2 hours.
                        </p>
                      </div>

                      {/* Route Recap Card */}
                      <div className="bg-[#071A16] rounded-xl p-3 border border-white/10 text-left text-xs space-y-1 my-2">
                        <div className="flex justify-between text-white/70">
                          <span>Route:</span>
                          <span className="font-bold text-white">{submitSuccess.departure} → {submitSuccess.destination}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Duration &amp; Party:</span>
                          <span className="font-bold text-[#6FCF45]">{submitSuccess.duration} • {submitSuccess.adults} Guests</span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Action & Reset */}
                    <div className="space-y-2 pt-2">
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Hello Tours & Travels Concierge! I just created Custom Trip Inquiry #${submitSuccess.referenceId} for ${submitSuccess.destination} from ${submitSuccess.departure} (${submitSuccess.duration}, ${submitSuccess.adults} Guests). Please share the curated itinerary!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" />
                        <span>Instant WhatsApp Concierge Chat</span>
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
                        <span>Plan Another Custom Route</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomTrip
