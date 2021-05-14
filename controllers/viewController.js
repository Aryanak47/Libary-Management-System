const Book = require('../model/bookModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Reservation = require('../model/userBook');

exports.getOverView = catchAsync( async(req, res) => {
  if(req.user){
    if( req.user.role === "admin" ) {
      const reservation = await Reservation.find({approve:false});
      return res.status(200).render('adminhome', {
      reservation,
      title: 'Book Request',
      });
    }
  }
  const books = await Book.find();
  const totalBooks = books.length;
  const page = req.query.page || 1;
  const options = {
    page: page,
    limit: 4,
  };

  Book.paginate({}, options).then((result) => {
    res.status(200).render('overview', {
      books: result.docs,
      pagesCount: Math.round(totalBooks/4),
      currentPage: page,
      title: 'Books',
    });
  });
});

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

exports.getUpload = catchAsync(async (req, res) => {
  const books = await Book.find();
  const totalBooks = books.length;
  const page = req.query.page || 1;
  const options = {
    page: page,
    limit: 4,
  };
  Book.paginate({}, options).then((result) => {
    res.status(200).render('adminUploadBook', {
      books: result.docs,
      pagesCount: Math.round(totalBooks/4),
      currentPage: page,
      title: 'Upload Book',
    });
  });
});

exports.getMyBooks = catchAsync(async (req, res) => {
  const reserves = await Reservation.find({ user:req.user.id, approve:true });
  res.status(200).render('myBook', {
    title: 'My Books',
    reserves
  });
})