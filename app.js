const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// read local files
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//routes
//get Request
app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', total_records: tours.length, data: { tours } });
});

//get Request with params
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params)
  const id=req.params.id*1;
  const tour = tours.find((res) => res.id === id);
  if(!tour){
    return res.status(404).json({status: 'fail', message: 'Tour not found'});
  }

  res.status(200)
     .json({ status: 'success', 
       data: { tour }
     });
});

//post request
app.post('/api/v1/tours', (req, res) => {

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err=> {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
