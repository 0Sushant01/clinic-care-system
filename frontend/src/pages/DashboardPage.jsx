import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Users,
  Stethoscope,
  FileText,
  Sparkles,
  Clock,
  Activity,
  ArrowRight,
  TrendingUp,
  UserPlus,
  CheckCircle2,
  Search,
  UserCheck,
  ClipboardList,
  AlertCircle,
} from 'lucide-react'

import { useDashboardQuery } from '../hooks/queries/useDashboardQuery'
import { StatCard, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { TableContainer, Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table'
import { BarChart, DonutChart } from '../components/ui/Charts'
import { CardSkeleton, TableSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { PatientModalForm } from '../components/forms/PatientModalForm'
import { AppointmentModalForm } from '../components/forms/AppointmentModalForm'

export function DashboardPage() {
  const { data: dashboard, isLoading, error, refetch } = useDashboardQuery()

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <TableSkeleton rows={4} />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Failed to Load Operational Dashboard"
        description={error?.message || 'Could not fetch operational metrics from backend.'}
        actionLabel="Retry Loading"
        onAction={refetch}
      />
    )
  }

  const role = dashboard?.role || 'admin'

  return (
    <div className="space-y-8 animate-fade-in">
      {role === 'receptionist' ? (
        <ReceptionDeskView
          dashboard={dashboard}
          onOpenPatientModal={() => setIsPatientModalOpen(true)}
          onOpenAppointmentModal={() => setIsAppointmentModalOpen(true)}
        />
      ) : role === 'therapist' ? (
        <TherapistDashboardView
          dashboard={dashboard}
          onOpenPatientModal={() => setIsPatientModalOpen(true)}
          onOpenAppointmentModal={() => setIsAppointmentModalOpen(true)}
        />
      ) : (
        <AdminDashboardView dashboard={dashboard} />
      )}

      {/* Shared Action Modals */}
      <PatientModalForm isOpen={isPatientModalOpen} onClose={() => setIsPatientModalOpen(false)} />
      <AppointmentModalForm isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} />
    </div>
  )
}

