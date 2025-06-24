const express = require('express');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit')
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');

const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController')
const tourRouter=require('./routes/tourRoute');
const userRouter=require('./routes/userRoute');
const reviewRouter=require('./routes/reviewRoute');


const app = express();
// set security HTTP Headers
app.use(helmet());

//developing Logging
if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev'));
}


// limit request form same API 
const limiter=rateLimit({
  max:100,
  windows:60*60*1000,
  message:'Too many request from this IP, Please try again later'
}) 
app.use('/api',limiter);

//Body parser, reading  data form body into req.body
app.use(express.json({limit:'10kb'}));

//Data sanitization against NoSQL  query injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
  whitelist:['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}));

// Serving static Files
app.use(express.static(`${__dirname}/public`));

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);

//To handled unhandled routes
app.all('*',(req,res,next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this Server!`,400));
})

app.use(globalErrorHandler)

module.exports = app;
