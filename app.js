const express = require('express');
const morgan = require('morgan');
const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController')
const tourRouter=require('./routes/tourRoute');
const userRouter=require('./routes/userRoute');

const app = express();

if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

//To handled unhandled routes
app.all('*',(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this Server!`,400));
})

app.use(globalErrorHandler)

module.exports = app;
