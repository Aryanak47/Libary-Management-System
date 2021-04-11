const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');

exports.signup = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  user.password = undefined;
  user.active = undefined;
  const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.TOKEN_EXP,
  });
  const cookieOptions = {
    expires: new Date(process.env.COOKIE_EXP * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'pro') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  res.status(200).json({
    status: 'sucess',
    token: token,
    data: {
      user,
    },
  });
});
