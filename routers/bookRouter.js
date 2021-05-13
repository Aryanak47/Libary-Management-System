const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
const bookController = require('../controllers/bookController');


router
  .route('/')
  .get(bookController.getBooks)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    bookController.uploadBookPhoto,
    bookController.resizeBookPhoto,
    bookController.createBook
  );
router
  .route('/:id')
  .get(bookController.getBook)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    bookController.deleteBook
  );
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    bookController.updateBook
  );

module.exports = router;
