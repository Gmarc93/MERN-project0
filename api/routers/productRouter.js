const express = require('express');
const authController = require('../../controllers/authController');
const productController = require('../../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.routeProtection,
    authController.restrictToAdmin,
    productController.createProduct
  );

router.get('/:id', productController.getProduct);

module.exports = router;
