export type TErrorDetail = {
  path?: string;
  message: string;
};

class AppError extends Error {
  statusCode: number;
  errors: TErrorDetail[];

  constructor(statusCode: number, message: string, errors: TErrorDetail[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
