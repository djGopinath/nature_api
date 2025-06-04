const handleCastError=err=>{
  const message=`Invalid ${err.path}:${err.value}.`
  return new AppError(message,400)
}

const handleDuplicateFieldError = (err) => {
  const value = err.errmsg.match(/(["'])(.*?[^\\])\1/)[0];
  const message = `Duplicate field value : ${value}. Please use another value!`;
  return new AppError(message, 400);
};


const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((ele) => ele.message);
  const message = `Invalid Input Data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendDevErr=(err,res)=>{
  res.status(err.statusCode).json({
    status:err.status,
    error:err,
    message:err.message,
    stack:err.stack
  })
}

const sendProdErr=(err,res)=>{
  if(err.isOperational){
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
      })
  }else{
     res.status(500).json({
        status:'Error',
        message:'Something Went Wrong!.'
      })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevErr(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldError(error);
    if (error.name === 'ValidatorError') error = handleValidationErrorDB(error);
    // if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    // if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendProdErr(error, res);
  }
};
