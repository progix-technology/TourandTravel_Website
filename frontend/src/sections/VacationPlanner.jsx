import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, ShieldCheck, CheckCircle, ChevronLeft, ChevronRight, Star, Quote, MapPin, CheckCircle2, User } from 'lucide-react'
import Button from '../components/Button'
import { TESTIMONIALS } from '../utils/mockData'
import worldImg from '../assets/images/world.jpg'

export const VacationPlanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))
  }

  const activeTestimonial = TESTIMONIALS[currentIndex]

  return (
    <section id="planner" className="bg-[#FAF8F2] text-[#13251F] py-12 sm:py-14 lg:py-16 border-t border-[#E5E0D5] relative overflow-hidden select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">

        {/* PART 1: Plan Your Vacation Now (Clean White / Cream Theme) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Premium Travel Image Showcase Card (Span 5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[20px] overflow-hidden shadow-xl border border-[#E5E0D5] group h-[320px] sm:h-[360px] lg:h-[380px] bg-[#071A16]">
              {/* Destination Image */}
              <img
                src={worldImg}
                alt="Custom Vacation Curation"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />


              {/* Bottom Info Bar (Full-Width Flush Glassmorphic Style) */}
              <div className="absolute bottom-0 inset-x-0 z-10 bg-black/55 backdrop-blur-xl px-5 py-3.5 border-t border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#6FCF45]/20 border border-[#6FCF45]/40 flex items-center justify-center text-[#6FCF45] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-tight font-heading">Complimentary Quote</h5>
                    <p className="text-[10.5px] text-[#A8B5AF] leading-tight mt-0.5">Tailored to your distinct rhythm</p>
                  </div>
                </div>
                <span className="bg-[#6FCF45]/20 border border-[#6FCF45]/30 text-[#6FCF45] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px]">
                  48h Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Planner Copy & CTA (Span 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#13251F] tracking-tight leading-[1.12] font-heading">
              Plan Your <br className="hidden sm:inline" />
              <span className="text-[#4F8F45]">Vacation Now.</span>
            </h2>

            <p className="mt-2.5 text-xs sm:text-[13px] text-[#5C6E67] max-w-xl leading-relaxed">
              Every extraordinary journey begins with a spark of curiosity. Whether seeking a secluded island sanctuary, a remote Himalayan mountain pass, or a royal heritage trail, our private curators design every moment around your distinct rhythm.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full text-xs text-[#13251F]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#4F8F45] shrink-0" />
                <span>Zero pre-packaged generic tours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#4F8F45] shrink-0" />
                <span>Private villa &amp; luxury resort upgrades</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#4F8F45] shrink-0" />
                <span>VIP fast-track passes &amp; private guides</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#4F8F45] shrink-0" />
                <span>Flexible cancellation &amp; rebooking</span>
              </div>
            </div>

            {/* Action Buttons with High-Contrast Clear Colors */}
            <div className="mt-5 flex flex-wrap items-center gap-3.5">
              <Button to="/custom-trip" variant="primary" size="md" icon={true} className="text-xs px-5 h-[42px]">
                START PLANNING
              </Button>
              <Link
                to="/tours"
                className="inline-flex items-center justify-center text-xs font-bold uppercase tracking-wider px-5 h-[42px] rounded-[6px] border-2 border-[#13251F] text-[#13251F] hover:bg-[#13251F] hover:text-white transition-all shadow-sm font-heading"
              >
                BROWSE ITINERARIES
              </Link>
            </div>
          </div>
        </div>

        {/* Section Divider Line */}
        <div className="w-full h-[1px] bg-[#E5E0D5]" />

        {/* PART 2: Voices from the Road (Light / White Background Theme) */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#13251F] font-heading">
                Voices from the Road
              </h3>
              <p className="mt-1 text-xs text-[#5C6E67] max-w-xl font-normal">
                Read unfiltered reflections from travelers who entrusted their most cherished memories to our curators.
              </p>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-end shrink-0">
              <button
                onClick={handlePrev}
                aria-label="Previous review"
                className="w-8 h-8 rounded-full border border-[#E5E0D5] bg-white flex items-center justify-center text-[#13251F] hover:bg-[#13251F] hover:text-white transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next review"
                className="w-8 h-8 rounded-full border border-[#E5E0D5] bg-white flex items-center justify-center text-[#13251F] hover:bg-[#13251F] hover:text-white transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clean White Testimonial Card with Uniform Height */}
          <div className="max-w-4xl mx-auto bg-white rounded-[16px] p-4 xs:p-5 sm:p-7 md:p-8 shadow-sm relative overflow-hidden border border-[#E5E0D5] flex flex-col justify-between min-h-[220px] sm:min-h-[270px] md:min-h-[280px]">
            <div>
              {/* Decorative Quote Mark */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#E5E0D5] pointer-events-none select-none">
                <Quote className="w-10 h-10 sm:w-16 sm:h-16 opacity-40" />
              </div>

              {/* 5-Star Rating */}
              <div className="flex items-center gap-1 mb-2.5 sm:mb-3.5">
                {[...Array(activeTestimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#4F8F45] text-[#4F8F45]" />
                ))}
              </div>

              {/* Quote Body with Consistent Height */}
              <blockquote className="text-xs xs:text-sm sm:text-base md:text-[17px] font-normal text-[#13251F] leading-relaxed tracking-tight mb-4 sm:mb-5 relative z-10 italic min-h-[55px] sm:min-h-[84px] md:min-h-[90px] flex items-center">
                "{activeTestimonial.review}"
              </blockquote>
            </div>

            {/* Author Details (Fixed at bottom) */}
            <div className="flex items-center gap-3 sm:gap-3.5 border-t border-[#E5E0D5] pt-3 sm:pt-4 mt-auto">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EBF7E7] border-2 border-[#4F8F45] flex items-center justify-center text-[#4F8F45] shrink-0 shadow-xs">
                <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm text-[#13251F]">
                    {activeTestimonial.name}
                  </h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4F8F45]" title="Verified Traveler" />
                </div>
                <p className="text-[11px] text-[#5C6E67] font-medium">{activeTestimonial.role}</p>
                <div className="flex items-center gap-1 text-[10.5px] text-[#4F8F45] font-semibold mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{activeTestimonial.destination}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-1 rounded-full transition-all ${currentIndex === idx ? 'w-6 bg-[#4F8F45]' : 'w-1.5 bg-[#E5E0D5]'
                  }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default VacationPlanner
