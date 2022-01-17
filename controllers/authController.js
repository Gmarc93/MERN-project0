'use strict';

const util = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Promisify JWT functions
const signTokenAsync = util.promisify(jwt.sign);

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
  res.send('Welcome to the login page!');
}

module.exports = {signup, login};
