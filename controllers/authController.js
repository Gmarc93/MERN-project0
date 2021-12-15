const util = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../api/utils/AppError');

const signTokenAsync = util.promisify(jwt.sign);
const verifyTokenAsync = util.promisify(jwt.verify);

async function routeProtection(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new AppError('Error. Please log in to view page.', 400);
    }

    if (!authorization.startsWith('Bearer')) {
      throw new AppError('Error. Please log in to view page.', 400);
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new AppError('Error. Invalid token.', 400);
    }

    const decoded = await verifyTokenAsync(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('Error. User does not exist.', 400);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

async function signup(req, res, next) {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = await signTokenAsync(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).send({ status: 'success', data: { token } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  // 1) lookup user with email, exit if false
  // 2) encrypt password and check if it matches password in db, exit if false
  // 3) return token

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new AppError('Incorrect email or passowrd. Please try again.', 400);
    }

    const token = await signTokenAsync(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).send({ status: 'success', data: { token } });
  } catch (err) {
    next(err);
  }
}

module.exports = { routeProtection, signup, login };
