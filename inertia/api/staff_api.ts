import { api } from '~/lib/api'
import { TSearchParamsData } from '~/types'

export async function createStaffApi(payload) {
  const { data } = await api.post('/staffs', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function getStaffListApi() {
  const { data } = await api.get('/staffs/list')
  return data
}

export async function getProducDetail({ id }: TSearchParamsData<number> = {}) {
  const { data } = await api.get(`/staffs/${id}`)
  return data
}

export async function deleteStaffApi(payload) {
  const { data } = await api.delete(`/staffs/${payload.id}`)
  return data
}

export async function updateStaffApi(payload) {
  const { data } = await api.put(`/staffs/${payload.id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
