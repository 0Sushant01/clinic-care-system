import React, { useState } from 'react'
import { Search, Bell, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Badge } from '../ui/Badge'

export const Topbar = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 z-20 backdrop-blur-md">
      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patients, appointments, therapists (Ctrl+K)..."
          className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-xl pl-9 pr-12 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Utility Group */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 border border-slate-800/60 px-3 py-1.5 rounded-xl">
          <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium text-slate-300">{todayStr}</span>
        </div>

        {/* Notifications Button */}
        <button className="relative p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
        </button>

        {/* User Role Badge */}
        <div className="flex items-center gap-2 border-l border-slate-800/80 pl-4">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-white leading-tight">{user?.full_name || 'Staff User'}</p>
            <p className="text-[10px] text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
