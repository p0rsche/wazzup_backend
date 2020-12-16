class GeneralError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }

  getCode(): number {
    if (this instanceof BadRequest) {
      return 400;
    }
    if (this instanceof NotFound) {
      return 404;
    }
    if (this instanceof AuthorizationError) {
      return 401;
    }
    if (this instanceof ValidationError) {
      return 422;
    }
    return 500;
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class AuthorizationError extends GeneralError {}
class ValidationError extends GeneralError {
  message: 'Validation error';
}

export = {
  GeneralError,
  BadRequest,
  NotFound,
  AuthorizationError,
};
