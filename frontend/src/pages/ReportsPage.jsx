import React, { useState } from 'react'
import { BarChart3, Users, Calendar, CheckCircle2, XCircle, Sparkles, TrendingUp, UserCheck, RefreshCw } from 'lucide-react'
import { useReportsQuery } from '../hooks/queries/useReportsQuery'
import { useAuth } from '../contexts/AuthContext'

import { StatCard, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { BarChart } from '../components/ui/Charts'
import { CardSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { useToast } from '../components/ui/Toast'
import api from '../services/api/axios'

export function ReportsPage() {
  const { user } = useAuth()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('analytics') // 'analytics' | 'ai-summary'
  const [aiSummaryData, setAiSummaryData] = useState(null)
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)

  const { data: report, isLoading, error, refetch } = useReportsQuery()

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true)
    try {
      const res = await api.post('/reports/ai-summary/')
      const payload = res.data?.data || res.data
      setAiSummaryData(payload)
      toast.success('AI Summary Generated', 'Clinic operational & treatment summary created.')
    } catch (err) {
      toast.error('Generation Failed', err?.response?.data?.message || 'Could not generate AI clinic summary.')
    } finally {
      setIsGeneratingAi(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Failed to Load Clinical Reports"
        description={error?.message || 'Could not retrieve clinical performance metrics.'}
        actionLabel="Retry"
        onAction={refetch}
      />
    )
  }

  const role = report?.role || user?.role || 'admin'
  const isTherapistRole = role === 'therapist'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            {isTherapistRole ? 'My Clinical Performance Reports' : 'Clinic Operational Reports'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isTherapistRole
              ? 'Track your clinical caseload, appointment completion rates, and AI practice insights'
              : 'Monitor clinic-wide appointment completion, practitioner workload, and AI summary analytics'}
          </p>
        </div>

        {/* Tab Selection Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinical Analytics
          </button>
          <button
            onClick={() => setActiveTab('ai-summary')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'ai-summary'
                ? 'bg-white text-blue-600 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Summary Tab
          </button>
        </div>
      </div>

      {/* TAB 1: CLINICAL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={isTherapistRole ? "My Patients" : "Total Patients"}
              value={report?.total_patients ?? 126}
              icon={Users}
              description="Active in directory"
            />
            <StatCard
              title={isTherapistRole ? "My Appointments" : "Total Appointments"}
              value={report?.total_appointments ?? 160}
              icon={Calendar}
              description="Booked sessions"
            />
            <StatCard
              title="Completed Sessions"
              value={report?.completed_sessions ?? report?.completed_appointments ?? 142}
              icon={CheckCircle2}
              iconBg="bg-emerald-50 text-emerald-700 border-emerald-200"
              description={`Completion Rate: ${report?.completion_rate || '94.6%'}`}
            />
            <StatCard
              title="Missed / Cancelled"
              value={report?.missed_sessions ?? report?.missed_appointments ?? 8}
              icon={XCircle}
              iconBg="bg-red-50 text-red-700 border-red-200"
              description="Did not attend"
            />
          </div>

          {/* Detailed Analytics Section */}
          {!isTherapistRole ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Therapist Workload Breakdown (2 Cols) */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle icon={UserCheck}>Therapist Workload & Completion</CardTitle>
                  <CardDescription>Sessions completed per practitioner</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {(report?.therapist_workload || []).map((t, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                          <p className="text-[11px] text-slate-500">{t.completed} sessions completed</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-500">Missed: {t.missed}</span>
                          <Badge variant="success" dot>Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Volume Chart (1 Col) */}
              <Card className="p-6">
                <CardTitle icon={TrendingUp}>Weekly Completion Trends</CardTitle>
                <CardDescription className="mb-4">Session volume by day</CardDescription>
                <BarChart data={(report?.appointment_trends || []).map((d) => ({ label: d.label, value: d.completed }))} />
              </Card>
            </div>
          ) : (
            /* Therapist Personal Clinical Activity */
            <Card className="p-6">
              <CardTitle icon={TrendingUp}>My Weekly Session Volume</CardTitle>
              <CardDescription className="mb-4">Completed clinical sessions this week</CardDescription>
              <BarChart data={(report?.clinical_activity || []).map((d) => ({ label: d.label, value: d.completed }))} />
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: AI CLINIC SUMMARY TAB */}
      {activeTab === 'ai-summary' && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <CardTitle icon={Sparkles}>
                  {isTherapistRole ? 'My Personal AI Practice Summary' : 'Clinic-Wide Operational & Clinical AI Summary'}
                </CardTitle>
                <CardDescription>
                  {isTherapistRole
                    ? 'AI summary generated strictly from your completed appointment notes'
                    : 'AI summary analyzing all completed appointment notes and treatment patterns across the clinic'}
                </CardDescription>
              </div>

              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                onClick={handleGenerateAiSummary}
                isLoading={isGeneratingAi}
              >
                {aiSummaryData ? 'Regenerate AI Clinic Summary' : 'Generate AI Clinic Summary'}
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              {!aiSummaryData ? (
                <div className="p-12 bg-blue-50/60 border border-blue-100 rounded-2xl text-center space-y-4">
                  <Sparkles className="w-10 h-10 text-blue-600 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">Generate AI Summary</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Click the button below to generate an overall AI clinical summary analyzing treatment trends, common patient concerns, and practitioner workload.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    icon={Sparkles}
                    onClick={handleGenerateAiSummary}
                    isLoading={isGeneratingAi}
                  >
                    Generate AI Clinic Summary
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Common Patient Concerns */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Common Patient Concerns & Intake Trends</span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-800">
                      {(aiSummaryData.common_patient_concerns || []).map((item, idx) => (
                        <li key={idx} className="font-medium">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Frequently Used Treatments */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Frequently Used Treatments & Interventions</span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-800">
                      {(aiSummaryData.frequently_used_treatments || []).map((item, idx) => (
                        <li key={idx} className="font-medium">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Workload & Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Clinical Observations & Activity</span>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {aiSummaryData.clinical_activity || aiSummaryData.clinical_observations}
                      </p>
                    </div>

                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Practitioner Workload & Capacity</span>
                      <p className="text-slate-800 font-medium leading-relaxed">{aiSummaryData.therapist_workload}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ReportsPage
