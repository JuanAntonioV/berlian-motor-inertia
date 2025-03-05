import { api } from '~/lib/api'

export async function getStorageListApi() {
  const { data } = await api.get('/storages/list')
  return data
}

export async function deleteStorageApi(payload) {
  const { data } = await api.delete(`/storages/${payload.id}`)
  return data
}

export async function createStorageApi(payload) {
  const { data } = await api.post('/storages', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function updateStorageApi(payload) {
  const { data } = await api.put(`/storages/${payload.id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
