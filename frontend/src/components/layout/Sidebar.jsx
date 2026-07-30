import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  BarChart3,
  Settings,
  User,
  Shield,
  Plus,
  LogOut,
  X,
  ClipboardList,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { AppointmentModalForm } from '../forms/AppointmentModalForm'
import { canManageStaff, canViewReports, isReceptionist, isTherapist } from '../../utils/permissions'

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isAdminRole = user?.role === 'admin'
  const isReceptionistRole = isReceptionist(user)
  const isTherapistRole = isTherapist(user)

  // Role-tailored dynamic menu items
  const mainNavItems = [
    {
      path: '/dashboard',
      label: isReceptionistRole ? 'Reception Desk' : isTherapistRole ? 'My Dashboard' : 'Dashboard',
      icon: isReceptionistRole ? ClipboardList : LayoutDashboard,
    },
    {
      path: '/patients',
      label: 'Patients',
      icon: Users,
    },
    {
      path: '/appointments',
      label: isTherapistRole ? 'My Appointments' : 'Appointments',
      icon: Calendar,
    },
  ]

  if (canManageStaff(user)) {
    mainNavItems.push({ path: '/staff', label: 'Staff', icon: UserCheck })
  }

  if (canViewReports(user)) {
    mainNavItems.push({
      path: '/reports',
      label: 'Reports',
      icon: BarChart3,
    })
  }

  const profileNavItems = [{ path: '/profile', label: 'My Profile', icon: User }]

  if (isAdminRole) {
    profileNavItems.push({ path: '/settings', label: 'Settings', icon: Settings })
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Top Branding Section */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">Clinic Care</h1>
              <p className="text-[11px] text-slate-500 font-medium">Enterprise Portal</p>
            </div>
          </div>

          {/* Close Button for Mobile Drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Action CTA */}
        <div className="p-4">
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            fullWidth
            onClick={() => {
              setIsBookModalOpen(true)
              if (onCloseMobile) onCloseMobile()
            }}
          >
            Book Appointment
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-4">
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {isTherapistRole ? 'Clinical Workspace' : isReceptionistRole ? 'Front Desk Operations' : 'Main Navigation'}
            </p>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (onCloseMobile) onCloseMobile()
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-200/80 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Account & System</p>
            <div className="space-y-1">
              {profileNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (onCloseMobile) onCloseMobile()
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-200/80 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer User Profile & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.first_name ? user.first_name[0] : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">{user?.full_name || user?.email || 'Clinic Staff'}</p>
              <div className="mt-0.5">
                <Badge variant={isAdminRole ? 'primary' : isTherapistRole ? 'secondary' : 'neutral'} size="sm">
                  {user?.role || 'Staff'}
                </Badge>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar (≥ 1024px) */}
      <aside className="hidden lg:block w-70 bg-white border-r border-slate-200 shrink-0 z-30 shadow-xs">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Backdrop Drawer (< 1024px) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Sliding Drawer Container */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Book Appointment Modal */}
      <AppointmentModalForm isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
    </>
  )
}

export default Sidebar
