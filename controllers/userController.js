const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');

exports.updateMe = catchAsync(async (req, res, next) => {
  // update the document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    runValidators: true,
    new: true,
  });
  return res.status(200).json({
    status: 'success',
    user: {
      updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('User does not exits with this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'sucessfully deleted',
  });
});
