import React, { useState, useEffect } from 'react'
import { Search, Menu, Calendar as CalendarIcon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import NotificationDropdown from './NotificationDropdown'
import CommandPaletteModal from '../ui/CommandPaletteModal'

export const Topbar = ({ onOpenMobileMenu }) => {
  const { user } = useAuth()
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-xs">
        {/* Left Side: Mobile Hamburger Menu & Global Search */}
        <div className="flex items-center gap-3 max-w-md w-full">
          {/* Hamburger Menu Toggle Button (< 1024px) */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="Open Mobile Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Trigger Button */}
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            className="relative w-full cursor-pointer group"
          >
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <div className="w-full bg-slate-50 border border-slate-200 text-slate-500 text-xs rounded-xl pl-9 pr-12 py-2 group-hover:border-slate-300 group-hover:bg-white transition-all duration-150 flex items-center justify-between">
              <span className="truncate">Search patients, staff, commands...</span>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:block">
              <span className="text-[10px] font-mono font-semibold bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                ⌘K
              </span>
            </div>
          </div>
        </div>

        {/* Right Utility Group */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Date Display */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
            <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>{todayStr}</span>
          </div>

          {/* Notification Center Bell */}
          <NotificationDropdown />

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user?.full_name || 'Staff User'}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'Staff'}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-200 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0">
              {user?.first_name ? user.first_name[0] : 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  )
}

export default Topbar
