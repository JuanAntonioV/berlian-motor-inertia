import ProfileService from '#services/profile_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ inertia }: HttpContext) {
    return inertia.render('profiles/ProfilePage')
  }

  async update(ctx: HttpContext) {
    const res = await ProfileService.update(ctx)
    return ctx.response.status(res.code).json(res)
  }

  async doResetPassword(ctx: HttpContext) {
    const res = await ProfileService.doResetPassword(ctx)
    return ctx.response.status(res.code).json(res)
  }
}
