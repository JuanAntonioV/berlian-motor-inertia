import StorageService from '#services/storage_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class StorageController {
  async show({ inertia }: HttpContext) {
    return inertia.render('storages/ManageStoragePage')
  }

  async list(c: HttpContext) {
    const res = await StorageService.list(c)
    return c.response.status(res.code).json(res)
  }

  async create(c: HttpContext) {
    const res = await StorageService.create(c)
    return c.response.status(res.code).json(res)
  }

  async update(c: HttpContext) {
    const res = await StorageService.update(c)
    return c.response.status(res.code).json(res)
  }

  async delete(c: HttpContext) {
    const res = await StorageService.delete(c)
    return c.response.status(res.code).json(res)
  }
}
