import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import { loginValidator } from '#validators/auth'
import env from '#start/env'
import hash from '@adonisjs/core/services/hash'
import Role from '#models/role'

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

  async generateAdmin({ auth }: HttpContext) {
    try {
      const isAdminExist = await User.isAdminExist()

      if (isAdminExist) {
        return ResponseHelper.badRequestResponse('Admin sudah digenerate!')
      }

      const defaultEmail = env.get('ADMIN_EMAIL')
      const defaultPassword = env.get('ADMIN_PASSWORD')

      const hashedPassword = await hash.make(defaultPassword)

      const newAdmin = await User.create({
        email: defaultEmail,
        password: hashedPassword,
        fullName: 'Super Admin',
      })

      const adminRole = await Role.query().where('slug', 'super-admin').first()

      if (!adminRole) {
        return ResponseHelper.badRequestResponse('Role Super Admin belum ada!')
      }

      await newAdmin.related('roles').attach([adminRole.id])

      await auth.use('web').login(newAdmin)

      return ResponseHelper.okResponse('Admin berhasil digenerate!')
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err)
    }
  }

  async getUser({ auth }: HttpContext) {
    try {
      const user = auth.user!

      const serializedUser = user.serialize()

      const userWithRoleAndPermissions = {
        ...serializedUser,
        roles: await User.getRoles(user),
        permissions: await User.getPermissions(user),
      }

      return ResponseHelper.okResponse(userWithRoleAndPermissions)
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err)
    }
  }
}
