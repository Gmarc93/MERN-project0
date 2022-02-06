const express = require('express');
const authController = require('../../controllers/authController');
const productController = require('../../controllers/productController');
const reviewRouter = require('../routers/reviewRouter');

const router = express.Router();

// Allows all reviews or single review
router.use(
  '/:productId/reviews',
  productController.verifyExistence,
  reviewRouter
);

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
  .get(productController.getProduct) // Only 3 reviews will populate
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
