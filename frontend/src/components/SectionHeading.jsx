import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  linkText,
  linkTo,
  align = 'left',
  theme = 'dark', // 'dark' (for dark green bg) or 'light' (for cream bg)
  className = '',
}) => {
  const isLight = theme === 'light'

  return (
    <div
      className={`w-full flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6 ${
        align === 'center' ? 'text-center md:items-center' : ''
      } ${className}`}
    >
      <div className={align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <div
            className={`inline-flex items-center gap-2.5 mb-3 text-[11px] uppercase tracking-[0.22em] font-semibold ${
              isLight ? 'text-[#4F8F45]' : 'text-[#6FCF45]'
            } ${align === 'center' ? 'justify-center' : ''}`}
          >
            <span className="w-5 h-[1.5px] bg-[#6FCF45]" />
            <span>{eyebrow}</span>
          </div>
        )}

        {title && (
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.18] ${
              isLight ? 'text-[#13251F]' : 'text-[#FFFFFF]'
            }`}
          >
            {title}
          </h2>
        )}

        {subtitle && (
          <p
            className={`mt-3 text-xs sm:text-sm leading-relaxed font-normal ${
              isLight ? 'text-[#5C6E67]' : 'text-[#A8B5AF]'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {linkText && linkTo && (
        <Link
          to={linkTo}
          className={`group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest pb-1 transition-colors ${
            isLight
              ? 'text-[#13251F] hover:text-[#4F8F45]'
              : 'text-white hover:text-[#6FCF45]'
          }`}
        >
          <span>{linkText}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}

export default SectionHeading
