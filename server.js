const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', () => {
  process.exit(1);
});
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//db Configuration
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Connected to MongoDB');
  });

const port = process.env.port || 3000;

//Server
const server = app.listen(port, () => {
  console.log('Server listening on port', port);
});


process.on('unhandledRejection', () => {
  server.close(() => {
    process.exit(1);
  });
});
