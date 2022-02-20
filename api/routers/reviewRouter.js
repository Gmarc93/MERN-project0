const { use } = require('bcrypt/promises');
const express = require('express');
const authController = require('../../controllers/authController');
const reviewController = require('../../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllProductReviews, reviewController.getAllReviews)
  .post(
    authController.routeProtection,
    reviewController.initReqBody,
    reviewController.preventDuplicateReview,
    reviewController.createReview
  )
  .delete(
    authController.routeProtection,
    reviewController.deleteAllProductReviews,
    reviewController.deleteAllReviews
  );

router
  .route('/:reviewId')
  .get(reviewController.getProductReview, reviewController.getReview)
  .patch(
    authController.routeProtection,
    reviewController.verifyAuthor,
    reviewController.updateProductReview,
    reviewController.updateReview
  )
  .delete(
    authController.routeProtection,
    reviewController.verifyAuthor,
    reviewController.deleteReview
  );

module.exports = router;
