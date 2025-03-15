export const HTTTP_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO__MANY_REQUESTS: 429,
  INTERNAL: 500,
  UNAVAILABLE_SERVICE: 503,
} as const;

export class BaseError extends Error {
  public httpCode: HTTPCode;

  public message: string;

  constructor(args: BaseErrorArgs) {
    super(args.message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || 'Error';
    this.httpCode = args.httpCode;
    this.message = args.message;

    Error.captureStackTrace(this);
  }
}
