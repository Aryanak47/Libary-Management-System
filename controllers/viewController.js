const Book = require('../model/bookModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverView = (req, res) => {
  const page = req.query.page || 1;
  const options = {
    page: page,
    limit: 4,
  };
  Book.paginate({}, options).then((result) => {
    res.status(200).render('overview', {
      books: result.docs,
      pagesCount: result.totalPages,
      currentPage: page,
    });
  });
};
exports.getSignUp = (req, res) => {
  res.status(200).render('signup');
};
exports.getLogin = (req, res) => {
  res.status(200).render('login');
};
exports.checkLogedIn = (req, res, next) => {
  console.log(req.user, 'not loged in');
  if (!req.user) {
    res.status(200).render('login');
  } else {
    next();
  }
};
