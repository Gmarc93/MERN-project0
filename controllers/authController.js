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

async function login(req, res, next) {
  try {
    const user = await User.findOne({email: req.body.email});

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
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    res.status(200).send({status: 'success', data: {token}});
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) throw new AppError('User does not exist', 400);

    const cryptoToken = crypto.randomBytes(32).toString('hex');
    const bcryptToken = await bcrypt.hash(cryptoToken, 12);

    user.passwordResetToken = bcryptToken;
    user.passwordResetExpires = Date.now() + 1000 * 60 * 10;
    user.save({validateBeforeSave: false});

    try {
      const url = `localhost:8000/api/v1/users/passwordReset/${cryptoToken}/${user.id}`;
      const message = `Forgot password? Please click on the link below to reset your password: ${url}.`;

      await sendEmail({
        email: user.email,
        subject: 'Password reset token (expires in 10 min.)',
        message,
      });

      res.status(200).send({
        status: 'success',
        message: 'Password reset token sent to email.',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save({validateBeforeSave: false});

      return next(
        new AppError('Unable to send email. Please try again later.', 500)
      );
    }
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
};
