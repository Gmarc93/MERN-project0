// If in development, http error format:
// {status, name, message, stack, isOperational}

// If in production and isOperational, http error format:
// {status, message}

// If in production and isOperational = false, http error format:
// {status: 'error', message: 'Something went wrong!'}

function sendErrorDev(err, res) {
  res.status(err.statusCode || 500).send({
    status: err.status || 'error',
    name: err.name,
    message: err.message,
    // stack: err.stack,
    isOperational: err.isOperational || false,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).send({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
}

function globalErrorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === 'development') return sendErrorDev(err, res);
  if (process.env.NODE_ENV === 'production') sendErrorProd(err, res);
}

module.exports = globalErrorHandler;
