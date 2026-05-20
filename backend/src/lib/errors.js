export class AppError extends Error {
  constructor(message, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function assert(condition, message, statusCode = 400, code = 'BAD_REQUEST') {
  if (!condition) throw new AppError(message, statusCode, code);
}
