import User from '#models/user'
import AuthService from '#services/auth_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async showLogin({ inertia }: HttpContext) {
    const isAdminExist = await User.isAdminExist()

    return inertia.render('auth/LoginPage', {
      isAdminExist: !!isAdminExist,
    })
  }

  async doLogin(ctx: HttpContext) {
    const res = await AuthService.doLogin(ctx)
    return ctx.response.status(res.code).json(res)
  }

  async doLogout(ctx: HttpContext) {
    const res = await AuthService.doLogout(ctx)
    return ctx.response.status(res.code).json(res)
  }

  async generateAdmin(ctx: HttpContext) {
    const res = await AuthService.generateAdmin(ctx)
    return ctx.response.status(res.code).json(res)
  }

  async getUser(ctx: HttpContext) {
    const res = await AuthService.getUser(ctx)
    return ctx.response.status(res.code).json(res)
  }
}
