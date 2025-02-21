const mongoose = require('mongoose');

//  Schema Genertion 
const tourSchema=new mongoose.Schema({
    name:{
      type: 'string',
      required:[true,'A tour must have a name'],
      unique:true
    },
    rating:{
      type: Number,
      min:1,
      max:5,
      default: 4.5
    },
    price:{
      type: Number,
      required:[true,'A tour must have a price'],
    }
  });
  
  //Model generation
  const Tour=mongoose.model('Tour',tourSchema);

  module.exports=Tour;