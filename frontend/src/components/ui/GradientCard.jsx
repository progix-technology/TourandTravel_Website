import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// Define gradient variations for luxury cards
const gradientStyles = {
  orange: 'bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5]/60 to-[#FED7AA]/30 border-orange-200/80 hover:border-orange-400 text-orange-950',
  emerald: 'bg-gradient-to-br from-[#F0FDF4] via-[#DCFCE7]/60 to-[#BBF7D0]/30 border-[#6FCF45]/40 hover:border-[#6FCF45] text-emerald-950',
  purple: 'bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF]/60 to-[#E9D5FF]/30 border-purple-200/80 hover:border-purple-400 text-purple-950',
  teal: 'bg-gradient-to-br from-[#F0FDFA] via-[#CCFBF1]/60 to-[#99F6E4]/30 border-teal-200/80 hover:border-teal-400 text-teal-950',
  darkEmerald: 'bg-gradient-to-br from-[#0F2922] via-[#0B241E] to-[#071A16] border-white/15 hover:border-[#6FCF45] text-white',
}

export const GradientCard = ({
  badgeText,
  badgeColor = '#6FCF45',
  title,
  description,
  ctaText = 'Learn more',
  ctaHref = '/contact',
  imageUrl,
  gradient = 'emerald',
  className = '',
}) => {
  const cardAnimation = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -4 },
  }

  const imageAnimation = {
    rest: { scale: 1, rotate: 0, y: 0 },
    hover: { scale: 1.1, rotate: 3, y: -4 },
  }

  const selectedGradient = gradientStyles[gradient] || gradientStyles.emerald

  return (
    <motion.div
      variants={cardAnimation}
      initial="rest"
      whileHover="hover"
      animate="rest"
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`h-full select-none ${className}`}
    >
      <div
        className={`relative flex flex-col justify-between h-full w-full overflow-hidden rounded-[20px] p-5 sm:p-6 border-2 shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_35px_rgba(111,207,69,0.16)] transition-all duration-300 ${selectedGradient}`}
      >
        {/* Decorative 3D background image */}
        {imageUrl && (
          <motion.img
            src={imageUrl}
            alt={`${title} graphic`}
            variants={imageAnimation}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            className="absolute -right-3 -bottom-3 w-32 sm:w-36 h-32 sm:h-36 object-contain pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] z-0"
          />
        )}

        {/* Card Content */}
        <div className="z-10 flex flex-col h-full justify-between relative">
          <div>
            {/* Pill Badge */}
            <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/85 dark:bg-black/40 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase border border-black/5 shadow-xs w-fit text-[#13251F]">
              <span
                className="h-2 w-2 rounded-full shadow-xs shrink-0"
                style={{ backgroundColor: badgeColor }}
              />
              <span className="leading-none">{badgeText}</span>
            </div>

            {/* Title & Description */}
            <div className="pr-6">
              <h3 className="text-base sm:text-lg font-extrabold font-heading text-[#13251F] mb-2 tracking-tight leading-snug">
                {title}
              </h3>
              <p className="text-xs text-[#4A5D56] leading-relaxed max-w-[220px]">
                {description}
              </p>
            </div>
          </div>

          {/* CTA Link */}
          <div className="pt-4 mt-4 border-t border-black/5">
            <a
              href={ctaHref}
              className="group/cta inline-flex items-center gap-1.5 text-xs font-extrabold text-[#13251F] hover:text-[#2E4A35] uppercase tracking-wider transition-colors"
            >
              <span>{ctaText}</span>
              <div className="w-5 h-5 rounded-full bg-white/85 border border-black/10 flex items-center justify-center group-hover/cta:bg-[#6FCF45] group-hover/cta:border-[#6FCF45] group-hover/cta:text-[#071A16] transition-all">
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GradientCard
