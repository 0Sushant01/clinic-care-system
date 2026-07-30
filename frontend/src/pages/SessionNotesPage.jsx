import React, { useState } from 'react'
import { FileText, Sparkles, Plus, CheckCircle2, User, Clock, Shield } from 'lucide-react'
import { useSessionNotesQuery, useCreateNoteMutation, useGenerateAISummaryMutation } from '../hooks/queries/useNotesQuery'
import { usePatientsQuery } from '../hooks/queries/usePatientsQuery'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FormField, Select, Textarea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { TableSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { useToast } from '../components/ui/Toast'

export function SessionNotesPage() {
  const toast = useToast()
  const { data: notes, isLoading, error, refetch } = useSessionNotesQuery()
  const { data: patients } = usePatientsQuery()
  const createNoteMutation = useCreateNoteMutation()
  const generateAIMutation = useGenerateAISummaryMutation()

  const [selectedNote, setSelectedNote] = useState(null)
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [subjective, setSubjective] = useState('')
  const [objective, setObjective] = useState('')
  const [assessment, setAssessment] = useState('')
  const [plan, setPlan] = useState('')

  const noteList = Array.isArray(notes) ? notes : notes?.results || []
  const patientList = Array.isArray(patients) ? patients : patients?.results || []

  const handleSaveSOAP = (e) => {
    e.preventDefault()
    if (!selectedPatientId || !subjective || !assessment) {
      toast.error('Validation Error', 'Please select a patient and fill in Subjective & Assessment fields.')
      return
    }

    createNoteMutation.mutate(
      {
        patient: selectedPatientId,
        subjective,
        objective,
        assessment,
        plan,
      },
      {
        onSuccess: () => {
          toast.success('SOAP Note Saved', 'Therapy session note recorded successfully.')
          setSubjective('')
          setObjective('')
          setAssessment('')
          setPlan('')
        },
        onError: (err) => {
          toast.error('Save Failed', err.message || 'Could not save session note.')
        },
      }
    )
  }

  const handleGenerateAI = (noteId) => {
    generateAIMutation.mutate(noteId, {
      onSuccess: (res) => {
        toast.success('AI Summary Generated', 'OpenRouter Qwen3 clinical summary created.')
      },
      onError: (err) => {
        toast.error('AI Summary Failed', err.message || 'Could not generate AI summary.')
      },
    })
  }

  const activeNote = selectedNote || (noteList.length > 0 ? noteList[0] : null)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Therapy Session Notes (SOAP Format)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Clinical documentation, SOAP workspace, and AI session summaries</p>
        </div>
      </div>

      {/* Main Workspace Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Notes Timeline (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="h-full">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle icon={Clock}>Session Log</CardTitle>
                <CardDescription>Recorded SOAP notes</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  <TableSkeleton rows={4} />
                </div>
              ) : error ? (
                <EmptyState
                  variant="error"
                  title="Failed to Load Notes"
                  description={error.message}
                  actionLabel="Retry"
                  onAction={refetch}
                />
              ) : noteList.length === 0 ? (
                <p className="p-6 text-xs text-slate-400 text-center">No session notes recorded yet.</p>
              ) : (
                <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {noteList.map((n) => {
                    const isSelected = activeNote?.id === n.id
                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNote(n)}
                        className={`p-4 cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-600/15 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{n.patient_name || 'Patient'}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">{n.session_date}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-1">{n.subjective}</p>

                        {n.ai_results && n.ai_results.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-violet-400 font-semibold">
                            <Sparkles className="w-3 h-3" />
                            <span>AI Summary Generated</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: SOAP Form & AI Summary Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* New SOAP Note Form */}
          <Card>
            <CardHeader>
              <CardTitle icon={FileText}>Create Clinical SOAP Note</CardTitle>
              <CardDescription>Subjective, Objective, Assessment, and Plan</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSOAP} className="space-y-4">
                <FormField label="Select Patient" required>
                  <Select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                  >
                    <option value="">Select a patient for session note...</option>
                    {patientList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name || `${p.first_name} ${p.last_name}`}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="S — Subjective" required helperText="Patient's reported symptoms & concerns">
                    <Textarea
                      rows={3}
                      value={subjective}
                      onChange={(e) => setSubjective(e.target.value)}
                      placeholder="e.g. Patient feels calmer after practicing deep breathing..."
                    />
                  </FormField>

                  <FormField label="O — Objective" helperText="Clinical observations & vitals">
                    <Textarea
                      rows={3}
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="e.g. Affect congruent, speech normal rate, oriented x4..."
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="A — Assessment" required helperText="Therapist diagnosis & progress evaluation">
                    <Textarea
                      rows={3}
                      value={assessment}
                      onChange={(e) => setAssessment(e.target.value)}
                      placeholder="e.g. Steady progress in anxiety management..."
                    />
                  </FormField>

                  <FormField label="P — Plan" helperText="Interventions & next session homework">
                    <Textarea
                      rows={3}
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      placeholder="e.g. Continue daily exercises. Review CBT worksheet next week..."
                    />
                  </FormField>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={createNoteMutation.isPending}
                    icon={Plus}
                  >
                    Save SOAP Note
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Active Note Preview & AI Summary */}
          {activeNote && (
            <Card className="border-indigo-500/20">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle icon={Shield}>Selected Note: {activeNote.patient_name}</CardTitle>
                  <CardDescription>Date: {activeNote.session_date} | {activeNote.therapist_name}</CardDescription>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Sparkles}
                  isLoading={generateAIMutation.isPending}
                  onClick={() => handleGenerateAI(activeNote.id)}
                >
                  ✨ Generate AI Summary
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Subjective</span>
                    <p className="text-slate-200 mt-1">{activeNote.subjective}</p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Assessment</span>
                    <p className="text-slate-200 mt-1">{activeNote.assessment}</p>
                  </div>
                </div>

                {/* AI Summary Display */}
                {activeNote.ai_results && activeNote.ai_results.length > 0 && (
                  <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-violet-950/40 p-4 rounded-xl border border-violet-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        AI Clinical Summary (OpenRouter Qwen3)
                      </span>
                      <Badge variant="info" size="sm">v1.0 Prompt</Badge>
                    </div>

                    <div className="text-slate-200 space-y-1.5 pt-1">
                      <p><strong>Chief Concern:</strong> {activeNote.ai_results[0].response?.chief_concern || activeNote.subjective}</p>
                      <p><strong>Patient Response:</strong> {activeNote.ai_results[0].response?.patient_response || 'Receptive to treatment plan.'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default SessionNotesPage
