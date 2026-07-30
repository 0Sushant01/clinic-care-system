import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import notesApi from '../../services/api/notes'

export const useSessionNotesQuery = (params = {}) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => notesApi.getSessionNotes(params),
    select: (res) => res?.results || res?.data || res,
  })
}

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => notesApi.createSessionNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useGenerateAISummaryMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noteId) => notesApi.generateAISummary(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
