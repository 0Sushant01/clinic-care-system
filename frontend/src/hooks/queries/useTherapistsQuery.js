import { useQuery } from '@tanstack/react-query'
import therapistsApi from '../../services/api/therapists'

export const useTherapistsQuery = (params = {}) => {
  return useQuery({
    queryKey: ['therapists', params],
    queryFn: () => therapistsApi.getTherapists(params),
    select: (res) => res?.results || res?.data || res,
  })
}
