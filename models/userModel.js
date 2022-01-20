const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

// Custom functions
function passwordConfirmValidator(val) {
  return val === this.password;
}

function requiredValidator() {
  return this._required === true;
}

// Schema
const userSchema = mongoose.Schema({
  _required: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: requiredValidator,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: requiredValidator,
    trim: true,
    lowercase: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: requiredValidator,
    minLength: 8,
    maxLength: 60,
    // select: false
  },
  passwordConfirm: {
    type: String,
    required: requiredValidator,
    minLength: 8,
    maxLength: 60,
    validate: [
      passwordConfirmValidator,
      'Passwords do not match. Please try again.',
    ],
  },
  photo: {
    type: String,
    default: 'userImageDefault.jpg',
  },
  role: {
    type: String,
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // Doesn't need to be saved to DB;
    next()
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
