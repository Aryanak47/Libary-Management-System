const express = require('express');

const router = express.Router();
const bookController = require('../controllers/bookController');

router.route('/').post(bookController.createBook);
router.route('/').get(bookController.getBooks);
router
  .route('/:id')
  .get(bookController.getBook)
  .delete(bookController.deleteBook);
router.route('/:id').patch(bookController.updateBook);

module.exports = router;
