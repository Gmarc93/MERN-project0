const {use} = require('bcrypt/promises');
const express = require('express');
const authController = require('../../controllers/authController');
const reviewController = require('../../controllers/reviewController');

const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(reviewController.getAllProductReviews)
  .get(reviewController.getAllReviews)
  .post(
    authController.routeProtection,
    reviewController.init,
    reviewController.createReview
  )
  .delete(reviewController.deleteAllProductReviews)
  .delete(reviewController.deleteAllReviews);

router
  .route('/:reviewId')
  .get(reviewController.getProductReview)
  .get(reviewController.getReview)
  .patch(authController.routeProtection, reviewController.updateProductReview)
  .patch(authController.routeProtection, reviewController.updateReview)
  .delete(authController.routeProtection, reviewController.deleteReview);

module.exports = router;
