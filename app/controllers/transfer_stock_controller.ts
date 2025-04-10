import TransferStock from '#models/transfer_stock'
import TransferStockService from '#services/transfer_stock_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class TransferStockController {
  async show({ inertia }: HttpContext) {
    return inertia.render('transferStocks/ManageTransferStockPage')
  }
  async showDetail({ inertia, request }: HttpContext) {
    const id = request.param('id')

    return inertia.render('transferStocks/DetailTransferStockPage', {
      id,
    })
  }

  async showCreate({ inertia }: HttpContext) {
    const generatedInvoiceNumber = await TransferStock.generateInvoiceNumber()

    return inertia.render('transferStocks/CreateTransferStockPage', {
      generatedId: generatedInvoiceNumber,
    })
  }

  async list(c: HttpContext) {
    const res = await TransferStockService.list(c)
    return c.response.status(res.code).json(res)
  }

  async stats(c: HttpContext) {
    const res = await TransferStockService.stats(c)
    return c.response.status(res.code).json(res)
  }

  async detail(c: HttpContext) {
    const res = await TransferStockService.detail(c)
    return c.response.status(res.code).json(res)
  }

  async create(c: HttpContext) {
    const res = await TransferStockService.create(c)
    return c.response.status(res.code).json(res)
  }

  async downloadAttachment(c: HttpContext) {
    return await TransferStockService.downloadAttachment(c)
  }
}
