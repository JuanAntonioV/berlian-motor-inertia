import { api } from '~/lib/api'
import { TSearchParamsData } from '~/types'

export async function getReductionOfGoodsListApi() {
  const { data } = await api.get('/reduction-of-goods/list')
  return data
}

export async function getReductionOfGoodsStatsApi() {
  const { data } = await api.get('/reduction-of-goods/stats')
  return data
}

export async function getReductionOfGoodsDetailApi({ id }: TSearchParamsData<string>) {
  const { data } = await api.get(`/reduction-of-goods/${id}`)
  return data
}

export async function createReductionOfGoodsApi(payload) {
  const { data } = await api.post('/reduction-of-goods', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
