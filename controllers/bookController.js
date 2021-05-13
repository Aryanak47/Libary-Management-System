const Book = require('../model/bookModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer')
const sharp = require('sharp')

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadBookPhoto = upload.single('photo');

exports.resizeBookPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `book-${req.file.fieldname}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/book/${req.file.filename}`);
  next();
});

exports.createBook = catchAsync(async (req, res) => {
  const { name, genre, ISBN, authors, stocks, newBook, summary } = req.body;
  const doc = await Book.create({
    name:name,
    ISBN:ISBN,
    genre: genre,
    photo: req.file.filename,
    authors: authors,
    stocks:stocks,
    summary:summary,
    new:newBook
  });
  res.status(200).json({
    status: 'success',
    data: {
      data: {
        doc
      },
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
    status: 'success',
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
    status: 'success',
    data: {
      data: doc,
    },
  });
});
exports.deleteBook = catchAsync(async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'sucessfully deleted',
  });
});
