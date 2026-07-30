import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react'
import { loginSchema } from '../components/forms/schemas'
import { FormField, Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ui/Toast'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@cliniccare.com',
      password: 'admin123',
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await login(data)
      if (response?.success) {
        toast.success('Login Successful', 'Welcome back to Clinic Care System.')
        navigate('/dashboard')
      } else {
        toast.error('Authentication Failed', response?.message || 'Invalid credentials.')
      }
    } catch (err) {
      toast.error('Login Error', err?.message || 'Server connection failed.')
    }
  }

  // Pre-fill demo credentials for quick dev testing
  const setDemoRole = (role) => {
    if (role === 'admin') {
      setValue('email', 'admin@cliniccare.com')
      setValue('password', 'admin123')
    } else if (role === 'therapist') {
      setValue('email', 'sarah.jenkins@cliniccare.com')
      setValue('password', 'therapist123')
    } else if (role === 'receptionist') {
      setValue('email', 'reception@cliniccare.com')
      setValue('password', 'reception123')
    }
  }

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl animate-scale-in">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-xl shadow-indigo-500/20 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Clinic Care System</h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise Clinic Management Portal</p>
        </div>

        {/* Demo Quick Selector */}
        <div className="mb-6 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Dev Demo Quick Login</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDemoRole('admin')}
              className="py-1.5 px-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg font-semibold hover:bg-indigo-500/20 transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('therapist')}
              className="py-1.5 px-2 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-lg font-semibold hover:bg-sky-500/20 transition-colors"
            >
              Therapist
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('receptionist')}
              className="py-1.5 px-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
            >
              Receptionist
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Email Address" required error={errors.email?.message}>
            <Input type="email" icon={Mail} placeholder="user@cliniccare.com" {...register('email')} />
          </FormField>

          <FormField label="Password" required error={errors.password?.message}>
            <Input type="password" icon={Lock} placeholder="••••••••" {...register('password')} />
          </FormField>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting} iconRight={ArrowRight}>
            Sign In to Dashboard
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
