import logger from '@adonisjs/core/services/logger';
import { StatusCodes } from 'http-status-codes';
export default class ResponseHelper {
    static okResponse(data, message, code = StatusCodes.OK) {
        return {
            code,
            message,
            data,
        };
    }
    static createdResponse(data, message, code = StatusCodes.CREATED) {
        return {
            code,
            message,
            data,
        };
    }
    static notFoundResponse(message, code = StatusCodes.NOT_FOUND) {
        return {
            code,
            message,
            data: null,
        };
    }
    static badRequestResponse(message = 'Data input tidak sesuai!', errors, code = StatusCodes.BAD_REQUEST) {
        return {
            code,
            message,
            data: null,
            errors,
        };
    }
    static unauthorizedResponse(message = 'Unauthorized', code = StatusCodes.UNAUTHORIZED) {
        return this.notFoundResponse(message, code);
    }
    static serverErrorResponse(message = 'Internal Server Error', errors, code = StatusCodes.INTERNAL_SERVER_ERROR) {
        logger.fatal(errors);
        return this.badRequestResponse(message, errors, code);
    }
}
//# sourceMappingURL=response_helper.js.map