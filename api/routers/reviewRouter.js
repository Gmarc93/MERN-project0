const express = require('express');
const authController = require('../../controllers/authController');
const reviewController = require('../../controllers/reviewController');

const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.routeProtection, reviewController.createReview)

  // The middleware below must only be used in development!
  .delete(reviewController.deleteAllReviews);

router
  .route('/:reviewId')
  .get(reviewController.getReview)
  .patch(authController.routeProtection, reviewController.updateReview)
  .delete(authController.routeProtection, reviewController.deleteReview);

module.exports = router;
