import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema } from './schemas'
import { Modal } from '../ui/Modal'
import { FormField, Input, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { usePatientsQuery } from '../../hooks/queries/usePatientsQuery'
import { useTherapistsQuery } from '../../hooks/queries/useTherapistsQuery'
import { useCreateAppointmentMutation } from '../../hooks/queries/useAppointmentsQuery'
import { useToast } from '../ui/Toast'

export const AppointmentModalForm = ({ isOpen, onClose }) => {
  const toast = useToast()
  const { data: patients } = usePatientsQuery()
  const { data: therapists } = useTherapistsQuery()
  const createMutation = useCreateAppointmentMutation()

  const todayStr = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient: '',
      therapist: '',
      appointment_date: todayStr,
      start_time: '09:00',
      end_time: '10:00',
      room_number: 'Room 101',
      notes: '',
    },
  })

  const onSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Appointment Scheduled', 'Appointment booked successfully.')
        reset()
        onClose()
      },
      onError: (err) => {
        toast.error('Booking Failed', err.message || 'Could not schedule appointment.')
      },
    })
  }

  const patientList = Array.isArray(patients) ? patients : []
  const therapistList = Array.isArray(therapists) ? therapists : []

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book New Appointment"
      subtitle="Schedule a therapy session"
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
            Confirm Booking
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Select Patient" required error={errors.patient?.message}>
          <Select {...register('patient')}>
            <option value="">Select a patient...</option>
            {patientList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name || `${p.first_name} ${p.last_name}`}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Select Therapist" required error={errors.therapist?.message}>
          <Select {...register('therapist')}>
            <option value="">Select a therapist...</option>
            {therapistList.map((t) => (
              <option key={t.id} value={t.user}>
                {t.full_name} ({t.specialization})
              </option>
            ))}
          </Select>
        </FormField>

        <div className="grid grid-cols-3 gap-3">
          <FormField label="Date" required error={errors.appointment_date?.message}>
            <Input type="date" {...register('appointment_date')} />
          </FormField>

          <FormField label="Start Time" required error={errors.start_time?.message}>
            <Input type="time" {...register('start_time')} />
          </FormField>

          <FormField label="End Time" required error={errors.end_time?.message}>
            <Input type="time" {...register('end_time')} />
          </FormField>
        </div>

        <FormField label="Room / Office" error={errors.room_number?.message}>
          <Input placeholder="e.g. Room 101" {...register('room_number')} />
        </FormField>

        <FormField label="Internal Booking Notes" error={errors.notes?.message}>
          <Textarea placeholder="Specific requests or intake notes..." rows={2} {...register('notes')} />
        </FormField>
      </form>
    </Modal>
  )
}

export default AppointmentModalForm
