import { api } from '~/lib/api'

export async function getCategoryListApi() {
  const { data } = await api.get('/categories/list')
  return data
}

export async function deleteCategoryApi(payload) {
  const { data } = await api.delete(`/categories/${payload.id}`)
  return data
}

export async function createCategoryApi(payload) {
  const { data } = await api.post('/categories', payload)
  return data
}

export async function updateCategoryApi(payload) {
  const { data } = await api.put(`/categories/${payload.id}`, payload)
  return data
}
