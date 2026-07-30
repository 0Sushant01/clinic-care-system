import React from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Clinic Care System — Button Component
 *
 * Supports variants: primary, secondary, outline, ghost, danger, success
 * Supports sizes: sm, md, lg
 * Features: Loading spinner, Icon support (left/right), fullWidth option
 */

const variantStyles = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 border border-indigo-500/30',
  secondary: 'bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white shadow-md shadow-sky-600/20 border border-sky-500/30',
  outline: 'bg-transparent hover:bg-slate-800 active:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600',
  ghost: 'bg-transparent hover:bg-slate-800/60 active:bg-slate-800 text-slate-300 hover:text-white border border-transparent',
  danger: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-md shadow-rose-600/20 border border-rose-500/30',
  success: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 border border-emerald-500/30',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5',
}

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center transition-all duration-150 ease-in-out cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  const combinedClasses = `${baseClasses} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${fullWidth ? 'w-full' : ''} ${className}`

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled || isLoading}
      className={combinedClasses}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
      ) : null}
      
      {children && <span>{children}</span>}

      {!isLoading && IconRight && (
        <IconRight className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
      )}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
