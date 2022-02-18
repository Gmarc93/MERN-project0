'use strict';

const AppError = require('../api/utils/AppError');
const Review = require('../models/reviewModel');
const CRUD = require('../api/utils/crud');

// Util functions ----------------------------------------
function filterObj(obj, filter) {
  // Returns an object
  const filtered = {};

  Object.keys(obj).forEach((prop) => {
    if (filter.includes(prop)) filtered[prop] = obj[prop];
  });

  return filtered;
}

function assignProps(source, target) {
  // Assign properties from source obj to target obj if prop in target obj
  for (const prop in source) {
    if (prop in target) {
      target[prop] = source[prop];
    }
  }
}

// Middleware
function init(req, res, next) {
  req.body.product = req.params.productId;
  req.body.user = req.decoded.id;
  next();
}

// CRUD filters
const createOneFilter = ['summary', 'rating', 'user', 'product'];
const updateOneFilter = ['summary', 'rating'];

// Controllers
const createReview = CRUD.createOne(Review, createOneFilter);
const getReview = CRUD.readOne(Review, 'reviewId');
const getAllReviews = CRUD.readAll(Review);
const updateReview = CRUD.updateOne(Review, updateOneFilter, 'reviewId');
const deleteReview = CRUD.deleteOne(Review, 'reviewId');
const deleteAllReviews = CRUD.deleteAll(Review);

async function getProductReview(req, res, next) {
  try {
    if (!req.params.productId) return next();

    const review = await Review.findById(req.params.reviewId);

    if (!review || review.product.toString() !== req.params.productId)
      throw new AppError('Review does not exist for this product.', 404);

    res.status(200).send({status: 'success', data: {review}});
  } catch (err) {
    next(err);
  }
}

async function getAllProductReviews(req, res, next) {
  try {
    if (!req.params.productId) return next();

    const reviews = await Review.find({product: req.params.productId});

    res.status(200).send({status: 'success', data: {reviews}});
  } catch (err) {
    next(err);
  }
}

async function updateProductReview(req, res, next) {
  try {
    if (!req.params.productId) return next();

    const review = await Review.findById(req.params.reviewId);

    if (!review || review.product.toString() !== req.params.productId)
      throw new AppError('Review does not exist for this product.', 404);

    const filtered = filterObj(req.body, updateOneFilter);
    assignProps(filtered, review);

    await review.save();

    res.status(200).send({status: 'success', data: {review}});
  } catch (err) {
    next(err);
  }
}

async function deleteAllProductReviews(req, res, next) {
  try {
    if (!req.params.productId) return next();

    await Review.deleteMany({product: req.params.productId});

    res.status(200).send({status: 'success'});
  } catch (err) {
    next(err);
  }
}

module.exports = {
  init,
  createReview,
  getReview,
  getAllReviews,
  updateReview,
  deleteReview,
  deleteAllReviews,

  getProductReview,
  getAllProductReviews,
  updateProductReview,
  deleteAllProductReviews,
};
