import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Lock, CheckCircle2 } from 'lucide-react'
import { changePasswordSchema } from './schemas'
import { FormField, Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'
import { useToast } from '../ui/Toast'
import { useChangePasswordMutation } from '../../hooks/queries/useProfileQuery'

export function ChangePasswordForm() {
  const toast = useToast()
  const changePasswordMutation = useChangePasswordMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  const onSubmit = (data) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Password Changed', 'Your password has been updated successfully.')
        reset()
      },
      onError: (err) => {
        toast.error('Password Update Failed', err?.message || 'Could not change password. Verify your current password.')
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={KeyRound}>Security & Password Management</CardTitle>
        <CardDescription>Update your login password securely</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Current Password" required error={errors.old_password?.message}>
            <Input type="password" icon={Lock} placeholder="••••••••" {...register('old_password')} />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="New Password" required error={errors.new_password?.message}>
              <Input type="password" icon={Lock} placeholder="••••••••" {...register('new_password')} />
            </FormField>

            <FormField label="Confirm New Password" required error={errors.confirm_password?.message}>
              <Input type="password" icon={Lock} placeholder="••••••••" {...register('confirm_password')} />
            </FormField>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="secondary"
              size="md"
              isLoading={changePasswordMutation.isPending}
              icon={CheckCircle2}
            >
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordForm
