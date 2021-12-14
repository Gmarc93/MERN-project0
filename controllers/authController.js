const util = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signTokenAsync = util.promisify(jwt.sign);

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
  res.send('Welcome to the login page!');
}

module.exports = {signup, login};
