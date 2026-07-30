import React from 'react'
import { FolderOpen, AlertCircle } from 'lucide-react'
import { Button } from './Button'

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No Records Found',
  description = 'There are no items to display right now.',
  actionLabel,
  onAction,
  actionIcon,
  variant = 'default',
  className = '',
}) => {
  const isError = variant === 'error'

  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-sm ${className}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${
          isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}
      >
        {isError ? <AlertCircle className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
      </div>

      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant={isError ? 'secondary' : 'primary'} size="sm" icon={actionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}

export default EmptyState
