import { api } from '~/lib/api'
import { TSearchParamsData } from '~/types'

export async function getGoodsReceiptListApi() {
  const { data } = await api.get('/goods-receipts/list')
  return data
}

export async function getGoodsReceiptStatsApi() {
  const { data } = await api.get('/goods-receipts/stats')
  return data
}

export async function getGoodsReceiptDetailApi({ id }: TSearchParamsData<string>) {
  const { data } = await api.delete(`/goods-receipts/${id}`)
  return data
}

export async function createGoodsReceiptApi(payload) {
  const { data } = await api.post('/goods-receipts', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
