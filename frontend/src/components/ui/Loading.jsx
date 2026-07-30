import React from 'react'
import { Loader2 } from 'lucide-react'

export const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200/70 rounded-xl ${className}`} />
}

export const CardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-36" />
    </div>
  )
}

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

export const FullPageLoader = ({ label = 'Loading...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-xs font-semibold text-slate-500">{label}</p>
    </div>
  )
}

export default CardSkeleton
