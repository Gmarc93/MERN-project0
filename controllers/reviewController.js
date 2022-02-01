const AppError = require('../api/utils/AppError');
const Review = require('../models/reviewModel');

async function createReview(req, res, next) {
  try {
    const review = await Review.create(req.body);

    res.status(201).send({
      satus: 'success',
      data: {
        review,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id).populate(
      'product',
      'name'
    );

    res.status(201).send({
      satus: 'success',
      data: {
        review: {
          id: review._id,
          summary: review.summary,
          rating: review.rating,
          product: review.product,
          user: review.user,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {createReview, getReview};
