const express = require('express');
const authController = require('../../controllers/authController');

const router = express.Router();

router.get('/', (req, res, next) =>
  res.send('Welcome to the users home page!')
);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/private', authController.routeProtection, (req, res, next) => {
  res.send('Welcome to the users restricted route!');
});

router.get(
  '/privateAdmin',
  authController.routeProtection,
  authController.restrictToAdmin,
  (req, res, next) => {
    res.send('Welcome to the admins restricted route!');
  }
);

module.exports = router;
