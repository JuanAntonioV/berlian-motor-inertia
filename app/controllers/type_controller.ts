import TypeService from '#services/type_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class TypeController {
  async show({ inertia }: HttpContext) {
    return inertia.render('types/ManageTypePage')
  }

  async list(c: HttpContext) {
    const res = await TypeService.list(c)
    return c.response.status(res.code).json(res)
  }

  async create(c: HttpContext) {
    const res = await TypeService.create(c)
    return c.response.status(res.code).json(res)
  }

  async update(c: HttpContext) {
    const res = await TypeService.update(c)
    return c.response.status(res.code).json(res)
  }

  async delete(c: HttpContext) {
    const res = await TypeService.delete(c)
    return c.response.status(res.code).json(res)
  }
}
