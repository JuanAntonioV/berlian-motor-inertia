import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import { loginValidator } from '#validators/auth'
import env from '#start/env'
import Role from '#models/role'

export default class AuthService {
  static async doLogin({ request, auth }: HttpContext) {
    const { email, password, rememberMe } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user, rememberMe)
      return ResponseHelper.okResponse(null, 'Berhasil login!')
    } catch (err) {
      return ResponseHelper.badRequestResponse('Email atau password salah!')
    }
  }

  static async doLogout({ auth }: HttpContext) {
    await auth.use('web').logout()
    return ResponseHelper.okResponse(null, 'Berhasil logout!')
  }

  static async generateAdmin({ auth }: HttpContext) {
    const isAdminExist = await User.isAdminExist()

    if (isAdminExist) {
      return ResponseHelper.badRequestResponse('Admin sudah digenerate!')
    }

    const defaultEmail = env.get('ADMIN_EMAIL')
    const defaultPassword = env.get('ADMIN_PASSWORD')

    const newAdmin = await User.create({
      email: defaultEmail,
      password: defaultPassword,
      fullName: 'Super Admin',
    })

    await User.hashPassword(newAdmin)

    const adminRole = await Role.query().where('slug', 'super-admin').first()

    if (!adminRole) {
      return ResponseHelper.badRequestResponse('Role Super Admin belum ada!')
    }

    await newAdmin.related('roles').attach([adminRole.id])

    await auth.use('web').login(newAdmin)

    return ResponseHelper.okResponse(null, 'Admin berhasil digenerate!')
  }

  static async getUser({ auth }: HttpContext) {
    const user = auth.user!

    const serializedUser = user.serialize()

    const userWithRoleAndPermissions = {
      ...serializedUser,
      roles: await User.getRoles(user),
      permissions: await User.getPermissions(user),
    }

    return ResponseHelper.okResponse(userWithRoleAndPermissions)
  }
}
