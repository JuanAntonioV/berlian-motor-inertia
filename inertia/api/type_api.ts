import { api } from '~/lib/api'

export async function getTypeListApi() {
  const { data } = await api.get('/types/list')
  return data
}

export async function deleteTypeApi(payload) {
  const { data } = await api.delete(`/types/${payload.id}`)
  return data
}

export async function createTypeApi(payload) {
  const { data } = await api.post('/types', payload)
  return data
}

export async function updateTypeApi(payload) {
  const { data } = await api.put(`/types/${payload.id}`, payload)
  return data
}
