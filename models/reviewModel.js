'use strict';

const mongoose = require('mongoose');

// Custom functions
function requiredValidator() {
  return this._required === true;
}

function remove_id__v(doc, res, options) {
  delete res._id;
  delete res.__v;
  delete res._required;
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
      trim: true,
      lowercase: true,
      maxLength: 300,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: requiredValidator,
    },
    // Can be implemented for other models.
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Parent referencing
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: requiredValidator,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: requiredValidator,
    },
  },
  {
    // Virtuals will be visible on res.send()
    toJSON: {virtuals: true, transform: remove_id__v},

    // Virtuals will be virible on console.log()
    toObject: {virtuals: true, transform: remove_id__v},
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate('user', 'name');

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
