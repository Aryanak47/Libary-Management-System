const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
const reserveController = require('../controllers/reserveController');

router.use(authController.protect);

router.route('/').post(reserveController.createReserve);
router.use(authController.restrictTo('admin'));
router.route('/').get(reserveController.getReserves);
router
  .route('/:reserve')
  .patch(reserveController.updateReserve)
  .get(reserveController.getReserved)
  .delete(reserveController.deleteReserve);
router.route('/approval/:reserve').patch(reserveController.reservationApprove)

module.exports = router;
