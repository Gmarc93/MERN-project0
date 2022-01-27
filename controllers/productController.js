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

async function getAllProducts(req, res, next) {
  try {
    const products = await Product.find().select(
      '_id name description price imageCover'
    );

    res.status(201).send({
      satus: 'success',
      data: {
        products,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).select(
      '_id name description price imageCover'
    );

    if (!product) throw new AppError('Product does not exist.', 404);

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.imageCover = req.body.imageCover || product.imageCover;
    product._require = true;
    product.save();

    res.status(200).send({
      satus: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) throw new AppError('Product does not exist.', 404);

    res.status(200).send({
      satus: 'success',
      message: 'Product deleted.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
