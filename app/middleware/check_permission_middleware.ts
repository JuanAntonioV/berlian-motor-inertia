import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckPermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const userId = ctx.auth.user?.id

    if (userId) {
      const user = await User.query().where('id', userId).first()
      if (!user) {
        return ctx.response.status(403).json({
          message: 'Forbidden',
        })
      }
      const userRoles = await User.getRoles(user)
      const userPermissions = await User.getPermissions(user)

      const path = ctx.request.url().split('/')[1]

      const canAccess = userPermissions.some((permission) => {
        if (userRoles.some((role) => role.slug === 'super-admin' || role.slug === 'admin')) {
          return true
        }
        return permission.startsWith(path)
      })

      if (!canAccess) {
        return ctx.response.redirect('/403')
      }
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
