const Book = require('../model/bookModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createBook = catchAsync(async (req, res) => {
  const doc = await Book.create(req.body);
  res.status(200).json({
    message: 'sucess',
    data: {
      data: doc,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return next(new AppError('Tour does not exits with this id', 404));
  }
  res.status(200).json({
    status: 'sucess',
    data: {
      book,
    },
  });
});

exports.getBooks = catchAsync(async (req, res) => {
  const books = await Book.find();
  res.status(200).json({
    status: 'success',
    data: {
      books,
    },
  });
});

exports.updateBook = catchAsync(async (req, res) => {
  const doc = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'OK',
    data: {
      data: doc,
    },
  });
});
exports.deleteBook = catchAsync(async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'OK',
    message: 'sucessfully deleted',
  });
});
