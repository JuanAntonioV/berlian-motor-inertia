import { api } from '~/lib/api'

export async function resetPasswordApi(payload) {
  const { data } = await api.post('/profile/reset-password', payload)
  return data
}
