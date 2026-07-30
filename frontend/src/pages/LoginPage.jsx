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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
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

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10 animate-scale-in">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-md shadow-blue-600/20 mb-4 text-white">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinic Care System</h1>
          <p className="text-xs text-slate-500 mt-1">Enterprise Clinic Management Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Email Address" required error={errors.email?.message}>
            <Input type="email" icon={Mail} placeholder="name@cliniccare.com" {...register('email')} />
          </FormField>

          <FormField label="Password" required error={errors.password?.message}>
            <Input type="password" icon={Lock} placeholder="••••••••" {...register('password')} />
          </FormField>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting} iconRight={ArrowRight}>
              Sign In to Dashboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