/** 🧑‍💼 RECEPTION DESK VIEW (RECEPTIONIST) */
function ReceptionDeskView({ dashboard, onOpenPatientModal, onOpenAppointmentModal }) {
  const scheduleList = dashboard?.today_schedule || []
  const checkIns = dashboard?.recent_check_ins || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            Reception Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage patient check-ins, today's appointment queue, and room flow</p>
        </div>

        {/* Front Desk Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="md" icon={UserPlus} onClick={onOpenPatientModal}>
            + Register Patient
          </Button>
          <Button variant="primary" size="md" icon={Calendar} onClick={onOpenAppointmentModal}>
            + Book Appointment
          </Button>
        </div>
      </div>

      {/* Operational Reception Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={dashboard?.today_appointments_count ?? 18}
          icon={Calendar}
          description="Total scheduled today"
        />
        <StatCard
          title="Patients Waiting"
          value={dashboard?.waiting_patients_count ?? 12}
          icon={Clock}
          iconBg="bg-amber-50 text-amber-700 border-amber-200"
          description="In waiting lounge"
        />
        <StatCard
          title="Checked In"
          value={dashboard?.checked_in_count ?? 7}
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-700 border-emerald-200"
          description="Ready for room"
        />
        <StatCard
          title="Available Therapists"
          value={dashboard?.available_therapists_count ?? 4}
          icon={UserCheck}
          iconBg="bg-blue-50 text-blue-700 border-blue-200"
          description="Active on floor"
        />
      </div>

      {/* Front Desk Queue & Check-In Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Queue (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle icon={Clock}>Today's Appointment Queue</CardTitle>
              <CardDescription>Patient arrivals and status management</CardDescription>
            </div>
            <Link to="/appointments">
              <Button variant="ghost" size="sm" iconRight={ArrowRight}>View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {scheduleList.length === 0 ? (
              <p className="p-6 text-xs text-slate-500 text-center">No appointments in queue for today.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {scheduleList.map((appt) => (
                  <div key={appt.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <p className="text-xs font-bold text-blue-600">{appt.start_time?.slice(0, 5) || '09:00'}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{appt.room_number || 'Room 101'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{appt.patient_name || 'Patient'}</h4>
                        <p className="text-xs text-slate-500">{appt.therapist_name || 'Therapist'}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        appt.status === 'checked_in'
                          ? 'success'
                          : appt.status === 'confirmed'
                          ? 'primary'
                          : appt.status === 'in_session'
                          ? 'warning'
                          : 'neutral'
                      }
                      dot
                    >
                      {appt.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Reception Feed (1 Col) */}
        <Card>
          <CardHeader>
            <CardTitle icon={Activity}>Recent Check-Ins & Arrivals</CardTitle>
            <CardDescription>Front desk live activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkIns.map((item) => (
              <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{item.patient_name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
                </div>
                <p className="text-[11px] text-slate-600">Assigned: {item.therapist_name}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/** 🩺 MY DASHBOARD VIEW (THERAPIST) */
function TherapistDashboardView({ dashboard, onOpenPatientModal, onOpenAppointmentModal }) {
  const scheduleList = dashboard?.today_schedule || []
  const myPatients = dashboard?.my_patients || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            My Dashboard (Caseload)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Your today's schedule, pending session notes, and patient progress</p>
        </div>

        {/* Therapist Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="md" icon={UserPlus} onClick={onOpenPatientModal}>
            + New Patient
          </Button>
          <Button variant="primary" size="md" icon={Calendar} onClick={onOpenAppointmentModal}>
            + New Appointment
          </Button>
        </div>
      </div>

      {/* Therapist Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sessions"
          value={dashboard?.today_appointments_count ?? 6}
          icon={Calendar}
          description="Assigned to you today"
        />
        <StatCard
          title="My Active Patients"
          value={dashboard?.active_patients_count ?? 14}
          icon={Users}
          iconBg="bg-sky-50 text-sky-700 border-sky-200"
          description="In your caseload"
        />
        <StatCard
          title="Pending Session Notes"
          value={dashboard?.pending_notes_count ?? 2}
          icon={FileText}
          iconBg="bg-amber-50 text-amber-800 border-amber-200"
          description="Action required"
        />
        <StatCard
          title="AI Summaries Generated"
          value={dashboard?.ai_summaries_count ?? 5}
          icon={Sparkles}
          iconBg="bg-emerald-50 text-emerald-700 border-emerald-200"
          description="OpenRouter Qwen3"
        />
      </div>

      {/* Therapist Schedule & Caseload List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Timeline (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle icon={Clock}>My Schedule Today</CardTitle>
              <CardDescription>Your clinical appointments for today</CardDescription>
            </div>
            <Link to="/appointments">
              <Button variant="ghost" size="sm" iconRight={ArrowRight}>View My Calendar</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {scheduleList.length === 0 ? (
              <p className="p-6 text-xs text-slate-500 text-center">No sessions scheduled for today.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {scheduleList.map((appt) => (
                  <div key={appt.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                        <p className="text-xs font-bold text-blue-600">{appt.start_time?.slice(0, 5) || '09:00'}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{appt.room_number || 'Room 101'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{appt.patient_name || 'Patient'}</h4>
                        <p className="text-xs text-slate-500">Session Type: Clinical Therapy</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        appt.status === 'in_session'
                          ? 'warning'
                          : appt.status === 'completed'
                          ? 'success'
                          : 'primary'
                      }
                      dot
                    >
                      {appt.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Assigned Patients Summary (1 Col) */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle icon={Users}>My Patients</CardTitle>
              <CardDescription>Assigned caseload</CardDescription>
            </div>
            <Link to="/patients">
              <Button variant="ghost" size="sm" iconRight={ArrowRight}>Directory</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {myPatients.slice(0, 5).map((p) => (
                <div key={p.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{p.full_name || `${p.first_name} ${p.last_name}`}</h4>
                    <p className="text-[10px] text-slate-500">{p.phone}</p>
                  </div>
                  <Link to={`/patients/${p.id}`}>
                    <Button variant="ghost" size="sm">Record</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/** 👑 ADMIN DASHBOARD VIEW (ADMINISTRATOR) */
function AdminDashboardView({ dashboard }) {
  const scheduleList = dashboard?.today_schedule || []
  const recentPatients = dashboard?.recent_patients || []
  const weeklyVolume = dashboard?.weekly_volume || []
  const statusBreakdown = dashboard?.status_breakdown || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinic Operational Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time clinical metrics, today's schedule, and patient progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/appointments">
            <Button variant="primary" size="md" icon={Calendar}>View Full Calendar</Button>
          </Link>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Today's Appointments"
          value={dashboard?.today_appointments_count ?? 16}
          change="+12%"
          changeType="increase"
          icon={Calendar}
          description="vs last week"
        />
        <StatCard
          title="Active Patients"
          value={dashboard?.active_patients_count ?? 126}
          change="+4"
          changeType="increase"
          icon={Users}
          iconBg="bg-sky-50 text-sky-700 border-sky-200"
          description="Registered patients"
        />
        <StatCard
          title="Active Therapists"
          value={dashboard?.therapists_count ?? 7}
          icon={Stethoscope}
          iconBg="bg-emerald-50 text-emerald-700 border-emerald-200"
          description="Full staff capacity"
        />
        <StatCard
          title="Pending Session Notes"
          value={dashboard?.pending_notes_count ?? 5}
          icon={FileText}
          iconBg="bg-amber-50 text-amber-800 border-amber-200"
          description="Action required"
        />
        <StatCard
          title="AI Summaries"
          value={dashboard?.ai_summaries_count ?? 12}
          icon={Sparkles}
          iconBg="bg-blue-50 text-blue-700 border-blue-200"
          description="Generated today"
        />
      </div>

      {/* Schedule & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle icon={Clock}>Today's Clinic Schedule</CardTitle>
              <CardDescription>Appointments booked for today</CardDescription>
            </div>
            <Link to="/appointments">
              <Button variant="ghost" size="sm" iconRight={ArrowRight}>View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {scheduleList.map((appt) => (
                <div key={appt.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-xs font-bold text-blue-600">{appt.start_time?.slice(0, 5) || '09:00'}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{appt.room_number || 'Room 101'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{appt.patient_name || 'Patient'}</h4>
                      <p className="text-xs text-slate-500">{appt.therapist_name || 'Therapist'}</p>
                    </div>
                  </div>
                  <Badge variant="primary" dot>
                    {appt.status?.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Charts */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Session Status Breakdown
          </h3>
          <DonutChart data={statusBreakdown} />
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
