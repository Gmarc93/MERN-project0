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
    require: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 12,
    // select: false
  },
  passwordConfirm: {
    type: String,
    minLength: 8,
    maxLength: 12,
    validate: [
      passwordConfirmValidator,
      'Passwords do not match. Please try again.',
    ],
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  photo: {
    type: String,
    default: 'userImageDefault.jpg',
  },
  role: {
    type: String,
    default: 'user',
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;

  this.passwordChangedAt = Date.now();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
