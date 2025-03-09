import { staffValidator, updateStaffValidator } from '#validators/staff'
import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import Staff from '#models/user'
import { errors as lucidErrors } from '@adonisjs/lucid'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { unlink } from 'node:fs/promises'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import Role from '#models/role'

export default class StaffService {
  static async list({ auth }: HttpContext) {
    const user = auth.user

    if (!user) {
      return ResponseHelper.unauthorizedResponse('Anda tidak memiliki akses')
    }

    const userRoles = await Staff.getRoles(user)
    const isSuperAdmin = userRoles.some((role) => role.slug === 'super-admin')

    try {
      const staffs = await Staff.query()
        .preload('roles', (q) => {
          q.select('id', 'name').preload('permissions', (qs) => {
            qs.select('id', 'name')
          })
        })
        .orderBy('created_at', 'desc')
        .exec()

      let permissions: string[] = []
      let roles: string[] = []

      staffs.forEach((staff) => {
        if (staff.image) {
          const absolutePath = `${env.get('APP_URL')}${staff.image}`
          staff.image = absolutePath
        }

        permissions = staff.roles
          .map((role) => role.permissions.map((permission) => permission.name))
          .flat()

        roles = staff.roles.map((role) => role.name)
      })

      const staffWithPermissions = staffs
        .map((staff) => {
          return {
            ...staff.serialize(),
            totalRoles: roles.length,
            roles,
            totalPermissions: permissions.length,
            permissions,
          }
        })
        .filter((staff: any) => {
          if (user && user.id === staff.id) {
            return false
          }

          // if user is not super admin then filter out super admin
          if (!isSuperAdmin) {
            return !staff.roles.some((role: any) => role.slug === 'super-admin')
          }

          return true
        })

      return ResponseHelper.okResponse(staffWithPermissions)
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async create({ request }: HttpContext) {
    const { name, email, phone, roles, password } = await request.validateUsing(staffValidator)

    const isRoleValid = await Role.query().whereIn('id', roles)
    if (isRoleValid.length !== roles.length) {
      return ResponseHelper.badRequestResponse('Terdapat peran yang tidak valid')
    }

    try {
      const newStaff = new Staff()
      newStaff.fullName = name
      newStaff.email = email
      newStaff.phone = phone
      newStaff.password = password

      const image = request.file('image')

      if (image) {
        const filename = `${cuid()}.${image.extname}`
        const folderPath = 'storage/uploads'
        await image.move(app.makePath(folderPath), {
          name: filename,
        })

        const filePath = `/${folderPath}/${filename}`
        newStaff.image = filePath
      }

      await newStaff.save()

      await newStaff.related('roles').sync(roles)

      await Staff.hashPassword(newStaff)

      return ResponseHelper.okResponse(newStaff, 'Produk berhasil dibuat')
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async update({ request, params }: HttpContext) {
    const { name, email, phone, roles } = await request.validateUsing(updateStaffValidator)

    const isRoleValid = await Role.query().whereIn('id', roles)
    if (isRoleValid.length !== roles.length) {
      return ResponseHelper.badRequestResponse('Terdapat peran yang tidak valid')
    }

    try {
      const staff = await Staff.findOrFail(params.id)

      staff.fullName = name
      staff.email = email
      staff.phone = phone

      const image = request.file('image')

      if (image) {
        const oldImage = staff.image

        if (oldImage) {
          const path = `storage/uploads/${oldImage}`
          await unlink(app.makePath(path)).catch((e) => {
            logger.info(`Failed to delete old profile image: ${e.message}`)
          })
        }

        const filename = `${cuid()}.${image.extname}`
        const folderPath = 'storage/uploads'
        await image.move(app.makePath(folderPath), {
          name: filename,
        })

        const filePath = `/${folderPath}/${filename}`
        staff.image = filePath
      }

      await staff.save()

      return ResponseHelper.okResponse(staff, 'Produk berhasil diupdate')
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse(err.message)
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async delete({ params }: HttpContext) {
    try {
      const staff = await Staff.findOrFail(params.id)

      if (staff.image) {
        const path = `storage/uploads/${staff.image}`
        await unlink(app.makePath(path)).catch((e) => {
          logger.info(`Failed to delete old profile image: ${e.message}`)
        })
      }

      await staff.delete()

      return ResponseHelper.okResponse(staff, 'Produk berhasil dihapus')
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse(err.message)
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async detail({ params }: HttpContext) {
    const id = params.id

    try {
      const staff = await Staff.query()
        .where('id', id)

        .first()

      if (!staff) {
        return ResponseHelper.notFoundResponse('Produk tidak ditemukan')
      }

      if (staff.image) {
        const absolutePath = `${env.get('APP_URL')}${staff.image}`
        staff.image = absolutePath
      }

      return ResponseHelper.okResponse(staff)
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse(err.message)
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async getDetailById(id: number) {
    try {
      const staff = await Staff.query()
        .where('id', id)

        .first()

      if (!staff) {
        return ResponseHelper.notFoundResponse('Produk tidak ditemukan')
      }

      if (staff.image) {
        const absolutePath = `${env.get('APP_URL')}${staff.image}`
        staff.image = absolutePath
      }

      return staff
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return null
      }

      throw err
    }
  }
}
