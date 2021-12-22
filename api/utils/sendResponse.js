const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');

const signTokenAsync = util.promisify(jwt.sign);

async function sendResponseToken(user, res, statusCode) {
  try {
    const token = await signTokenAsync(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + 1000 * 60 * process.env.JWT_COOKIE_EXPIRES_IN
      ),
      httpOnly: true,
      // secure: true
    });

    res.status(statusCode).send({status: 'success', data: {token}});
  } catch (err) {
    throw err;
  }
}

module.exports = sendResponseToken;
