import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Plus,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { AppointmentModalForm } from '../forms/AppointmentModalForm'

export const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/therapists', label: 'Therapists', icon: Stethoscope },
    { path: '/session-notes', label: 'Session Notes', icon: FileText },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none z-30">
        {/* Top Branding Section */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">Clinic Care</h1>
                <p className="text-[11px] text-slate-400 font-medium">Enterprise SaaS</p>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="p-4">
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              fullWidth
              onClick={() => setIsBookModalOpen(true)}
            >
              Book Appointment
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Main Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0">
                {user?.first_name ? user.first_name[0] : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.full_name || user?.email || 'Clinic Staff'}</p>
                <div className="mt-0.5">
                  <Badge variant={user?.role === 'admin' ? 'primary' : user?.role === 'therapist' ? 'secondary' : 'neutral'} size="sm">
                    {user?.role || 'Staff'}
                  </Badge>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Book Appointment Modal */}
      <AppointmentModalForm isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
    </>
  )
}

export default Sidebar
