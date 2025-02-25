import { api } from '~/lib/api'

export async function loginApi(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function logoutApi() {
  const { data } = await api.delete('/auth/logout')
  return data
}

export async function getUserApi() {
  const { data } = await api.get('/auth/user')
  return data
}
