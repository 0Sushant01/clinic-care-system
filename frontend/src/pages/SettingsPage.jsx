import React, { useState } from 'react'
import { Settings, Shield, Sparkles, Building, Lock, Save, User, Server } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSettingsQuery, useUpdateSettingsMutation } from '../hooks/queries/useSettingsQuery'
import { useProfileQuery } from '../hooks/queries/useProfileQuery'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { FormField, Input, Toggle } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { CardSkeleton } from '../components/ui/Loading'
import { EmptyState } from '../components/ui/EmptyState'
import { useToast } from '../components/ui/Toast'

import ProfileForm from '../components/forms/ProfileForm'
import ChangePasswordForm from '../components/forms/ChangePasswordForm'

export function SettingsPage() {
  const { user: authUser } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('clinic')

  const { data: settings, isLoading, error, refetch } = useSettingsQuery()
  const { data: profile } = useProfileQuery()
  const updateSettingsMutation = useUpdateSettingsMutation()

  const activeUser = profile || authUser

  const [facilityName, setFacilityName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [autoSummary, setAutoSummary] = useState(true)

  React.useEffect(() => {
    if (settings) {
      setFacilityName(settings.facility_name || 'Clinic Care Medical Center')
      setAddress(settings.address || '')
      setPhone(settings.phone || '')
      setSupportEmail(settings.support_email || '')
      setAutoSummary(settings.auto_summary_enabled ?? true)
    }
  }, [settings])

  const handleSaveSettings = (e) => {
    e.preventDefault()
    updateSettingsMutation.mutate(
      {
        facility_name: facilityName,
        address,
        phone,
        support_email: supportEmail,
        auto_summary_enabled: autoSummary,
      },
      {
        onSuccess: () => {
          toast.success('System Settings Saved', 'Clinic configuration and AI feature flags updated.')
        },
        onError: (err) => {
          toast.error('Save Failed', err?.message || 'Could not update system settings.')
        },
      }
    )
  }

  if (isLoading) return <CardSkeleton />

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Failed to Load Settings"
        description={error?.message || 'Could not fetch system configuration.'}
        actionLabel="Retry"
        onAction={refetch}
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          System Settings & Administration
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage clinic facility configuration, AI feature flags, and administrative preferences</p>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('clinic')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'clinic'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          Clinic Configuration
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'ai'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Feature Flags
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          My Admin Profile
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'system'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Server className="w-4 h-4" />
          System Information
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'clinic' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle icon={Building}>Clinic Facility Information</CardTitle>
              <CardDescription>Organization name, contact details, and support email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Clinic / Facility Name" required>
                <Input
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  placeholder="Facility Name"
                />
              </FormField>

              <FormField label="Facility Street Address">
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Medical Drive, Suite 400"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Clinic Contact Phone">
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="555-0100"
                  />
                </FormField>

                <FormField label="Support Email">
                  <Input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@cliniccare.com"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={updateSettingsMutation.isPending}
              icon={Save}
            >
              Save Clinic Configuration
            </Button>
          </div>
        </form>
      )}

      {activeTab === 'ai' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle icon={Sparkles}>AI Clinical Summarization Status</CardTitle>
              <CardDescription>Safe feature flags for OpenRouter clinical SOAP summaries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Read-Only Production AI Banner */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Production Model Configuration (.env Source of Truth)
                  </span>
                  <Badge variant="success" size="sm">Connected</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 font-medium pt-1">
                  <div>AI Provider: <strong className="text-slate-900">{settings?.ai_provider || 'OpenRouter'}</strong></div>
                  <div>Active Model: <strong className="text-slate-900">{settings?.ai_model || 'Qwen 3 235B'}</strong></div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Note: Production AI models and API credentials remain securely locked to server environment variables.
                </p>
              </div>

              {/* Safe Feature Toggle */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <Toggle
                  label="Enable Automatic AI Session Summary Suggestions"
                  checked={autoSummary}
                  onChange={(e) => setAutoSummary(e.target.checked)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={updateSettingsMutation.isPending}
              icon={Save}
            >
              Save AI Settings
            </Button>
          </div>
        </form>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-6">
          <ProfileForm user={activeUser} />
          <ChangePasswordForm />
        </div>
      )}

      {activeTab === 'system' && (
        <Card>
          <CardHeader>
            <CardTitle icon={Server}>System Infrastructure & Environment</CardTitle>
            <CardDescription>Read-only deployment architecture details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Deployment Type</span>
                <p className="font-bold text-slate-900 mt-0.5">Single Clinic Enterprise SaaS</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-slate-400">API Endpoint</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">/api/v1</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Authentication</span>
                <p className="font-bold text-slate-900 mt-0.5">HttpOnly Cookies + JWT + CSRF</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Database System</span>
                <p className="font-bold text-slate-900 mt-0.5">SQLite / PostgreSQL Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SettingsPage
