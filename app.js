const express = require('express');
const morgan = require('morgan');

const tourRouter=require('./routes/tourRoute');
const userRouter=require('./routes/userRoute');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
//middleware
app.use((req, res, next) => {
  console.log('Middleware: Request received');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});


app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

module.exports = app;
