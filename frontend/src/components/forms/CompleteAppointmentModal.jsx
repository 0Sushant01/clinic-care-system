import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { FormField, Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { useToast } from '../ui/Toast'
import { CheckCircle2, Sparkles, FileText, User, Calendar, Clock } from 'lucide-react'
import api from '../../services/api/axios'
import { useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  chief_complaint: z.string().min(3, 'Chief complaint is required'),
  session_notes: z.string().min(10, 'Session notes must be at least 10 characters'),
  treatment_performed: z.string().min(3, 'Treatment performed is required'),
  patient_response: z.string().min(3, 'Patient response is required'),
  recommendations: z.string().min(3, 'Recommendations are required'),
})

export function CompleteAppointmentModal({ isOpen, onClose, appointment }) {
  const toast = useToast()
  const queryClient = useQueryClient()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generateAi, setGenerateAi] = useState(false)
  const [aiPreview, setAiPreview] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      chief_complaint: '',
      session_notes: '',
      treatment_performed: '',
      patient_response: '',
      recommendations: '',
    },
  })

  const chiefComplaintVal = watch('chief_complaint')
  const treatmentPerformedVal = watch('treatment_performed')
  const patientResponseVal = watch('patient_response')

  useEffect(() => {
    if (isOpen) {
      setGenerateAi(false)
      setAiPreview(null)
      const existingNote = appointment?.session_note_detail
      reset({
        chief_complaint: existingNote?.chief_complaint || '',
        session_notes: existingNote?.session_notes || '',
        treatment_performed: existingNote?.treatment_performed || existingNote?.treatment_given || '',
        patient_response: existingNote?.patient_response || '',
        recommendations: existingNote?.recommendations || '',
      })
    }
  }, [isOpen, appointment, reset])

  const handleGenerateAiPreview = () => {
    setGenerateAi(true)
    setAiPreview({
      summary: `Patient presented with: ${chiefComplaintVal || 'Anxiety & stress management'}. Demonstrated positive engagement during session.`,
      clinical_impression: `Patient exhibits good progress utilizing ${treatmentPerformedVal || 'CBT & Grounding Exercises'}. Emotional regulation improving.`,
      interventions: ['Cognitive Behavioral Therapy (CBT)', 'Diaphragmatic Breathing Exercises'],
      patient_response: patientResponseVal || 'Receptive to homework assignments and demonstrated good insight.',
      risk_level: 'Low',
    })
    toast.success('AI Summary Generated', 'Structured preview ready.')
  }

  const onSubmit = async (data) => {
    if (!appointment?.id) return
    setIsSubmitting(true)

    try {
      await api.post(`/appointments/${appointment.id}/complete/`, {
        ...data,
        generate_ai: generateAi,
      })

      toast.success('Appointment Completed', 'Session completed and clinical note stored successfully.')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      onClose()
    } catch (err) {
      toast.error('Completion Failed', err?.response?.data?.message || 'Could not complete appointment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!appointment) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={CheckCircle2}
      maxWidth="max-w-4xl"
      title={`Complete Appointment: ${appointment.patient_name || 'Patient'}`}
      subtitle="Enter therapist clinical record and generate optional AI summary to complete session"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={CheckCircle2}
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            Save & Complete Appointment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Patient & Session Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 font-bold flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">{appointment.patient_name}</h4>
              <p className="text-slate-500">Therapist: {appointment.therapist_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              {appointment.appointment_date}
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {appointment.start_time?.slice(0, 5)} - {appointment.end_time?.slice(0, 5)}
            </span>
            <Badge variant="primary">{appointment.room_number || 'Room 101'}</Badge>
          </div>
        </div>

        {/* Section 1: Original Therapist Clinical Record */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Therapist Clinical Record (Source of Truth)</span>
          </div>

          <FormField label="Chief Complaint & Intake Concern" required error={errors.chief_complaint?.message}>
            <Input placeholder="e.g. Patient reports exam anxiety and difficulty sleeping..." {...register('chief_complaint')} />
          </FormField>

          <FormField label="Assessment & Session Notes" required error={errors.session_notes?.message}>
            <Textarea
              placeholder="Document clinical observations, dialogue, mental status exam, and coping exercises..."
              className="min-h-[120px]"
              {...register('session_notes')}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Treatment Performed" required error={errors.treatment_performed?.message}>
              <Textarea placeholder="e.g. CBT thought record + 5-4-3-2-1 grounding exercise..." rows={3} {...register('treatment_performed')} />
            </FormField>

            <FormField label="Patient Response" required error={errors.patient_response?.message}>
              <Textarea placeholder="e.g. Receptive to homework assignments, demonstrated good insight..." rows={3} {...register('patient_response')} />
            </FormField>
          </div>

          <FormField label="Recommendations & Home Exercises" required error={errors.recommendations?.message}>
            <Textarea placeholder="e.g. Practice diaphragmatic breathing twice daily and maintain thought journal..." rows={2} {...register('recommendations')} />
          </FormField>
        </div>

        {/* Section 2: AI Enhanced Summary */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>AI Enhanced Summary (Optional)</span>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Sparkles}
              onClick={handleGenerateAiPreview}
            >
              Generate AI Summary Preview
            </Button>
          </div>

          {aiPreview && (
            <div className="p-5 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px]">Read-Only AI Summary Preview</span>
                <Badge variant="success" dot>Risk Level: Low</Badge>
              </div>

              <div className="space-y-2 text-slate-800">
                <p><strong>Summary:</strong> {aiPreview.summary}</p>
                <p><strong>Clinical Impression:</strong> {aiPreview.clinical_impression}</p>
                <p><strong>Patient Response:</strong> {aiPreview.patient_response}</p>
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  )
}

export default CompleteAppointmentModal
