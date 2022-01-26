'use strict';

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

module.exports = {createProduct};
