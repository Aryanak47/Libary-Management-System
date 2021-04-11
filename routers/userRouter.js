const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.route('/').get(userController.getUsers);
router.route('/').post(authController.signup);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .patch(userController.deleteUser);

module.exports = router;
