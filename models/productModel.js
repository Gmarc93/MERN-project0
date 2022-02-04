'use strict';

const mongoose = require('mongoose');

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
const productSchema = mongoose.Schema(
  {
    _required: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: requiredValidator,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 40,
    },
    description: {
      type: String,
      required: requiredValidator,
      trim: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: requiredValidator,
    },
    ratingsAverage: {
      type: Number,
      min: 1,
      max: 5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    imageCover: {
      type: String,
      default: 'productImageDefault.jpg',
    },
  },
  {
    toJSON: {virtuals: true, transform: removeFields},
    toObject: {virtuals: true, transform: removeFields},
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  limit: 3,
});

productSchema.pre(/^find/, function (next) {
  this.populate('reviews');
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
