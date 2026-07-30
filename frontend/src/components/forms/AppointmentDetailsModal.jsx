import React from 'react'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { CheckCircle2, XCircle, FileText, Sparkles, User, Calendar, Clock, AlertCircle } from 'lucide-react'

export function AppointmentDetailsModal({ isOpen, onClose, appointment }) {
  if (!appointment) return null

  const isCompleted = appointment.status === 'completed' || appointment.status === 'checked_out'
  const isCancelled = appointment.status === 'cancelled'

  const note = appointment.session_note_detail
  const aiSummary = note?.ai_enhanced_summary

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={isCancelled ? XCircle : CheckCircle2}
      maxWidth="max-w-4xl"
      title={`Appointment Record: ${appointment.patient_name || 'Patient'}`}
      subtitle={`Session details for ${appointment.appointment_date}`}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Record
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Patient & Appointment Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center border ${
                isCancelled
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
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
            <Badge variant={isCancelled ? 'danger' : 'success'} dot>
              {isCancelled ? 'Cancelled' : 'Completed'}
            </Badge>
          </div>
        </div>

        {/* STATE A: CANCELLED APPOINTMENT DETAILS */}
        {isCancelled ? (
          <div className="space-y-6">
            <div className="p-4 bg-red-50/70 border border-red-100 rounded-2xl flex items-center gap-3 text-red-800 text-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="font-medium">
                No clinical note was created because this appointment was cancelled.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Cancellation Metadata</span>
                {appointment.cancelled_at && (
                  <span className="font-mono text-slate-500 text-[11px]">
                    Cancelled At: {new Date(appointment.cancelled_at).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cancellation Reason</span>
                  <p className="font-bold text-red-700 text-sm">{appointment.cancel_reason || 'Not Specified'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cancelled By</span>
                  <p className="font-semibold text-slate-900">{appointment.cancelled_by_name || 'Clinic Staff'}</p>
                </div>

                {appointment.cancel_notes && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Optional Remarks & Notes</span>
                    <p className="text-slate-800 font-medium leading-relaxed">{appointment.cancel_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* STATE B: COMPLETED APPOINTMENT CLINICAL DETAILS */
          <div className="space-y-8">
            {/* Section 1: Original Therapist Clinical Record */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Therapist Clinical Record (Legal Source of Truth)</span>
              </div>

              {!note ? (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-200">
                  No detailed clinical note recorded for this appointment.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Chief Complaint</span>
                    <p className="text-slate-900 font-medium leading-relaxed">{note.chief_complaint || 'N/A'}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Treatment Performed</span>
                    <p className="text-slate-900 font-medium leading-relaxed">{note.treatment_performed || note.treatment_given || 'N/A'}</p>
                  </div>

                  <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Assessment & Session Notes</span>
                    <p className="text-slate-900 font-medium leading-relaxed whitespace-pre-line">{note.session_notes || 'N/A'}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Patient Response</span>
                    <p className="text-slate-900 font-medium leading-relaxed">{note.patient_response || 'N/A'}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recommendations & Home Exercise</span>
                    <p className="text-slate-900 font-medium leading-relaxed">{note.recommendations || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: AI Enhanced Summary */}
            {aiSummary && (
              <div className="space-y-5 pt-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs tracking-wider uppercase">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>AI Enhanced Summary (Read Only)</span>
                  </div>
                  {note?.ai_generated_at && (
                    <span className="text-[11px] font-mono text-slate-500">
                      Generated: {new Date(note.ai_generated_at).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Summary</span>
                    <p className="text-slate-900 leading-relaxed">{aiSummary.summary}</p>
                  </div>

                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Clinical Impression</span>
                    <p className="text-slate-900 leading-relaxed">{aiSummary.clinical_impression}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AppointmentDetailsModal
