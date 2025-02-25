import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import { loginValidator } from '#validators/auth'

export default class AuthService {
  async doLogin({ request, response, auth }: HttpContext) {
    const { email, password, rememberMe } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user, rememberMe)

      return response.redirect().toRoute('dashboard.page')
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err)
    }
  }

  async doLogout({ auth, response }: HttpContext) {
    try {
      await auth.use('web').logout()
      return response.redirect().toRoute('login.page')
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err)
    }
  }

  async generateAdmin({}: HttpContext) {}

  async getUser({}: HttpContext) {}
}
