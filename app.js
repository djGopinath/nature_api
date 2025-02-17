const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
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

// read local files
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
const getAllTours = (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      requestedAt: req.requestTime,
      total_records: tours.length,
      data: { tours },
    });
};
const getTourById = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((res) => res.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }

  res.status(200).json({ status: 'success', data: { tour } });
};
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({ status: 'success', data: `<Updated tour here...>` });
};
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(204).json({ status: 'success', data: null });
};

const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This Route is not yet defined!' });
};
const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This Route is not yet defined!' });
};
const getUserById = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This Route is not yet defined!' });
};
const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This Route is not yet defined!' });
};
const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: 'This Route is not yet defined!' });
};

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
