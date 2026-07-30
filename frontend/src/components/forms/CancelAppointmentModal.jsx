import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { FormField, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { useToast } from '../ui/Toast'
import { XCircle, Calendar, User } from 'lucide-react'
import api from '../../services/api/axios'
import { useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  cancel_reason: z.string().min(1, 'Cancellation reason is required'),
  cancel_notes: z.string().optional(),
})

export function CancelAppointmentModal({ isOpen, onClose, appointment }) {
  const toast = useToast()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      cancel_reason: 'Patient Cancelled',
      cancel_notes: '',
    },
  })

  const onSubmit = async (data) => {
    if (!appointment?.id) return
    setIsSubmitting(true)

    try {
      await api.post(`/appointments/${appointment.id}/cancel/`, data)

      toast.success('Appointment Cancelled', 'Session marked as cancelled successfully.')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      reset()
      onClose()
    } catch (err) {
      toast.error('Cancellation Failed', err?.response?.data?.message || 'Could not cancel appointment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!appointment) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={XCircle}
      maxWidth="max-w-xl"
      title={`Cancel Appointment: ${appointment.patient_name || 'Patient'}`}
      subtitle="Provide a cancellation reason to update appointment status"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
            Back
          </Button>
          <Button
            variant="danger"
            icon={XCircle}
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            Confirm Cancellation
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Session Info Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <User className="w-4 h-4 text-blue-600" />
            <span>{appointment.patient_name}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{appointment.appointment_date} ({appointment.start_time?.slice(0, 5)})</span>
          </div>
        </div>

        {/* Cancellation Reason Dropdown */}
        <FormField label="Cancellation Reason" required error={errors.cancel_reason?.message}>
          <Select {...register('cancel_reason')}>
            <option value="Patient Did Not Attend">Patient Did Not Attend</option>
            <option value="Patient Cancelled">Patient Cancelled</option>
            <option value="Therapist Unavailable">Therapist Unavailable</option>
            <option value="Emergency">Emergency</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Other">Other</option>
          </Select>
        </FormField>

        {/* Optional Remarks */}
        <FormField label="Optional Remarks / Cancellation Notes" error={errors.cancel_notes?.message}>
          <Textarea
            placeholder="Add any specific context regarding the cancellation..."
            rows={3}
            {...register('cancel_notes')}
          />
        </FormField>
      </form>
    </Modal>
  )
}

export default CancelAppointmentModal
