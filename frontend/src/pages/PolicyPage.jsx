import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  FileText,
  Shield,
  Leaf,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export const PolicyPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { settings } = useSettings()

  // Tab State: 'terms' | 'privacy' | 'eco'
  const [activeTab, setActiveTab] = useState('terms')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')

    if (tabParam && ['terms', 'privacy', 'eco'].includes(tabParam)) {
      setActiveTab(tabParam)
    } else if (location.pathname.includes('privacy')) {
      setActiveTab('privacy')
    } else if (location.pathname.includes('sustainability') || location.pathname.includes('eco')) {
      setActiveTab('eco')
    } else if (location.pathname.includes('terms')) {
      setActiveTab('terms')
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    navigate(`/policy?tab=${tabId}`, { replace: true })
  }

  const cleanWhatsApp = (settings.whatsappNumber || settings.inquiryPhone || '918953208952').replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Concierge Desk! I have a question regarding your booking and privacy policies.')}`

  return (
    <div className="bg-[#FAF8F5] text-[#13251F] min-h-screen text-left select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP DARK & TRANSPARENT HERO HEADER (Matches site-wide dark style)      */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-[#071A16] text-white pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden shadow-2xl border-b border-white/10">
        {/* Ambient emerald radial glow overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6FCF45]/12 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#12382E]/40 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="max-w-[1240px] w-full mx-auto relative z-10 text-left">
          
          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.25em] font-bold text-[#6FCF45] font-heading">
            <span className="w-6 h-[2px] bg-[#6FCF45]" />
            <span>GOVERNANCE &amp; TRUST</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-white leading-tight">
            {activeTab === 'terms' && 'Terms & Conditions of Expedition'}
            {activeTab === 'privacy' && 'Privacy Policy & Data Ethics'}
            {activeTab === 'eco' && 'Eco-Conscious Travel & Stewardship'}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-[#A8B5AF] max-w-2xl leading-relaxed font-normal">
            Transparent protocols governing our bespoke luxury bookings, client confidentiality, and environmental stewardship.
          </p>

          {/* Clean Policy Tabs Navigation */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-2 sm:gap-4">
            {[
              { id: 'terms', label: 'Terms of Expedition', icon: FileText },
              { id: 'privacy', label: 'Privacy Policy', icon: Shield },
              { id: 'eco', label: 'Eco-Conscious Travel', icon: Leaf },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#6FCF45] text-[#071A16] shadow-lg shadow-[#6FCF45]/20 font-extrabold border border-[#6FCF45]'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN DOCUMENT BODY (Simple, Clean White Background Content)             */}
      {/* ========================================================================= */}
      <div className="bg-white py-14 sm:py-16">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Legal Clauses Document (8 Columns) */}
            <div className="lg:col-span-8 space-y-10 text-[#33443F] leading-relaxed text-sm sm:text-base font-normal">
              
              <div className="flex items-center gap-4 text-xs text-[#5C6E67] pb-4 border-b border-gray-200">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#2E4A35]" /> Last Updated: September 2026</span>
                <span>•</span>
                <span>Version 2026.4 • Verified Legal Governance</span>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* TAB 1: TERMS OF EXPEDITION                                    */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'terms' && (
                <div className="space-y-8 animate-fadeIn">
                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      1. Reservation, Deposit &amp; Payment Schedules
                    </h2>
                    <p>
                      All private bespoke itineraries, private chartered expeditions, and signature tour packages booked through Tours &amp; Travels require an initial commitment deposit of 25% of the total journey invoice at the time of reservation lock.
                    </p>
                    <p>
                      The remaining final balance is due exactly 30 days prior to your designated departure date. For high-season expeditions (such as Swiss Alps Christmas Chalets or Kashmir Autumn Caravans), final settlement is required 45 days prior.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      2. Cancellation, Rescheduling &amp; Refund Policy
                    </h2>
                    <p>
                      We recognize that extraordinary circumstances may require altering your travel schedules. Our cancellation tier schedule is structured as follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-[#33443F]">
                      <li>
                        <strong>45+ Days Prior to Departure:</strong> 100% full monetary refund minus a 3% administrative transaction fee, or a 100% full-value Lifetime Journey Credit.
                      </li>
                      <li>
                        <strong>30 to 44 Days Prior to Departure:</strong> 80% monetary refund or 100% Lifetime Journey Credit applicable to any signature package.
                      </li>
                      <li>
                        <strong>15 to 29 Days Prior to Departure:</strong> 50% credit voucher toward future expeditions.
                      </li>
                      <li>
                        <strong>Within 14 Days of Departure:</strong> Non-refundable due to non-recoverable commitments with luxury private aviation and boutique sanctuary partner holds.
                      </li>
                    </ul>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      3. Bespoke Concierge Scope &amp; On-Trip Modifications
                    </h2>
                    <p>
                      Your dedicated Senior Travel Architect acts as your personal travel director throughout the trip lifecycle. Any spontaneous on-trip alterations (private helicopter charters, sommelier wine tastings, luxury vehicle upgrades) requested through your 24/7 WhatsApp concierge will be billed transparently at preferred partner rates.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      4. Passports, Visas &amp; International Health Compliance
                    </h2>
                    <p>
                      Travelers hold primary responsibility for ensuring their passports maintain at least six (6) months validity from the scheduled return date. Tours &amp; Travels provides complete visa facilitation dossiers, VIP biometric fast-track appointment guidance, and comprehensive medical travel insurance recommendations.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      5. Safe Passage &amp; Force Majeure Protocol
                    </h2>
                    <p>
                      In the rare event of natural anomalies, severe weather patterns, or geopolitical events impacting your route, our 24/7 Rapid Relocation Team will immediately reroute your journey to equivalent 5-star sanctuaries with zero additional agency surcharges.
                    </p>
                  </section>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: PRIVACY POLICY & DATA ETHICS                           */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'privacy' && (
                <div className="space-y-8 animate-fadeIn">
                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      1. Sovereign Client Confidentiality
                    </h2>
                    <p>
                      Tours &amp; Travels treats your personal identity, travel preferences, and itinerary records with uncompromising discretion. We never sell, lease, monetize, or trade client dossiers with third-party marketing networks under any circumstances.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      2. Information We Collect
                    </h2>
                    <p>
                      To craft flawless bespoke journeys, we collect only essential information:
                    </p>
                    <ul className="list-disc pl-6 space-y-1.5 text-[#33443F]">
                      <li>Full legal name and identity details for luxury flight and hotel reservations.</li>
                      <li>Direct contact information (Email and WhatsApp mobile number) for dispatching vouchers and real-time support.</li>
                      <li>Special dietary preferences and mobility requirements to personalize culinary and resort experiences.</li>
                    </ul>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      3. 256-Bit Encrypted Financial Processing
                    </h2>
                    <p>
                      All payment transactions are processed exclusively via PCI-DSS Level 1 compliant financial gateways with 256-bit SSL encryption. Tours &amp; Travels does not store raw credit card numbers, CVVs, or bank security credentials on our servers.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      4. WhatsApp &amp; Concierge Communication Consent
                    </h2>
                    <p>
                      By submitting a custom trip inquiry or registering a client profile, you consent to receive your customized itineraries, booking vouchers, and concierge trip updates via WhatsApp and email. You can opt out at any time by messaging "STOP" or notifying your concierge architect.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      5. Data Retention &amp; Right to Erasure
                    </h2>
                    <p>
                      You retain the sovereign right to inspect, modify, or request the permanent deletion of your client dossier from our database at any time by contacting our Privacy Governance desk.
                    </p>
                  </section>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 3: ECO-CONSCIOUS TRAVEL & STEWARDSHIP                     */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'eco' && (
                <div className="space-y-8 animate-fadeIn">
                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      1. 100% Carbon-Neutral Travel Offsets
                    </h2>
                    <p>
                      For every kilometer traveled across our signature expeditions and bespoke journeys, Tours &amp; Travels calculates the carbon footprint and invests directly in verified Himalayan reforestation, Sundarbans mangrove restoration, and clean renewable energy trusts.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      2. Zero Single-Use Plastics Mandate
                    </h2>
                    <p>
                      All our partner safari jeeps, private houseboats, and alpine chalets adhere strictly to our Zero Single-Use Plastic Charter. All guests receive insulated thermal flasks and access to mineral-purified natural water systems throughout their journey.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      3. Indigenous Community Prosperity &amp; Heritage Fund
                    </h2>
                    <p>
                      At least 12% of tour expedition revenue is channeled directly to destination native guides, local artisan guilds, and regional heritage preservation societies, ensuring that luxury tourism actively enriches local communities.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      4. Ethical Wildlife &amp; Sanctuary Standards
                    </h2>
                    <p>
                      We strictly prohibit captive animal rides, unregulated marine interactions, or non-ethical wildlife shows. All our wildlife encounters are led by certified master naturalists adhering to non-intrusive buffer distance guidelines.
                    </p>
                  </section>

                  <hr className="border-gray-200" />

                  <section className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#13251F] font-heading">
                      5. Slow Gastronomy &amp; Hyper-Local Sourcing
                    </h2>
                    <p>
                      Our culinary dining experiences partner exclusively with hyper-local organic farms and sustainable fisheries, reducing food miles while celebrating the finest authentic regional gastronomy.
                    </p>
                  </section>
                </div>
              )}

            </div>

            {/* Sidebar (4 Columns): Contact & Quick Links */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Concierge Help Box */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-gray-200 space-y-4">
                <h3 className="text-base font-bold text-[#13251F] font-heading">
                  Questions or Special Requests?
                </h3>
                <p className="text-xs text-[#5C6E67] leading-relaxed">
                  Our Senior Legal &amp; Concierge Desk is available 24/7 to clarify terms, discuss custom booking adjustments, or verify insurance compliance.
                </p>

                <div className="pt-2 space-y-3 text-xs font-bold">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2E4A35] hover:bg-[#1f3324] text-white flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp Legal Concierge</span>
                  </a>

                  <a
                    href={`mailto:${settings.contactEmail || 'info@progixtechnology.com'}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#13251F] flex items-center justify-center gap-2 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Governance Desk</span>
                  </a>
                </div>
              </div>

              {/* Quick Links Navigator */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-gray-200 space-y-3 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E4A35] font-heading mb-3">
                  Related Portals
                </h4>
                <Link to="/about" className="flex items-center justify-between text-[#13251F] hover:text-[#2E4A35] font-medium py-1.5 border-b border-gray-200 transition-colors">
                  <span>About Our Heritage &amp; Ethos</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link to="/tours" className="flex items-center justify-between text-[#13251F] hover:text-[#2E4A35] font-medium py-1.5 border-b border-gray-200 transition-colors">
                  <span>Browse Signature Packages</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link to="/custom-trip" className="flex items-center justify-between text-[#13251F] hover:text-[#2E4A35] font-medium py-1.5 transition-colors">
                  <span>Design Custom Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default PolicyPage
