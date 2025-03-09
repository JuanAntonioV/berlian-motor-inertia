import StaffService from '#services/staff_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class StaffController {
  async show({ inertia }: HttpContext) {
    return inertia.render('staffs/ManageStaffPage')
  }

  async showCreate({}: HttpContext) {}

  async showEdit({}: HttpContext) {}

  async list(c: HttpContext) {
    const res = await StaffService.list(c)
    return c.response.status(res.code).json(res)
  }

  async detail(c: HttpContext) {
    const res = await StaffService.detail(c)
    return c.response.status(res.code).json(res)
  }

  async create(c: HttpContext) {
    const res = await StaffService.create(c)
    return c.response.status(res.code).json(res)
  }

  async update(c: HttpContext) {
    const res = await StaffService.update(c)
    return c.response.status(res.code).json(res)
  }

  async delete(c: HttpContext) {
    const res = await StaffService.delete(c)
    return c.response.status(res.code).json(res)
  }
}
