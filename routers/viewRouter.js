const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.isLoggedIn);
router.route('/').get(authController.isLoggedIn, viewController.getOverView);
router
  .route('/search')
  .get(authController.isLoggedIn, viewController.getSearch);
router
  .route('/signup')
  .get(authController.isLoggedIn, viewController.getSignUp);
router.route('/login').get(authController.isLoggedIn, viewController.getLogin);
router
  .route('/:slug')
  .get(
    authController.isLoggedIn,
    viewController.checkLogedIn,
    viewController.getBook
  );

module.exports = router;
