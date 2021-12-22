const util = require('util');
const User = require('../models/userModel');
const sendResponseToken = require('../api/utils/sendResponse');

// const signTokenAsync = util.promisify(jwt.sign);

async function signup(req, res, next) {
  let user = undefined;
  try {
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    await sendResponseToken(user, res, 201);
  } catch (err) {
    if (!user) return next(err);

    user = await User.deleteOne({_id: user.id});
    next(err);
  }
}

module.exports = {signup};
1;
