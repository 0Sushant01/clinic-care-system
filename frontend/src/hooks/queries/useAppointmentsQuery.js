import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import appointmentsApi from '../../services/api/appointments'

export const useAppointmentsQuery = (params = {}) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentsApi.getAppointments(params),
    select: (res) => res?.results || res?.data || res,
  })
}

export const useCreateAppointmentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => appointmentsApi.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
