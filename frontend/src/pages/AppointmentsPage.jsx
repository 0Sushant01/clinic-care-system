import React, { useState } from 'react'
import { Calendar, Plus, Clock, Filter, MapPin, User, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { useAppointmentsQuery } from '../hooks/queries/useAppointmentsQuery'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { TableSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { AppointmentModalForm } from '../components/forms/AppointmentModalForm'
import { CompleteAppointmentModal } from '../components/forms/CompleteAppointmentModal'
import { CancelAppointmentModal } from '../components/forms/CancelAppointmentModal'
import { AppointmentDetailsModal } from '../components/forms/AppointmentDetailsModal'

export function AppointmentsPage() {
  const { user } = useAuth()
  const role = user?.role || 'admin'
  const isTherapistRole = role === 'therapist'

  const [statusFilter, setStatusFilter] = useState('')
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [completeAppt, setCompleteAppt] = useState(null)
  const [cancelAppt, setCancelAppt] = useState(null)
  const [viewApptDetails, setViewApptDetails] = useState(null)

  const { data: appointments, isLoading, error, refetch } = useAppointmentsQuery({
    status: statusFilter || undefined,
  })

  const apptList = Array.isArray(appointments) ? appointments : appointments?.results || []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            {isTherapistRole ? 'My Appointments & Schedule' : 'Appointments & Schedule'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isTherapistRole
              ? 'Schedule sessions, complete clinical notes, or cancel appointments'
              : 'Book, manage, and track patient appointment flow'}
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsBookModalOpen(true)}>
          Book Appointment
        </Button>
      </div>

      {/* Controls / Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-600 font-semibold">Filter Status:</span>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="!py-2 text-xs w-44"
          >
            <option value="">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>

        <p className="text-xs font-semibold text-slate-500">
          Bookings: <strong className="text-slate-900">{apptList.length}</strong>
        </p>
      </div>

      {/* Appointment Cards Grid */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Failed to Load Schedule"
          description={error?.message || 'Could not fetch appointments from backend.'}
          actionLabel="Retry"
          onAction={refetch}
        />
      ) : apptList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Appointments Found"
          description="There are no scheduled sessions matching your filter."
          actionLabel="Book Appointment"
          onAction={() => setIsBookModalOpen(true)}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apptList.map((appt) => {
            const status = appt.status || 'scheduled'
            const isCompleted = status === 'completed'
            const isCancelled = status === 'cancelled'
            const isScheduled = status === 'scheduled'

            return (
              <Card
                key={appt.id}
                hoverable
                onClick={() => {
                  if (!isScheduled) {
                    setViewApptDetails(appt)
                  }
                }}
                className="p-5 flex flex-col justify-between space-y-4 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isCancelled
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">{appt.patient_name || 'Patient'}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {appt.therapist_name || 'Therapist'}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={isCompleted ? 'success' : isCancelled ? 'danger' : 'primary'}
                    dot
                  >
                    {status.toUpperCase()}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold text-slate-700">{appt.appointment_date}</span>
                    <span>({appt.start_time?.slice(0, 5)} - {appt.end_time?.slice(0, 5)})</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-medium text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{appt.room_number || 'Room 101'}</span>
                  </div>
                </div>

                {/* Binary Actions for Scheduled Sessions */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100"
                >
                  {isScheduled ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={XCircle}
                        onClick={() => setCancelAppt(appt)}
                      >
                        Cancel Appointment
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => setCompleteAppt(appt)}
                      >
                        Complete Appointment
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => setViewApptDetails(appt)}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Book Appointment Modal */}
      <AppointmentModalForm isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />

      {/* Complete Session Modal */}
      <CompleteAppointmentModal
        isOpen={!!completeAppt}
        onClose={() => setCompleteAppt(null)}
        appointment={completeAppt}
      />

      {/* Cancel Session Modal */}
      <CancelAppointmentModal
        isOpen={!!cancelAppt}
        onClose={() => setCancelAppt(null)}
        appointment={cancelAppt}
      />

      {/* Unified Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={!!viewApptDetails}
        onClose={() => setViewApptDetails(null)}
        appointment={viewApptDetails}
      />
    </div>
  )
}

export default AppointmentsPage
