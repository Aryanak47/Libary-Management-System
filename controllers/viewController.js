const Book = require('../model/bookModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getOverView = (req, res) => {
  const page = req.query.page || 1;
  const options = {
    page: page,
    limit: 3,
  };
  Book.paginate({}, options).then((result) => {
    res.status(200).render('overview', {
      books: result.docs,
      pagesCount: result.totalPages,
      currentPage: page,
      title: 'Books',
    });
  });
};

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findOne({ slug: req.params.slug });

  if (!book) {
    return next(new AppError('There is no book with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('book', {
    title: `${book.name} Book`,
    book,
  });
});

exports.getSearch = (req, res) => {
  const term = new RegExp(req.query.term, 'i');
  const page = req.query.page || 1;
  Book.paginate(
    {
      $or: [{ name: term }, { genre: term }],
    },
    { page: page }
  ).then((results) => {
    res.render('overview', {
      books: results.docs,
      pagesCount: results.totalPages,
      currentPage: page,
      term: req.query.term,
      found: results.docs.length > 0,
    });
  });
};

exports.getSignUp = (req, res) => {
  // if user is already loged in ,take user to home page
  if (req.user) {
    return res.redirect('/');
  }
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.checkLogedIn = (req, res, next) => {
  if (!req.user) {
    res.status(200).render('login');
  } else {
    next();
  }
};
