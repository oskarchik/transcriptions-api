import { BaseError } from './BaseError';

export class ApiError extends BaseError {
  static DEFAULT_BAD_REQUEST_MESSAGE =
    'Invalid request: The request contains invalid data or parameters. Please review the request and try again with valid information.';

  static DEFAULT_UNAUTHORIZED_MESSAGE =
    'Unauthorized access: You are not authorized to access this resource. Please provide valid credentials to proceed.';

  static DEFAULT_FORBIDDEN_MESSAGE =
    'Forbidden: You are not allowed to perform the requested operation. Please ensure you have the necessary privileges.';

  static DEFAULT_NOT_FOUND_MESSAGE =
    'Resource not found: The requested resource could not be found. Please verify the URL and try again.';

  static DEFAULT_CONFLICT_MESSAGE =
    'Conflict: The request could not be completed due to a conflict with the current state of the resource.';

  static DEFAULT_TOO_MANY_REQUESTS_MESSAGE =
    'Too Many Requests: You have exceeded the allowed number of requests. Please wait a few minutes before trying again.';

  static DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE =
    'Internal Server Error: An unexpected error occurred on the server. Please try again later or contact the administrator for assistance.';

  static DEFAULT_UNAVAILABLE_SERVICE =
    'Service Unavailable: The service is currently unavailable. Please try again later.';

  constructor(httpCode: HTTPCode, message: string) {
    super({ httpCode, message });
    this.httpCode = httpCode;
  }

  static badRequest(msg = '') {
    return new ApiError(
      400,
      msg
        ? `${this.DEFAULT_BAD_REQUEST_MESSAGE} ${msg}`
        : `${this.DEFAULT_BAD_REQUEST_MESSAGE}`,
    );
  }

  static unauthorized(msg = '') {
    return new ApiError(
      401,
      msg
        ? `${this.DEFAULT_UNAUTHORIZED_MESSAGE} ${msg}`
        : `${this.DEFAULT_UNAUTHORIZED_MESSAGE}`,
    );
  }

  static forbidden(msg = '') {
    return new ApiError(
      403,
      msg
        ? `${this.DEFAULT_FORBIDDEN_MESSAGE} ${msg}`
        : `${this.DEFAULT_FORBIDDEN_MESSAGE}`,
    );
  }

  static notFound(msg = '') {
    return new ApiError(
      404,
      msg
        ? `${this.DEFAULT_NOT_FOUND_MESSAGE} ${msg}`
        : `${this.DEFAULT_NOT_FOUND_MESSAGE}`,
    );
  }

  static conflict(msg = '') {
    return new ApiError(
      409,
      msg
        ? `${this.DEFAULT_CONFLICT_MESSAGE} ${msg}`
        : `${this.DEFAULT_CONFLICT_MESSAGE}`,
    );
  }

  static tooManyRequests(msg = '') {
    return new ApiError(
      429,
      msg
        ? `${this.DEFAULT_TOO_MANY_REQUESTS_MESSAGE} ${msg}`
        : `${this.DEFAULT_TOO_MANY_REQUESTS_MESSAGE}`,
    );
  }

  static internal(msg = '') {
    return new ApiError(
      500,
      msg
        ? `${this.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE} ${msg}`
        : `${this.DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE}`,
    );
  }

  static unavailableService(msg = '') {
    return new ApiError(
      503,
      msg
        ? `${this.DEFAULT_UNAVAILABLE_SERVICE} ${msg}`
        : `${this.DEFAULT_UNAVAILABLE_SERVICE}`,
    );
  }
}
