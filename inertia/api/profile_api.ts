import { api } from '~/lib/api'

export async function resetPasswordApi(payload) {
  const { data } = await api.post('/profile/reset-password', payload)
  return data
}

export async function updateProfileApi(payload) {
  const { data } = await api.put('/profile/update', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
