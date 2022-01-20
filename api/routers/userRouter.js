const express = require('express');
const authController = require('../../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => res.send('Welcome to the users home page!'));

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token/:id', authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.routeProtection,
  authController.updatePassword
);

router.get('/private', authController.routeProtection, (req, res) => {
  res.send('Welcome to the private page!');
});

router.get(
  '/privateAdmin',
  authController.routeProtection,
  authController.restrictToAdmin,
  (req, res) => {
    res.send('Welcome to the privateAdmin page!');
  }
);

module.exports = router;
