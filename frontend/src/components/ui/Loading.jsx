import React from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Clinic Care System — Loading & Skeleton Components
 */

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  }

  return (
    <Loader2 className={`animate-spin text-indigo-500 ${sizeClasses[size] || sizeClasses.md} ${className}`} />
  )
}

export const PulseSkeleton = ({ className = '', height = 'h-4', width = 'w-full', rounded = 'rounded-md' }) => (
  <div className={`bg-slate-800/60 animate-pulse ${height} ${width} ${rounded} ${className}`} />
)

export const FullPageLoader = ({ label = 'Loading application...' }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
    <div className="relative flex items-center justify-center mb-4">
      <div className="absolute w-16 h-16 rounded-full border-4 border-indigo-500/20 animate-ping" />
      <Spinner size="lg" />
    </div>
    <p className="text-sm font-medium text-slate-300 animate-pulse">{label}</p>
  </div>
)

export const CardSkeleton = () => (
  <div className="p-5 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <PulseSkeleton width="w-1/3" height="h-4" />
      <PulseSkeleton width="w-8" height="h-8" rounded="rounded-xl" />
    </div>
    <PulseSkeleton width="w-1/2" height="h-8" />
    <PulseSkeleton width="w-2/3" height="h-3" />
  </div>
)

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full space-y-3 p-4 bg-slate-900/80 border border-slate-800/80 rounded-2xl animate-pulse">
    <div className="flex justify-between pb-3 border-b border-slate-800">
      <PulseSkeleton width="w-1/4" height="h-4" />
      <PulseSkeleton width="w-1/4" height="h-4" />
      <PulseSkeleton width="w-1/4" height="h-4" />
    </div>
    {Array.from({ length: rows }).map((_, idx) => (
      <div key={idx} className="flex justify-between items-center py-2">
        <PulseSkeleton width="w-1/3" height="h-4" />
        <PulseSkeleton width="w-1/4" height="h-4" />
        <PulseSkeleton width="w-1/6" height="h-6" rounded="rounded-full" />
      </div>
    ))}
  </div>
)

export default Spinner
