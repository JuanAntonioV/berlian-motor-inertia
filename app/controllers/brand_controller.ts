import BrandService from '#services/brand_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class BrandController {
  async show({ inertia }: HttpContext) {
    return inertia.render('brands/ManageBrandPage')
  }

  async list(c: HttpContext) {
    const res = await BrandService.list(c)
    return c.response.status(res.code).json(res)
  }

  async create(c: HttpContext) {
    const res = await BrandService.create(c)
    return c.response.status(res.code).json(res)
  }

  async update(c: HttpContext) {
    const res = await BrandService.update(c)
    return c.response.status(res.code).json(res)
  }

  async delete(c: HttpContext) {
    const res = await BrandService.delete(c)
    return c.response.status(res.code).json(res)
  }
}
