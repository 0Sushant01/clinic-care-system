import React, { useState, useRef, useEffect } from 'react'
import { Bell, CheckCircle2, AlertCircle, Sparkles, Calendar, UserPlus, X } from 'lucide-react'

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Patient Registered',
      message: 'Sarah Jenkins registered via reception.',
      time: '10 mins ago',
      type: 'patient',
      read: false,
    },
    {
      id: '2',
      title: 'AI Summary Ready',
      message: 'SOAP note clinical summary generated for John Doe.',
      time: '45 mins ago',
      type: 'ai',
      read: false,
    },
    {
      id: '3',
      title: 'Appointment Booked',
      message: 'Session with Dr. Amanda Vance at 14:00 today.',
      time: '2 hours ago',
      type: 'appointment',
      read: true,
    },
  ])

  const dropdownRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDismiss = (id, e) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-scale-in">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <p className="p-6 text-xs text-slate-400 text-center">No notifications right now.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                    )
                  }
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    n.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {n.type === 'patient' && <UserPlus className="w-4 h-4 text-blue-600" />}
                    {n.type === 'ai' && <Sparkles className="w-4 h-4 text-amber-600" />}
                    {n.type === 'appointment' && <Calendar className="w-4 h-4 text-emerald-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{n.title}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5 truncate leading-snug">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">{n.time}</span>
                  </div>

                  <button
                    onClick={(e) => handleDismiss(n.id, e)}
                    className="p-1 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
