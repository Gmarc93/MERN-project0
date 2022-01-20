const util = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const AppError = require('../api/utils/AppError');

const signTokenAsync = util.promisify(jwt.sign);

async function updateUser(req, res, next) {
  try {
    const user = req.user;

    // Can also define filterObj
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user._required = true; // incase name is empty string
    await user.save({validateModifiedOnly: true});

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

async function deleteUser(req, res, next) {
  try {
    const user = req.user;
    if (
      !req.body.password ||
      !(await bcrypt.compare(req.body.password, user.password))
    ) {
      throw new AppError('Incorrect password. Please try again.', 400);
    }

    await User.deleteOne({email: user.email});

    // Render logged out page
    res.status(200).send({status: 'success', message: 'User deleted'});
  } catch (err) {
    next(err);
  }
}

module.exports = {updateUser, deleteUser};
