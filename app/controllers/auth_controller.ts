import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async showLogin({}: HttpContext) {}

  async doLogin({}: HttpContext) {}

  async doLogout({}: HttpContext) {}

  async getUser({}: HttpContext) {}
}
