const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.TOKEN_EXP,
  });
  return token;
};
const createCookies = (res, status, user) => {
  const cookieOptions = {
    expires: new Date(process.env.COOKIE_EXP * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'pro') cookieOptions.secure = true;
  const token = signToken(user.id);
  res.cookie('jwt', token, cookieOptions);
  res.status(status).json({
    status: 'sucess',
    token: token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  user.password = undefined;
  user.active = undefined;
  createCookies(res, 200, user);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password', 404));
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  user.password = undefined;
  createCookies(res, 200, user);
});

//  this middlewear prevents routes from unauthorised access
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) next(new AppError('Please login again', 400));
  // verify token
  const decode = await promisify(jwt.verify)(token, process.env.SECRET_TOKEN);
  // find user with that token
  const user = await User.findById(decode.id);
  if (!user) next(new AppError('This user does not exist anymore', 401));
  // check if user has changed password
  if (user.checkChangePassword(decode.iat))
    next(
      new AppError(
        'User belonging to this account has recently changed password,please login again',
        400
      )
    );
  res.user = user;
  next();
});

//  this middlewear give access to routes according to their role
exports.restrictTo = (...role) => (req, res, next) => {
  if (!role.includes(res.user.role))
    next(new AppError('You do not have permission to perform this action !'));
  next();
};
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // validate token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      // check user if stills login
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }
      // check if user changed password after issued token
      if (freshUser.checkPasswordChanged(decoded.iat)) {
        return next();
      }
      res.locals.user = freshUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
});
