const mongoose = require('mongoose');
const validator = require('validator');

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

const User = mongoose.model('User', userSchema);

module.exports = User;
