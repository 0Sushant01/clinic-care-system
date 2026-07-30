import React from 'react'
import { Inbox, SearchX, AlertCircle } from 'lucide-react'
import Button from './Button'

/**
 * Clinic Care System — Empty State Components
 */

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this time.',
  actionLabel,
  onAction,
  actionIcon,
  variant = 'default',
  className = '',
}) => {
  const iconBgs = {
    default: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    search: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }

  const DisplayIcon = variant === 'search' ? SearchX : variant === 'error' ? AlertCircle : Icon

  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-slate-900/60 border border-slate-800/80 rounded-2xl ${className}`}>
      <div className={`p-4 rounded-2xl border ${iconBgs[variant] || iconBgs.default} mb-4 shadow-sm`}>
        <DisplayIcon className="w-8 h-8" />
      </div>

      <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="primary" size="md" onClick={onAction} icon={actionIcon}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}

export default EmptyState
