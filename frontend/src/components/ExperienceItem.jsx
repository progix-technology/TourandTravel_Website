import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export const ExperienceItem = ({ experience, index }) => {
  return (
    <div className="relative border-b border-white/10 py-4 sm:py-5 lg:py-5.5 transition-colors duration-300 group hover:border-[#6FCF45]/40">
      <Link
        to={experience.link || '/tours'}
        className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10"
      >
        {/* Left Number & Title */}
        <div className="flex items-start md:items-center gap-4 sm:gap-6">
          <span className="text-sm md:text-base font-extrabold tracking-widest text-[#6FCF45] font-mono">
            {experience.number}
          </span>
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white group-hover:text-[#6FCF45] transition-colors duration-300">
              {experience.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#A8B5AF] mt-1 font-normal group-hover:text-white/90 transition-colors">
              {experience.subtitle}
            </p>
          </div>
        </div>

        {/* Right Tag & Arrow (Static Button without jarring hover flash) */}
        <div className="flex items-center gap-3.5 self-end md:self-auto shrink-0">
          <span className="w-[170px] sm:w-[190px] h-[32px] sm:h-[34px] inline-flex items-center justify-center text-center text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#A8B5AF] rounded-[6px] bg-white/5 border border-white/10">
            {experience.tag}
          </span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 shrink-0">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ExperienceItem
