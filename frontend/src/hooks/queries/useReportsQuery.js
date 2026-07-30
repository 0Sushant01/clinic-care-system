import { useQuery } from '@tanstack/react-query'
import reportsApi from '../../services/api/reports'

export const useReportsQuery = (params = {}) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => reportsApi.getReports(params),
    select: (res) => res?.data || res,
  })
}
