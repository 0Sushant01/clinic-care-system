import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema } from './schemas'
import { Modal } from '../ui/Modal'
import { FormField, Input, Select, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { usePatientsQuery } from '../../hooks/queries/usePatientsQuery'
import { useTherapistsQuery } from '../../hooks/queries/useTherapistsQuery'
import { useCreateAppointmentMutation } from '../../hooks/queries/useAppointmentsQuery'
import { useAuth } from '../../contexts/AuthContext'
import { isTherapist } from '../../utils/permissions'
import { useToast } from '../ui/Toast'
import { Calendar, Clock, UserPlus, Stethoscope, User } from 'lucide-react'
import { PatientModalForm } from './PatientModalForm'

export const AppointmentModalForm = ({ isOpen, onClose, defaultPatientId = '' }) => {
  const { user } = useAuth()
  const toast = useToast()
  const isTherapistRole = isTherapist(user)

  const [isNestedPatientModalOpen, setIsNestedPatientModalOpen] = useState(false)

  const { data: patients, refetch: refetchPatients } = usePatientsQuery()
  const { data: therapists } = useTherapistsQuery()
  const createMutation = useCreateAppointmentMutation()

  const todayStr = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient: defaultPatientId || '',
      therapist: isTherapistRole ? user?.id || '' : '',
      appointment_date: todayStr,
      start_time: '09:00',
      end_time: '10:00',
      room_number: 'Room 101',
      notes: '',
    },
  })

  const onSubmit = (data) => {
    // For therapist role, force therapist ID to logged-in user
    const payload = isTherapistRole ? { ...data, therapist: user?.id } : data

    createMutation.mutate(payload, {
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

  const handlePatientCreated = (newPatient) => {
    refetchPatients()
    if (newPatient?.id) {
      setValue('patient', newPatient.id, { shouldValidate: true })
      toast.success('Patient Auto-Selected', `${newPatient.first_name} ${newPatient.last_name} selected for booking.`)
    }
  }

  const patientList = Array.isArray(patients) ? patients : patients?.results || []
  const therapistList = Array.isArray(therapists) ? therapists : therapists?.results || []

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        icon={Calendar}
        maxWidth="max-w-4xl"
        title="Book New Appointment"
        subtitle="Schedule a clinical therapy session"
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Session Participants */}
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Session Participants</span>
              </div>

              {/* Action link to create new patient inline */}
              <button
                type="button"
                onClick={() => setIsNestedPatientModalOpen(true)}
                className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
              >
                <UserPlus className="w-3.5 h-3.5" />
                + Create New Patient
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Select Patient" required error={errors.patient?.message}>
                <Select {...register('patient')}>
                  <option value="">Select a patient...</option>
                  {patientList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name || `${p.first_name} ${p.last_name}`} ({p.phone})
                    </option>
                  ))}
                </Select>
              </FormField>

              {/* Practitioner Field */}
              {isTherapistRole ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-tight">Practitioner</label>
                  <div className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-900">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span>Dr. {user?.full_name || user?.email} (You)</span>
                  </div>
                </div>
              ) : (
                <FormField label="Select Practitioner" required error={errors.therapist?.message}>
                  <Select {...register('therapist')}>
                    <option value="">Select a therapist...</option>
                    {therapistList.map((t) => (
                      <option key={t.id} value={t.user || t.id}>
                        {t.full_name} ({t.specialization || 'Therapist'})
                      </option>
                    ))}
                  </Select>
                </FormField>
              )}
            </div>
          </div>

          {/* Section 2: Time & Location */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Schedule & Room Assignment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField label="Appointment Date" required error={errors.appointment_date?.message}>
                <Input type="date" {...register('appointment_date')} />
              </FormField>

              <FormField label="Start Time" required error={errors.start_time?.message}>
                <Input type="time" {...register('start_time')} />
              </FormField>

              <FormField label="End Time" required error={errors.end_time?.message}>
                <Input type="time" {...register('end_time')} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Room / Office" error={errors.room_number?.message}>
                <Input placeholder="e.g. Room 101" {...register('room_number')} />
              </FormField>
            </div>

            <FormField label="Internal Booking Notes" error={errors.notes?.message}>
              <Textarea placeholder="Specific requests or intake notes..." rows={2} {...register('notes')} />
            </FormField>
          </div>
        </form>
      </Modal>

      {/* Nested Patient Creation Modal */}
      <PatientModalForm
        isOpen={isNestedPatientModalOpen}
        onClose={() => setIsNestedPatientModalOpen(false)}
        onSuccessCallback={handlePatientCreated}
      />
    </>
  )
}

export default AppointmentModalForm
