const express = require('express');
const authController = require('../../controllers/authController');
const reviewController = require('../../controllers/reviewController');

const router = express.Router();

router.route('/').get(reviewController.getAllReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .post(authController.routeProtection, reviewController.createReview)
  .patch(authController.routeProtection, reviewController.updateReview)
  .delete(authController.routeProtection, reviewController.deleteReview);

module.exports = router;
