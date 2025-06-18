const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeature = require('../utils/apiFeatures');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email and password!', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

// protected route
exports.protect = catchAsync(async (req, res, next) => {
  //Getting token and check it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged In! please login to get access.', 401)
    );
  }
  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'the user belonging to this token does no longer exist.',
        401
      )
    );
  }
  //check if user changed password if token was issue.
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed Password! Please login again', 401)
    );
  }
  req.user = currentUser;
  next();
});

//Role and permissions
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You dont have permisson to perform this action', 403)
      );
    }
    next();
  };
};

//forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1)Get user based on  posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user email with address.', 404));
  }
  //generate random reset token
  const resetToken = user.creatPasswordResetToken();
  console.log('resetToken', resetToken);
  await user.save({ validateBeforeSave: false });
  //send it's to user email

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password  and passwordConfirm to :${resetURL}.\n if you didn't forgot your password, please ignore this email `;
  try {
    await sendEmail({
      email: user.email,
      subject: `Your Password reset token (valid for 10 minutes)`,
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    console.log(err)
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('there was an error sending email, Try again later!'),
      500
    );
  }
});
//reset password
exports.resetPassword = catchAsync(async (req, res, next) => {});
