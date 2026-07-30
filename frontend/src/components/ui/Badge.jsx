import React from 'react'

/**
 * Clinic Care System — Badge Component
 *
 * Supports variants: primary, secondary, success, warning, danger, info, neutral
 * Supports sizes: sm, md
 * Options: dot (pulsing indicator), outline mode
 */

const variantStyles = {
  primary: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  secondary: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  info: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  neutral: 'bg-slate-800 text-slate-300 border-slate-700',
}

const dotColors = {
  primary: 'bg-indigo-400',
  secondary: 'bg-sky-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-rose-400',
  info: 'bg-blue-400',
  neutral: 'bg-slate-400',
}

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px] font-medium gap-1' : 'px-2.5 py-1 text-xs font-semibold gap-1.5'
  const styleClass = variantStyles[variant] || variantStyles.primary

  return (
    <span
      className={`inline-flex items-center rounded-full border ${styleClass} ${sizeClasses} ${className}`}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
        </span>
      )}
      {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{children}</span>
    </span>
  )
}

export default Badge
