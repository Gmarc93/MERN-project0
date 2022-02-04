'use strict';

const AppError = require('../api/utils/AppError');
const Review = require('../models/reviewModel');

async function createReview(req, res, next) {
  try {
    const review = await Review.create({
      summary: req.body.summary,
      rating: req.body.rating,
      user: req.decoded.id,
      product: req.params.id,
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

async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();

    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
}

async function updateReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) throw new AppError('Review does not exist.', 404);

    review.summary = req.body.summary;
    review.rating = req.body.rating;
    review._require = true;
    await review.save();

    res.status(200).send(review);
  } catch (err) {
    next(err);
  }
}

async function deleteReview(req, res, next) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) throw new AppError('Review does not exist.', 404);

    res.status(200).send(review);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReview,
  getReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
