const mongoose = require('mongoose');
const validate = require('validator');

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

module.exports = mongoose.model('Users', userSchema);
