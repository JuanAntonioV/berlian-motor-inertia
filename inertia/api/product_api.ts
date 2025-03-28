import { api } from '~/lib/api'
import { TSearchParamsData } from '~/types'

export async function createProductApi(payload) {
  const { data } = await api.post('/products', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function getProductListApi({ storageId }: TSearchParamsData<number | undefined> = {}) {
  let url = '/products/list'

  const params = new URLSearchParams()
  if (storageId) params.append('storageId', storageId.toString())
  if (params.toString()) url += `?${params.toString()}`

  const { data } = await api.get(url)
  return data
}

export async function getProductDetail({ id }: TSearchParamsData<number> = {}) {
  const { data } = await api.get(`/products/${id}`)
  return data
}

export async function deleteProductApi(payload) {
  const { data } = await api.delete(`/products/${payload.id}`)
  return data
}

export async function updateProductApi(payload) {
  const { data } = await api.put(`/products/${payload.id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function getProductStockApi({ id }: TSearchParamsData<number> = {}) {
  const { data } = await api.get(`/products/${id}/stock`)
  return data
}

export async function addProductStockApi(payload) {
  const { data } = await api.post(`/products/${payload.id}/stock`, payload)
  return data
}
