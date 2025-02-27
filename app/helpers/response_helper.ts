import logger from '@adonisjs/core/services/logger'
import { StatusCodes } from 'http-status-codes'

export default class ResponseHelper {
  static okResponse<T>(data: T, message?: string, code: StatusCodes = StatusCodes.OK) {
    return {
      code,
      message,
      data,
    }
  }

  static createdResponse<T>(data: T, message?: string, code: StatusCodes = StatusCodes.CREATED) {
    return {
      code,
      message,
      data,
    }
  }

  static notFoundResponse(message?: string, code: StatusCodes = StatusCodes.NOT_FOUND) {
    return {
      code,
      message,
      data: null,
    }
  }

  static badRequestResponse<T>(
    message: string = 'Data input tidak sesuai!',
    errors?: T,
    code: StatusCodes = StatusCodes.BAD_REQUEST
  ) {
    return {
      code,
      message,
      data: null,
      errors,
    }
  }

  static unauthorizedResponse(
    message: string = 'Unauthorized',
    code: StatusCodes = StatusCodes.UNAUTHORIZED
  ) {
    return this.notFoundResponse(message, code)
  }

  static serverErrorResponse<T>(
    message: string = 'Internal Server Error',
    errors?: T,
    code: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    logger.fatal(errors)
    return this.badRequestResponse(message, errors, code)
  }
}
