import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ inertia }: HttpContext) {
    return inertia.render('profiles/ProfilePage')
  }

  async update({}: HttpContext) {}

  async doResetPassword({}: HttpContext) {}
}
