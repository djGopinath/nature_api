const User=require('./../models/userModel');
const APIFeatures=require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError =require('../utils/appError')


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
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

  exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. please use /updatePassword,',
          400
        )
      );
    }

    // filtered out unwanted fields names  that are not allowed to br updated
   const filterBody=filterObj(req.body,'name','email')

   // update user document
   const updateUser=await User.findByIdAndUpdate(req.user.id,filterBody,{
      new:true,
      runValidators:true
    });

    res.status(200).json({
      status: 'success',
      data:{
        user:updateUser
      }
    });
  });

  exports.deleteMe=catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false})
    res.status(204).json({
      status:'success',
      data:null
    })
  })
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