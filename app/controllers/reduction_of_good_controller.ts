import ReductionOfGood from '#models/reduction_of_good'
import ReductionOfGoodService from '#services/reduction_of_good_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReductionOfGoodController {
  async show({ inertia }: HttpContext) {
    return inertia.render('reductionOfGoods/ManageReductionOfGoodPage')
  }

  async showCreate({ inertia }: HttpContext) {
    const generatedInvoiceNumber = await ReductionOfGood.generateInvoiceNumber()

    return inertia.render('reductionOfGoods/CreateReductionOfGoodPage', {
      generatedId: generatedInvoiceNumber,
    })
  }

  async showDetail({ inertia, request }: HttpContext) {
    const id = request.param('id')

    return inertia.render('reductionOfGoods/DetailReductionOfGoodPage', {
      id,
    })
  }

  async list(c: HttpContext) {
    const res = await ReductionOfGoodService.list(c)
    return c.response.status(res.code).json(res)
  }

  async stats(c: HttpContext) {
    const res = await ReductionOfGoodService.stats(c)
    return c.response.status(res.code).json(res)
  }

  async detail(c: HttpContext) {
    const res = await ReductionOfGoodService.detail(c)
    return c.response.status(res.code).json(res)
  }

  async create(c: HttpContext) {
    const res = await ReductionOfGoodService.create(c)
    return c.response.status(res.code).json(res)
  }

  async downloadAttachment(c: HttpContext) {
    return await ReductionOfGoodService.downloadAttachment(c)
  }
}
