import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientSchema } from './schemas'
import { Modal } from '../ui/Modal'
import { FormField, Input, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { useCreatePatientMutation } from '../../hooks/queries/usePatientsQuery'
import { useToast } from '../ui/Toast'
import { User, Activity, UserPlus } from 'lucide-react'

export const PatientModalForm = ({ isOpen, onClose, onSuccessCallback }) => {
  const toast = useToast()
  const createMutation = useCreatePatientMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      gender: 'female',
      status: 'active',
      medical_history: '',
    },
  })

  const onSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success('Patient Registered', `${data.first_name} ${data.last_name} registered successfully.`)
        reset()
        if (onSuccessCallback && res?.data) {
          onSuccessCallback(res.data)
        }
        onClose()
      },
      onError: (err) => {
        toast.error('Registration Failed', err.message || 'Could not register patient.')
      },
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={UserPlus}
      maxWidth="max-w-4xl"
      title="Register New Patient"
      subtitle="Add a new patient record to the clinic directory"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} isDisabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            isLoading={createMutation.isPending}
          >
            Register Patient
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Demographics */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
            <User className="w-4 h-4 text-blue-600" />
            <span>Demographics & Contact Info</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="First Name" required error={errors.first_name?.message}>
              <Input placeholder="e.g. Eleanor" {...register('first_name')} />
            </FormField>

            <FormField label="Last Name" required error={errors.last_name?.message}>
              <Input placeholder="e.g. Vance" {...register('last_name')} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Phone Number" required error={errors.phone?.message}>
              <Input placeholder="e.g. 555-0192" {...register('phone')} />
            </FormField>

            <FormField label="Email Address" error={errors.email?.message}>
              <Input type="email" placeholder="eleanor@example.com" {...register('email')} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Gender" required error={errors.gender?.message}>
              <Select {...register('gender')}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </Select>
            </FormField>

            <FormField label="Initial Status" required error={errors.status?.message}>
              <Select {...register('status')}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormField>
          </div>
        </div>

        {/* Section 2: Clinical Background */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Clinical Medical Background</span>
          </div>

          <FormField label="Medical History Summary" error={errors.medical_history?.message}>
            <Textarea placeholder="Chief complaint, past conditions, medication history..." rows={3} {...register('medical_history')} />
          </FormField>
        </div>
      </form>
    </Modal>
  )
}

export default PatientModalForm
