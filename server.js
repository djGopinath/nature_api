const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//db Configuration
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndexes: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Connected to MongoDB');
  });

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

//Create and Save a new Tour
const newTour=new Tour({
  name: 'The Park camper',
  price: 499,
});
newTour.save().then(doc => console.log(doc)).catch(err => console.error("Couldn't save 👌"));
const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
