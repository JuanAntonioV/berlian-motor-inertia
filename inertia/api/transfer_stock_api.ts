import { api } from '~/lib/api'
import { TSearchParamsData } from '~/types'

export async function getTransferStockListApi() {
  const { data } = await api.get('/transfer-stocks/list')
  return data
}

export async function getTransferStockStatsApi() {
  const { data } = await api.get('/transfer-stocks/stats')
  return data
}

export async function getTransferStockDetailApi({ id }: TSearchParamsData<string>) {
  const { data } = await api.get(`/transfer-stocks/${id}`)
  return data
}

export async function createTransferStockApi(payload) {
  const { data } = await api.post('/transfer-stocks', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
