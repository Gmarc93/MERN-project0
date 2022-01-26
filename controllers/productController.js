'use strict';

const AppError = require('../api/utils/AppError');
const Product = require('../models/productModel');

async function createProduct(req, res, next) {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });

    res.status(201).send({
      satus: 'success',
      data: {
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          imageCover: product.imageCover,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).select(
      '_id name description price imageCover'
      // The code above may be put into a pre hook
    );

    if (!product) throw new AppError('Product does not exist.', 404);

    // Make sure to add id cast error into globalErrorHandler in the future

    res.status(201).send({
      satus: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {createProduct, getProduct};
