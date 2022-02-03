const express = require('express');
const authController = require('../../controllers/authController');
const reviewController = require('../../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get((req, res) => res.send('Welcome to the reviews page!'))
  .post(authController.routeProtection, reviewController.createReview);

router.route('/:id').get(reviewController.getReview);

module.exports = router;
