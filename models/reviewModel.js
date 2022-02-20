'use strict';

const mongoose = require('mongoose');

// Custom functions
function requiredValidator() {
  if (this instanceof mongoose.Query) return true;

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
    modifiedAt: {
      type: Date,
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

reviewSchema.pre('save', function (next) {
  if (!this.isModified('summary rating') || this.isNew) return next();

  this.modifiedAt = Date.now();
  next();
});

reviewSchema.pre(/^find/, function (next) {
  this.populate('user', '-email');
  next();
});

reviewSchema.post(
  ['save', 'deleteOne'],
  {document: true, query: false},
  async function (doc) {
    const result = await this.constructor.aggregate([
      {$match: {product: doc.product}},
      {
        $group: {
          _id: '$product',
          ratingsQuantity: {$sum: 1},
          ratingsAverage: {$avg: '$rating'},
        },
      },
    ]);

    if (result.length === 0) {
      const Product = require('./productModel');
      await Product.findByIdAndUpdate(doc.product, {
        ratingsQuantity: 0,
        ratingsAverage: null,
      });
    } else {
      const {ratingsQuantity, ratingsAverage} = result[0];
      const Product = require('./productModel');
      await Product.findByIdAndUpdate(doc.product, {
        ratingsQuantity,
        ratingsAverage,
      });
    }
  }
);

reviewSchema.post('deleteMany', async function () {
  const Product = require('./productModel');

  await Product.findByIdAndUpdate(this.getQuery().product, {
    ratingsQuantity: 0,
    ratingsAverage: null,
  });
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
