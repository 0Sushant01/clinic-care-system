import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { staffCreateSchema, staffUpdateSchema } from './schemas'
import { Modal } from '../ui/Modal'
import { FormField, Input, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { useToast } from '../ui/Toast'
import { useCreateUserMutation, useUpdateUserMutation } from '../../hooks/queries/useUsersQuery'
import { User, Award, KeyRound, Stethoscope } from 'lucide-react'

export function StaffForm({
  isOpen,
  onClose,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  presetRole = 'therapist', // 'therapist' | 'receptionist' | 'admin'
}) {
  const toast = useToast()
  const createUserMutation = useCreateUserMutation()
  const updateUserMutation = useUpdateUserMutation()

  const isEdit = mode === 'edit'
  const schema = isEdit ? staffUpdateSchema : staffCreateSchema

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: presetRole,
      password: '',
      confirm_password: '',
      specialization: 'Cognitive Behavioral Therapy (CBT)',
      license_number: '',
      years_of_experience: 5,
      hourly_rate: 120.00,
      bio: '',
    },
  })

  const selectedRole = watch('role') || presetRole
  const isTherapist = selectedRole === 'therapist'

  useEffect(() => {
    if (isOpen) {
      if (isEdit && initialData) {
        const therapistData = initialData.therapist_profile || {}
        reset({
          first_name: initialData.first_name || '',
          last_name: initialData.last_name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          role: initialData.role || presetRole,
          specialization: therapistData.specialization || 'General Clinical Therapy',
          license_number: therapistData.license_number || '',
          years_of_experience: therapistData.years_of_experience ?? 5,
          hourly_rate: therapistData.hourly_rate ?? 120.00,
          bio: therapistData.bio || '',
        })
      } else {
        reset({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          role: presetRole,
          password: '',
          confirm_password: '',
          specialization: 'Cognitive Behavioral Therapy (CBT)',
          license_number: '',
          years_of_experience: 5,
          hourly_rate: 120.00,
          bio: '',
        })
      }
    }
  }, [isOpen, isEdit, initialData, presetRole, reset])

  const onSubmit = (data) => {
    if (isEdit) {
      updateUserMutation.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            toast.success('Staff Account Updated', `${data.first_name} ${data.last_name} account updated successfully.`)
            onClose()
          },
          onError: (err) => {
            toast.error('Update Failed', err?.message || 'Could not update staff member.')
          },
        }
      )
    } else {
      createUserMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Staff Account Created', `${data.first_name} ${data.last_name} (${data.role}) account provisioned.`)
          onClose()
        },
        onError: (err) => {
          toast.error('Creation Failed', err?.message || 'Could not create staff account.')
        },
      })
    }
  }

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={Stethoscope}
      maxWidth="max-w-4xl"
      title={isEdit ? `Edit Staff Member: ${initialData?.full_name || initialData?.email}` : `Create New ${selectedRole === 'therapist' ? 'Therapist' : selectedRole === 'receptionist' ? 'Receptionist' : 'Administrator'}`}
      subtitle={isEdit ? "Update basic demographics and professional credentials" : `Provision a new ${selectedRole} account for your clinic`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            {isEdit ? 'Save Changes' : `Create ${selectedRole === 'therapist' ? 'Therapist' : 'Staff Account'}`}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
            <User className="w-4 h-4 text-blue-600" />
            <span>Basic Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="First Name" required error={errors.first_name?.message}>
              <Input placeholder="Jane" {...register('first_name')} />
            </FormField>

            <FormField label="Last Name" required error={errors.last_name?.message}>
              <Input placeholder="Doe" {...register('last_name')} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Email Address" required error={errors.email?.message}>
              <Input type="email" placeholder="jane.doe@cliniccare.com" {...register('email')} />
            </FormField>

            <FormField label="Phone Number" error={errors.phone?.message}>
              <Input placeholder="555-0199" {...register('phone')} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="System Role" required error={errors.role?.message}>
              <Select {...register('role')}>
                <option value="therapist">Therapist (Clinical Staff)</option>
                <option value="receptionist">Receptionist (Front Desk)</option>
                <option value="admin">Administrator (Full Access)</option>
              </Select>
            </FormField>
          </div>
        </div>

        {/* Section 2: Professional Information (Therapist Only) */}
        {isTherapist && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Professional Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Clinical Specialization" error={errors.specialization?.message}>
                <Input placeholder="e.g. Cognitive Behavioral Therapy (CBT)" {...register('specialization')} />
              </FormField>

              <FormField label="Medical License #" error={errors.license_number?.message}>
                <Input placeholder="e.g. CP-98124" {...register('license_number')} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Years Experience" error={errors.years_of_experience?.message}>
                <Input type="number" placeholder="5" {...register('years_of_experience')} />
              </FormField>

              <FormField label="Hourly Therapy Rate ($)" error={errors.hourly_rate?.message}>
                <Input type="number" step="0.01" placeholder="120.00" {...register('hourly_rate')} />
              </FormField>
            </div>

            <FormField label="Professional Biography" error={errors.bio?.message}>
              <Textarea rows={3} placeholder="Licensed clinical psychologist specializing in anxiety and trauma recovery..." {...register('bio')} />
            </FormField>
          </div>
        )}

        {/* Section 3: Account Credentials (Create Mode Only) */}
        {!isEdit && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>Account Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Password" required error={errors.password?.message}>
                <Input type="password" placeholder="••••••••" {...register('password')} />
              </FormField>

              <FormField label="Confirm Password" required error={errors.confirm_password?.message}>
                <Input type="password" placeholder="••••••••" {...register('confirm_password')} />
              </FormField>
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}

export default StaffForm
