import React, { forwardRef } from 'react'
import { Search } from 'lucide-react'

export const Input = forwardRef(
  ({ className = '', type = 'text', error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={`w-full h-12 py-3 px-4 text-xs font-medium text-slate-900 bg-white border ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
        } rounded-xl shadow-2xs outline-hidden focus:ring-2 transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export const SearchInput = forwardRef(({ className = '', ...props }, ref) => {
  return (
    <div className="relative w-full">
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        ref={ref}
        type="text"
        className={`w-full h-12 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl shadow-2xs outline-hidden transition-all placeholder:text-slate-400 ${className}`}
        {...props}
      />
    </div>
  )
})

SearchInput.displayName = 'SearchInput'

export const Select = forwardRef(
  ({ className = '', children, error, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full h-12 px-4 text-xs font-medium text-slate-900 bg-white border ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
        } rounded-xl shadow-2xs outline-hidden focus:ring-2 transition-all cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'

export const Textarea = forwardRef(
  ({ className = '', error, rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full min-h-[120px] p-4 text-xs font-medium text-slate-900 bg-white border ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-500/20'
        } rounded-xl shadow-2xs outline-hidden focus:ring-2 transition-all placeholder:text-slate-400 ${className}`}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export const Toggle = forwardRef(
  ({ enabled = false, onChange, label, description, className = '' }, ref) => {
    return (
      <div className={`flex items-center justify-between gap-4 ${className}`}>
        {(label || description) && (
          <div>
            {label && <p className="text-xs font-bold text-slate-900">{label}</p>}
            {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
          </div>
        )}

        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange && onChange(!enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
            enabled ? 'bg-blue-600' : 'bg-slate-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'

export const FormField = ({ label, required, error, children, className = '' }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 tracking-tight">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-[11px] font-semibold text-red-600 mt-1">{error}</p>}
    </div>
  )
}
