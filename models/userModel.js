const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'Please tell us your name'],
    trim: true
  },
  email: {
    type: 'string',
    required: [true, 'Please provide  your Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid Email']
  },
  photo: String,
  password: {
    type: 'string',
    required: [true, 'Please provide your Password'],
    maxlength: 8,
    select: false
  },
  passwordConfirm: {
    type: 'string',
    required: [true, 'Please provide your confirm Password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password are not same'
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
