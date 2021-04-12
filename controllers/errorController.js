const AppError = require('../utils/AppError');

// handles validation error
const handleValidationError = (er) => {
  const errors = Object.values(er.errors).map((el) => el.message);
  return new AppError(`${errors.join(', ')}`, 400);
};

// handles casting error
const handleCastError = (error) => {
  const message = `Invalid ${error.path} ${error.value}`;
  return new AppError(message, 400);
};
// handles invalid webtoken error
const handleJWtError = () =>
  new AppError('Invalid token,Please try again', 400);

// handles  webtoken expire error
const handleTokenExpiredError = () =>
  new AppError('Token expired,Please login again', 400);

const manageDevError = (req, res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const manageProError = (req, res, err) => {
  if (err.operational)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};
// global error handler
const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  err.message = err.message || 'Error';
  if (process.env.NODE_ENV === 'dev') {
    manageDevError(req, res, err);
  } else if (process.env.NODE_ENV === 'pro') {
    let error = { ...err };
    if (err.name === 'ValidationError') error = handleValidationError(err);
    if (err.name === 'CastError') error = handleCastError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWtError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();
    manageProError(req, res, error);
  }
};

module.exports = errorController;
