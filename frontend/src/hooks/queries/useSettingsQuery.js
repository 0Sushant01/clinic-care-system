import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import settingsApi from '../../services/api/settings'

export function useSettingsQuery() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsApi.getSettings()
      return response.data
    },
  })
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => settingsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
