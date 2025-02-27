import { resetPasswordValidator } from '#validators/profile'
import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import User from '#models/user'

export default class ProfileService {
  static async doResetPassword({ request, auth }: HttpContext) {
    const { oldPassword, password } = await request.validateUsing(resetPasswordValidator)

    const user = auth.user!

    try {
      await User.verifyCredentials(user.email, oldPassword)
    } catch (err) {
      return ResponseHelper.badRequestResponse('Password lama salah!')
    }

    try {
      user.password = password
      await user.save()

      await User.hashPassword(user)

      return ResponseHelper.okResponse(null, 'Password berhasil diubah')
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }
}
