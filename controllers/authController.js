'use strict';

const util = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../api/utils/AppError');
const sendEmail = require('../api/utils/sendEmail');

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
      user.toObject(),
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
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
      user.toObject(),
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
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

async function forgotPassword(req, res, next) {
  let user = undefined;
  try {
    user = await User.findOne({email: req.body.email});
    if (!user) throw new AppError('User does not exist.', 400);

    const cryptoToken = crypto.randomBytes(32).toString('hex');
    const bcryptToken = await bcrypt.hash(cryptoToken, 12);

    user.passwordReset = bcryptToken;
    user.passwordResetExpiresIn = Date.now() + 1000 * 60 * 10;
    user._required = false;
    await user.save();

    const url = `localhost:8000/api/v1/users/forgotPassword/${cryptoToken}/${user._id}`;
    const message = `Forgot password? Please click on the link below to reset your password: ${url}.`;

    const info = await sendEmail({
      email: user.email,
      subject: 'Password Reset Token (expires in 10 min.)',
      message,
    });

    res.status(200).send({
      status: 'success',
      message: 'Reset token sent to email address.',
    });
  } catch (err) {
    if (user) {
      user.passwordReset = undefined;
      user.passwordResetExpiresIn = undefined;
      user._required = false;
      await user.save();
    }
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (
      !user ||
      !(user.passwordResetExpiresIn > Date.now()) ||
      !(await bcrypt.compare(req.params.token, user.passwordReset))
    ) {
      throw new AppError('User does not exist or token is invalid.', 400);
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordReset = undefined;
    user.passwordResetExpiresIn = undefined;
    user._required = true;
    await user.save();

    const token = await signTokenAsync(
      user.toObject(),
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
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

async function updatePassword(req, res, next) {
  try {
    const user = req.user;
    if (
      !user.body.password ||
      !(await bcrypt.compare(req.body.password, user.password))
    ) {
      throw new AppError('Incorrect password. Please try again.', 400);
    }

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    user._required = true;
    await user.save();

    const token = await signTokenAsync(
      user.toObject(),
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
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

module.exports = {
  routeProtection,
  restrictToAdmin,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
};
