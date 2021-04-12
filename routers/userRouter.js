const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router.route('/').get(userController.getUsers);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.logIn);

router.use(authController.protect);
router.route('/me').get(userController.getMe, userController.getUser);
router.route('/updateMe').patch(userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);

router.use(authController.restrictTo('admin'));
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .patch(userController.deleteUser);

module.exports = router;
