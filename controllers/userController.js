const AppError = require('../api/utils/AppError');
const User = require('../models/userModel');
const filterObj = require('../utils/filterObj');

async function updateUser(req, res, next) {
  try {
    const filteredBody = filterObj(req.body, ['name', 'email']);

    await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .send({status: 'success', message: 'User update completed.'});

    // You may need to update JWT token and send it back with the
    // updated information
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await User.deleteOne({id: req.id});

    res.status(200).send({status: 'success', message: 'User deleted.'});
  } catch (err) {
    next(err);
  }
}

module.exports = {updateUser, deleteUser};
