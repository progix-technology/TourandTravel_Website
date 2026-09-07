import React, { useState, useEffect } from 'react'
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Headphones,
  ShieldCheck,
  Leaf,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  MapPin,
  Star,
  Users,
  Award,
  Gem,
  MessageSquare,
  ChevronRight,
  Zap,
  Globe,
  HeartHandshake,
  BadgeCheck,
  Plane,
  Building2,
  TreePine,
  ExternalLink,
} from 'lucide-react'
import Button from '../components/Button'

// 3D image assets
import imgTailored from '../assets/images/3d_Images/tailored_cartmanship.png'
import imgConcierge from '../assets/images/3d_Images/Concierge.png'
import imgSanctuaries from '../assets/images/3d_Images/Sanctuaries.png'
import imgSustainable from '../assets/images/3d_Images/sustainable_luxry.png'
import tripImg from '../assets/images/trip.png'

// Pillar dataset
export const PILLARS_DATA = [
  {
    id: 'tailored-craftsmanship',
    slug: 'tailored-craftsmanship',
    number: '01',
    badgeText: '100% Bespoke Craft',
    badgeColor: '#F59E0B',
    accentColor: '#F59E0B',
    title: 'Tailored Craftsmanship',
    subtitle: 'No Two Journeys Are Identical',
    heroTagline: 'Uncompromised personalization where every minute is choreographed around your personal rhythm.',
    summary:
      'Every itinerary is meticulously customized from a blank canvas around your passions, dietary nuances, sleep rhythms, and architectural aesthetics.',
    imageUrl: imgTailored,
    icon: Compass,
    gradientTheme: {
      card: 'bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/70 to-[#FDE68A]/30 border-amber-200 text-amber-950',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      glow: 'bg-amber-400/20',
      activeTab: 'bg-amber-500 text-white shadow-amber-500/25',
      accentText: 'text-amber-600',
      iconBox: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    cta: {
      text: 'Design Your Custom Itinerary',
      href: '/custom-trip',
      variant: 'primary',
    },
    keyStats: [
      { value: '100%', label: 'Bespoke Private Routes' },
      { value: '1-on-1', label: 'Dedicated Senior Architect' },
      { value: '0', label: 'Cookie-Cutter Group Tours' },
      { value: '24/7', label: 'Adaptive Dynamic Rescheduling' },
    ],
    features: [
      {
        icon: Compass,
        title: 'Architected From Scratch',
        description:
          'We do not sell pre-packaged group tours. Every day, transit, and private excursion is built specifically for you and your travel companions.',
      },
      {
        icon: Users,
        title: 'Private Local Masters & Historians',
        description:
          'Access restricted palace quarters, private museum viewings after hours, and secret alpine trails with verified local authorities.',
      },
      {
        icon: Star,
        title: 'Curated Culinary Dossiers',
        description:
          'From private cliffside chef tastings to strict dietary compliance (Jain, Halal, Vegan, Gluten-Free), your palate is pampered at every meal.',
      },
      {
        icon: Zap,
        title: 'Spontaneous On-Trip Flexibility',
        description:
          'Wish to stay an extra day in Gulmarg or switch tomorrow’s safari to a sunrise helicopter hop? Your architect adapts the route in real-time.',
      },
    ],
    processSteps: [
      {
        step: '01',
        title: 'Discovery & Profiling',
        desc: 'We map your travel rhythm, accommodation styles, dietary preferences, and bucket-list aspirations.',
      },
      {
        step: '02',
        title: 'Architecting the Route',
        desc: 'Our senior planners craft a customized day-by-day blueprint with private air transfers and luxury sanctuary holds.',
      },
      {
        step: '03',
        title: 'Refinement & Polish',
        desc: 'Fine-tune dining reservations, private guide assignments, and VIP fast-track credentials to perfection.',
      },
      {
        step: '04',
        title: 'Flawless Execution',
        desc: 'Your private chauffeur, concierge team, and local curators deliver a truly seamless journey from gate to gate.',
      },
    ],
    quote: {
      text: 'The journey to Kashmir curated by Tours & Travels was nothing short of poetic. Every detail felt tailored with remarkable elegance.',
      author: 'Marcus & Sophia Lindqvist',
      title: 'Design Directors, Stockholm',
    },
  },
  {
    id: 'concierge-support',
    slug: 'concierge-support',
    number: '02',
    badgeText: '24/7 VIP Support',
    badgeColor: '#10B981',
    accentColor: '#10B981',
    title: '24/7 Dedicated Concierge',
    subtitle: 'Instantaneous White-Glove Assistance',
    heroTagline: 'Real-time, instantaneous white-glove assistance from departure through arrival back home.',
    summary:
      'From private airport fast-tracks to spontaneous helicopter transfers, your single-point dedicated travel director is available 24/7 via WhatsApp.',
    imageUrl: imgConcierge,
    icon: Headphones,
    gradientTheme: {
      card: 'bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7]/70 to-[#BBF7D0]/30 border-emerald-200 text-emerald-950',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      glow: 'bg-emerald-400/20',
      activeTab: 'bg-[#2E4A35] text-white shadow-emerald-600/25',
      accentText: 'text-emerald-600',
      iconBox: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    },
    cta: {
      text: 'Connect With Concierge Team',
      href: '/contact',
      variant: 'primary',
    },
    keyStats: [
      { value: '< 60s', label: 'Average WhatsApp Response' },
      { value: '24/7', label: 'Global Live Operations Desk' },
      { value: '1-to-1', label: 'Single Dedicated Point of Contact' },
      { value: '100%', label: 'Flight Tracking & Ground Sync' },
    ],
    features: [
      {
        icon: MessageSquare,
        title: 'Direct WhatsApp Concierge Line',
        description:
          'No automated call centers or ticketing queues. Directly message your senior travel director for instant assistance anywhere on Earth.',
      },
      {
        icon: Plane,
        title: 'Airport VIP Fast-Track & Meet',
        description:
          'Breeze through international biometric immigration and tarmac transfers with designated VIP airside representatives.',
      },
      {
        icon: ShieldCheck,
        title: 'Emergency Rapid Relocation Protocol',
        description:
          'In case of airline delays, weather shifts, or regional disruptions, our team reroutes flights and hotels proactively before you even notice.',
      },
      {
        icon: Clock,
        title: 'Zero-Wait Michelin & Yacht Bookings',
        description:
          'Spontaneous cravings? Your concierge locks hard-to-book tables, private catamarans, and helicopter charters on demand.',
      },
    ],
    processSteps: [
      {
        step: '01',
        title: 'Pre-Departure Briefing',
        desc: '72 hours prior to departure, you receive your synchronized digital itinerary docket and personal concierge contact.',
      },
      {
        step: '02',
        title: 'Airside Meet & Greet',
        desc: 'Your designated airport concierge greets you at the jet bridge to expedite baggage and executive transfers.',
      },
      {
        step: '03',
        title: 'Live On-Trip Shadowing',
        desc: 'Our ops desk monitors every driver dispatch, weather forecast, and table reservation 2 hours in advance.',
      },
      {
        step: '04',
        title: 'Safe Return Wrap-up',
        desc: 'Post-trip concierge debrief to archive preferences and ensure sovereign client satisfaction.',
      },
    ],
    quote: {
      text: 'When our flight from Zurich got delayed, our concierge had private ground transport and a luxury chalet dinner waiting seamlessly. Astonishing service.',
      author: 'Aarav Singhania',
      title: 'Entrepreneur, Singapore',
    },
  },
  {
    id: 'vetted-sanctuaries',
    slug: 'vetted-sanctuaries',
    number: '03',
    badgeText: 'Vetted Sanctuaries',
    badgeColor: '#8B5CF6',
    accentColor: '#8B5CF6',
    title: 'Vetted 5-Star Sanctuaries',
    subtitle: 'Hand-Inspected Luxury Haven Standards',
    heroTagline: 'We personally inspect every overwater villa, mountain chalet, and royal heritage palace to guarantee sanctuary-grade privacy.',
    summary:
      'We never rely on third-party star ratings. Our team personally evaluates acoustics, mattress ergonomics, culinary provenance, and private view corridors.',
    imageUrl: imgSanctuaries,
    icon: ShieldCheck,
    gradientTheme: {
      card: 'bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF]/70 to-[#E9D5FF]/30 border-purple-200 text-purple-950',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      glow: 'bg-purple-400/20',
      activeTab: 'bg-purple-700 text-white shadow-purple-600/25',
      accentText: 'text-purple-600',
      iconBox: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    },
    cta: {
      text: 'Explore Signature Packages',
      href: '/tours',
      variant: 'primary',
    },
    keyStats: [
      { value: '120+', label: 'Point Rigorous Audit Checklist' },
      { value: 'Top 1%', label: 'Properties Accepted Globally' },
      { value: 'VIP', label: 'Complimentary Room Upgrades' },
      { value: '100%', label: 'Guaranteed Prime View Allocation' },
    ],
    features: [
      {
        icon: Building2,
        title: '120-Point Luxury Audit Checklist',
        description:
          'From acoustic soundproofing and water pressure to private butler training, every property must pass our rigorous in-person inspection.',
      },
      {
        icon: Gem,
        title: 'VIP Partner Privileges & Upgrades',
        description:
          'Enjoy complimentary suite upgrades upon availability, welcome Champagne, daily gourmet breakfasts, and $100 resort credits.',
      },
      {
        icon: MapPin,
        title: 'Guaranteed Prime View Corridors',
        description:
          'Never get assigned a back-alley or parking-lot facing room. We contractually lock top-floor suites, oceanfront villas, and mountain view chalets.',
      },
      {
        icon: Award,
        title: 'Strict Privacy & Discretion Mandate',
        description:
          'Sanctuaries vetted for sovereign high-net-worth discretion, private plunge pool screening, and discreet private check-ins.',
      },
    ],
    processSteps: [
      {
        step: '01',
        title: 'Anonymous Field Audits',
        desc: 'Our quality directors stay anonymously at potential sanctuaries to evaluate real service levels.',
      },
      {
        step: '02',
        title: 'Acoustic & Comfort Vetting',
        desc: 'We measure room acoustics, linen thread counts, and air filtration standards.',
      },
      {
        step: '03',
        title: 'Contractual View Guarantees',
        desc: 'Direct partnerships ensure our guests receive premium tier room numbers exclusively.',
      },
      {
        step: '04',
        title: 'Ongoing Quality Feedback',
        desc: 'Every guest review directly informs whether a property maintains its signature partner status.',
      },
    ],
    quote: {
      text: 'The overwater sanctuary in Maldives felt like a private kingdom. The attention to privacy, cleanliness, and view alignment was unmatched.',
      author: 'Dr. Elena Rostova',
      title: 'Architect, Zurich',
    },
  },
  {
    id: 'sustainable-luxury',
    slug: 'sustainable-luxury',
    number: '04',
    badgeText: 'Eco Stewardship',
    badgeColor: '#0D9488',
    accentColor: '#0D9488',
    title: 'Sustainable Luxury & Stewardship',
    subtitle: 'Protecting Fragile Ecosystems',
    heroTagline: 'High-end luxury that leaves destinations richer, ecosystems intact, and local heritage thriving.',
    summary:
      'We partner with local conservationists, enforce zero single-use plastics across all itineraries, and invest carbon offsets into verified reforestation programs.',
    imageUrl: imgSustainable,
    icon: Leaf,
    gradientTheme: {
      card: 'bg-gradient-to-br from-[#F0FDFA] via-[#CCFBF1]/70 to-[#99F6E4]/30 border-teal-200 text-teal-950',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
      glow: 'bg-teal-400/20',
      activeTab: 'bg-teal-700 text-white shadow-teal-600/25',
      accentText: 'text-teal-600',
      iconBox: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    },
    cta: {
      text: 'View Eco-Conscious Expeditions',
      href: '/tours',
      variant: 'primary',
    },
    keyStats: [
      { value: '100%', label: 'Carbon Offset per Traveler' },
      { value: '0', label: 'Single-Use Plastics Allowed' },
      { value: '5%', label: 'Profits to Indigenous Trusts' },
      { value: '10,000+', label: 'Himalayan Trees Planted' },
    ],
    features: [
      {
        icon: TreePine,
        title: '100% Carbon-Neutral Travel Offsets',
        description:
          'Every kilometer traveled across our flights, yachts, and luxury SUVs is audited and offset via certified Himalayan reforestation programs.',
      },
      {
        icon: Leaf,
        title: 'Zero Single-Use Plastics Mandate',
        description:
          'We supply premium stainless steel insulated flasks and partner with zero-waste luxury lodges eliminating single-use plastics entirely.',
      },
      {
        icon: HeartHandshake,
        title: 'Indigenous Cultural Stewardship',
        description:
          'We work directly with native village elders, wildlife naturalists, and artisans, channeling tourism capital directly into local heritage preservation.',
      },
      {
        icon: Globe,
        title: 'Certified Ethical Wildlife Encounters',
        description:
          'Strict prohibition of animal exploitation. We curate exclusively non-invasive safari and marine sanctuary viewings.',
      },
    ],
    processSteps: [
      {
        step: '01',
        title: 'Carbon Ledger Audit',
        desc: 'We calculate exact emissions for your flights, private ground transfers, and resort stays.',
      },
      {
        step: '02',
        title: 'Direct Tree Planting Offset',
        desc: 'For every guest, verified indigenous trees are planted in high-altitude Himalayan reforestation reserves.',
      },
      {
        step: '03',
        title: 'Zero-Waste Transit Kit',
        desc: 'Travelers receive eco-friendly hydration flasks and reusable travel amenities upon arrival.',
      },
      {
        step: '04',
        title: 'Community Impact Dividend',
        desc: 'A percentage of journey proceeds supports rural Himalayan schools and solar microgrid initiatives.',
      },
    ],
    quote: {
      text: 'Traveling with Tour & Travels showed us that ultra-luxury and deep ecological mindfulness can coexist with zero compromise.',
      author: 'Vikram & Ananya Mehta',
      title: 'Conservation Advocates, Mumbai',
    },
  },
]

export const PillarsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { slug } = useParams()
  const navigate = useNavigate()

  // Determine active pillar based on URL param, path param, or fallback to first
  const initialPillarSlug = slug || searchParams.get('pillar') || 'tailored-craftsmanship'
  const [activePillarId, setActivePillarId] = useState(
    PILLARS_DATA.some((p) => p.slug === initialPillarSlug || p.id === initialPillarSlug)
      ? initialPillarSlug
      : 'tailored-craftsmanship'
  )

  useEffect(() => {
    const requested = slug || searchParams.get('pillar')
    if (requested && PILLARS_DATA.some((p) => p.slug === requested || p.id === requested)) {
      setActivePillarId(requested)
    }
  }, [slug, searchParams])

  const activePillar =
    PILLARS_DATA.find((p) => p.slug === activePillarId || p.id === activePillarId) || PILLARS_DATA[0]

  const handleSelectPillar = (pillarId) => {
    setActivePillarId(pillarId)
    setSearchParams({ pillar: pillarId })
    // Smooth scroll to pillar detail anchor
    const detailElement = document.getElementById('pillar-detail-view')
    if (detailElement) {
      detailElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#13251F] font-sans">
      {/* 1. Header Hero Section with adequate top navbar offset */}
      <section className="relative bg-[#071A16] text-white pt-36 sm:pt-44 lg:pt-48 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#13251F]/30">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-[#071A16]" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#6FCF45]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-[#12382E]/70 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto relative z-10 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-[#6FCF45]/15 border border-[#6FCF45]/30 shadow-[0_0_15px_rgba(111,207,69,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#6FCF45] shadow-[0_0_8px_#6FCF45]" />
            <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#6FCF45] font-heading">
              OUR CORE ETHOS &amp; PHILOSOPHY
            </span>
            <span className="w-2 h-2 rounded-full bg-[#6FCF45] shadow-[0_0_8px_#6FCF45]" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-heading tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            The 4 Pillars of <span className="text-[#6FCF45]">Tour &amp; Travels</span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#A8B5AF] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            The four architectural commitments that define every bespoke expedition, private sanctuary stay, and concierge-curated journey we design.
          </p>
        </div>
      </section>

      {/* 2. Interactive 4-Pillars Navigation Switcher Grid */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {PILLARS_DATA.map((pillar) => {
            const isSelected = activePillar.id === pillar.id
            const Icon = pillar.icon

            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => handleSelectPillar(pillar.id)}
                className={`relative group text-left rounded-[22px] p-5 sm:p-6 transition-all duration-300 border-2 overflow-hidden flex flex-col justify-between h-[210px] sm:h-[220px] shadow-lg ${
                  isSelected
                    ? 'bg-white border-[#6FCF45] shadow-[0_12px_30px_rgba(111,207,69,0.25)] scale-[1.02] ring-2 ring-[#6FCF45]/40'
                    : 'bg-white/95 hover:bg-white border-transparent hover:border-[#6FCF45]/40 shadow-sm hover:shadow-md'
                }`}
              >
                {/* 3D Asset watermark */}
                <img
                  src={pillar.imageUrl}
                  alt={pillar.title}
                  className={`absolute -right-3 -bottom-3 w-28 h-28 object-contain pointer-events-none transition-transform duration-500 ${
                    isSelected ? 'scale-110 rotate-3 drop-shadow-lg' : 'opacity-85 group-hover:scale-105'
                  }`}
                />

                <div className="relative z-10">
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs"
                      style={{
                        backgroundColor: `${pillar.badgeColor}15`,
                        borderColor: `${pillar.badgeColor}40`,
                        color: pillar.badgeColor,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: pillar.badgeColor }}
                      />
                      {pillar.badgeText}
                    </span>

                    <span className="text-xs font-mono font-bold text-[#5C6E67]">
                      {pillar.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#13251F] font-heading leading-snug group-hover:text-[#2E4A35] transition-colors pr-10">
                    {pillar.title}
                  </h3>

                  <p className="text-[11px] text-[#5C6E67] mt-1.5 line-clamp-2 leading-relaxed max-w-[190px]">
                    {pillar.subtitle}
                  </p>
                </div>

                {/* Active Indicator Bar */}
                <div className="relative z-10 pt-2 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                      isSelected ? 'text-[#2E4A35]' : 'text-[#7A8B84] group-hover:text-[#2E4A35]'
                    }`}
                  >
                    <span>{isSelected ? 'Active Pillar' : 'Explore Pillar'}</span>
                    <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-0.5'}`} />
                  </span>

                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6FCF45] shadow-[0_0_8px_#6FCF45]" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. DYNAMIC PILLAR DEEP-DIVE VIEW */}
      <section id="pillar-detail-view" className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-12 sm:space-y-16"
          >
            {/* 3A. Dynamic Pillar Hero Spotlight Card */}
            <div className="bg-white rounded-[28px] p-6 sm:p-10 lg:p-12 border-2 border-[#6FCF45]/40 shadow-[0_12px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
              {/* Background gradient blur */}
              <div
                className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${activePillar.gradientTheme.glow}`}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* Left Col: Main Narrative */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-xs"
                      style={{
                        backgroundColor: `${activePillar.badgeColor}18`,
                        borderColor: `${activePillar.badgeColor}50`,
                        color: activePillar.badgeColor,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: activePillar.badgeColor }}
                      />
                      Pillar {activePillar.number}: {activePillar.badgeText}
                    </span>

                    <span className="text-xs font-semibold text-[#5C6E67]">
                      Guaranteed on 100% of Itineraries
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-[#13251F] font-heading tracking-tight leading-tight">
                    {activePillar.title}
                  </h2>

                  <p className="text-base sm:text-lg text-[#2E4A35] font-semibold font-heading leading-snug">
                    "{activePillar.heroTagline}"
                  </p>

                  <p className="text-xs sm:text-sm text-[#5C6E67] leading-relaxed">
                    {activePillar.summary}
                  </p>

                  {/* Action CTA */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Button
                      to={activePillar.cta.href}
                      variant="primary"
                      size="lg"
                      className="text-xs font-extrabold uppercase tracking-wider px-8 shadow-md hover:shadow-lg"
                    >
                      <span>{activePillar.cta.text}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#13251F] hover:text-[#2E4A35] bg-[#FAF8F2] hover:bg-[#F2EFE8] border border-[#13251F]/10 transition-all font-heading"
                    >
                      <span>Speak to a Planner</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Col: 3D Illustration Showcase & Floating Stats */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                  <div className="relative w-64 sm:w-80 h-64 sm:h-80 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative z-10 w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={activePillar.imageUrl}
                        alt={activePillar.title}
                        className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]"
                      />
                    </motion.div>

                    {/* Circular Aura Ring */}
                    <div
                      className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow opacity-40"
                      style={{ borderColor: activePillar.badgeColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Key Metrics Bar */}
              <div className="mt-10 pt-8 border-t border-[#13251F]/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                {activePillar.keyStats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div
                      className="text-2xl sm:text-3xl font-extrabold font-heading"
                      style={{ color: activePillar.badgeColor }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-[#5C6E67]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3B. Core Standards & Guarantees (4 Detailed Feature Cards) */}
            <div className="space-y-6">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 mb-1.5">
                  <span className="w-4 h-1 rounded-full" style={{ backgroundColor: activePillar.badgeColor }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#5C6E67] font-heading">
                    OUR EXACT STANDARDS
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-bold text-[#13251F] font-heading">
                  How We Deliver {activePillar.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {activePillar.features.map((feat, idx) => {
                  const FeatIcon = feat.icon
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-[20px] p-6 sm:p-7 border border-[#13251F]/10 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4 group"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${activePillar.badgeColor}15`,
                          borderColor: `${activePillar.badgeColor}40`,
                          color: activePillar.badgeColor,
                        }}
                      >
                        <FeatIcon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-base sm:text-lg font-bold text-[#13251F] font-heading group-hover:text-[#2E4A35] transition-colors">
                          {feat.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#5C6E67] leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3C. 4-Stage Operational Blueprint */}
            <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-[#13251F]/10 shadow-sm">
              <div className="mb-8">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E4A35] font-heading">
                  THE WORKFLOW BLUEPRINT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading mt-1">
                  The 4-Stage {activePillar.title} Lifecycle
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {activePillar.processSteps.map((stepItem, idx) => (
                  <div key={idx} className="relative space-y-3 p-4 rounded-xl bg-[#FAF8F2] border border-[#13251F]/5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs text-white"
                      style={{ backgroundColor: activePillar.badgeColor }}
                    >
                      {stepItem.step}
                    </div>
                    <h4 className="text-sm font-bold text-[#13251F] font-heading">
                      {stepItem.title}
                    </h4>
                    <p className="text-xs text-[#5C6E67] leading-relaxed">
                      {stepItem.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D. Verified Traveler Case Study / Testimonial Spotlight */}
            <div className="bg-[#071A16] text-white rounded-[24px] p-6 sm:p-10 border-2 border-[#6FCF45]/30 relative overflow-hidden shadow-xl">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="flex items-center gap-1.5 text-[#EAB308]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs font-bold text-[#A8B5AF] ml-2">Verified Expedition Record</span>
                </div>
                <p className="text-base sm:text-xl text-[#F2EFE8] font-heading italic leading-relaxed">
                  "{activePillar.quote.text}"
                </p>
                <div>
                  <div className="font-bold text-sm text-white font-heading">{activePillar.quote.author}</div>
                  <div className="text-xs text-[#6FCF45]">{activePillar.quote.title}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 4. Bottom Sticky / Ready to Begin Container */}
      <section className="bg-[#FAF8F2] pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto bg-[#071A16] text-white rounded-[24px] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl border-2 border-[#6FCF45]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            <div className="md:col-span-8 space-y-3 text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#6FCF45] font-heading">
                ELEVATE YOUR NEXT JOURNEY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Ready to Experience The 4 Pillars in Action?
              </h2>
              <p className="text-xs sm:text-sm text-[#A8B5AF] max-w-xl leading-relaxed">
                Connect with our Senior Travel Architects today to construct your bespoke itinerary with verified 5-star sanctuaries and 24/7 dedicated concierge protection.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <Button
                to="/custom-trip"
                variant="primary"
                size="md"
                className="w-full text-xs uppercase tracking-wider font-extrabold text-center justify-center py-3.5"
              >
                Plan Custom Expedition
              </Button>
              <Button
                to="/tours"
                variant="secondary"
                size="md"
                className="w-full text-xs uppercase tracking-wider font-bold text-center justify-center py-3.5"
              >
                Browse All Packages
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PillarsPage
