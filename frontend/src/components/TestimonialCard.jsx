import React from 'react'
import { Star, Quote, MapPin, CheckCircle2, User } from 'lucide-react'

export const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-[#FAF8F2] border border-[#E5E0D5] rounded-[8px] p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[310px] md:min-h-[320px]">
      <div>
        {/* Decorative Quote Icon */}
        <div className="absolute top-6 right-6 text-[#E5E0D5]">
          <Quote className="w-12 h-12 md:w-16 md:h-16 opacity-40" />
        </div>

        {/* 5-Star Rating */}
        <div className="flex items-center gap-1 mb-6">
          {[...Array(testimonial.rating || 5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#4F8F45] text-[#4F8F45]" />
          ))}
        </div>

        {/* Quote Review */}
        <blockquote className="text-base sm:text-lg md:text-xl font-medium text-[#13251F] leading-relaxed tracking-tight mb-8 relative z-10 italic min-h-[90px] sm:min-h-[100px] flex items-center">
          "{testimonial.review}"
        </blockquote>
      </div>

      {/* Author Details */}
      <div className="flex items-center gap-4 border-t border-[#E5E0D5] pt-6 mt-auto">
        <div className="w-12 h-12 rounded-full bg-[#EBF7E7] border-2 border-[#4F8F45] flex items-center justify-center text-[#4F8F45] shrink-0 shadow-xs">
          <User className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-extrabold text-sm sm:text-base text-[#13251F]">
              {testimonial.name}
            </h4>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4F8F45]" title="Verified Traveler" />
          </div>
          <p className="text-xs text-[#5C6E67] font-medium">{testimonial.role}</p>
          <div className="flex items-center gap-1 text-[11px] text-[#4F8F45] font-semibold mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{testimonial.destination}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
