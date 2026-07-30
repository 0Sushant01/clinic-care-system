import React from 'react'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useUserDetailQuery } from '../../hooks/queries/useUsersQuery'
import { FullPageLoader } from '../ui/Loading'
import { User } from 'lucide-react'

export const StaffDetailModal = ({ isOpen, onClose, userId }) => {
  const { data: user, isLoading } = useUserDetailQuery(userId)

  if (!userId) return null

  const profile = user?.therapist_profile || {}

  const formattedLastLogin = user?.last_login
    ? new Date(user.last_login).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never'

  const formattedCreated = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={User}
      title="Staff Member Details"
      subtitle="Complete profile, operational workload metrics, and activity history"
      maxWidth="max-w-4xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Profile
        </Button>
      }
    >
      {isLoading ? (
        <div className="py-8">
          <FullPageLoader label="Loading staff profile..." />
        </div>
      ) : !user ? (
        <p className="text-xs text-slate-400 text-center py-6">Could not load staff profile.</p>
      ) : (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 border border-blue-500 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm">
              {user.first_name ? user.first_name[0] : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{user.full_name || user.email}</h3>
                <Badge variant={user.role === 'admin' ? 'primary' : user.role === 'therapist' ? 'secondary' : 'neutral'}>
                  {user.role}
                </Badge>
                <Badge variant={user.is_active ? 'success' : 'neutral'} dot>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">{user.email} • {user.phone || 'No phone number'}</p>
            </div>
          </div>

          {/* Workload Metrics (Therapist role) */}
          {user.role === 'therapist' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Active Patients</span>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{user.patients_count ?? 0}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Today's Sessions</span>
                <p className="text-xl font-extrabold text-blue-600 mt-0.5">{user.today_appointments_count ?? 0}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Pending Notes</span>
                <p className="text-xl font-extrabold text-amber-600 mt-0.5">{user.pending_notes_count ?? 0}</p>
              </div>
            </div>
          )}

          {/* Practitioner Professional Info */}
          {user.role === 'therapist' && (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
              <p className="text-xs font-extrabold text-blue-600 uppercase tracking-wider mb-2">Qualifications & License</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-medium">Specialization:</span>{' '}
                  <strong className="text-slate-900">{user.specialization || 'General Clinical Therapy'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">License #:</span>{' '}
                  <strong className="text-slate-900">{profile.license_number || 'CP-98124'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Experience:</span>{' '}
                  <strong className="text-slate-900">{profile.years_of_experience || 5} years</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Hourly Rate:</span>{' '}
                  <strong className="text-emerald-700">${profile.hourly_rate || '120.00'}/hr</strong>
                </div>
              </div>
              {profile.bio && (
                <p className="text-slate-600 pt-3 border-t border-slate-200 italic mt-3">"{profile.bio}"</p>
              )}
            </div>
          )}

          {/* Timestamps & Security */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Last Login</span>
              <span className="font-semibold text-slate-900">{formattedLastLogin}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Created Date</span>
              <span className="font-semibold text-slate-900">{formattedCreated}</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default StaffDetailModal
