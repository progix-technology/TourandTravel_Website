import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  Headphones,
  Plane,
  Train,
  Bus,
  Car,
  Navigation,
  Check,
  Search,
  Globe,
  Loader2,
} from 'lucide-react'
import Button from '../components/Button'
import { DESTINATIONS } from '../utils/mockData'
import { searchGlobalLocations, extractCountry } from '../services/locationService'
import { useSettings } from '../context/SettingsContext'

import phone3d from '../assets/images/3d_Images/phone.png'
import email3d from '../assets/images/3d_Images/email.png'
import location3d from '../assets/images/3d_Images/location.png'
import time3d from '../assets/images/3d_Images/time.png'
import GradientCard from '../components/ui/GradientCard'

export const ContactPage = () => {
  const { settings } = useSettings()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    departureCity: 'New Delhi, India (DEL)',
    departureCountry: 'India',
    destination: 'Kashmir',
    travelMode: 'Flight',
    travelMonth: 'September 2026',
    tripTier: 'Ultra-Luxury Private (5-Star & Palaces)',
    travelers: '2 Adults',
    budget: '₹50,000 - ₹1,00,000',
    message: '',
  })

  // Departure API live search state
  const [depSearch, setDepSearch] = useState('New Delhi, India (DEL)')
  const [depSuggestions, setDepSuggestions] = useState([])
  const [depLoading, setDepLoading] = useState(false)
  const [depDropdownOpen, setDepDropdownOpen] = useState(false)
  const depDropdownRef = useRef(null)

  // Live Geocoding API search for departure location with debounce
  useEffect(() => {
    let active = true
    if (!depDropdownOpen) return

    setDepLoading(true)
    const timeoutId = setTimeout(async () => {
      const results = await searchGlobalLocations(depSearch)
      if (active) {
        setDepSuggestions(results)
        setDepLoading(false)
      }
    }, 280)

    return () => {
      active = false
      clearTimeout(timeoutId)
    }
  }, [depSearch, depDropdownOpen])

  // Close departure dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (depDropdownRef.current && !depDropdownRef.current.contains(e.target)) {
        setDepDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Determine if chosen destination is International (Overseas) or Domestic (Inland)
  const isInternational = useMemo(() => {
    const depCountry = (formData.departureCountry || extractCountry(formData.departureCity)).toLowerCase().trim()
    const dest = (formData.destination || '').toLowerCase()
    const domesticKeywords = [
      'india',
      'kashmir',
      'rajasthan',
      'kerala',
      'goa',
      'ladakh',
      'himachal',
      'manali',
      'andaman',
      'varanasi',
      'coorg',
      'hampi',
      'ranthambore',
      'meghalaya',
      'sikkim',
      'rishikesh',
      'agra',
    ]
    const isDomestic = domesticKeywords.some((k) => dest.includes(k))
    if (depCountry === 'india') {
      return !isDomestic
    }
    return true
  }, [formData.departureCity, formData.departureCountry, formData.destination])

  // Automatically enforce Flight if user chooses international destination while on Train/Bus/Car
  useEffect(() => {
    if (isInternational && formData.travelMode !== 'Flight') {
      setFormData((prev) => ({ ...prev, travelMode: 'Flight' }))
    }
  }, [isInternational])

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <div className="bg-[#FAF8F2] min-h-screen text-[#13251F] relative overflow-hidden select-none">
      {/* 1. Ultra-Luxurious Hero Header Section (Exact Uniform Height & Padding as Tours & About) */}
      <div className="relative w-full bg-[#071A16] text-white pt-28 sm:pt-36 pb-12 sm:pb-16 min-h-[560px] sm:min-h-[590px] lg:min-h-[610px] flex flex-col justify-center px-4 sm:px-6 lg:px-12 overflow-hidden shadow-2xl border-b border-white/10 mb-10 sm:mb-12">
        {/* Full-Bleed High-Res Destination Image Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2400&q=95"
            alt="Luxury Travel Concierge"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Transparent Layered Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A16]/90 via-black/35 to-[#071A16]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A16]/85 via-[#071A16]/45 to-transparent" />
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Ambient emerald radial glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6FCF45]/15 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#12382E]/40 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Left-Aligned Constrained Content Container */}
        <div className="max-w-[1440px] w-full mx-auto relative z-10 text-left">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-2.5 mb-3 text-xs uppercase tracking-[0.25em] font-bold text-[#6FCF45] font-heading drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              <span className="w-6 h-[2px] bg-[#6FCF45]" />
              <span>24/7 PRIVATE CONCIERGE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.1] text-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Connect with Our <br />
              <span className="text-[#6FCF45]">Expedition Curators.</span>
            </h1>

            <p className="mt-3.5 text-xs sm:text-sm md:text-base text-white/90 max-w-2xl leading-relaxed font-normal text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Whether you are planning a private honeymoon in the Maldives, an alpine rail odyssey in Switzerland, or a customized Himalayan trek—our private curators are here to tailor every detail.
            </p>
          </div>

          {/* Quick Direct Actions Strip */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-4">
            <a
              href="tel:+918953208952"
              className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#6FCF45]/20 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call: +91 89532 08952</span>
            </a>
            <a
              href="https://wa.me/918953208952?text=Hello%2C%20I%20would%20like%20to%20plan%20a%20luxury%20expedition."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#25D366]/20 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Instant WhatsApp</span>
            </a>
          </div>

          {/* Concierge Support Badges Row */}
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-2">
            {[
              { label: '24/7 Global Response', icon: Clock },
              { label: 'Lucknow Lounge Visits', icon: MapPin },
              { label: '1-on-1 Master Curators', icon: Headphones },
              { label: 'Zero Booking Wait Times', icon: Sparkles },
            ].map((pill, idx) => {
              const Icon = pill.icon
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#0B241E]/80 text-[#A8B5AF] border border-white/15 backdrop-blur-md"
                >
                  <Icon className="w-3.5 h-3.5 text-[#6FCF45]" />
                  <span>{pill.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area with Crisp Green Outline Boxes */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-28 sm:pb-36">

        {/* 2. Contact Channels Grid (4 3D Pillars Style Matching About Us) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {[
            {
              badgeText: '24/7 LIVE SUPPORT',
              badgeColor: '#10B981',
              title: 'Direct Phone Concierge',
              description: '+91 89532 08952 • Priority traveler support hotline available around the clock.',
              ctaText: 'WhatsApp Concierge',
              ctaHref: 'https://wa.me/918953208952?text=Hello%2C%20I%20would%20like%20to%20plan%20a%20luxury%20expedition.',
              imageUrl: phone3d,
              gradient: 'emerald',
            },
            {
              badgeText: '2H SLA GUARANTEE',
              badgeColor: '#F59E0B',
              title: 'Email Concierge',
              description: 'info@progixtechnology.com • Expect fast bespoke itineraries & prompt replies.',
              ctaText: 'Send Email',
              ctaHref: 'mailto:info@progixtechnology.com',
              imageUrl: email3d,
              gradient: 'orange',
            },
            {
              badgeText: 'HQ LUXURY LOUNGE',
              badgeColor: '#8B5CF6',
              title: 'Office Location',
              description: 'D72, Vibhuti Khand, Gomtinagar, Lucknow, Uttar Pradesh 226010.',
              ctaText: 'Locate HQ Lounge',
              ctaHref: '#map',
              imageUrl: location3d,
              gradient: 'purple',
            },
            {
              badgeText: 'PRIVATE VISITS',
              badgeColor: '#0D9488',
              title: 'Lounge Hours',
              description: 'Mon - Sat: 9:00 AM – 8:00 PM • Private in-person luxury appointments.',
              ctaText: 'Book Appointment',
              ctaHref: '#inquiry-form',
              imageUrl: time3d,
              gradient: 'teal',
            },
          ].map((pillar, idx) => (
            <GradientCard
              key={idx}
              badgeText={pillar.badgeText}
              badgeColor={pillar.badgeColor}
              title={pillar.title}
              description={pillar.description}
              ctaText={pillar.ctaText}
              ctaHref={pillar.ctaHref}
              imageUrl={pillar.imageUrl}
              gradient={pillar.gradient}
            />
          ))}
        </div>

        {/* 3. Main Form & Interactive Map Grid with Crisp Green Outlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-24">
          {/* Left Column: Interactive Contact & Custom Trip Form with Bold Green Outline */}
          <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-10 border-2 border-[#6FCF45] shadow-[0_10px_35px_rgba(111,207,69,0.08)] relative overflow-hidden">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/40 text-xs font-extrabold uppercase tracking-wider text-[#2E4A35] font-heading">
                <Send className="w-3.5 h-3.5 text-[#2E4A35]" />
                <span>START A CONVERSATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#13251F] font-heading tracking-tight">
                Design Your <span className="text-[#2E4A35]">Custom Expedition</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#5C6E67] mt-1.5 font-normal">
                Fill in your travel preferences below and our senior curator will contact you within 2 hours with a customized itinerary proposal.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#071A16] text-white p-8 sm:p-10 rounded-2xl text-center shadow-lg border-2 border-[#6FCF45] animate-fade-in">
                <div className="w-14 h-14 bg-[#6FCF45] text-[#071A16] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#6FCF45]/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white">Inquiry Received with Pleasure!</h3>
                <p className="text-xs sm:text-sm text-[#A8B5AF] mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. Our dedicated curator has received your request for <strong className="text-[#6FCF45]">{formData.destination}</strong> and will call you shortly on <strong className="text-white">{formData.phone}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 bg-[#6FCF45] text-[#071A16] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#5eb937] transition-all shadow-md cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5">
                      Full Name <span className="text-[#4F8F45] font-extrabold">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg px-3.5 py-2.5 text-xs text-[#13251F] focus:outline-none font-medium transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5">
                      Email Address <span className="text-[#4F8F45] font-extrabold">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rahul@example.com"
                      className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg px-3.5 py-2.5 text-xs text-[#13251F] focus:outline-none font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5">
                      Phone / WhatsApp <span className="text-[#4F8F45] font-extrabold">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg px-3.5 py-2.5 text-xs text-[#13251F] focus:outline-none font-medium transition-all"
                    />
                  </div>

                  <div>
                    {/* Live Geocoding API Departing Location Search */}
                    <div className="relative" ref={depDropdownRef}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5 text-[#2E4A35]" />
                          <span>Departure Location (From)</span>
                        </span>
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
                              departureCity: e.target.value,
                              departureCountry: extractCountry(e.target.value),
                            }))
                          }}
                          placeholder="Search any City or Country (e.g. Mumbai, London)..."
                          className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg pl-8 pr-8 py-2.5 text-xs text-[#13251F] focus:outline-none font-medium transition-all"
                        />
                        <Search className="w-3.5 h-3.5 text-[#2E4A35] absolute left-2.5 top-1/2 -translate-y-1/2" />
                        {depLoading ? (
                          <Loader2 className="w-3.5 h-3.5 text-[#2E4A35] animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-[#4F8F45] absolute right-2.5 top-1/2 -translate-y-1/2" />
                        )}
                      </div>

                      {/* Live API Autocomplete Results Dropdown */}
                      {depDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border-2 border-[#6FCF45] rounded-lg shadow-2xl z-50 overflow-hidden animate-fadeIn max-h-60 overflow-y-auto divide-y divide-gray-100 py-1">
                          <div className="px-3 py-1 text-[10px] font-bold text-[#2E4A35] uppercase tracking-wider bg-emerald-50/60 flex items-center justify-between">
                            <span>🌍 Global Cities &amp; Hubs</span>
                            {depLoading && <span className="text-[9px] font-normal animate-pulse text-[#4F8F45]">Searching API...</span>}
                          </div>
                          {depSuggestions.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  departureCity: item.display,
                                  departureCountry: item.country || extractCountry(item.display),
                                }))
                                setDepSearch(item.display)
                                setDepDropdownOpen(false)
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors text-[#13251F]"
                            >
                              <div className="truncate pr-2">
                                <div className="font-semibold text-[#13251F] truncate">{item.display}</div>
                                {item.country && (
                                  <div className="text-[10px] text-gray-500">{item.country}</div>
                                )}
                              </div>
                              <Check className={`w-3.5 h-3.5 text-[#2E4A35] shrink-0 ${formData.departureCity === item.display ? 'opacity-100' : 'opacity-0'}`} />
                            </button>
                          ))}
                          {depSuggestions.length === 0 && !depLoading && (
                            <div className="px-4 py-3 text-xs text-gray-500 text-center">
                              Use custom origin: "{depSearch}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dream Destination */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2E4A35]" />
                    <span>Arriving Location (Target Destination) <span className="text-[#4F8F45] font-extrabold">*</span></span>
                  </label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg px-3.5 py-2.5 text-xs text-[#13251F] focus:outline-none font-semibold transition-all cursor-pointer"
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.country}) — {d.tagline}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Mode of Travel with Smart International Constraint */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F]">
                      Mode of Travel
                    </label>
                    {isInternational ? (
                      <span className="text-[10px] font-bold text-[#2E4A35] bg-[#6FCF45]/20 border border-[#6FCF45]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Plane className="w-3 h-3 text-[#2E4A35]" />
                        <span>Flight Required (Overseas)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#2E4A35] font-bold bg-[#6FCF45]/15 border border-[#6FCF45]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#2E4A35]" />
                        <span>All Modes Available (Domestic)</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'Flight', label: 'Flight / Air', desc: 'Fastest Luxury', icon: Plane, disabled: false },
                      { id: 'Train', label: 'Train Express', desc: isInternational ? 'Domestic Only' : 'Scenic Heritage', icon: Train, disabled: isInternational },
                      { id: 'Bus', label: 'AC Sleeper Bus', desc: isInternational ? 'Domestic Only' : 'Highway Coach', icon: Bus, disabled: isInternational },
                      { id: 'Car', label: 'Private Car', desc: isInternational ? 'Domestic Only' : 'AC Chauffeur', icon: Car, disabled: isInternational },
                    ].map((mode) => {
                      const Icon = mode.icon
                      const isSelected = formData.travelMode === mode.id
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          disabled={mode.disabled}
                          onClick={() => !mode.disabled && setFormData({ ...formData, travelMode: mode.id })}
                          className={`p-2.5 rounded-lg border-2 text-left transition-all ${mode.disabled
                              ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400'
                              : isSelected
                                ? 'bg-[#071A16] border-[#6FCF45] text-white shadow-md ring-1 ring-[#6FCF45]'
                                : 'bg-[#FAF8F2] border-[#6FCF45]/30 text-[#13251F] hover:border-[#6FCF45] hover:bg-emerald-50/40'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-[#6FCF45]' : mode.disabled ? 'text-gray-400' : 'text-[#2E4A35]'}`} />
                            {isSelected && !mode.disabled && <Check className="w-3.5 h-3.5 text-[#6FCF45]" />}
                          </div>
                          <div className="text-xs font-bold leading-tight">{mode.label}</div>
                          <div className={`text-[9.5px] ${isSelected ? 'text-[#A8B5AF]' : 'text-[#5C6E67]'}`}>{mode.desc}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5">
                      Privacy &amp; Tier
                    </label>
                    <select
                      name="tripTier"
                      value={formData.tripTier}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg px-3 py-2.5 text-xs text-[#13251F] focus:outline-none font-semibold cursor-pointer transition-all"
                    >
                      <option value="Ultra-Luxury Private">💎 Ultra-Luxury Private</option>
                      <option value="Customized Private Tour">👑 Customized Private Tour</option>
                      <option value="Semi-Private Small Group">👥 Semi-Private Group</option>
                      <option value="Public Group Tour">🚌 Public Group Tour</option>
                      <option value="Romantic Honeymoon">💍 Romantic Seclusion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5">
                      Travel Timeline
                    </label>
                    <input
                      type="text"
                      name="travelMonth"
                      value={formData.travelMonth}
                      onChange={handleChange}
                      placeholder="e.g. Oct - Nov 2026"
                      className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg px-3 py-2.5 text-xs text-[#13251F] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5">
                      Guests / Travelers
                    </label>
                    <select
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg px-3 py-2.5 text-xs text-[#13251F] focus:outline-none cursor-pointer transition-all"
                    >
                      <option value="Solo Traveler">Solo Explorer</option>
                      <option value="2 Adults">Couple / 2 Adults</option>
                      <option value="Family (3-5)">Family (3-5 Guests)</option>
                      <option value="Private Group (6+)">Private Group (6+ Guests)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5">
                      Estimated Budget
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg px-3 py-2.5 text-xs text-[#13251F] focus:outline-none cursor-pointer transition-all font-semibold"
                    >
                      <option value="₹25,000 - ₹50,000">₹25,000 – ₹50,000</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 – ₹1,00,000</option>
                      <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 – ₹2,50,000</option>
                      <option value="₹2,50,000+">₹2,50,000+ (Ultra Luxury)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13251F] mb-1.5">
                    Special Wishes &amp; Requirements
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about special occasions, dietary preferences, private charter requests, or preferred boutique hotel brands..."
                    className="w-full bg-[#FAF8F2] border-2 border-[#6FCF45]/40 focus:border-[#6FCF45] focus:bg-white focus:ring-2 focus:ring-[#6FCF45]/20 rounded-lg p-3.5 text-xs text-[#13251F] focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6FCF45] hover:bg-[#8BE35A] text-[#071A16] py-3.5 rounded-[6px] text-xs font-bold uppercase tracking-[0.18em] transition-all duration-200 shadow-lg shadow-[#6FCF45]/20 flex items-center justify-center gap-2 group active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <span>SUBMIT EXPEDITION INQUIRY</span>
                      <Send className="w-4 h-4 stroke-[2.5] text-[#071A16] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Live Location Map & Travel Lounge Details with Crisp Green Outlines */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Embedded Google Map with Crisp Green Border */}
            <div className="bg-white rounded-[24px] overflow-hidden border-2 border-[#6FCF45] shadow-[0_10px_35px_rgba(111,207,69,0.08)] relative">
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#2E4A35] font-heading">
                    <MapPin className="w-4 h-4 text-[#4F8F45]" />
                    <span>OUR OFFICE HEADQUARTERS</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6FCF45]/20 border border-[#6FCF45]/40 text-[#2E4A35] text-[10px] font-extrabold uppercase tracking-wider">
                    Open for Visits
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#13251F] font-heading mt-1">
                  {settings.officeAddress}
                </h3>
              </div>

              {/* Embedded Google Map Iframe */}
              <div className="w-full h-[280px] sm:h-[300px] relative bg-[#FAF8F2] border-y-2 border-[#6FCF45]/30">
                <iframe
                  title="Tour and Travels Head Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.873212879555!2d80.9958742!3d26.8687474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2c1fa0b5555%3A0xb35a0d5c808798e4!2sVibhuti%20Khand%2C%20Gomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh%20226010!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale contrast-125 opacity-90 hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="p-5 bg-[#FAF8F2] text-xs text-[#5C6E67] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6FCF45] shadow-[0_0_6px_#6FCF45] shrink-0" />
                  <span><strong className="text-[#2E4A35]">Concierge Hours:</strong> {settings.conciergeHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6FCF45] shadow-[0_0_6px_#6FCF45] shrink-0" />
                  <span><strong className="text-[#2E4A35]">Inquiries:</strong> {settings.inquiryPhone} ({settings.supportEmail})</span>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Concierge Card with Green Outline */}
            <div className="bg-[#071A16] text-white rounded-[22px] p-6 border-2 border-[#6FCF45] shadow-xl flex items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#6FCF45]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="text-xs uppercase tracking-widest text-[#6FCF45] font-bold font-heading">
                  INSTANT WHATSAPP CHAT
                </div>
                <div className="text-sm font-bold text-white font-heading mt-1">
                  Chat Directly with a Curator
                </div>
                <p className="text-[11px] text-[#A8B5AF] mt-0.5">Direct Hotline: {settings.whatsappNumber}</p>
              </div>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20would%20like%20to%20plan%20a%20luxury%20expedition.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-[#25D366]/30 active:scale-95 relative z-10"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
