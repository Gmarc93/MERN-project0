const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

// Custom validation functions:
function passwordConfirmValidator(val) {
  return val === this.password;
}

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 12,
    // select: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 12,
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
