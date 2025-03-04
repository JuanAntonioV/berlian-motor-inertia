import { api } from '~/lib/api'

export async function getBrandListApi() {
  const { data } = await api.get('/brands/list')
  return data
}

export async function deleteBrandApi(payload) {
  const { data } = await api.delete(`/brands/${payload.id}`)
  return data
}

export async function createBrandApi(payload) {
  const { data } = await api.post('/brands', payload)
  return data
}

export async function updateBrandApi(payload) {
  const { data } = await api.put(`/brands/${payload.id}`, payload)
  return data
}
