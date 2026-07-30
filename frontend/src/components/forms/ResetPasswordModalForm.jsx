import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from './schemas'
import { Modal } from '../ui/Modal'
import { FormField, Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useResetPasswordMutation } from '../../hooks/queries/useUsersQuery'
import { useToast } from '../ui/Toast'
import { KeyRound } from 'lucide-react'

export const ResetPasswordModalForm = ({ isOpen, onClose, user }) => {
  const toast = useToast()
  const resetMutation = useResetPasswordMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  })

  const onSubmit = (data) => {
    if (!user?.id) return

    resetMutation.mutate(
      { id: user.id, data },
      {
        onSuccess: () => {
          toast.success('Password Reset', `New password set for ${user.full_name || user.email}.`)
          reset()
          onClose()
        },
        onError: (err) => {
          toast.error('Reset Failed', err.message || 'Could not reset staff password.')
        },
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={KeyRound}
      maxWidth="max-w-lg"
      title="Reset Staff Password"
      subtitle={`Set a new account password for ${user?.full_name || user?.email || 'staff member'}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} isDisabled={resetMutation.isPending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={resetMutation.isPending}>
            Set New Password
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="New Password" required error={errors.new_password?.message}>
          <Input type="password" placeholder="••••••••" {...register('new_password')} />
        </FormField>

        <FormField label="Confirm New Password" required error={errors.confirm_password?.message}>
          <Input type="password" placeholder="••••••••" {...register('confirm_password')} />
        </FormField>
      </form>
    </Modal>
  )
}

export default ResetPasswordModalForm
