const util = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../api/utils/AppError');
const sendEmail = require('../api/utils/sendEmail');

const signTokenAsync = util.promisify(jwt.sign);
const verifyTokenAsync = util.promisify(jwt.verify);

async function routeProtection(req, res, next) {
  try {
    const {authorization} = req.headers;

    if (!authorization) {
      throw new AppError('Error. Please log in to view page.', 400);
    }

    if (!authorization.startsWith('Bearer')) {
      throw new AppError('Error. Please log in to view page.', 400);
    }

    const token = authorization.split(' ')[1];
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

function restrictToAdmin(req, res, next) {
  if (req.user.role !== 'admin')
    return next(
      new AppError('You do not have permission to view this page.', 400)
    );
  next();
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
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    res.status(201).send({status: 'success', data: {token}});
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  let user = undefined;
  try {
    // locate user with email
    user = await User.findOne({ email: req.body.email });
    if (!user) throw new AppError('User does not exist.', 404);

    // create and save password token
    const cryptoToken = crypto.randomBytes(32).toString('hex');
    const bcryptToken = await bcrypt.hash(cryptoToken, 12);

    user.passwordResetToken = bcryptToken;
    user.passwordResetExpires = Date.now() + 1000 * 60 * 15;
    user.save({ validateBeforeSave: false });

    // send link to user's email
    const url = `localhost:8000/api/v1/users/passwordReset/${cryptoToken}/${user.id}`;
    const message = `Forgot password? Please click on the link below to reset your password: ${url}.`;

    const info = await sendEmail({
      email: user.email,
      subject: 'Password Reset (expires in 10 min)',
      message,
    });

    res.status(200).send({
      status: 'success',
      message: 'Reset token sent to email address.',
    });
  } catch (err) {
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save({ validateBeforeSave: false });
    }
    next(err);
  }
}

module.exports = {
  routeProtection,
  restrictToAdmin,
  signup,
  login,
  forgotPassword,
};
