'use strict';

const util = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../api/utils/AppError');
const {verify} = require('crypto');

// Promisify JWT functions
const signTokenAsync = util.promisify(jwt.sign);
const verifyTokenAsyc = util.promisify(jwt.verify);

async function routeProtection(req, res, next) {
  try {
    const {authorization} = req.headers;

    if (
      !authorization ||
      !authorization.startsWith('Bearer') ||
      !authorization.split(' ')[1]
    ) {
      throw new AppError('Please login to view page.', 400);
    }

    const token = authorization.split(' ')[1];
    const decoded = await verifyTokenAsyc(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) throw new AppError('User no longer exists.', 400);

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

function restrictToAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to view this page.', 400)
    );
  }
  next();
}

async function signup(req, res, next) {
  let user = undefined;
  try {
    user = await User.create({
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
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    res
      .status(201)
      .cookie('jwt', token, {
        expires: new Date(
          Date.now() + 1000 * 60 * process.env.JWT_COOKIE_EXPIRES_IN
        ),
        httpOnly: true, // Cookie is only accessible by web server
        // secure: true,
      })
      .send({status: 'success', data: {token}});
  } catch (err) {
    // Delete user if created and response is unsuccessful
    if (user) await User.deleteOne({_id: user._id});
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({email: req.body.email});

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new AppError('Incorrect email or password. Please try again', 400);
    }

    const token = await signTokenAsync(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    res
      .status(200)
      .cookie('jwt', token, {
        expires: new Date(
          Date.now() + 1000 * 60 * process.env.JWT_COOKIE_EXPIRES_IN
        ),
        httpOnly: true, // Cookie is only accessible by web server
        // secure: true,
      })
      .send({status: 'success', data: {token}});
  } catch (err) {
    next(err);
  }
}

module.exports = {routeProtection, restrictToAdmin, signup, login};
