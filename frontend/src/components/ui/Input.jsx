import React from 'react'
import { Search, AlertCircle, Check } from 'lucide-react'

/**
 * Clinic Care System — Form Control Components
 * Includes Input, SearchInput, Select, Textarea, Checkbox, Toggle Switch, and FormField wrapper
 */

export const FormField = ({ label, error, helperText, required = false, children, className = '' }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && (
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
        {label}
        {required && <span className="text-rose-400 font-bold">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className="text-xs text-rose-400 flex items-center gap-1 mt-0.5 animate-fade-in">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        {error}
      </p>
    ) : helperText ? (
      <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
    ) : null}
  </div>
)

export const Input = React.forwardRef(({
  type = 'text',
  error = false,
  icon: Icon,
  className = '',
  isDisabled = false,
  ...props
}, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`w-full bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          Icon ? 'pl-9 pr-3' : 'px-3.5'
        } py-2.5 ${
          error
            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
            : 'border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30'
        } ${className}`}
        {...props}
      />
    </div>
  )
})
Input.displayName = 'Input'

export const SearchInput = React.forwardRef(({
  value,
  onChange,
  placeholder = 'Search patients, appointments...',
  className = '',
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      type="text"
      icon={Search}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  )
})
SearchInput.displayName = 'SearchInput'

export const Select = React.forwardRef(({
  options = [],
  error = false,
  className = '',
  isDisabled = false,
  children,
  ...props
}, ref) => {
  return (
    <select
      ref={ref}
      disabled={isDisabled}
      className={`w-full bg-slate-900/80 border text-slate-100 text-sm rounded-lg px-3.5 py-2.5 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        error
          ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
          : 'border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30'
      } ${className}`}
      {...props}
    >
      {children || options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
          {opt.label}
        </option>
      ))}
    </select>
  )
})
Select.displayName = 'Select'

export const Textarea = React.forwardRef(({
  rows = 4,
  error = false,
  className = '',
  isDisabled = false,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      disabled={isDisabled}
      className={`w-full bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm rounded-lg px-3.5 py-2.5 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed ${
        error
          ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
          : 'border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/30'
      } ${className}`}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export const Checkbox = React.forwardRef(({
  label,
  checked = false,
  onChange,
  isDisabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <label className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`w-5 h-5 rounded border transition-all duration-150 ease-in-out flex items-center justify-center ${
            checked
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-500/30'
              : 'bg-slate-900 border-slate-700 hover:border-slate-600'
          }`}
        >
          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-slate-300">{label}</span>}
    </label>
  )
})
Checkbox.displayName = 'Checkbox'

export const Toggle = React.forwardRef(({
  label,
  checked = false,
  onChange,
  isDisabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out border ${
            checked ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out mt-0.5 ${
              checked ? 'translate-x-5.5' : 'translate-x-0.5'
            }`}
          />
        </div>
      </div>
      {label && <span className="text-sm font-medium text-slate-300">{label}</span>}
    </label>
  )
})
Toggle.displayName = 'Toggle'

export default Input
