import CategoryService from '#services/category_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoryController {
  async show({ inertia }: HttpContext) {
    return inertia.render('categories/ManageCategoryPage')
  }

  async list(c: HttpContext) {
    const res = await CategoryService.list(c)
    return c.response.status(res.code).json(res)
  }

  async create(c: HttpContext) {
    const res = await CategoryService.create(c)
    return c.response.status(res.code).json(res)
  }

  async update(c: HttpContext) {
    const res = await CategoryService.update(c)
    return c.response.status(res.code).json(res)
  }

  async delete(c: HttpContext) {
    const res = await CategoryService.delete(c)
    return c.response.status(res.code).json(res)
  }
}
