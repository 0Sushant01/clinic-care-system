import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Phone, Mail, Award, Save } from 'lucide-react'
import { profileUpdateSchema } from './schemas'
import { FormField, Input, Textarea, Toggle } from '../ui/Input'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { useToast } from '../ui/Toast'
import { useUpdateProfileMutation } from '../../hooks/queries/useProfileQuery'

export function ProfileForm({ user }) {
  const toast = useToast()
  const updateProfileMutation = useUpdateProfileMutation()

  const isTherapist = user?.role === 'therapist'

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      specialization: '',
      license_number: '',
      years_of_experience: 5,
      bio: '',
      is_available: true,
    },
  })

  useEffect(() => {
    if (user) {
      const therapistData = user.therapist_profile || {}
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        specialization: therapistData.specialization || '',
        license_number: therapistData.license_number || '',
        years_of_experience: therapistData.years_of_experience ?? 5,
        bio: therapistData.bio || '',
        is_available: therapistData.is_available ?? true,
      })
    }
  }, [user?.id, user?.updated_at, reset])

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Profile Updated', 'Your personal profile has been updated successfully.')
        reset(data)
      },
      onError: (err) => {
        toast.error('Update Failed', err?.message || 'Could not update personal profile.')
      },
    })
  }

  const isAvailableValue = watch('is_available')

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A'

  const lastLogin = user?.last_login
    ? new Date(user.last_login).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Recent Session'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle icon={User}>Personal Information</CardTitle>
            <CardDescription>Your name, contact phone, and account metadata</CardDescription>
          </div>
          {isDirty && (
            <Badge variant="warning" size="sm">
              Unsaved Changes
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar Banner Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 border-2 border-white text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {user?.first_name ? user.first_name[0] : 'U'}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {user?.full_name || `${user?.first_name} ${user?.last_name}`}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={user?.role === 'admin' ? 'primary' : isTherapist ? 'secondary' : 'neutral'} size="sm">
                    {user?.role || 'Staff'}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-medium">ID: {user?.id}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Member Since</span>
                <span className="font-bold text-slate-800">{memberSince}</span>
              </div>
              <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Last Login</span>
                <span className="font-bold text-slate-800">{lastLogin}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name" required error={errors.first_name?.message}>
              <Input placeholder="First Name" {...register('first_name')} />
            </FormField>

            <FormField label="Last Name" required error={errors.last_name?.message}>
              <Input placeholder="Last Name" {...register('last_name')} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Contact Phone Number" error={errors.phone?.message}>
              <Input icon={Phone} placeholder="555-0199" {...register('phone')} />
            </FormField>

            <FormField label="Email Address (Read-Only)" helperText="Email address is managed by clinic administration">
              <Input icon={Mail} value={user?.email || ''} readOnly className="!bg-slate-100 !text-slate-500 cursor-not-allowed" />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information Card (Therapist Only) */}
      {isTherapist && (
        <Card>
          <CardHeader>
            <CardTitle icon={Award}>Professional Credentials & Clinical Profile</CardTitle>
            <CardDescription>Therapy specialization, medical license, and patient availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Specialization" error={errors.specialization?.message}>
                <Input placeholder="e.g. Cognitive Behavioral Therapy" {...register('specialization')} />
              </FormField>

              <FormField label="License Number" error={errors.license_number?.message}>
                <Input placeholder="e.g. LCSW-89412" {...register('license_number')} />
              </FormField>

              <FormField label="Years of Experience" error={errors.years_of_experience?.message}>
                <Input type="number" placeholder="5" {...register('years_of_experience')} />
              </FormField>
            </div>

            <FormField label="Clinical Biography" helperText="Brief bio displayed to clinic reception and patients">
              <Textarea rows={3} placeholder="Describe clinical expertise, methodology, and focus areas..." {...register('bio')} />
            </FormField>

            <div className="pt-2">
              <Toggle
                label="Available for New Patient Booking"
                checked={isAvailableValue}
                onChange={(e) => setValue('is_available', e.target.checked, { shouldDirty: true })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isDisabled={updateProfileMutation.isPending}
          isLoading={updateProfileMutation.isPending}
          icon={Save}
        >
          Save Profile Changes
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm
