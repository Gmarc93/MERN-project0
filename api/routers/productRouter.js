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

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.routeProtection,
    authController.restrictToAdmin,
    productController.updateProduct
  )
  .delete(
    authController.routeProtection,
    authController.restrictToAdmin,
    productController.deleteProduct
  );

module.exports = router;
