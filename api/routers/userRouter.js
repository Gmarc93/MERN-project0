const express = require('express');
const authController = require('../../controllers/authController');

const router = express.Router();

router.get('/', (req, res, next) =>
  res.send('Welcome to the users home page!')
);

router.post('/signup', authController.signup);

module.exports = router;
