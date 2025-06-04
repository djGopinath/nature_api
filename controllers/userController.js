const User=require('./../models/userModel');
const APIFeatures=require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError =require('../utils/appError')

exports.getAllUsers =catchAsync(async (req, res,next) => {
   const users = await User.find();
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  });
  exports.createUser = (req, res) => {
    res
      .status(500)
      .json({ status: 'Error', message: 'This Route is not yet defined!' });
  };
  exports.getUserById = (req, res) => {
    res
      .status(500)
      .json({ status: 'Error', message: 'This Route is not yet defined!' });
  };
  exports.updateUser = (req, res) => {
    res
      .status(500)
      .json({ status: 'Error', message: 'This Route is not yet defined!' });
  };
  exports.deleteUser = (req, res) => {
    res
      .status(500)
      .json({ status: 'Error', message: 'This Route is not yet defined!' });
  };