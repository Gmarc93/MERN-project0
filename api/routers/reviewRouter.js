const express = require('express');
const authController = require('../../controllers/authController');
const reviewController = require('../../controllers/reviewController');

const router = express.Router();

// router.get('/', (req, res) => res.send('Welcome to the review page!'));

router
  .route('/')
  .post(authController.routeProtection, reviewController.createReview);

router.route('/:id').get(reviewController.getReview);

module.exports = router;
