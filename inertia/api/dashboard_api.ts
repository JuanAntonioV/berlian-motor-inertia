import { api } from '~/lib/api'

export async function getDashboardStatsApi() {
  const { data } = await api.get('/dashboard/stats')
  return data
}
