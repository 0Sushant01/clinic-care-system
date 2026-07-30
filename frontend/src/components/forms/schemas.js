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
