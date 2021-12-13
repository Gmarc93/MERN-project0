// Http errors should be sent to the client in the following form:
// res.status(err.statusCode).send({status, name, message, stack, isOperational})

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    if (statusCode >= 400 && statusCode <= 499) this.status = 'fail';
    if (statusCode >= 500 && statusCode <= 599) this.status = 'error';

    this.name = this.constructor.name;
    this.isOperational = true;
  }
}

module.exports = AppError;
