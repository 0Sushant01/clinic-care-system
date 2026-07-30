import React from 'react'
import { User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProfileQuery } from '../hooks/queries/useProfileQuery'
import ProfileForm from '../components/forms/ProfileForm'
import ChangePasswordForm from '../components/forms/ChangePasswordForm'
import { CardSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'

export function ProfilePage() {
  const { user: authUser } = useAuth()
  const { data: profile, isLoading, error, refetch } = useProfileQuery()

  const activeUser = profile || authUser

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          My Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage your personal details, contact information, and security credentials</p>
      </div>

      {isLoading ? (
        <CardSkeleton />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Failed to Load Profile"
          description={error?.message || 'Could not fetch profile details.'}
          actionLabel="Retry"
          onAction={refetch}
        />
      ) : (
        <div className="space-y-6">
          {/* Personal & Professional Profile Form */}
          <ProfileForm user={activeUser} />

          {/* Separate Password Change Card */}
          <ChangePasswordForm />
        </div>
      )}
    </div>
  )
}

export default ProfilePage
