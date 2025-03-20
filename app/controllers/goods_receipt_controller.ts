import GoodsReceipt from '#models/goods_receipt'
import GoodsReceiptService from '#services/goods_receipt_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class GoodsReceiptController {
  async show({ inertia }: HttpContext) {
    return inertia.render('goodsReceipts/ManageGoodsReceiptPage')
  }
  async showDetail({ inertia }: HttpContext) {
    return inertia.render('goodsReceipts/DetailGoodsReceiptPage')
  }

  async showCreate({ inertia }: HttpContext) {
    const generatedInvoiceNumber = await GoodsReceipt.generateInvoiceNumber()

    return inertia.render('goodsReceipts/CreateGoodsReceiptPage', {
      generatedId: generatedInvoiceNumber,
    })
  }

  async list(c: HttpContext) {
    const res = await GoodsReceiptService.list(c)
    return c.response.status(res.code).json(res)
  }

  async stats(c: HttpContext) {
    const res = await GoodsReceiptService.stats(c)
    return c.response.status(res.code).json(res)
  }

  async detail(c: HttpContext) {
    const res = await GoodsReceiptService.detail(c)
    return c.response.status(res.code).json(res)
  }

  async create(c: HttpContext) {
    const res = await GoodsReceiptService.create(c)
    return c.response.status(res.code).json(res)
  }
}
