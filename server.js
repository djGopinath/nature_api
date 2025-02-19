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
const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
