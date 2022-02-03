'use strict';

const AppError = require('../api/utils/AppError');
const Review = require('../models/reviewModel');

async function createReview(req, res, next) {
  try {
    const review = await Review.create({
      summary: req.body.summary,
      rating: req.body.rating,
      user: req.decoded.id,
      product: req.body.product,
    });

    res.status(200).send(review);
  } catch (err) {
    next(err);
  }
}

async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) throw new AppError('Review does not exist.', 404);

    res.status(200).send(review);
  } catch (err) {
    next(err);
  }
}

module.exports = {createReview, getReview};
