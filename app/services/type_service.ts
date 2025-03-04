import { typeValidator, createTypeValidator } from '#validators/type'
import { HttpContext } from '@adonisjs/core/http'
import ResponseHelper from '../helpers/response_helper.js'
import Type from '#models/type'
import { errors as lucidErrors } from '@adonisjs/lucid'

export default class TypeService {
  static async list({}: HttpContext) {
    try {
      const categories = await Type.all()
      return ResponseHelper.okResponse(categories)
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async create({ request }: HttpContext) {
    const { name, description } = await request.validateUsing(createTypeValidator)

    try {
      const newType = new Type()
      newType.name = name

      newType.description = description ?? null
      await newType.save()

      return ResponseHelper.okResponse(newType, 'Kategori berhasil dibuat')
    } catch (err) {
      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async update({ request, params }: HttpContext) {
    const { name, description } = await request.validateUsing(typeValidator)

    try {
      const type = await Type.findOrFail(params.id)

      if (type.name !== name) {
        const existingType = await Type.findBy('name', name)
        if (existingType) {
          return ResponseHelper.badRequestResponse('Nama kategori sudah ada')
        }

        type.name = name
      }

      type.description = description ?? null
      await type.save()

      return ResponseHelper.okResponse(type, 'Kategori berhasil diupdate')
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse(err.message)
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }

  static async delete({ params }: HttpContext) {
    try {
      const type = await Type.findOrFail(params.id)
      await type.delete()

      return ResponseHelper.okResponse(type, 'Kategori berhasil dihapus')
    } catch (err) {
      if (err instanceof lucidErrors.E_ROW_NOT_FOUND) {
        return ResponseHelper.notFoundResponse(err.message)
      }

      return ResponseHelper.serverErrorResponse(err.message)
    }
  }
}
