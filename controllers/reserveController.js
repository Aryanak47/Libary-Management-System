const Reserve = require('../model/userBook');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createBook = catchAsync(async (req, res) => {
  const doc = await Reserve.create(req.body);
  res.status(200).json({
    message: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getReserved = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const reserve = await Reserve.findById(id);
  if (!reserve) {
    return next(new AppError('No document  exits with this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      reserve,
    },
  });
});

exports.getReserves = catchAsync(async (req, res) => {
  const reserve = await Reserve.find();
  res.status(200).json({
    status: 'success',
    data: {
      reserve,
    },
  });
});

exports.updateReserve = catchAsync(async (req, res) => {
  const doc = await Reserve.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deleteBook = catchAsync(async (req, res) => {
  await Reserve.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'sucessfully deleted',
  });
});
