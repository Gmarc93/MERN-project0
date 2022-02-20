'use strict';

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

function removeFields(doc, res, options) {
  delete res._required;
  delete res._id;
  delete res.__v;
  delete res.password;
  delete res.role;
}

// Schema
const userSchema = mongoose.Schema(
  {
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
    passwordReset: String,
    passwordResetExpiresIn: Date,
    passwordChangedAt: Date,
    photo: {
      type: String,
      default: 'userImageDefault.jpg',
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  {
    toJSON: {virtuals: true, transform: removeFields},
    toObject: {virtuals: true, transform: removeFields},
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // Doesn't need to be saved to DB;
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return;

  this.passwordChangedAt = Date.now();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
