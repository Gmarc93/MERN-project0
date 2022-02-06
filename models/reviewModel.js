'use strict';

const mongoose = require('mongoose');
const Product = require('./productModel');

// Custom functions
function requiredValidator() {
  return this._required === true;
}

function removeFields(doc, res, options) {
  delete res._required;
  delete res._id;
  delete res.__v;
}

// Schema
const reviewSchema = mongoose.Schema(
  {
    _required: {
      type: Boolean,
      default: true,
    },
    summary: {
      type: String,
      required: requiredValidator,
      trim: true,
      lowercase: true,
      maxlength: 40,
    },
    rating: {
      type: Number,
      required: requiredValidator,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Embedded documents that will be populated upon query
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
  },
  {
    toJSON: {virtuals: true, transform: removeFields},
    toObject: {virtuals: true, transform: removeFields},
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate('user', '-email');
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
