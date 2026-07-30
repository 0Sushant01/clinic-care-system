import React, { useState } from 'react'
import { Settings, User, Shield, Sparkles, Save, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { FormField, Input, Select, Toggle } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/Toast'

export function SettingsPage() {
  const { user } = useAuth()
  const toast = useToast()

  const [aiModel, setAiModel] = useState('qwen/qwen3-235b-a22b:free')
  const [autoSummary, setAutoSummary] = useState(true)
  const [clinicName, setClinicName] = useState('Clinic Care Medical Center')

  const handleSaveSettings = (e) => {
    e.preventDefault()
    toast.success('Settings Saved', 'System preferences updated successfully.')
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          Application Settings & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage profile, clinic configuration, and OpenRouter AI model preferences</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle icon={User}>User Profile</CardTitle>
            <CardDescription>Your account details and clinic role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name">
                <Input value={user?.full_name || 'Staff User'} readOnly />
              </FormField>

              <FormField label="Email Address">
                <Input value={user?.email || 'user@cliniccare.com'} readOnly />
              </FormField>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 font-medium">Assigned System Role:</span>
              <Badge variant="primary" size="md">{user?.role || 'Staff'}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Model Settings */}
        <Card>
          <CardHeader>
            <CardTitle icon={Sparkles}>OpenRouter AI Configuration</CardTitle>
            <CardDescription>Configure OpenRouter model provider and automated clinical prompts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Active AI Provider & Model" helperText="OpenRouter proxied through Django backend">
              <Select value={aiModel} onChange={(e) => setAiModel(e.target.value)}>
                <option value="qwen/qwen3-235b-a22b:free">Qwen 3 235B (OpenRouter Free Tier)</option>
                <option value="google/gemini-2.0-flash-001">Google Gemini 2.0 Flash</option>
                <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
              </Select>
            </FormField>

            <Toggle
              label="Automatically offer AI Summary after completing SOAP Note"
              checked={autoSummary}
              onChange={(e) => setAutoSummary(e.target.checked)}
            />
          </CardContent>
        </Card>

        {/* Clinic General Info */}
        <Card>
          <CardHeader>
            <CardTitle icon={Shield}>Clinic Information</CardTitle>
            <CardDescription>Organization name and system details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Clinic / Facility Name">
              <Input
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Clinic Name"
              />
            </FormField>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <p><strong>Deployment Mode:</strong> Single Clinic Production Instance</p>
              <p><strong>Backend API:</strong> <code>http://localhost:8000/api/v1/</code></p>
              <p><strong>Authentication Security:</strong> HttpOnly Cookies + CSRF Protection</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SettingsPage
