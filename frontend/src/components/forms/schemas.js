import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const patientSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(1, 'Phone number is required'),
  gender: z.enum(['male', 'female', 'other']),
  status: z.enum(['active', 'pending', 'inactive']),
  medical_history: z.string().optional(),
})

export const appointmentSchema = z.object({
  patient: z.string().min(1, 'Patient selection is required'),
  therapist: z.string().min(1, 'Therapist selection is required'),
  appointment_date: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  room_number: z.string().default('Room 101'),
  notes: z.string().optional(),
})

export const soapNoteSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  subjective: z.string().min(1, 'Subjective observations required'),
  objective: z.string().min(1, 'Objective findings required'),
  assessment: z.string().min(1, 'Clinical assessment required'),
  plan: z.string().min(1, 'Treatment plan required'),
})

export const staffCreateSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    role: z.enum(['therapist', 'receptionist', 'admin']),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(6, 'Password confirmation required'),
    specialization: z.string().optional(),
    license_number: z.string().optional(),
    years_of_experience: z.coerce.number().optional(),
    hourly_rate: z.coerce.number().optional(),
    bio: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export const staffUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['therapist', 'receptionist', 'admin']),
  specialization: z.string().optional(),
  license_number: z.string().optional(),
  years_of_experience: z.coerce.number().optional(),
  hourly_rate: z.coerce.number().optional(),
  bio: z.string().optional(),
})

export const resetPasswordSchema = z
  .object({
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(6, 'Password confirmation required'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  license_number: z.string().optional(),
  years_of_experience: z.coerce.number().optional(),
  bio: z.string().optional(),
  is_available: z.boolean().optional(),
})

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(6, 'New password must be at least 6 characters'),
    confirm_password: z.string().min(6, 'Password confirmation required'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'New passwords do not match',
    path: ['confirm_password'],
  })

export const clinicSettingsSchema = z.object({
  facility_name: z.string().min(1, 'Facility name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  support_email: z.string().email('Invalid support email').optional().or(z.literal('')),
  auto_summary_enabled: z.boolean().optional(),
})
