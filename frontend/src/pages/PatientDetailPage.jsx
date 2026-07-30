import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Phone, Mail, Calendar, FileText, Activity, Shield, Sparkles } from 'lucide-react'
import { usePatientDetailQuery } from '../hooks/queries/usePatientsQuery'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { FullPageLoader } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'

export function PatientDetailPage() {
  const { id } = useParams()
  const { data: patient, isLoading, error, refetch } = usePatientDetailQuery(id)

  if (isLoading) return <FullPageLoader label="Fetching patient medical record..." />

  if (error || !patient) {
    return (
      <EmptyState
        variant="error"
        title="Patient Record Not Found"
        description={error?.message || 'Could not retrieve patient file from backend.'}
        actionLabel="Back to Directory"
        onAction={() => window.history.back()}
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link to="/patients">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            Back to Directory
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/session-notes">
            <Button variant="secondary" size="sm" icon={FileText}>
              New Session Note
            </Button>
          </Link>
          <Link to="/appointments">
            <Button variant="primary" size="sm" icon={Calendar}>
              Book Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Profile Banner */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-500/20">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-extrabold text-2xl shrink-0 shadow-lg">
              {patient.first_name ? patient.first_name[0] : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {patient.full_name || `${patient.first_name} ${patient.last_name}`}
                </h1>
                <Badge variant={patient.status === 'active' ? 'success' : 'warning'} dot>
                  {patient.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">Patient ID: {patient.id}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
              <Phone className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Phone</p>
                <p className="font-semibold text-slate-200">{patient.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
              <Mail className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Email</p>
                <p className="font-semibold text-slate-200">{patient.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Patient Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Medical History (2 Cols) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle icon={Activity}>Medical History & Background</CardTitle>
            <CardDescription>Clinical summary and pre-existing conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">History Summary</p>
              <p className="text-sm text-slate-200 leading-relaxed">
                {patient.medical_history || 'No pre-existing medical history logged for this patient.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Gender</span>
                <p className="font-semibold text-white capitalize mt-0.5">{patient.gender || 'Not specified'}</p>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Date of Birth</span>
                <p className="font-semibold text-white mt-0.5">{patient.date_of_birth || 'Not recorded'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Therapist & Emergency Contacts (1 Col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle icon={User}>Assigned Therapist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0">
                  Dr
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{patient.assigned_therapist_name || 'Unassigned'}</h4>
                  <p className="text-xs text-slate-400">Lead Therapist</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle icon={Shield}>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400">Name:</span>{' '}
                <strong className="text-white">{patient.emergency_contact_name || 'Not provided'}</strong>
              </div>
              <div>
                <span className="text-slate-400">Phone:</span>{' '}
                <strong className="text-slate-200">{patient.emergency_contact_phone || 'N/A'}</strong>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PatientDetailPage
