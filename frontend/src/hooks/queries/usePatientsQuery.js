import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import patientsApi from '../../services/api/patients'

export const usePatientsQuery = (params = {}) => {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientsApi.getPatients(params),
    select: (res) => res?.results || res?.data || res,
  })
}

export const usePatientDetailQuery = (id) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientsApi.getPatientById(id),
    enabled: !!id,
    select: (res) => res?.data || res,
  })
}

export const useCreatePatientMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => patientsApi.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
