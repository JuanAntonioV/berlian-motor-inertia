import Role from '#models/role'
import StaffService from '#services/staff_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class StaffController {
  async show({ inertia }: HttpContext) {
    return inertia.render('staffs/ManageStaffPage')
  }

  async showCreate({ inertia }: HttpContext) {
    const roleList = await Role.query().select('id', 'name').exec()

    return inertia.render('staffs/CreateStaffPage', {
      roleList: inertia.defer(() => roleList),
    })
  }

  async showEdit({ inertia, params }: HttpContext) {
    const id = params.id
    const roleList = await Role.query().select('id', 'name').exec()

    return inertia.render('staffs/EditStaffPage', {
      roleList: inertia.defer(() => roleList),
      id,
    })
  }

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
