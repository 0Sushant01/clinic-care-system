import React from 'react'
import { Stethoscope, Award, Users, CheckCircle2, DollarSign } from 'lucide-react'
import { useTherapistsQuery } from '../hooks/queries/useTherapistsQuery'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { TableSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'

export function TherapistsPage() {
  const { data: therapists, isLoading, error, refetch } = useTherapistsQuery()

  const therapistList = Array.isArray(therapists) ? therapists : therapists?.results || []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-indigo-400" />
            Therapist Roster & Specializations
          </h1>
          <p className="text-xs text-slate-400 mt-1">Licensed clinical practitioners, active patient caseloads, and specializations</p>
        </div>

        <p className="text-xs font-semibold text-slate-400">
          Staff Practitioners: <strong className="text-white">{therapistList.length}</strong>
        </p>
      </div>

      {/* Roster Grid */}
      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Failed to Load Therapists"
          description={error?.message || 'Could not fetch therapist profiles from backend.'}
          actionLabel="Retry"
          onAction={refetch}
        />
      ) : therapistList.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No Therapists Registered"
          description="There are no therapist profiles registered in the system."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {therapistList.map((t) => (
            <Card key={t.id} hoverable className="p-6 border-slate-800/80 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-extrabold text-lg flex items-center justify-center shrink-0">
                      Dr
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{t.full_name || 'Dr. Therapist'}</h3>
                      <p className="text-xs text-slate-400 font-medium">{t.email}</p>
                    </div>
                  </div>

                  <Badge variant={t.is_available ? 'success' : 'neutral'} dot>
                    {t.is_available ? 'Available' : 'Busy'}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-400" />
                      Specialization:
                    </span>
                    <strong className="text-slate-200 text-right">{t.specialization}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      Active Patients:
                    </span>
                    <strong className="text-white">{t.active_patient_count ?? 12}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Hourly Rate:
                    </span>
                    <strong className="text-emerald-400">${t.hourly_rate || '140.00'}/hr</strong>
                  </div>
                </div>

                {t.bio && <p className="text-xs text-slate-400 leading-relaxed italic">"{t.bio}"</p>}
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span>Experience: {t.years_of_experience || 8} years</span>
                <span className="text-indigo-400 font-semibold">Lic #{t.license_number || 'CP-98124'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default TherapistsPage
