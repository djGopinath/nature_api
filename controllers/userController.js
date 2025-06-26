const User=require('./../models/userModel');
const APIFeatures=require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory=require('../controllers/handlerFactory');

const AppError =require('../utils/appError')


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
  exports.createUser = (req, res) => {
    res
      .status(500)
      .json({ status: 'Error', message: 'This Route is not defined! please use /signup instead' });
  };

  exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
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
  exports.getAllUsers = factory.getAll(User);
  exports.getUserById = factory.getOne(User);
  //Do Not update the passwords with this
  exports.updateUser = factory.updateOne(User);
  exports.deleteUser=factory.deleteOne(User);
