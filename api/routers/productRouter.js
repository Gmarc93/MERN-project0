const express = require('express');
const authController = require('../../controllers/authController');
const productController = require('../../controllers/productController');
const reviewController = require('../../controllers/reviewController');
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
  )
  .delete(
    authController.routeProtection,
    authController.restrictToAdmin,
    productController.deleteAllProducts,
    reviewController.deleteAllReviews
  );

router
  .route('/:productId')
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

    // I did not want to require reviewController in the productController
    // but this is the only way I know how to delete all reviews when deleting
    // a product. For now...
    // reviewController.deleteAllReviews
  );

module.exports = router;
