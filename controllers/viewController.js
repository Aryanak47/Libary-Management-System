exports.getOverView = (req, res) => {
  res.status(200).render('overview');
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
