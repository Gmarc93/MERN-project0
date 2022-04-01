'use strict';

const AppError = require('../api/utils/AppError');
const Product = require('../models/productModel');
const CRUD = require('../api/utils/crud');

// Middleware
async function verifyExistence(req, res, next) {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) throw new AppError('Product does not exist.', 404);
    next();
  } catch (err) {
    next(err);
  }
}

// CRUD filters
const createOneFilter = ['name', 'description', 'price', 'imageCover'];
const updateOneFilter = ['name', 'description', 'price', 'imageCover'];

// Controllers
const createProduct = CRUD.createOne(Product, createOneFilter);
const getProduct = CRUD.readOne(Product, 'productId');
const getAllProducts = CRUD.readAll(Product, 'productId');
const updateProduct = CRUD.updateOne(Product, updateOneFilter, 'productId');
const deleteProduct = CRUD.deleteOne(Product, 'productId');
const deleteAllProducts = CRUD.deleteAll(Product);

module.exports = {
  verifyExistence,
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
};
