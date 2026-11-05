import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Award,
  AlertCircle,
  MapPin,
  ArrowRight,
  Check,
  Users,
  Calendar,
  Globe,
  MessageCircle,
  Compass,
} from 'lucide-react'

export const ProfileCustomQuotesTab = ({
  customTrips,
  cleanPhone,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading">Custom Trip Quotes &amp; Status</h1>
          <p className="text-xs text-[#94A3B8]">Track your bespoke luxury inquiries, curated proposals, and live concierge review status.</p>
        </div>
        <Link
          to="/custom-trip"
          className="inline-flex items-center justify-center gap-2 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Request New Itinerary</span>
        </Link>
      </div>

      {customTrips.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {customTrips.map((quote, idx) => {
            const rawRef = quote.inquiryReference || (quote._id ? `CT-${quote._id.slice(-6).toUpperCase()}` : `CT-00${idx + 1}`)
            const rawStatus = (quote.status || 'Pending Concierge Review').trim()
            
            let statusConfig = {
              label: rawStatus,
              badgeClass: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
              dotClass: 'bg-amber-400',
              icon: Clock,
              step: 1,
              statusNote: 'Our Senior Travel Concierge is reviewing your journey preferences and dates.'
            }

            const lower = rawStatus.toLowerCase()
            if (lower.includes('confirm')) {
              statusConfig = {
                label: 'Confirmed & Booked',
                badgeClass: 'bg-emerald-500/15 text-[#6FCF45] border-[#6FCF45]/40',
                dotClass: 'bg-[#6FCF45]',
                icon: CheckCircle2,
                step: 4,
                statusNote: 'Your bespoke journey has been confirmed and dates are locked with our luxury partners.'
              }
            } else if (lower.includes('quot') || lower.includes('sent')) {
              statusConfig = {
                label: 'Quotation Ready',
                badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
                dotClass: 'bg-sky-400',
                icon: Award,
                step: 3,
                statusNote: 'Your tailored quotation and proposal is prepared. Review details and connect to finalize.'
              }
            } else if (lower.includes('curat')) {
              statusConfig = {
                label: 'Curating Itinerary',
                badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
                dotClass: 'bg-purple-400',
                icon: Sparkles,
                step: 2,
                statusNote: 'Destination specialists are designing your bespoke route, private stays, and day-by-day experiences.'
              }
            } else if (lower.includes('closed') || lower.includes('cancel')) {
              statusConfig = {
                label: rawStatus,
                badgeClass: 'bg-red-500/15 text-red-300 border-red-500/40',
                dotClass: 'bg-red-400',
                icon: AlertCircle,
                step: 0,
                statusNote: 'This inquiry is currently marked as closed or archived.'
              }
            }

            const StatusIcon = statusConfig.icon
            const destName = quote.destination || (Array.isArray(quote.toDestinations) && quote.toDestinations.length > 0 ? quote.toDestinations.join(', ') : 'Bespoke Luxury Destination')
            const fromCity = quote.departure || quote.fromLocation || 'Lucknow, Uttar Pradesh'
            const travelersCount = quote.travelers || quote.travellers?.adults || 2
            const tripDuration = quote.duration || (quote.approxDurationDays ? `${quote.approxDurationDays} Days` : '6–8 Days')
            const tripDates = quote.travelDate || quote.startDate || 'Flexible / Next 30 Days'
            const tripMode = quote.travelMode || quote.transport || 'Flight & Private Chauffeur'
            const specialReqs = quote.specialRequests || quote.contactInfo?.notes || quote.notes || ''

            const tripWhatsApp = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello Concierge! I am inquiring about my Custom Trip Reference [${rawRef}] to ${destName} (Current Status: ${statusConfig.label}). Could you share the latest updates?`
            )}`

            return (
              <div
                key={quote._id || quote.id || idx}
                className="bg-[#081C16] border border-white/10 hover:border-[#6FCF45]/30 rounded-2xl p-5 sm:p-6 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 tracking-wider">
                        {rawRef}
                      </span>
                      {quote.createdAt && (
                        <span className="text-[10px] text-[#94A3B8]">
                          {new Date(quote.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${statusConfig.badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusConfig.dotClass}`} />
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig.label}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-1 font-heading">{destName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                      <MapPin className="w-3.5 h-3.5 text-[#6FCF45] shrink-0" />
                      <span>From: <strong className="text-slate-200">{fromCity}</strong></span>
                      <ArrowRight className="w-3 h-3 text-[#6FCF45]" />
                      <span>To: <strong className="text-[#6FCF45]">{destName}</strong></span>
                    </div>
                  </div>

                  {statusConfig.step > 0 && (
                    <div className="mb-4 bg-[#05130F] border border-white/5 rounded-xl p-3">
                      <div className="grid grid-cols-4 gap-1 relative text-center">
                        {[
                          { num: 1, label: 'In Review' },
                          { num: 2, label: 'Curating' },
                          { num: 3, label: 'Quote Ready' },
                          { num: 4, label: 'Confirmed' }
                        ].map((stepItem) => {
                          const isDone = statusConfig.step >= stepItem.num
                          const isCurrent = statusConfig.step === stepItem.num
                          return (
                            <div key={stepItem.num} className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all ${
                                  isDone
                                    ? 'bg-[#6FCF45] text-[#071A16] shadow-sm shadow-[#6FCF45]/30'
                                    : 'bg-white/10 text-[#94A3B8]'
                                } ${isCurrent ? 'ring-2 ring-[#6FCF45] ring-offset-2 ring-offset-[#081C16]' : ''}`}
                              >
                                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : stepItem.num}
                              </div>
                              <span className={`text-[9px] uppercase font-bold tracking-tight ${isDone ? 'text-white' : 'text-[#64748B]'}`}>
                                {stepItem.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-2.5 pt-2 border-t border-white/5 italic text-center">
                        {statusConfig.statusNote}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Duration</span>
                      <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-[#6FCF45]" />
                        {tripDuration}
                      </span>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Travelers</span>
                      <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-[#6FCF45]" />
                        {travelersCount} Guests
                      </span>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Schedule</span>
                      <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5 truncate" title={tripDates}>
                        <Calendar className="w-3 h-3 text-[#6FCF45] shrink-0" />
                        <span className="truncate">{tripDates}</span>
                      </span>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-xl p-2.5">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">Transport</span>
                      <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5 truncate" title={tripMode}>
                        <Globe className="w-3 h-3 text-[#6FCF45] shrink-0" />
                        <span className="truncate">{tripMode}</span>
                      </span>
                    </div>
                  </div>

                  {quote.quoteAmount > 0 && (
                    <div className="mb-4 bg-gradient-to-r from-[#6FCF45]/15 to-emerald-900/20 border border-[#6FCF45]/30 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#6FCF45] uppercase tracking-wider block">
                          Official Concierge Quotation
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-lg font-black text-white font-heading">
                            ₹{Number(quote.quoteAmount).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#94A3B8]">Total Estimated Package</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#6FCF45] text-[#071A16] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                        Approved Price
                      </span>
                    </div>
                  )}

                  {quote.curatedItinerary && (
                    <div className="mb-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-xs text-purple-200">
                      <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Concierge Proposal Notes
                      </span>
                      <p className="line-clamp-3 text-slate-300 leading-relaxed whitespace-pre-line">{quote.curatedItinerary}</p>
                    </div>
                  )}

                  {specialReqs && (
                    <div className="mb-4 text-xs text-[#94A3B8] bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Your Preferences:</span>
                      <p className="italic text-slate-300 line-clamp-2">&quot;{specialReqs}&quot;</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <a
                    href={tripWhatsApp}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-[#071A16] border border-[#25D366]/40 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Discuss {rawRef} on WhatsApp</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-[#081C16] border border-white/5 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#6FCF45]/10 border border-[#6FCF45]/20 flex items-center justify-center mx-auto mb-4 text-[#6FCF45]">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 font-heading">No Custom Quotes Active</h3>
          <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
            Looking for a tailor-made luxury expedition, private island getaway, or corporate retreat? Submit your bespoke journey request and our Travel Curators will design it for you.
          </p>
          <Link
            to="/custom-trip"
            className="inline-flex items-center gap-2 bg-[#6FCF45] hover:bg-[#5eb937] text-[#071A16] px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Custom Journey</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default ProfileCustomQuotesTab

