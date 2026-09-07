import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  type = 'button',
  icon = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold tracking-widest uppercase transition-all duration-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#6FCF45] focus:ring-offset-2 focus:ring-offset-[#071A16] disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer whitespace-nowrap'

  const sizeStyles = {
    sm: 'text-[11px] px-4 py-2 h-[38px] gap-1.5',
    md: 'text-xs tracking-widest px-6 py-3 h-[48px] gap-2',
    lg: 'text-xs sm:text-[13px] tracking-widest px-8 py-3.5 h-[52px] gap-2.5',
  }

  const variantStyles = {
    // Primary green filled button
    primary:
      'bg-[#6FCF45] text-[#071A16] hover:bg-[#8BE35A] hover:shadow-[0_0_20px_rgba(111,207,69,0.4)] active:scale-[0.98]',
    // Secondary dark translucent with white/green border
    secondary:
      'bg-transparent text-[#FFFFFF] border border-white/25 hover:border-[#6FCF45] hover:text-[#6FCF45] hover:bg-white/[0.03] active:scale-[0.98]',
    // Glass button
    glass:
      'bg-white/10 text-white backdrop-blur-md border border-white/15 hover:bg-white/20 hover:border-white/30',
    // Dark solid button for light backgrounds
    dark:
      'bg-[#071A16] text-[#FFFFFF] hover:bg-[#0B241E] hover:text-[#6FCF45] active:scale-[0.98]',
    // Ghost text button
    ghost:
      'bg-transparent text-white hover:text-[#6FCF45] p-0 h-auto font-medium',
  }

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`

  const content = (
    <>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">{children}</span>
      {icon && (
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  )
}

export default Button
