import React from 'react'
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
} from 'lucide-react'

import { useDashboardQuery } from '../hooks/queries/useDashboardQuery'
import { StatCard, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { TableContainer, Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table'
import { BarChart, DonutChart } from '../components/ui/Charts'
import { CardSkeleton, TableSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'

export function DashboardPage() {
  const { data: dashboard, isLoading, error, refetch } = useDashboardQuery()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
        title="Failed to Load Dashboard"
        description={error?.message || 'Could not fetch operational metrics from backend.'}
        actionLabel="Retry Loading"
        onAction={refetch}
      />
    )
  }

  const scheduleList = dashboard?.today_schedule || []
  const recentPatients = dashboard?.recent_patients || []
  const recentActivity = dashboard?.recent_activity || []
  const weeklyVolume = dashboard?.weekly_volume || []
  const statusBreakdown = dashboard?.status_breakdown || []

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Clinic Operational Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time clinical metrics, today's schedule, and patient progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/appointments">
            <Button variant="primary" size="md" icon={Calendar}>View Full Calendar</Button>
          </Link>
        </div>
      </div>

      {/* Top 5 Metrics Row */}
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
          iconBg="bg-sky-500/10 text-sky-400 border-sky-500/20"
          description="Registered patients"
        />
        <StatCard
          title="Active Therapists"
          value={dashboard?.therapists_count ?? 7}
          icon={Stethoscope}
          iconBg="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          description="Full staff capacity"
        />
        <StatCard
          title="Pending Session Notes"
          value={dashboard?.pending_notes_count ?? 5}
          icon={FileText}
          iconBg="bg-amber-500/10 text-amber-400 border-amber-500/20"
          description="Action required"
        />
        <StatCard
          title="AI Summaries"
          value={dashboard?.ai_summaries_count ?? 3}
          icon={Sparkles}
          iconBg="bg-violet-500/10 text-violet-400 border-violet-500/20"
          description="Generated today"
        />
      </div>

      {/* Schedule & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle icon={Clock}>Today's Schedule</CardTitle>
              <CardDescription>Appointments booked for today</CardDescription>
            </div>
            <Link to="/appointments">
              <Button variant="ghost" size="sm" iconRight={ArrowRight}>View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {scheduleList.length === 0 ? (
              <p className="p-6 text-xs text-slate-400 text-center">No appointments scheduled for today.</p>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {scheduleList.map((appt) => (
                  <div key={appt.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <p className="text-xs font-bold text-indigo-400">{appt.start_time || '09:00'}</p>
                        <p className="text-[10px] text-slate-500">{appt.room_number || 'Room 101'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{appt.patient_name || 'Patient'}</h4>
                        <p className="text-xs text-slate-400">{appt.therapist_name || 'Therapist'}</p>
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Audit Activity (1 Col) */}
        <Card>
          <CardHeader>
            <CardTitle icon={Activity}>Recent Clinic Activity</CardTitle>
            <CardDescription>Live audit log feed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-slate-800/60 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-200 font-medium">{act.action}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{act.user} • {act.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Weekly Appointment Volume
          </h3>
          <BarChart data={weeklyVolume} />
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Session Status Breakdown</h3>
          <DonutChart data={statusBreakdown} />
        </Card>
      </div>

      {/* Recent Patients Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle icon={Users}>Recent Patients</CardTitle>
            <CardDescription>Latest active patient registrations</CardDescription>
          </div>
          <Link to="/patients">
            <Button variant="ghost" size="sm" iconRight={ArrowRight}>View Directory</Button>
          </Link>
        </CardHeader>
        <TableContainer className="border-0 rounded-none">
          <Table>
            <TableHeader>
              <TableRow hoverable={false}>
                <TableHead>Patient Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Therapist</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPatients.length === 0 ? (
                <TableRow hoverable={false}>
                  <TableCell colSpan={5} className="text-center text-xs text-slate-400 py-6">
                    No patient records found.
                  </TableCell>
                </TableRow>
              ) : (
                recentPatients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold text-white">{p.full_name || `${p.first_name} ${p.last_name}`}</TableCell>
                    <TableCell className="text-slate-300">{p.phone}</TableCell>
                    <TableCell className="text-slate-400">{p.assigned_therapist_name || 'Unassigned'}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'active' ? 'success' : p.status === 'pending' ? 'warning' : 'neutral'} dot>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/patients/${p.id}`}>
                        <Button variant="ghost" size="sm">View Detail</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  )
}

export default DashboardPage
