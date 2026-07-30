import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import profileApi from '../../services/api/profile'

export function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await profileApi.getProfile()
      return response.data
    },
  })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['auth'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data) => profileApi.changePassword(data),
  })
}
