import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientSchema } from './schemas'
import { Modal } from '../ui/Modal'
import { FormField, Input, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { useCreatePatientMutation } from '../../hooks/queries/usePatientsQuery'
import { useToast } from '../ui/Toast'

export const PatientModalForm = ({ isOpen, onClose }) => {
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
      onSuccess: () => {
        toast.success('Patient Created', `${data.first_name} ${data.last_name} registered successfully.`)
        reset()
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name" required error={errors.first_name?.message}>
            <Input placeholder="e.g. Eleanor" {...register('first_name')} />
          </FormField>

          <FormField label="Last Name" required error={errors.last_name?.message}>
            <Input placeholder="e.g. Vance" {...register('last_name')} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone Number" required error={errors.phone?.message}>
            <Input placeholder="e.g. 555-0192" {...register('phone')} />
          </FormField>

          <FormField label="Email Address" error={errors.email?.message}>
            <Input type="email" placeholder="eleanor@example.com" {...register('email')} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        <FormField label="Medical History Summary" error={errors.medical_history?.message}>
          <Textarea placeholder="Chief complaint, past conditions, medication history..." rows={3} {...register('medical_history')} />
        </FormField>
      </form>
    </Modal>
  )
}

export default PatientModalForm
