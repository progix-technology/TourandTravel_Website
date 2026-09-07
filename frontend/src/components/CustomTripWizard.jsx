import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Sliders,
  Compass,
  Headphones,
  CheckCircle2,
  Calendar,
  Users,
  DollarSign,
  Send,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Check,
  MapPin,
  Globe,
  Palmtree,
  Mountain,
  Plane,
  Train,
  Bus,
  Car,
  Navigation,
  Info,
  Loader2,
  Plus,
  Trash2,
  Clock,
  Heart,
  ShieldCheck,
  Utensils,
  Accessibility,
  CheckSquare,
  Square,
  Phone,
  Mail,
  User,
  ArrowRight,
  Sparkle,
} from 'lucide-react'
import Button from '../components/Button'
import { customTripService } from '../services/customTripService'
import { DESTINATIONS, TOURS } from '../utils/mockData'
import { searchGlobalLocations, extractCountry } from '../services/locationService'

const STEPS = [
  { id: 1, label: 'Destination', num: '01' },
  { id: 2, label: 'Journey', num: '02' },
  { id: 3, label: 'Preferences', num: '03' },
  { id: 4, label: 'Contact', num: '04' },
]

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
]

export const CustomTrip = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  // Structured Master Form State
  const [formData, setFormData] = useState({
    // Step 1: Destinations & Dates
    departure: {
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      country: 'India',
      display: 'Lucknow, Uttar Pradesh, India',
    },
    destinations: [
      {
        id: 'dest-1',
        city: 'Coorg',
        state: 'Karnataka',
        country: 'India',
        display: 'Coorg, Karnataka, India',
      },
    ],
    travelDates: {
      departure: '',
      returnDate: '',
      flexible: false,
      flexibility: '± 2 days', // '± 2 days' | '± 1 week'
    },
    approxDuration: '6–8 Days', // '3–5 Days' | '6–8 Days' | '9–14 Days' | '2+ Weeks'

    // Step 2: Journey & Travellers
    travellers: {
      adults: 2,
      children: 0,
      infants: 0,
      childAges: [],
    },
    transport: 'Flight', // 'Flight' | 'Train' | 'Bus' | 'Car'
    carDriveType: 'Chauffeur Driven', // 'Chauffeur Driven' | 'Self Drive'
    tripPace: 'Balanced', // 'Relaxed' | 'Balanced' | 'Explore More'
    tripPurpose: 'Leisure',

    // Step 3: Stay, Experiences & Budget
    tripTier: 'Luxury', // 'Essential' | 'Premium' | 'Luxury' | 'Ultra-Luxury' | 'Private Chauffeur'
    accommodation: ['Luxury Resort', '5-Star Hotel'],
    experiences: ['Culture & Heritage', 'Nature', 'Wellness & Spa'],
    travelStyles: ['Luxury & Spa'],
    budget: {
      type: 'Per Person', // 'Per Person' | 'Total Trip Budget'
      range: '₹1L – ₹2L',
      currency: 'INR', // 'INR' | 'USD' | 'EUR' | 'GBP'
      includesFlights: 'Yes', // 'Yes' | 'No' | 'Not Sure'
    },
    foodPreferences: ['Vegetarian'],
    dietaryNotes: '',
    accessibility: [],
    specialRequests: '',

    // Step 4: Contact & Consent
    contact: {
      fullName: '',
      countryCode: '+91',
      phone: '',
      email: '',
      preferredMethod: 'WhatsApp', // 'WhatsApp' | 'Phone Call' | 'Email'
      preferredTime: 'Anytime', // 'Morning' | 'Afternoon' | 'Evening' | 'Anytime'
    },
    consent: false,
  })

  // Live Location Search States
  const [depSearch, setDepSearch] = useState('Lucknow, Uttar Pradesh, India')
  const [depSuggestions, setDepSuggestions] = useState([])
  const [depLoading, setDepLoading] = useState(false)
  const [depDropdownOpen, setDepDropdownOpen] = useState(false)
  const depRef = useRef(null)

  // Destination Search States per index
  const [destSearchQuery, setDestSearchQuery] = useState('')
  const [destSuggestions, setDestSuggestions] = useState([])
  const [destLoading, setDestLoading] = useState(false)
  const [activeDestIndex, setActiveDestIndex] = useState(null)
  const destDropdownRef = useRef(null)

  // Validation Errors
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [enquiryId, setEnquiryId] = useState('')

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (depRef.current && !depRef.current.contains(e.target)) {
        setDepDropdownOpen(false)
      }
      if (destDropdownRef.current && !destDropdownRef.current.contains(e.target)) {
        setActiveDestIndex(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live Geocoding API for Departure Location
  useEffect(() => {
    let active = true
    if (!depDropdownOpen) return

    setDepLoading(true)
    const timeout = setTimeout(async () => {
      const results = await searchGlobalLocations(depSearch)
      if (active) {
        setDepSuggestions(results)
        setDepLoading(false)
      }
    }, 280)
    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [depSearch, depDropdownOpen])

  // Live Geocoding API for Active Destination Search
  useEffect(() => {
    let active = true
    if (activeDestIndex === null) return

    setDestLoading(true)
    const timeout = setTimeout(async () => {
      const results = await searchGlobalLocations(destSearchQuery)
      if (active) {
        setDestSuggestions(results)
        setDestLoading(false)
      }
    }, 280)
    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [destSearchQuery, activeDestIndex])

  // Calculate Nights & Days dynamically if dates selected
  const durationText = useMemo(() => {
    if (formData.travelDates.departure && formData.travelDates.returnDate) {
      const d1 = new Date(formData.travelDates.departure)
      const d2 = new Date(formData.travelDates.returnDate)
      const diffTime = d2 - d1
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 0) {
        return `${diffDays} Nights / ${diffDays + 1} Days`
      }
    }
    return formData.approxDuration || '6–8 Days'
  }, [formData.travelDates.departure, formData.travelDates.returnDate, formData.approxDuration])

  // Cross-Border detection (if any destination is overseas from departure country)
  const isInternationalRoute = useMemo(() => {
    const depCountry = (formData.departure.country || extractCountry(formData.departure.display)).toLowerCase().trim()
    return formData.destinations.some((d) => {
      const destCountry = (d.country || extractCountry(d.display)).toLowerCase().trim()
      if (depCountry === 'india') {
        const domesticKeywords = ['india', 'kashmir', 'rajasthan', 'kerala', 'goa', 'ladakh', 'himachal', 'manali', 'andaman', 'varanasi', 'coorg', 'hampi', 'ranthambore', 'meghalaya', 'sikkim', 'rishikesh', 'agra']
        return !domesticKeywords.some((k) => destCountry.includes(k) || d.display.toLowerCase().includes(k))
      }
      return destCountry !== depCountry
    })
  }, [formData.departure, formData.destinations])

  // Enforce Flight if international route
  useEffect(() => {
    if (isInternationalRoute && formData.transport !== 'Flight') {
      setFormData((prev) => ({ ...prev, transport: 'Flight' }))
    }
  }, [isInternationalRoute])

  // Add / Remove Destinations
  const handleAddDestination = () => {
    if (formData.destinations.length >= 6) return
    const newId = `dest-${Date.now()}`
    setFormData((prev) => ({
      ...prev,
      destinations: [
        ...prev.destinations,
        {
          id: newId,
          city: '',
          state: '',
          country: '',
          display: '',
        },
      ],
    }))
    setActiveDestIndex(formData.destinations.length)
    setDestSearchQuery('')
  }

  const handleRemoveDestination = (index) => {
    if (formData.destinations.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }))
    if (activeDestIndex === index) {
      setActiveDestIndex(null)
    }
  }

  const handleSelectDestination = (index, item) => {
    // Prevent duplicate destination
    const isDup = formData.destinations.some((d, i) => i !== index && d.display.toLowerCase() === item.display.toLowerCase())
    if (isDup) {
      setErrors((prev) => ({ ...prev, destination: `"${item.name}" is already in your route itinerary.` }))
      return
    }
    setErrors((prev) => {
      const copy = { ...prev }
      delete copy.destination
      return copy
    })

    const updated = [...formData.destinations]
    updated[index] = {
      id: updated[index]?.id || `dest-${Date.now()}`,
      city: item.name,
      state: item.state || '',
      country: item.country || '',
      display: item.display,
    }
    setFormData((prev) => ({ ...prev, destinations: updated }))
    setActiveDestIndex(null)
    setDestSearchQuery('')
  }

  // Adults/Children counter handlers
  const handleAdultsChange = (val) => {
    const next = Math.max(1, Math.min(20, val))
    setFormData((prev) => ({
      ...prev,
      travellers: { ...prev.travellers, adults: next },
    }))
  }

  const handleChildrenChange = (val) => {
    const next = Math.max(0, Math.min(10, val))
    setFormData((prev) => {
      let ages = [...prev.travellers.childAges]
      if (next > ages.length) {
        while (ages.length < next) ages.push(8)
      } else if (next < ages.length) {
        ages = ages.slice(0, next)
      }
      return {
        ...prev,
        travellers: { ...prev.travellers, children: next, childAges: ages },
      }
    })
  }

  const handleInfantsChange = (val) => {
    const next = Math.max(0, Math.min(5, val))
    setFormData((prev) => ({
      ...prev,
      travellers: { ...prev.travellers, infants: next },
    }))
  }

  const handleChildAgeChange = (index, age) => {
    const updated = [...formData.travellers.childAges]
    updated[index] = Number(age)
    setFormData((prev) => ({
      ...prev,
      travellers: { ...prev.travellers, childAges: updated },
    }))
  }

  // Toggle multi-select items
  const toggleArrayItem = (field, value) => {
    setFormData((prev) => {
      const list = prev[field] || []
      if (list.includes(value)) {
        if (list.length === 1 && (field === 'accommodation' || field === 'travelStyles')) return prev // keep at least 1
        return { ...prev, [field]: list.filter((i) => i !== value) }
      }
      return { ...prev, [field]: [...list, value] }
    })
  }

  // Step Validation
  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.departure.display.trim()) {
        newErrors.departure = 'Please enter your starting departure city.'
      }
      const validDestinations = formData.destinations.filter((d) => d.display.trim().length > 0)
      if (validDestinations.length === 0) {
        newErrors.destination = 'Please select at least one destination for your trip.'
      }
      if (formData.travelDates.departure && formData.travelDates.returnDate) {
        if (new Date(formData.travelDates.returnDate) <= new Date(formData.travelDates.departure)) {
          newErrors.dates = 'Return date must be after departure date.'
        }
      }
    }

    if (step === 2) {
      if (formData.travellers.adults < 1) {
        newErrors.adults = 'At least 1 adult explorer is required.'
      }
    }

    if (step === 4) {
      if (!formData.contact.fullName.trim() || formData.contact.fullName.trim().length < 3) {
        newErrors.fullName = 'Please enter your full name (minimum 3 characters).'
      }
      const phoneClean = formData.contact.phone.replace(/[\s-]/g, '')
      if (!phoneClean || phoneClean.length < 7) {
        newErrors.phone = 'Please enter a valid phone number.'
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.contact.email.trim() || !emailRegex.test(formData.contact.email.trim())) {
        newErrors.email = 'Please enter a valid email address.'
      }
      if (!formData.consent) {
        newErrors.consent = 'Please check the consent box to receive your customized itinerary.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setErrors({})
      setCurrentStep((prev) => Math.min(4, prev + 1))
    }
  }

  const handlePrevStep = () => {
    setErrors({})
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  // Final Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep(4)) return

    setIsSubmitting(true)
    setSubmitError('')

    const generatedId = `TRP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`

    const payload = {
      enquiryId: generatedId,
      createdAt: new Date().toISOString(),
      ...formData,
      durationSummary: durationText,
    }

    try {
      await customTripService.submitRequest(payload)
      setEnquiryId(generatedId)
      setIsSubmitting(false)
      setSubmitted(true)
    } catch (err) {
      setIsSubmitting(false)
      setSubmitError(err.message || 'Something went wrong while submitting. Please try again.')
    }
  }

  return (
    <section id="custom-trip" className="bg-[#071A16] text-white pt-2 sm:pt-4 lg:pt-6 pb-8 sm:pb-12 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#12382E]/45 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6FCF45]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Context & Dynamic Journey Preview (Span 5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-4">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#6FCF45] font-heading flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5 fill-[#6FCF45]" />
                CUSTOMIZE YOUR DREAM JOURNEY
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1 tracking-tight font-heading leading-tight">
                Experience Travel <br />
                <span className="text-[#6FCF45]">Your Way.</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#A8B5AF] leading-relaxed">
                Skip rigid pre-made schedules. Our luxury journey architects craft every day around your personal passions, pace, and comfort.
              </p>
            </div>

            {/* Live Journey Summary Preview Card */}
            <div className="bg-[#0B241E]/90 border border-[#6FCF45]/25 rounded-[12px] p-3.5 sm:p-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6FCF45] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Live Route Preview
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#12382E] text-[#6FCF45] border border-[#6FCF45]/30 font-semibold">
                  {formData.tripTier}
                </span>
              </div>

              {/* Connected Visual Route */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#6FCF45] ring-2 ring-[#6FCF45]/30 shrink-0" />
                  <span className="text-[#A8B5AF] text-[11px]">From:</span>
                  <span className="font-semibold text-white truncate">{formData.departure.city || 'Starting Point'}</span>
                </div>

                {formData.destinations.map((d, i) => (
                  <div key={d.id || i} className="flex items-center gap-2 pl-1">
                    <span className="text-[#6FCF45] font-mono text-[11px] leading-none shrink-0">↓</span>
                    <span className="text-[#A8B5AF] text-[11px]">Dest {i + 1}:</span>
                    <span className="font-semibold text-white truncate">{d.city || d.display || `Destination ${i + 1}`}</span>
                  </div>
                ))}
              </div>

              {/* Metadata Badges */}
              <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-[#071A16] rounded-md p-1 border border-white/5">
                  <div className="text-[#A8B5AF]">Duration</div>
                  <div className="font-bold text-white mt-0.5 truncate">{durationText}</div>
                </div>
                <div className="bg-[#071A16] rounded-md p-1 border border-white/5">
                  <div className="text-[#A8B5AF]">Travellers</div>
                  <div className="font-bold text-white mt-0.5 truncate">
                    {formData.travellers.adults}A {formData.travellers.children > 0 ? `· ${formData.travellers.children}C` : ''}
                  </div>
                </div>
                <div className="bg-[#071A16] rounded-md p-1 border border-white/5">
                  <div className="text-[#A8B5AF]">Transit</div>
                  <div className="font-bold text-[#6FCF45] mt-0.5 truncate">{formData.transport}</div>
                </div>
              </div>
            </div>

            {/* 4 Core Pillars */}
            <div className="space-y-2.5 pt-1 hidden sm:block">
              {[
                { icon: Sparkles, title: 'Personalized Itinerary', desc: '100% custom-tailored day-by-day experiences designed by local regional experts.' },
                { icon: Sliders, title: 'Flexible Budget & Stays', desc: 'Handpicked 5-star villas, heritage castles, or luxury resorts tailored to your scope.' },
                { icon: Compass, title: 'Handpicked Experiences', desc: 'Private helicopter charters, after-hours museum entries, and secluded dinners.' },
                { icon: Headphones, title: '24/7 Dedicated Support', desc: 'Continuous real-time concierge backing from departure until your safe return.' },
              ].map((b, idx) => {
                const Icon = b.icon
                return (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-[6px] bg-[#12382E] border border-[#6FCF45]/30 flex items-center justify-center text-[#6FCF45] shrink-0 mt-0.5">
                      <Icon className="w-3 h-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-heading">{b.title}</h4>
                      <p className="text-[10.5px] text-[#A8B5AF] leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Multi-Step Custom Form Card (Span 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0B241E] text-white rounded-[14px] p-4 sm:p-5 md:p-6 shadow-2xl border border-white/15 relative">
              
              {/* If Already Submitted -> Show Success Screen */}
              {submitted ? (
                <div className="py-8 sm:py-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#12382E] border-2 border-[#6FCF45] flex items-center justify-center text-[#6FCF45] mb-4 shadow-lg shadow-[#6FCF45]/20 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6FCF45]">
                    ENQUIRY CONFIRMED
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
                    Your Journey Has Begun
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A8B5AF] max-w-md mt-2 leading-relaxed">
                    We've received your customized travel request. Our regional travel specialist has begun architecting your custom itinerary.
                  </p>

                  {/* Enquiry Reference ID Card */}
                  <div className="my-6 w-full max-w-md bg-[#071A16] border border-[#6FCF45]/40 rounded-xl p-4 text-left shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#A8B5AF]">Enquiry Reference ID</div>
                        <div className="text-sm sm:text-base font-extrabold text-[#6FCF45] font-mono">{enquiryId}</div>
                      </div>
                      <span className="text-[10px] bg-[#6FCF45]/15 text-[#6FCF45] px-2 py-1 rounded font-bold border border-[#6FCF45]/30">
                        IN REVIEW
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <span className="text-[#A8B5AF] text-[11px]">Route:</span>
                        <div className="font-semibold text-white truncate">
                          {formData.departure.city} → {formData.destinations.map((d) => d.city || d.display).join(' → ')}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#A8B5AF] text-[11px]">Duration:</span>
                        <div className="font-semibold text-white truncate">{durationText}</div>
                      </div>
                      <div>
                        <span className="text-[#A8B5AF] text-[11px]">Party:</span>
                        <div className="font-semibold text-white">
                          {formData.travellers.adults} Adults {formData.travellers.children > 0 ? `· ${formData.travellers.children} Children` : ''}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#A8B5AF] text-[11px]">Budget:</span>
                        <div className="font-semibold text-white">{formData.budget.range} ({formData.budget.type})</div>
                      </div>
                    </div>
                  </div>

                  {/* 3-Step Next Timeline */}
                  <div className="w-full max-w-md bg-[#12382E]/40 rounded-xl p-4 border border-white/10 mb-6 text-left space-y-3">
                    <div className="text-[10.5px] font-bold text-[#6FCF45] uppercase tracking-wider mb-1">
                      What Happens Next?
                    </div>
                    {[
                      { step: '01', title: 'Request Received', desc: 'Your preferences are logged into our VIP planning desk.' },
                      { step: '02', title: 'Specialist Curates Itinerary', desc: 'We verify luxury villas, private transit & exclusive slots.' },
                      { step: '03', title: 'Personalized Quote & Itinerary', desc: `We will contact you via ${formData.contact.preferredMethod} (${formData.contact.preferredTime}).` },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#071A16] border border-[#6FCF45]/50 flex items-center justify-center text-[10px] font-bold text-[#6FCF45] shrink-0 mt-0.5">
                          {item.step}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">{item.title}</div>
                          <div className="text-[11px] text-[#A8B5AF]">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                    <Button
                      onClick={() => {
                        setSubmitted(false)
                        setCurrentStep(1)
                      }}
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs h-[40px]"
                    >
                      Plan Another Journey
                    </Button>
                    <Button
                      onClick={() => navigate('/tours')}
                      variant="primary"
                      size="sm"
                      className="w-full text-xs h-[40px]"
                    >
                      Explore Signature Tours
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step Progress Indicator Header */}
                  <div className="border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6FCF45]">
                        STEP {currentStep} OF 4
                      </span>
                      <span className="text-xs font-semibold text-[#A8B5AF]">
                        {STEPS[currentStep - 1].label}
                      </span>
                    </div>

                    {/* Progress Bar & Pills */}
                    <div className="grid grid-cols-4 gap-2">
                      {STEPS.map((s) => {
                        const isDone = currentStep > s.id
                        const isCurrent = currentStep === s.id
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              if (s.id < currentStep || validateStep(currentStep)) {
                                setCurrentStep(s.id)
                              }
                            }}
                            className={`flex flex-col text-left transition-all group ${
                              isDone ? 'cursor-pointer' : isCurrent ? 'cursor-default' : 'cursor-not-allowed opacity-60'
                            }`}
                          >
                            <div
                              className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                                isDone || isCurrent
                                  ? 'bg-[#6FCF45]'
                                  : 'bg-white/15'
                              }`}
                            />
                            <div className="mt-1 flex items-center gap-1">
                              <span
                                className={`text-[10px] font-mono font-bold ${
                                  isCurrent ? 'text-[#6FCF45]' : isDone ? 'text-white' : 'text-[#A8B5AF]'
                                }`}
                              >
                                {s.num}
                              </span>
                              <span
                                className={`text-[10px] hidden sm:inline truncate font-semibold ${
                                  isCurrent ? 'text-white font-bold' : isDone ? 'text-white/80' : 'text-[#A8B5AF]'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Form Container */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* ========================================================================= */}
                    {/* STEP 01: DESTINATION & DATES */}
                    {/* ========================================================================= */}
                    {currentStep === 1 && (
                      <div className="space-y-5 animate-fadeIn">
                        <div>
                          <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                            Where Will Your Journey Begin?
                          </h3>
                          <p className="text-xs text-[#A8B5AF] mt-1">
                            Tell us where you're starting, where you'd like to go, and when you'd like to travel.
                          </p>
                        </div>

                        {/* Departure Location */}
                        <div className="relative" ref={depRef}>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Navigation className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Departure Location (From) *</span>
                            </span>
                            <span className="text-[9px] text-[#6FCF45] font-normal">Live Global Search</span>
                          </label>
                          
                          <div className="relative">
                            <input
                              type="text"
                              value={depSearch}
                              onFocus={() => setDepDropdownOpen(true)}
                              onChange={(e) => {
                                setDepSearch(e.target.value)
                                setDepDropdownOpen(true)
                                setFormData((prev) => ({
                                  ...prev,
                                  departure: {
                                    ...prev.departure,
                                    city: e.target.value,
                                    display: e.target.value,
                                    country: extractCountry(e.target.value),
                                  },
                                }))
                              }}
                              placeholder="Type starting city or airport (e.g. Lucknow, Delhi, London)..."
                              className={`w-full bg-[#071A16] border rounded-[8px] pl-9 pr-9 py-2.5 text-xs text-white placeholder:text-[#A8B5AF]/50 focus:outline-none transition-colors ${
                                errors.departure ? 'border-red-500' : 'border-white/20 hover:border-[#6FCF45]/60 focus:border-[#6FCF45]'
                              }`}
                            />
                            <Search className="w-4 h-4 text-[#A8B5AF] absolute left-3 top-1/2 -translate-y-1/2" />
                            {depLoading ? (
                              <Loader2 className="w-4 h-4 text-[#6FCF45] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                            ) : (
                              <Globe className="w-4 h-4 text-[#A8B5AF] absolute right-3 top-1/2 -translate-y-1/2" />
                            )}
                          </div>
                          {errors.departure && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.departure}</p>
                          )}

                          {/* Departure Suggestion Dropdown */}
                          {depDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#071A16] border border-[#6FCF45]/40 rounded-[10px] shadow-2xl z-50 overflow-hidden max-h-56 overflow-y-auto divide-y divide-white/5 py-1">
                              <div className="px-3 py-1 text-[10px] font-bold text-[#6FCF45] uppercase tracking-wider bg-[#12382E]/50 flex items-center justify-between">
                                <span>🌍 Popular &amp; Global Hubs</span>
                                {depLoading && <span className="text-[9px] font-normal animate-pulse text-[#A8B5AF]">Searching...</span>}
                              </div>
                              {depSuggestions.map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      departure: {
                                        city: item.name,
                                        state: item.state || '',
                                        country: item.country || extractCountry(item.display),
                                        display: item.display,
                                      },
                                    }))
                                    setDepSearch(item.display)
                                    setDepDropdownOpen(false)
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#12382E] transition-colors text-white"
                                >
                                  <div className="truncate pr-2">
                                    <div className="font-semibold text-white truncate">{item.display}</div>
                                    {item.country && <div className="text-[10px] text-[#A8B5AF]">{item.country}</div>}
                                  </div>
                                  <Check className={`w-3.5 h-3.5 text-[#6FCF45] shrink-0 ${formData.departure.display === item.display ? 'opacity-100' : 'opacity-0'}`} />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Multi-Destination Selector with Connected Visual Itinerary */}
                        <div className="space-y-3" ref={destDropdownRef}>
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Target Destinations (Add Multiple) *</span>
                            </label>
                            <span className="text-[10px] text-[#6FCF45]">
                              {formData.destinations.length} {formData.destinations.length === 1 ? 'Destination' : 'Destinations'}
                            </span>
                          </div>

                          {/* Destination Inputs List */}
                          <div className="space-y-2.5">
                            {formData.destinations.map((dest, idx) => (
                              <div key={dest.id || idx} className="flex items-center gap-2 relative">
                                <div className="w-6 h-6 rounded-full bg-[#12382E] border border-[#6FCF45]/40 flex items-center justify-center text-[10px] font-bold text-[#6FCF45] shrink-0">
                                  {idx + 1}
                                </div>
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    value={activeDestIndex === idx ? destSearchQuery : dest.display}
                                    onFocus={() => {
                                      setActiveDestIndex(idx)
                                      setDestSearchQuery(dest.display || '')
                                    }}
                                    onChange={(e) => {
                                      setDestSearchQuery(e.target.value)
                                      setActiveDestIndex(idx)
                                    }}
                                    placeholder={idx === 0 ? 'e.g. Coorg, Karnataka, India' : `Add destination ${idx + 1}...`}
                                    className="w-full bg-[#071A16] border border-white/20 hover:border-[#6FCF45]/60 rounded-[8px] pl-8 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                                  />
                                  <MapPin className="w-3.5 h-3.5 text-[#A8B5AF] absolute left-2.5 top-1/2 -translate-y-1/2" />
                                </div>

                                {formData.destinations.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDestination(idx)}
                                    className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
                                    title="Remove this destination"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Add Another Destination Button */}
                          {formData.destinations.length < 6 && (
                            <button
                              type="button"
                              onClick={handleAddDestination}
                              className="mt-1 text-xs text-[#6FCF45] hover:text-[#8AE863] flex items-center gap-1.5 font-bold px-2.5 py-1.5 rounded-lg bg-[#12382E]/50 border border-[#6FCF45]/30 hover:border-[#6FCF45] transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add another destination</span>
                            </button>
                          )}

                          {errors.destination && (
                            <p className="text-[11px] text-red-400">{errors.destination}</p>
                          )}

                          {/* Destination Autocomplete Popover */}
                          {activeDestIndex !== null && (
                            <div className="bg-[#071A16] border border-[#6FCF45]/40 rounded-[10px] shadow-2xl z-50 overflow-hidden max-h-56 overflow-y-auto divide-y divide-white/5 py-1 mt-1">
                              <div className="px-3 py-1 text-[10px] font-bold text-[#6FCF45] uppercase tracking-wider bg-[#12382E]/50 flex items-center justify-between">
                                <span>🗺️ Select from Curated Sanctuaries</span>
                                {destLoading && <span className="text-[9px] font-normal animate-pulse text-[#A8B5AF]">Searching...</span>}
                              </div>

                              {/* Search results from API or mock platforms */}
                              {destSuggestions.map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSelectDestination(activeDestIndex, item)}
                                  className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#12382E] transition-colors text-white"
                                >
                                  <div className="truncate pr-2">
                                    <div className="font-semibold text-white">{item.name} <span className="text-[#A8B5AF] text-[10px]">({item.country})</span></div>
                                    <div className="text-[10px] text-[#A8B5AF] truncate">{item.display}</div>
                                  </div>
                                  <Check className="w-3.5 h-3.5 text-[#6FCF45] opacity-0 hover:opacity-100" />
                                </button>
                              ))}

                              {/* Platform Quick Suggestions */}
                              {destSuggestions.length === 0 && (
                                <div className="p-2 space-y-1">
                                  <div className="text-[10px] text-[#A8B5AF] px-2 py-1">Top Platform Destinations:</div>
                                  {DESTINATIONS.slice(0, 5).map((d) => (
                                    <button
                                      key={d.id}
                                      type="button"
                                      onClick={() => handleSelectDestination(activeDestIndex, { name: d.name, country: d.country, display: `${d.name}, ${d.country}` })}
                                      className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-[#12382E] rounded flex items-center justify-between"
                                    >
                                      <span>{d.name} ({d.country})</span>
                                      <span className="text-[10px] text-[#6FCF45]">Select</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Travel Dates & Duration */}
                        <div className="border-t border-white/10 pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Travel Dates &amp; Flexibility</span>
                            </label>
                            <span className="text-xs font-bold text-[#6FCF45] bg-[#12382E] px-2 py-0.5 rounded border border-[#6FCF45]/30">
                              {durationText}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className="block text-[10px] text-[#A8B5AF] mb-1">Departure Date</span>
                              <input
                                type="date"
                                value={formData.travelDates.departure}
                                onChange={(e) => setFormData((prev) => ({
                                  ...prev,
                                  travelDates: { ...prev.travelDates, departure: e.target.value }
                                }))}
                                className="w-full bg-[#071A16] border border-white/20 rounded-[8px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                              />
                            </div>
                            <div>
                              <span className="block text-[10px] text-[#A8B5AF] mb-1">Return Date</span>
                              <input
                                type="date"
                                value={formData.travelDates.returnDate}
                                onChange={(e) => setFormData((prev) => ({
                                  ...prev,
                                  travelDates: { ...prev.travelDates, returnDate: e.target.value }
                                }))}
                                className="w-full bg-[#071A16] border border-white/20 rounded-[8px] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6FCF45]"
                              />
                            </div>
                          </div>

                          {errors.dates && <p className="text-[11px] text-red-400">{errors.dates}</p>}

                          {/* Flexible Dates Toggle */}
                          <div className="bg-[#071A16] rounded-lg p-3 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.travelDates.flexible}
                                onChange={(e) => setFormData((prev) => ({
                                  ...prev,
                                  travelDates: { ...prev.travelDates, flexible: e.target.checked }
                                }))}
                                className="w-4 h-4 accent-[#6FCF45] rounded"
                              />
                              <span className="text-xs text-white font-medium">My dates are flexible</span>
                            </label>

                            {formData.travelDates.flexible && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-[#A8B5AF]">Flexible by:</span>
                                {['± 2 days', '± 1 week'].map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({
                                      ...prev,
                                      travelDates: { ...prev.travelDates, flexibility: opt }
                                    }))}
                                    className={`px-2 py-0.5 text-[10px] font-bold rounded border transition-colors ${
                                      formData.travelDates.flexibility === opt
                                        ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45]'
                                        : 'bg-[#12382E] text-white border-white/15'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Duration presets fallback if exact dates not selected */}
                          {(!formData.travelDates.departure || !formData.travelDates.returnDate) && (
                            <div>
                              <span className="block text-[10px] text-[#A8B5AF] mb-1.5">Approximate Duration:</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {['3–5 Days', '6–8 Days', '9–14 Days', '2+ Weeks'].map((dur) => (
                                  <button
                                    key={dur}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, approxDuration: dur }))}
                                    className={`py-1.5 text-xs font-semibold rounded-md border text-center transition-all ${
                                      formData.approxDuration === dur
                                        ? 'bg-[#12382E] text-white border-[#6FCF45] ring-1 ring-[#6FCF45]'
                                        : 'bg-[#071A16] text-[#A8B5AF] border-white/10 hover:border-white/30'
                                    }`}
                                  >
                                    {dur}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ========================================================================= */}
                    {/* STEP 02: YOUR JOURNEY (TRAVELLERS, PACE, TRANSIT, OCCASION) */}
                    {/* ========================================================================= */}
                    {currentStep === 2 && (
                      <div className="space-y-5 animate-fadeIn">
                        <div>
                          <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                            How Would You Like To Travel?
                          </h3>
                          <p className="text-xs text-[#A8B5AF] mt-1">
                            Configure your party size, preferred transit modes, travel pace, and trip purpose.
                          </p>
                        </div>

                        {/* Travellers Selector Counter */}
                        <div className="bg-[#071A16] border border-white/15 rounded-xl p-4 space-y-3.5">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Travellers</span>
                            </label>
                            <span className="text-xs font-bold text-[#6FCF45]">
                              {formData.travellers.adults} Adults
                              {formData.travellers.children > 0 ? ` · ${formData.travellers.children} Children` : ''}
                              {formData.travellers.infants > 0 ? ` · ${formData.travellers.infants} Infants` : ''}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Adults */}
                            <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                              <div>
                                <div className="text-xs font-bold text-white">Adults</div>
                                <div className="text-[10px] text-[#A8B5AF]">Age 12+ years</div>
                              </div>
                              <div className="flex items-center gap-2.5 mt-1">
                                <button
                                  type="button"
                                  onClick={() => handleAdultsChange(formData.travellers.adults - 1)}
                                  className="w-7 h-7 rounded-md bg-[#12382E] border border-white/20 text-white font-bold hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors"
                                >
                                  -
                                </button>
                                <span className="w-5 text-center font-bold text-sm">{formData.travellers.adults}</span>
                                <button
                                  type="button"
                                  onClick={() => handleAdultsChange(formData.travellers.adults + 1)}
                                  className="w-7 h-7 rounded-md bg-[#12382E] border border-white/20 text-white font-bold hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                              <div>
                                <div className="text-xs font-bold text-white">Children</div>
                                <div className="text-[10px] text-[#A8B5AF]">Age 2–11 years</div>
                              </div>
                              <div className="flex items-center gap-2.5 mt-1">
                                <button
                                  type="button"
                                  onClick={() => handleChildrenChange(formData.travellers.children - 1)}
                                  className="w-7 h-7 rounded-md bg-[#12382E] border border-white/20 text-white font-bold hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors"
                                >
                                  -
                                </button>
                                <span className="w-5 text-center font-bold text-sm">{formData.travellers.children}</span>
                                <button
                                  type="button"
                                  onClick={() => handleChildrenChange(formData.travellers.children + 1)}
                                  className="w-7 h-7 rounded-md bg-[#12382E] border border-white/20 text-white font-bold hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Infants */}
                            <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                              <div>
                                <div className="text-xs font-bold text-white">Infants</div>
                                <div className="text-[10px] text-[#A8B5AF]">Under 2 years</div>
                              </div>
                              <div className="flex items-center gap-2.5 mt-1">
                                <button
                                  type="button"
                                  onClick={() => handleInfantsChange(formData.travellers.infants - 1)}
                                  className="w-7 h-7 rounded-md bg-[#12382E] border border-white/20 text-white font-bold hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors"
                                >
                                  -
                                </button>
                                <span className="w-5 text-center font-bold text-sm">{formData.travellers.infants}</span>
                                <button
                                  type="button"
                                  onClick={() => handleInfantsChange(formData.travellers.infants + 1)}
                                  className="w-7 h-7 rounded-md bg-[#12382E] border border-white/20 text-white font-bold hover:bg-[#6FCF45] hover:text-[#071A16] transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Child Ages Inputs */}
                          {formData.travellers.children > 0 && (
                            <div className="pt-3 border-t border-white/10">
                              <span className="text-[11px] text-[#A8B5AF] block mb-2">Specify Children Ages:</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {formData.travellers.childAges.map((age, idx) => (
                                  <div key={idx} className="bg-[#0B241E] p-2 rounded border border-white/10 text-xs">
                                    <span className="text-[10px] text-[#A8B5AF] block mb-1">Child {idx + 1} Age:</span>
                                    <select
                                      value={age}
                                      onChange={(e) => handleChildAgeChange(idx, e.target.value)}
                                      className="w-full bg-[#071A16] border border-white/20 rounded px-2 py-1 text-xs text-white"
                                    >
                                      {[...Array(11)].map((_, a) => (
                                        <option key={a + 1} value={a + 1}>
                                          {a + 1} {a === 0 ? 'year' : 'years'}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Preferred Mode of Travel with Real-Time Constraints */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF]">
                              Preferred Mode of Travel
                            </label>
                            {isInternationalRoute && (
                              <span className="text-[10px] text-[#6FCF45] bg-[#6FCF45]/15 border border-[#6FCF45]/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                                <Plane className="w-3 h-3" />
                                <span>Flight Required (Overseas Journey)</span>
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {[
                              { id: 'Flight', label: 'Flight / Air', desc: 'Fastest Luxury', icon: Plane, disabled: false },
                              { id: 'Train', label: 'Train Express', desc: isInternationalRoute ? 'Domestic Only' : 'Scenic Heritage', icon: Train, disabled: isInternationalRoute },
                              { id: 'Bus', label: 'AC Sleeper Bus', desc: isInternationalRoute ? 'Domestic Only' : 'Highway Coach', icon: Bus, disabled: isInternationalRoute },
                              { id: 'Car', label: 'Private Car', desc: isInternationalRoute ? 'Domestic Only' : 'AC Road Trip', icon: Car, disabled: isInternationalRoute },
                            ].map((mode) => {
                              const Icon = mode.icon
                              const isSelected = formData.transport === mode.id
                              return (
                                <button
                                  key={mode.id}
                                  type="button"
                                  disabled={mode.disabled}
                                  onClick={() => !mode.disabled && setFormData((prev) => ({ ...prev, transport: mode.id }))}
                                  className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                                    mode.disabled
                                      ? 'opacity-40 cursor-not-allowed bg-[#071A16]/50 border-white/5 text-white/30'
                                      : isSelected
                                      ? 'bg-[#12382E] border-[#6FCF45] text-white shadow-lg shadow-[#6FCF45]/10 ring-1 ring-[#6FCF45]'
                                      : 'bg-[#071A16] border-white/15 text-[#A8B5AF] hover:border-white/30 hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#6FCF45]' : 'text-[#A8B5AF]'}`} />
                                    {isSelected && !mode.disabled && <Check className="w-3.5 h-3.5 text-[#6FCF45]" />}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-white">{mode.label}</div>
                                    <div className="text-[10px] text-[#A8B5AF] mt-0.5">{mode.desc}</div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>

                          {/* If Car Selected -> Show Chauffeur vs Self-Drive Toggle */}
                          {formData.transport === 'Car' && !isInternationalRoute && (
                            <div className="mt-2.5 bg-[#071A16] p-2.5 rounded-lg border border-white/10 flex items-center justify-between text-xs">
                              <span className="text-[#A8B5AF] text-[11px]">Car Preference:</span>
                              <div className="flex gap-2">
                                {['Chauffeur Driven', 'Self Drive'].map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, carDriveType: opt }))}
                                    className={`px-3 py-1 rounded-md text-xs font-bold border transition-colors ${
                                      formData.carDriveType === opt
                                        ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45]'
                                        : 'bg-[#12382E] text-white border-white/15'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Trip Pace (Relaxed, Balanced, Explore More) */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-2">
                            Trip Pace
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {[
                              { id: 'Relaxed', title: 'Relaxed', desc: 'More downtime & fewer hotel transfers.' },
                              { id: 'Balanced', title: 'Balanced (Default)', desc: 'Perfect mix of exploring & relaxing.' },
                              { id: 'Explore More', title: 'Explore More', desc: 'See as many sights as possible.' },
                            ].map((pace) => {
                              const isSelected = formData.tripPace === pace.id || (pace.id === 'Balanced' && formData.tripPace === 'Balanced')
                              return (
                                <button
                                  key={pace.id}
                                  type="button"
                                  onClick={() => setFormData((prev) => ({ ...prev, tripPace: pace.id }))}
                                  className={`p-3 rounded-xl border text-left transition-all ${
                                    isSelected
                                      ? 'bg-[#12382E] border-[#6FCF45] ring-1 ring-[#6FCF45]'
                                      : 'bg-[#071A16] border-white/15 hover:border-white/30'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white">{pace.title}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#6FCF45]" />}
                                  </div>
                                  <p className="text-[10px] text-[#A8B5AF] mt-1">{pace.desc}</p>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Trip Purpose / Occasion */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-2">
                            What's the Occasion?
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              'Leisure',
                              'Honeymoon',
                              'Anniversary',
                              'Birthday',
                              'Family Vacation',
                              'Friends Trip',
                              'Solo Travel',
                              'Corporate Trip',
                              'Adventure',
                              'Other',
                            ].map((occ) => (
                              <button
                                key={occ}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, tripPurpose: occ }))}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                  formData.tripPurpose === occ
                                    ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45] font-bold shadow-md shadow-[#6FCF45]/15'
                                    : 'bg-[#071A16] text-[#A8B5AF] border-white/15 hover:text-white hover:border-white/30'
                                }`}
                              >
                                {occ}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========================================================================= */}
                    {/* STEP 03: STAY, EXPERIENCES & BUDGET */}
                    {/* ========================================================================= */}
                    {currentStep === 3 && (
                      <div className="space-y-5 animate-fadeIn">
                        <div>
                          <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                            Make It Uniquely Yours
                          </h3>
                          <p className="text-xs text-[#A8B5AF] mt-1">
                            Choose accommodation tiers, dream experiences, travel styles, and investment scope.
                          </p>
                        </div>

                        {/* Trip Tier */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-2">
                            Trip Privacy &amp; Tier
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {[
                              { id: 'Essential', label: 'Essential', desc: 'Standard Comfort' },
                              { id: 'Premium', label: 'Premium', desc: '4-Star Curated' },
                              { id: 'Luxury', label: 'Luxury', desc: '5-Star Resorts' },
                              { id: 'Ultra-Luxury', label: 'Ultra-Luxury', desc: 'Private Palaces' },
                              { id: 'Private Chauffeur', label: 'Chauffeur VIP', desc: '100% Dedicated' },
                            ].map((tier) => (
                              <button
                                key={tier.id}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, tripTier: tier.id }))}
                                className={`p-2.5 rounded-lg border text-center transition-all ${
                                  formData.tripTier === tier.id
                                    ? 'bg-[#12382E] border-[#6FCF45] ring-1 ring-[#6FCF45]'
                                    : 'bg-[#071A16] border-white/15 hover:border-white/30'
                                }`}
                              >
                                <div className="text-xs font-bold text-white">{tier.label}</div>
                                <div className="text-[9px] text-[#A8B5AF] mt-0.5">{tier.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Accommodation Preference (Multi-select) */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-2">
                            Accommodation Preference (Select Multiple)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              '3-Star Hotel',
                              '4-Star Hotel',
                              '5-Star Hotel',
                              'Luxury Resort',
                              'Boutique Hotel',
                              'Heritage Stay',
                              'Private Villa',
                              'Luxury Glamping',
                            ].map((acc) => {
                              const isSelected = formData.accommodation.includes(acc)
                              return (
                                <button
                                  key={acc}
                                  type="button"
                                  onClick={() => toggleArrayItem('accommodation', acc)}
                                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
                                    isSelected
                                      ? 'bg-[#12382E] border-[#6FCF45] text-white font-bold'
                                      : 'bg-[#071A16] border-white/15 text-[#A8B5AF] hover:text-white'
                                  }`}
                                >
                                  <Check className={`w-3 h-3 text-[#6FCF45] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                  <span>{acc}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Travel Experiences (Multi-select Chips) */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-2">
                            What Would You Love to Experience?
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              'Beaches',
                              'Mountains',
                              'Nature',
                              'Wildlife',
                              'Adventure',
                              'Trekking',
                              'Culture & Heritage',
                              'Food & Cuisine',
                              'Shopping',
                              'Photography',
                              'Wellness & Spa',
                              'Nightlife',
                              'Cruises',
                              'Romantic Experiences',
                            ].map((exp) => {
                              const isSelected = formData.experiences.includes(exp)
                              return (
                                <button
                                  key={exp}
                                  type="button"
                                  onClick={() => toggleArrayItem('experiences', exp)}
                                  className={`px-2.5 py-1 text-[11.5px] rounded-full border transition-all flex items-center gap-1 ${
                                    isSelected
                                      ? 'bg-[#6FCF45]/15 border-[#6FCF45] text-[#6FCF45] font-bold'
                                      : 'bg-[#071A16] border-white/15 text-[#A8B5AF] hover:border-white/30'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-[#6FCF45]" />}
                                  <span>{exp}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Budget & Currency */}
                        <div className="bg-[#071A16] border border-white/15 rounded-xl p-4 space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Budget &amp; Investment</span>
                            </label>

                            {/* Currency & Type Selector */}
                            <div className="flex items-center gap-2">
                              {/* Currency */}
                              <select
                                value={formData.budget.currency}
                                onChange={(e) => setFormData((prev) => ({
                                  ...prev,
                                  budget: { ...prev.budget, currency: e.target.value }
                                }))}
                                className="bg-[#0B241E] border border-white/20 text-[#6FCF45] font-bold rounded px-2 py-1 text-xs"
                              >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                              </select>

                              {/* Budget Scope */}
                              <div className="flex bg-[#0B241E] rounded p-0.5 border border-white/15 text-xs">
                                {['Per Person', 'Total Trip Budget'].map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({
                                      ...prev,
                                      budget: { ...prev.budget, type: t }
                                    }))}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      formData.budget.type === t ? 'bg-[#6FCF45] text-[#071A16]' : 'text-[#A8B5AF]'
                                    }`}
                                  >
                                    {t === 'Per Person' ? 'Per Person' : 'Total'}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Budget Range Chips */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {['Under ₹25K', '₹25K – ₹50K', '₹50K – ₹1L', '₹1L – ₹2L', '₹2L+'].map((range) => (
                              <button
                                key={range}
                                type="button"
                                onClick={() => setFormData((prev) => ({
                                  ...prev,
                                  budget: { ...prev.budget, range }
                                }))}
                                className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all ${
                                  formData.budget.range === range
                                    ? 'bg-[#12382E] border-[#6FCF45] text-white ring-1 ring-[#6FCF45]'
                                    : 'bg-[#0B241E] border-white/10 text-[#A8B5AF] hover:border-white/30'
                                }`}
                              >
                                {range}
                              </button>
                            ))}
                          </div>

                          {/* Includes Flights Question */}
                          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <span className="text-[#A8B5AF]">Does your budget include international / domestic flights?</span>
                            <div className="flex gap-1.5">
                              {['Yes', 'No', 'Not Sure'].map((ans) => (
                                <button
                                  key={ans}
                                  type="button"
                                  onClick={() => setFormData((prev) => ({
                                    ...prev,
                                    budget: { ...prev.budget, includesFlights: ans }
                                  }))}
                                  className={`px-2.5 py-1 text-xs font-bold rounded border transition-colors ${
                                    formData.budget.includesFlights === ans
                                      ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45]'
                                      : 'bg-[#0B241E] text-[#A8B5AF] border-white/15'
                                  }`}
                                >
                                  {ans}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Dietary & Accessibility Optional Preferences */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1.5 flex items-center gap-1.5">
                              <Utensils className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Food Preferences (Optional)</span>
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {['No Preference', 'Vegetarian', 'Vegan', 'Jain', 'Halal'].map((food) => {
                                const isSelected = formData.foodPreferences.includes(food)
                                return (
                                  <button
                                    key={food}
                                    type="button"
                                    onClick={() => toggleArrayItem('foodPreferences', food)}
                                    className={`px-2.5 py-1 text-[11px] rounded border transition-all ${
                                      isSelected
                                        ? 'bg-[#12382E] border-[#6FCF45] text-white font-bold'
                                        : 'bg-[#071A16] border-white/10 text-[#A8B5AF]'
                                    }`}
                                  >
                                    {food}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1.5 flex items-center gap-1.5">
                              <Accessibility className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Accessibility (Optional)</span>
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {['Senior Friendly', 'Child Friendly', 'Wheelchair Assistance', 'Pet Friendly'].map((acc) => {
                                const isSelected = formData.accessibility.includes(acc)
                                return (
                                  <button
                                    key={acc}
                                    type="button"
                                    onClick={() => toggleArrayItem('accessibility', acc)}
                                    className={`px-2.5 py-1 text-[11px] rounded border transition-all ${
                                      isSelected
                                        ? 'bg-[#12382E] border-[#6FCF45] text-white font-bold'
                                        : 'bg-[#071A16] border-white/10 text-[#A8B5AF]'
                                    }`}
                                  >
                                    {acc}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Special Requests */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1">
                            Special Requests / Aspirations (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={formData.specialRequests}
                            onChange={(e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                            placeholder="e.g. Private candlelit cliff dinner, honeymoon room decoration, specific resort preference, photography guides..."
                            className="w-full bg-[#071A16] border border-white/15 rounded-[8px] px-3.5 py-2 text-xs text-white placeholder:text-[#A8B5AF]/50 focus:outline-none focus:border-[#6FCF45]"
                          />
                        </div>
                      </div>
                    )}

                    {/* ========================================================================= */}
                    {/* STEP 04: CONTACT DETAILS & COMPACT FINAL REVIEW */}
                    {/* ========================================================================= */}
                    {currentStep === 4 && (
                      <div className="space-y-5 animate-fadeIn">
                        <div>
                          <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                            How Can We Reach You?
                          </h3>
                          <p className="text-xs text-[#A8B5AF] mt-1">
                            Your dedicated travel specialist will review your request and get back to you with a personalized quotation and itinerary.
                          </p>
                        </div>

                        {/* Contact Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Full Name */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1 flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Full Name *</span>
                            </label>
                            <input
                              type="text"
                              value={formData.contact.fullName}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                contact: { ...prev.contact, fullName: e.target.value }
                              }))}
                              placeholder="e.g. Rahul Sharma"
                              className={`w-full bg-[#071A16] border rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#A8B5AF]/50 focus:outline-none ${
                                errors.fullName ? 'border-red-500' : 'border-white/20 focus:border-[#6FCF45]'
                              }`}
                            />
                            {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                          </div>

                          {/* Email Address */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1 flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-[#6FCF45]" />
                              <span>Email Address *</span>
                            </label>
                            <input
                              type="email"
                              value={formData.contact.email}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                contact: { ...prev.contact, email: e.target.value }
                              }))}
                              placeholder="rahul@example.com"
                              className={`w-full bg-[#071A16] border rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#A8B5AF]/50 focus:outline-none ${
                                errors.email ? 'border-red-500' : 'border-white/20 focus:border-[#6FCF45]'
                              }`}
                            />
                            {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                          </div>
                        </div>

                        {/* Mobile Number with Country Code */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#6FCF45]" />
                            <span>Mobile Number / WhatsApp *</span>
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={formData.contact.countryCode}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                contact: { ...prev.contact, countryCode: e.target.value }
                              }))}
                              className="bg-[#071A16] border border-white/20 text-[#6FCF45] font-bold rounded-[8px] px-2.5 py-2.5 text-xs focus:outline-none focus:border-[#6FCF45]"
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.code} value={c.code} className="bg-[#071A16] text-white">
                                  {c.flag} {c.code} ({c.country})
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              value={formData.contact.phone}
                              onChange={(e) => setFormData((prev) => ({
                                ...prev,
                                contact: { ...prev.contact, phone: e.target.value }
                              }))}
                              placeholder="98765 43210"
                              className={`w-full bg-[#071A16] border rounded-[8px] px-3.5 py-2.5 text-xs text-white placeholder:text-[#A8B5AF]/50 focus:outline-none ${
                                errors.phone ? 'border-red-500' : 'border-white/20 focus:border-[#6FCF45]'
                              }`}
                            />
                          </div>
                          {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Preferred Contact Method & Timing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1.5">
                              Preferred Contact Channel
                            </span>
                            <div className="flex gap-2">
                              {['WhatsApp', 'Phone Call', 'Email'].map((method) => (
                                <button
                                  key={method}
                                  type="button"
                                  onClick={() => setFormData((prev) => ({
                                    ...prev,
                                    contact: { ...prev.contact, preferredMethod: method }
                                  }))}
                                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                    formData.contact.preferredMethod === method
                                      ? 'bg-[#6FCF45] text-[#071A16] border-[#6FCF45]'
                                      : 'bg-[#071A16] text-[#A8B5AF] border-white/15'
                                  }`}
                                >
                                  {method}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#A8B5AF] mb-1.5">
                              Preferred Contact Time
                            </span>
                            <div className="grid grid-cols-4 gap-1.5">
                              {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => setFormData((prev) => ({
                                    ...prev,
                                    contact: { ...prev.contact, preferredTime: time }
                                  }))}
                                  className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all text-center ${
                                    formData.contact.preferredTime === time
                                      ? 'bg-[#12382E] border-[#6FCF45] text-white'
                                      : 'bg-[#071A16] text-[#A8B5AF] border-white/15'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* COMPACT FINAL REVIEW ACCORDION */}
                        <div className="bg-[#071A16] border border-[#6FCF45]/30 rounded-xl p-4 text-xs space-y-2.5">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="font-bold text-[#6FCF45] uppercase tracking-wider text-[11px]">
                              Review Your Journey
                            </span>
                            <span className="text-[10px] text-[#A8B5AF]">Quick Check</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11.5px]">
                            <div>
                              <span className="text-[#A8B5AF] text-[10px] block">From:</span>
                              <div className="font-semibold text-white truncate flex items-center justify-between pr-2">
                                <span>{formData.departure.city || formData.departure.display}</span>
                                <button type="button" onClick={() => setCurrentStep(1)} className="text-[9px] text-[#6FCF45] hover:underline">Edit</button>
                              </div>
                            </div>
                            <div>
                              <span className="text-[#A8B5AF] text-[10px] block">Destinations:</span>
                              <div className="font-semibold text-white truncate flex items-center justify-between pr-2">
                                <span>{formData.destinations.map((d) => d.city || d.display).join(' → ')}</span>
                                <button type="button" onClick={() => setCurrentStep(1)} className="text-[9px] text-[#6FCF45] hover:underline">Edit</button>
                              </div>
                            </div>
                            <div>
                              <span className="text-[#A8B5AF] text-[10px] block">Dates &amp; Duration:</span>
                              <div className="font-semibold text-white truncate flex items-center justify-between pr-2">
                                <span>{durationText}</span>
                                <button type="button" onClick={() => setCurrentStep(1)} className="text-[9px] text-[#6FCF45] hover:underline">Edit</button>
                              </div>
                            </div>
                            <div>
                              <span className="text-[#A8B5AF] text-[10px] block">Party:</span>
                              <div className="font-semibold text-white truncate flex items-center justify-between pr-2">
                                <span>{formData.travellers.adults}A {formData.travellers.children > 0 ? `· ${formData.travellers.children}C` : ''}</span>
                                <button type="button" onClick={() => setCurrentStep(2)} className="text-[9px] text-[#6FCF45] hover:underline">Edit</button>
                              </div>
                            </div>
                            <div>
                              <span className="text-[#A8B5AF] text-[10px] block">Transit &amp; Pace:</span>
                              <div className="font-semibold text-white truncate flex items-center justify-between pr-2">
                                <span>{formData.transport} ({formData.tripPace})</span>
                                <button type="button" onClick={() => setCurrentStep(2)} className="text-[9px] text-[#6FCF45] hover:underline">Edit</button>
                              </div>
                            </div>
                            <div>
                              <span className="text-[#A8B5AF] text-[10px] block">Budget &amp; Tier:</span>
                              <div className="font-semibold text-[#6FCF45] truncate flex items-center justify-between pr-2">
                                <span>{formData.budget.range} · {formData.tripTier}</span>
                                <button type="button" onClick={() => setCurrentStep(3)} className="text-[9px] text-[#6FCF45] hover:underline">Edit</button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Consent Checkbox */}
                        <div className="space-y-1">
                          <label className="flex items-start gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.consent}
                              onChange={(e) => setFormData((prev) => ({ ...prev, consent: e.target.checked }))}
                              className="w-4 h-4 mt-0.5 accent-[#6FCF45] rounded"
                            />
                            <span className="text-xs text-[#A8B5AF] leading-relaxed">
                              I agree to be contacted regarding my travel enquiry and itinerary planning.
                            </span>
                          </label>
                          {errors.consent && <p className="text-[11px] text-red-400 pl-6">{errors.consent}</p>}
                          <p className="text-[10px] text-[#A8B5AF]/60 pl-6">
                            🔒 Your personal details are protected and used strictly to architect your personalized journey.
                          </p>
                        </div>

                        {submitError && (
                          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                            {submitError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step Controls (Back & Continue / Submit) */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="px-4 py-2.5 rounded-lg border border-white/20 hover:border-white/40 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      {currentStep < 4 ? (
                        <Button
                          type="button"
                          onClick={handleNextStep}
                          variant="primary"
                          size="md"
                          className="text-xs px-6 h-[42px] whitespace-nowrap shrink-0"
                        >
                          <span>Continue</span>
                          <ChevronRight className="w-4 h-4 shrink-0" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          disabled={isSubmitting}
                          className="text-xs px-8 h-[44px] shadow-lg shadow-[#6FCF45]/20 font-extrabold flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#071A16]" />
                              <span>BUILDING YOUR REQUEST...</span>
                            </>
                          ) : (
                            <>
                              <span>BUILD MY CUSTOM TRIP</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {currentStep === 4 && (
                      <div className="text-center space-y-0.5">
                        <p className="text-[10.5px] text-[#A8B5AF]">
                          Your request takes less than a minute to submit.
                        </p>
                        <p className="text-[10px] text-[#A8B5AF]/70">
                          We'll review your preferences and contact you with a personalized itinerary.
                        </p>
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomTrip
