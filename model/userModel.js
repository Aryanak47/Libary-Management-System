const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'User must have name'],
  },
  email: {
    type: String,
    required: [true, 'User must have email'],
    lowercase: true,
    unique: true,
    validate: [validate.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'User must have password'],
    min: [8, 'Password must be longer than length of 8'],
    select: false,
  },
  changePasswordAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.changePasswordAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 11);
  this.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (candidatePw, userPw) {
  return await bcrypt.compare(candidatePw, userPw);
};
userSchema.methods.checkChangePassword = function (issueDate) {
  if (this.changePasswordAt) {
    const currentTime = parseInt(this.changePasswordAt / 1000, 10);
    return issueDate < currentTime;
  }
  return false;
};

module.exports = mongoose.model('Users', userSchema);
