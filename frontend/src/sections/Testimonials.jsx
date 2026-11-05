import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import TestimonialCard from '../components/TestimonialCard'
import { TESTIMONIALS } from '../utils/mockData'
import reviewService from '../services/reviewService'

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(TESTIMONIALS)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    let isMounted = true
    const fetchReviews = async () => {
      try {
        const liveReviews = await reviewService.getPublic()
        if (isMounted && liveReviews && liveReviews.length > 0) {
          setTestimonials(liveReviews)
        }
      } catch (err) {
        console.warn('Using default testimonials fallback:', err)
      }
    }
    fetchReviews()
    return () => {
      isMounted = false
    }
  }, [])

  const count = testimonials.length || 1

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === count - 1 ? 0 : prev + 1))
  }

  const activeTestimonial = testimonials[currentIndex] || testimonials[0]

  return (
    <section id="testimonials" className="bg-[#FAF8F2] text-[#13251F] py-20 sm:py-24 border-t border-[#E5E0D5]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <SectionHeading
            eyebrow="VOICES OF EXPLORERS"
            title="Voices from the Road"
            subtitle="Read unfiltered reflections from travelers who entrusted their most cherished memories to our curators."
            theme="light"
            className="mb-0"
          />

          {/* Navigation buttons */}
          <div className="flex items-center gap-2 self-start sm:self-end">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-[4px] border border-[#E5E0D5] bg-white flex items-center justify-center text-[#13251F] hover:bg-[#071A16] hover:text-[#6FCF45] hover:border-[#071A16] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-[4px] border border-[#E5E0D5] bg-white flex items-center justify-center text-[#13251F] hover:bg-[#071A16] hover:text-[#6FCF45] hover:border-[#071A16] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Focused Single Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          {activeTestimonial && <TestimonialCard testimonial={activeTestimonial} />}
          
          {/* Indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-[#4F8F45]' : 'w-2 bg-[#E5E0D5]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
