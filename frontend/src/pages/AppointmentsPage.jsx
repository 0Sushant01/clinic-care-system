import React, { useState } from 'react'
import { Calendar, Plus, Clock, Filter, MapPin, User, CheckCircle2 } from 'lucide-react'
import { useAppointmentsQuery } from '../hooks/queries/useAppointmentsQuery'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { TableSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { AppointmentModalForm } from '../components/forms/AppointmentModalForm'

export function AppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)

  const { data: appointments, isLoading, error, refetch } = useAppointmentsQuery({
    status: statusFilter || undefined,
  })

  const apptList = Array.isArray(appointments) ? appointments : appointments?.results || []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            Appointments & Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1">Book, manage, and track clinic appointments across rooms and therapists</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsBookModalOpen(true)}>
          Book Appointment
        </Button>
      </div>

      {/* Controls / Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-semibold">Status Filter:</span>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="!py-2 text-xs w-44"
          >
            <option value="">All Appointments</option>
            <option value="confirmed">Confirmed</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>

        <p className="text-xs font-semibold text-slate-400">Total Bookings: <strong className="text-white">{apptList.length}</strong></p>
      </div>

      {/* Appointment Schedule List */}
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
          {apptList.map((appt) => (
            <Card key={appt.id} hoverable className="p-5 border-slate-800/80 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{appt.patient_name || 'Patient'}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {appt.therapist_name || 'Therapist'}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    appt.status === 'confirmed'
                      ? 'primary'
                      : appt.status === 'completed'
                      ? 'success'
                      : appt.status === 'in_progress'
                      ? 'warning'
                      : 'neutral'
                  }
                  dot
                >
                  {appt.status}
                </Badge>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-slate-300">{appt.appointment_date}</span>
                  <span>({appt.start_time?.slice(0, 5)} - {appt.end_time?.slice(0, 5)})</span>
                </div>

                <div className="flex items-center gap-1.5 font-medium text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{appt.room_number || 'Room 101'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Appointment Modal Form */}
      <AppointmentModalForm isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} />
    </div>
  )
}

export default AppointmentsPage
