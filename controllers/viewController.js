const Book = require('../model/bookModel');

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
    });
  });
};
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
  if (!req.user) {
    res.status(200).render('login');
  } else {
    next();
  }
};
