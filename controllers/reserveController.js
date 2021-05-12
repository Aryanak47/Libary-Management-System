const Reserve = require('../model/userBook');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Book = require('../model/bookModel')

exports.createReserve = catchAsync(async (req, res) => {
  const doc = await Reserve.create(req.body);
  
  res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.getReserved = catchAsync(async (req, res, next) => {
  const { book } = req.params;
  const reserve = await Reserve.findById(book);
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
exports.getUserReserved = catchAsync(async (req, res) => {
  if(!req.params){
    next(new AppError('Please provide user id',400));
  }
  const reserves = await Reserve.find({ user:req.params, approve:true });
  res.status(200).json({
    status: 'success',
    data: {
      reserves,
    },
  });
});

exports.updateReserve = catchAsync(async (req, res) => {
  const doc = await Reserve.findByIdAndUpdate(req.params.reserve, req.body, {
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
exports.deleteReserve = catchAsync(async (req, res) => {
  await Reserve.findByIdAndDelete(req.params.reserve);
  res.status(200).json({
    status: 'success',
    message: 'sucessfully deleted',
  });
});

exports.reservationApprove = catchAsync(async (req, res) => {
  // first update the reservation
  const doc = await Reserve.findByIdAndUpdate(req.params.reserve, req.body, {
    new: true,
    runValidators: true,
  });
  // find the book and deduct the number of stocks
  const book = await Book.findById(doc.book.id)
  book.stocks = book.stocks -1;
  book.save({validateBeforeSave: false});
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });

})
