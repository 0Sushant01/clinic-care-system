import { useQuery } from '@tanstack/react-query'
import dashboardApi from '../../services/api/dashboard'

export const useDashboardQuery = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getDashboardData(),
    select: (res) => res?.data || res,
  })
}
