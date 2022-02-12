'use strict';

const AppError = require('../api/utils/AppError');
const Review = require('../models/reviewModel');
const CRUD = require('../api/utils/crud');

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
const getAllReviews = CRUD.readAll(Review, 'productId');
const updateReview = CRUD.updateOne(Review, updateOneFilter, 'reviewId');
const deleteReview = CRUD.deleteOne(Review, 'reviewId');
const deleteAllReviews = CRUD.deleteAll(Review);

module.exports = {
  init,
  createReview,
  getReview,
  getAllReviews,
  updateReview,
  deleteReview,
  deleteAllReviews,
};
