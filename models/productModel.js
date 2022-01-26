'use strict';

const mongoose = require('mongoose');

// Custom functions
function requiredValidator() {
  return this._required === true;
}

// Schema
const productSchema = mongoose.Schema({
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
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
