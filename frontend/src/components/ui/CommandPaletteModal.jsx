import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Calendar,
  UserPlus,
  FileText,
  Users,
  LayoutDashboard,
  BarChart3,
  Settings,
  User,
  ArrowRight,
  X,
} from 'lucide-react'
import { Modal } from './Modal'

export function CommandPaletteModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const quickActions = [
    { label: 'Book New Appointment', path: '/appointments', icon: Calendar },
    { label: 'Register New Patient', path: '/patients', icon: UserPlus },
    { label: 'Create Session SOAP Note', path: '/session-notes', icon: FileText },
  ]

  const navigationItems = [
    { label: 'Go to Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Go to Patient Directory', path: '/patients', icon: Users },
    { label: 'Go to Appointment Calendar', path: '/appointments', icon: Calendar },
    { label: 'Go to Staff Management', path: '/staff', icon: Users },
    { label: 'Go to Session Notes', path: '/session-notes', icon: FileText },
    { label: 'Go to Clinical Reports', path: '/reports', icon: BarChart3 },
    { label: 'Go to My Profile', path: '/profile', icon: User },
    { label: 'Go to System Settings', path: '/settings', icon: Settings },
  ]

  const handleSelect = (path) => {
    navigate(path)
    onClose()
    setQuery('')
  }

  const filteredNavigation = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl" className="!p-0 border-0 shadow-2xl">
      <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
        <Search className="w-5 h-5 text-blue-600 shrink-0" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command or search patients, staff, navigation (Ctrl+K)..."
          className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 max-h-96 overflow-y-auto custom-scrollbar space-y-4">
        {/* Quick Actions Group */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Quick Actions
          </p>
          <div className="space-y-1">
            {quickActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(action.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{action.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Navigation Pages
          </p>
          <div className="space-y-1">
            {filteredNavigation.map((item, idx) => {
              const Icon = item.icon
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{item.path}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CommandPaletteModal
